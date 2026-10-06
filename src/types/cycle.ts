export type MenstrualFlow = 'leger' | 'moyen' | 'abondant' | 'tres_abondant';
export type SymptomIntensity = 'faible' | 'moderee' | 'importante';

export type MoodType = 'tres_bien' | 'bien' | 'moyen' | 'faible' | 'tres_difficile';
export type EnergyType = 'faible' | 'moyen' | 'bon' | 'tres_bon';
export type SleepQuality = 'reparateur' | 'normal' | 'agite' | 'insomniaque';
export type ActivityLevel = 'aucun' | 'marche_legere' | 'etirements_yoga' | 'cardio_sport' | 'repos';

export type CyclePhase = 'menstruelle' | 'folliculaire' | 'ovulatoire' | 'luteale';

export interface CycleSymptom {
  id: string;
  name: string;
  intensity: SymptomIntensity;
}

export interface CycleEntry {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  flow?: MenstrualFlow;
  symptoms: CycleSymptom[];
  notes?: string;
  hasClots?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyCycleLog {
  date: string; // YYYY-MM-DD
  symptoms: string[];
  symptomIntensities?: Record<string, 'leger' | 'moyen' | 'fort'>;
  flow?: MenstrualFlow | 'spotting' | 'none';
  painLevel?: number; // 0 to 10
  mood?: MoodType;
  energy?: EnergyType;
  sleepHours?: number;
  sleepQuality?: SleepQuality;
  hydrationGlasses?: number; // glasses (1 glass ~ 250ml)
  activity?: ActivityLevel;
  restNote?: string;
  temperature?: number;
  notes?: string;
  updatedAt?: string;
}

export interface CycleNoteItem {
  id: string;
  date: string; // YYYY-MM-DD
  title?: string;
  content: string;
  createdAt: string;
}

export interface CycleReminderSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  daysBefore?: number;
  time?: string;
  isDiscreet: boolean; // No intimate details on lockscreen
}

export interface CycleSettings {
  averageCycleDays: number;
  averagePeriodDays: number;
  birthDate?: string;
  perceivedRegularity?: 'regulier' | 'parfois_variable' | 'souvent_variable' | 'inconnu';
  trackedAspects?: ('symptomes' | 'humeur' | 'energie' | 'sommeil' | 'activite' | 'notes')[];
  remindPeriodBeforeDays: number;
  remindFertility: boolean;
  remindDailyLog: boolean;
  remindPeriodStart: boolean;
  customReminders?: CycleReminderSetting[];
}

export interface CycleCalculationResult {
  currentDay: number;
  averageCycleDays: number;
  averagePeriodDays: number;
  lastPeriodStartDate: string | null;
  estimatedNextPeriodDate: string | null;
  daysUntilNextPeriod: number | null;
  estimatedOvulationDate: string | null;
  fertileWindowStart: string | null;
  fertileWindowEnd: string | null;
  currentPhase: CyclePhase;
  isEstimateOnly: true;
  hasSufficientData: boolean;
  cycleLengthVariationDays: number;
  shortestCycleDays: number;
  longestCycleDays: number;
  cyclesObservedCount: number;
  confidenceLevel: 'initial' | 'moyen' | 'eleve';
  confidenceNote: string;
}

export interface SymptomTrendsAnalysis {
  totalLoggedDays: number;
  frequentSymptoms: { name: string; count: number; percentage: number }[];
  dominantMood: { mood: MoodType; count: number; label: string } | null;
  averageEnergy: { energy: EnergyType; count: number; label: string } | null;
  averagePainLevel: number;
  descriptiveObservations: string[];
}
