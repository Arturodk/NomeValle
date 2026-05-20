import { createClient } from '@/utils/supabase/server';
import ProductsClient from './ProductsClient';
import type { ProductWithImages } from '@/types/supabase';
import styles from './page.module.css';

export default async function ProductosPage() {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      product_images (
        id,
        url,
        is_primary,
        sort_order
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>Nuestros Productos</h1>
        <p className={styles.subtitle}>
          Encuentra la nomenclatura perfecta para tu hogar. Filtra por material y elige la que más te guste.
        </p>
      </div>

      <ProductsClient initialProducts={(products as ProductWithImages[]) || []} />
    </div>
  );
}
