import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const transactionId = params.id;

  try {
    // 1. Consultar a Wompi el estado de la transacción
    // Usamos sandbox o producción según el prefijo o config
    const isTest = transactionId.includes('test'); 
    const wompiUrl = `https://${isTest ? 'sandbox' : 'production'}.wompi.co/v1/transactions/${transactionId}`;
    
    const wompiResponse = await fetch(wompiUrl);
    const { data } = await wompiResponse.json();

    if (!data) {
      return NextResponse.json({ error: 'Transacción no encontrada en Wompi' }, { status: 404 });
    }

    const { status, reference } = data;

    // 2. Si el pago fue aprobado, actualizamos el pedido en Supabase
    if (status === 'APPROVED') {
      const supabase = await createClient();
      
      const { error: updateError } = await supabase
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
