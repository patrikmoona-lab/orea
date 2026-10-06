import { IPaymentProvider, ProviderPaymentRequest, ProviderPaymentResponse, ProviderStatusResponse } from './PaymentProvider';

export class OrangePaymentProvider implements IPaymentProvider {
  id = 'orange' as const;
  name = 'Orange Money';

  async createPayment(request: ProviderPaymentRequest): Promise<ProviderPaymentResponse> {
    if (!request.phoneNumber || request.phoneNumber.trim().length < 8) {
      throw new Error('Numéro Orange Money requis (ex: +237 69X XXX XXX ou +225 07X XXX XXX)');
    }

    const ref = `OM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      paymentId: request.paymentId,
      transactionReference: ref,
      status: 'pending',
      provider: 'orange',
      requiresUssdPrompt: true,
      instructions: `Veuillez générer votre code d'autorisation en composant le #144*77# ou valider la notification Orange Money reçue sur votre téléphone pour ${request.amount.toLocaleString('fr-FR')} FCFA.`,
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
