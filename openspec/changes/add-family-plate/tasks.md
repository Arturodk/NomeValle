## 1. Base de Datos - Migración
- [x] 1.1 Ejecutar en Supabase SQL Editor para actualizar el CHECK constraint:
  `ALTER TABLE products DROP CONSTRAINT IF EXISTS products_builder_type_check;`
  `ALTER TABLE products ADD CONSTRAINT products_builder_type_check CHECK (builder_type IN ('none', 'nomenclature', 'plate', 'family_plate'));`
- [x] 1.2 Verificar que el constraint se haya actualizado correctamente.

## 2. Tipos TypeScript
- [x] 2.1 Actualizar `types/supabase.ts` para agregar `'family_plate'` al tipo de unión de `builder_type` en las interfaces de producto.

## 3. Componente FamilyPlateBuilder
- [x] 3.1 Crear `components/FamilyPlateBuilder.tsx` con estado para `topMessageType` ('default' | 'custom'), `customFamilyName` (string), `nomenclature` (string), y `errors` (objeto de errores).
- [x] 3.2 Implementar UI: Dos radio buttons para la selección del mensaje superior.
- [x] 3.3 Implementar UI: Si se selecciona 'custom', mostrar input de texto con `maxLength={25}`.
- [x] 3.4 Implementar UI: Input para la nomenclatura que utilice la función de validación de placas existente (máx 6 números, 4 letras, guion).
- [x] 3.5 Implementar lógica del botón "Agregar al carrito" que genere el string de `customization` correcto según las especificaciones.
- [x] 3.6 Validar que el botón de submit esté deshabilitado si falta información o hay errores de validación, o si el `stock === 0`.
- [x] 3.7 Llamar a `onAddToCart(customizationString, price)` al confirmar y limpiar el estado.
- [x] 3.8 Crear `components/FamilyPlateBuilder.module.css` (o usar Tailwind/estilos globales) consistente con el diseño existente.

## 4. Admin y Detalles de Producto
- [x] 4.1 En `components/admin/ProductForm.tsx`, agregar la opción "Constructor de placa familiar" (`family_plate`) al select de `builder_type`.
- [x] 4.2 En `app/admin/productos/formActions.ts`, asegurarse de que se guarde correctamente el nuevo valor de `builder_type`.
- [x] 4.3 En `app/productos/[id]/ProductDetailClient.tsx`, importar y renderizar condicionalmente `<FamilyPlateBuilder>` cuando `product.builder_type === 'family_plate'`.

## 5. Pruebas Manuales (A realizar por el usuario)
- [ ] 5.1 Crear un producto de prueba en el panel admin seleccionando el tipo "Constructor de placa familiar".
- [ ] 5.2 Visitar la página del producto y verificar que los radio buttons funcionen correctamente, mostrando/ocultando el input del nombre de la familia.
- [ ] 5.3 Probar las validaciones (límite de 25 caracteres, validación de nomenclatura).
- [ ] 5.4 Agregar el producto al carrito usando la opción por defecto y verificar el string de `customization` en el carrito.
- [ ] 5.5 Agregar el producto al carrito usando la opción personalizada y verificar el string de `customization` en el carrito.
