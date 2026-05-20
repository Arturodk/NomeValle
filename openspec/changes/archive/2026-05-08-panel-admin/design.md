## Context

Nomenclaturas del Valle tiene un catálogo activo en Supabase con 5 tablas (`profiles`, `products`, `product_images`, `orders`, `order_items`) y auth por roles (`customer` / `admin`). El sitio público ya funciona con datos reales. Falta la capa de administración que permita operar el negocio sin acceso directo a la base de datos.

El middleware de Next.js actual protege rutas autenticadas pero no distingue roles. El panel admin requiere extender esta lógica.

## Goals / Non-Goals

**Goals:**
- Panel embebido en `/admin` con Route Group `(admin)` y layout propio (sidebar)
- Middleware que valide `role === 'admin'` usando el perfil de Supabase
- CRUD completo de productos con upload de imágenes a Supabase Storage
- Gestión de pedidos con transiciones de estado
- Dashboard con KPIs básicos de la operación

**Non-Goals:**
- Multi-tenancy o múltiples roles de admin (ej: "editor" vs "super-admin")
- Analytics avanzados o reportes exportables (fuera del alcance inicial)
- Panel de administración de usuarios/clientes
- Gestión de cupones o descuentos

## Decisions

### 1. Route Group `(admin)` con layout independiente
**Decisión:** Crear `app/(admin)/admin/layout.tsx` con su propio sidebar y header, separado del layout del sitio público.  
**Alternativa considerada:** Usar un subdirectorio simple sin Route Group.  
**Razón:** El Route Group permite layouts completamente distintos sin contaminar las rutas del sitio (`/admin` vs `/`). El sidebar del admin no debe heredar el header/footer del e-commerce.

### 2. Verificación de rol en middleware + Server Components
**Decisión:** El `middleware.ts` verifica autenticación. La verificación de `role === 'admin'` se hace en el layout del Route Group con una Server Action o llamada a Supabase.  
**Alternativa considerada:** Verificar todo en middleware.  
**Razón:** El middleware de Next.js no puede hacer llamadas a la DB eficientemente. El layout del admin puede hacer `getUser()` + `getProfile()` server-side y redirigir a `/auth/login` si no es admin, manteniendo SSR limpio.

### 3. Upload de imágenes: Server Action + Supabase Storage
**Decisión:** El upload de imágenes va por una Server Action que usa el cliente Supabase con `service_role` key solo en el servidor.  
**Alternativa considerada:** Upload directo desde el cliente con signed URLs.  
**Razón:** Simplifica el flujo, evita exponer keys en el cliente y centraliza la lógica de validación de archivos.

### 4. Operaciones de stock en trigger Supabase (existente)
**Decisión:** El decremento de stock sigue siendo responsabilidad del trigger de Supabase, no del panel admin.  
**Razón:** Consistencia con la regla del proyecto. El admin solo modifica `stock` directamente en productos (ajuste manual), no via triggers de pedidos.

### 5. Políticas RLS para admin
**Decisión:** Añadir políticas `FOR ALL` con `USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))` para las tablas `products`, `product_images`, `orders`.  
**Alternativa considerada:** Desactivar RLS para el admin usando `service_role`.  
**Razón:** Mantener RLS activo en todas las operaciones es más seguro y auditable. El `service_role` solo se usa para Storage uploads.

## Risks / Trade-offs

- **Riesgo: Sesión de admin no actualizada tras cambio de rol** → El JWT de Supabase se actualiza con la sesión. Si se cambia el rol en DB manualmente, el usuario debe re-autenticarse. Mitigación: Documentar este comportamiento; en esta etapa es suficiente.
- **Riesgo: Images orphans en Storage** → Si falla la inserción en `product_images` después del upload al bucket, la imagen queda huérfana. Mitigación: Hacer el upload y la inserción en la misma Server Action con manejo de error y cleanup.
- **Trade-off: Sin paginación avanzada en v1** → Los listados de productos y pedidos usarán paginación simple (limit/offset). Suficiente para el volumen inicial del negocio.
