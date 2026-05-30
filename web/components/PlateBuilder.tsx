'use client';

import { useState } from 'react';
import { ShoppingCart, PlusCircle, X } from 'lucide-react';
import { formatPrice } from '@/lib/mock-data';
import { gsap } from '@/lib/gsap';
import styles from './PlateBuilder.module.css';

interface PlateBuilderProps {
  price: number;
  onAddToCart: (plateText: string, price: number) => void;
  disabled?: boolean;
}

type ValidationError = string | null;

interface PlateItem {
  id: string;
  text: string;
}

function validatePlate(text: string): ValidationError {
  if (!text.trim()) return null; // Empty — handled by isValid

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

export function PlateBuilder({ price, onAddToCart, disabled }: PlateBuilderProps) {
  const [currentText, setCurrentText] = useState('');
  const [plates, setPlates] = useState<PlateItem[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const validationError = currentText.length > 0 ? validatePlate(currentText) : null;
  const isCurrentValid = currentText.trim().length > 0 && validationError === null;

  const handleAddPlate = () => {
    if (!isCurrentValid) return;
    const newPlate: PlateItem = {
      id: Math.random().toString(36).substring(2, 9),
      text: currentText.trim().toUpperCase(),
    };
    setPlates(prev => [...prev, newPlate]);
    setCurrentText('');
  };

  const handleRemovePlate = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonElement = event.currentTarget;
    const itemElement = buttonElement.closest(`.${styles.plateItem}`);
    
    if (itemElement) {
      gsap.to(itemElement, {
        opacity: 0,
        x: -50,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          setPlates(prev => prev.filter(plate => plate.id !== id));
        }
      });
    } else {
      setPlates(prev => prev.filter(plate => plate.id !== id));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPlate();
    }
  };

  const handleConfirm = () => {
    if (plates.length === 0) return;
    plates.forEach(plate => onAddToCart(plate.text, price));
    setPlates([]);
    setCurrentText('');
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2500);
  };

  const total = plates.length * price;

  return (
    <div className={styles.builderContainer}>
      <h3 className={styles.title}>Diseña tu placa</h3>
      <p className={styles.description}>
        Escribe el texto de cada placa que necesitas y agrégalas una a una.
      </p>

      {/* Input row */}
      <div className={styles.inputRow}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={`${styles.input} ${validationError ? styles.inputError : ''}`}
            placeholder="Ej: 27-44"
            value={currentText}
            onChange={e => setCurrentText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={12}
            disabled={disabled}
            aria-label="Texto de la placa"
          />
          {validationError && (
            <span className={styles.errorMsg}>{validationError}</span>
          )}
        </div>
        <button
          type="button"
          className={`btn btn-secondary ${styles.addBtn}`}
          onClick={handleAddPlate}
          disabled={disabled || !isCurrentValid}
          title="Agregar placa"
        >
          <PlusCircle size={18} />
          Agregar
        </button>
      </div>

      {/* Plate queue */}
      {plates.length > 0 && (
        <div className={styles.plateList}>
          <p className={styles.plateListLabel}>Placas en tu pedido:</p>
          {plates.map((plateObj) => (
            <div key={plateObj.id} className={styles.plateItem}>
              <span className={styles.plateText}>{plateObj.text}</span>
              <span className={styles.platePrice}>{formatPrice(price)}</span>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={(e) => handleRemovePlate(plateObj.id, e)}
                disabled={disabled}
                aria-label={`Eliminar placa ${plateObj.text}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {/* Total */}
          <div className={styles.totalRow}>
            <strong>
              {plates.length} {plates.length === 1 ? 'placa' : 'placas'} × {formatPrice(price)}
            </strong>
            <strong>{formatPrice(total)}</strong>
          </div>
        </div>
      )}

      {/* Confirm button */}
      <button
        type="button"
        className="btn btn-primary btn-lg btn-full"
        onClick={handleConfirm}
        disabled={disabled || plates.length === 0}
        style={confirmed ? { background: '#10b981', borderColor: '#10b981' } : {}}
      >
        <ShoppingCart size={20} />
        {confirmed
          ? `¡${plates.length > 0 ? plates.length + ' ' : ''}Agregado${plates.length !== 1 ? 's' : ''}!`
          : `Agregar al carrito${plates.length > 1 ? ` (${plates.length})` : ''}`}
      </button>
    </div>
  );
}
