'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/mock-data';
import { Shield, Lock, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import styles from './page.module.css';

declare global {
  interface Window {
    WidgetCheckout: any;
  }
}

export default function PagoPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '', notes: ''
  });

  const localCities = ['cali', 'jamundi', 'jamundí', 'yumbo', 'palmira'];
  const isLocalShipping = localCities.includes(
    form.city.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  );

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirectTo=/pago');
        return;
      }
      setUser(user);

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .single();

      if (profile) {
        setForm(prev => ({
          ...prev,
          name: profile.full_name || '',
          phone: profile.phone || ''
        }));
      }
      setLoading(false);
    };

    getData();
  }, [supabase, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    // 1. Crear el pedido principal
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pendiente',
        total: total,
        shipping_name: form.name,
        shipping_phone: form.phone,
        shipping_address: `${form.address}, ${form.city}`,
      })
      .select()
      .single();

    if (orderError) {
      alert('Error al crear el pedido: ' + orderError.message);
      setLoading(false);
      return;
    }

    // 2. Crear los ítems del pedido
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity,
      customization: item.customization || null
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      alert('Error al guardar los productos del pedido: ' + itemsError.message);
      setLoading(false);
      return;
    }

    // 3. Obtener firma de integridad desde nuestra API
    try {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      // Esperar a que el widget de Wompi cargue (máximo 5 segundos)
      if (!window.WidgetCheckout) {
        let attempts = 0;
        const maxAttempts = 10;
        const waitForWidget = () => new Promise<void>((resolve, reject) => {
          const interval = setInterval(() => {
            attempts++;
            if (window.WidgetCheckout) {
              clearInterval(interval);
              resolve();
            } else if (attempts >= maxAttempts) {
              clearInterval(interval);
              reject(new Error('El widget de Wompi no pudo cargarse. Verifica tu conexión a internet y recarga la página.'));
            }
          }, 500);
        });

        try {
          await waitForWidget();
        } catch (widgetErr: any) {
          alert(widgetErr.message);
          setLoading(false);
          return;
        }
      }

      const integrityResponse = await fetch('/api/wompi/integrity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: order.id,
          amount: total,
        }),
      });

      const { signature, amountInCents: serverAmountInCents, error: sigError } = await integrityResponse.json();

      if (sigError) throw new Error(sigError);

      console.log('🔐 Widget params:', {
        currency: 'COP',
        amountInCents: serverAmountInCents,
        reference: order.id,
        publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
        signatureIntegrity: signature,
      });

      // 4. Configurar y abrir el Widget de Wompi
      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents: serverAmountInCents,
        reference: order.id,
        publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
        signature: { integrity: signature },
        redirectUrl: `${window.location.origin}/pago/confirmacion`,
      });

      checkout.open((result: any) => {
        const transaction = result.transaction;
        if (transaction) {
          // Si el widget cierra con un resultado inmediato (aunque usualmente redirige)
          clearCart();
          router.push(`/pago/confirmacion?id=${transaction.id}`);
        }
      });

    } catch (err: any) {
      console.error('Error al iniciar el pago con Wompi:', err);
      const errMsg = err instanceof Error ? err.message : (typeof err === 'object' ? JSON.stringify(err) : String(err));
      alert('Error al iniciar el pago con Wompi: ' + errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
        <p style={{ marginTop: 16, color: 'var(--color-gray-text)' }}>Preparando tu pedido...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>No tienes productos en el carrito</h2>
        <p style={{ color: 'var(--color-gray-text)', margin: '8px 0 24px' }}>Agrega productos antes de proceder al pago.</p>
        <a href="/productos" className="btn btn-primary">Ver productos</a>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className={styles.title}>Finalizar compra</h1>

      <form onSubmit={handleSubmit} className={styles.layout}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Datos de envío</h2>

          <div className="form-group">
            <label className="form-label" htmlFor="checkout-name">Nombre completo *</label>
            <input
              id="checkout-name"
              className="form-input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="checkout-phone">Teléfono de contacto *</label>
            <input
              id="checkout-phone"
              className="form-input"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="300 123 4567"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="checkout-address">Dirección de entrega *</label>
            <input
              id="checkout-address"
              className="form-input"
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Calle, número, barrio"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="checkout-city">Ciudad *</label>
            <input
              id="checkout-city"
              className="form-input"
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Cali, Palmira, Tuluá..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="checkout-notes">Notas del pedido (opcional)</label>
            <textarea
              id="checkout-notes"
              className="form-input"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Instrucciones especiales de entrega..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        <div className={styles.summarySection}>
          <h2 className={styles.sectionTitle}>Resumen del pedido</h2>
          <div className={styles.orderItems}>
            {items.map(item => (
              <div key={item.cartItemId} className={styles.orderItem}>
                <span className={styles.orderItemName}>
                  {item.name} <span className={styles.orderItemQty}>×{item.quantity}</span>
                  {item.customization && (
                    <div style={{ fontSize: '13px', color: 'var(--color-primary)', marginTop: '2px' }}>
                      Texto: {item.customization}
                    </div>
                  )}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px 0', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span>Envío</span>
            <span style={{ fontWeight: 600, color: isLocalShipping ? '#16a34a' : '#4b5563' }}>
              {isLocalShipping ? 'Gratis (Local)' : 'Contra entrega (Por cobrar)'}
            </span>
          </div>
          <div className={styles.orderTotal}>
            <span>Total a pagar</span>
            <span>{formatPrice(total)}</span>
          </div>

          <p style={{ fontSize: '11px', color: '#6b7280', margin: '12px 0', lineHeight: '1.4' }}>
            {isLocalShipping 
              ? '* El envío a Cali, Jamundí, Palmira o Yumbo es gratuito a domicilio.' 
              : '* El envío se realiza flete por cobrar. Pagas el costo de transporte directamente a la transportadora al recibir.'}
          </p>

          <button type="submit" className="btn btn-primary btn-lg btn-full">
            <Lock size={18} />
            Pagar con Wompi
          </button>

          <div className={styles.securityBadge}>
            <Shield size={16} color="var(--color-success)" />
            <span>Pago 100% seguro con encriptación SSL</span>
          </div>
        </div>
      </form>
    </div>
  );
}
