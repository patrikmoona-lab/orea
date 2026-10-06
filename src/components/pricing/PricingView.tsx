import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Zap, CheckCircle2, Lock, Award, Building2, CreditCard, Shield } from 'lucide-react';
import { BillingCycle, OreaUserProfile, PlanId } from '../../types';
import { OREA_PLANS } from '../../data/plans';
import { BillingSwitch } from './BillingSwitch';
import { PricingCard } from './PricingCard';
import { OreaButton } from '../common/OreaButton';

interface PricingViewProps {
  currentUserProfile: OreaUserProfile | null;
  onSelectPlan: (planId: PlanId, billingCycle: BillingCycle) => void;
  onNavigateToAuth: (intendedPlan?: { planId: PlanId; billingCycle: BillingCycle }) => void;
  onNavigateToDashboard: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  currentUserProfile,
  onSelectPlan,
  onNavigateToAuth,
  onNavigateToDashboard,
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const currentSub = currentUserProfile?.subscription;
  const isCurrentSubActive = currentSub?.status === 'active';
  const currentPlanId = isCurrentSubActive ? currentSub?.planId : 'free';

  const handlePlanSelect = (planId: PlanId) => {
    if (planId === 'free') {
      if (onNavigateToDashboard) {
        onNavigateToDashboard();
      }
      return;
    }

    if (planId === 'business') {
      window.location.href = 'mailto:contact@orea.app?subject=Demande%20de%20devis%20OREA%20Business';
      return;
    }

    onSelectPlan(planId, billingCycle);
  };

  // Group plans
  const tier1Plans = OREA_PLANS.filter((p) => ['free', 'essentiel', 'plus'].includes(p.id));
  const tier2Plans = OREA_PLANS.filter((p) => ['premium', 'pro'].includes(p.id));
  const businessPlan = OREA_PLANS.find((p) => p.id === 'business');

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Banner if already subscribed */}
        {isCurrentSubActive && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-[#0056d6] text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Votre abonnement en cours
                </p>
                <h4 className="text-base sm:text-lg font-black text-[#0B2F5B]">
                  Tarif OREA {currentSub?.planId.toUpperCase()} ({currentSub?.billingCycle === 'yearly' ? 'Annuel' : 'Mensuel'})
                </h4>
                <p className="text-xs text-slate-600">
                  Actif jusqu’au{' '}
                  <strong className="text-slate-800 font-bold">
                    {currentSub?.expiresAt
                      ? new Date(currentSub.expiresAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Non spécifié'}
                  </strong>
                </p>
              </div>
            </div>
            <OreaButton
              variant="outline"
              size="sm"
              onClick={onNavigateToDashboard}
            >
              Accéder à mon espace
            </OreaButton>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#0056d6] text-xs font-black tracking-wider uppercase mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Tarification transparente en Francs CFA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B2F5B] tracking-tight">
            Choisissez votre expérience OREA
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            « Mieux comprendre. Mieux vivre. Mieux évoluer. »<br />
            Des tarifs pensés pour votre santé, votre organisation quotidienne, votre progression sportive et vos ambitions académiques.
          </p>

          {/* Billing Switch Component (Monthly / Yearly) */}
          <div className="mt-8 flex justify-center">
            <BillingSwitch
              value={billingCycle}
              onChange={setBillingCycle}
              maxSavingsMonths={2}
              maxSavingsPercent={17}
            />
          </div>
        </div>

        {/* Primary Plans Grid (Free, Essentiel, Plus) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-14">
          {tier1Plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              isCurrentPlan={isCurrentSubActive && currentPlanId === plan.id}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>

        {/* SECTION PREMIUM: Distinct Visual Separator */}
        <div className="mb-14 pt-8 border-t border-slate-200/90">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black tracking-wider uppercase border border-indigo-200 mb-2">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>Section Haute Performance</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2F5B] tracking-tight">
              Pour les étudiants d’élite, professionnels et familles
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Modules approfondis : BAC G2 complet, Assistant IA illimité et multi-profils
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto items-stretch">
            {tier2Plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
                isCurrentPlan={isCurrentSubActive && currentPlanId === plan.id}
                onSelect={handlePlanSelect}
              />
            ))}
          </div>
        </div>

        {/* OREA BUSINESS SECTION */}
        {businessPlan && (
          <div className="mt-14 rounded-3xl bg-gradient-to-br from-[#0B2F5B] via-[#074a88] to-[#052b54] text-white p-7 sm:p-10 shadow-xl relative overflow-hidden border border-blue-900">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-[11px] uppercase tracking-wider mb-3 shadow-xs">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Écoles, Universités & Entreprises</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {businessPlan.name}
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-blue-100 leading-relaxed">
                  {businessPlan.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-blue-100">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Facturation groupée en FCFA</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Tableau d’administration</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Support dédié</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-full lg:w-auto">
                <OreaButton
                  id="btn-business-inquiry"
                  variant="gold"
                  size="lg"
                  onClick={() => handlePlanSelect('business')}
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  {businessPlan.ctaLabel}
                </OreaButton>
              </div>
            </div>
          </div>
        )}

        {/* PAIEMENTS: Section rassurante */}
        <div className="mt-16 pt-10 border-t border-slate-200 text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-1">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Paiements sécurisés</span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-[#0B2F5B]">
            Mobile Money (MTN, Airtel, Orange, Wave), Carte Bancaire & PayPal
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Activation instantanée dès validation de la transaction. Aucun prélèvement caché. Changement de tarif possible à tout moment depuis votre espace.
          </p>
        </div>
      </div>
    </div>
  );
};

