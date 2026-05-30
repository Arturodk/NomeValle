# Product Catalog Specification

## Purpose
Gestionar y presentar el catálogo de nomenclaturas y placas metálicas para los clientes en la tienda pública, así como el panel administrativo de control de inventario.
## Requirements
### Requirement: Listar todos los productos
El sistema SHALL mostrar en `/admin/productos` una tabla paginada con todos los productos (activos e inactivos) incluyendo nombre, material, precio, stock y estado.

#### Scenario: Admin ve el listado de productos
- **WHEN** el admin navega a `/admin/productos`
- **THEN** el sistema muestra todos los productos con columnas: nombre, material, precio, stock, activo/inactivo

#### Scenario: Paginación del listado
- **WHEN** existen más de 20 productos
- **THEN** el sistema muestra controles de paginación y carga la página correspondiente

### Requirement: Crear producto nuevo
El sistema SHALL permitir crear un producto nuevo desde `/admin/productos/nuevo` con: nombre, descripción, material, precio, stock, al menos una imagen, y el tipo de constructor (`builder_type`). El selector de constructor tendrá tres opciones: `none` (estándar), `nomenclature` (precio por carácter) y `plate` (precio fijo). Si se selecciona `nomenclature`, se debe poder elegir el producto asociado (`letter_product_id`).

#### Scenario: Creación exitosa con constructor de placas
- **WHEN** el admin selecciona "Constructor de placa (precio fijo)" en el selector de tipo y completa el formulario
- **THEN** el sistema guarda el producto con `builder_type = 'plate'` y oculta el selector de producto asociado

#### Scenario: Validación de campos requeridos
- **WHEN** el admin envía el formulario con campos faltantes (nombre, precio o imagen)
- **THEN** el sistema muestra errores de validación sin guardar

### Requirement: Editar producto existente
El sistema SHALL permitir editar cualquier campo de un producto desde `/admin/productos/[id]/editar`, incluyendo agregar o eliminar imágenes.

#### Scenario: Edición exitosa
- **WHEN** el admin modifica campos y guarda
- **THEN** el sistema actualiza el registro en `products` y refleja los cambios en el catálogo público

#### Scenario: Cambio de imagen principal
- **WHEN** el admin selecciona una imagen diferente como principal
- **THEN** el sistema actualiza `is_primary` en `product_images` correctamente

#### Scenario: Eliminación de imagen
- **WHEN** el admin elimina una imagen del producto
- **THEN** el sistema borra el archivo de Supabase Storage y elimina el registro de `product_images`

### Requirement: Renderizar constructor correcto en detalle de producto
El sistema SHALL renderizar el componente interactivo apropiado en el detalle del producto según su `builder_type`:
- `'none'` → Botón estándar de agregar al carrito.
- `'nomenclature'` → Componente `NomenclatureBuilder` (precio por carácter).
- `'plate'` → Componente `PlateBuilder` (precio fijo por placa).

#### Scenario: Producto tipo placa muestra PlateBuilder
- **WHEN** un cliente visita la página de un producto con `builder_type = 'plate'`
- **THEN** el sistema muestra el constructor con validación de formato y lista de placas.

---

### Requirement: Archivar producto
El sistema SHALL permitir archivar (desactivar) un producto cambiando `is_active = false`, sin eliminarlo de la base de datos.

#### Scenario: Producto archivado no aparece en catálogo público
- **WHEN** el admin archiva un producto
- **THEN** el producto desaparece del catálogo en `/productos` pero permanece en el panel admin con estado "inactivo"

#### Scenario: Reactivar producto archivado
- **WHEN** el admin reactiva un producto inactivo
- **THEN** el producto vuelve a aparecer en el catálogo público

### Requirement: Product grid visual presentation
The product catalog on the frontend SHALL present products using the gapless bento grid system and MUST include premium hover micro-interactions (`scale-105` with long transitions).

#### Scenario: User hovers over a product card
- **WHEN** a user hovers over a `ProductCard` component
- **THEN** the card content scales up slightly with a smooth, long duration transition

