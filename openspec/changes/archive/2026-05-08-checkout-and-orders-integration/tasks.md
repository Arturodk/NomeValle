## 1. Checkout Dinámico
- [x] 1.1 Modificar `web/app/pago/page.tsx` para obtener el usuario autenticado.
- [x] 1.2 Cargar y pre-llenar los campos `name` y `phone` desde la tabla `profiles`.
- [x] 1.3 Asegurar que el Middleware redirige a Login si un usuario no autenticado intenta entrar a `/pago`.

## 2. Persistencia de Pedidos
- [x] 2.1 Implementar la lógica de inserción en la tabla `orders` al confirmar el pago.
- [x] 2.2 Implementar la inserción de múltiples ítems en la tabla `order_items`.
- [x] 2.3 Manejar estados de carga y posibles errores (ej. fallo en la red o stock insuficiente).

## 3. Historial de Pedidos Dinámico
- [x] 3.1 Refactorizar `web/app/cuenta/pedidos/page.tsx` para obtener los pedidos reales desde Supabase.
- [x] 3.2 Implementar la consulta con join para obtener los ítems de cada pedido.
- [x] 3.3 Formatear los datos dinámicos en la UI de las tarjetas de pedido.

## 4. Validación y Cierre
- [x] 4.1 Realizar una compra de prueba y verificar que aparece en el historial.
- [x] 4.2 Validar que el carrito se limpie correctamente tras un pedido exitoso.
- [x] 4.3 Sincronizar delta specs con el spec principal.
