## 1. Base de Datos — Migración

- [x] 1.1 Ejecutar en Supabase SQL Editor: `ALTER TABLE products ADD COLUMN builder_type text NOT NULL DEFAULT 'none'`
- [x] 1.2 Ejecutar migración de datos: `UPDATE products SET builder_type = 'nomenclature' WHERE is_nomenclature = true`
- [x] 1.3 Agregar CHECK constraint: `ALTER TABLE products ADD CONSTRAINT products_builder_type_check CHECK (builder_type IN ('none', 'nomenclature', 'plate'))`
- [x] 1.4 Verificar en Supabase Table Editor que todos los productos existentes tienen `builder_type` correcto (`'nomenclature'` o `'none'`)

## 2. Tipos TypeScript

- [x] 2.1 Actualizar `types/supabase.ts`: agregar campo `builder_type: 'none' | 'nomenclature' | 'plate'` a la interfaz `Product` / `ProductWithImages`
- [x] 2.2 Verificar que el campo `is_nomenclature` se puede mantener en el tipo o marcar como `@deprecated` con un comentario

## 3. Componente PlateBuilder

- [x] 3.1 Crear `components/PlateBuilder.tsx` con estado para: `currentText: string`, `plates: string[]`, `error: string | null`
- [x] 3.2 Implementar función `validatePlate(text: string)`: regex `/^[A-Za-z0-9\-]+$/`, máx. 6 dígitos, máx. 4 letras — retorna `null` si válido o string de error
- [x] 3.3 Implementar UI: input de texto con `maxLength={12}`, mensaje de error inline, botón "Agregar placa" (disabled si inválido o vacío o `disabled` prop)
- [x] 3.4 Implementar lista de placas pendientes con botón "×" para eliminar cada una
- [x] 3.5 Implementar cálculo de total: `plates.length × price` (precio fijo, sin cálculo por carácter)
- [x] 3.6 Implementar botón "Confirmar y agregar al carrito": itera sobre `plates[]`, llama `onAddToCart(plate.toUpperCase(), price)` por cada una, luego limpia el estado
- [x] 3.7 Respetar la prop `disabled` cuando `stock === 0`: deshabilitar input y ambos botones
- [x] 3.8 Crear `components/PlateBuilder.module.css` con estilos consistentes con el design system existente (reutilizar tokens CSS de `globals.css`)

## 4. Server Action — upsertProduct

- [x] 4.1 Abrir `app/admin/productos/formActions.ts` y localizar donde se lee `is_nomenclature` del `FormData`
- [x] 4.2 Agregar lectura de `builder_type` del `FormData` (valor del `<select>`)
- [x] 4.3 Incluir `builder_type` en el objeto que se envía a Supabase `upsert`
- [x] 4.4 Mantener `is_nomenclature` como campo calculado derivado de `builder_type` por retrocompatibilidad: `is_nomenclature: formData.get('builder_type') === 'nomenclature'`

## 5. Admin — ProductForm

- [x] 5.1 Abrir `components/admin/ProductForm.tsx` y reemplazar el estado `isNomenclature: boolean` por `builderType: 'none' | 'nomenclature' | 'plate'` (inicializar desde `product?.builder_type ?? 'none'`)
- [x] 5.2 Reemplazar el `<input type="checkbox" name="is_nomenclature">` por un `<select name="builder_type">` con tres opciones: `none` / `nomenclature` / `plate`
- [x] 5.3 Condicionar la visibilidad del selector de `letter_product_id` a `builderType === 'nomenclature'` (antes era `isNomenclature`)
- [x] 5.4 Agregar `<input type="hidden" name="is_nomenclature" value={builderType === 'nomenclature' ? 'on' : ''} />` para retrocompatibilidad con posible lectura legacy en otras partes

## 6. Página de Detalle del Producto

- [x] 6.1 Abrir `app/productos/[id]/ProductDetailClient.tsx` e importar `PlateBuilder`
- [x] 6.2 Reemplazar el ternario `product.is_nomenclature ? <NomenclatureBuilder> : <button>` por un switch/if-else sobre `product.builder_type`:
  - `'plate'` → `<PlateBuilder>`
  - `'nomenclature'` → `<NomenclatureBuilder>` (sin cambios)
  - `'none'` (default) → botón estándar de carrito
- [x] 6.3 Implementar `handleAddPlate(plateText: string, price: number)` que llama `addItem()` con `customization: plateText` y `price: price`
- [x] 6.4 Pasar props a `PlateBuilder`: `price={product.price}`, `onAddToCart={handleAddPlate}`, `disabled={stock === 0}`

## 7. Verificación y Pruebas Manuales

- [ ] 7.1 Crear un producto de prueba en el admin con `builder_type = 'plate'` y verificar que el selector guarda correctamente en Supabase
- [ ] 7.2 Visitar la página del producto de prueba y confirmar que aparece el `PlateBuilder` (no el botón estándar ni el `NomenclatureBuilder`)
- [ ] 7.3 Probar validación: ingresar "1234567" → debe mostrar error de dígitos; ingresar "ABCDE" → error de letras; ingresar "27/44" → error de carácter inválido
- [ ] 7.4 Probar flujo completo: agregar dos placas distintas ("27-44" y "301-B"), confirmar, verificar que aparecen como dos ítems separados en el carrito
- [ ] 7.5 Verificar que un producto existente de tipo `nomenclature` sigue funcionando correctamente (sin regresión)
- [ ] 7.6 Verificar que un producto estándar (`builder_type = 'none'`) sigue mostrando el botón normal de carrito
- [ ] 7.7 Probar con `stock = 0`: confirmar que el `PlateBuilder` queda completamente deshabilitado
