-- 1. Añadir campos a la tabla products
ALTER TABLE public.products
ADD COLUMN is_nomenclature BOOLEAN DEFAULT false,
ADD COLUMN letter_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL;

-- 2. Añadir campo a la tabla order_items
ALTER TABLE public.order_items
ADD COLUMN customization TEXT;
