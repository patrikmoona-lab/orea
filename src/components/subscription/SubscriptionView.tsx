import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Calendar,
  CreditCard,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  ExternalLink,
  Shield,
  Zap,
} from 'lucide-react';
import { OreaUserProfile, PaymentTransaction, PlanId, BillingCycle } from '../../types';
import { OREA_PLANS } from '../../data/plans';
import { fetchUserPayments } from '../../lib/firebase';
import {
  FEATURE_DEFINITIONS,
  PLAN_TIERS,
  getUserEffectivePlan,
  PLAN_DISPLAY_NAMES,
  OreaFeature,
} from '../../services/subscription/featureAccess';
import { FamilyProfilesManager } from './FamilyProfilesManager';
import { BusinessOrgManager } from './BusinessOrgManager';

interface SubscriptionViewProps {
  currentUserProfile: OreaUserProfile;
  onChangePlan: () => void;
  onGoToPricing: () => void;
  onRenewPlan?: (planId: PlanId, billingCycle: BillingCycle) => void;
}

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({
  currentUserProfile,
  onChangePlan,
  onGoToPricing,
  onRenewPlan,
}) => {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);

  const effectivePlanId = getUserEffectivePlan(currentUserProfile);
  const sub = currentUserProfile.subscription;
  const isSubscribed = Boolean(sub && sub.planId && sub.planId !== 'free');
  const plan = OREA_PLANS.find((p) => p.id === effectivePlanId) || OREA_PLANS[0];

  const isExpired = sub?.expiresAt ? new Date(sub.expiresAt).getTime() < Date.now() : false;
  const realStatus = !isSubscribed ? 'free' : isExpired ? 'expired' : sub?.status || 'active';
  const billingCycle = sub?.billingCycle || 'monthly';

  const priceFcfa =
    plan.id === 'free'
      ? 0
      : billingCycle === 'yearly'
      ? plan.yearlyPrice
      : plan.monthlyPrice;

  useEffect(() => {
    async function loadHistory() {
      setIsLoadingPayments(true);
      try {
        const resp = await fetch(`/api/payments/user/${currentUserProfile.uid}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.success && Array.isArray(data.payments) && data.payments.length > 0) {
            setPayments(data.payments);
            setIsLoadingPayments(false);
            return;
          }
        }
      } catch {
        // fallback
      }

      try {
        const list = await fetchUserPayments(currentUserProfile.uid);
        setPayments(list);
      } catch (err) {
        console.warn('[Subscription] Erreur chargement historique paiements:', err);
      } finally {
        setIsLoadingPayments(false);
      }
    }

    loadHistory();
  }, [currentUserProfile.uid]);

  const formattedStart = sub?.startedAt
    ? new Date(sub.startedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  const formattedEnd = sub?.expiresAt
    ? new Date(sub.expiresAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Sans date d’expiration';

  // Compute available vs locked features
  const userTier = PLAN_TIERS[effectivePlanId] ?? 0;
  const allFeatures = Object.values(FEATURE_DEFINITIONS);

  const availableFeatures = allFeatures.filter((f) => {
    const reqTier = PLAN_TIERS[f.minPlan] ?? 0;
    return userTier >= reqTier;
  });

  const lockedFeatures = allFeatures.filter((f) => {
    const reqTier = PLAN_TIERS[f.minPlan] ?? 0;
    return userTier < reqTier;
  });

  const handleRenew = () => {
    if (onRenewPlan && effectivePlanId !== 'free') {
      onRenewPlan(effectivePlanId, billingCycle);
    } else {
      onChangePlan();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2F5B] tracking-tight">
              Mon abonnement
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Consultez vos privilèges actifs, dates d’échéance, fonctionnalités débloquées et historique de facturation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGoToPricing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0056d6] hover:bg-[#0B2F5B] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer w-fit"
            >
              <span>Voir tous les forfaits</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 1. Résumé du forfait actuel & Métadonnées */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cfe2f5] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0B2F5B] to-[#0056d6] text-white flex items-center justify-center shadow-sm shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Forfait actuel
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B2F5B]">
                  {plan.name}
                </h2>
              </div>
            </div>

            {/* Statut Badge */}
            <div>
              {realStatus === 'active' ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Abonnement actif</span>
                </span>
              ) : realStatus === 'expired' ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Abonnement expiré</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span>Accès gratuit permanent</span>
                </span>
              )}
            </div>
          </div>

          {/* Key Metrics: Prix, Début, Fin */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-slate-100 text-sm">
            <div>
              <span className="text-xs text-slate-500 block mb-1">Prix de la formule</span>
              <p className="text-xl font-black text-[#0B2F5B]">
                {priceFcfa === 0 ? '0 FCFA' : `${priceFcfa.toLocaleString('fr-FR')} FCFA`}
                {plan.id !== 'free' && (
                  <span className="text-xs font-normal text-slate-500 ml-1">
                    /{billingCycle === 'yearly' ? 'an' : 'mois'}
                  </span>
                )}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500 block mb-1">Date de début</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{formattedStart}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 block mb-1">Date d’expiration</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{formattedEnd}</span>
              </div>
            </div>
          </div>

          {/* Boutons d'actions : Changer de forfait & Renouveler */}
          <div className="pt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              id="btn-sub-change-plan"
              onClick={onChangePlan}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Changer de forfait</span>
            </button>

            {effectivePlanId !== 'free' && (
              <button
                type="button"
                id="btn-sub-renew-plan"
                onClick={handleRenew}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0056d6] hover:bg-[#0B2F5B] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm"
              >
                <Zap className="w-4 h-4" />
                <span>Renouveler mon abonnement</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Fonctionnalités Disponibles vs Verrouillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fonctionnalités Disponibles */}
          <div className="bg-white rounded-3xl p-6 border border-[#cfe2f5] shadow-xs">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0B2F5B]">
                  Fonctionnalités disponibles ({availableFeatures.length})
                </h3>
                <p className="text-xs text-slate-500">Incluses dans votre formule active</p>
              </div>
            </div>

            <ul className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {availableFeatures.map((f) => (
                <li key={f.id} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">{f.title}</span>
                    <p className="text-[11px] text-slate-500">{f.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Fonctionnalités Verrouillées */}
          <div className="bg-white rounded-3xl p-6 border border-[#cfe2f5] shadow-xs">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0B2F5B]">
                  Fonctionnalités verrouillées ({lockedFeatures.length})
                </h3>
                <p className="text-xs text-slate-500">Nécessite un forfait supérieur</p>
              </div>
            </div>

            {lockedFeatures.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-bold text-slate-700">Félicitations !</p>
                <p>Vous disposez du niveau de fonctionnalités le plus complet.</p>
              </div>
            ) : (
              <ul className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {lockedFeatures.map((f) => (
                  <li key={f.id} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-800">{f.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#0056d6] font-bold shrink-0">
                          Dès OREA {PLAN_DISPLAY_NAMES[f.minPlan]}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{f.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Profils Familiaux (Disponibles dès Pro) */}
        <FamilyProfilesManager
          currentUserProfile={currentUserProfile}
          onGoToPricing={onGoToPricing}
        />

        {/* Organisation Business (Disponible avec Business) */}
        <BusinessOrgManager
          currentUserProfile={currentUserProfile}
          onGoToPricing={onGoToPricing}
        />

        {/* 3. Historique des paiements */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cfe2f5] shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0B2F5B]">
                  Historique des paiements
                </h3>
                <p className="text-xs text-slate-500">
                  Transactions Mobile Money, Cartes Bancaires et reçus officiels
                </p>
              </div>
            </div>
          </div>

          {isLoadingPayments ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <div className="w-6 h-6 border-2 border-[#0056d6] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Chargement de vos transactions...</span>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-10 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
              <CreditCard className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Aucun paiement enregistré</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Vos reçus de paiement et références de transaction apparaîtront ici automatiquement.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Forfait</th>
                    <th className="py-3 px-4">Méthode</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Référence</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {new Date(p.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#0B2F5B]">
                        OREA {p.planId.toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4 capitalize">
                        {(p.provider || 'mobile_money').replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {p.amount.toLocaleString('fr-FR')} {p.currency}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {p.transactionReference || p.id.slice(0, 10)}
                      </td>
                      <td className="py-3.5 px-4">
                        {(p.status === 'successful' || (p.status as any) === 'succeeded') ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Validé</span>
                          </span>
                        ) : p.status === 'pending' || p.status === 'processing' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>En cours</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>Échoué</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
