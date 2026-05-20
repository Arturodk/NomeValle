'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, MessageCircle, ChevronRight } from 'lucide-react';
import { formatPrice, getMaterialLabel } from '@/lib/mock-data';
import { useCart } from '@/lib/cart-context';
import type { ProductWithImages } from '@/types/supabase';
import { NomenclatureBuilder } from '@/components/NomenclatureBuilder';
import { PlateBuilder } from '@/components/PlateBuilder';
import { FamilyPlateBuilder } from '@/components/FamilyPlateBuilder';
import styles from './page.module.css';

interface ProductDetailClientProps {
  product: ProductWithImages;
  companionPrice?: number;
  companionName?: string;
}

export default function ProductDetailClient({ product, companionPrice = 0, companionName = '' }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  // Manejo seguro de imágenes
  const images = product.product_images || [];
  const mainImageUrl = images[selectedImage]?.url || images[0]?.url || 'https://via.placeholder.com/600?text=Sin+Imagen';

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: images[0]?.url || 'https://via.placeholder.com/400?text=Sin+Imagen',
      material: product.material,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleAddNomenclature = (customText: string, calculatedTotal: number) => {
    addItem({
      id: product.id,
      name: product.name,
      price: calculatedTotal, // Guardamos el precio total calculado
      image_url: images[0]?.url || 'https://via.placeholder.com/400?text=Sin+Imagen',
      material: product.material,
      customization: customText // Guardamos el texto de la nomenclatura
    });
  };

  const handleAddPlate = (plateText: string, price: number) => {
    addItem({
      id: product.id,
      name: product.name,
      price: price,
      image_url: images[0]?.url || 'https://via.placeholder.com/400?text=Sin+Imagen',
      material: product.material,
      customization: plateText,
    });
  };

  const stock = product.stock ?? 0;

  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Inicio</Link>
        <ChevronRight size={14} className="breadcrumb-separator" />
        <Link href="/productos">Productos</Link>
        <ChevronRight size={14} className="breadcrumb-separator" />
        <span>{product.name}</span>
      </nav>

      <div className={styles.layout}>
        {/* Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <Image
              src={mainImageUrl}
              alt={product.name}
              width={600}
              height={600}
              className={styles.image}
              priority
            />
          </div>
          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  className={`${styles.thumb} ${idx === selectedImage ? styles.thumbActive : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <Image src={img.url} alt={`Vista ${idx + 1}`} width={80} height={80} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className={styles.info}>
          <span className="badge badge-accent">{getMaterialLabel(product.material)}</span>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <div className={styles.description}>
            {(product.description || '').split('\n').filter(line => line.trim() !== '').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className={styles.stock}>
            {stock > 0 ? (
              <span className={styles.inStock}>✓ Disponible ({stock} unidades)</span>
            ) : (
              <span className={styles.outStock}>✗ Agotado</span>
            )}
          </div>

          <div className={styles.actions}>
            {product.builder_type === 'plate' ? (
              <PlateBuilder
                price={product.price}
                onAddToCart={handleAddPlate}
                disabled={stock === 0}
              />
            ) : product.builder_type === 'family_plate' ? (
              <FamilyPlateBuilder
                price={product.price}
                onAddToCart={handleAddPlate}
                disabled={stock === 0}
              />
            ) : product.builder_type === 'nomenclature' || product.is_nomenclature ? (
              <NomenclatureBuilder 
                basePrice={product.price}
                baseName={product.name}
                companionPrice={companionPrice}
                companionName={companionName}
                isBaseLetters={product.name.toLowerCase().includes('letra')}
                onAddToCart={handleAddNomenclature}
                disabled={stock === 0}
              />
            ) : (
              <button
                className={`btn btn-primary btn-lg btn-full ${added ? styles.btnAdded : ''}`}
                onClick={handleAddToCart}
                disabled={stock === 0}
              >
                <ShoppingCart size={20} />
                {added ? '¡Agregado!' : 'Agregar al carrito'}
              </button>
            )}
            <a
              href={`https://wa.me/573159910372?text=${encodeURIComponent(`Hola, estoy interesado en: ${product.name} (${formatPrice(product.price)})`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg btn-full"
            >
              <MessageCircle size={20} />
              Consultar por WhatsApp
            </a>
          </div>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span>Material</span>
              <span>{getMaterialLabel(product.material)}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Envío</span>
              <span>3-5 días hábiles</span>
            </div>
            <div className={styles.detailRow}>
              <span>Pago seguro</span>
              <span>Wompi (tarjeta, PSE, Nequi)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
