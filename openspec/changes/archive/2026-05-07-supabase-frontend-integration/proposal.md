## Why

El esquema de base de datos de Supabase fue creado exitosamente mediante el script SQL. Ahora necesitamos conectar el frontend (Next.js) con esta base de datos real para dejar de usar los datos de prueba estáticos (mock data). Esto es necesario para habilitar el catálogo dinámico de productos y preparar la aplicación para la siguiente fase: la gestión de carritos, pedidos y pagos reales.

## What Changes

- Creación de tipos de TypeScript manuales basados en el esquema SQL para mantener consistencia de datos en el cliente (`web/types/supabase.ts`).
- Reemplazo de los datos estáticos (`mockProducts`) en la página principal (`web/app/page.tsx`) por consultas directas a Supabase usando el cliente de servidor.
- Actualización de la página de catálogo (`web/app/productos/page.tsx`) para listar todos los productos desde la tabla `products`.
- Modificación de la vista de detalle de producto (`web/app/productos/[id]/page.tsx`) para buscar la información del producto y sus imágenes en Supabase.
- Creación de un script SQL de datos iniciales (seed data) que insertará algunos productos de prueba en Supabase para poder visualizarlos en la interfaz.

## Capabilities

### New Capabilities
- `database-types`: Definición de los tipos y las interfaces de TypeScript correspondientes al esquema de Supabase para asegurar seguridad de tipos (type-safety) en el frontend.
- `database-seeding`: Creación de un script SQL para popular la base de datos con datos de prueba iniciales (productos e imágenes).

### Modified Capabilities
- `product-catalog`: Requerimientos modificados para incluir llamadas asíncronas y recuperación de datos directamente de la base de datos Supabase en lugar del uso de constantes locales en memoria.

## Impact

- **Código Afectado**: `web/app/page.tsx`, `web/app/productos/page.tsx`, `web/app/productos/[id]/page.tsx`.
- **Dependencias**: Se hará uso intensivo de `@supabase/ssr` (que ya está instalado).
- **Sistemas**: La aplicación web ahora requerirá conexión constante a Internet y a los servicios de Supabase para cargar el contenido esencial.
