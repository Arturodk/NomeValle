## 1. Configuración de Infraestructura de Auth

- [x] 1.1 Instalar dependencias necesarias: `@supabase/ssr` y `@supabase/supabase-js`.
- [x] 1.2 Crear utilidades de Supabase para el App Router (`web/utils/supabase/server.ts` y `web/utils/supabase/client.ts`).
- [x] 1.3 Configurar el Middleware en `web/proxy.ts` para actualizar sesiones y proteger rutas privadas (`/cuenta`, `/admin`, `/pago`).

## 2. Base de Datos y Triggers

- [x] 2.1 Crear función y trigger en PostgreSQL para la creación automática de perfiles en `public.profiles` al registrarse en Auth.
- [x] 2.2 Verificar y ajustar políticas RLS en la tabla `profiles` para permitir lectura/escritura del propio perfil por el usuario autenticado.

## 3. Implementación de Formularios (Login y Registro)

- [x] 3.1 Refactorizar `web/app/auth/login/page.tsx` para realizar la autenticación real con Supabase Auth.
- [x] 3.2 Implementar `web/app/auth/registro/page.tsx` (o refactorizar si existe) para el registro de nuevos usuarios.
- [x] 3.3 Implementar manejo de errores (credenciales inválidas, email duplicado) en los formularios de UI.

## 4. Sesión y Header UI

- [x] 4.1 Actualizar el componente de navegación principal para mostrar el estado de sesión (Nombre del usuario / Botón Ingresar).
- [x] 4.2 Implementar la funcionalidad de Logout en el Header con limpieza de cookies y redirección.

## 5. Validación de Requisitos

- [x] 5.1 Verificar que el registro crea correctamente el registro en `profiles`.
- [x] 5.2 Validar que el Middleware bloquea el acceso anónimo a `/cuenta`.
- [x] 5.3 Validar que el rol de 'admin' permite el acceso a `/admin` (si existe la ruta) y el rol 'customer' no.
