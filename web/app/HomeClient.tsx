"use client";

import { useRef } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { ProductWithImages } from "@/types/supabase";
import styles from "./page.module.css";
import { gsap, ScrollTrigger, createGSAPMatchMedia, MEDIA_QUERIES } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

interface HomeClientProps {
  featuredProducts: ProductWithImages[];
}

export default function HomeClient({ featuredProducts }: HomeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const heroTagRef = useRef<HTMLSpanElement>(null);
  
  useGSAP(() => {
    // Cinematic entrance animations on load
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    // Animate background overlay opacity and sutil scale
    tl.fromTo(
      `.${styles.heroOverlay}`,
      { opacity: 0, scale: 1.1 },
      { opacity: 0.12, scale: 1, duration: 2 }
    );
    
    // Tag entry
    if (heroTagRef.current) {
      tl.fromTo(
        heroTagRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=1.4"
      );
    }
    
    // Title entry (slide up and fade)
    if (heroTitleRef.current) {
      tl.fromTo(
        heroTitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.6"
      );
    }
    
    // Subtitle entry
    if (heroSubtitleRef.current) {
      tl.fromTo(
        heroSubtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      );
    }
    
    // CTA buttons scale & fade in
    if (heroCtaRef.current) {
      tl.fromTo(
        heroCtaRef.current.children,
        { opacity: 0, scale: 0.9, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15 },
        "-=0.5"
      );
    }

    // Scroll-driven responsive animations
    const mm = createGSAPMatchMedia();
    
    // Desktop only scroll animations
    mm.add(MEDIA_QUERIES.isDesktop, () => {
      // Materials cards stagger slide up
      gsap.fromTo(
        `.${styles.materialCard}`,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: `.${styles.materialsGrid}`,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        }
      );
      
      // Featured products: fade in and scale up from 0.8 as they enter the viewport
      gsap.fromTo(
        ".grid-products > div",
        { opacity: 0, scale: 0.8, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".grid-products",
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );
      
      // Trust grid stagger
      gsap.fromTo(
        `.${styles.trustItem}`,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: `.${styles.trustGrid}`,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );
      
      // Final CTA parallax scale-up
      gsap.fromTo(
        `.${styles.ctaInner}`,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: `.${styles.ctaSection}`,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );
    });

    // Mobile / Tablet simplified animations
    mm.add(MEDIA_QUERIES.isMobile, () => {
      // Materials section fade in
      gsap.fromTo(
        `.${styles.materialCard}`,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: `.${styles.materialsGrid}`,
            start: "top 85%",
          }
        }
      );

      // Featured products simplified stagger
      gsap.fromTo(
        ".grid-products > div",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".grid-products",
            start: "top 90%",
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span ref={heroTagRef} className={styles.heroTag}>Artesanía & Calidad</span>
          <h1 ref={heroTitleRef} className={styles.heroTitle}>
            Nomenclaturas que le dan <span className={styles.heroAccent}>identidad</span> a tu hogar
          </h1>
          <p ref={heroSubtitleRef} className={styles.heroSubtitle}>
            Placas metálicas, números en bronce y aluminio. Fabricados con precisión en el Valle del Cauca.
          </p>
          <div ref={heroCtaRef} className={styles.heroCta}>
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
            {(featuredProducts || []).map((product) => (
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
    </div>
  );
}
