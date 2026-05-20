'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, LogOut, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import styles from './layout.module.css';

export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }
      setLoading(false);
    };

    getData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/auth/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className={styles.userName}>{profile?.full_name || 'Usuario'}</p>
              <p className={styles.userEmail}>{user?.email}</p>
            </div>
          </div>
          <nav className={styles.nav}>
            <Link href="/cuenta" className={styles.navLink}>
              <User size={18} /> Mi Perfil
            </Link>
            <Link href="/cuenta/pedidos" className={styles.navLink}>
              <Package size={18} /> Mis Pedidos
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <LogOut size={18} /> Cerrar sesión
            </button>
          </nav>
        </aside>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
