## ADDED Requirements

### Requirement: Listar todos los pedidos
El sistema SHALL mostrar en `/admin/pedidos` una tabla paginada con todos los pedidos de todos los usuarios, ordenados por fecha descendente, incluyendo ID, cliente, total, estado y fecha.

#### Scenario: Admin ve todos los pedidos
- **WHEN** el admin navega a `/admin/pedidos`
- **THEN** el sistema muestra todos los pedidos sin filtrar por usuario

#### Scenario: Filtrar por estado
- **WHEN** el admin selecciona un filtro de estado (pendiente, pagado, enviado, entregado, cancelado)
- **THEN** el sistema muestra solo los pedidos con ese estado

### Requirement: Ver detalle de pedido
El sistema SHALL mostrar en `/admin/pedidos/[id]` el detalle completo de un pedido: datos del cliente, dirección de envío, ítems con cantidades y precios, total y estado actual.

#### Scenario: Detalle visible
- **WHEN** el admin navega a `/admin/pedidos/[id]`
- **THEN** el sistema muestra todos los datos del pedido incluyendo los `order_items` con nombres de producto

#### Scenario: Pedido no encontrado
- **WHEN** el ID del pedido no existe
- **THEN** el sistema redirige al listado con mensaje de error

### Requirement: Cambiar estado de pedido
El sistema SHALL permitir al admin cambiar el estado de un pedido siguiendo el flujo: `pendiente → pagado → enviado → entregado` o `pagado → cancelado`.

#### Scenario: Transición válida de estado
- **WHEN** el admin selecciona un nuevo estado válido y confirma
- **THEN** el sistema actualiza el campo `status` en `orders` y refleja el cambio en la UI

#### Scenario: Transición inválida bloqueada
- **WHEN** el admin intenta una transición no permitida (ej: `entregado → pendiente`)
- **THEN** el sistema no muestra esa opción como disponible (la UI solo expone transiciones válidas)

### Requirement: Autorización por rol para rutas admin
El sistema SHALL verificar que el usuario autenticado tenga `role = 'admin'` antes de renderizar cualquier página del panel admin.

#### Scenario: Admin autorizado accede sin problema
- **WHEN** usuario con `role = 'admin'` accede a cualquier ruta bajo `/admin`
- **THEN** el sistema renderiza la página correctamente

#### Scenario: Customer intenta acceder al admin
- **WHEN** usuario con `role = 'customer'` intenta acceder a `/admin`
- **THEN** el sistema redirige a `/auth/login`

#### Scenario: Usuario anónimo intenta acceder al admin
- **WHEN** un usuario sin sesión intenta acceder a `/admin`
- **THEN** el sistema redirige a `/auth/login`
