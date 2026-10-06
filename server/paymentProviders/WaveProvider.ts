import { IPaymentProvider, ProviderPaymentRequest, ProviderPaymentResponse, ProviderStatusResponse } from './PaymentProvider';

export class WavePaymentProvider implements IPaymentProvider {
  id = 'wave' as const;
  name = 'Wave Money';

  private apiKey = process.env.WAVE_API_KEY || '';

  async createPayment(request: ProviderPaymentRequest): Promise<ProviderPaymentResponse> {
    if (!request.phoneNumber || request.phoneNumber.trim().length < 8) {
      throw new Error('Numéro de téléphone Wave requis (ex: +225 0X XXX XXX ou +221 7X XXX XXX)');
    }

    const ref = `WAVE-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      paymentId: request.paymentId,
      transactionReference: ref,
      status: 'pending',
      provider: 'wave',
      requiresUssdPrompt: false,
      instructions: `Un lien de paiement Wave sans frais a été préparé pour ${request.phoneNumber}. Ouvrez l'application Wave pour approuver le paiement de ${request.amount.toLocaleString('fr-FR')} FCFA.`,
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
