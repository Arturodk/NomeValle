'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './page.module.css';

export default function CuentaPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
      })
      .eq('id', user.id);

    if (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.title}>Mi Perfil</h1>
      <p className={styles.subtitle}>Gestiona tu información personal y de contacto.</p>

      {message && (
        <div className={`${styles.alert} ${message.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="form-group">
          <label className="form-label" htmlFor="profile-name">Nombre completo</label>
          <input
            id="profile-name"
            className="form-input"
            type="text"
            value={profile?.full_name || ''}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            placeholder="Tu nombre completo"
            required
            disabled={updating}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="profile-email">Correo electrónico</label>
          <input
            id="profile-email"
            className="form-input"
            type="email"
            value={user?.email || ''}
            disabled
          />
          <span style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 4, display: 'block' }}>
            El correo no puede ser modificado.
          </span>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="profile-phone">Teléfono</label>
          <input
            id="profile-phone"
            className="form-input"
            type="tel"
            value={profile?.phone || ''}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="Ej: 300 123 4567"
            disabled={updating}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={updating}>
          {updating ? (
            <>
              <Loader2 className="animate-spin" size={18} style={{ marginRight: 8 }} />
              Guardando...
            </>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </form>
    </div>
  );
}
