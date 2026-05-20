-- Actualizar las URLs de imágenes para usar placehold.co en lugar de via.placeholder.com
UPDATE public.product_images
SET url = REPLACE(url, 'via.placeholder.com', 'placehold.co');
