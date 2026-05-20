'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/mock-data';
import styles from './FamilyPlateBuilder.module.css';

interface FamilyPlateBuilderProps {
  price: number;
  onAddToCart: (customization: string, price: number) => void;
  disabled?: boolean;
}

type TopMessageType = 'default' | 'custom';

function validateNomenclature(text: string): string | null {
  if (!text.trim()) return null; // Empty

  if (!/^[A-Za-z0-9\-]+$/.test(text)) {
    return 'Solo se permiten números, letras y guion -';
  }

  const digits = (text.match(/\d/g) || []).length;
  if (digits > 6) {
    return 'Máximo 6 números';
  }

  const letters = (text.match(/[A-Za-z]/g) || []).length;
  if (letters > 4) {
    return 'Máximo 4 letras';
  }

  return null;
}

export function FamilyPlateBuilder({ price, onAddToCart, disabled }: FamilyPlateBuilderProps) {
  const [topMessageType, setTopMessageType] = useState<TopMessageType>('default');
  const [customFamilyName, setCustomFamilyName] = useState('');
  const [nomenclature, setNomenclature] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const nomenclatureError = nomenclature.length > 0 ? validateNomenclature(nomenclature) : null;
  
  // Validation for submit
  const isNomenclatureValid = nomenclature.trim().length > 0 && nomenclatureError === null;
  const isCustomNameValid = topMessageType === 'default' || (customFamilyName.trim().length > 0 && customFamilyName.trim().length <= 25);
  const isFormValid = isNomenclatureValid && isCustomNameValid;

  const handleConfirm = () => {
    if (!isFormValid) return;
    
    // Construct customization string
    let customizationString = '';
    if (topMessageType === 'default') {
      customizationString = `Mensaje: DIOS BENDIGA ESTE HOGAR | Nomenclatura: ${nomenclature.trim().toUpperCase()}`;
    } else {
      customizationString = `Familia: ${customFamilyName.trim().toUpperCase()} | Nomenclatura: ${nomenclature.trim().toUpperCase()}`;
    }

    onAddToCart(customizationString, price);
    
    // Reset state after confirmation
    setTopMessageType('default');
    setCustomFamilyName('');
    setNomenclature('');
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2500);
  };

  return (
    <div className={styles.builderContainer}>
      <h3 className={styles.title}>Personaliza tu Placa Familiar</h3>
      <p className={styles.description}>
        Elige el mensaje de la parte superior y escribe los números de tu nomenclatura.
      </p>

      {/* Top section */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>1. Mensaje Superior</p>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input 
              type="radio" 
              name="topMessage" 
              value="default"
              checked={topMessageType === 'default'}
              onChange={() => setTopMessageType('default')}
              disabled={disabled}
            />
            DIOS BENDIGA ESTE HOGAR (Por defecto)
          </label>
          
          <label className={styles.radioLabel}>
            <input 
              type="radio" 
              name="topMessage" 
              value="custom"
              checked={topMessageType === 'custom'}
              onChange={() => setTopMessageType('custom')}
              disabled={disabled}
            />
            Personalizar Apellidos
          </label>

          {topMessageType === 'custom' && (
            <div className={styles.customInputWrapper}>
              <input
                type="text"
                className={styles.input}
                placeholder="Ej. Familia Martínez Vanegas"
                value={customFamilyName}
                onChange={e => setCustomFamilyName(e.target.value)}
                maxLength={25}
                disabled={disabled}
                aria-label="Nombre de la familia"
              />
              <span className={styles.errorMsg} style={{ color: 'var(--color-gray-text)' }}>
                Máximo 25 caracteres.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>2. Nomenclatura (Parte Inferior)</p>
        <input
          type="text"
          className={`${styles.input} ${styles.nomenclatureInput} ${nomenclatureError ? styles.inputError : ''}`}
          placeholder="Ej: 35-59"
          value={nomenclature}
          onChange={e => setNomenclature(e.target.value)}
          maxLength={12}
          disabled={disabled}
          aria-label="Texto de la nomenclatura"
        />
        {nomenclatureError && (
          <span className={styles.errorMsg}>{nomenclatureError}</span>
        )}
      </div>

      {/* Total & Confirm */}
      <div className={styles.totalRow}>
        <span>Total a pagar:</span>
        <span>{formatPrice(price)}</span>
      </div>

      <button
        type="button"
        className="btn btn-primary btn-lg btn-full"
        onClick={handleConfirm}
        disabled={disabled || !isFormValid}
        style={confirmed ? { background: '#10b981', borderColor: '#10b981' } : {}}
      >
        <ShoppingCart size={20} />
        {confirmed ? '¡Agregado!' : 'Agregar al carrito'}
      </button>
    </div>
  );
}
