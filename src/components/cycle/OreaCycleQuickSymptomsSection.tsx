import React from 'react';
import {
  Activity,
  Zap,
  Smile,
  Droplets,
  Calendar,
  Sparkles,
  Heart,
  Sliders,
  CheckCircle2,
  Info,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import {
  DailyCycleLog,
  MenstrualFlow,
  MoodType,
  EnergyType,
  CycleCalculationResult
} from '../../types/cycle';
import { formatFrenchCycleDate, calculateSymptomTrends } from '../../services/cycleEngine';

interface OreaCycleQuickSymptomsSectionProps {
  selectedDate: string; // YYYY-MM-DD
  todayIso: string;
  dailyLogs: Record<string, DailyCycleLog>;
  cycleStats: CycleCalculationResult;
  onUpdateDailyLog: (date: string, log: DailyCycleLog) => void;
  onSelectToday: () => void;
  onOpenFullModal: () => void;
}

interface QuickSymptomOption {
  id: string;
  label: string;
  icon: string;
  category: 'douleur' | 'digestion' | 'autre';
}

const QUICK_PHYSICAL_SYMPTOMS: QuickSymptomOption[] = [
  { id: 'Crampes pelviennes', label: 'Crampes pelviennes', icon: '⚡', category: 'douleur' },
  { id: 'Maux de tête', label: 'Maux de tête', icon: '💆‍♀️', category: 'douleur' },
  { id: 'Tensions mammaires', label: 'Tensions mammaires', icon: '🌸', category: 'douleur' },
  { id: 'Douleurs lombaires', label: 'Douleurs lombaires', icon: '🦴', category: 'douleur' },
  { id: 'Ballonnements', label: 'Ballonnements', icon: '🎈', category: 'digestion' },
  { id: 'Nausées légères', label: 'Nausées légères', icon: '🌿', category: 'digestion' },
  { id: 'Fatigue musculaire', label: 'Tiraillements musculaires', icon: '🩹', category: 'douleur' },
  { id: 'Sensibilité cutanée', label: 'Sensibilité cutanée', icon: '✨', category: 'autre' }
];

const MOOD_OPTIONS: { id: MoodType; emoji: string; label: string; desc: string }[] = [
  { id: 'tres_bien', emoji: '😄', label: 'Très bien', desc: 'Radieuse & positive' },
  { id: 'bien', emoji: '🙂', label: 'Bien', desc: 'Sereine & équilibrée' },
  { id: 'moyen', emoji: '😐', label: 'Neutre', desc: 'Journée normale' },
  { id: 'faible', emoji: '😔', label: 'Sensible', desc: 'Vulnérable ou émotive' },
  { id: 'tres_difficile', emoji: '😣', label: 'Difficile', desc: 'Irritable ou tendue' }
];

const ENERGY_OPTIONS: { id: EnergyType; label: string; iconEmoji: string; desc: string }[] = [
  { id: 'faible', label: 'Faible', iconEmoji: '🪫', desc: 'Besoin de repos' },
  { id: 'moyen', label: 'Moyen', iconEmoji: '⚡', desc: 'Rythme modéré' },
  { id: 'bon', label: 'Bon', iconEmoji: '🌟', desc: 'Bonne vitalité' },
  { id: 'tres_bon', label: 'Très bon', iconEmoji: '🔥', desc: 'Pleine forme' }
];

const FLOW_OPTIONS: { id: MenstrualFlow | 'spotting' | 'none'; label: string; icon: string }[] = [
  { id: 'none', label: 'Aucun écoulement', icon: '⚪' },
  { id: 'spotting', label: 'Spotting léger', icon: '🟤' },
  { id: 'leger', label: 'Flux léger', icon: '💧' },
  { id: 'moyen', label: 'Flux moyen', icon: '🩸' },
  { id: 'abondant', label: 'Flux abondant', icon: '🩸🩸' }
];

export const OreaCycleQuickSymptomsSection: React.FC<OreaCycleQuickSymptomsSectionProps> = ({
  selectedDate,
  todayIso,
  dailyLogs,
  cycleStats,
  onUpdateDailyLog,
  onSelectToday,
  onOpenFullModal
}) => {
  const currentLog = dailyLogs[selectedDate] || {
    date: selectedDate,
    symptoms: [],
    symptomIntensities: {},
    flow: 'none',
    painLevel: 0,
    mood: 'bien',
    energy: 'moyen'
  };

  const isToday = selectedDate === todayIso;

  // Statistical trends computed deterministically
  const trends = React.useMemo(() => {
    return calculateSymptomTrends(dailyLogs, []);
  }, [dailyLogs]);

  // Toggle a physical symptom
  const handleToggleSymptom = (symptomName: string) => {
    const existing = currentLog.symptoms || [];
    const existingIntensities = currentLog.symptomIntensities || {};

    let nextSymptoms: string[];
    const nextIntensities = { ...existingIntensities };

    if (existing.includes(symptomName)) {
      nextSymptoms = existing.filter((s) => s !== symptomName);
      delete nextIntensities[symptomName];
    } else {
      nextSymptoms = [...existing, symptomName];
      nextIntensities[symptomName] = 'moyen';
    }

    const nextLog: DailyCycleLog = {
      ...currentLog,
      date: selectedDate,
      symptoms: nextSymptoms,
      symptomIntensities: nextIntensities,
      painLevel: nextSymptoms.length === 0 && (currentLog.painLevel || 0) <= 2 ? 0 : currentLog.painLevel,
      updatedAt: new Date().toISOString()
    };

    onUpdateDailyLog(selectedDate, nextLog);
  };

  // Set intensity for a symptom
  const handleSetIntensity = (symptomName: string, intensity: 'leger' | 'moyen' | 'fort') => {
    const nextIntensities = {
      ...(currentLog.symptomIntensities || {}),
      [symptomName]: intensity
    };

    const nextLog: DailyCycleLog = {
      ...currentLog,
      date: selectedDate,
      symptomIntensities: nextIntensities,
      updatedAt: new Date().toISOString()
    };

    onUpdateDailyLog(selectedDate, nextLog);
  };

  // Select mood
  const handleSelectMood = (mood: MoodType) => {
    const nextLog: DailyCycleLog = {
      ...currentLog,
      date: selectedDate,
      mood: currentLog.mood === mood ? undefined : mood,
      updatedAt: new Date().toISOString()
    };
    onUpdateDailyLog(selectedDate, nextLog);
  };

  // Select energy
  const handleSelectEnergy = (energy: EnergyType) => {
    const nextLog: DailyCycleLog = {
      ...currentLog,
      date: selectedDate,
      energy: currentLog.energy === energy ? undefined : energy,
      updatedAt: new Date().toISOString()
    };
    onUpdateDailyLog(selectedDate, nextLog);
  };

  // Select flow
  const handleSelectFlow = (flow: MenstrualFlow | 'spotting' | 'none') => {
    const nextLog: DailyCycleLog = {
      ...currentLog,
      date: selectedDate,
      flow,
      updatedAt: new Date().toISOString()
    };
    onUpdateDailyLog(selectedDate, nextLog);
  };

  // Set pain level (0 to 10)
  const handleSetPainLevel = (level: number) => {
    const nextLog: DailyCycleLog = {
      ...currentLog,
      date: selectedDate,
      painLevel: level,
      updatedAt: new Date().toISOString()
    };
    onUpdateDailyLog(selectedDate, nextLog);
  };

  const selectedSymptoms = currentLog.symptoms || [];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 sm:p-7 space-y-6">
      {/* Header Bar with Active Date & Date Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-xs shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Mes Symptômes & Ressentis
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 font-bold">
                1 clic
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enregistrez vos sensations pour enrichir l’historique OREA sans diagnostic médical
            </p>
          </div>
        </div>

        {/* Date Selector Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 font-extrabold text-slate-800 dark:text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-rose-600" />
            <span>{isToday ? `Aujourd’hui (${formatFrenchCycleDate(selectedDate)})` : formatFrenchCycleDate(selectedDate)}</span>
          </div>
          {!isToday && (
            <button
              type="button"
              onClick={onSelectToday}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 text-[#0056d6] dark:text-blue-300 font-bold hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors shadow-2xs cursor-pointer"
            >
              Revenir à Aujourd'hui
            </button>
          )}
          <button
            type="button"
            onClick={onOpenFullModal}
            className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors cursor-pointer shadow-2xs"
            title="Ouvrir le formulaire détaillé complet"
          >
            Fiche complète →
          </button>
        </div>
      </div>

      {/* Grid of 3 Main Interactive Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* =========================================================================
            1. DOULEURS & SENSATIONS PHYSIQUES
        ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800/80 space-y-3.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <span>⚡</span>
                <span>Douleurs & Tensions</span>
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                {selectedSymptoms.length} sélectionné(s)
              </span>
            </div>

            {/* Clickable Symptom Pills */}
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PHYSICAL_SYMPTOMS.map((item) => {
                const isSelected = selectedSymptoms.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleSymptom(item.id)}
                    className={`p-2.5 rounded-xl text-left border flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/70 text-rose-950 dark:text-rose-100 font-bold ring-1 ring-rose-400 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <span className="text-base shrink-0">{item.icon}</span>
                    <span className="text-xs leading-tight line-clamp-1">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Symptoms Intensity Sub-Selectors */}
            {selectedSymptoms.length > 0 && (
              <div className="pt-2 border-t border-rose-100 dark:border-rose-900/40 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">
                  Intensité des ressentis notés :
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedSymptoms.map((symp) => (
                    <div
                      key={symp}
                      className="flex items-center justify-between bg-white dark:bg-slate-900 p-1.5 px-2.5 rounded-xl border border-rose-100 dark:border-rose-900/40 text-xs"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                        {symp}
                      </span>
                      <div className="flex items-center gap-1">
                        {(['leger', 'moyen', 'fort'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => handleSetIntensity(symp, lvl)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize cursor-pointer transition-colors ${
                              (currentLog.symptomIntensities?.[symp] || 'moyen') === lvl
                                ? 'bg-rose-600 text-white shadow-2xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pain Scale 0-10 */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Gêne ou intensité globale :
              </span>
              <span className="font-black text-rose-600 dark:text-rose-400">
                {currentLog.painLevel || 0} / 10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={currentLog.painLevel || 0}
              onChange={(e) => handleSetPainLevel(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>
        </div>

        {/* =========================================================================
            2. FATIGUE, ÉNERGIE & RYTHME
        ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800/80 space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <span>🔋</span>
                <span>Fatigue & Niveau d’Énergie</span>
              </span>
              {currentLog.energy && (
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 capitalize">
                  {currentLog.energy.replace('_', ' ')}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {ENERGY_OPTIONS.map((item) => {
                const isSelected = currentLog.energy === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectEnergy(item.id)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/70 text-amber-950 dark:text-amber-100 font-bold ring-1 ring-amber-400 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{item.iconEmoji}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <div className="mt-1">
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block">
                        {item.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Flow/Spotting status */}
          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-rose-600" />
              <span>Écoulement / Flux du jour :</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {FLOW_OPTIONS.map((f) => {
                const isSelected = (currentLog.flow || 'none') === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleSelectFlow(f.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 ring-1 ring-rose-400'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span>{f.icon} </span>
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. HUMEUR & ÉMOTIONS
        ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800/80 space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                <span>😊</span>
                <span>Humeur & Émotions</span>
              </span>
              {currentLog.mood && (
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 capitalize">
                  {currentLog.mood.replace('_', ' ')}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              {MOOD_OPTIONS.map((item) => {
                const isSelected = currentLog.mood === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectMood(item.id)}
                    className={`w-full p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/70 text-purple-950 dark:text-purple-100 font-bold ring-1 ring-purple-400 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{item.emoji}</span>
                      <div>
                        <span className="text-xs font-bold block">{item.label}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onOpenFullModal}
              className="text-xs text-rose-700 dark:text-rose-400 font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Ajouter une note personnelle ou sommeil</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          4. SYNTHÈSE STATISTIQUE & DESCRIPTIVE DU MOTEUR OREA (SANS DIAGNOSTIC)
      ========================================================================= */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-rose-50/30 to-purple-50/30 dark:from-slate-800/40 dark:via-rose-950/20 dark:to-purple-950/20 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-slate-900 dark:text-white">
                Observation descriptive OREA :
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 font-bold">
                Phase {cycleStats.currentPhase} • Jour {cycleStats.currentDay}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {trends.totalLoggedDays > 0 ? (
                <>
                  {trends.descriptiveObservations[0]}{' '}
                  {trends.descriptiveObservations[1] && <span className="opacity-90">{trends.descriptiveObservations[1]}</span>}
                </>
              ) : (
                'Vos clics enregistrent instantanément vos ressentis du jour pour enrichir vos courbes et mieux comprendre vos rythmes naturels.'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 shrink-0 self-end md:self-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Données traitées localement & 100% privées</span>
        </div>
      </div>
    </div>
  );
};
