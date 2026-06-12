import { createHash } from 'crypto';
import { WompiWebhookPayload } from './types.js';

/**
 * Genera la firma de integridad SHA-256 requerida por Wompi para asegurar
 * que la transacción no ha sido alterada antes de ser procesada.
 * 
 * @param reference Referencia única de la transacción (ej. order ID)
 * @param amountInCents Monto total de la transacción en centavos (ej. 4500000 para $45,000)
 * @param currency Moneda en formato ISO 4217 (ej. 'COP')
 * @param integritySecret El secreto de integridad proveído por Wompi en tu panel comercial
 * @returns La firma SHA-256 en formato hexadecimal
 */
export function generateIntegritySignature(
  reference: string,
  amountInCents: number,
  currency: string,
  integritySecret: string
): string {
  const concatenation = `${reference}${amountInCents}${currency}${integritySecret}`;
  return createHash('sha256').update(concatenation).digest('hex');
}

/**
 * Valida la firma de integridad (checksum) recibida en un evento de webhook de Wompi.
 * 
 * @param payload El payload JSON completo recibido en el cuerpo del webhook
 * @param webhookSecret El secreto del webhook / eventos provisto por Wompi
 * @returns True si la firma calculada coincide con el checksum del payload, false de lo contrario
 */
export function validateWebhookSignature(
  payload: WompiWebhookPayload,
  webhookSecret: string
): boolean {
  if (!payload || !payload.signature || !payload.signature.properties || !payload.signature.checksum) {
    return false;
  }

  const { properties, checksum } = payload.signature;
  
  try {
    // Concatenamos los valores en el orden especificado en el array properties
    let concatenatedValues = '';
    
    for (const prop of properties) {
      let value: any;
      
      if (prop.startsWith('transaction.')) {
        const field = prop.replace('transaction.', '');
        value = payload.data?.transaction?.[field];
      } else if (prop === 'timestamp') {
        value = payload.timestamp;
      } else {
        // Fallback para resolver paths genéricos (ej: "event", etc.)
        const parts = prop.split('.');
        let current: any = payload;
        for (const part of parts) {
          if (current == null) {
            current = undefined;
            break;
          }
          current = current[part];
        }
        value = current;
      }

      if (value !== undefined && value !== null) {
        concatenatedValues += value.toString();
      }
    }

    // Al final concatenamos la clave secreta de eventos/webhook de Wompi
    const computedHash = createHash('sha256')
      .update(concatenatedValues + webhookSecret)
      .digest('hex');

    return computedHash === checksum;
  } catch (error) {
    console.error('Error al validar la firma del webhook de Wompi:', error);
    return false;
  }
}
