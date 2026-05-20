## ADDED Requirements

### Requirement: Dashboard muestra métricas clave
El sistema SHALL mostrar en `/admin` un dashboard con: total de pedidos del día, pedidos pendientes, productos con stock bajo (< 5 unidades) e ingresos del día.

#### Scenario: Admin accede al dashboard
- **WHEN** un usuario con `role = 'admin'` navega a `/admin`
- **THEN** el sistema muestra el dashboard con las 4 métricas actualizadas desde la DB

#### Scenario: Usuario sin rol admin intenta acceder
- **WHEN** un usuario con `role = 'customer'` (o sin sesión) navega a `/admin`
- **THEN** el sistema redirige a `/auth/login`

### Requirement: Dashboard muestra pedidos recientes
El sistema SHALL mostrar en el dashboard los últimos 5 pedidos con su estado, cliente y total.

#### Scenario: Pedidos recientes visibles
- **WHEN** existen pedidos en la base de datos
- **THEN** el dashboard muestra los 5 más recientes ordenados por fecha descendente

#### Scenario: Sin pedidos aún
- **WHEN** no existen pedidos en la base de datos
- **THEN** el dashboard muestra un estado vacío con mensaje informativo
