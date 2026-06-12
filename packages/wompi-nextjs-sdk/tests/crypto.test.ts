import { generateIntegritySignature, validateWebhookSignature } from '../src/crypto.js';
import { WompiWebhookPayload } from '../src/types.js';
import { createHash } from 'crypto';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Test failed: ${message}`);
    process.exit(1);
  }
}

console.log('🧪 Iniciando pruebas unitarias de criptografía...');

// 1. Prueba de generateIntegritySignature
try {
  const reference = 'ORDER-999';
  const amountInCents = 1250000;
  const currency = 'COP';
  const integritySecret = 'secret_integrity_key_123456';
  
  const expectedConcat = `${reference}${amountInCents}${currency}${integritySecret}`;
  const expectedHash = createHash('sha256').update(expectedConcat).digest('hex');
  
  const resultHash = generateIntegritySignature(reference, amountInCents, currency, integritySecret);
  
  assert(resultHash === expectedHash, 'El hash generado por generateIntegritySignature no coincide con el esperado.');
  console.log('✅ Test generateIntegritySignature: PASÓ');
} catch (err: any) {
  console.error('❌ Error en test generateIntegritySignature:', err);
  process.exit(1);
}

// 2. Prueba de validateWebhookSignature (Firma Válida)
try {
  const webhookSecret = 'secret_event_webhook_key_789';
  
  const payload: WompiWebhookPayload = {
    event: 'transaction.updated',
    data: {
      transaction: {
        id: '99988-test',
        status: 'APPROVED',
        amount_in_cents: 1250000,
        reference: 'ORDER-999',
        currency: 'COP',
        payment_method_type: 'CARD',
        created_at: '2026-06-05T19:00:00Z'
      }
    },
    environment: 'sandbox',
    timestamp: 1686000000,
    sent_at: '2026-06-05T19:00:05Z',
    signature: {
      properties: [
        'transaction.id',
        'transaction.status',
        'transaction.amount_in_cents',
        'timestamp'
      ],
      checksum: '' // Se llenará abajo
    }
  };

  // Calcular el checksum correcto manualmente para la prueba
  // Concatenación esperada: "99988-test" + "APPROVED" + "1250000" + "1686000000" + secret
  const concatData = '99988-testAPPROVED12500001686000000' + webhookSecret;
  const checksum = createHash('sha256').update(concatData).digest('hex');
  payload.signature.checksum = checksum;

  const isValid = validateWebhookSignature(payload, webhookSecret);
  assert(isValid === true, 'validateWebhookSignature debería retornar true para un webhook válido.');
  console.log('✅ Test validateWebhookSignature (Firma Válida): PASÓ');

  // 3. Prueba de validateWebhookSignature (Firma Inválida por modificación de datos)
  const modifiedPayload = { ...payload, data: { ...payload.data, transaction: { ...payload.data.transaction, status: 'DECLINED' } } } as WompiWebhookPayload;
  const isInvalid = validateWebhookSignature(modifiedPayload, webhookSecret);
  assert(isInvalid === false, 'validateWebhookSignature debería retornar false si el payload fue alterado.');
  console.log('✅ Test validateWebhookSignature (Firma Alterada): PASÓ');

  // 4. Prueba de validateWebhookSignature (Firma Inválida por secreto incorrecto)
  const isInvalidSecret = validateWebhookSignature(payload, 'wrong_secret');
  assert(isInvalidSecret === false, 'validateWebhookSignature debería retornar false si el secreto es incorrecto.');
  console.log('✅ Test validateWebhookSignature (Secreto Incorrecto): PASÓ');

} catch (err: any) {
  console.error('❌ Error en test validateWebhookSignature:', err);
  process.exit(1);
}

console.log('🎉 ¡Todas las pruebas unitarias pasaron exitosamente!');
process.exit(0);
