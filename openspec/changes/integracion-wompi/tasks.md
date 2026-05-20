## 1. Preparación y Configuración

- [x] 1.1 Configurar variables de entorno en `.env.local` (`NEXT_PUBLIC_WOMPI_PUBLIC_KEY` y `WOMPI_INTEGRITY_SECRET`).
- [x] 1.2 Inyectar el script del Widget de Wompi en el layout o componente de pago usando `next/script`.

## 2. Lógica de Seguridad (Backend)

- [x] 2.1 Crear la API Route `web/app/api/wompi/integrity/route.ts` para la generación de firmas.
- [x] 2.2 Implementar el algoritmo SHA256 para concatenar `referencia + monto + moneda + secreto`.
- [x] 2.3 Validar que el endpoint responda correctamente con la firma generada.

## 3. Integración en el Checkout (Frontend)

- [x] 3.1 Modificar `web/app/pago/page.tsx` para detener la simulación y solicitar la firma de integridad.
- [x] 3.2 Implementar el manejador del Widget de Wompi pasando la referencia del pedido recién creado.
- [x] 3.3 Configurar la `redirectUrl` para apuntar a nuestra página de confirmación.

## 4. Cierre de Transacción y Feedback

- [x] 4.1 Refactorizar `web/app/pago/confirmacion/page.tsx` para capturar el `id` de transacción de Wompi.
- [x] 4.2 Implementar la validación del estado del pago consultando la API de Wompi (vía servidor).
- [x] 4.3 Actualizar el registro en Supabase (`status`, `wompi_transaction_id`) basándose en el resultado real.
- [x] 4.4 Asegurar la limpieza del carrito solo si la transacción fue exitosa.
- [ ] 4.5 Realizar pruebas manuales con credenciales reales para validar el flujo completo de pago y actualización de estado.
