// Types officiels OREA ÉNERGIE
// 10 Catégories anatomiques exactes & 7 Niveaux exacts

export type EnergieDifficulty =
  | 'faible'
  | 'débutant'
  | 'intermédiaire'
  | 'normal'
  | 'intensif'
  | 'extrême'
  | 'spartiate';

export type EnergieDifficultyDisplay =
  | 'Faible'
  | 'Débutant'
  | 'Intermédiaire'
  | 'Normal'
  | 'Intensif'
  | 'Extrême'
  | 'Spartiate';

export type EnergieCategory =
  | 'bras'
  | 'jambes'
  | 'avant-bras'
  | 'dos'
  | 'abdos'
  | 'épaules'
  | 'fessiers'
  | 'mollets'
  | 'poitrine'
  | 'corps-complet';

export type EnergieCategoryDisplay =
  | 'Bras'
  | 'Jambes'
  | 'Avant-bras'
  | 'Dos'
  | 'Abdos'
  | 'Épaules'
  | 'Fessiers'
  | 'Mollets'
  | 'Poitrine'
  | 'Corps complet';

export const ENERGIE_DIFFICULTIES_LIST: { id: EnergieDifficulty; label: EnergieDifficultyDisplay; icon: string; desc: string }[] = [
  { id: 'faible', label: 'Faible', icon: '🌱', desc: 'Reprise très douce, remise en mouvement sans choc' },
  { id: 'débutant', label: 'Débutant', icon: '🚶', desc: 'Pratique occasionnelle, bases physiques à construire' },
  { id: 'intermédiaire', label: 'Intermédiaire', icon: '⚡', desc: 'Activité régulière avec endurance établie' },
  { id: 'normal', label: 'Normal', icon: '🎯', desc: 'Condition physique stable et équilibrée' },
  { id: 'intensif', label: 'Intensif', icon: '🔥', desc: 'Entraînements soutenus et fréquents' },
  { id: 'extrême', label: 'Extrême', icon: '💥', desc: 'Dépassement de soi et haute intensité' },
  { id: 'spartiate', label: 'Spartiate', icon: '⚔️', desc: 'Discipline de fer, résistance et performance absolue' },
];

export const ENERGIE_CATEGORIES_LIST: { id: EnergieCategory; label: EnergieCategoryDisplay; icon: string; muscles: string }[] = [
  { id: 'bras', label: 'Bras', icon: '💪', muscles: 'Biceps, triceps & puissance des bras' },
  { id: 'jambes', label: 'Jambes', icon: '🦵', muscles: 'Quadriceps, ischio-jambiers & force motrice' },
  { id: 'avant-bras', label: 'Avant-bras', icon: '✊', muscles: 'Poigne, fléchisseurs & stabilité poignet' },
  { id: 'dos', label: 'Dos', icon: '🛡️', muscles: 'Grands dorsaux, lombaires & alignement vertébral' },
  { id: 'abdos', label: 'Abdos', icon: '⚡', muscles: 'Sangle abdominale, transverse & gainage profond' },
  { id: 'épaules', label: 'Épaules', icon: '🦅', muscles: 'Deltoïdes, trapèzes & mobilité scapulaire' },
  { id: 'fessiers', label: 'Fessiers', icon: '🍑', muscles: 'Grands fessiers, galbe & stabilité pelvienne' },
  { id: 'mollets', label: 'Mollets', icon: '👟', muscles: 'Gastrocnémiens, soléaires & explosivité' },
  { id: 'poitrine', label: 'Poitrine', icon: '🛡️', muscles: 'Pectoraux & force de poussée' },
  { id: 'corps-complet', label: 'Corps complet', icon: '✨', muscles: 'Full body harmonieux, cardio & endurance' },
];

export interface EnergieExercise {
  id: string;
  name: string;
  description: string;
  category: EnergieCategory;
  secondaryCategories?: EnergieCategory[];
  difficulty: EnergieDifficulty;
  equipment: string[]; // e.g. ['aucun'], ['tapis'], ['chaise']
  duration: number; // in seconds
  sets: number;
  repetitions?: string;
  rest: number; // rest in seconds
  restBetweenSets?: number;
  restBetweenExercises?: number;
  instructions: string[];
  commonMistakes: string[];
  tips: string[];
  videoUrl?: string; // YouTube embed / MP4 if available
  model3D?: {
    type: 'squat' | 'pompes' | 'fentes' | 'planche' | 'crunch' | 'jumping-jacks' | 'mountain-climbers' | 'dips' | 'superman' | 'mollets';
    animationName?: string;
  };
  variants?: string[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserFitnessProfile {
  level: EnergieDifficulty;
  bodyParts: EnergieCategory[];
  goals: string[];
  duration: string;
  frequency: string;
  equipment: string[];
  limitations?: string;
  restMode?: 'auto' | 'standard' | 'court' | 'long' | number;
  onboardingCompleted: boolean;
  completedAt: string;
  updatedAt: string;
  name?: string;
  ageGroup?: string;
}

export interface WorkoutSessionLog {
  id: string;
  userId: string;
  sessionTitle: string;
  level: EnergieDifficulty;
  categories: EnergieCategory[];
  durationMinutes: number;
  exercisesCompletedCount: number;
  totalSetsCompleted: number;
  exerciseIds: string[];
  completedAt: string;
  restConfiguredSeconds?: number;
  notes?: string;
}

export interface WorkoutProgramStructured {
  id: string;
  title: string;
  description: string;
  level: EnergieDifficulty;
  durationDays: number;
  frequencyPerWeek: number;
  targetCategories: EnergieCategory[];
  exercises: EnergieExercise[];
}
