'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/mock-data';
import styles from './NomenclatureBuilder.module.css';

interface NomenclatureBuilderProps {
  basePrice: number;
  baseName: string;
  companionPrice: number;
  companionName: string;
  isBaseLetters: boolean;
  onAddToCart: (customText: string, calculatedTotal: number) => void;
  disabled?: boolean;
}

export function NomenclatureBuilder({ 
  basePrice, 
  baseName, 
  companionPrice, 
  companionName, 
  isBaseLetters, 
  onAddToCart, 
  disabled 
}: NomenclatureBuilderProps) {
  const [text, setText] = useState('');
  const [added, setAdded] = useState(false);

  const numbersCount = (text.match(/\d/g) || []).length;
  const lettersCount = (text.match(/[a-zA-Z]/g) || []).length;
  
  const baseCount = isBaseLetters ? lettersCount : numbersCount;
  const companionCount = isBaseLetters ? numbersCount : lettersCount;

  const calculatedTotal = (baseCount * basePrice) + (companionCount * companionPrice);
  const isValid = numbersCount > 0 || lettersCount > 0;

  const handleAdd = () => {
    if (!isValid) return;
    onAddToCart(text.toUpperCase(), calculatedTotal);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={styles.builderContainer}>
      <h3 className={styles.title}>Diseña tu nomenclatura</h3>
      <p className={styles.description}>
        Escribe los números y letras que necesitas.
      </p>
      
      <input
        type="text"
        className={styles.input}
        placeholder="Ej: 145-B"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={15}
        disabled={disabled}
      />
      
      <div className={styles.calculation}>
        {baseCount > 0 && (
          <div className={styles.calcRow}>
            <span>{baseName} ({baseCount} x {formatPrice(basePrice)})</span>
            <span>{formatPrice(baseCount * basePrice)}</span>
          </div>
        )}
        {companionCount > 0 && (
          <div className={styles.calcRow}>
            <span>{companionName || (isBaseLetters ? 'Números' : 'Letras')} ({companionCount} x {formatPrice(companionPrice)})</span>
            <span>{formatPrice(companionCount * companionPrice)}</span>
          </div>
        )}
        <div className={styles.calcTotal}>
          <strong>Total estimado:</strong>
          <strong>{formatPrice(calculatedTotal)}</strong>
        </div>
      </div>

      <button
        className={`btn btn-primary btn-lg btn-full`}
        onClick={handleAdd}
        disabled={disabled || !isValid}
        style={added ? { background: '#10b981', borderColor: '#10b981' } : {}}
      >
        <ShoppingCart size={20} />
        {added ? '¡Agregado!' : 'Agregar al carrito'}
      </button>
    </div>
  );
}
