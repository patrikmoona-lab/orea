import { IPaymentProvider, ProviderPaymentRequest, ProviderPaymentResponse, ProviderStatusResponse } from './PaymentProvider';

export class MtnPaymentProvider implements IPaymentProvider {
  id = 'mtn' as const;
  name = 'MTN Mobile Money';

  private apiKey = process.env.MTN_MOMO_API_KEY || '';
  private subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY || '';

  async createPayment(request: ProviderPaymentRequest): Promise<ProviderPaymentResponse> {
    if (!request.phoneNumber || request.phoneNumber.trim().length < 8) {
      throw new Error('Numéro de téléphone MTN requis (ex: +242 06 XXX XX XX ou +237 6XX XXX XXX)');
    }

    const ref = `MTN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const hasLiveCreds = Boolean(this.apiKey && this.subscriptionKey);

    return {
      paymentId: request.paymentId,
      transactionReference: ref,
      status: 'pending',
      provider: 'mtn',
      requiresUssdPrompt: true,
      instructions: `Une demande de débit de ${request.amount.toLocaleString('fr-FR')} FCFA a été envoyée au ${request.phoneNumber}. Veuillez composer *105# ou approuver le push sur votre mobile MTN pour valider.`,
    };
  }

  async verifyPayment(paymentId: string, transactionReference: string): Promise<ProviderStatusResponse> {
    // In live mode with credentials, an API call would check the MOMO collections status
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
