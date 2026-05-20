'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { createClient } from '@/utils/supabase/client';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const supabase = createClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { itemCount } = useCart();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>N</span>
          <span className={styles.logoText}>Nomenclaturas del Valle</span>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <Link href="/productos" className={styles.navLink} onClick={() => setMenuOpen(false)}>
            Productos
          </Link>
          <Link href="/contacto" className={styles.navLink} onClick={() => setMenuOpen(false)}>
            Contacto
          </Link>
        </nav>

        <div className={styles.actions}>
          <Link href="/carrito" className={styles.cartBtn} aria-label="Ver carrito" id="header-cart-link">
            <ShoppingCart size={22} />
            {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
          </Link>

          {user ? (
            <div className={styles.userSection}>
              <Link href="/cuenta" className={styles.loginBtn} id="header-account-link">
                <User size={18} />
                <span className={styles.loginText}>Mi Cuenta</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className={styles.logoutBtn} 
                aria-label="Cerrar sesión"
                id="header-logout-btn"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className={styles.loginBtn} id="header-login-link">
              <User size={18} />
              <span className={styles.loginText}>Ingresar</span>
            </Link>
          )}

          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
            id="header-menu-toggle"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
