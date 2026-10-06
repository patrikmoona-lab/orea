export type NavSection =
  | 'accueil'
  | 'sante'
  | 'urgence'
  | 'medicaments'
  | 'agenda'
  | 'cycle'
  | 'sport'
  | 'energie'
  | 'workout'
  | 'nutrition'
  | 'hydratation'
  | 'habitudes'
  | 'sommeil'
  | 'education'
  | 'evolution'
  | 'eloquence'
  | 'finance'
  | 'planner'
  | 'forme'
  | 'esprit'
  | 'vie'
  | 'bien_etre'
  | 'etudes'
  | 'profil'
  | 'parametres'
  | 'mon_orea'
  | 'objectifs'
  | 'progression'
  | 'activite'
  | 'notifications'
  | 'assistant'
  | 'symptom_checker'
  | 'encyclopedie'
  | 'famille'
  | 'documents'
  | 'bilan_pdf'
  | 'sos'
  | 'ressources'
  | 'apropos'
  | 'auth'
  | 'connexion'
  | 'register'
  | 'dashboard'
  | 'admin'
  | 'pricing'
  | 'checkout'
  | 'subscription'
  | 'payment-success'
  | 'payment-failed'
  | 'payment-pending'
  | 'confidentialite'
  | 'conditions_utilisation'
  | 'conditions-utilisation'
  | 'preferences-cookies'
  | 'preferences_cookies'
  | '404';

export type CookieConsentStatus = 'accepted' | 'rejected' | 'custom';

export interface CookieConsent {
  status: CookieConsentStatus;
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  timestamp: number;
  version: string;
}

export type PlanId = 'free' | 'essentiel' | 'plus' | 'premium' | 'pro' | 'business';
export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trialing' | 'pending';
export type PaymentProviderId = 'mtn' | 'airtel' | 'orange' | 'wave' | 'card' | 'paypal';
export type PaymentStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'cancelled' | 'expired';

export interface OreaSubscription {
  planId: PlanId;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt: string;
  paymentProvider?: PaymentProviderId | string;
  lastPaymentId?: string;
}

export interface OreaPlan {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  badge?: string;
  isPopular?: boolean;
  description: string;
  features: string[];
  ctaLabel?: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  planId: PlanId;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  provider: PaymentProviderId;
  phoneNumber?: string;
  status: PaymentStatus;
  transactionReference: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type?: string;
  notes?: string;
}

export interface FamilyProfile {
  id: string;
  name: string;
  relationship: 'conjoint' | 'enfant' | 'parent' | 'autre' | 'principal';
  avatarColor: string;
  age?: number;
  habits: HabitItem[];
  agenda: CalendarEvent[];
  sportsData: {
    workoutGoal: string;
    completedSessions: number;
  };
  nutrition: {
    hydrationTargetGlasses: number;
    dietaryPreference: string;
  };
  budget: {
    monthlyAllowanceFcfa: number;
    spentFcfa: number;
  };
  educationProgress: {
    subject: string;
    score: number;
  };
  preferences: Record<string, any>;
  createdAt: string;
}

export interface BusinessOrganization {
  id: string;
  name: string;
  orgType: 'ecole' | 'universite' | 'entreprise' | 'institution';
  adminUid: string;
  adminEmail: string;
  membersCount: number;
  maxSeats: number;
  members: {
    uid?: string;
    email: string;
    name: string;
    role: 'admin' | 'member' | 'student';
    joinedAt: string;
    status: 'active' | 'invited' | 'suspended';
  }[];
  customPathways: string[];
  billingStatus: 'devis' | 'actif' | 'en_attente';
  createdAt: string;
}

export interface OreaUserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  gender: 'homme' | 'femme' | 'autre' | 'non-specifie';
  dateOfBirth?: string;
  age?: number;
  whatsapp: string;
  country: string;
  city?: string;
  language: string;
  photoURL?: string;
  provider?: string;
  role: 'user' | 'admin';
  onboardingCompleted: boolean;
  // Exact requested subscription fields:
  plan?: PlanId;
  subscription_status?: SubscriptionStatus;
  subscription_start?: string;
  subscription_end?: string;
  payment_status?: PaymentStatus;
  features?: Record<string, boolean>;
  // Existing structured subscription
  subscription?: OreaSubscription;
  // Multi-family profiles (PRO feature)
  familyProfiles?: FamilyProfile[];
  activeProfileId?: string;
  // Business Organization (Business feature)
  businessOrg?: BusinessOrganization;
  lastLogin: string;
  createdAt: string;
  updatedAt?: string;
  onboardingData?: OnboardingResponses;
}

