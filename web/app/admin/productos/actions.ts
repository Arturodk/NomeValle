'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleProductStatus(id: string, currentStatus: boolean | null) {
  const supabase = await createClient();

  const newStatus = !currentStatus;

  const { error } = await supabase
    .from('products')
    .update({ is_active: newStatus })
    .eq('id', id);

  if (error) {
    console.error('Error toggling product status:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/productos');
  revalidatePath('/productos');
  
  return { success: true, is_active: newStatus };
}
