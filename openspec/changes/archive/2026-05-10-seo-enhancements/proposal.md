## Why

Actualmente, el sitio web utiliza un único `<title>` y `<meta description>` genérico a través de todas las páginas, y carece de mapa del sitio (`sitemap.xml`) y archivo `robots.txt`. Esto limita drásticamente la visibilidad en motores de búsqueda (Google) y la presentación al compartir enlaces de productos en redes sociales y WhatsApp (falta de imágenes dinámicas y títulos), lo cual es un pilar fundamental para la estrategia de ventas de Nomenclaturas del Valle.

## What Changes

- Implementación de un motor de generación dinámica de imágenes OpenGraph (`/api/og`) para mostrar tarjetas atractivas al compartir productos por WhatsApp o Facebook.
- Añadir la función `generateMetadata` en la página de detalles del producto (`/productos/[id]`) para inyectar títulos, descripciones y metadatos OpenGraph únicos por producto.
- Inyección de datos estructurados (JSON-LD) con los esquemas `Product` y `Offer` en la página del producto para habilitar Rich Snippets en Google. La disponibilidad se configurará como "PreOrder" (bajo pedido) para reflejar que no hay stock inmediato.
- Creación de un Sitemap dinámico (`sitemap.ts`) que consulte a Supabase y exponga todos los productos activos a Google.
- Creación de un archivo de directivas de rastreo (`robots.ts`) que apunte al sitemap dinámico.

## Capabilities

### New Capabilities
- `seo-engine`: Generación dinámica de metadatos, estructuración JSON-LD, sitemaps y OpenGraph images para posicionamiento en motores de búsqueda y compartición en redes sociales.

### Modified Capabilities
- (Ninguna)

## Impact

- Modificación de las páginas existentes: `web/app/layout.tsx` y `web/app/productos/[id]/page.tsx`.
- Creación de nuevas rutas en Next.js: `web/app/api/og/route.tsx` (o equivalente), `web/app/sitemap.ts` y `web/app/robots.ts`.
- No hay impacto en el esquema de base de datos ni requerimos migraciones. Se consultará la tabla `products` actual.
