## ADDED Requirements

### Requirement: database-seeding
El sistema DEBE contar con un script SQL de datos iniciales (`supabase_seed.sql`) que inserte al menos 3 productos de prueba (con diferentes materiales como 'aluminio', 'bronce', 'acrílico') y sus respectivas imágenes (`product_images`) para permitir el desarrollo visual de las interfaces del catálogo y el detalle de producto sin un panel de administrador funcional.

#### Scenario: Visualización inicial del catálogo
- **WHEN** un desarrollador despliega la base de datos vacía y ejecuta el script de seed
- **THEN** la base de datos se puebla con productos válidos y el catálogo web los renderiza correctamente
