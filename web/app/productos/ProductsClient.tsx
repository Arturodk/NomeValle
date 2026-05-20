'use client';

import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { getMaterialLabel } from '@/lib/mock-data';
import type { ProductWithImages } from '@/types/supabase';
import styles from './page.module.css';

const materials = ['todos', 'metálico', 'acrílico', 'bronce', 'aluminio'] as const;

export default function ProductsClient({ initialProducts }: { initialProducts: ProductWithImages[] }) {
  const [activeFilter, setActiveFilter] = useState<string>('todos');

  const filtered = activeFilter === 'todos'
    ? initialProducts
    : initialProducts.filter(p => p.material === activeFilter);

  return (
    <>
      <div className={styles.filters}>
        {materials.map(mat => (
          <button
            key={mat}
            className={`${styles.filterBtn} ${activeFilter === mat ? styles.filterActive : ''}`}
            onClick={() => setActiveFilter(mat)}
          >
            {mat === 'todos' ? 'Todos' : getMaterialLabel(mat)}
          </button>
        ))}
      </div>

      <div className={styles.results}>
        <span className={styles.count}>{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay productos disponibles con este filtro.</p>
        </div>
      ) : (
        <div className="grid-products">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
