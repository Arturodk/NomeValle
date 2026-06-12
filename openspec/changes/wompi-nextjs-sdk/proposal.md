## Why

Para calificar para el programa "Codex for Open Source" de OpenAI y obtener 6 meses de ChatGPT Pro, es necesario contar con un repositorio público de código abierto con impacto y adopción en el ecosistema (librería o herramienta de desarrollo). NomeValle es una tienda e-commerce personal, por lo que no es elegible en su estado actual. Extraer la lógica de integración de la pasarela de pagos Wompi (Colombia) en un SDK tipado e independiente para Next.js/TypeScript resolverá la falta de librerías modernas de Wompi para Next.js, proveyendo valor real a la comunidad y sirviendo como el proyecto calificado para postular al beneficio de OpenAI sin poner en riesgo la estabilidad del e-commerce principal.

## What Changes

- **Estructura Aislada**: Creación de un subproyecto independiente en `packages/wompi-nextjs-sdk` (fuera de `web/`) para alojar el código fuente, pruebas, README y configuraciones del SDK. Esto garantiza cero interferencia con la tienda NomeValle actual.
- **Funcionalidades del SDK**:
  - Cliente de API de Wompi tipado para consultas de transacciones y estados de pago.
  - Utilidad de firma de integridad SHA-256 para validación segura de eventos y widgets.
  - Parser/Validador de eventos de Webhook para flujos asíncronos.
  - Tipos TypeScript exhaustivos para las peticiones y respuestas de Wompi.
- **Preparación de Código Abierto**: Documentación exhaustiva (README en inglés), configuración de empaquetado (package.json, tsconfig.json), tests básicos y Licencia MIT.

## Capabilities

### New Capabilities
- `wompi-nextjs-sdk`: Desarrollo de un SDK de TypeScript estructurado y reutilizable para integrar pasarelas de pago de Wompi en aplicaciones de Next.js, empaquetado para distribución pública.

### Modified Capabilities
- Ninguna.

## Impact

- **Código**: Aislado en la ruta `packages/wompi-nextjs-sdk`.
- **Dependencias**: Ninguna de terceros (solo tipos de desarrollo y fetch nativo de Node/Next.js).
- **Riesgo**: Nulo para el e-commerce `web/`, ya que este continuará usando sus rutas y configuraciones actuales hasta que el usuario decida migrarlo de manera opcional en el futuro.
