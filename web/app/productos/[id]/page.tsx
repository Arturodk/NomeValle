import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import ProductDetailClient from './ProductDetailClient';
import type { ProductWithImages } from '@/types/supabase';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from('products')
    .select(`*, product_images(url, is_primary)`)
    .eq('id', id)
    .single();

  if (!product) {
    return {
      title: 'Producto no encontrado | Nomenclaturas del Valle'
    };
  }

  const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.url || '';
  
  // Determinar la URL base. En dev usa localhost, en prod debería usar la URL real.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  
  const ogUrl = new URL('/api/og', baseUrl);
  ogUrl.searchParams.set('title', product.name);
  if (product.price) ogUrl.searchParams.set('price', product.price.toString());
  if (primaryImage) ogUrl.searchParams.set('image', primaryImage);

  const description = product.description || `Adquiere ${product.name} en Nomenclaturas del Valle. Fabricación artesanal en metal, bronce y aluminio.`;

  return {
    title: `${product.name} | Nomenclaturas del Valle`,
    description: description,
    openGraph: {
      title: `${product.name} | Nomenclaturas del Valle`,
      description: description,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Nomenclaturas del Valle`,
      description: description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  
  const { data: product } = await supabase
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
    .eq('id', id)
    .single();

  let companionPrice = 0;
  let companionName = '';
  if (product?.is_nomenclature && product.letter_product_id) {
    const { data: companionProduct } = await supabase
      .from('products')
      .select('price, name')
      .eq('id', product.letter_product_id)
      .single();
    if (companionProduct) {
      companionPrice = companionProduct.price;
      companionName = companionProduct.name;
    }
  }

  if (product && product.product_images) {
    product.product_images.sort((a: any, b: any) => {
      if (a.is_primary) return -1;
      if (b.is_primary) return 1;
      return 0;
    });
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h1>Producto no encontrado</h1>
        <p style={{ color: 'var(--color-gray-text)', marginTop: 8 }}>El producto que buscas no existe o fue eliminado.</p>
        <Link href="/productos" className="btn btn-primary" style={{ marginTop: 24 }}>
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const primaryImage = product.product_images?.[0]?.url || '';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  // Schema.org JSON-LD para Google (Rich Snippets)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: primaryImage,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Nomenclaturas del Valle'
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/productos/${product.id}`,
      priceCurrency: 'COP',
      price: product.price,
      // Se marca como PreOrder para indicar que es bajo pedido
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/PreOrder'
    }
  };

  return (
    <>
      {/* Inyección segura del script JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product as ProductWithImages} companionPrice={companionPrice} companionName={companionName} />
    </>
  );
}
