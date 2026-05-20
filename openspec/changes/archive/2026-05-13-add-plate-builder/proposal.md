## Why

El catálogo de Nomenclaturas del Valle necesita incorporar un nuevo tipo de producto: **placas de aluminio grabadas** (ej: números de dirección tipo "27-44"). A diferencia de los números y letras sueltos —donde el precio se calcula por carácter individual— una placa tiene un **precio fijo por unidad** independiente de la cantidad de caracteres que lleve grabados. El constructor interactivo actual (`NomenclatureBuilder`) no soporta este modelo de precio fijo, y el campo `is_nomenclature` es insuficiente para representar múltiples tipos de constructor. Se introduce este cambio para desbloquear la venta online de placas y establecer una base extensible para futuros tipos de constructor.

## What Changes

- **BREAKING** — Se agrega la columna `builder_type text default 'none'` a la tabla `products` y se migran los registros existentes con `is_nomenclature = true` a `builder_type = 'nomenclature'`. La columna `is_nomenclature` queda deprecada.
- Se crea el componente `PlateBuilder.tsx`: permite al cliente ingresar el texto de una o varias placas con validación de formato, mostrando precio fijo por unidad.
- El admin recibe un campo de selección `builder_type` (`none` / `nomenclature` / `plate`) en el formulario de productos, reemplazando el checkbox `is_nomenclature`.
- `ProductDetailClient.tsx` se actualiza para hacer switch entre los tres modos de constructor (`none`, `nomenclature`, `plate`).
- Se actualiza `ProductForm.tsx` para enviar `builder_type` en lugar de `is_nomenclature`.
- La acción de servidor `upsertProduct` procesa el nuevo campo.

## Capabilities

### New Capabilities

- `plate-builder`: Constructor interactivo de precio fijo para placas de aluminio. Permite ingresar texto libre con validación de formato (máx. 6 dígitos, máx. 4 letras, solo guion `-` como separador permitido). Soporta múltiples placas distintas en un mismo pedido (cada una como ítem separado con su `customization`).

### Modified Capabilities

- `product-management`: El formulario de administración de productos incorpora el nuevo selector `builder_type`, reemplazando el checkbox `is_nomenclature`. La lógica de visualización del constructor en la página del producto se actualiza para soportar tres modos.

## Impact

- **Base de datos**: Nueva columna `builder_type` en `products`. Migración SQL requerida. Plan de rollback: `ALTER TABLE products DROP COLUMN builder_type` (la columna `is_nomenclature` permanece intacta durante la transición).
- **Componentes**: `NomenclatureBuilder.tsx` sin cambios. Nuevo `PlateBuilder.tsx`. `ProductDetailClient.tsx` y `ProductForm.tsx` modificados.
- **Server Actions**: `app/admin/productos/formActions.ts` actualizado para leer `builder_type`.
- **Sin impacto**: Wompi, Supabase Auth, Storage, carrito, orders.
