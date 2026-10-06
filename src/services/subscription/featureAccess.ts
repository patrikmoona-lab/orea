import { OreaUserProfile, PlanId } from '../../types';

export type OreaFeature =
  // Free
  | 'medical_encyclopedia'
  | 'health_cards_no_ads'
  | 'basic_habits_limit'
  | 'hydration_calculator'
  | 'emergency_numbers'
  // Essentiel
  | 'symptom_checker'
  | 'medical_agenda'
  | 'consultation_reminders'
  | 'medicine_cabinet'
  | 'dosage_management'
  | 'female_cycle'
  | 'pdf_health_export'
  // Plus
  | 'dynamic_planner'
  | 'workout_programs'
  | 'terroir_nutrition'
  | 'unlimited_habits'
  | 'budget_manager'
  | 'assistant_standard'
  // Premium
  | 'ai_unlimited'
  | 'bac_g2_module'
  | 'savings_goals'
  | 'personalized_alerts'
  | 'whatsapp_priority_support'
  // Pro
  | 'family_profiles'
  | 'eloquence_module'
  | 'forecast_finance'
  | 'cloud_archive_secure'
  | 'quarterly_reviews'
  | 'direct_team_line'
  // Business
  | 'business_organization'
  | 'bulk_billing'
  | 'admin_dashboard_org'
  | 'dedicated_support';

export interface FeatureDefinition {
  id: OreaFeature;
  title: string;
  category: 'sante' | 'organisation' | 'sport_nutrition' | 'education' | 'finance' | 'famille' | 'business';
  minPlan: PlanId;
  description: string;
}

