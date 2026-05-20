## Why

Actualmente el sistema soporta constructores para productos estándar (ninguno), nomenclaturas (precio por carácter) y placas (texto libre precio fijo). Sin embargo, tenemos un nuevo producto de "Placa Familiar" que requiere un flujo diferente: la placa superior puede tener un mensaje por defecto ("Dios Bendiga Este Hogar") o personalizarse con el nombre de la familia (ej. Familia Martínez Vanegas, máximo dos apellidos). Además, el cliente debe especificar la nomenclatura (los números) que van en la parte inferior. Es necesario agregar una opción específica para este producto que permita cobrar un precio fijo pero recolectar estas dos variables.

## What Changes

- Se agregará un nuevo `builder_type` llamado `family_plate` en la base de datos (Supabase) y en los tipos TypeScript.
- Se agregará la opción "Constructor de placa familiar" en el formulario de creación/edición de productos en el panel admin.
- Se creará un nuevo componente interactivo `FamilyPlateBuilder` que se renderizará en la página de detalle cuando un producto tenga `builder_type = 'family_plate'`.
- El constructor permitirá:
  1. Elegir entre el mensaje por defecto o texto personalizado.
  2. Si es personalizado, ingresar hasta dos apellidos.
  3. Ingresar la nomenclatura (números).
- El texto de personalización guardado en el carrito concatenará ambas selecciones para que el administrador pueda procesar el pedido.

## Capabilities

### New Capabilities
- `family-plate-builder`: Especifica el comportamiento, interfaz de usuario y validaciones del nuevo constructor de placas familiares.

### Modified Capabilities
- `product-catalog`: Modifica el formulario de administración para incluir `family_plate` como opción en el selector de tipo de constructor.

## Impact

- **Base de Datos**: Modificación del CHECK constraint `products_builder_type_check` en la tabla `products`.
- **Tipos**: Actualización de la interfaz de producto en Supabase Types.
- **Frontend**: Nuevo componente de UI y actualización del condicional en `ProductDetailClient.tsx`.
- **Admin**: Actualización del formulario `ProductForm` y las acciones del servidor `formActions.ts`.
