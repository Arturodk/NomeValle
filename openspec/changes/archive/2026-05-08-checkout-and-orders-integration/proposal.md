# Propuesta: Integración de Checkout e Historial de Pedidos

## Problema
Actualmente, el flujo de compra (`/pago`) y el historial de pedidos (`/cuenta/pedidos`) utilizan datos estáticos (mock data). Esto impide que los usuarios reales realicen compras vinculadas a su cuenta y que puedan hacer seguimiento de sus pedidos.

## Solución Propuesta
Integrar el sistema de base de datos de Supabase con el flujo de carrito y pago.

1.  **Checkout Dinámico:** Al entrar en `/pago`, el sistema recuperará el nombre y teléfono del perfil del usuario para pre-llenar el formulario.
2.  **Persistencia de Pedidos:** Al confirmar el pago (simulado por ahora), se creará un registro en la tabla `orders` y sus respectivos ítems en `order_items`.
3.  **Historial de Pedidos:** La página `/cuenta/pedidos` consultará la tabla `orders` filtrando por el ID del usuario autenticado.

## Impacto
- Mejora la experiencia de usuario al no pedir datos que ya el sistema conoce.
- Establece la base de datos real para la gestión de pedidos.
- Prepara el terreno para la Fase 3 (Integración real con Wompi).

## Riesgos
- Conflictos de stock si varios usuarios compran el mismo producto simultáneamente (se manejará con triggers de DB).
- Errores de integridad si la transacción de creación de pedido falla a mitad de camino.
