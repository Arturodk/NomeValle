-- Primero, eliminamos las políticas problemáticas (si existen)
drop policy if exists "Admins can view all profiles" on profiles;
drop policy if exists "Admins view all products" on products;
drop policy if exists "Admins insert products" on products;
drop policy if exists "Admins update products" on products;
drop policy if exists "Admins delete products" on products;
drop policy if exists "Admins insert images" on product_images;
drop policy if exists "Admins update images" on product_images;
drop policy if exists "Admins delete images" on product_images;
drop policy if exists "Admins view all orders" on orders;
drop policy if exists "Admins update all orders" on orders;
drop policy if exists "Admins view all order items" on order_items;

-- Función segura para verificar si es admin sin causar recursión infinita
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Recreamos las políticas corregidas
create policy "Admins can view all profiles" on profiles for select using ( public.is_admin() );

create policy "Admins view all products" on products for select using ( public.is_admin() );
create policy "Admins insert products" on products for insert with check ( public.is_admin() );
create policy "Admins update products" on products for update using ( public.is_admin() );
create policy "Admins delete products" on products for delete using ( public.is_admin() );

create policy "Admins insert images" on product_images for insert with check ( public.is_admin() );
create policy "Admins update images" on product_images for update using ( public.is_admin() );
create policy "Admins delete images" on product_images for delete using ( public.is_admin() );

create policy "Admins view all orders" on orders for select using ( public.is_admin() );
create policy "Admins update all orders" on orders for update using ( public.is_admin() );

create policy "Admins view all order items" on order_items for select using ( public.is_admin() );
