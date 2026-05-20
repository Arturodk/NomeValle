import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import styles from '@/app/admin/page.module.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminOrdersPage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams?.page === 'string' ? parseInt(searchParams.page) : 1;
  const statusFilter = typeof searchParams?.status === 'string' ? searchParams.status : '';
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (statusFilter && statusFilter !== 'todos') {
    query = query.eq('status', statusFilter);
  }

  const { data: orders, count, error } = await query;
  
  if (error) {
    console.error('Error fetching orders:', error);
  }

  const totalPages = count ? Math.ceil(count / limit) : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <span className={styles.badgePending}>Pendiente</span>;
      case 'pagado':
      case 'enviado':
      case 'entregado':
        return <span className={styles.badgePaid}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
      case 'cancelado':
        return <span className={styles.badgePending} style={{ background: '#fee2e2', color: '#991b1b' }}>Cancelado</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className={styles.title} style={{ marginBottom: 0 }}>Pedidos</h1>
        
        <div>
          <form method="GET" action="/admin/pedidos" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label htmlFor="status" style={{ fontSize: '14px', fontWeight: 500 }}>Filtro:</label>
            <select 
              name="status" 
              id="status" 
              defaultValue={statusFilter || 'todos'}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', background: 'white' }}
            >
              <option value="todos">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
            <button 
              type="submit"
              style={{ padding: '8px 12px', borderRadius: '4px', border: 'none', background: '#f3f4f6', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
            >
              Filtrar
            </button>
          </form>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!orders || orders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>No se encontraron pedidos</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 500 }}>#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td>{order.shipping_name || 'Sin nombre'}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{formatPrice(order.total)}</td>
                  <td>
                    <Link 
                      href={`/admin/pedidos/${order.id}`}
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
                      Ver Detalle
                    </Link>
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
              href={`/admin/pedidos?page=${page - 1}${statusFilter ? `&status=${statusFilter}` : ''}`}
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
              href={`/admin/pedidos?page=${page + 1}${statusFilter ? `&status=${statusFilter}` : ''}`}
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