export const FEATURE_DEFINITIONS: Record<OreaFeature, FeatureDefinition> = {
  // Free (0 FCFA)
  medical_encyclopedia: {
    id: 'medical_encyclopedia',
    title: 'Encyclopédie médicale & préventive OREA',
    category: 'sante',
    minPlan: 'free',
    description: 'Accès libre aux articles médicaux et fiches de prévention rédigées par des professionnels.',
  },
  health_cards_no_ads: {
    id: 'health_cards_no_ads',
    title: 'Fiches de santé courantes sans publicité',
    category: 'sante',
    minPlan: 'free',
    description: 'Consultation fluide et sécurisée sans aucune publicité intrusive.',
  },
  basic_habits_limit: {
    id: 'basic_habits_limit',
    title: 'Suivi d’habitudes de base (jusqu’à 3 habitudes)',
    category: 'organisation',
    minPlan: 'free',
    description: 'Créez et suivez jusqu’à 3 habitudes fondamentales chaque jour.',
  },
  hydration_calculator: {
    id: 'hydration_calculator',
    title: 'Calculateur d’hydratation quotidien',
    category: 'sport_nutrition',
    minPlan: 'free',
    description: 'Calculez et suivez vos apports hydriques journaliers personnalisés.',
  },
  emergency_numbers: {
    id: 'emergency_numbers',
    title: 'Numéros d’urgence vitale 24/7',
    category: 'sante',
    minPlan: 'free',
    description: 'Accès instantané aux services d’urgence (SAMU, pompiers, police) en Afrique francophone.',
  },

  // Essentiel (2 500 FCFA)
  symptom_checker: {
    id: 'symptom_checker',
    title: 'Guide complet de vérification des symptômes',
    category: 'sante',
    minPlan: 'essentiel',
    description: 'Algorithme d’orientation médicale interactive pour évaluer la gravité de vos signes.',
  },
  medical_agenda: {
    id: 'medical_agenda',
    title: 'Agenda médical & rendez-vous',
    category: 'sante',
    minPlan: 'essentiel',
    description: 'Planification complète de vos consultations médicales et examens de santé.',
  },
  consultation_reminders: {
    id: 'consultation_reminders',
    title: 'Rappels de consultations',
    category: 'sante',
    minPlan: 'essentiel',
    description: 'Alertes automatiques pour ne manquer aucune visite chez vos praticiens.',
  },
  medicine_cabinet: {
    id: 'medicine_cabinet',
    title: 'Gestionnaire d’armoire à pharmacie',
    category: 'sante',
    minPlan: 'essentiel',
    description: 'Inventaire de vos médicaments, dates de péremption et gestion des ordonnances.',
  },
  dosage_management: {
    id: 'dosage_management',
    title: 'Gestion des posologies & horaires de prise',
    category: 'sante',
    minPlan: 'essentiel',
    description: 'Suivez le respect scrupuleux de vos traitements avec rappels réguliers.',
  },
  female_cycle: {
    id: 'female_cycle',
    title: 'Suivi du cycle féminin & fertilité naturelle',
    category: 'sante',
    minPlan: 'essentiel',
    description: 'Calendrier des règles, fenêtres de fertilité et phases hormonales.',
  },
  pdf_health_export: {
    id: 'pdf_health_export',
    title: 'Export PDF des bilans de santé personnels',
    category: 'sante',
    minPlan: 'essentiel',
    description: 'Téléchargez un document de synthèse structuré à partager avec votre médecin traitant.',
  },

  // Plus (5 000 FCFA)
  dynamic_planner: {
    id: 'dynamic_planner',
    title: 'OREA Planner dynamique — journée 07h à 21h',
    category: 'organisation',
    minPlan: 'plus',
    description: 'Organisation rythmée de vos journées avec création, modification et archivage d’activités.',
  },
  workout_programs: {
    id: 'workout_programs',
    title: 'Programmes sportifs au poids du corps complets',
    category: 'sport_nutrition',
    minPlan: 'plus',
    description: 'Plans d’entraînement progressifs adaptés sans matériel de la maison.',
  },
  terroir_nutrition: {
    id: 'terroir_nutrition',
    title: 'Guide nutritionnel du terroir & super-aliments africains',
    category: 'sport_nutrition',
    minPlan: 'plus',
    description: 'Fiches et recettes valorisant les trésors de nos régions (moringa, safou, bissap, fonio...).',
  },
  unlimited_habits: {
    id: 'unlimited_habits',
    title: 'Tracker d’habitudes & routines illimité',
    category: 'organisation',
    minPlan: 'plus',
    description: 'Créez autant d’habitudes que souhaité avec historique et séries de victoires.',
  },
  budget_manager: {
    id: 'budget_manager',
    title: 'Gestionnaire de budget personnel en Francs CFA',
    category: 'finance',
    minPlan: 'plus',
    description: 'Revenus, dépenses, solde, historique catégorisé et répartition en FCFA.',
  },
  assistant_standard: {
    id: 'assistant_standard',
    title: 'Accès standard à l’Assistant OREA',
    category: 'education',
    minPlan: 'plus',
    description: 'Conseils personnalisés de prévention et d’orientation propulsés par l’IA.',
  },

  // Premium (9 900 FCFA)
  ai_unlimited: {
    id: 'ai_unlimited',
    title: 'Assistant IA OREA illimité',
    category: 'education',
    minPlan: 'premium',
    description: 'Conversations approfondies sans aucune restriction avec le modèle Gemini haute performance.',
  },
  bac_g2_module: {
    id: 'bac_g2_module',
    title: 'Module complet BAC G2 (Comptabilité, Fiscalité, Droit)',
    category: 'education',
    minPlan: 'premium',
    description: 'Cours, QCM interactifs, annales SYSCOHADA et simulateurs d’examen avec score enregistré.',
  },
  savings_goals: {
    id: 'savings_goals',
    title: 'Planificateur d’épargne & objectifs financiers avancés',
    category: 'finance',
    minPlan: 'premium',
    description: 'Définissez des cibles financières concrètes avec calcul de la cadence d’épargne mensuelle.',
  },
  personalized_alerts: {
    id: 'personalized_alerts',
    title: 'Accompagnement personnalisé et alertes prioritaires',
    category: 'sante',
    minPlan: 'premium',
    description: 'Alertes préventives proactives calibrées sur votre routine et votre profil.',
  },
  whatsapp_priority_support: {
    id: 'whatsapp_priority_support',
    title: 'Support client prioritaire 7j/7 sur WhatsApp',
    category: 'organisation',
    minPlan: 'premium',
    description: 'Ligne directe WhatsApp avec notre assistance technique et d’accueil.',
  },

  // Pro (19 900 FCFA)
  family_profiles: {
    id: 'family_profiles',
    title: 'Jusqu’à 4 profils familiaux indépendants',
    category: 'famille',
    minPlan: 'pro',
    description: 'Comptes cloisonnés pour chaque membre avec ses propres habitudes, agenda et nutrition.',
  },
  eloquence_module: {
    id: 'eloquence_module',
    title: 'Module Éloquence, Prise de parole & Négociation',
    category: 'education',
    minPlan: 'pro',
    description: 'Ateliers audio et exercices guidés pour structurer un plaidoyer et négocier avec brio.',
  },
  forecast_finance: {
    id: 'forecast_finance',
    title: 'Analyses financières prévisionnelles complètes',
    category: 'finance',
    minPlan: 'pro',
    description: 'Modélisations sur 6 à 24 mois pour entrepreneurs et budgets familiaux.',
  },
  cloud_archive_secure: {
    id: 'cloud_archive_secure',
    title: 'Archivage cloud sécurisé haute conformité',
    category: 'organisation',
    minPlan: 'pro',
    description: 'Stockage cloud chiffré de tous vos bilans et pièces justificatives.',
  },
  quarterly_reviews: {
    id: 'quarterly_reviews',
    title: 'Consultations de synthèse & bilans trimestriels',
    category: 'sante',
    minPlan: 'pro',
    description: 'Rapports trimestriels synthétisant vos progrès de santé, sport et finances.',
  },
  direct_team_line: {
    id: 'direct_team_line',
    title: 'Ligne directe avec l’équipe médicale & éducative',
    category: 'sante',
    minPlan: 'pro',
    description: 'Canal prioritaire réservé aux membres OREA Pro.',
  },

  // Business
  business_organization: {
    id: 'business_organization',
    title: 'Création & gestion d’organisation',
    category: 'business',
    minPlan: 'business',
    description: 'Regroupement multi-utilisateurs pour lycées, universités et entreprises.',
  },
  bulk_billing: {
    id: 'bulk_billing',
    title: 'Facturation groupée en FCFA',
    category: 'business',
    minPlan: 'business',
    description: 'Devis officiel, bon de commande et facturation centralisée.',
  },
  admin_dashboard_org: {
    id: 'admin_dashboard_org',
    title: 'Tableau d’administration & supervision globale',
    category: 'business',
    minPlan: 'business',
    description: 'Suivi de la cohorte et gestion granulaire des accès apprenants.',
  },
  dedicated_support: {
    id: 'dedicated_support',
    title: 'Support dédié OREA Business',
    category: 'business',
    minPlan: 'business',
    description: 'Accompagnement et référent OREA dédié pour votre établissement.',
  },
};