export interface OnboardingResponses {
  mainGoal: string;
  focusAreas: string[];
  dailyTime: string;
  situation: string;
  completedAt?: string;
}

export type HealthCategoryKey = 'symptomes' | 'prevention' | 'nutrition' | 'sommeil' | 'sport' | 'mentale';

export interface HealthCardItem {
  id: HealthCategoryKey;
  title: string;
  description: string;
  isHighlighted?: boolean;
  color?: string;
  details: {
    tagline: string;
    overview: string;
    keyPoints: string[];
    practicalTips: string[];
    warningSigns?: string[];
  };
}

export interface ValueBarItem {
  id: string;
  title: string;
  subtitle: string;
  iconType: 'shield' | 'sprout' | 'heart' | 'book';
}

export interface HealthResource {
  id: string;
  title: string;
  category: string;
  phone?: string;
  description: string;
  availableHours?: string;
  badge?: string;
}

export interface SymptomTopic {
  id: string;
  name: string;
  category: string;
  severity: 'benign' | 'moderate' | 'urgent';
  summary: string;
  recommendations: string[];
  whenToConsult: string;
  urgentSigns?: string[];
  causes?: string[];
  prevention?: string[];
}

// Emergency / Urgence types
export type EmergencyFacilityType = 'urgence' | 'hopital' | 'pharmacie' | 'centre';

export interface EmergencyFacility {
  id: string;
  name: string;
  type: EmergencyFacilityType;
  distanceKm: number;
  address: string;
  city: string;
  phone: string;
  isOpen24_7: boolean;
  currentStatus: string;
  lat: number;
  lng: number;
  services: string[];
}

// Medication types
export interface MedicationInfo {
  id: string;
  name: string;
  genericName: string; // DCI
  form: string; // Comprimé, gélule, etc.
  dosage: string;
  generalUsage: string;
  indications: string[];
  precautions: string[];
  sideEffects: string[];
  interactions: string[];
  storage: string;
  prescriptionRequired: boolean;
}

export interface MedicationReminder {
  id: string;
  medicationName: string;
  dosage: string;
  time: string; // '08:00'
  frequency: 'daily' | 'twice_daily' | 'weekly' | 'as_needed';
  notes?: string;
  notificationEnabled: boolean;
  takenToday?: boolean;
  createdAt: string;
}

// Agenda types
export type AgendaEventType = 'rdv' | 'examen' | 'vaccination' | 'rappel_med' | 'suivi' | 'autre';

export interface AgendaEvent {
  id: string;
  type: AgendaEventType;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  practitioner?: string;
  notes?: string;
  reminderNotice: 'none' | '1h' | '2h' | '24h' | '48h';
  completed?: boolean;
}

// Profile types
export interface UserProfile {
  firstName: string;
  lastName: string;
  birthDate: string;
  city: string;
  country: string;
  notificationsEnabled: boolean;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
}

// ----------------------------------------------------
// OREA FEMME — MON CYCLE
// ----------------------------------------------------
export type MenstrualFlow = 'leger' | 'moyen' | 'abondant' | 'tres_abondant';
export type SymptomIntensity = 'faible' | 'moderee' | 'importante';

export interface CycleSymptom {
  id: string;
  name: string;
  intensity: SymptomIntensity;
}

export interface DailyCycleLog {
  date: string; // YYYY-MM-DD
  symptoms: string[];
  intensity?: SymptomIntensity;
  flow?: MenstrualFlow | 'spotting' | 'none';
  mood?: 'serene' | 'fatiguee' | 'irritable' | 'anxieuse' | 'energique';
  temperature?: number;
  notes?: string;
}

export interface CycleEntry {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  flow?: MenstrualFlow;
  symptoms: CycleSymptom[];
  notes?: string;
  hasClots?: boolean;
}

