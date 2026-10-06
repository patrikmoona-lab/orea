import React from 'react';
import {
  Check,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  HeartPulse,
  Clock,
  Droplets,
  PhoneCall,
  Stethoscope,
  Calendar,
  Pill,
  Heart,
  FileDown,
  Dumbbell,
  Apple,
  Calculator,
  Bot,
  GraduationCap,
  Award,
  PiggyBank,
  BellRing,
  MessageCircle,
  Users,
  Mic,
  TrendingUp,
  Cloud,
  Headphones,
  Building2,
  SlidersHorizontal,
} from 'lucide-react';
import { OreaPlan, BillingCycle, PlanId } from '../../types';
import { calculateSavings } from '../../data/plans';
import { OreaButton, OreaButtonVariant } from '../common/OreaButton';

interface PricingCardProps {
  plan: OreaPlan;
  billingCycle: BillingCycle;
  isCurrentPlan: boolean;
  onSelect: (planId: PlanId) => void;
}

// Map each feature text to a clean real SVG Lucide icon
function getFeatureIcon(text: string, planId: PlanId) {
  const lower = text.toLowerCase();
  const iconClass = 'w-4 h-4 shrink-0';

  if (lower.includes('encyclopédie') || lower.includes('livre')) {
    return <BookOpen className={iconClass} />;
  }
  if (lower.includes('fiches de santé') || lower.includes('prévention')) {
    return <HeartPulse className={iconClass} />;
  }
  if (lower.includes('hydratation') || lower.includes('eau')) {
    return <Droplets className={iconClass} />;
  }
  if (lower.includes('urgence') || lower.includes('24/7')) {
    return <PhoneCall className={iconClass} />;
  }
  if (lower.includes('symptôme') || lower.includes('guide')) {
    return <Stethoscope className={iconClass} />;
  }
  if (lower.includes('agenda') || lower.includes('consultation')) {
    return <Calendar className={iconClass} />;
  }
  if (lower.includes('armoire') || lower.includes('médicament') || lower.includes('posologie')) {
    return <Pill className={iconClass} />;
  }
  if (lower.includes('cycle') || lower.includes('fertilité')) {
    return <Heart className={iconClass} />;
  }
  if (lower.includes('pdf') || lower.includes('export')) {
    return <FileDown className={iconClass} />;
  }
  if (lower.includes('planner') || lower.includes('07h')) {
    return <Clock className={iconClass} />;
  }
  if (lower.includes('sport') || lower.includes('corps')) {
    return <Dumbbell className={iconClass} />;
  }
  if (lower.includes('nutrition') || lower.includes('terroir') || lower.includes('aliment')) {
    return <Apple className={iconClass} />;
  }
  if (lower.includes('budget') || lower.includes('cfa') || lower.includes('fcfa')) {
    return <Calculator className={iconClass} />;
  }
  if (lower.includes('assistant ia') || lower.includes('assistant orea')) {
    return <Bot className={iconClass} />;
  }
  if (lower.includes('bac g2') || lower.includes('cours') || lower.includes('comptabilité')) {
    return <GraduationCap className={iconClass} />;
  }
  if (lower.includes('simulateur') || lower.includes('syscohada') || lower.includes('annales')) {
    return <Award className={iconClass} />;
  }
  if (lower.includes('épargne') || lower.includes('objectifs')) {
    return <PiggyBank className={iconClass} />;
  }
  if (lower.includes('alerte') || lower.includes('accompagnement')) {
    return <BellRing className={iconClass} />;
  }
  if (lower.includes('whatsapp') || lower.includes('support')) {
    return <MessageCircle className={iconClass} />;
  }
  if (lower.includes('profils') || lower.includes('famille')) {
    return <Users className={iconClass} />;
  }
  if (lower.includes('éloquence') || lower.includes('parole') || lower.includes('négociation')) {
    return <Mic className={iconClass} />;
  }
  if (lower.includes('prévisionnelle') || lower.includes('analyse')) {
    return <TrendingUp className={iconClass} />;
  }
  if (lower.includes('cloud') || lower.includes('archivage')) {
    return <Cloud className={iconClass} />;
  }
  if (lower.includes('bilans trimestriels') || lower.includes('synthèse')) {
    return <HeartPulse className={iconClass} />;
  }
  if (lower.includes('ligne directe') || lower.includes('équipe')) {
    return <Headphones className={iconClass} />;
  }
  if (lower.includes('facturation') || lower.includes('groupée')) {
    return <Building2 className={iconClass} />;
  }
  if (lower.includes('tableau d’administration') || lower.includes('supervision')) {
    return <SlidersHorizontal className={iconClass} />;
  }

  // Generic fallback
  return <Check className={iconClass} />;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  billingCycle,
  isCurrentPlan,
  onSelect,
}) => {
  const isYearly = billingCycle === 'yearly';
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const isFree = plan.id === 'free';
  const isBusiness = plan.id === 'business';
  const isPlus = plan.id === 'plus';
  const isPremiumOrPro = plan.id === 'premium' || plan.id === 'pro';

  const savings = calculateSavings(plan.monthlyPrice, plan.yearlyPrice);
  const formattedPrice = price.toLocaleString('fr-FR');

  // Specific high-end styling variants
  const cardBorderClass = isPlus
    ? 'border-2 border-[#0056d6] shadow-xl sm:-translate-y-2 ring-4 ring-blue-500/10'
    : isPremiumOrPro
    ? 'border-2 border-slate-700/80 shadow-lg hover:border-[#0056d6]'
    : 'border border-[#cfe2f5] hover:border-[#0056d6]/60 shadow-sm hover:shadow-md';

  const cardBgClass = isPlus
    ? 'bg-gradient-to-b from-white via-[#f4f9ff] to-[#eaf3fd]'
    : isPremiumOrPro
    ? 'bg-gradient-to-b from-slate-900 to-[#0c1e38] text-white'
    : 'bg-white';

  const titleColor = isPremiumOrPro ? 'text-white' : 'text-[#0B2F5B]';
  const descColor = isPremiumOrPro ? 'text-slate-300' : 'text-slate-600';
  const priceColor = isPremiumOrPro ? 'text-white' : 'text-[#0B2F5B]';
  const periodColor = isPremiumOrPro ? 'text-slate-400' : 'text-slate-600';
  const borderColor = isPremiumOrPro ? 'border-slate-800' : 'border-slate-100';
  const featureTextColor = isPremiumOrPro ? 'text-slate-200' : 'text-slate-700';

  return (
    <div
      className={`relative flex flex-col justify-between h-full rounded-[26px] p-6 sm:p-7 transition-all duration-300 ${cardBgClass} ${cardBorderClass}`}
    >
      {/* Popular / Growth / Excellence Badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 w-max">
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm ${
              plan.isPopular
                ? 'bg-gradient-to-r from-[#0056d6] to-[#00A6C7] text-white ring-2 ring-white animate-pulse'
                : plan.id === 'premium'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black ring-2 ring-slate-900'
                : plan.id === 'pro'
                ? 'bg-gradient-to-r from-indigo-400 to-indigo-300 text-slate-950 font-black ring-2 ring-slate-900'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {plan.isPopular ? (
              <Award className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            ) : (
              <Award className="w-3.5 h-3.5" />
            )}
            <span>{plan.badge}</span>
          </span>
        </div>
      )}

      {/* Current Active Plan Indicator */}
      {isCurrentPlan && (
        <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold w-fit">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Votre forfait actuel</span>
        </div>
      )}

      <div>
        {/* 1. Nom du forfait */}
        <div className="mb-3 pt-1">
          <h3 className={`text-xl sm:text-2xl font-black ${titleColor} tracking-tight`}>
            {plan.name}
          </h3>
          {/* 2. Description */}
          <p className={`text-xs sm:text-sm mt-1.5 min-h-[44px] leading-relaxed ${descColor}`}>
            {plan.description}
          </p>
        </div>

        {/* 3. Prix en Francs CFA */}
        <div className={`py-4 border-y ${borderColor} mb-5`}>
          {isBusiness ? (
            <div>
              <span className={`text-2xl sm:text-3xl font-black ${priceColor}`}>Sur devis</span>
              <p className={`text-xs mt-1 ${periodColor}`}>Facturation adaptée en FCFA selon volume</p>
            </div>
          ) : isFree ? (
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl sm:text-4xl font-black ${priceColor}`}>0</span>
                <span className={`text-sm font-bold ${periodColor}`}>FCFA / mois</span>
              </div>
              <p className={`text-xs mt-1 ${periodColor}`}>100% gratuit, sans engagement</p>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className={`text-3xl sm:text-4xl font-black ${priceColor} tracking-tight`}>
                  {formattedPrice}
                </span>
                <span className={`text-xs sm:text-sm font-bold ${periodColor}`}>
                  FCFA {isYearly ? '/ an' : '/ mois'}
                </span>
              </div>

              {/* Real calculated savings indicator on yearly cycle */}
              {isYearly && savings.amountFcfa > 0 && (
                <div
                  className={`mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    isPremiumOrPro
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Économie : {savings.amountFcfa.toLocaleString('fr-FR')} FCFA / an</span>
                  <span>(~{savings.monthsFree} mois offerts)</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Fonctionnalités incluses (Vraies icônes SVG propres) */}
        <div className="space-y-3 mb-6">
          <p
            className={`text-[11px] font-bold uppercase tracking-wider ${
              isPremiumOrPro ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Fonctionnalités incluses :
          </p>
          <ul className="space-y-2.5">
            {plan.features.map((feat, idx) => (
              <li key={idx} className={`flex items-start gap-2.5 text-xs sm:text-sm ${featureTextColor}`}>
                <span
                  className={`mt-0.5 p-1 rounded-lg shrink-0 ${
                    isPremiumOrPro
                      ? 'bg-slate-800 text-blue-400 border border-slate-700'
                      : isPlus
                      ? 'bg-blue-100 text-[#0056d6]'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {getFeatureIcon(feat, plan.id)}
                </span>
                <span className="leading-snug pt-0.5">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. Bouton d'action mis en évidence avec Universal OreaButton */}
      <div className="pt-3">
        <OreaButton
          id={`btn-select-plan-${plan.id}`}
          variant={
            (isCurrentPlan
              ? 'ghost'
              : isPlus
              ? 'primary'
              : isPremiumOrPro
              ? 'pricing'
              : isFree
              ? 'secondary'
              : 'primary') as OreaButtonVariant
          }
          size="md"
          fullWidth
          disabled={isCurrentPlan}
          onClick={() => onSelect(plan.id)}
          iconRight={!isCurrentPlan ? <ArrowRight className="w-4 h-4" /> : undefined}
        >
          {isCurrentPlan
            ? 'Votre tarif actuel'
            : plan.ctaLabel
            ? plan.ctaLabel.replace(/forfait/gi, 'tarif').replace(/FORFAIT/g, 'TARIF')
            : isFree
            ? 'Commencer gratuitement'
            : 'Choisir ce tarif'}
        </OreaButton>
      </div>
    </div>
  );
};
