export type WompiTransactionStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';

export interface WompiTransaction {
  id: string;
  created_at: string;
  amount_in_cents: number;
  reference: string;
  currency: string;
  payment_method_type: string;
  payment_method?: {
    type: string;
    extra?: Record<string, any>;
    [key: string]: any;
  };
  redirect_url?: string;
  status: WompiTransactionStatus;
  status_message?: string | null;
  customer_email?: string;
  customer_data?: Record<string, any>;
  billing_data?: Record<string, any>;
  shipping_address?: Record<string, any>;
  [key: string]: any;
}

export interface WompiWebhookPayload {
  event: string;
  data: {
    transaction: WompiTransaction;
  };
  environment: string;
  signature: {
    properties: string[];
    checksum: string;
  };
  timestamp: number;
  sent_at: string;
}

export interface WompiClientOptions {
  publicKey?: string;
  privateKey?: string;
  integritySecret?: string;
  webhookSecret?: string;
  sandbox?: boolean;
}
