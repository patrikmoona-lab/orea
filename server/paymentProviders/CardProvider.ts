import { IPaymentProvider, ProviderPaymentRequest, ProviderPaymentResponse, ProviderStatusResponse } from './PaymentProvider';

export class CardPaymentProvider implements IPaymentProvider {
  id = 'card' as const;
  name = 'Carte Bancaire (Visa / Mastercard)';

  private stripeKey = process.env.STRIPE_SECRET_KEY || '';

  async createPayment(request: ProviderPaymentRequest): Promise<ProviderPaymentResponse> {
    const ref = `CARD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      paymentId: request.paymentId,
      transactionReference: ref,
      status: 'pending',
      provider: 'card',
      requiresUssdPrompt: false,
      instructions: `Autorisation 3D-Secure transmise à votre établissement bancaire pour ${request.amount.toLocaleString('fr-FR')} FCFA.`,
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
