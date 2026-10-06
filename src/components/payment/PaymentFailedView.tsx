import React from 'react';
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';

interface PaymentFailedViewProps {
  reason?: string;
  onRetry: () => void;
  onChangePaymentMethod: () => void;
}

export const PaymentFailedView: React.FC<PaymentFailedViewProps> = ({
  reason,
  onRetry,
  onChangePaymentMethod,
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-7 sm:p-9 border border-rose-200 shadow-lg text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Red Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 stroke-[2.2]" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold mb-3 border border-rose-200">
          Échec de transaction
        </span>

        <h1 className="text-2xl font-black text-[#0B2F5B] tracking-tight">
          Paiement non confirmé
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
          Le paiement n'a pas pu être finalisé. Votre compte bancaire ou mobile n'a pas été débité.
        </p>

        {/* Reason Box */}
        <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
          <p className="font-bold text-slate-700">Détail du motif :</p>
          <p className="text-slate-600 leading-relaxed">
            {reason ||
              'Délai de validation dépassé, solde insuffisant ou rejet par l’opérateur de télécommunication.'}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            type="button"
            id="btn-retry-payment"
            onClick={onRetry}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#0056d6] hover:bg-[#0B2F5B] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réessayer la transaction</span>
          </button>

          <button
            type="button"
            id="btn-change-payment-method"
            onClick={onChangePaymentMethod}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Modifier le mode de paiement</span>
          </button>
        </div>

        {/* Contact help */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Besoin d’aide ? Contactez notre assistance WhatsApp OREA.</span>
        </div>
      </div>
    </div>
  );
};
