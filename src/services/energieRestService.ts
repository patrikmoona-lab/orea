import { EnergieDifficulty, EnergieCategory, EnergieExercise } from '../types/energie';

export type RestPreferenceMode = 'auto' | 'standard' | 'court' | 'long' | number;

export interface RestCalculationInput {
  exerciseDifficulty: EnergieDifficulty;
  exerciseType?: string;
  category?: EnergieCategory;
  sets: number;
  currentSet?: number;
  repetitions?: string | number;
  duration?: number; // duration of set in seconds (e.g. 30s plank)
  userLevel?: EnergieDifficulty;
  userRestPreference?: RestPreferenceMode;
  isLastSetOfExercise?: boolean;
  nextExercise?: EnergieExercise;
  workoutContext?: {
    totalExercisesCount?: number;
    currentExerciseIndex?: number;
    sessionIntensity?: string;
  };
}

export interface RestCalculationResult {
  restBetweenSets: number; // in seconds
  restBetweenExercises: number; // in seconds
  effectiveRest: number; // rest applicable right now
  formatted: string; // e.g. "01:00" or "00:45"
  explanation: string;
  isStandardOneMinute: boolean;
}

/**
 * Base rest values in seconds according to OREA programming levels
 * (Valeurs initiales de programmation OREA — non médicales)
 */
export const OREA_BASE_REST_TABLE: Record<EnergieDifficulty, { min: number; max: number; standard: number }> = {
  faible: { min: 20, max: 30, standard: 30 },
  débutant: { min: 30, max: 45, standard: 45 },
  intermédiaire: { min: 30, max: 45, standard: 45 },
  normal: { min: 45, max: 45, standard: 45 },
  intensif: { min: 45, max: 60, standard: 60 },
  extrême: { min: 60, max: 90, standard: 75 },
  spartiate: { min: 60, max: 120, standard: 90 },
};

/**
 * High-demand exercises requiring slightly more neuromuscular recovery
 */
const HIGH_DEMAND_TYPES = new Set([
  'burpees',
  'pompes-spartiates',
  'pike-pushups',
  'mountain-climbers',
  'fentes-sautees',
  'dips',
]);

/**
 * Core calculation function for workout rest time
 * Deterministic, predictable, testable, independent of any LLM calls.
 */
export function calculateRestTime(input: RestCalculationInput): RestCalculationResult {
  const {
    exerciseDifficulty = 'débutant',
    exerciseType = '',
    sets = 3,
    currentSet = 1,
    duration = 0,
    userLevel = 'débutant',
    userRestPreference = 'standard', // Default is standard 60s per Rule #19
    isLastSetOfExercise = false,
    nextExercise,
  } = input;

  // 1. Check user preference override if manual numeric or 'standard'
  if (typeof userRestPreference === 'number' && userRestPreference > 0) {
    const valid = Math.max(15, Math.min(180, userRestPreference));
    return {
      restBetweenSets: valid,
      restBetweenExercises: valid + (isLastSetOfExercise ? 15 : 0),
      effectiveRest: isLastSetOfExercise ? valid + 15 : valid,
      formatted: formatRestMinutesSeconds(valid),
      explanation: `Repos personnalisé fixé à ${valid} secondes`,
      isStandardOneMinute: valid === 60,
    };
  }

  // 2. Standard mode: exactly 60 seconds (01:00) as required by Rule #19
  if (userRestPreference === 'standard') {
    const standardSets = 60;
    const standardExercises = 60;
    const effective = isLastSetOfExercise ? standardExercises : standardSets;
    return {
      restBetweenSets: standardSets,
      restBetweenExercises: standardExercises,
      effectiveRest: effective,
      formatted: formatRestMinutesSeconds(effective),
      explanation: 'Repos standard OREA de 1 minute (01:00) entre les séries',
      isStandardOneMinute: true,
    };
  }

  // 3. Automatic Intelligent Mode: calculate based on exercise + sets + intensity + profile
  const baseConfig = OREA_BASE_REST_TABLE[exerciseDifficulty] || OREA_BASE_REST_TABLE['débutant'];
  let computedRest = baseConfig.standard;

  // Adjust by User Level:
  // For beginners, provide comfortable rest to avoid premature exhaustion
  if (userLevel === 'débutant' || userLevel === 'faible') {
    computedRest = Math.max(computedRest, 45);
  }

  // Adjust by Exercise Type / Muscular Demands:
  const normalizedType = exerciseType.toLowerCase();
  const isHighDemand = Array.from(HIGH_DEMAND_TYPES).some((t) => normalizedType.includes(t));
  if (isHighDemand) {
    computedRest += 15;
  }

  // Adjust by Total Sets & Current Set Progression:
  // 2 sets -> standard
  // 3 sets -> standard
  // 4 sets -> slightly increased on later sets (+5s on set 3 & 4)
  // 5+ sets -> +10s on final sets
  if (sets >= 4 && currentSet >= 3) {
    computedRest += 5;
  }
  if (sets >= 5 && currentSet >= 4) {
    computedRest += 10;
  }

  // Adjust for Timed Hold Exercises (e.g. Planche 30s-45s)
  if (duration > 0) {
    if (duration >= 45) {
      computedRest = Math.max(computedRest, 45);
    }
  }

  // Preference modifier: 'court' (-15s) or 'long' (+20s)
  if (userRestPreference === 'court') {
    computedRest = Math.max(20, computedRest - 15);
  } else if (userRestPreference === 'long') {
    computedRest = Math.min(120, computedRest + 25);
  }

  // Clamping to sensible bounds for safety and flow
  const restBetweenSets = Math.max(20, Math.min(120, computedRest));

  // Rest between exercises (transition):
  // If next exercise is intense, grant an additional buffer (+15s), standard transition is 60s
  let restBetweenExercises = 60;
  if (nextExercise) {
    if (nextExercise.difficulty === 'intensif' || nextExercise.difficulty === 'spartiate') {
      restBetweenExercises = Math.max(60, restBetweenSets + 15);
    } else {
      restBetweenExercises = Math.max(45, restBetweenSets);
    }
  }

  const effectiveRest = isLastSetOfExercise ? restBetweenExercises : restBetweenSets;

  return {
    restBetweenSets,
    restBetweenExercises,
    effectiveRest,
    formatted: formatRestMinutesSeconds(effectiveRest),
    explanation: isLastSetOfExercise
      ? `Transition vers l'exercice suivant : ${effectiveRest}s`
      : `Récupération intelligente : ${effectiveRest}s (Niveau ${exerciseDifficulty}, Série ${currentSet}/${sets})`,
    isStandardOneMinute: effectiveRest === 60,
  };
}

