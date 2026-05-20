## MODIFIED Requirements

### Requirement: Formulario de checkout
La página `/pago` DEBE recuperar la información del perfil del usuario (`full_name`, `phone`) desde Supabase al cargar. Si estos datos existen, el formulario SHALL aparecer como pre-llenado para agilizar la compra.

### Requirement: Creación del pedido en Supabase
Al enviar el formulario de pago, el sistema DEBE:
1.  Crear una transacción en la base de datos.
2.  Insertar un registro en la tabla `orders` con el `user_id` del usuario autenticado, `status = 'pendiente'`, y el `total` calculado.
3.  Insertar los ítems del carrito en la tabla `order_items` vinculados al `order_id` creado.
4.  El sistema SHALL capturar el precio actual del producto en el momento de la inserción (`unit_price`).

### Requirement: Historial de Pedidos Dinámico
La página `/cuenta/pedidos` DEBE consultar la tabla `orders` de Supabase filtrando por el `user_id` del usuario actual. Los resultados SHALL mostrarse ordenados por fecha descendente, incluyendo el estado del pedido y el total.

#### Scenario: Visualización de pedidos propios
- **GIVEN** que el usuario ha realizado pedidos anteriormente
- **WHEN** accede a `/cuenta/pedidos`
- **THEN** el sistema muestra una lista de sus pedidos con su estado actual (pendiente, pagado, etc.) y no muestra pedidos de otros usuarios.
