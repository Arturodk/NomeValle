## Why

Actualmente, la aplicación utiliza una lógica de autenticación simulada (mock). Para avanzar hacia una versión de producción, es necesario implementar un sistema de autenticación real, seguro y persistente que se integre con Supabase Auth y gestione correctamente los roles de usuario (`customer` y `admin`).

## What Changes

- Reemplazo de la lógica de login y registro simulada por llamadas reales a la API de Supabase Auth.
- Implementación de sesiones persistentes mediante el uso de `@supabase/ssr` y cookies de Next.js.
- Configuración del Middleware de Next.js para proteger rutas privadas (`/cuenta`, `/admin`, `/pago`).
- Vinculación automática entre los usuarios de Supabase Auth y la tabla `profiles` de la base de datos mediante triggers de PostgreSQL.
- Actualización de los componentes de UI (Header, formularios de Auth) para reflejar el estado de autenticación real.

## Capabilities

### New Capabilities
- `supabase-auth`: Gestión completa del ciclo de vida de la autenticación (registro, login, recuperación de contraseña, logout) y control de acceso basado en roles.

### Modified Capabilities
- `database-types`: Actualización de los tipos de TypeScript para incluir las definiciones de sesión y perfiles de usuario autenticado.

## Impact

- **Archivos de Auth:** `web/app/auth/login/page.tsx` y `web/app/auth/registro/page.tsx`.
- **Middleware:** `web/proxy.ts` (configuración de sesión y protección de rutas).
- **Librería de Supabase:** `web/lib/supabase/client.ts` y `web/lib/supabase/server.ts`.
- **Base de Datos:** Tabla `profiles` y triggers de creación automática de perfil en Supabase.
- **Header:** Componente de navegación para mostrar el nombre del usuario o botón de ingreso.
