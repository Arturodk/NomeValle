## Context

Actualmente, los clientes tienen que añadir números o letras individualmente al carrito para conformar su nomenclatura. Esto genera gran fricción. Se busca crear un "Constructor de Nomenclaturas" integrado en la página del producto, donde el cliente escriba el texto deseado y el sistema calcule el precio basándose en la cantidad de caracteres numéricos y alfabéticos (que tienen precios distintos, ej. números a 50k, letras a 20k). Para ello, la base de datos debe permitir configurar esta funcionalidad por producto y relacionar un producto secundario (las letras) para calcular su precio.

## Goals / Non-Goals

**Goals:**
- Modificar el esquema de base de datos añadiendo `is_nomenclature` y `letter_product_id` a `products`.
- Añadir el campo `customization` (jsonb o text) a la tabla `order_items`.
- Crear el componente frontend `NomenclatureBuilder.tsx` para reemplazo del selector de cantidad tradicional.
- Actualizar el estado global del carrito para aceptar ítems agrupados con metadatos y asegurar que se guarden correctamente al procesar el pago con Wompi.

**Non-Goals:**
- Control de inventario estricto por dígito individual (las letras y números se fabrican bajo demanda).
- Previsualización gráfica avanzada o renderizado 3D de cómo se verá la placa.

## Decisions

**1. Modelado de Base de Datos**
- **Decisión:** Extender las tablas existentes en Supabase en lugar de crear una tabla nueva para configuraciones.
  - Se añadirán a `products`: `is_nomenclature` (boolean) y `letter_product_id` (uuid referenciando a `products.id`).
  - Se añadirá a `order_items`: `customization` (text o jsonb) para persistir el texto ingresado por el usuario.

**2. Lógica del Carrito y Checkout**
- **Decisión:** Tratar la nomenclatura completa como un único ítem en el carrito, cuyo precio base es dinámico y calculado.
  - El frontend hará el cálculo: `(qtyNumbers * priceBase) + (qtyLetters * priceLetter)`. Los guiones o caracteres especiales no suman al precio.
  - Para seguridad, el servidor recalculará este total antes de crear la orden y firmar la petición de Wompi.

**3. Fetch del Precio de la Letra**
- **Decisión:** Para no afectar el rendimiento al escribir, la página del producto hará JOIN a la tabla `products` para traer el precio de la letra (`letter_product_id`) al cargar la página por SSR, inyectándolo como prop al `NomenclatureBuilder`.

## Risks / Trade-offs

- **[Risk] Error en la firma de integridad de Wompi** → Al cambiar la lógica de cálculo de precios del lado del servidor, el total puede descuadrarse si no coincide con lo enviado desde el cliente.
  *Mitigación:* Se estandarizará una función compartida de cálculo de precio (`calculateNomenclaturePrice(text, basePrice, letterPrice)`) para asegurar paridad entre cliente y servidor.
- **[Risk] Campos null en BD rompen la UI** → Para productos normales, los nuevos campos vendrán nulos.
  *Mitigación:* Componentes frontend validarán y asumirán comportamiento estándar si `is_nomenclature` es falso o undefined.
