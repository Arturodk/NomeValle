## MODIFIED Requirements

### Requirement: Autorización de rutas protegidas
El middleware SHALL verificar autenticación para rutas bajo `/pago`, `/cuenta`, y `/admin`. Para rutas bajo `/admin`, además SHALL verificar que el perfil del usuario tenga `role = 'admin'`. Si la autenticación falla, redirige a `/auth/login`. Si el rol falla, redirige a `/auth/login` con parámetro `?error=unauthorized`.

#### Scenario: Usuario autenticado como customer accede a `/pago`
- **WHEN** usuario con `role = 'customer'` accede a `/pago`
- **THEN** el sistema permite el acceso

#### Scenario: Usuario autenticado como customer accede a `/admin`
- **WHEN** usuario con `role = 'customer'` accede a `/admin`
- **THEN** el sistema redirige a `/auth/login?error=unauthorized`

#### Scenario: Usuario no autenticado accede a ruta protegida
- **WHEN** usuario sin sesión accede a `/pago`, `/cuenta` o `/admin`
- **THEN** el sistema redirige a `/auth/login`

#### Scenario: Admin accede a `/admin`
- **WHEN** usuario con `role = 'admin'` accede a `/admin`
- **THEN** el sistema permite el acceso y renderiza el dashboard
