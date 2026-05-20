'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message === 'Invalid login credentials' 
        ? 'Credenciales inválidas. Por favor intenta de nuevo.' 
        : signInError.message
      );
      setLoading(false);
      return;
    }

    router.push('/cuenta');
    router.refresh();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <span className={styles.logoIcon}>N</span>
        </div>
        <h1 className={styles.title}>Iniciar sesión</h1>
        <p className={styles.subtitle}>Ingresa a tu cuenta para ver tus pedidos</p>

        {error && (
          <div className={styles.errorAlert} id="login-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Correo electrónico</label>
            <div className={styles.inputWrap}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="login-email"
                className="form-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                disabled={loading}
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Contraseña</label>
            <div className={styles.inputWrap}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="login-password"
                className="form-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                required
                disabled={loading}
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ marginRight: 8 }} />
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        <p className={styles.registerLink}>
          ¿No tienes cuenta?{' '}
          <Link href="/auth/registro">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
}
