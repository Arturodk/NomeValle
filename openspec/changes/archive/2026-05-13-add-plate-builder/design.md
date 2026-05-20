## Context

Nomenclaturas del Valle vende dos categorías de productos: (1) **caracteres sueltos** (números y letras de resina/bronce) con precio por unidad de carácter, y (2) **placas completas** (aluminio grabado) con precio fijo por placa. El sistema actual solo contempla el primero mediante `is_nomenclature boolean` + `NomenclatureBuilder`. Para soportar las placas de aluminio se necesita un tercer modo de interacción en la página del producto y un modelo de datos más expresivo.

**Estado actual relevante:**
- `products.is_nomenclature: boolean` — activa el `NomenclatureBuilder` (precio por carácter)
- `products.letter_product_id: uuid` — enlaza el producto companion para letras
- `ProductDetailClient.tsx` — ternario `is_nomenclature ? <NomenclatureBuilder> : <button>`
- `order_items.customization: text` — ya existe para guardar el texto personalizado

## Goals / Non-Goals

**Goals:**
- Introducir `builder_type: 'none' | 'nomenclature' | 'plate'` en `products` como reemplazo semántico de `is_nomenclature`
- Crear `PlateBuilder.tsx`: input de texto libre con validación de formato + soporte multi-placa
- Actualizar el formulario de admin para seleccionar `builder_type`
- Migrar datos existentes limpiamente; mantener rollback seguro
- Cada placa se agrega al carrito como ítem independiente con su `customization`

**Non-Goals:**
- Cambiar el comportamiento del `NomenclatureBuilder` existente
- Soportar otros separadores distintos al guion `-`
- Preview visual de la placa (render de cómo quedará grabada)
- Integración con proveedor de grabado

## Decisions

### D1 — `builder_type` como columna de texto con CHECK constraint, no enum de PostgreSQL

**Decisión:** `builder_type text NOT NULL DEFAULT 'none' CHECK (builder_type IN ('none', 'nomenclature', 'plate'))`

**Rationale:** Los enums de PostgreSQL son difíciles de alterar (`ALTER TYPE` requiere recrear el tipo). Un `text` con `CHECK` es igualmente seguro en validación y trivialmente extensible con `ALTER TABLE products DROP CONSTRAINT ... ADD CONSTRAINT ...`. Mantiene simplicidad sin sacrificar integridad referencial.

**Alternativa descartada:** `builder_type enum` — más estricto pero costoso de extender.

### D2 — `is_nomenclature` se mantiene en la DB durante la transición

**Decisión:** No se dropea `is_nomenclature` en la misma migración. Se depreca (no se usa en código nuevo) pero permanece en la tabla para rollback inmediato.

**Rationale:** Si hay un bug post-deploy, basta con hacer `UPDATE products SET builder_type = CASE WHEN is_nomenclature THEN 'nomenclature' ELSE 'none' END` para restaurar el estado derivado. Droppear la columna se hace en una segunda migración, después de validar en producción.

### D3 — Multi-placa: ítems separados en el carrito, no array en customization

**Decisión:** Cada placa que el cliente agrega se convierte en un `addItem()` independiente al carrito con `quantity: 1` y `customization: "TEXTO_PLACA"`.

**Rationale:** El modelo de `order_items` tiene `quantity + customization`. Almacenar múltiples placas como `customization: "27-44|301-B|15-22"` haría el parsing frágil y dificultaría el procesamiento de pedidos en el admin. Ítems separados son más claros para el administrador al revisar el pedido.

**Alternativa descartada:** Un único ítem con `quantity = N` pero `customization = JSON array` — viola el modelo y requiere cambio en la tabla.

### D4 — Validación de formato en el cliente (con fallback de server)

**Reglas de la placa:**
- Máximo **6 dígitos**
- Máximo **4 letras**
- Solo caracteres permitidos: `[A-Za-z0-9\-]`
- Solo guion `-` como separador; no espacios, puntos ni slashes
- Longitud mínima: 1 carácter

**Regex de validación:** `/^[A-Za-z0-9\-]+$/`

**Conteos:** `digits = text.replace(/\D/g, '').length`, `letters = text.replace(/[^A-Za-z]/g, '').length`

La validación vive en `PlateBuilder.tsx` (cliente). No se agrega validación server-side dado que `customization` es un campo libre en `order_items` y la validación de negocio ya ocurre antes de agregar al carrito.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| Productos existentes con `is_nomenclature = true` no migrados → aparecen como `builder_type = 'none'` (botón normal) | La migración SQL incluye `UPDATE` antes de agregar el CHECK constraint |
| El admin guarda `builder_type = 'nomenclature'` pero también intenta leer `letter_product_id` — el select de companion sigue siendo necesario | El formulario del admin condiciona el selector de companion solo cuando `builder_type === 'nomenclature'` |
| Clientes con carrito activo durante el deploy ven estado inconsistente | El carrito vive en `localStorage`; no hay estado server que sea afectado |
| El `PlateBuilder` con múltiples placas puede generar muchos ítems con el mismo `product_id` en el carrito | El `cart-context` debe identificar ítems por `product_id + customization`, no solo por `product_id` |

## Migration Plan

### Forward
```sql
-- 1. Agregar columna con default 'none' (sin constraint aún)
ALTER TABLE products ADD COLUMN builder_type text NOT NULL DEFAULT 'none';

-- 2. Migrar datos existentes
UPDATE products SET builder_type = 'nomenclature' WHERE is_nomenclature = true;

-- 3. Agregar CHECK constraint
ALTER TABLE products ADD CONSTRAINT products_builder_type_check
  CHECK (builder_type IN ('none', 'nomenclature', 'plate'));
```

### Rollback
```sql
-- Si se necesita revertir: solo dropear la columna nueva
ALTER TABLE products DROP COLUMN IF EXISTS builder_type;
-- El código antiguo sigue usando is_nomenclature sin cambios
```

### Deprecación futura (segunda migración, post-validación)
```sql
ALTER TABLE products DROP COLUMN is_nomenclature;
```

## Open Questions

- *(Resuelto)* ¿Un pedido puede incluir múltiples placas distintas? → **Sí, ítems separados en el carrito**
- *(Resuelto)* ¿Restricciones de formato? → **máx. 6 dígitos, máx. 4 letras, solo `-` como separador**
- ¿El campo `letter_product_id` tiene sentido para `builder_type = 'plate'`? → No aplica; el formulario lo ocultará cuando `builder_type === 'plate'`
- ¿El carrito actual identifica ítems por `product_id` únicamente? → Verificar en `cart-context.tsx` antes de implementar la lógica multi-placa
