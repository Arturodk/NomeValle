import { DollarSign, ShoppingBag, Package, Activity } from 'lucide-react';
import styles from './page.module.css';
import { createClient } from '@/utils/supabase/server';
import { AdminMetricCard } from '@/components/admin/AdminMetricCard';
import { AdminRecentOrders } from '@/components/admin/AdminRecentOrders';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  // Total de pedidos del día
  const { count: pedidosDelDiaCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayStr);

  const pedidosDelDia = pedidosDelDiaCount || 0;

  // Pedidos pendientes
  const { count: pedidosPendientesCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pendiente');

  const pedidosPendientes = pedidosPendientesCount || 0;

  // Ingresos del día
  const { data: ingresosData } = await supabase
    .from('orders')
    .select('total')
    .gte('created_at', todayStr)
    .neq('status', 'cancelado');
    
  const ingresosDelDia = ingresosData?.reduce((acc, order) => acc + order.total, 0) || 0;

  // Productos con stock bajo
  const { count: stockBajoCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .lt('stock', 5)
    .eq('is_active', true);

  const stockBajo = stockBajoCount || 0;

  // Últimos 5 pedidos
  const { data: ultimosPedidos } = await supabase
    .from('orders')
    .select('id, shipping_name, created_at, status, total')
    .order('created_at', { ascending: false })
    .limit(5);

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
      <h1 className={styles.title}>Panel de Control</h1>
      
      <div className={styles.statsGrid}>
        <AdminMetricCard
          title="Ingresos Hoy"
          value={formatPrice(ingresosDelDia)}
          trend="Calculado desde las 00:00"
          icon={<DollarSign size={20} />}
        />
        <AdminMetricCard
          title="Pedidos Hoy"
          value={pedidosDelDia}
          trend={`${pedidosPendientes} pendientes en total`}
          icon={<ShoppingBag size={20} />}
        />
        <AdminMetricCard
          title="Alertas de Stock"
          value={stockBajo}
          trend="Productos con < 5 unidades"
          icon={<Package size={20} />}
        />
        <AdminMetricCard
          title="Estado Operativo"
          value="Activo"
          icon={<Activity size={20} />}
        />
      </div>

      <AdminRecentOrders orders={ultimosPedidos || []} />
    </div>
  );
}
