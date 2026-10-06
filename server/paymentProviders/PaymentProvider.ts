export type PaymentProviderId = 'mtn' | 'airtel' | 'orange' | 'wave' | 'card' | 'paypal';
export type PaymentStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'cancelled' | 'expired';

export interface ProviderPaymentRequest {
  paymentId: string;
  userId: string;
  userEmail: string;
  userName: string;
  planId: string;
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  phoneNumber?: string;
  cardNumberMasked?: string;
  returnUrl?: string;
}

export interface ProviderPaymentResponse {
  paymentId: string;
  transactionReference: string;
  status: PaymentStatus;
  provider: PaymentProviderId;
  instructions: string;
  redirectUrl?: string;
  requiresUssdPrompt?: boolean;
}

export interface ProviderStatusResponse {
  paymentId: string;
  transactionReference: string;
  status: PaymentStatus;
  isConfirmed: boolean;
  failureReason?: string;
  updatedAt: string;
}

export interface IPaymentProvider {
  id: PaymentProviderId;
  name: string;

  /**
   * Initialise le paiement auprès du prestataire
   */
  createPayment(request: ProviderPaymentRequest): Promise<ProviderPaymentResponse>;

  /**
   * Interroge le prestataire pour vérifier l'état réel de la transaction
   */
  verifyPayment(paymentId: string, transactionReference: string): Promise<ProviderStatusResponse>;

  /**
   * Retourne le statut courant
   */
  getPaymentStatus(paymentId: string, transactionReference: string): Promise<ProviderStatusResponse>;
}
