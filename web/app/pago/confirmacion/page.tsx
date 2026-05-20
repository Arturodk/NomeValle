'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import styles from './page.module.css';

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const transactionId = searchParams.get('id');
  const [status, setStatus] = useState<'LOADING' | 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING'>('LOADING');
  const [orderRef, setOrderRef] = useState<string | null>(null);

  useEffect(() => {
    if (!transactionId) {
      setStatus('ERROR');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/wompi/transaction/${transactionId}`);
        const data = await res.json();
        
        if (data.status) {
          setStatus(data.status);
          setOrderRef(data.reference);
          
          // Limpiar el carrito si el pago fue aprobado
          if (data.status === 'APPROVED') {
            clearCart();
          }
        } else {
          setStatus('ERROR');
        }
      } catch (e) {
        setStatus('ERROR');
      }
    };

    verify();
  }, [transactionId]);

  if (status === 'LOADING') {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
        <p style={{ marginTop: 16 }}>Verificando el estado de tu pago...</p>
      </div>
    );
  }

  const isSuccess = status === 'APPROVED';
  const isPending = status === 'PENDING';

  return (
    <div className="container">
      <div className={styles.wrapper}>
        <div className={styles.iconWrap}>
          {isSuccess ? (
            <CheckCircle size={72} color="var(--color-success)" strokeWidth={1.5} />
          ) : isPending ? (
            <Clock size={72} color="var(--color-warning)" strokeWidth={1.5} />
          ) : (
            <XCircle size={72} color="var(--color-error)" strokeWidth={1.5} />
          )}
        </div>

        <h1 className={styles.title}>
          {isSuccess ? '¡Pago exitoso!' : isPending ? 'Pago pendiente' : 'Hubo un problema'}
        </h1>

        <p className={styles.message}>
          {isSuccess ? (
            <>Tu pedido <strong>#{orderRef?.slice(0, 8).toUpperCase()}</strong> ha sido confirmado y pronto iniciaremos su fabricación.</>
          ) : isPending ? (
            <>Estamos esperando la confirmación de tu banco. Te notificaremos apenas el pago sea aprobado.</>
          ) : (
            <>No pudimos procesar tu pago. Por favor intenta nuevamente o contacta a soporte.</>
          )}
        </p>

        {isSuccess && (
          <div className={styles.info}>
            <p><strong>¿Qué sigue?</strong></p>
            <ul>
              <li>Preparamos tu pedido en 1-2 días hábiles.</li>
              <li>Te notificaremos cuando sea despachado.</li>
              <li>Entrega estimada: 3-5 días hábiles.</li>
            </ul>
          </div>
        )}

        <div className={styles.actions}>
          <Link href={isSuccess ? "/cuenta/pedidos" : "/pago"} className="btn btn-primary">
            {isSuccess ? 'Ver mis pedidos' : 'Reintentar pago'}
          </Link>
          <Link href="/productos" className="btn btn-secondary">
            Seguir comprando
          </Link>
        </div>
        
        <p className={styles.help}>
          ¿Tienes preguntas?{' '}
          <a
            href={`https://wa.me/573159910372?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20mi%20pedido%20${orderRef?.slice(0, 8).toUpperCase() || ''}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Escríbenos por WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={<div className="container"><p>Cargando confirmación...</p></div>}>
      <ConfirmacionContent />
    </Suspense>
  );
}
