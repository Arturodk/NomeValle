import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { reference, amount, currency = 'COP' } = await request.json();

    if (!reference || !amount) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos (reference, amount)' },
        { status: 400 }
      );
    }

    const secret = process.env.WOMPI_INTEGRITY_SECRET;
    if (!secret) {
      console.error('WOMPI_INTEGRITY_SECRET no está configurada');
      return NextResponse.json(
        { error: 'Error de configuración en el servidor' },
        { status: 500 }
      );
    }

    // Wompi requiere el monto en centavos (ej: 10000 para 100.00 COP)
    // Pero en nuestro sistema 'amount' ya debería venir en pesos (sin decimales usualmente)
    // Así que multiplicamos por 100.
    const amountInCents = Math.round(amount * 100);

    // Cadena a hashear: referencia + montoEnCentavos + moneda + secreto
    const chain = `${reference}${amountInCents}${currency}${secret}`;
    const hash = crypto.createHash('sha256').update(chain).digest('hex');

    return NextResponse.json({ signature: hash });
  } catch (error) {
    console.error('Error en API Integrity:', error);
    return NextResponse.json(
      { error: 'Error interno al generar la firma' },
      { status: 500 }
    );
  }
}
