import { createClient } from '@/utils/supabase/server';
import type { ProductWithImages } from '@/types/supabase';
import HomeClient from './HomeClient';

export default async function Home() {
  const supabase = await createClient();
  const { data: featuredProducts } = await supabase
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
    .order('created_at', { ascending: false })
    .limit(4);

  return <HomeClient featuredProducts={featuredProducts as ProductWithImages[] || []} />;
}

