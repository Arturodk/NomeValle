## MODIFIED Requirements

### Requirement: database-types
El frontend DEBE contar con una definición estricta de tipos en TypeScript para las tablas de Supabase (`products`, `product_images`, `orders`, `order_items`, `profiles`). Esto garantizará que las operaciones de lectura y escritura en los componentes utilicen autocompletado y validación de tipos del compilador, reduciendo errores en tiempo de ejecución. Además, SHALL incluir los tipos generados automáticamente para el esquema `auth` si se consumen directamente desde el cliente.

#### Scenario: Uso del tipo de producto
- **WHEN** un componente consume los datos de producto de Supabase
- **THEN** el compilador de TypeScript reconoce propiedades como `id`, `name`, `material`, `price` e `is_active` con los tipos correctos sin arrojar error.

#### Scenario: Validación de tipos de perfil y roles
- **WHEN** el sistema recupera el perfil del usuario actual desde Supabase
- **THEN** el compilador garantiza que el campo `role` sea exactamente 'customer' o 'admin' según la definición de la base de datos.
