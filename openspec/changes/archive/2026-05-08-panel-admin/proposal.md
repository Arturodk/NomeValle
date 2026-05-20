## Why

El negocio necesita gestionar productos, stock y pedidos sin intervención técnica. Actualmente no existe interfaz para que el administrador actualice el catálogo, cambie estados de pedidos o monitoree la operación — todo dependería de acceso directo a Supabase, lo cual no es sostenible en producción.

## What Changes

- Nueva sección protegida `/admin` accesible solo a usuarios con `role = 'admin'`
- Dashboard con métricas clave de la operación (pedidos recientes, stock bajo, ingresos del día)
- CRUD completo de productos: crear, editar, archivar y gestionar imágenes
- Gestión de pedidos: listado global, vista detalle y cambio de estado
- Middleware de autorización por rol integrado con Supabase Auth
- Route Group `(admin)` con layout propio (sidebar + header) independiente del sitio público

## Capabilities

### New Capabilities

- `admin-dashboard`: Vista principal del panel con KPIs y resumen de actividad reciente
- `admin-productos`: CRUD de productos incluyendo upload de imágenes a Supabase Storage y control de stock/visibilidad
- `admin-pedidos`: Listado global de pedidos con filtros por estado, vista detalle y transiciones de estado

### Modified Capabilities

- `autorizacion-por-rol`: El middleware actual solo distingue usuarios autenticados vs anónimos. Debe extenderse para verificar `role === 'admin'` y redirigir a `/auth/login` o `/403` según corresponda.

## Impact

- **Nuevas rutas**: `/admin`, `/admin/productos`, `/admin/productos/nuevo`, `/admin/productos/[id]/editar`, `/admin/pedidos`, `/admin/pedidos/[id]`
- **Middleware**: `middleware.ts` — añadir lógica de verificación de rol `admin`
- **Supabase RLS**: Políticas de lectura/escritura para admin en todas las tablas (`products`, `product_images`, `orders`, `order_items`)
- **Supabase Storage**: Políticas de upload para el bucket `product-images` desde el servidor
- **Sin cambios de esquema**: Las tablas existentes ya soportan todos los flujos requeridos
