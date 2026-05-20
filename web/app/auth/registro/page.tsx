'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import styles from '../login/page.module.css';

export default function RegistroPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
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
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>Regístrate para gestionar tus pedidos</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Nombre completo</label>
            <div className={styles.inputWrap}>
              <User size={18} className={styles.inputIcon} />
              <input
                id="register-name"
                className="form-input"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Correo electrónico</label>
            <div className={styles.inputWrap}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="register-email"
                className="form-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Contraseña</label>
            <div className={styles.inputWrap}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="register-password"
                className="form-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm">Confirmar contraseña</label>
            <div className={styles.inputWrap}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="register-confirm"
                className="form-input"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full">
            Registrarme
          </button>
        </form>

        <p className={styles.registerLink}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
