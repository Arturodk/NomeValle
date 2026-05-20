'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, getMaterialLabel } from '@/lib/mock-data';
import type { ProductWithImages } from '@/types/supabase';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }: { product: ProductWithImages }) {
  // Manejo seguro por si no hay imágenes o el array está vacío
  const images = product.product_images || [];
  const primaryImage = images.find(i => i.is_primary) || images[0] || { url: 'https://placehold.co/400x400/eeeeee/333333.png?text=Sin+Imagen' };

  return (
    <Link href={`/productos/${product.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={primaryImage.url}
          alt={product.name}
          width={400}
          height={400}
          className={styles.image}
          priority
        />
        <span className={styles.materialBadge}>{getMaterialLabel(product.material)}</span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
