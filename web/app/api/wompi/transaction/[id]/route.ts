import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const transactionId = params.id;

  try {
    // 1. Validar sesión del usuario autenticado en Supabase
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Consultar a Wompi el estado de la transacción
    // Usamos la llave pública de Wompi para determinar si estamos en producción o sandbox
    const isProduction = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY?.startsWith('pub_prod_');
    const baseUrl = isProduction 
      ? 'https://production.wompi.co/v1' 
      : 'https://sandbox.wompi.co/v1';
    const wompiUrl = `${baseUrl}/transactions/${transactionId}`;
    
    const wompiResponse = await fetch(wompiUrl);
    const responseData = await wompiResponse.json();

    if (!responseData || !responseData.data) {
      return NextResponse.json({ error: 'Transacción no encontrada en Wompi' }, { status: 404 });
    }

    const { data } = responseData;
    const { status, reference } = data;

    // 3. Verificar que el pedido exista y pertenezca al usuario de la sesión
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('user_id, status')
      .eq('id', reference)
      .single();

    if (orderError || !order) {
      console.error(`Error buscando orden ${reference} para verificación:`, orderError);
      return NextResponse.json({ error: 'Pedido no encontrado o no autorizado' }, { status: 404 });
    }

    if (order.user_id !== user.id) {
      return NextResponse.json({ error: 'No tienes permisos para acceder a esta transacción' }, { status: 403 });
    }

    // 4. Si el pago fue aprobado, actualizamos el pedido en Supabase (usando cliente admin)
    if (status === 'APPROVED' && order.status !== 'pagado') {
      const adminSupabase = createAdminClient();
      
      const { error: updateError } = await adminSupabase
        .from('orders')
        .update({ 
          status: 'pagado',
          wompi_transaction_id: transactionId 
        })
        .eq('id', reference);

      if (updateError) {
        console.error('Error al actualizar pedido en Supabase:', updateError);
      }
    }

    return NextResponse.json({ 
      status, 
      reference,
      amount: data.amount_in_cents / 100 
    });

  } catch (error) {
    console.error('Error verificando transacción:', error);
    return NextResponse.json({ error: 'Error interno de validación' }, { status: 500 });
  }
}
