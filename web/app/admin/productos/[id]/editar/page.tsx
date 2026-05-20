import { ProductForm } from '@/components/admin/ProductForm';
import styles from '@/app/admin/page.module.css';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function EditarProductoPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  const { data: images } = await supabase
    .from('product_images')
    .select('id, url, is_primary')
    .eq('product_id', id)
    .order('is_primary', { ascending: false });

  const { data: availableProducts } = await supabase
    .from('products')
    .select('id, name')
    .neq('id', id)
    .eq('is_active', true);

  return (
    <div>
      <h1 className={styles.title}>Editar Producto</h1>
      <ProductForm product={product} existingImages={images || []} availableProducts={availableProducts || []} />
    </div>
  );
}
