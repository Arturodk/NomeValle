'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const supabase = await createClient();

  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) {
    return { success: false, error: 'Pedido no encontrado' };
  }

  // Validaciones de transición (opcional pero recomendado)
  const currentStatus = order.status;
  const validTransitions: Record<string, string[]> = {
    'pendiente': ['pagado', 'cancelado'],
    'pagado': ['enviado', 'cancelado'],
    'enviado': ['entregado', 'cancelado'],
    'entregado': [],
    'cancelado': []
  };

  if (!validTransitions[currentStatus]?.includes(newStatus)) {
    return { success: false, error: `Transición inválida: ${currentStatus} -> ${newStatus}` };
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath('/admin/pedidos');
  revalidatePath('/admin');
  
  return { success: true };
}
