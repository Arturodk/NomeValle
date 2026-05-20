## Context
Actualmente se han implementado constructores interactivos en la página de producto para nomenclaturas (precio por carácter) y placas sencillas (precio fijo). Ahora se requiere soportar un nuevo producto: la "Placa Familiar", la cual tiene un componente superior que puede tener un texto fijo por defecto ("DIOS BENDIGA ESTE HOGAR") o un nombre de familia personalizado (máx. 2 apellidos, es decir, ~25 caracteres), y un componente inferior para la nomenclatura (números/letras de la casa).

## Goals / Non-Goals

**Goals:**
- Agregar el tipo `family_plate` al `builder_type` de los productos.
- Proveer una experiencia de usuario clara con opciones mutuamente excluyentes (radio buttons) para elegir el texto superior de la placa familiar.
- Validar el texto de personalización de la familia (máximo 25 caracteres).
- Validar el texto de la nomenclatura con las mismas reglas de las placas estándar (máximo 6 números, 4 letras, solo guión).
- Generar un solo string en el campo `customization` del carrito que contenga de forma clara ambas decisiones para el panel de administración.

**Non-Goals:**
- No se soportará pedir múltiples placas familiares en la misma iteración (a diferencia del `PlateBuilder` normal). El cliente agregará cada placa al carrito por separado.
- No habrá cobro dinámico o diferenciado por elegir el mensaje personalizado versus el mensaje por defecto (tienen el mismo precio fijo base del producto).

## Decisions

- **Estructura del Formulario en UI:**
  - Control tipo radio para seleccionar: `Opcion 1: "DIOS BENDIGA ESTE HOGAR" (Por defecto)` o `Opcion 2: "Personalizar Apellidos"`.
  - Input condicional para la opción 2, que aparecerá si el usuario la selecciona. Limitado a `maxLength=25`.
  - Input obligatorio para la nomenclatura, aplicando el validador `validatePlate` que ya usamos previamente.
- **Formato del Customization String:**
  - Cuando se envíe al carrito se construirá una cadena legible.
  - Si es por defecto: `"Mensaje: DIOS BENDIGA ESTE HOGAR | Nomenclatura: {numero}"`
  - Si es personalizado: `"Familia: {apellidos} | Nomenclatura: {numero}"`
  Esto asegura que el string de `customization` contenga todo lo que el administrador y producción necesitan saber en una sola línea.
- **Validaciones en React:**
  - El botón "Agregar al carrito" estará deshabilitado hasta que:
    1. Se haya escrito una nomenclatura válida.
    2. Si se eligió "Personalizado", se haya escrito al menos 1 carácter válido (y máx 25).

## Risks / Trade-offs

- **Cadena de personalización larga**: El campo `customization` en el cart puede volverse largo ("Familia: Martínez Vanegas | Nomenclatura: 123-45B"). Las vistas del carrito y de pedidos en el admin deberán poder manejar saltos de línea o recortes apropiados (esto ya suele estar cubierto por CSS general, pero hay que tenerlo en mente).
- **Retrocompatibilidad**: Agregar un nuevo enum value en Postgres check constraint es seguro y simple.
