# Diseño Técnico: Integración con Wompi

## Context

El e-commerce de Nomenclaturas del Valle utiliza un stack basado en Next.js y Supabase. Actualmente, el proceso de compra registra el pedido en la base de datos pero no procesa un pago real. Wompi es la pasarela elegida para operar en el mercado colombiano, requiriendo una integración que garantice la integridad de los datos financieros.

## Goals / Non-Goals

**Goals:**
- Integrar el widget de pagos de Wompi de forma fluida en la página de `/pago`.
- Implementar la generación de firmas de integridad en el servidor (Next.js API Route).
- Actualizar el estado de los pedidos en Supabase basándose en el resultado de la transacción.
- Almacenar el ID de transacción de Wompi para auditoría y soporte.

**Non-Goals:**
- Implementación de Webhooks (notificaciones asíncronas servidor a servidor) en esta fase inicial. Se priorizará el feedback por redirección.
- Gestión de reembolsos desde el panel de administración (se hará manualmente desde el dashboard de Wompi por ahora).

## Decisions

1.  **Generación de Firma en Servidor:** Crearemos un endpoint `web/app/api/wompi/integrity/route.ts` que recibirá la referencia y el monto, y devolverá la firma SHA256 usando la `WOMPI_INTEGRITY_SECRET`. Esto evita exponer secretos en el frontend.
2.  **Identificador de Referencia:** La referencia enviada a Wompi será el ID autogenerado del pedido en la tabla `orders` para asegurar una vinculación 1:1 única.
3.  **Widget Embebido:** Se utilizará el script oficial de Wompi inyectado dinámicamente para mantener al usuario dentro de la experiencia de marca de Nomenclaturas del Valle.
4.  **Flujo de Retorno:** La página `/pago/confirmacion` actuará como el "Finalized URL", donde consultaremos el estado de la transacción a través de la API de Wompi (usando el ID de transacción pasado por URL) para mostrar el mensaje adecuado al cliente.

## Risks / Trade-offs

- **Dependencia de Redirección:** Si el usuario cierra el navegador justo después de pagar pero antes de ser redirigido, el pedido podría quedar con estado "pendiente" en nuestra DB aunque haya sido pagado en Wompi.
- **Seguridad de Llaves:** Es crítico configurar correctamente las variables de entorno (`WOMPI_PUBLIC_KEY`, `WOMPI_INTEGRITY_SECRET`) en Supabase/Vercel.
- **Simulación vs Producción:** Se utilizarán las llaves de "Sandbox" para las pruebas iniciales antes de pasar a "Producción".
