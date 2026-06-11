import { Resend } from 'resend';

// Inicializar el cliente de Resend si la clave API existe
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@chessweb3.com';
const adminEmail = process.env.ADMIN_EMAIL || 'arturoduque@implementaiasolution.com';

// Helper para dar formato a precios en COP
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
};

interface OrderItem {
  quantity: number;
  unit_price: number;
  subtotal: number;
  customization?: string | null;
  products?: {
    name: string;
    material: string;
  } | null;
}

interface OrderData {
  id: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  total: number;
  wompi_transaction_id?: string | null;
}

/**
 * Genera el cuerpo HTML común con diseño de NomeValle
 */
function getEmailTemplate(contentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nomenclaturas del Valle</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #F4F6F9;
          color: #111827;
          margin: 0;
          padding: 0;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid #E5E7EB;
        }
        .header {
          background-color: #1A3C5E;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 0.5px;
        }
        .header p {
          color: #C8860A;
          margin: 5px 0 0 0;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .content {
          padding: 30px 25px;
        }
        .footer {
          background-color: #F4F6F9;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6B7280;
          border-top: 1px solid #E5E7EB;
        }
        .btn {
          display: inline-block;
          background-color: #1A3C5E;
          color: #ffffff !important;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          margin: 20px 0;
        }
        .order-details-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .order-details-table th {
          background-color: #F4F6F9;
          color: #6B7280;
          text-align: left;
          padding: 10px;
          font-size: 12px;
          text-transform: uppercase;
          border-bottom: 1px solid #E5E7EB;
        }
        .order-details-table td {
          padding: 12px 10px;
          border-bottom: 1px solid #E5E7EB;
          font-size: 14px;
        }
        .customization-text {
          font-size: 12px;
          color: #C8860A;
          margin-top: 4px;
        }
        .total-row {
          font-weight: bold;
          background-color: #F9FAFB;
        }
        .total-row td {
          border-top: 2px solid #1A3C5E;
          font-size: 16px;
        }
        .info-card {
          background-color: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }
        .info-card-title {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 8px;
          color: #1A3C5E;
        }
        .info-card p {
          margin: 4px 0;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nomenclaturas del Valle</h1>
          <p>Exclusividad en tu Fachada</p>
        </div>
        <div class="content">
          ${contentHtml}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Nomenclaturas del Valle. Todos los derechos reservados.</p>
          <p>Valle del Cauca, Colombia</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Envía el correo de confirmación de compra al cliente
 */
export async function sendOrderConfirmationEmail(
  toEmail: string,
  order: OrderData,
  items: OrderItem[]
) {
  if (!resend) {
    console.warn('⚠️ Resend no está configurado (falta RESEND_API_KEY). Saltando envío de correo al cliente.');
    return { success: false, error: 'Resend no inicializado' };
  }

  try {
    let itemsTableRows = '';
    items.forEach((item) => {
      const productName = item.products?.name || 'Placa de Nomenclatura';
      const material = item.products?.material || 'Metálico';
      const customizationHtml = item.customization
        ? `<div class="customization-text">Texto: <strong>${item.customization}</strong></div>`
        : '';

      itemsTableRows += `
        <tr>
          <td>
            <strong>${productName}</strong> (${material})
            ${customizationHtml}
          </td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${formatPrice(item.unit_price)}</td>
          <td style="text-align: right;">${formatPrice(item.subtotal)}</td>
        </tr>
      `;
    });

    const contentHtml = `
      <h2 style="color: #1A3C5E; margin-top: 0;">¡Muchas gracias por tu compra!</h2>
      <p>Hola <strong>${order.shipping_name}</strong>,</p>
      <p>Hemos recibido el pago de tu pedido de forma satisfactoria. Nuestro equipo en el Valle del Cauca comenzará con la fabricación personalizada de tu placa de nomenclatura.</p>
      
      <div class="info-card">
        <div class="info-card-title">Detalles de Envío</div>
        <p><strong>Dirección:</strong> ${order.shipping_address}</p>
        <p><strong>Teléfono:</strong> ${order.shipping_phone}</p>
        <p><strong>Estado del Pedido:</strong> Pagado / En Fabricación</p>
      </div>

      <h3 style="color: #1A3C5E; font-size: 16px; margin-top: 25px;">Resumen del Pedido</h3>
      <table class="order-details-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th style="text-align: center;">Cant.</th>
            <th style="text-align: right;">Precio</th>
            <th style="text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsTableRows}
          <tr class="total-row">
            <td colspan="3" style="text-align: right; padding-right: 10px;">Total Pagado:</td>
            <td style="text-align: right;">${formatPrice(order.total)}</td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top: 20px;">Una vez que enviemos tu pedido, te notificaremos por este medio con los detalles del envío y el número de guía para que puedas rastrearlo.</p>
      
      <p>Si tienes alguna pregunta sobre la personalización o el estado de tu placa, no dudes en responder a este correo o contactarnos vía WhatsApp.</p>
    `;

    const html = getEmailTemplate(contentHtml);

    console.log(`✉️ Enviando correo de confirmación de compra a: ${toEmail}`);
    const data = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `¡Confirmación de Pago! Pedido #${order.id.slice(0, 8).toUpperCase()}`,
      html: html,
    });

    console.log('✅ Correo de confirmación enviado exitosamente:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Error enviando correo de confirmación al cliente:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envía la notificación de un nuevo pedido pagado al administrador
 */
export async function sendAdminNotificationEmail(
  order: OrderData,
  items: OrderItem[]
) {
  if (!resend) {
    console.warn('⚠️ Resend no está configurado (falta RESEND_API_KEY). Saltando envío de correo al administrador.');
    return { success: false, error: 'Resend no inicializado' };
  }

  try {
    let itemsTableRows = '';
    items.forEach((item) => {
      const productName = item.products?.name || 'Placa de Nomenclatura';
      const material = item.products?.material || 'Metálico';
      const customizationHtml = item.customization
        ? `<div class="customization-text">Texto a fabricar: <strong>${item.customization}</strong></div>`
        : '';

      itemsTableRows += `
        <tr>
          <td>
            <strong>${productName}</strong> (${material})
            ${customizationHtml}
          </td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${formatPrice(item.subtotal)}</td>
        </tr>
      `;
    });

    const contentHtml = `
      <h2 style="color: #DC2626; margin-top: 0;">🚨 ¡Nuevo Pedido Pagado!</h2>
      <p>Hola Administrador,</p>
      <p>Se ha confirmado el pago de un nuevo pedido en la tienda. La transacción ha sido aprobada por Wompi y el pedido ya está en estado <strong>pagado</strong>. Es momento de programar su fabricación.</p>
      
      <div class="info-card">
        <div class="info-card-title">Datos del Cliente y Envío</div>
        <p><strong>Nombre:</strong> ${order.shipping_name}</p>
        <p><strong>Teléfono:</strong> ${order.shipping_phone}</p>
        <p><strong>Dirección de Entrega:</strong> ${order.shipping_address}</p>
        <p><strong>ID Pedido (Completo):</strong> ${order.id}</p>
        <p><strong>ID Transacción Wompi:</strong> ${order.wompi_transaction_id || 'N/A'}</p>
      </div>

      <h3 style="color: #1A3C5E; font-size: 16px; margin-top: 25px;">Detalles de los Productos a Fabricar</h3>
      <table class="order-details-table">
        <thead>
          <tr>
            <th>Producto & Personalización</th>
            <th style="text-align: center;">Cant.</th>
            <th style="text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsTableRows}
          <tr class="total-row">
            <td colspan="2" style="text-align: right; padding-right: 10px;">Total Recibido:</td>
            <td style="text-align: right;">${formatPrice(order.total)}</td>
          </tr>
        </tbody>
      </table>

      <p style="margin-top: 20px;">Puedes gestionar los detalles completos y actualizar el estado a "Enviado" en el <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/pedidos/${order.id}" style="color: #1A3C5E; font-weight: bold; text-decoration: underline;">Panel de Administración</a>.</p>
    `;

    const html = getEmailTemplate(contentHtml);

    console.log(`✉️ Enviando correo de alerta de administración a: ${adminEmail}`);
    const data = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `🚨 NUEVA VENTA: Pedido #${order.id.slice(0, 8).toUpperCase()}`,
      html: html,
    });

    console.log('✅ Correo de alerta de administración enviado exitosamente:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Error enviando correo de alerta al administrador:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Procesa y envía todos los correos relacionados con un pedido pagado
 * (Tanto al cliente como al administrador)
 */
export async function processOrderEmails(orderId: string, adminSupabase: any) {
  try {
    console.log(`✉️ Iniciando proceso de envío de correos para el pedido ${orderId}...`);
    
    // 1. Obtener la información completa de la orden
    const { data: fullOrder, error: orderQueryError } = await adminSupabase
      .from('orders')
      .select('id, user_id, total, shipping_name, shipping_phone, shipping_address, wompi_transaction_id')
      .eq('id', orderId)
      .single();

    if (orderQueryError || !fullOrder) {
      console.error('❌ Error al obtener los datos detallados de la orden para enviar correo:', orderQueryError);
      return;
    }

    // 2. Obtener los ítems de la orden y sus productos asociados
    const { data: items, error: itemsQueryError } = await adminSupabase
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
      return;
    }

    // 3. Obtener el email del cliente
    let customerEmail = '';

    // Intentar obtener el email directamente de la transacción de Wompi primero
    if (fullOrder.wompi_transaction_id) {
      try {
        const isProduction = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY?.startsWith('pub_prod_');
        const baseUrl = isProduction 
          ? 'https://production.wompi.co/v1' 
          : 'https://sandbox.wompi.co/v1';
        const wompiUrl = `${baseUrl}/transactions/${fullOrder.wompi_transaction_id}`;
        
        const wompiResponse = await fetch(wompiUrl);
        if (wompiResponse.ok) {
          const responseData = await wompiResponse.json();
          if (responseData?.data?.customer_email) {
            customerEmail = responseData.data.customer_email;
            console.log(`✅ Email obtenido de la transacción Wompi: ${customerEmail}`);
          }
        }
      } catch (wompiEmailError) {
        console.error('⚠️ Error al consultar el email en la transacción de Wompi:', wompiEmailError);
      }
    }

    // Fallback al email del usuario de Supabase Auth
    if (!customerEmail && fullOrder.user_id) {
      const { data: userData, error: userError } = await adminSupabase.auth.admin.getUserById(fullOrder.user_id);
      if (userError || !userData?.user) {
        console.warn(`⚠️ No se pudo obtener el usuario de Auth para user_id: ${fullOrder.user_id}`, userError);
      } else {
        customerEmail = userData.user.email || '';
        console.log(`ℹ️ Usando email de Supabase Auth: ${customerEmail}`);
      }
    }

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
  } catch (mailError) {
    console.error('❌ Error general en la tarea de envío de correos:', mailError);
  }
}

