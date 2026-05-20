-- Habilitar extensión UUID
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. Tablas
-- ==========================================

-- Tabla: profiles (extendiendo auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  address text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

-- Tabla: products
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  material text not null,
  price integer not null,
  stock integer default 0,
  is_active boolean default true,
  is_nomenclature boolean default false,
  letter_product_id uuid references products(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla: product_images
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products on delete cascade not null,
  url text not null,
  is_primary boolean default false,
  sort_order integer default 0
);

-- Tabla: orders
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete set null,
  status text not null default 'pendiente' check (status in ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado')),
  total integer not null,
  shipping_name text not null,
  shipping_phone text not null,
  shipping_address text not null,
  wompi_transaction_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla: order_items
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders on delete cascade not null,
  product_id uuid references products on delete restrict not null,
  quantity integer not null,
  unit_price integer not null,
  subtotal integer not null,
  customization text
);

-- ==========================================
-- 2. Funciones y Triggers (Reglas de Negocio)
-- ==========================================

-- Función para actualizar 'updated_at'
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_products_updated_at
before update on products
for each row execute function update_updated_at_column();

create trigger update_orders_updated_at
before update on orders
for each row execute function update_updated_at_column();

-- Función: Descontar stock al crear order_item
create or replace function deduct_stock_on_order_item()
returns trigger as $$
begin
  update products
  set stock = stock - new.quantity
  where id = new.product_id;
  return new;
end;
$$ language plpgsql;

create trigger deduct_stock_trigger
after insert on order_items
for each row execute function deduct_stock_on_order_item();

-- Función: Restaurar stock si se cancela el pedido
create or replace function handle_cancelled_order()
returns trigger as $$
begin
  if new.status = 'cancelado' and old.status != 'cancelado' then
    update products p
    set stock = p.stock + oi.quantity
    from order_items oi
    where oi.order_id = new.id and p.id = oi.product_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger order_cancelled_trigger
after update on orders
for each row execute function handle_cancelled_order();

-- ==========================================
-- 3. Triggers de Auth (Sincronización)
-- ==========================================

-- Crear perfil automáticamente cuando un usuario se registra en auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================
-- 4. Índices de Rendimiento
-- ==========================================

create index idx_products_material on products (material);
create index idx_products_is_active on products (is_active);
create index idx_orders_user_id on orders (user_id);
create index idx_orders_status on orders (status);
create index idx_order_items_order_id on order_items (order_id);

-- ==========================================
-- 5. Seguridad de Datos (RLS)
-- ==========================================

alter table profiles enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Función de utilidad para verificar si el usuario es admin (evita recursión infinita en RLS)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Políticas: profiles
create policy "Admins can view all profiles" on profiles for select using ( public.is_admin() );
create policy "Users can view own profile" on profiles for select using ( auth.uid() = id );
create policy "Users can update own profile" on profiles for update using ( auth.uid() = id );

-- Políticas: products
create policy "Active products viewable by everyone" on products for select using ( is_active = true );
create policy "Admins view all products" on products for select using ( public.is_admin() );
create policy "Admins insert products" on products for insert with check ( public.is_admin() );
create policy "Admins update products" on products for update using ( public.is_admin() );
create policy "Admins delete products" on products for delete using ( public.is_admin() );

-- Políticas: product_images
create policy "Images viewable by everyone" on product_images for select using ( true );
create policy "Admins insert images" on product_images for insert with check ( public.is_admin() );
create policy "Admins update images" on product_images for update using ( public.is_admin() );
create policy "Admins delete images" on product_images for delete using ( public.is_admin() );

-- Políticas: orders
create policy "Users view own orders" on orders for select using ( auth.uid() = user_id );
create policy "Users create own orders" on orders for insert with check ( auth.uid() = user_id );
create policy "Admins view all orders" on orders for select using ( public.is_admin() );
create policy "Admins update all orders" on orders for update using ( public.is_admin() );

-- Políticas: order_items
create policy "Users view own order items" on order_items for select using ( order_id in (select id from orders where user_id = auth.uid()) );
create policy "Users create own order items" on order_items for insert with check ( order_id in (select id from orders where user_id = auth.uid()) );
create policy "Admins view all order items" on order_items for select using ( public.is_admin() );
