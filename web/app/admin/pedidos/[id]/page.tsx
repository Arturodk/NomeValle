import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import styles from '@/app/admin/page.module.css';
import { OrderStatusSelector } from './OrderStatusSelector';
import Link from 'next/link';

export default async function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        subtotal,
        customization,
        products ( name )
      )
    `)
    .eq('id', id)
    .single();

  if (error || !order) {
    notFound();
  }

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Link href="/admin/pedidos" style={{ color: '#6b7280', textDecoration: 'none' }}>
          ← Volver
        </Link>
        <h1 className={styles.title} style={{ marginBottom: 0 }}>Pedido #{order.id.slice(0, 8).toUpperCase()}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
            <h2 className={styles.sectionTitle}>Ítems del Pedido</h2>
            <table className={styles.table} style={{ border: 'none' }}>
              <thead>
                <tr>
                  <th style={{ background: 'transparent', paddingLeft: 0 }}>Producto</th>
                  <th style={{ background: 'transparent' }}>Cant.</th>
                  <th style={{ background: 'transparent' }}>Precio unit.</th>
                  <th style={{ background: 'transparent', paddingRight: 0, textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item: any) => (
                  <tr key={item.id}>
                    <td style={{ paddingLeft: 0 }}>
                      <div style={{ fontWeight: 500 }}>{item.products?.name || 'Producto Desconocido'}</div>
                      {item.customization && (
                        <div style={{ fontSize: '13px', color: 'var(--color-primary)', marginTop: '4px' }}>
                          Personalización: <strong>{item.customization}</strong>
                        </div>
                      )}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.unit_price)}</td>
                    <td style={{ paddingRight: 0, textAlign: 'right', fontWeight: 500 }}>
                      {formatPrice(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '250px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#6b7280' }}>Subtotal</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ color: '#6b7280' }}>Envío</span>
                  <span>Gratis</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px' }}>
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
            <h2 className={styles.sectionTitle}>Estado del Pedido</h2>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Fecha de creación</p>
              <p style={{ fontWeight: 500 }}>{formatDate(order.created_at)}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Estado actual</p>
              <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
            </div>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h2 className={styles.sectionTitle}>Cliente y Envío</h2>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Cliente</p>
              <p style={{ fontWeight: 500 }}>{order.shipping_name || 'No registrado'}</p>
              {order.shipping_email && <p style={{ fontSize: '14px' }}>{order.shipping_email}</p>}
              <p style={{ fontSize: '14px' }}>{order.shipping_phone || 'Sin teléfono'}</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Dirección de Envío</p>
              <p style={{ fontWeight: 500 }}>{order.shipping_name}</p>
              <p style={{ fontSize: '14px', whiteSpace: 'pre-line' }}>{order.shipping_address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
