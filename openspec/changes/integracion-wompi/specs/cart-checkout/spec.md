# Spec Delta: Cart & Checkout

## ADDED Requirements

### Requirement: Integración de Pago Real (Wompi Widget)
Sustitución de la lógica simulada por una integración robusta con la pasarela Wompi.

#### Scenario: Transición de Checkout a Pago
- **WHEN** El usuario confirma el pedido y este se guarda exitosamente en Supabase.
- **THEN** El checkout obtiene una firma de integridad del servidor y lanza el Widget de Wompi embebido.

#### Scenario: Manejo de Respuesta de Transacción
- **WHEN** El usuario es redirigido de vuelta a `/pago/confirmacion` tras el pago.
- **THEN** La página valida el ID de transacción con Wompi antes de mostrar el mensaje de éxito y limpiar el carrito.
