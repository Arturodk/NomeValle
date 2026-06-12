# Wompi Next.js SDK

A lightweight, fully typed, dependency-free TypeScript/JavaScript SDK for integrating the **Wompi** payment gateway in Next.js (App Router & Pages Router) and Node.js applications.

## Features

- 🔒 **Secure Integrities**: Simple functions to generate SHA-256 integrity signatures for payment forms and checkout widgets.
- ⚡ **Webhook Verification**: Validates Wompi event notifications using SHA-256 integrity checksums to ensure requests are authentic.
- 🚀 **Typed API Client**: Complete TypeScript interfaces for Wompi transactions, customer data, billing information, and webhooks.
- 🌍 **Multi-Environment Support**: Seamlessly switches between Sandbox and Production environments.

## Installation

```bash
npm install wompi-nextjs-sdk
```

*(Note: Ensure you are using Node.js v18+ as this library utilizes the native global `fetch` API).*

## Usage

### 1. Initializing the Client

You can initialize the `WompiClient` by passing credentials and configuration options:

```typescript
import { WompiClient } from 'wompi-nextjs-sdk';

const wompi = new WompiClient({
  publicKey: process.env.WOMPI_PUBLIC_KEY,
  privateKey: process.env.WOMPI_PRIVATE_KEY,
  integritySecret: process.env.WOMPI_INTEGRITY_SECRET,
  webhookSecret: process.env.WOMPI_WEBHOOK_SECRET,
  sandbox: process.env.NODE_ENV !== 'production', // Defaults to true
});
```

### 2. Generating Integrity Signatures

Before rendering the Wompi Widget or submitting a transaction, you must generate an integrity signature to prevent tampering.

```typescript
import { generateIntegritySignature } from 'wompi-nextjs-sdk';

const reference = 'ORDER-12345';
const amountInCents = 4500000; // $45,000 COP
const currency = 'COP';
const integritySecret = process.env.WOMPI_INTEGRITY_SECRET!;

const signature = generateIntegritySignature(
  reference,
  amountInCents,
  currency,
  integritySecret
);

console.log('Integrity Signature:', signature);
```

### 3. Verification of Webhooks in Next.js

Below is an example of handling a webhook event in Next.js App Router (`app/api/wompi/webhook/route.ts`):

```typescript
import { NextResponse } from 'next/server';
import { validateWebhookSignature } from 'wompi-nextjs-sdk';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const webhookSecret = process.env.WOMPI_WEBHOOK_SECRET!;

    // Validate if the event actually came from Wompi
    const isValid = validateWebhookSignature(payload, webhookSecret);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { event, data } = payload;

    if (event === 'transaction.updated') {
      const transaction = data.transaction;
      
      console.log(`Transaction ${transaction.id} status is ${transaction.status}`);

      if (transaction.status === 'APPROVED') {
        // Update order status in your database
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

### 4. Fetching Transaction Details

You can query the status and payment details of any transaction using its ID:

```typescript
import { WompiClient } from 'wompi-nextjs-sdk';

const wompi = new WompiClient({
  privateKey: process.env.WOMPI_PRIVATE_KEY,
  sandbox: true,
});

async function checkPayment(transactionId: string) {
  try {
    const transaction = await wompi.getTransaction(transactionId);
    console.log('Status:', transaction.status);
    console.log('Amount (COP):', transaction.amount_in_cents / 100);
    console.log('Reference:', transaction.reference);
  } catch (error) {
    console.error('Failed to get transaction:', error);
  }
}
```

## TypeScript definitions

This SDK is built in TypeScript and ships with native typings. The main interfaces exported are:

- `WompiTransaction`: Detailed transaction parameters (status, amount, reference, customer metadata).
- `WompiWebhookPayload`: Raw object structure of Wompi webhook events.
- `WompiClientOptions`: Initialization parameters.
- `WompiTransactionStatus`: Type definition for `'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR'`.

## License

[MIT](LICENSE)