export interface CycleSettings {
  averageCycleDays: number;
  averagePeriodDays: number;
  remindPeriodBeforeDays: number;
  remindFertility: boolean;
  remindDailyLog: boolean;
}

export interface CycleCalculation {
  currentDay: number;
  averageCycleDays: number;
  averagePeriodDays: number;
  lastPeriodStartDate: string;
  estimatedNextPeriodDate: string;
  daysUntilNextPeriod: number;
  estimatedOvulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  currentPhase: 'folliculaire' | 'ovulatoire' | 'luteale' | 'menstruelle';
  isEstimateOnly: true;
}

// ----------------------------------------------------
// OREA SPORT & WORKOUT
// ----------------------------------------------------
export type FitnessLevel = 'debutant' | 'apprenti' | 'intermediaire' | 'confirme' | 'avance' | 'elite';
export type WorkoutGoal = 'full_body' | 'jambes' | 'abdos' | 'force' | 'perte_graisse' | 'remise_en_forme' | 'mobilite';

export interface ExerciseItem {
  id: string;
  name: string;
  targetMuscles: string[];
  sets: number;
  reps?: string;
  durationSec?: number;
  restSec: number;
  instructions: string;
  breathAdvice: string;
  commonMistakes: string;
}

export interface WorkoutProgram {
  id: string;
  title: string;
  level: FitnessLevel;
  durationDays: number;
  goal: WorkoutGoal;
  exercises: ExerciseItem[];
  description: string;
}

// ----------------------------------------------------
// OREA NUTRITION
// ----------------------------------------------------
export interface AfricanSuperfood {
  id: string;
  name: string;
  localNames: string[];
  region: string;
  category: 'fruit' | 'legume' | 'feculent' | 'graine_epice';
  nutritionalBenefits: string[];
  culinaryUsage: string;
  imageUrl?: string;
}

export interface DailyHydration {
  glassesConsumed: number;
  targetGlasses: number;
  lastLoggedAt: string;
}

// ----------------------------------------------------
// OREA EDUCATION & APPRENTISSAGE
// ----------------------------------------------------
export interface EducationSubject {
  id: string;
  code: string;
  title: string;
  category: 'bac_g2' | 'mathematiques' | 'economie' | 'comptabilite' | 'francais' | 'informatique';
  coefficient: number;
  description: string;
  summary?: string;
  lessons: string[];
  lessonsCount?: number;
  quizzesCount?: number;
}

export interface QuizQuestion {
  id: string;
  subjectId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// ----------------------------------------------------
// OREA EVOLUTION & ÉLOQUENCE
// ----------------------------------------------------
export interface EloquenceExercise {
  id: string;
  title: string;
  category: 'articulation' | 'argumentation' | 'storytelling' | 'debat';
  prompt: string;
  durationSec: number;
  tips: string[];
}

export interface HabitItem {
  id: string;
  title: string;
  domain: 'sante' | 'sport' | 'lecture' | 'sommeil' | 'finance';
  streakDays: number;
  frequency: 'daily' | 'weekdays';
  doneToday: boolean;
}

// ----------------------------------------------------
// OREA FINANCE & BUSINESS
// ----------------------------------------------------
export interface BudgetCategory {
  id: string;
  name: string;
  allocatedFcfa: number;
  spentFcfa: number;
  iconName: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetFcfa: number;
  savedFcfa: number;
  deadline: string;
}

// ----------------------------------------------------
// OREA PLANNER (07:00 -> 21:00)
// ----------------------------------------------------
export interface PlannerBlock {
  id: string;
  timeSlot: string; // e.g. "07:00", "10:00", "13:00", "17:00", "21:00"
  domain: 'routine' | 'apprentissage' | 'nutrition' | 'sport' | 'bilan' | 'autre';
  title: string;
  durationMinutes: number;
  isPriority: boolean;
  completed: boolean;
}

// ----------------------------------------------------
// OREA ASSISTANT (Gemini 3.8 Flash)
// ----------------------------------------------------
export interface AssistantChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isEmergency?: boolean;
  action?: {
    type: 'navigate' | 'create_event' | 'add_goal';
    target?: string;
    label: string;
  };
}


