# Spec: wompi-payments

## ADDED Requirements

### Requirement: Integridad de Transacción (Firma SHA256)
El sistema debe garantizar que los parámetros de pago (monto, referencia, moneda) no han sido alterados entre el cliente y la pasarela.

#### Scenario: Generación de firma en servidor
- **WHEN** El componente de checkout solicita iniciar un pago para el pedido `ID_PEDIDO` con monto `TOTAL`.
- **THEN** Una API Route segura devuelve el hash SHA256 generado con la `WOMPI_INTEGRITY_SECRET`.

### Requirement: Interfaz de Pago Embebida (Widget)
El usuario debe poder realizar el pago mediante el Widget oficial de Wompi inyectado en el DOM.

#### Scenario: Lanzamiento del widget
- **WHEN** El pedido se ha creado exitosamente en la base de datos y se tiene la firma de integridad.
- **THEN** Se invoca el script de Wompi pasando la `WOMPI_PUBLIC_KEY` y los datos del pedido.

### Requirement: Sincronización de Resultado de Transacción
El sistema debe capturar el resultado de la transacción devuelto por Wompi y actualizar el pedido correspondiente.

#### Scenario: Redirección post-pago exitoso
- **WHEN** El usuario completa el pago y es redirigido a `/pago/confirmacion?id=ID_TRANSACCION`.
- **THEN** El sistema consulta la API de Wompi, verifica que el estado sea `APPROVED` y actualiza el pedido a `pagado` en Supabase.
