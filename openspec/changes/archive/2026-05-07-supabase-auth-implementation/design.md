## Context

La aplicación "Nomenclaturas del Valle" se basa en Next.js 16 (App Router) y Supabase. Actualmente, las páginas de `/auth/login` y `/auth/registro` utilizan un estado local simulado que no persiste ni protege las rutas reales. Es necesario implementar la arquitectura oficial de `@supabase/ssr` para manejar sesiones tanto en el servidor (Server Components, Middleware) como en el cliente.

## Goals / Non-Goals

**Goals:**
- Implementar el flujo real de Registro e Inicio de Sesión con Email/Password.
- Utilizar `@supabase/ssr` para gestionar la sesión mediante cookies, permitiendo SSR y protección de rutas en el Middleware.
- Sincronizar automáticamente los usuarios de Auth con la tabla `profiles` mediante un trigger de base de datos.
- Proteger las rutas `/cuenta`, `/admin` y `/pago` contra accesos no autenticados.

**Non-Goals:**
- Implementación de login social (Google, Facebook, etc.) en esta fase.
- Personalización de plantillas de correo electrónico de Supabase.
- Gestión avanzada de permisos (solo roles básicos `customer` y `admin`).

## Decisions

- **Middleware para Protección de Rutas:** Se utilizará el archivo `web/proxy.ts` (que actúa como middleware) para refrescar la sesión de Supabase en cada petición y redirigir a `/auth/login` si se intenta acceder a una ruta protegida sin sesión activa.
- **Uso de @supabase/ssr:** Se abandonan los antiguos `auth-helpers` en favor del nuevo paquete `@supabase/ssr`, configurando clientes específicos para Server Components (`createServerClient`) y Browser Components (`createBrowserClient`).
- **Trigger de Perfil en la Base de Datos:** Se creará un trigger en PostgreSQL que escuche el evento `INSERT` en `auth.users` para crear automáticamente el perfil correspondiente en `public.profiles`. Esto garantiza que cada usuario tenga un perfil desde el segundo uno sin lógica adicional en el frontend.

## Risks / Trade-offs

- **Riesgo:** Bucle infinito de redirecciones en el Middleware.
  - **Mitigación:** Asegurar que las rutas `/auth/**` y los archivos estáticos estén excluidos de la lógica de redirección forzosa.
- **Riesgo:** Desincronización de sesión entre cliente y servidor.
  - **Mitigación:** Seguir estrictamente el patrón de "Middleware refresh" documentado por Supabase para mantener las cookies actualizadas.
- **Trade-off:** Complejidad inicial en la configuración de cookies.
  - **Razón:** Es necesario para soportar correctamente el App Router de Next.js y evitar el "flickering" de contenido privado.
