import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/utils/supabase/server';
import type { ProductWithImages } from '@/types/supabase';
import styles from './page.module.css';

export default async function Home() {
  const supabase = await createClient();
  const { data: featuredProducts } = await supabase
    .from('products')
    .select(`
      *,
      product_images (
        id,
        url,
        is_primary,
        sort_order
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>Artesanía & Calidad</span>
          <h1 className={styles.heroTitle}>
            Nomenclaturas que le dan <span className={styles.heroAccent}>identidad</span> a tu hogar
          </h1>
          <p className={styles.heroSubtitle}>
            Placas metálicas, números en bronce y aluminio. Fabricados con precisión en el Valle del Cauca.
          </p>
          <div className={styles.heroCta}>
            <Link href="/productos" className="btn btn-accent btn-lg">
              Ver catálogo
            </Link>
            <a
              href="https://wa.me/573159910372?text=Hola%2C%20quiero%20información%20sobre%20sus%20nomenclaturas"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Materiales */}
      <section className={`section ${styles.materials}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Nuestros materiales</h2>
          <p className={styles.sectionSubtitle}>Trabajamos con materiales de la más alta calidad</p>
          <div className={styles.materialsGrid}>
            <Link href="/productos?material=metalico" className={styles.materialCard}>
              <div className={styles.materialIcon}>🔩</div>
              <h3>Metálico</h3>
              <p>Resistente y versátil. Ideal para todo tipo de fachada.</p>
            </Link>
            <Link href="/productos?material=bronce" className={styles.materialCard}>
              <div className={styles.materialIcon}>✨</div>
              <h3>Bronce</h3>
              <p>Elegancia clásica con acabados dorados naturales.</p>
            </Link>
            <Link href="/productos?material=aluminio" className={styles.materialCard}>
              <div className={styles.materialIcon}>💎</div>
              <h3>Aluminio</h3>
              <p>Moderno y ligero. Resistente a la corrosión.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className={`section section-alt`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Productos destacados</h2>
              <p className={styles.sectionSubtitle}>Las nomenclaturas más solicitadas por nuestros clientes</p>
            </div>
            <Link href="/productos" className="btn btn-secondary">
              Ver todo el catálogo
            </Link>
          </div>
          <div className="grid-products">
            {(featuredProducts as ProductWithImages[] || []).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Confianza */}
      <section className={`section ${styles.trust}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>¿Por qué elegirnos?</h2>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>🛡️</div>
              <h3>Pago seguro</h3>
              <p>Transacciones protegidas con pasarela de pago certificada Wompi.</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>🚚</div>
              <h3>Envío a domicilio</h3>
              <p>Despachamos a todo el Valle del Cauca en 3-5 días hábiles.</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>💬</div>
              <h3>Atención directa</h3>
              <p>Resolvemos tus dudas al instante por WhatsApp.</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>🏆</div>
              <h3>Calidad artesanal</h3>
              <p>Cada pieza fabricada con materiales duraderos y acabados premium.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>¿Necesitas una nomenclatura personalizada?</h2>
            <p className={styles.ctaText}>
              Fabricamos placas a medida con el diseño que necesites. Escríbenos y te asesoramos sin compromiso.
            </p>
            <a
              href="https://wa.me/573159910372?text=Hola%2C%20necesito%20una%20nomenclatura%20personalizada"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              Solicitar cotización por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