/**
 * Formats seconds into MM:SS (e.g. 60 -> "01:00", 45 -> "00:45")
 */
export function formatRestMinutesSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

/**
 * Test suite to validate Test A to Test H as mandated in Section 29
 */
export function runRestLogicTests(): { testName: string; passed: boolean; result: RestCalculationResult }[] {
  const tests = [
    {
      name: 'Test A: Faible + exercice simple',
      input: { exerciseDifficulty: 'faible' as EnergieDifficulty, sets: 2, currentSet: 1, userRestPreference: 'auto' as const },
      validate: (r: RestCalculationResult) => r.restBetweenSets >= 20 && r.restBetweenSets <= 45,
    },
    {
      name: 'Test B: Débutant + exercice simple',
      input: { exerciseDifficulty: 'débutant' as EnergieDifficulty, sets: 3, currentSet: 1, userLevel: 'débutant' as EnergieDifficulty, userRestPreference: 'auto' as const },
      validate: (r: RestCalculationResult) => r.restBetweenSets >= 30,
    },
    {
      name: 'Test C: Intermédiaire + 4 séries',
      input: { exerciseDifficulty: 'intermédiaire' as EnergieDifficulty, sets: 4, currentSet: 4, userRestPreference: 'auto' as const },
      validate: (r: RestCalculationResult) => r.restBetweenSets >= 45,
    },
    {
      name: 'Test D: Intensif + exercice exigeant',
      input: { exerciseDifficulty: 'intensif' as EnergieDifficulty, exerciseType: 'burpees', sets: 4, currentSet: 2, userRestPreference: 'auto' as const },
      validate: (r: RestCalculationResult) => r.restBetweenSets >= 60,
    },
    {
      name: 'Test E: Extrême + exercice exigeant',
      input: { exerciseDifficulty: 'extrême' as EnergieDifficulty, sets: 4, currentSet: 3, userRestPreference: 'auto' as const },
      validate: (r: RestCalculationResult) => r.restBetweenSets >= 60,
    },
    {
      name: 'Test F: Spartiate + exercice exigeant',
      input: { exerciseDifficulty: 'spartiate' as EnergieDifficulty, exerciseType: 'pompes-spartiates', sets: 5, currentSet: 4, userRestPreference: 'auto' as const },
      validate: (r: RestCalculationResult) => r.restBetweenSets >= 75,
    },
    {
      name: 'Test G: Exercice chronométré (Planche 40s)',
      input: { exerciseDifficulty: 'débutant' as EnergieDifficulty, duration: 40, sets: 3, currentSet: 1, userRestPreference: 'auto' as const },
      validate: (r: RestCalculationResult) => r.restBetweenSets >= 45,
    },
    {
      name: 'Test H: Changement d’exercice (dernière série)',
      input: { exerciseDifficulty: 'intermédiaire' as EnergieDifficulty, sets: 4, currentSet: 4, isLastSetOfExercise: true, userRestPreference: 'auto' as const },
      validate: (r: RestCalculationResult) => r.effectiveRest >= 45 && r.effectiveRest === r.restBetweenExercises,
    },
    {
      name: 'Test Standard Rule #19: Repos standard 1 minute',
      input: { exerciseDifficulty: 'intermédiaire' as EnergieDifficulty, sets: 4, currentSet: 1, userRestPreference: 'standard' as const },
      validate: (r: RestCalculationResult) => r.effectiveRest === 60 && r.formatted === '01:00',
    },
  ];

  return tests.map((t) => {
    const res = calculateRestTime(t.input);
    return {
      testName: t.name,
      passed: t.validate(res),
      result: res,
    };
  });
}
