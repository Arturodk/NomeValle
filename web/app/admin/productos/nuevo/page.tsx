import { ProductForm } from '@/components/admin/ProductForm';
import styles from '@/app/admin/page.module.css';
import { createClient } from '@/utils/supabase/server';

export default async function NuevoProductoPage() {
  const supabase = await createClient();
  const { data: availableProducts } = await supabase
    .from('products')
    .select('id, name')
    .eq('is_active', true);

  return (
    <div>
      <h1 className={styles.title}>Nuevo Producto</h1>
      <ProductForm availableProducts={availableProducts || []} />
    </div>
  );
}
