import styles from '@/app/admin/page.module.css';

interface Order {
  id: string;
  shipping_name: string;
  created_at: string | null;
  status: string;
  total: number;
}

interface AdminRecentOrdersProps {
  orders: Order[];
}

export function AdminRecentOrders({ orders }: AdminRecentOrdersProps) {
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
      day: '2-digit'
    }).format(new Date(dateString));
  };

  return (
    <div className={styles.recentOrders}>
      <h2 className={styles.sectionTitle}>Últimos pedidos</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>No hay pedidos recientes</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td>{order.shipping_name}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{formatPrice(order.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
