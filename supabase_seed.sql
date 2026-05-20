-- supabase_seed.sql
-- Datos iniciales para la tienda "Nomenclaturas del Valle"

-- 1. Insertamos productos
INSERT INTO public.products (id, name, description, material, price, stock, is_active)
VALUES 
  ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Nomenclatura Clásica Bronce', 'Elegante nomenclatura en bronce fundido, ideal para exteriores clásicos. Resistente a la intemperie.', 'bronce', 120000, 15, true),
  ('b2c3d4e5-f6a7-8901-2345-678901bcdefa', 'Placa Moderna Aluminio', 'Diseño minimalista en aluminio cepillado. Perfecta para conjuntos residenciales modernos.', 'aluminio', 85000, 30, true),
  ('c3d4e5f6-a7b8-9012-3456-789012cdefab', 'Nomenclatura Acrílico Negro', 'Acrílico de alto impacto con números en relieve blanco. Estilo contemporáneo y alta visibilidad.', 'acrílico', 65000, 50, true),
  ('d4e5f6a7-b8c9-0123-4567-890123defabc', 'Placa Metálica Industrial', 'Acero inoxidable cortado en láser con tipografía industrial.', 'metálico', 110000, 10, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Insertamos imágenes de los productos
INSERT INTO public.product_images (product_id, url, is_primary, sort_order)
VALUES 
  ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'https://placehold.co/600x600/b87333/ffffff?text=Bronce+Clasica', true, 1),
  ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'https://placehold.co/600x600/b87333/ffffff?text=Bronce+Detalle', false, 2),
  
  ('b2c3d4e5-f6a7-8901-2345-678901bcdefa', 'https://placehold.co/600x600/c0c0c0/000000?text=Aluminio+Moderna', true, 1),
  
  ('c3d4e5f6-a7b8-9012-3456-789012cdefab', 'https://placehold.co/600x600/222222/ffffff?text=Acrilico+Negro', true, 1),
  
  ('d4e5f6a7-b8c9-0123-4567-890123defabc', 'https://placehold.co/600x600/777777/ffffff?text=Metalica+Industrial', true, 1)
ON CONFLICT DO NOTHING;
