import {
  CycleEntry,
  CycleSettings,
  CycleCalculationResult,
  CyclePhase,
  DailyCycleLog,
  SymptomTrendsAnalysis,
  MoodType,
  EnergyType
} from '../types/cycle';

export const DEFAULT_CYCLE_SETTINGS: CycleSettings = {
  averageCycleDays: 28,
  averagePeriodDays: 5,
  remindPeriodBeforeDays: 2,
  remindFertility: true,
  remindDailyLog: false,
  remindPeriodStart: true,
  customReminders: [
    {
      id: 'remind-period',
      title: 'Période estimée à venir',
      description: 'Notification neutre 2 jours avant la date estimée.',
      enabled: true,
      daysBefore: 2,
      time: '09:00',
      isDiscreet: true
    },
    {
      id: 'remind-start',
      title: 'Début des règles',
      description: 'Penser à noter le premier jour pour la précision du suivi.',
      enabled: true,
      daysBefore: 0,
      time: '10:00',
      isDiscreet: true
    },
    {
      id: 'remind-daily',
      title: 'Bilan bien-être du jour',
      description: 'Rappel pour noter vos ressentis et énergie.',
      enabled: false,
      time: '20:00',
      isDiscreet: true
    }
  ]
};

/**
 * Pure deterministic calculation engine for Mon Cycle OREA.
 * Does NOT guess or invent data. Clearly identifies when data is insufficient.
 */
