# Spec: Product Images

## Descripción
Gestión de imágenes de productos almacenadas en Supabase Storage. Un producto puede tener múltiples imágenes. Una de ellas es la primaria (`is_primary = true`), que se muestra en el catálogo.

## Requisitos

### R1: Almacenamiento
- Las imágenes se guardan en Supabase Storage en el bucket `product-images`.
- La URL pública de cada imagen se guarda en la tabla `product_images.url`.
- Formato recomendado: WebP para mejor rendimiento.
- Ruta en Storage: `product-images/{product_id}/{filename}.webp`

### R2: Imagen primaria
- Cada producto DEBE tener exactamente una imagen con `is_primary = true`.
- Si un producto tiene múltiples imágenes, solo la primaria aparece en las tarjetas del catálogo.
- En la página de detalle, se muestran todas las imágenes ordenadas por `sort_order ASC`.

### R3: Galería en detalle de producto
- La galería muestra la imagen seleccionada en grande y las demás como miniaturas.
- Al hacer clic en una miniatura, la imagen grande cambia (estado client-side, sin fetch).
- Si el producto tiene solo una imagen, no se muestran miniaturas.

### R4: Upload desde admin (Phase 4)
- El admin puede subir imágenes desde el panel de administración.
- Se permiten múltiples imágenes por producto.
- Al subir, se puede marcar cuál es la imagen primaria.
- Al eliminar la imagen primaria, el sistema asigna automáticamente la primera imagen restante como primaria.

### R5: Fallback
- Si un producto no tiene imágenes, se muestra un placeholder con el ícono del material.
- El placeholder usa los colores del sistema de diseño (variables CSS).

## Escenarios

### Escenario: Galería con múltiples imágenes
- **GIVEN** que un producto tiene 3 imágenes con `sort_order` 0, 1, 2
- **WHEN** el usuario visita la página de detalle
- **THEN** ve la imagen con `is_primary = true` en grande y las otras 2 como miniaturas clicables

### Escenario: Cambio de imagen en galería
- **GIVEN** que el usuario está viendo la imagen primaria
- **WHEN** hace clic en la segunda miniatura
- **THEN** la imagen grande cambia a la miniatura seleccionada sin recargar la página

### Escenario: Producto sin imágenes
- **GIVEN** que un producto no tiene registros en `product_images`
- **WHEN** aparece en el catálogo o en la página de detalle
- **THEN** muestra un placeholder con un ícono del material correspondiente
