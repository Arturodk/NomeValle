import { Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import styles from './page.module.css';

export default function ContactoPage() {
  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>Contáctanos</h1>
        <p className={styles.subtitle}>
          ¿Tienes preguntas sobre nuestros productos o necesitas una nomenclatura personalizada? Estamos aquí para ayudarte.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <MessageCircle size={28} />
          </div>
          <h3>WhatsApp</h3>
          <p>La forma más rápida de comunicarte con nosotros.</p>
          <a
            href="https://wa.me/573159910372?text=Hola%2C%20necesito%20información%20sobre%20sus%20nomenclaturas"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            <MessageCircle size={18} />
            Escribir por WhatsApp
          </a>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <Phone size={28} />
          </div>
          <h3>Teléfono</h3>
          <p>Llámanos directamente para consultas inmediatas.</p>
          <a href="tel:+573159910372" className={styles.contactLink}>
            +57 315 991 0372
          </a>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <MapPin size={28} />
          </div>
          <h3>Ubicación</h3>
          <p>Operamos desde el Valle del Cauca, Colombia.</p>
          <span className={styles.contactLink}>
            Valle del Cauca, Colombia
          </span>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <Clock size={28} />
          </div>
          <h3>Horario</h3>
          <p>Nuestro horario de atención al cliente.</p>
          <span className={styles.contactLink}>
            Lun - Sáb: 8:00 AM - 6:00 PM
          </span>
        </div>
      </div>

      <div className={styles.cta}>
        <h2>¿Necesitas un pedido especial?</h2>
        <p>Fabricamos nomenclaturas a medida según tus especificaciones. Escríbenos y cotizamos sin compromiso.</p>
        <a
          href="https://wa.me/573159910372?text=Hola%2C%20necesito%20cotizar%20una%20nomenclatura%20personalizada"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-accent btn-lg"
        >
          Solicitar cotización
        </a>
      </div>
    </div>
  );
}