export function calculateDeterministicCycle(
  entries: CycleEntry[],
  settings: CycleSettings = DEFAULT_CYCLE_SETTINGS,
  referenceDate: Date = new Date()
): CycleCalculationResult {
  // Sort entries newest first
  const sorted = [...entries].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const todayIso = referenceDate.toISOString().split('T')[0];

  if (sorted.length === 0) {
    return {
      currentDay: 1,
      averageCycleDays: settings.averageCycleDays || 28,
      averagePeriodDays: settings.averagePeriodDays || 5,
      lastPeriodStartDate: null,
      estimatedNextPeriodDate: null,
      daysUntilNextPeriod: null,
      estimatedOvulationDate: null,
      fertileWindowStart: null,
      fertileWindowEnd: null,
      currentPhase: 'folliculaire',
      isEstimateOnly: true,
      hasSufficientData: false,
      cycleLengthVariationDays: 0,
      shortestCycleDays: 0,
      longestCycleDays: 0,
      cyclesObservedCount: 0,
      confidenceLevel: 'initial',
      confidenceNote: 'Enregistrez votre premier cycle pour activer vos repères personnalisés.'
    };
  }

  // Calculate real cycle lengths if multiple entries exist
  const cycleDurations: number[] = [];
  const periodDurations: number[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const cur = sorted[i];
    
    // Period duration
    if (cur.endDate && cur.startDate) {
      const start = new Date(cur.startDate);
      const end = new Date(cur.endDate);
      const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 0 && diffDays <= 14) {
        periodDurations.push(diffDays);
      }
    }

    // Cycle duration between this start and previous start
    if (i < sorted.length - 1) {
      const prev = sorted[i + 1];
      const curStart = new Date(cur.startDate);
      const prevStart = new Date(prev.startDate);
      const duration = Math.round((curStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24));
      if (duration >= 18 && duration <= 60) {
        cycleDurations.push(duration);
      }
    }
  }

  // Calculate computed averages or fallback to user settings
  const realAvgCycle = cycleDurations.length > 0
    ? Math.round(cycleDurations.reduce((a, b) => a + b, 0) / cycleDurations.length)
    : settings.averageCycleDays || 28;

  const realAvgPeriod = periodDurations.length > 0
    ? Math.round(periodDurations.reduce((a, b) => a + b, 0) / periodDurations.length)
    : settings.averagePeriodDays || 5;

  const shortestCycle = cycleDurations.length > 0 ? Math.min(...cycleDurations) : realAvgCycle;
  const longestCycle = cycleDurations.length > 0 ? Math.max(...cycleDurations) : realAvgCycle;
  const variation = longestCycle - shortestCycle;

  const latest = sorted[0];
  const latestStart = new Date(latest.startDate);

  // Current day in the active cycle
  const diffMs = referenceDate.getTime() - latestStart.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  const currentCycleDay = diffDays > 0 ? diffDays : 1;

  // Next period estimation
  const nextPeriodDate = new Date(latestStart);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + realAvgCycle);
  const nextPeriodIso = nextPeriodDate.toISOString().split('T')[0];

  // Days until next period
  const msUntilNext = nextPeriodDate.getTime() - referenceDate.getTime();
  const daysUntilNext = Math.ceil(msUntilNext / (1000 * 60 * 60 * 24));

  // Ovulation: approximately 14 days before next period
  const ovulationDate = new Date(latestStart);
  ovulationDate.setDate(ovulationDate.getDate() + (realAvgCycle - 14));
  const ovulationIso = ovulationDate.toISOString().split('T')[0];

  // Fertile window: 5 days before ovulation to 1 day after
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(fertileStart.getDate() - 5);
  const fertileStartIso = fertileStart.toISOString().split('T')[0];

  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1);
  const fertileEndIso = fertileEnd.toISOString().split('T')[0];

  // Current cycle phase
  let phase: CyclePhase = 'folliculaire';
  if (currentCycleDay <= realAvgPeriod) {
    phase = 'menstruelle';
  } else if (todayIso >= fertileStartIso && todayIso <= fertileEndIso) {
    phase = 'ovulatoire';
  } else if (todayIso > fertileEndIso || currentCycleDay > (realAvgCycle - 14)) {
    phase = 'luteale';
  }

  // Confidence evaluation
  let confidenceLevel: 'initial' | 'moyen' | 'eleve' = 'initial';
  let confidenceNote = 'Estimation basée sur vos données disponibles.';

  if (sorted.length >= 3) {
    if (variation > 5 || settings.perceivedRegularity === 'souvent_variable') {
      confidenceLevel = 'moyen';
      confidenceNote = 'Les dates peuvent varier davantage lorsque la durée des cycles change.';
    } else {
      confidenceLevel = 'eleve';
      confidenceNote = 'Estimation basée sur vos derniers cycles enregistrés.';
    }
  } else if (sorted.length === 2) {
    confidenceLevel = 'moyen';
    confidenceNote = 'Estimation basée sur vos derniers cycles enregistrés.';
  } else {
    confidenceLevel = 'initial';
    confidenceNote = 'Estimation initiale basée sur vos données déclarées. S’affinera avec vos prochains cycles.';
  }

  return {
    currentDay: currentCycleDay,
    averageCycleDays: realAvgCycle,
    averagePeriodDays: realAvgPeriod,
    lastPeriodStartDate: latest.startDate,
    estimatedNextPeriodDate: nextPeriodIso,
    daysUntilNextPeriod: daysUntilNext,
    estimatedOvulationDate: ovulationIso,
    fertileWindowStart: fertileStartIso,
    fertileWindowEnd: fertileEndIso,
    currentPhase: phase,
    isEstimateOnly: true,
    hasSufficientData: sorted.length >= 1,
    cycleLengthVariationDays: variation,
    shortestCycleDays: shortestCycle,
    longestCycleDays: longestCycle,
    cyclesObservedCount: sorted.length,
    confidenceLevel,
    confidenceNote
  };
}

