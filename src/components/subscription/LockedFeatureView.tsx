import React from 'react';
import { Lock, ArrowRight, ShieldAlert, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { OreaFeature, getFeatureLockDetails } from '../../services/subscription/featureAccess';

interface LockedFeatureViewProps {
  feature: OreaFeature;
  onGoToPricing: () => void;
  onBackToHome?: () => void;
  compact?: boolean;
}

export const LockedFeatureView: React.FC<LockedFeatureViewProps> = ({
  feature,
  onGoToPricing,
  onBackToHome,
  compact = false,
}) => {
  const lockInfo = getFeatureLockDetails(feature);

  if (compact) {
    return (
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-blue-50/40 border border-[#cfe2f5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Fonctionnalité réservée
            </span>
            <p className="text-sm font-bold text-[#0B2F5B] mt-0.5">
              {lockInfo.lockSentence}
            </p>
            <p className="text-xs text-slate-500 line-clamp-1">{lockInfo.description}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onGoToPricing}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0056d6] hover:bg-[#0B2F5B] text-white text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap"
        >
          <span>Voir les forfaits</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-xl w-full bg-white rounded-3xl p-7 sm:p-10 border border-[#cfe2f5] shadow-xl text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-amber-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

        {/* Lock Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center mx-auto mb-6 shadow-md shadow-amber-500/20">
          <Lock className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        {/* Feature Title */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-[#0056d6] border border-blue-200 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3 h-3 text-[#0056d6]" />
          <span>{lockInfo.featureTitle}</span>
        </span>

        {/* The Exact User Requested Locking Phrase */}
        <h2 className="text-xl sm:text-2xl font-black text-[#0B2F5B] tracking-tight mb-3">
          {lockInfo.lockSentence}
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
          {lockInfo.description ||
            'Débloquez l’accès complet à ce module ainsi qu’à l’ensemble des outils avancés OREA pour votre santé, vos finances et votre progression.'}
        </p>

        {/* Key perks of the required tier */}
        <div className="bg-[#F8FAFC] rounded-2xl p-4 mb-7 border border-slate-200/80 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Activation instantanée après paiement sécurisé</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Disponible sur ordinateur, tablette et smartphone</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Sans engagement : modifiez votre forfait à tout moment</span>
          </div>
        </div>

        {/* Action Buttons: The Exact Required "Voir les forfaits" button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
          )}

          <button
            type="button"
            id="btn-locked-feature-see-plans"
            onClick={onGoToPricing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#0056d6] to-[#00A6C7] hover:from-[#0B2F5B] hover:to-[#0056d6] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Voir les forfaits</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
