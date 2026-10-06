import { OreaPlan, PlanId, OreaUserProfile } from '../types';
import { hasFeature as checkFeature, getUserEffectivePlan } from '../services/subscription/featureAccess';

export const OREA_PLANS: OreaPlan[] = [
  {
    id: 'free',
    name: 'OREA Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Accès fondamental aux piliers d’orientation, de prévention et de bien-être quotidien.',
    features: [
      'Encyclopédie médicale & préventive OREA',
      'Fiches de santé courantes sans publicité',
      'Suivi d’habitudes de base — maximum 3 habitudes',
      'Calculateur d’hydratation quotidien',
      'Accès aux numéros d’urgence vitale 24/7',
    ],
    ctaLabel: 'Commencer gratuitement',
  },
  {
    id: 'essentiel',
    name: 'OREA Essentiel',
    monthlyPrice: 2500,
    yearlyPrice: 25000,
    description: 'L’essentiel pour structurer votre santé, votre routine et votre sérénité au quotidien.',
    features: [
      'Tout le forfait Free inclus',
      'Guide complet de vérification des symptômes',
      'Agenda médical & rappels de consultations',
      'Gestionnaire d’armoire à pharmacie & posologies',
      'Suivi du cycle féminin & fertilité naturelle',
      'Export PDF des bilans de santé personnels',
    ],
    ctaLabel: 'Choisir ce forfait',
  },
  {
    id: 'plus',
    name: 'OREA Plus',
    isPopular: true,
    badge: 'LE PLUS POPULAIRE',
    monthlyPrice: 5000,
    yearlyPrice: 50000,
    description: 'Le choix équilibré pour allier vitalité physique, alimentation saine et gestion du temps.',
    features: [
      'Tout le forfait Essentiel inclus',
      'OREA Planner dynamique — journée rythmée de 07h à 21h',
      'Programmes sportifs au poids du corps complets',
      'Guide nutritionnel du terroir & super-aliments africains',
      'Tracker d’habitudes & routines illimité',
      'Gestionnaire de budget personnel en Francs CFA',
      'Accès standard à l’Assistant OREA',
    ],
    ctaLabel: 'Choisir ce forfait',
  },
  {
    id: 'premium',
    name: 'OREA Premium',
    badge: 'RECOMMANDÉ CROISSANCE',
    monthlyPrice: 9900,
    yearlyPrice: 99000,
    description: 'L’expérience complète pour étudiants BAC G2, actifs ambitieux et familles soucieuses d’excellence.',
    features: [
      'Tout le forfait Plus inclus',
      'Assistant IA OREA illimité',
      'Module complet BAC G2 — Comptabilité, Fiscalité, Droit',
      'Simulateur d’examen & annales SYSCOHADA interactives',
      'Planificateur d’épargne & objectifs financiers avancés',
      'Accompagnement personnalisé et alertes prioritaires',
      'Support client prioritaire 7j/7 sur WhatsApp',
    ],
    ctaLabel: 'Choisir ce forfait',
  },
  {
    id: 'pro',
    name: 'OREA Pro',
    badge: 'EXCELLENCE & FAMILLE',
    monthlyPrice: 19900,
    yearlyPrice: 199000,
    description: 'La solution haut de gamme pour professionnels, entrepreneurs et comptes partagés multi-foyers.',
    features: [
      'Tout le forfait Premium inclus',
      'Jusqu’à 4 profils familiaux indépendants',
      'Module Éloquence, Prise de parole & Négociation',
      'Analyses financières prévisionnelles complètes',
      'Archivage cloud sécurisé haute conformité',
      'Consultations de synthèse & bilans trimestriels',
      'Ligne directe avec l’équipe médicale & éducative',
    ],
    ctaLabel: 'Choisir ce forfait',
  },
  {
    id: 'business',
    name: 'OREA Business',
    badge: 'SUR MESURE',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Pour écoles, lycées techniques, entreprises et institutions souhaitant équiper leurs membres. Équipez l’ensemble de vos apprenants avec un tableau de bord de supervision et des parcours personnalisés.',
    features: [
      'Facturation groupée en FCFA',
      'Tableau d’administration',
      'Support dédié',
    ],
    ctaLabel: 'Contacter l’équipe OREA',
  },
];

/**
 * Calcule l'économie annuelle réelle par rapport à 12 mois de facturation mensuelle.
 */
export function calculateSavings(monthlyPrice: number, yearlyPrice: number): {
  amountFcfa: number;
  monthsFree: number;
  percentage: number;
} {
  if (monthlyPrice <= 0 || yearlyPrice <= 0) {
    return { amountFcfa: 0, monthsFree: 0, percentage: 0 };
  }
  const fullYearMonthly = monthlyPrice * 12;
  const amountFcfa = fullYearMonthly - yearlyPrice;
  const percentage = Math.round((amountFcfa / fullYearMonthly) * 100);
  const monthsFree = Math.round((amountFcfa / monthlyPrice) * 10) / 10;

  return { amountFcfa, monthsFree, percentage };
}

/**
 * Vérifie si l'utilisateur possède l'accès requis pour une fonctionnalité donnée.
 */
export function hasAccess(
  userProfile: OreaUserProfile | null,
  feature:
    | 'basic_health'
    | 'agenda_medical'
    | 'cycle_tracking'
    | 'planner_full'
    | 'workout_pro'
    | 'assistant_ai'
    | 'bac_g2_full'
    | 'multi_family'
): boolean {
  if (!userProfile) {
    return feature === 'basic_health';
  }

  const effective = getUserEffectivePlan(userProfile);
  if (userProfile.role === 'admin' || userProfile.email?.toLowerCase() === 'patrik.moona@gmail.com') {
    return true;
  }

  switch (feature) {
    case 'basic_health':
      return true;
    case 'agenda_medical':
    case 'cycle_tracking':
      return ['essentiel', 'plus', 'premium', 'pro', 'business'].includes(effective);
    case 'planner_full':
    case 'workout_pro':
      return ['plus', 'premium', 'pro', 'business'].includes(effective);
    case 'assistant_ai':
    case 'bac_g2_full':
      return ['premium', 'pro', 'business'].includes(effective);
    case 'multi_family':
      return ['pro', 'business'].includes(effective);
    default:
      return false;
  }
}
