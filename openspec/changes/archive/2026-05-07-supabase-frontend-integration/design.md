## Context

El proyecto Nomenclaturas del Valle ha estado usando datos estáticos (`mockProducts`) para desarrollar el frontend y establecer una base visual y de navegación. La base de datos PostgreSQL ya ha sido creada en Supabase, por lo que es el momento de integrar el entorno real. Este cambio requiere la transición de todas las vistas del catálogo (home, lista de productos y detalle) para que usen consultas reales de base de datos a través del cliente de Supabase `@supabase/ssr`.

## Goals / Non-Goals

**Goals:**
- Generar tipos de datos TypeScript alineados con el esquema SQL en la base de datos de Supabase.
- Configurar y aplicar la obtención de datos (data fetching) desde Supabase utilizando Server Components en Next.js App Router para `app/page.tsx`, `app/productos/page.tsx` y `app/productos/[id]/page.tsx`.
- Poblar la base de datos con un script SQL (`supabase_seed.sql`) inicial.

**Non-Goals:**
- No implementar el flujo completo del carrito de compras ni la pasarela de pagos Wompi (eso se realizará en una fase posterior).
- No habilitar características del panel de administrador para subir o editar productos.

## Decisions

- **Uso de Server Components para la obtención de datos**: 
  - *Rationale*: En Next.js 16 (App Router), la forma recomendada y con mejor rendimiento es realizar consultas a la base de datos en los "Server Components". Esto evita exponer las claves anónimas innecesariamente, reduce el Javascript enviado al cliente, y permite un mejor SEO.
  - *Alternatives*: Hacer fetching de cliente usando el hook `useEffect` o bibliotecas como `SWR`/`React Query`. Se descartó porque los productos son relativamente estáticos y un Server Component es mucho más óptimo para SEO y tiempos de carga.

- **Generación Manual de Tipos vs CLI**:
  - *Rationale*: Debido a la configuración actual del entorno de desarrollo local, se definirán los tipos `Database` manualmente en `types_db.ts` copiando la estructura de las tablas de `supabase_schema.sql`.
  - *Alternatives*: Usar `npx supabase gen types typescript`. Podría usarse en el futuro si se automatiza el CLI, pero de momento es más expedito construirlos en un archivo para la tabla actual.

## Risks / Trade-offs

- **[Risk] Demora en consultas a la base de datos desde Next.js**: Supabase puede tardar en responder dependiendo de la red o si la instancia se pausa en el plan gratuito.
  - *Mitigation*: Emplear componentes de Suspense (`loading.tsx`) en el App Router si se percibe latencia para mantener a los usuarios informados.

- **[Risk] Faltan imágenes para el Seeding**: El script SQL de Seeding insertará referencias a imágenes, pero es posible que esas URLs no existan.
  - *Mitigation*: Usar URLs de placeholders públicos y estables para garantizar que la interfaz se muestre de forma adecuada hasta que el administrador suba las imágenes reales.
