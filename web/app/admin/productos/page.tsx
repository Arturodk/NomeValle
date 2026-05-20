import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import styles from '@/app/admin/page.module.css';
import { ToggleStatusButton } from './ToggleStatusButton';

export default async function AdminProductsPage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams?.page === 'string' ? parseInt(searchParams.page) : 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  const { data: products, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const totalPages = count ? Math.ceil(count / limit) : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className={styles.title} style={{ marginBottom: 0 }}>Productos</h1>
        <Link 
          href="/admin/productos/nuevo"
          style={{
            background: 'var(--color-primary)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '14px'
          }}
        >
          + Nuevo Producto
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Material</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!products || products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>No hay productos registrados</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td>{product.material || '-'}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <span style={{ 
                      color: product.stock !== null && product.stock < 5 ? '#dc2626' : 'inherit',
                      fontWeight: product.stock !== null && product.stock < 5 ? 600 : 'normal'
                    }}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    {product.is_active ? (
                      <span className={styles.badgePaid}>Activo</span>
                    ) : (
                      <span className={styles.badgePending} style={{ background: '#f3f4f6', color: '#374151' }}>Inactivo</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link 
                        href={`/admin/productos/${product.id}/editar`}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          border: '1px solid #d1d5db',
                          background: 'white',
                          color: '#374151',
                          textDecoration: 'none',
                          fontSize: '13px'
                        }}
                      >
                        Editar
                      </Link>
                      <ToggleStatusButton id={product.id} isActive={product.is_active} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          {page > 1 && (
            <Link 
              href={`/admin/productos?page=${page - 1}`}
              style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', textDecoration: 'none', color: '#374151' }}
            >
              Anterior
            </Link>
          )}
          <span style={{ padding: '8px 16px', background: '#f3f4f6', borderRadius: '4px' }}>
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link 
              href={`/admin/productos?page=${page + 1}`}
              style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', textDecoration: 'none', color: '#374151' }}
            >
              Siguiente
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
