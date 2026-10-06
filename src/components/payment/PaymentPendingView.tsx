import React, { useState, useEffect } from 'react';
import { Smartphone, RefreshCw, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { PaymentResult } from '../../services/payments/types';
import { PaymentService } from '../../services/payments/paymentService';
import { PaymentTransaction, OreaSubscription } from '../../types';

interface PaymentPendingViewProps {
  paymentResult: PaymentResult;
  onPaymentConfirmed: (payment: PaymentTransaction, subscription: OreaSubscription) => void;
  onCancel: () => void;
}

export const PaymentPendingView: React.FC<PaymentPendingViewProps> = ({
  paymentResult,
  onPaymentConfirmed,
  onCancel,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Poll status periodically every 5 seconds (up to 24 times = 2 minutes)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const runCheck = async () => {
      try {
        const verification = await PaymentService.verifyPayment(
          paymentResult.paymentId,
          paymentResult.transactionReference
        );

        if (verification.isConfirmed && verification.payment && verification.subscription) {
          onPaymentConfirmed(verification.payment, verification.subscription);
          return;
        }
      } catch (e) {
        console.warn('[Pending Check Error]', e);
      }

      setCheckCount((prev) => prev + 1);
    };

    if (checkCount < 24) {
      timer = setTimeout(runCheck, 5000);
    }

    return () => clearTimeout(timer);
  }, [checkCount, paymentResult, onPaymentConfirmed]);

  const handleManualCheck = async () => {
    setIsChecking(true);
    setStatusMessage(null);

    try {
      const verification = await PaymentService.verifyPayment(
        paymentResult.paymentId,
        paymentResult.transactionReference
      );

      if (verification.isConfirmed && verification.payment && verification.subscription) {
        onPaymentConfirmed(verification.payment, verification.subscription);
      } else {
        setStatusMessage(
          verification.message || 'La transaction n’est pas encore confirmée. Veuillez valider le prompt sur votre mobile.'
        );
      }
    } catch (err: any) {
      setStatusMessage('Erreur lors de la vérification. Réessayez dans quelques secondes.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-7 sm:p-9 border border-[#cfe2f5] shadow-lg text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Animated Phone / USSD Icon */}
        <div className="relative w-18 h-18 mx-auto mb-6">
          <div className="w-18 h-18 rounded-3xl bg-blue-50 border border-blue-200 text-[#0056d6] flex items-center justify-center shadow-inner">
            <Smartphone className="w-9 h-9 stroke-[1.8] animate-bounce" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
          </span>
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-3 border border-amber-200">
          En attente de validation mobile
        </span>

        <h1 className="text-2xl font-black text-[#0B2F5B] tracking-tight">
          Paiement en attente
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
          Veuillez confirmer la transaction sur votre téléphone.
        </p>

        {/* Instructions Box */}
        <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
          <p className="font-bold text-slate-700">Instructions :</p>
          <p className="text-slate-600 leading-relaxed">
            {paymentResult.instructions ||
              'Composez le code USSD de votre opérateur ou ouvrez votre application Mobile Money pour entrer votre code secret.'}
          </p>
          <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Réf : {paymentResult.transactionReference}</span>
            <span>Statut : En cours</span>
          </div>
        </div>

        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Auto verification feedback */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-6">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0056d6]" />
          <span>Vérification automatique du statut...</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            id="btn-manual-verify-payment"
            onClick={handleManualCheck}
            disabled={isChecking}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#0056d6] hover:bg-[#0B2F5B] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isChecking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Interrogation du serveur...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>J’ai validé sur mon téléphone</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 px-4 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Annuler ou changer de mode de paiement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
