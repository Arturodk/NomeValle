## 1. OpenGraph e Imágenes Dinámicas

- [x] 1.1 Instalar dependencias necesarias para generación de imágenes (si es necesario verificar compatibilidad de `next/og` u `@vercel/og` en Next.js 16).
- [x] 1.2 Crear el endpoint `web/app/api/og/route.tsx` implementando `ImageResponse`.
- [x] 1.3 Diseñar la tarjeta en el endpoint leyendo los parámetros `title`, `price` y `image` de la URL, e incorporando el texto/fuente de la marca.

## 2. Metadatos de Producto y Schema.org

- [x] 2.1 Modificar `web/app/productos/[id]/page.tsx` para implementar y exportar la función `generateMetadata`.
- [x] 2.2 Enlazar la ruta generadora de imágenes `/api/og` en las propiedades de `openGraph` dentro de `generateMetadata`.
- [x] 2.3 Construir el objeto JSON-LD para el esquema `Product` y `Offer` (marcando la disponibilidad como `PreOrder`).
- [x] 2.4 Inyectar el bloque `<script type="application/ld+json">` de forma segura en el renderizado del producto.

## 3. Sitemaps y Robots

- [x] 3.1 Crear el archivo `web/app/sitemap.ts`.
- [x] 3.2 Implementar la consulta a Supabase dentro del sitemap para extraer todos los productos con `is_active = true`.
- [x] 3.3 Añadir al sitemap las rutas estáticas principales (`/`, `/productos`, `/contacto`).
- [x] 3.4 Crear el archivo `web/app/robots.ts` definiendo las reglas de rastreo base y referenciando la URL absoluta del sitemap generado.
