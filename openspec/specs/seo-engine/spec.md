## ADDED Requirements

### Requirement: Generación dinámica de metadatos de producto
El sistema SHALL inyectar metadatos únicos (Title y Description) basados en la información de la base de datos de cada producto.

#### Scenario: Visualización de un producto
- **WHEN** un cliente o crawler visita la ruta `/productos/[id]`
- **THEN** la etiqueta `<title>` muestra el nombre del producto seguido de la marca (ej. "Nombre Producto | Nomenclaturas del Valle") y `<meta description>` contiene la descripción extraída de Supabase.

### Requirement: Imágenes dinámicas de OpenGraph
El sistema SHALL proveer una ruta que genere imágenes con formato 1200x630 para compartir en redes.

#### Scenario: Compartir por WhatsApp o Facebook
- **WHEN** una red social raspa la ruta del producto
- **THEN** lee la etiqueta `og:image` que apunta a `/api/og` con los parámetros del producto, devolviendo una tarjeta visual con la foto, el título y el precio formateado.

### Requirement: Marcado JSON-LD (Rich Snippets)
El sistema SHALL incluir marcado semántico de esquema (Schema.org) invisible para los usuarios pero visible para los motores de búsqueda.

#### Scenario: Indexación por Googlebot
- **WHEN** Googlebot rastrea la página de un producto
- **THEN** encuentra un `<script type="application/ld+json">` conteniendo datos estructurados de `Product` y `Offer`, marcando la disponibilidad como pre-pedido (`PreOrder`).

### Requirement: Rastreo y Sitemaps
El sistema SHALL exponer la estructura completa de rutas válidas y productos activos.

#### Scenario: Lectura del mapa del sitio
- **WHEN** se solicita la ruta `/sitemap.xml`
- **THEN** se devuelve un archivo XML dinámico que lista la ruta raíz `/`, `/productos`, `/contacto` y una URL por cada producto marcado como `is_active=true` en Supabase.

#### Scenario: Directivas de robots
- **WHEN** se solicita la ruta `/robots.txt`
- **THEN** se devuelven directivas que permiten el rastreo general y apuntan a la URL absoluta del `sitemap.xml`.