export function formatFrenchCycleDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Non renseigné';
  try {
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function formatShortFrenchDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Pure statistical & deterministic calculation of user's logged symptoms trends.
 * STRICTLY DESCRIPTIVE: No medical diagnosis, pure observational analytics from user's recorded logs.
 */
export function calculateSymptomTrends(
  dailyLogs: Record<string, DailyCycleLog>,
  entries: CycleEntry[]
): SymptomTrendsAnalysis {
  const logKeys = Object.keys(dailyLogs);
  const totalLoggedDays = logKeys.length;

  if (totalLoggedDays === 0) {
    return {
      totalLoggedDays: 0,
      frequentSymptoms: [],
      dominantMood: null,
      averageEnergy: null,
      averagePainLevel: 0,
      descriptiveObservations: [
        'Enregistrez vos premiers ressentis quotidiens (douleurs, énergie, humeur) pour générer votre synthèse descriptive OREA.'
      ]
    };
  }

  // Frequency of symptoms
  const symptomCounts: Record<string, number> = {};
  const moodCounts: Record<string, number> = {};
  const energyCounts: Record<string, number> = {};
  let totalPain = 0;
  let painDaysCount = 0;

  logKeys.forEach((dateStr) => {
    const log = dailyLogs[dateStr];
    if (log.symptoms && Array.isArray(log.symptoms)) {
      log.symptoms.forEach((symp) => {
        symptomCounts[symp] = (symptomCounts[symp] || 0) + 1;
      });
    }

    if (log.mood) {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
    }

    if (log.energy) {
      energyCounts[log.energy] = (energyCounts[log.energy] || 0) + 1;
    }

    if (log.painLevel !== undefined && log.painLevel > 0) {
      totalPain += log.painLevel;
      painDaysCount += 1;
    }
  });

  const frequentSymptoms = Object.entries(symptomCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalLoggedDays) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  // Dominant mood
  let dominantMood: { mood: MoodType; count: number; label: string } | null = null;
  const moodLabels: Record<MoodType, string> = {
    tres_bien: 'Très bien / Radieuse 😄',
    bien: 'Bien / Sereine 🙂',
    moyen: 'Moyenne / Neutre 😐',
    faible: 'Faible / Vulnérable 😔',
    tres_difficile: 'Difficile / Irritable 😣'
  };

  const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  if (sortedMoods.length > 0) {
    const [topMood, count] = sortedMoods[0];
    dominantMood = {
      mood: topMood as MoodType,
      count,
      label: moodLabels[topMood as MoodType] || topMood
    };
  }

  // Average energy
  let averageEnergy: { energy: EnergyType; count: number; label: string } | null = null;
  const energyLabels: Record<EnergyType, string> = {
    faible: 'Faible ⚡',
    moyen: 'Moyen ⚡',
    bon: 'Bon ⚡',
    tres_bon: 'Très bon / Vitalité 🔥'
  };

  const sortedEnergy = Object.entries(energyCounts).sort((a, b) => b[1] - a[1]);
  if (sortedEnergy.length > 0) {
    const [topEnergy, count] = sortedEnergy[0];
    averageEnergy = {
      energy: topEnergy as EnergyType,
      count,
      label: energyLabels[topEnergy as EnergyType] || topEnergy
    };
  }

  const averagePainLevel = painDaysCount > 0 ? Number((totalPain / painDaysCount).toFixed(1)) : 0;

  // Generate descriptive observations
  const descriptiveObservations: string[] = [];

  if (frequentSymptoms.length > 0) {
    const topSymptom = frequentSymptoms[0];
    descriptiveObservations.push(
      `Le ressenti physique le plus fréquemment noté est « ${topSymptom.name} » (${topSymptom.count} fois sur ${totalLoggedDays} jour(s) de suivi).`
    );
  }

  if (dominantMood) {
    descriptiveObservations.push(
      `Tendance d'humeur dominante : ${dominantMood.label} (enregistrée ${dominantMood.count} fois).`
    );
  }

  if (averageEnergy) {
    descriptiveObservations.push(
      `Niveau d'énergie le plus régulier : ${averageEnergy.label}.`
    );
  }

  if (painDaysCount > 0) {
    descriptiveObservations.push(
      `Intensité moyenne de gêne ou douleur notée lors des jours avec sensations : ${averagePainLevel} / 10.`
    );
  }

  return {
    totalLoggedDays,
    frequentSymptoms,
    dominantMood,
    averageEnergy,
    averagePainLevel,
    descriptiveObservations
  };
}
