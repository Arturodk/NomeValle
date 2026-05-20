## ADDED Requirements

### Requirement: Listar todos los productos
El sistema SHALL mostrar en `/admin/productos` una tabla paginada con todos los productos (activos e inactivos) incluyendo nombre, material, precio, stock y estado.

#### Scenario: Admin ve el listado de productos
- **WHEN** el admin navega a `/admin/productos`
- **THEN** el sistema muestra todos los productos con columnas: nombre, material, precio, stock, activo/inactivo

#### Scenario: Paginación del listado
- **WHEN** existen más de 20 productos
- **THEN** el sistema muestra controles de paginación y carga la página correspondiente

### Requirement: Crear producto nuevo
El sistema SHALL permitir crear un producto nuevo desde `/admin/productos/nuevo` con: nombre, descripción, material, precio, stock, y al menos una imagen.

#### Scenario: Creación exitosa
- **WHEN** el admin completa el formulario y envía
- **THEN** el sistema guarda el producto en `products`, sube la imagen a Supabase Storage, registra la URL en `product_images` y redirige al listado

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

### Requirement: Archivar producto
El sistema SHALL permitir archivar (desactivar) un producto cambiando `is_active = false`, sin eliminarlo de la base de datos.

#### Scenario: Producto archivado no aparece en catálogo público
- **WHEN** el admin archiva un producto
- **THEN** el producto desaparece del catálogo en `/productos` pero permanece en el panel admin con estado "inactivo"

#### Scenario: Reactivar producto archivado
- **WHEN** el admin reactiva un producto inactivo
- **THEN** el producto vuelve a aparecer en el catálogo público
