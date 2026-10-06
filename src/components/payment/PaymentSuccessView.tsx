import React from 'react';
import { CheckCircle2, ShieldCheck, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { PaymentTransaction, OreaSubscription, OreaUserProfile } from '../../types';
import { OREA_PLANS } from '../../data/plans';

interface PaymentSuccessViewProps {
  payment: PaymentTransaction;
  subscription: OreaSubscription;
  currentUserProfile: OreaUserProfile;
  onGoToDashboard: () => void;
}

export const PaymentSuccessView: React.FC<PaymentSuccessViewProps> = ({
  payment,
  subscription,
  currentUserProfile,
  onGoToDashboard,
}) => {
  const plan = OREA_PLANS.find((p) => p.id === subscription.planId) || OREA_PLANS[1];
  const userName = currentUserProfile.firstName || currentUserProfile.displayName || 'Cher Membre';

  const formattedStart = new Date(subscription.startedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedEnd = new Date(subscription.expiresAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-7 sm:p-10 border border-[#cfe2f5] shadow-lg text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Animated Green Badge */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner mb-6">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Paiement confirmé avec succès</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2F5B] tracking-tight">
          Bienvenue dans {plan.name.toUpperCase()}, {userName} !
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Votre abonnement est maintenant actif. Vous avez désormais accès à l’ensemble des fonctionnalités et parcours d'évolution d'OREA.
        </p>

        {/* Subscription Recap Card */}
        <div className="my-8 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Forfait activé :</span>
            <strong className="text-[#0B2F5B] font-extrabold text-sm sm:text-base">
              {plan.name}
            </strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Facturation :</span>
            <strong className="text-slate-800 font-bold">
              {subscription.billingCycle === 'yearly' ? 'Annuelle' : 'Mensuelle'}
            </strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Montant réglé :</span>
            <strong className="text-[#0056d6] font-bold">
              {payment.amount.toLocaleString('fr-FR')} FCFA
            </strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Date de début :</span>
            <span className="text-slate-700 font-medium">{formattedStart}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Date d'expiration :</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedEnd}</span>
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-[11px] text-slate-400">
            <span>Réf. transaction :</span>
            <span className="font-mono">{payment.transactionReference || payment.id}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          id="btn-access-dashboard-success"
          onClick={onGoToDashboard}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0056d6] to-[#00A6C7] hover:from-[#0B2F5B] hover:to-[#0056d6] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Accéder à mon espace OREA</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
