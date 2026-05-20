## Why

Para la venta de números de viviendas, los clientes generalmente necesitan comprar múltiples dígitos diferentes a la vez. Actualmente, el flujo de compra tradicional requiere agregar cada número o letra individualmente al carrito, lo cual genera una alta fricción y mala experiencia de usuario (UX). Implementar un "Constructor de Nomenclaturas" permite a los usuarios escribir su número de casa (ej. "145-B") y que el sistema agrupe automáticamente los productos (números de 12cm y letras de 6cm) en un solo paquete calculando su precio en tiempo real.

## What Changes

- Se añadirá una configuración en el panel de administrador para marcar un producto como "Constructor de Nomenclatura".
- Se añadirá la opción de enlazar un producto secundario (ej. "Letras 6cm") al producto base (ej. "Números 12cm") para cobrar por las letras de la nomenclatura.
- Se modificará la página de detalle de producto para mostrar un campo de texto interactivo en lugar del selector de cantidad tradicional cuando un producto tenga esta bandera activa.
- Se actualizará la lógica del carrito de compras para agrupar los caracteres ingresados como un solo ítem (paquete), pero guardando metadatos para que el administrador reciba el texto exacto (ej. "145-B").
- Modificación del esquema de base de datos en Supabase para soportar los nuevos campos en `products` (`is_nomenclature`, `letter_product_id`) y `order_items` (`customization`).

## Capabilities

### New Capabilities
- `nomenclature-builder`: Interfaz y lógica para el cliente que lee un string de texto, separa números y letras, calcula precio basado en las relaciones del producto base y agrupa el pedido para el carrito.

### Modified Capabilities
- `admin-products`: El formulario de edición y creación de productos debe incluir los nuevos campos booleanos y de relación (`is_nomenclature` y `letter_product_id`).
- `cart-management`: El carrito y la gestión de checkout deben poder almacenar y procesar metadatos personalizados (texto de la nomenclatura) y enviarlos a la tabla `order_items` durante la compra con Wompi.

## Impact

- **Base de Datos (Supabase):** Se requiere una migración SQL para agregar campos a las tablas `products` y `order_items`.
- **UI Cliente:** Creación de un nuevo componente `NomenclatureBuilder.tsx` y modificación del diseño en la página de producto individual `/productos/[id]/page.tsx`.
- **Admin Panel:** Actualización en `ProductForm.tsx` y en la acción de servidor (`formActions.ts`) para incluir los nuevos campos al insertar o actualizar productos.
