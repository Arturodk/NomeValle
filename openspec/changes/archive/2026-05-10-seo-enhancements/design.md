## Context

Nomenclaturas del Valle depende de la visibilidad orgánica en Google y de la compartición de enlaces (boca a boca) a través de WhatsApp y Facebook. Actualmente, al compartir un enlace de un producto, se muestran los metadatos globales del layout en lugar de una tarjeta enriquecida del producto específico. Asimismo, los motores de búsqueda no tienen un mapa del sitio y no pueden entender la estructura de productos debido a la falta de datos estructurados.

## Goals / Non-Goals

**Goals:**
- Asegurar que cada producto tenga su propio `<title>` y `<meta description>`.
- Generar tarjetas OpenGraph atractivas con la imagen, título y precio del producto al compartir enlaces.
- Habilitar "Rich Snippets" en Google usando JSON-LD (Schema.org).
- Proveer a Googlebot de un `sitemap.xml` dinámico y un `robots.txt` claro.

**Non-Goals:**
- Creación de un blog o sistema de gestión de contenido (CMS) para artículos SEO.
- Soporte multi-idioma (i18n) para SEO (el sitio permanece solo en español).
- Generación estática (SSG) de todas las rutas de imágenes (se usarán rutas dinámicas al vuelo).

## Decisions

1. **Uso de `generateMetadata` en Next.js:**
   - **Decisión:** Aprovechar la función `generateMetadata` nativa del App Router en `app/productos/[id]/page.tsx`.
   - **Racional:** Permite reusar la lógica de servidor para consultar a Supabase antes de renderizar la página, inyectando de forma asíncrona los metadatos requeridos (Title, Description, OpenGraph, Twitter).

2. **Endpoint de Generación de Imágenes (`/api/og`):**
   - **Decisión:** Implementar una ruta usando `ImageResponse` de `next/og`.
   - **Racional:** En lugar de pre-generar o pedir a los administradores que suban una imagen cuadrada específica para SEO, generaremos imágenes dinámicas en el Edge/Servidor al vuelo pasando parámetros por URL (ej. `?title=xxx&price=yyy&image=zzz`).
   - **Alternativa rechazada:** Usar imágenes estáticas del catálogo directamente como `og:image`, ya que a menudo no tienen las proporciones 1200x630px requeridas y no comunican precio o marca.

3. **Inyección de JSON-LD (`schema.org`):**
   - **Decisión:** Renderizar un `<script type="application/ld+json">` dentro del componente de producto.
   - **Racional:** Define explícitamente el tipo `Product` y `Offer`. La disponibilidad (`itemCondition` / `availability`) se configurará como `PreOrder` (bajo pedido), dado que es un modelo artesanal donde el stock es bajo demanda.

4. **Sitemap Dinámico (`sitemap.ts`):**
   - **Decisión:** Usar el archivo nativo `app/sitemap.ts` de Next.js.
   - **Racional:** Evita tener que regenerar un XML manualmente. Cada vez que se solicita `/sitemap.xml`, este archivo ejecutará una query a Supabase buscando productos activos (`is_active = true`) y devolverá el árbol XML.

## Risks / Trade-offs

- **[Risk] Demora en la respuesta de `/api/og`:** La generación dinámica de imágenes puede sumar latencia si el servidor está sobrecargado.
  - **Mitigación:** Añadir cabeceras de caché (`Cache-Control`) agresivas en la ruta `/api/og` para que la imagen se genere una sola vez por producto y luego sea servida desde CDN.
- **[Risk] Límites de fuentes en `next/og`:** Las fuentes personalizadas (Inter/Playfair) deben ser inyectadas como ArrayBuffers en la ruta.
  - **Mitigación:** Usaremos una configuración limpia y un fallback a fuentes del sistema si el fetch de la fuente falla para asegurar fiabilidad.
