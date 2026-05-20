import { createClient } from '@/utils/supabase/server';
import { formatPrice } from '@/lib/mock-data';
import { PackageOpen } from 'lucide-react';
import styles from './page.module.css';

export default async function PedidosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          name
        )
      )
    `)
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      pagado: 'Pagado',
      enviado: 'Enviado',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    };
    return labels[status] || status;
  };

  return (
    <div>
      <h1 className={styles.title}>Mis Pedidos</h1>
      <p className={styles.subtitle}>Historial de tus compras y estado actual.</p>

      {!orders || orders.length === 0 ? (
        <div className={styles.empty}>
          <PackageOpen size={48} color="var(--color-gray-light)" />
          <h3>No tienes pedidos</h3>
          <p>Aún no has realizado ninguna compra.</p>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderId}>Pedido #{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className={styles.orderDate}>
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('es-CO') : ''}
                  </span>
                </div>
                <div className={styles.orderStatusWrapper}>
                  <span className={`${styles.statusBadge} ${styles[`status-${order.status}`]}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>
              
              <div className={styles.orderItems}>
                {order.order_items?.map((item: any, idx: number) => (
                  <div key={idx} className={styles.itemRow}>
                    <span className={styles.itemName}>
                      {item.products?.name || 'Producto'} <span className={styles.itemQty}>x{item.quantity}</span>
                      {item.customization && (
                        <div style={{ fontSize: '13px', color: 'var(--color-primary)', marginTop: '2px' }}>
                          Nomenclatura: {item.customization}
                        </div>
                      )}
                    </span>
                    <span className={styles.itemPrice}>{formatPrice(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.orderFooter}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalAmount}>{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
