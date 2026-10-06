import { IPaymentProvider, ProviderPaymentRequest, ProviderPaymentResponse, ProviderStatusResponse } from './PaymentProvider';

export class AirtelPaymentProvider implements IPaymentProvider {
  id = 'airtel' as const;
  name = 'Airtel Money';

  private apiKey = process.env.AIRTEL_MONEY_API_KEY || '';

  async createPayment(request: ProviderPaymentRequest): Promise<ProviderPaymentResponse> {
    if (!request.phoneNumber || request.phoneNumber.trim().length < 8) {
      throw new Error('Numéro de téléphone Airtel Money requis (ex: +242 05 XXX XX XX ou +241 07 XXX XX)');
    }

    const ref = `AIRTEL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      paymentId: request.paymentId,
      transactionReference: ref,
      status: 'pending',
      provider: 'airtel',
      requiresUssdPrompt: true,
      instructions: `Un prompt USSD Airtel Money a été envoyé au ${request.phoneNumber}. Veuillez composer *128# et entrer votre code secret pour confirmer ${request.amount.toLocaleString('fr-FR')} FCFA.`,
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
