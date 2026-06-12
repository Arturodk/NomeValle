import { WompiClientOptions, WompiTransaction } from './types.js';

export class WompiClient {
  private publicKey?: string;
  private privateKey?: string;
  private integritySecret?: string;
  private webhookSecret?: string;
  private sandbox: boolean;

  constructor(options: WompiClientOptions = {}) {
    this.publicKey = options.publicKey;
    this.privateKey = options.privateKey;
    this.integritySecret = options.integritySecret;
    this.webhookSecret = options.webhookSecret;
    // Si no se especifica, por defecto sandbox es true por seguridad
    this.sandbox = options.sandbox ?? true;
  }

  /**
   * Retorna la URL base correspondiente al entorno configurado.
   */
  private getBaseUrl(): string {
    return this.sandbox 
      ? 'https://sandbox.wompi.co/v1' 
      : 'https://production.wompi.co/v1';
  }

  /**
   * Consulta los detalles de una transacción por su ID en Wompi.
   * Conmuta automáticamente al entorno Sandbox si el ID contiene el sufijo 'test'
   * para facilitar el desarrollo local, de lo contrario sigue el entorno configurado.
   * 
   * @param transactionId ID de la transacción en Wompi (ej: "12345-test" o "12345")
   * @returns La transacción detallada y tipada
   */
  async getTransaction(transactionId: string): Promise<WompiTransaction> {
    if (!transactionId) {
      throw new Error('El ID de la transacción es obligatorio.');
    }

    // Auto-detectar si el ID es de pruebas (sandbox)
    const isTestId = transactionId.toLowerCase().includes('test');
    
    // Si el ID es de prueba o estamos configurados en sandbox, usamos el endpoint de sandbox
    const baseUrl = (isTestId || this.sandbox)
      ? 'https://sandbox.wompi.co/v1'
      : 'https://production.wompi.co/v1';

    const url = `${baseUrl}/transactions/${transactionId}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // La autenticación privada se requiere para algunas operaciones de consulta
    if (this.privateKey) {
      headers['Authorization'] = `Bearer ${this.privateKey}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorReason = response.statusText;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.reason) {
          errorReason = errorJson.error.reason;
        } else if (typeof errorJson.error === 'string') {
          errorReason = errorJson.error;
        }
      } catch {
        // Ignorar si no es JSON válido
      }
      throw new Error(`Error en API de Wompi (Status ${response.status}): ${errorReason}`);
    }

    const payload = await response.json();
    if (!payload || !payload.data) {
      throw new Error('Respuesta inválida de Wompi: Falta propiedad "data" en el payload.');
    }

    return payload.data as WompiTransaction;
  }
}
