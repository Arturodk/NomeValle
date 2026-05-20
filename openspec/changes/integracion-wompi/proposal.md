# Propuesta: Integración de Pasarela de Pagos Wompi

## Why

Actualmente, el flujo de compra de Nomenclaturas del Valle termina en una simulación. Para que el proyecto sea un e-commerce real y funcional, es imperativo integrar una pasarela de pagos que permita transacciones verídicas en Colombia. Se ha seleccionado Wompi (de Bancolombia) por su facilidad de integración y soporte para métodos de pago locales como PSE y Nequi.

## What Changes

- **Flujo de Pago Real:** Sustitución de la lógica de confirmación simulada por la invocación al Widget de Wompi.
- **Seguridad y Validación:** Implementación de firmas de integridad en el servidor para prevenir fraudes.
- **Sincronización de Estados:** Los pedidos en la tabla `orders` se actualizarán automáticamente según el estado de la transacción en Wompi (APPROVED, DECLINED, VOIDED).
- **Página de Confirmación Dinámica:** Mejora de la pantalla de éxito/error basada en los parámetros reales devueltos por la pasarela.

## Capabilities

### New Capabilities
- `wompi-payments`: Gestión técnica de la integración con Wompi, incluyendo configuración de llaves, scripts del widget y manejo de eventos.

### Modified Capabilities
- `cart-checkout`: El cierre del carrito ahora se dispara tras la confirmación exitosa de la pasarela.
- `order-management`: Se añade la trazabilidad de transacciones externas vinculadas a cada pedido.

## Impact

- **Seguridad:** Requiere manejo cuidadoso de Secrets (Private Key) en el servidor.
- **UX:** Cambio en la transición del checkout al widget y de regreso a la tienda.
- **Base de Datos:** Actualización de campos como `wompi_transaction_id` en la tabla `orders`.
