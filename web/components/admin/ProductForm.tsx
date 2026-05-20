'use client';

import { useState } from 'react';
import { upsertProduct } from '@/app/admin/productos/formActions';
import Image from 'next/image';
import styles from '@/app/admin/page.module.css';

interface ProductImage {
  id: string;
  url: string;
  is_primary?: boolean;
}

interface Product {
  id?: string;
  name: string;
  description?: string | null;
  material: string;
  price: number;
  stock?: number | null;
  is_active?: boolean | null;
  is_nomenclature?: boolean | null;
  letter_product_id?: string | null;
  builder_type?: string | null;
}

interface ProductFormProps {
  product?: Product;
  existingImages?: ProductImage[];
  availableProducts?: { id: string, name: string }[];
}

export function ProductForm({ product, existingImages = [], availableProducts = [] }: ProductFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<ProductImage[]>(existingImages);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isNomenclature, setIsNomenclature] = useState<boolean>(product?.is_nomenclature ?? false);
  const [builderType, setBuilderType] = useState<'none' | 'nomenclature' | 'plate' | 'family_plate'>(
    (product?.builder_type as 'none' | 'nomenclature' | 'plate' | 'family_plate') ?? (product?.is_nomenclature ? 'nomenclature' : 'none')
  );
  
  const [primaryImage, setPrimaryImage] = useState<string | null>(() => {
    const primary = existingImages.find(img => img.is_primary);
    if (primary) return `img_${primary.id}`;
    if (existingImages.length > 0) return `img_${existingImages[0].id}`;
    return null;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...filesArray]);
      
      const newUrls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeExistingImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
    setDeletedImages([...deletedImages, id]);
  };

  const removeNewImage = (index: number) => {
    const updatedFiles = [...newImages];
    updatedFiles.splice(index, 1);
    setNewImages(updatedFiles);

    const updatedUrls = [...previewUrls];
    URL.revokeObjectURL(updatedUrls[index]);
    updatedUrls.splice(index, 1);
    setPreviewUrls(updatedUrls);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    if (images.length === 0 && newImages.length === 0) {
      setError('Debes subir al menos una imagen para el producto.');
      setIsPending(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    // Add deleted images
    formData.append('deleted_images', JSON.stringify(deletedImages));

    // Wait, the input type="file" inside form automatically appends if name="images".
    // But since we are managing newImages in state to allow removals, we should remove the original file input from formData 
    // and append our custom newImages.
    formData.delete('images');
    newImages.forEach(file => {
      formData.append('images', file);
    });

    try {
      const result = await upsertProduct(formData);
      // upsertProduct will redirect on success, so we only handle errors
      if (result && !result.success) {
        setError(result.error || 'Error al guardar el producto');
        setIsPending(false);
      }
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer} style={{ maxWidth: '800px', background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>{error}</div>}
      
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Nombre *</label>
          <input type="text" name="name" defaultValue={product?.name} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Material *</label>
          <input type="text" name="material" defaultValue={product?.material} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Descripción</label>
        <textarea name="description" defaultValue={product?.description || ''} rows={4} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}></textarea>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Precio (COP) *</label>
          <input type="number" name="price" defaultValue={product?.price} required min="0" step="100" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Stock</label>
          <input type="number" name="stock" defaultValue={product?.stock ?? 0} min="0" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
          <input type="checkbox" name="is_active" defaultChecked={product?.is_active !== false} />
          Producto activo y visible en la tienda
        </label>
      </div>

      <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>Constructor Interactivo</h3>
        
        {/* Retrocompatibilidad: campo oculto para is_nomenclature */}
        <input type="hidden" name="is_nomenclature" value={builderType === 'nomenclature' ? 'on' : ''} />
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Tipo de constructor</label>
          <select
            name="builder_type"
            value={builderType}
            onChange={(e) => setBuilderType(e.target.value as 'none' | 'nomenclature' | 'plate' | 'family_plate')}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white' }}
          >
            <option value="none">Ninguno (producto estándar)</option>
            <option value="nomenclature">Constructor de nomenclatura (precio por carácter)</option>
            <option value="plate">Constructor de placa (precio fijo por unidad)</option>
            <option value="family_plate">Constructor de placa familiar (mensaje + nomenclatura)</option>
          </select>
        </div>

        {builderType === 'nomenclature' && (
          <div style={{ marginTop: '12px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Producto para Letras (Opcional)</label>
            <select 
              name="letter_product_id" 
              defaultValue={product?.letter_product_id || ''}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white' }}
            >
              <option value="">-- Seleccionar producto para letras --</option>
              {availableProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              El sistema utilizará el precio base de este producto para cobrar cada letra adicional ingresada por el cliente.
            </p>
          </div>
        )}

        {builderType === 'plate' && (
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', padding: '8px', background: '#e0f2fe', borderRadius: '6px' }}>
            💡 El cliente podrá ingresar el texto de una o varias placas. Se cobrará el precio del producto por cada placa.
            Formato permitido: máx. 6 dígitos, máx. 4 letras, solo guion (-) como separador.
          </p>
        )}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Imágenes</label>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          {images.map(img => (
            <div key={img.id} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '6px', overflow: 'hidden', border: primaryImage === `img_${img.id}` ? '2px solid var(--color-primary)' : '1px solid #e5e7eb' }}>
              <Image src={img.url} alt="Producto" fill style={{ objectFit: 'cover' }} />
              <button 
                type="button" 
                onClick={() => removeExistingImage(img.id)}
                style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
              >
                ×
              </button>
              <label style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(255,255,255,0.9)', padding: '2px 4px', borderRadius: '4px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input type="radio" name="primary_image" value={`img_${img.id}`} checked={primaryImage === `img_${img.id}`} onChange={() => setPrimaryImage(`img_${img.id}`)} />
                Portada
              </label>
            </div>
          ))}

          {previewUrls.map((url, idx) => (
            <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '6px', overflow: 'hidden', border: primaryImage === `new_${idx}` ? '2px solid var(--color-primary)' : '1px solid #e5e7eb' }}>
              <Image src={url} alt="Preview" fill style={{ objectFit: 'cover' }} />
              <button 
                type="button" 
                onClick={() => removeNewImage(idx)}
                style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
              >
                ×
              </button>
              <label style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(255,255,255,0.9)', padding: '2px 4px', borderRadius: '4px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input type="radio" name="primary_image" value={`new_${idx}`} checked={primaryImage === `new_${idx}`} onChange={() => setPrimaryImage(`new_${idx}`)} />
                Portada
              </label>
            </div>
          ))}
        </div>

        <input 
          type="file" 
          name="images_upload" 
          accept="image/*" 
          multiple 
          onChange={handleFileChange}
          style={{ width: '100%', padding: '10px', border: '1px dashed #d1d5db', borderRadius: '6px', background: '#f9fafb' }}
        />
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Puedes subir múltiples imágenes. Usa imágenes en formato JPG, PNG o WebP.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button 
          type="button" 
          onClick={() => window.history.back()}
          style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', fontWeight: 500 }}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={isPending}
          style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: 'var(--color-primary)', color: 'white', cursor: isPending ? 'not-allowed' : 'pointer', fontWeight: 500, opacity: isPending ? 0.7 : 1 }}
        >
          {isPending ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </div>
    </form>
  );
}
