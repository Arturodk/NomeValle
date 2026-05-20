## MODIFIED Requirements

### R1: Listado de productos
- La página `/productos` DEBE mostrar solo los productos con `is_active = true`.
- Los datos se obtienen exclusivamente llamando a la API de base de datos de Supabase desde un Server Component, reemplazando la dependencia previa de datos mock locales.
- El listado se puede filtrar por material: todos | metálico | bronce | aluminio.
- Cada tarjeta muestra: imagen primaria, nombre, precio, badge de material.

#### Scenario: Visitar el catálogo conectado
- **GIVEN** que el usuario navega a `/productos`
- **WHEN** la página carga
- **THEN** la página efectúa una consulta `SELECT` a la base de datos de Supabase y renderiza todos los productos activos devueltos, mostrando su imagen primaria, nombre y precio en COP.
