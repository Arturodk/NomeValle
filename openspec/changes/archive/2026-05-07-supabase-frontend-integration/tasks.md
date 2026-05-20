## 1. Definición de Tipos

- [x] 1.1 Crear el archivo `web/types/supabase.ts` definiendo manualmente las interfaces de TypeScript (como `Database` y `Product`) basándose en el esquema SQL de Supabase.

## 2. Inserción de Datos Iniciales (Seeding)

- [x] 2.1 Escribir el script SQL `supabase_seed.sql` que contenga sentencias `INSERT` para poblar las tablas `products` y `product_images` con al menos 3 productos de prueba variados (aluminio, bronce, etc).

## 3. Integración en Frontend (Catálogo)

- [x] 3.1 Actualizar `web/app/page.tsx` para hacer fetching de los productos usando el cliente de servidor de Supabase en vez de los datos estáticos, y renderizar la sección de destacados.
- [x] 3.2 Actualizar `web/app/productos/page.tsx` para obtener todos los productos activos de Supabase mediante un Server Component, garantizando que el filtro en el cliente siga funcionando.
- [x] 3.3 Actualizar `web/app/productos/[id]/page.tsx` para recuperar la información específica de un producto y su arreglo de imágenes (`product_images`) desde la base de datos de Supabase, reemplazando el `find()` sobre el mock local.
