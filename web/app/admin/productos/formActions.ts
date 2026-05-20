'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function upsertProduct(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get('id') as string | null;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const material = formData.get('material') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string, 10);
  const isActive = formData.get('is_active') === 'on' || formData.get('is_active') === 'true';
  const builderType = (formData.get('builder_type') as string | null) ?? 'none';
  const validBuilderTypes = ['none', 'nomenclature', 'plate', 'family_plate'];
  const safeBuilderType = validBuilderTypes.includes(builderType) ? builderType : 'none';
  // Retrocompatibilidad: derivar is_nomenclature de builder_type
  const isNomenclature = safeBuilderType === 'nomenclature';
  const letterProductIdRaw = formData.get('letter_product_id') as string;
  const letterProductId = letterProductIdRaw && letterProductIdRaw.trim() !== '' ? letterProductIdRaw : null;

  if (!name || !material || isNaN(price)) {
    return { success: false, error: 'Faltan campos obligatorios' };
  }

  const productData = {
    name,
    description,
    material,
    price,
    stock: isNaN(stock) ? 0 : stock,
    is_active: isActive,
    builder_type: safeBuilderType,
    is_nomenclature: isNomenclature,
    letter_product_id: isNomenclature ? letterProductId : null,
  };

  let productId = id;

  if (id) {
    // Update
    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id);
    if (error) return { success: false, error: error.message };
  } else {
    // Insert
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select('id')
      .single();
    if (error) return { success: false, error: error.message };
    productId = data.id;
  }

  // 1. Handle deleted images (Storage + DB)
  const deletedImagesStr = formData.get('deleted_images') as string;
  if (deletedImagesStr) {
    try {
      const deletedImages = JSON.parse(deletedImagesStr);
      if (Array.isArray(deletedImages) && deletedImages.length > 0) {
        // Fetch URLs to delete from storage
        const { data: imagesToDelete } = await supabase
          .from('product_images')
          .select('url')
          .in('id', deletedImages);

        if (imagesToDelete && imagesToDelete.length > 0) {
          const pathsToDelete = imagesToDelete.map(img => {
            const parts = img.url.split('/products/');
            return parts.length > 1 ? parts[1] : null;
          }).filter(Boolean) as string[];

          if (pathsToDelete.length > 0) {
            await supabase.storage.from('products').remove(pathsToDelete);
          }
        }

        // Delete from DB
        await supabase
          .from('product_images')
          .delete()
          .in('id', deletedImages);
      }
    } catch (e) {
      console.error('Error parsing deleted images', e);
    }
  }

  const primaryImageStr = formData.get('primary_image') as string;

  // Reset is_primary for all existing images if we are setting a new primary
  if (primaryImageStr) {
    await supabase.from('product_images').update({ is_primary: false }).eq('product_id', productId);
  }

  // 2. Handle image uploads
  const imageFiles = formData.getAll('images') as File[];
  
  if (imageFiles.length > 0 && imageFiles[0].size > 0 && productId) {
    let index = 0;
    for (const file of imageFiles) {
      if (file.size === 0) continue;
      
      const isPrimary = primaryImageStr === `new_${index}`;
      index++;
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file);
        
      if (uploadError) {
        console.error('Error uploading image to Supabase Storage:', uploadError.message);
      }
        
      if (!uploadError && uploadData) {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);
          
        // Insert into product_images
        await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            url: urlData.publicUrl,
            is_primary: isPrimary,
          });
      }
    }
  }

  // 3. Set existing image as primary
  if (primaryImageStr && primaryImageStr.startsWith('img_')) {
    const primaryId = primaryImageStr.replace('img_', '');
    await supabase.from('product_images').update({ is_primary: true }).eq('id', primaryId);
  }

  revalidatePath('/admin/productos');
  revalidatePath('/productos');
  
  redirect('/admin/productos');
}
