-- ============================================================
-- RLS Policies for Admin Panel (panel-admin change)
-- Run in Supabase SQL Editor
-- ============================================================

-- Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- PRODUCTS table
-- ============================================================

-- Admin can read ALL products (including inactive)
DROP POLICY IF EXISTS "admin_read_all_products" ON products;
CREATE POLICY "admin_read_all_products"
  ON products FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin can insert products
DROP POLICY IF EXISTS "admin_insert_products" ON products;
CREATE POLICY "admin_insert_products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin can update products
DROP POLICY IF EXISTS "admin_update_products" ON products;
CREATE POLICY "admin_update_products"
  ON products FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin can delete products (soft delete via is_active preferred)
DROP POLICY IF EXISTS "admin_delete_products" ON products;
CREATE POLICY "admin_delete_products"
  ON products FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- PRODUCT_IMAGES table
-- ============================================================

-- Admin can manage all product images
DROP POLICY IF EXISTS "admin_read_all_product_images" ON product_images;
CREATE POLICY "admin_read_all_product_images"
  ON product_images FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "admin_insert_product_images" ON product_images;
CREATE POLICY "admin_insert_product_images"
  ON product_images FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_update_product_images" ON product_images;
CREATE POLICY "admin_update_product_images"
  ON product_images FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_product_images" ON product_images;
CREATE POLICY "admin_delete_product_images"
  ON product_images FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- ORDERS table
-- ============================================================

-- Admin can read ALL orders (customers can only read their own)
DROP POLICY IF EXISTS "admin_read_all_orders" ON orders;
CREATE POLICY "admin_read_all_orders"
  ON orders FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin can update order status
DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- ORDER_ITEMS table
-- ============================================================

-- Admin can read all order items
DROP POLICY IF EXISTS "admin_read_all_order_items" ON order_items;
CREATE POLICY "admin_read_all_order_items"
  ON order_items FOR SELECT
  TO authenticated
  USING (is_admin());

-- ============================================================
-- PROFILES table
-- ============================================================

-- Admin can read all profiles (for showing customer names in orders)
DROP POLICY IF EXISTS "admin_read_all_profiles" ON profiles;
CREATE POLICY "admin_read_all_profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_admin());

-- ============================================================
-- STORAGE: product-images bucket
-- Allow server-side uploads (service_role bypasses RLS anyway,
-- but this documents the intent for anon/authenticated uploads)
-- ============================================================

-- Allow admin users to upload images
DROP POLICY IF EXISTS "admin_upload_product_images" ON storage.objects;
CREATE POLICY "admin_upload_product_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images' AND 
    public.is_admin()
  );

-- Allow admin to delete images from storage
DROP POLICY IF EXISTS "admin_delete_product_images" ON storage.objects;
CREATE POLICY "admin_delete_product_images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images' AND 
    public.is_admin()
  );
