## ADDED Requirements

### Requirement: Generación de firma de integridad
El SDK MUST proporcionar una función para calcular de forma segura la firma de integridad SHA-256 requerida por Wompi para las transacciones. La firma SHALL ser generada mediante la concatenación de la referencia de la transacción, el monto total en centavos, la moneda (ej. 'COP') y el secreto de integridad de la cuenta, codificados con SHA-256.

#### Scenario: Generación exitosa de firma de integridad
- **WHEN** se calcula la firma para la referencia 'ORDER-100', monto 5000000 centavos, moneda 'COP' y el secreto 'prod_integrity_XYZ123'
- **THEN** el SDK retorna la firma hash SHA-256 hexadecimal correspondiente y válida.

### Requirement: Validación de firmas de eventos de Webhook
El SDK MUST proveer un método para validar la firma de integridad adjunta a los eventos de webhook enviados por Wompi, verificando la coincidencia del hash SHA-256 calculado a partir del payload del evento, el timestamp y la clave secreta del webhook con la firma recibida.

#### Scenario: Validación exitosa de webhook legítimo
- **WHEN** se valida un payload de webhook de Wompi con firma correcta usando la clave del webhook y el timestamp provisto
- **THEN** el método de validación retorna true.

#### Scenario: Validación fallida de webhook con datos corruptos o firma incorrecta
- **WHEN** se intenta validar un evento de webhook alterado o con firma incorrecta
- **THEN** el método de validación retorna false.

### Requirement: Cliente de API de Wompi para consulta de transacciones
El SDK MUST proveer un cliente API tipado que exponga un método para consultar el estado actual y detalles de una transacción en Wompi a partir de su ID de transacción, conmutando dinámicamente entre el endpoint de Sandbox y el de Producción.

#### Scenario: Consulta exitosa de transacción de prueba en sandbox
- **WHEN** se realiza la consulta de la transacción '12345-test' marcándola como entorno de pruebas (sandbox)
- **THEN** el cliente realiza una petición HTTP al endpoint de pruebas de Wompi y retorna los detalles tipados de la transacción indicando su estado.
