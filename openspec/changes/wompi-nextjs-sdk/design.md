## Context

El proyecto e-commerce actual (`NomeValle`) cuenta con una integración básica de Wompi mediante llamadas HTTP directas y lógicas personalizadas dentro del directorio `web/`. Sin embargo, para calificar para el beneficio de OpenAI "Codex for Open Source", se requiere un repositorio público con valor de utilidad para la comunidad. Extraeremos y empaquetaremos la lógica de firmas de integridad de Wompi, verificación de webhooks y el cliente de consulta de transacciones en una librería independiente denominada `wompi-nextjs-sdk` alojada en `packages/wompi-nextjs-sdk`. De esta manera, el e-commerce actual permanecerá aislado y no sufrirá modificaciones directas que puedan comprometer su funcionamiento personal.

## Goals / Non-Goals

**Goals:**
- Desarrollar la estructura e implementación de `packages/wompi-nextjs-sdk` como un módulo independiente y reutilizable.
- Implementar funciones criptográficas robustas para:
  - Generación de firmas de integridad SHA-256 para transacciones y checkout de Wompi.
  - Verificación y validación de firmas de eventos asíncronos recibidos mediante webhooks de Wompi.
- Desarrollar un cliente API HTTP (`WompiClient`) tipado para consultar detalles de transacciones de Wompi en ambientes sandbox y producción de forma transparente.
- Configurar el empaquetado y distribución del SDK (package.json, tsconfig.json, exportaciones en TypeScript) y documentación impecable en inglés (README.md).

**Non-Goals:**
- Modificar o refactorizar el flujo actual de la aplicación e-commerce `web/` en esta fase. El e-commerce y el SDK convivirán en el mismo espacio de trabajo pero desacoplados.
- Desarrollar componentes visuales o de interfaz de usuario para el Widget de Wompi (el SDK es puramente lógico y de backend).

## Decisions

- **Decisión 1: Ubicación en `packages/wompi-nextjs-sdk`**:
  - *Alternativa*: Crear un repositorio independiente fuera de este espacio de trabajo.
  - *Decisión*: Se creará dentro de una carpeta `packages/wompi-nextjs-sdk/` en la raíz de este proyecto. Esto facilita el desarrollo simultáneo empleando las herramientas instaladas y permite al usuario copiar este directorio a un nuevo repositorio de GitHub o publicarlo de forma modular con facilidad.
- **Decisión 2: Cero dependencias externas en producción**:
  - *Alternativa*: Utilizar bibliotecas como `axios` para peticiones HTTP y `crypto-js` para operaciones hash.
  - *Decisión*: Se utilizará el módulo nativo de Node.js `crypto` para la generación y validación de firmas SHA-256, y `fetch` nativo de JavaScript para las peticiones HTTP a la API de Wompi. Esto mantiene el tamaño de la librería mínimo y libre de dependencias transitivas vulnerables o pesadas.
- **Decisión 3: Tipado estricto de TypeScript**:
  - *Alternativa*: Retornar tipos `any` o `unknown` para simplificar la respuesta del cliente de Wompi.
  - *Decisión*: Definir interfaces y tipos de TypeScript exhaustivos y con nombres descriptivos para representar transacciones, estados, firmas y payloads de webhooks de Wompi. Esto proporciona una excelente experiencia de desarrollo (DX) al autocompletar propiedades y evitar errores en tiempo de ejecución.

## Risks / Trade-offs

- **Riesgo 1**: Afectación colateral en la configuración o dependencias de la aplicación `web/`.
  - *Mitigación*: El SDK estará aislado en `packages/wompi-nextjs-sdk/` con su propio `package.json` y `tsconfig.json`. La aplicación `web/` no importará este paquete de manera local ni lo declarará como dependencia hasta que esté completamente testeado y listo para integración opcional.
- **Riesgo 2**: Incompatibilidad criptográfica con entornos Edge de Next.js.
  - *Mitigación*: Por simplicidad y madurez, utilizaremos la librería estándar `crypto` de Node.js. Si bien Edge Runtime de Vercel prefiere `Web Crypto API`, las rutas API de Next.js por defecto se ejecutan en Node.js, donde `crypto` es idóneo. Si se requiere compatibilidad Edge en el futuro, se adaptará para usar `globalThis.crypto.subtle`.
