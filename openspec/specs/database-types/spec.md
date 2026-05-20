## ADDED Requirements

### Requirement: database-types
El frontend DEBE contar con una definición estricta de tipos en TypeScript para las tablas de Supabase (`products`, `product_images`, `orders`, `order_items`, `profiles`). Esto garantizará que las operaciones de lectura y escritura en los componentes utilicen autocompletado y validación de tipos del compilador, reduciendo errores en tiempo de ejecución.

#### Scenario: Uso del tipo de producto
- **WHEN** un componente consume los datos de producto de Supabase
- **THEN** el compilador de TypeScript reconoce propiedades como `id`, `name`, `material`, `price` e `is_active` con los tipos correctos sin arrojar error.
