import { IPaymentProvider, ProviderPaymentRequest, ProviderPaymentResponse, ProviderStatusResponse } from './PaymentProvider';

export class PayPalPaymentProvider implements IPaymentProvider {
  id = 'paypal' as const;
  name = 'PayPal International';

  private clientId = process.env.PAYPAL_CLIENT_ID || '';

  async createPayment(request: ProviderPaymentRequest): Promise<ProviderPaymentResponse> {
    const ref = `PAYPAL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      paymentId: request.paymentId,
      transactionReference: ref,
      status: 'pending',
      provider: 'paypal',
      requiresUssdPrompt: false,
      instructions: `Redirection vers le portail de sécurisation PayPal pour valider votre souscription (${request.amount.toLocaleString('fr-FR')} FCFA).`,
    };
  }

  async verifyPayment(paymentId: string, transactionReference: string): Promise<ProviderStatusResponse> {
    return {
      paymentId,
      transactionReference,
      status: 'successful',
      isConfirmed: true,
      updatedAt: new Date().toISOString(),
    };
  }

  async getPaymentStatus(paymentId: string, transactionReference: string): Promise<ProviderStatusResponse> {
    return {
      paymentId,
      transactionReference,
      status: 'pending',
      isConfirmed: false,
      updatedAt: new Date().toISOString(),
    };
  }
}
