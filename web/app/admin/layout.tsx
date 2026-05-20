import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import styles from './layout.module.css';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirectTo=/admin');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/auth/login?error=unauthorized');
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span>Admin</span> NomeValle
        </div>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/admin/pedidos" className={styles.navLink}>
            <ShoppingBag size={18} /> Pedidos
          </Link>
          <Link href="/admin/productos" className={styles.navLink}>
            <Package size={18} /> Productos
          </Link>
          <div className={styles.spacer} />
          <div className={styles.userInfo}>
            <span className={styles.userName}>{profile.full_name ?? user.email}</span>
          </div>
          <Link href="/" className={styles.navLink}>
            <LogOut size={18} /> Salir al sitio
          </Link>
        </nav>
      </aside>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