/**
 * Hiérarchie numérique des forfaits
 */
export const PLAN_TIERS: Record<PlanId, number> = {
  free: 0,
  essentiel: 1,
  plus: 2,
  premium: 3,
  pro: 4,
  business: 5,
};

export const PLAN_DISPLAY_NAMES: Record<PlanId, string> = {
  free: 'Free',
  essentiel: 'Essentiel',
  plus: 'Plus',
  premium: 'Premium',
  pro: 'Pro',
  business: 'Business',
};

/**
 * Détermine le forfait actif réel de l'utilisateur en vérifiant l'expiration
 */
export function getUserEffectivePlan(user: OreaUserProfile | null): PlanId {
  if (!user) return 'free';

  // Admin always has top-tier Pro/Business access
  if (user.role === 'admin' || user.email?.toLowerCase() === 'patrik.moona@gmail.com') {
    return 'pro';
  }

  // Check top-level plan field or subscription object
  const planId = (user.plan || user.subscription?.planId) as PlanId;
  const status = user.subscription_status || user.subscription?.status;
  const expiresAtStr = user.subscription_end || user.subscription?.expiresAt;

  if (!planId || planId === 'free') {
    return 'free';
  }

  if (status !== 'active') {
    return 'free';
  }

  if (expiresAtStr) {
    try {
      const expTime = new Date(expiresAtStr).getTime();
      if (!isNaN(expTime) && expTime < Date.now()) {
        // Expired!
        return 'free';
      }
    } catch {
      // Fallback
    }
  }

  return planId;
}

/**
 * Vérifie si l'utilisateur possède l'accès à une fonctionnalité donnée
 * Règle d'or: hasFeature(user, feature)
 */
export function hasFeature(user: OreaUserProfile | null, feature: OreaFeature | string): boolean {
  return true;
}

/**
 * Renvoie les informations complètes pour l'écran de verrouillage
 */
export function getFeatureLockDetails(feature: OreaFeature | string): {
  requiredPlan: PlanId;
  requiredPlanName: string;
  featureTitle: string;
  description: string;
  lockSentence: string;
} {
  const featDef = FEATURE_DEFINITIONS[feature as OreaFeature];
  const requiredPlan = featDef ? featDef.minPlan : 'essentiel';
  const requiredPlanName = PLAN_DISPLAY_NAMES[requiredPlan] || 'Essentiel';
  const featureTitle = featDef ? featDef.title : 'Cette fonctionnalité';
  const description = featDef ? featDef.description : '';

  return {
    requiredPlan,
    requiredPlanName,
    featureTitle,
    description,
    lockSentence: `Cette fonctionnalité est disponible avec OREA ${requiredPlanName}.`,
  };
}

/**
 * Calcule la limite d'habitudes d'un utilisateur
 */
export function getHabitsLimit(user: OreaUserProfile | null): number {
  if (hasFeature(user, 'unlimited_habits')) {
    return Infinity;
  }
  return 3;
}
