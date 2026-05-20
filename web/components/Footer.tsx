import Link from 'next/link';
import { Phone } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logoIcon}>N</span>
          <div>
            <h3 className={styles.name}>Nomenclaturas del Valle</h3>
            <p className={styles.tagline}>Placas y números para tu hogar</p>
          </div>
        </div>

        <div className={styles.links}>
          <h4 className={styles.linksTitle}>Navegación</h4>
          <Link href="/productos">Productos</Link>
          <Link href="/contacto">Contacto</Link>
          <Link href="/auth/login">Mi cuenta</Link>
        </div>

        <div className={styles.contact}>
          <h4 className={styles.linksTitle}>Contacto</h4>
          <a
            href="https://wa.me/573159910372?text=Hola%2C%20estoy%20interesado%20en%20sus%20nomenclaturas"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappLink}
          >
            <Phone size={16} />
            +57 315 991 0372
          </a>
          <p className={styles.location}>Valle del Cauca, Colombia</p>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Nomenclaturas del Valle. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
