## ADDED Requirements

### Requirement: Registro de usuario
El sistema DEBE permitir a los nuevos usuarios crear una cuenta proporcionando un correo electrónico único, una contraseña segura (mínimo 6 caracteres) y su nombre completo. Al registrarse, el sistema SHALL crear automáticamente un registro en la tabla `profiles` vinculando el `id` del usuario de Auth con su perfil público.

#### Scenario: Registro exitoso
- **WHEN** un usuario nuevo completa el formulario de registro con datos válidos
- **THEN** el sistema crea la cuenta en Supabase, inicializa su perfil en la base de datos y lo redirige a la página de bienvenida o cuenta.

### Requirement: Inicio de sesión
El sistema DEBE permitir que los usuarios registrados accedan a su cuenta mediante sus credenciales de correo electrónico y contraseña. La sesión SHALL persistir mediante el uso de cookies seguras gestionadas por `@supabase/ssr`.

#### Scenario: Login exitoso como cliente
- **WHEN** un usuario con rol 'customer' ingresa sus credenciales correctas
- **THEN** el sistema establece la sesión de Supabase y redirige al usuario a `/cuenta`.

#### Scenario: Login exitoso como administrador
- **WHEN** un usuario con rol 'admin' ingresa sus credenciales correctas
- **THEN** el sistema establece la sesión de Supabase y redirige al usuario a `/admin`.

### Requirement: Protección de rutas (Middleware)
El sistema SHALL interceptar las peticiones a rutas protegidas (`/cuenta/**`, `/admin/**`, `/pago`) mediante un Middleware. Si el usuario no está autenticado, SHALL ser redirigido a `/auth/login`. Si un usuario autenticado intenta acceder a `/admin` sin el rol necesario, SHALL ser redirigido a la página de inicio.

#### Scenario: Intento de acceso anónimo a cuenta
- **WHEN** un usuario no autenticado intenta navegar directamente a `/cuenta`
- **THEN** el Middleware detecta la falta de sesión y redirige al usuario a `/auth/login`.

### Requirement: Cierre de sesión
El sistema DEBE proporcionar una funcionalidad para que los usuarios autenticados cierren su sesión de forma segura, eliminando todas las cookies de autenticación activas.

#### Scenario: Logout desde el header
- **WHEN** un usuario autenticado hace clic en el botón "Cerrar Sesión"
- **THEN** el sistema invalida la sesión en Supabase, limpia las cookies locales y redirige al usuario a la página de inicio.
