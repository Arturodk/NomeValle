## 1. Estructura y Configuración del SDK

- [x] 1.1 Crear el directorio `packages/wompi-nextjs-sdk` y subcarpetas `src` y `tests`
- [x] 1.2 Crear `packages/wompi-nextjs-sdk/package.json` con metadatos del SDK y dependencias de desarrollo (TypeScript)
- [x] 1.3 Crear `packages/wompi-nextjs-sdk/tsconfig.json` configurado para generar declaraciones de tipo (.d.ts) y código compatible con ES2022

## 2. Definición de Tipos y Criptografía

- [x] 2.1 Crear `src/types.ts` con tipos estrictos para transacciones, respuestas de API de Wompi, eventos de webhook y opciones de configuración
- [x] 2.2 Crear `src/crypto.ts` e implementar `generateIntegritySignature` empleando el módulo `crypto` de Node.js
- [x] 2.3 Implementar `validateWebhookSignature` en `src/crypto.ts` para validación segura de payloads de eventos

## 3. Cliente API e Indexación

- [x] 3.1 Crear `src/client.ts` con la clase `WompiClient` e implementar el método `getTransaction` usando `fetch` nativo
- [x] 3.2 Crear `src/index.ts` para exportar todos los métodos públicos del SDK, tipos y clientes

## 4. Pruebas y Calidad

- [x] 4.1 Crear un script de pruebas unitarias en `tests/crypto.test.ts` para validar firmas generadas y webhooks ficticios
- [x] 4.2 Ejecutar la compilación del SDK (`npm run build`) para verificar que no existan errores de compilación de TypeScript o de generación de tipos

## 5. Documentación de Código Abierto

- [x] 5.1 Crear `README.md` en inglés describiendo la instalación del SDK, inicialización, generación de firmas de integridad y verificación de webhooks
- [x] 5.2 Crear archivo `LICENSE` bajo la Licencia MIT para cumplir formalmente como repositorio Open Source
