import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/utils/supabase/admin';

/**
 * Endpoint de Webhook para recibir notificaciones de Wompi.
 * Documentación de firmas Wompi: https://docs.wompi.co/es/co/webhooks
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🔔 Webhook de Wompi recibido:', JSON.stringify(body, null, 2));

    const { event, data, timestamp, signature } = body;

    if (!event || !data || !data.transaction) {
      return NextResponse.json({ error: 'Formato de payload no válido' }, { status: 400 });
    }

    const transaction = data.transaction;
    const { id: transactionId, reference: orderId, status, amount_in_cents } = transaction;

    // --- VALIDACIÓN DE FIRMA ---
    const eventsSecret = process.env.WOMPI_EVENTS_SECRET;

    if (eventsSecret) {
      if (!signature || !signature.properties || !signature.checksum) {
        console.error('❌ Falta información de firma en el webhook');
        return NextResponse.json({ error: 'Falta información de firma' }, { status: 400 });
      }

      try {
        // 1. Obtener los valores de las propiedades indicadas en signature.properties
        // Por lo general, Wompi envía: ["transaction.id", "transaction.status", "transaction.amount_in_cents"]
        const values: string[] = [];
        for (const prop of signature.properties) {
          if (prop === 'transaction.id') values.push(transactionId);
          else if (prop === 'transaction.status') values.push(status);
          else if (prop === 'transaction.amount_in_cents') values.push(String(amount_in_cents));
          else {
            // Resolver propiedad de forma dinámica por si cambian en el futuro
            const propKeys = prop.replace('transaction.', '');
            values.push(String(transaction[propKeys]));
          }
        }

        // 2. Concatenar valores + timestamp + eventsSecret
        const concatenatedString = values.join('') + timestamp + eventsSecret;

        // 3. Generar Hash SHA256
        const calculatedChecksum = crypto
          .createHash('sha256')
          .update(concatenatedString)
          .digest('hex');

        // 4. Comparar firmas
        if (calculatedChecksum !== signature.checksum) {
          console.error('❌ Firma de webhook Wompi no coincide. Posible manipulación.');
          return NextResponse.json({ error: 'Firma no válida' }, { status: 401 });
        }

        console.log('✅ Firma de webhook Wompi verificada con éxito.');
      } catch (sigError) {
        console.error('Error al verificar firma de Wompi:', sigError);
        return NextResponse.json({ error: 'Error procesando la firma' }, { status: 500 });
      }
    } else {
      console.warn(
        '⚠️ Advertencia: WOMPI_EVENTS_SECRET no está configurado en .env.local. Saltando validación de firma para pruebas locales.'
      );
    }

    // --- PROCESAMIENTO DEL ESTADO DE LA TRANSACCIÓN ---
    const supabase = createAdminClient();

    // Validar si el pedido existe antes de actualizar
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
      .single();

    if (findError || !order) {
      console.error(`❌ Pedido ${orderId} no encontrado en la base de datos.`);
      return NextResponse.json({ error: `Pedido ${orderId} no encontrado` }, { status: 404 });
    }

    let newStatus = 'pendiente';
    if (status === 'APPROVED') {
      newStatus = 'pagado';
    } else if (status === 'DECLINED' || status === 'VOIDED' || status === 'ERROR') {
      newStatus = 'cancelado';
    }

    console.log(`🔄 Actualizando pedido ${orderId}: ${order.status} -> ${newStatus}`);

    // Si ya está pagado, no volvemos a procesar
    if (order.status === 'pagado') {
      console.log(`ℹ️ El pedido ${orderId} ya se encuentra marcado como pagado.`);
      return NextResponse.json({ message: 'Pedido ya procesado anteriormente' });
    }

    // Actualizar pedido en la base de datos
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        wompi_transaction_id: transactionId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('❌ Error al actualizar el pedido en Supabase:', updateError);
      return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 });
    }

    console.log(`🎉 Pedido ${orderId} actualizado con éxito a estado: ${newStatus}`);

    // Enviar correos si el pedido se actualizó a 'pagado'
    if (newStatus === 'pagado') {
      try {
        console.log(`✉️ Iniciando proceso de envío de correos para el pedido ${orderId}...`);
        
        // 1. Obtener la información completa de la orden
        const { data: fullOrder, error: orderQueryError } = await supabase
          .from('orders')
          .select('id, user_id, total, shipping_name, shipping_phone, shipping_address, wompi_transaction_id')
          .eq('id', orderId)
          .single();

        if (orderQueryError || !fullOrder) {
          console.error('❌ Error al obtener los datos detallados de la orden para enviar correo:', orderQueryError);
        } else {
          // 2. Obtener los ítems de la orden y sus productos asociados
          const { data: items, error: itemsQueryError } = await supabase
            .from('order_items')
            .select(`
              quantity,
              unit_price,
              subtotal,
              customization,
              products (
                name,
                material
              )
            `)
            .eq('order_id', orderId);

          if (itemsQueryError || !items) {
            console.error('❌ Error al obtener los ítems de la orden para enviar correo:', itemsQueryError);
          } else {
            // 3. Obtener el email del cliente desde Supabase Auth (si tiene user_id)
            let customerEmail = '';
            if (fullOrder.user_id) {
              const { data: userData, error: userError } = await supabase.auth.admin.getUserById(fullOrder.user_id);
              if (userError || !userData?.user) {
                console.warn(`⚠️ No se pudo obtener el usuario de Auth para user_id: ${fullOrder.user_id}`, userError);
              } else {
                customerEmail = userData.user.email || '';
              }
            }

            // Importar dinámicamente el helper de Resend para optimizar recursos
            const { sendOrderConfirmationEmail, sendAdminNotificationEmail } = await import('@/lib/resend');
            
            // Enviar correo al cliente si tiene dirección de correo electrónico
            if (customerEmail) {
              try {
                await sendOrderConfirmationEmail(customerEmail, fullOrder, items as any);
              } catch (custMailErr) {
                console.error('❌ Error al enviar correo de confirmación al cliente:', custMailErr);
              }
            } else {
              console.warn('⚠️ No se encontró el correo del cliente en Supabase Auth. Saltando correo del cliente.');
            }

            // Enviar correo al administrador
            try {
              await sendAdminNotificationEmail(fullOrder, items as any);
            } catch (adminMailErr) {
              console.error('❌ Error al enviar correo de notificación al administrador:', adminMailErr);
            }
          }
        }
      } catch (mailError) {
        console.error('❌ Error general en la tarea de envío de correos:', mailError);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: newStatus,
    });
  } catch (error) {
    console.error('❌ Error general en Webhook de Wompi:', error);
    return NextResponse.json(
      { error: 'Error interno en el procesamiento del webhook' },
      { status: 500 }
    );
  }
}
