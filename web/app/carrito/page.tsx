'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/mock-data';
import styles from './page.module.css';

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container">
        <div className={styles.empty}>
          <ShoppingBag size={64} strokeWidth={1} color="var(--color-gray-light)" />
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestro catálogo y encuentra la nomenclatura perfecta para tu hogar.</p>
          <Link href="/productos" className="btn btn-primary btn-lg">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className={styles.title}>Tu carrito</h1>
      <p className={styles.subtitle}>{itemCount} artículo{itemCount !== 1 ? 's' : ''} en tu carrito</p>

      <div className={styles.layout}>
        <div className={styles.items}>
          {items.map(item => (
            <div key={item.cartItemId} className={styles.item}>
              <div className={styles.itemImage}>
                <Image src={item.image_url} alt={item.name} width={100} height={100} />
              </div>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.name}</h3>
                {item.customization && (
                  <p className={styles.itemCustomization}>Texto: <strong>{item.customization}</strong></p>
                )}
                <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
              </div>
              <div className={styles.itemQty}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                  aria-label="Reducir cantidad"
                >
                  <Minus size={16} />
                </button>
                <span className={styles.qtyValue}>{item.quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className={styles.itemSubtotal}>{formatPrice(item.price * item.quantity)}</p>
              <button
                className={styles.removeBtn}
                onClick={() => removeItem(item.cartItemId)}
                aria-label="Eliminar del carrito"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h3 className={styles.summaryTitle}>Resumen del pedido</h3>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Envío</span>
            <span className={styles.shippingNote} style={{ fontWeight: 500 }}>Gratis local / Por cobrar nac.</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '12px', marginBottom: '16px', lineHeight: '1.4' }}>
            * <strong>Envío local gratis</strong> en Cali, Jamundí, Palmira y Yumbo.<br />
            * <strong>Resto del país:</strong> Pago contra entrega (pagas el costo del flete a la transportadora al recibir).
          </p>
          <Link href="/pago" className="btn btn-primary btn-lg btn-full">
            Proceder al pago
          </Link>
          <Link href="/productos" className={styles.continueShopping}>
            ← Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
