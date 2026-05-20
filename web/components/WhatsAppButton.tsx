'use client';

import { MessageCircle } from 'lucide-react';
import styles from './WhatsAppButton.module.css';

export default function WhatsAppButton() {
  const phoneNumber = '573159910372';
  const message = encodeURIComponent('Hola, estoy interesado en sus nomenclaturas. ¿Podrían ayudarme?');
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.fab}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} strokeWidth={2} />
      <span className={styles.tooltip}>¿Necesitas ayuda?</span>
    </a>
  );
}
