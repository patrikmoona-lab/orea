import { PaymentRequestPayload, PaymentResult } from './types';
import { PaymentTransaction, OreaSubscription } from '../../types';
import { savePaymentTransaction, updateUserSubscription } from '../../lib/firebase';

export class PaymentService {
  /**
   * Crée et initialise une transaction de paiement auprès du backend OREA
   */
  static async createPayment(payload: PaymentRequestPayload): Promise<PaymentResult> {
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Échec lors de l’initialisation du paiement');
      }

      const payment = data.payment;

      // Sauvegarde dans Firestore pour persistance cloud durable
      try {
        await savePaymentTransaction({
          id: payment.id,
          userId: payment.userId,
          userEmail: payment.userEmail,
          userName: payment.userName,
          planId: payment.planId,
          billingCycle: payment.billingCycle,
          amount: payment.amount,
          currency: payment.currency,
          provider: payment.provider,
          phoneNumber: payment.phoneNumber,
          status: payment.status,
          transactionReference: payment.transactionReference,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        });
      } catch (firestoreErr) {
        console.warn('[PaymentService] Synchro Firestore différée:', firestoreErr);
      }

      return {
        paymentId: payment.id,
        transactionReference: payment.transactionReference,
        status: payment.status,
        provider: payment.provider,
        instructions: data.instructions,
        redirectUrl: data.redirectUrl,
      };
    } catch (err: any) {
      console.error('[PaymentService.createPayment]', err);
      throw err;
    }
  }

  /**
   * Vérifie auprès du serveur le statut réel du paiement et active l'abonnement
   */
  static async verifyPayment(
    paymentId: string,
    transactionReference: string
  ): Promise<{
    isConfirmed: boolean;
    status: string;
    payment?: PaymentTransaction;
    subscription?: OreaSubscription;
    message?: string;
  }> {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId, transactionReference }),
      });

      const data = await response.json();

      if (data.isConfirmed && data.subscription && data.payment) {
        // Mettre à jour Firestore côté client pour persistance instantanée
        try {
          await savePaymentTransaction(data.payment);
          await updateUserSubscription(data.payment.userId, data.subscription);
        } catch (syncErr) {
          console.warn('[PaymentService] Synchro Firestore confirmation:', syncErr);
        }

        return {
          isConfirmed: true,
          status: 'successful',
          payment: data.payment,
          subscription: data.subscription,
        };
      }

      return {
        isConfirmed: false,
        status: data.status || 'pending',
        payment: data.payment,
        message: data.message || 'Validation en attente sur votre appareil',
      };
    } catch (err: any) {
      console.error('[PaymentService.verifyPayment]', err);
      throw err;
    }
  }

  /**
   * Récupère le statut d'un paiement
   */
  static async getPaymentStatus(paymentId: string): Promise<PaymentTransaction | null> {
    try {
      const response = await fetch(`/api/payments/status/${paymentId}`);
      const data = await response.json();
      if (data.success && data.payment) {
        return data.payment;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Annule une transaction en attente
   */
  static async cancelPayment(paymentId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/payments/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId }),
      });
      const data = await response.json();
      return Boolean(data.success);
    } catch {
      return false;
    }
  }
}
