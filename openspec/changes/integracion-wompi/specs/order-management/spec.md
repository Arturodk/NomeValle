# Spec Delta: Order Management

## ADDED Requirements

### Requirement: Trazabilidad de Pago Externo
El sistema debe almacenar el vínculo técnico con la pasarela de pagos para auditoría y conciliación.

#### Scenario: Registro de ID de Wompi
- **WHEN** Una transacción es aprobada por Wompi y el pedido se actualiza en el sistema.
- **THEN** El campo `wompi_transaction_id` en la tabla `orders` debe persistir el identificador único de la pasarela.
