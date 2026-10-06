import React, { useState, useEffect } from 'react';
import {
  X,
  Smile,
  Zap,
  Droplets,
  Moon,
  Activity,
  Heart,
  Check,
  AlertCircle,
  Sliders,
  Trash2
} from 'lucide-react';
import {
  DailyCycleLog,
  MenstrualFlow,
  MoodType,
  EnergyType,
  SleepQuality,
  ActivityLevel,
  SymptomIntensity
} from '../../types/cycle';
import { formatFrenchCycleDate } from '../../services/cycleEngine';

interface OreaCycleDailyLogModalProps {
  isOpen: boolean;
  selectedDate: string; // YYYY-MM-DD
  existingLog?: DailyCycleLog;
  onClose: () => void;
  onSave: (date: string, log: DailyCycleLog) => void;
  onDelete?: (date: string) => void;
}

const ALL_SYMPTOMS = [
  'Crampes pelviennes',
  'Fatigue',
  'Maux de tête',
  'Ballonnements',
  'Tensions mammaires',
  'Douleurs lombaires',
  'Troubles du sommeil',
  'Nausées légères',
  'Acné / Sensibilité cutanée',
  'Sensibilité émotionnelle'
];

export const OreaCycleDailyLogModal: React.FC<OreaCycleDailyLogModalProps> = ({
  isOpen,
  selectedDate,
  existingLog,
  onClose,
  onSave,
  onDelete
}) => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomIntensities, setSymptomIntensities] = useState<Record<string, 'leger' | 'moyen' | 'fort'>>({});
  const [flow, setFlow] = useState<MenstrualFlow | 'spotting' | 'none'>('none');
  const [painLevel, setPainLevel] = useState<number>(0);
  const [mood, setMood] = useState<MoodType>('bien');
  const [energy, setEnergy] = useState<EnergyType>('moyen');
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>('normal');
  const [hydrationGlasses, setHydrationGlasses] = useState<number>(6);
  const [activity, setActivity] = useState<ActivityLevel>('marche_legere');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (existingLog) {
      setSymptoms(existingLog.symptoms || []);
      setSymptomIntensities(existingLog.symptomIntensities || {});
      setFlow(existingLog.flow || 'none');
      setPainLevel(existingLog.painLevel || 0);
      setMood(existingLog.mood || 'bien');
      setEnergy(existingLog.energy || 'moyen');
      setSleepHours(existingLog.sleepHours || 7);
      setSleepQuality(existingLog.sleepQuality || 'normal');
      setHydrationGlasses(existingLog.hydrationGlasses || 6);
      setActivity(existingLog.activity || 'marche_legere');
      setNotes(existingLog.notes || '');
    } else {
      setSymptoms([]);
      setSymptomIntensities({});
      setFlow('none');
      setPainLevel(0);
      setMood('bien');
      setEnergy('moyen');
      setSleepHours(7);
      setSleepQuality('normal');
      setHydrationGlasses(6);
      setActivity('marche_legere');
      setNotes('');
    }
  }, [existingLog, selectedDate, isOpen]);

  if (!isOpen) return null;

  const toggleSymptom = (s: string) => {
    if (symptoms.includes(s)) {
      setSymptoms(symptoms.filter((item) => item !== s));
      const nextInt = { ...symptomIntensities };
      delete nextInt[s];
      setSymptomIntensities(nextInt);
    } else {
      setSymptoms([...symptoms, s]);
      setSymptomIntensities({ ...symptomIntensities, [s]: 'moyen' });
    }
  };

  const handleSetIntensity = (s: string, intensity: 'leger' | 'moyen' | 'fort') => {
    setSymptomIntensities({ ...symptomIntensities, [s]: intensity });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const log: DailyCycleLog = {
      date: selectedDate,
      symptoms,
      symptomIntensities,
      flow,
      painLevel,
      mood,
      energy,
      sleepHours,
      sleepQuality,
      hydrationGlasses,
      activity,
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString()
    };
    onSave(selectedDate, log);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-rose-100 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Suivi quotidien
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {formatFrenchCycleDate(selectedDate)}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4 text-xs sm:text-sm">
          {/* Section 1: Humeur & Énergie */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                😊 Humeur aujourd'hui
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: 'tres_bien', emoji: '😄', label: 'Très bien' },
                  { id: 'bien', emoji: '🙂', label: 'Bien' },
                  { id: 'moyen', emoji: '😐', label: 'Moyenne' },
                  { id: 'faible', emoji: '😔', label: 'Faible' },
                  { id: 'tres_difficile', emoji: '😣', label: 'Difficile' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setMood(item.id as MoodType)}
                    className={`py-2 px-1 rounded-2xl flex flex-col items-center gap-0.5 border cursor-pointer transition-all ${
                      mood === item.id
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 ring-2 ring-rose-200 dark:ring-rose-800'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-[10px] font-bold truncate max-w-full">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                ⚡ Mon niveau d'énergie
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'faible', label: 'Faible' },
                  { id: 'moyen', label: 'Moyen' },
                  { id: 'bon', label: 'Bon' },
                  { id: 'tres_bon', label: 'Très bon' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setEnergy(item.id as EnergyType)}
                    className={`py-2 text-xs rounded-xl font-bold border cursor-pointer transition-all ${
                      energy === item.id
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 ring-1 ring-amber-300'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Écoulement & Douleur */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                🩸 Flux ou spottings éventuels
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: 'none', label: 'Aucun' },
                  { id: 'spotting', label: 'Spotting' },
                  { id: 'leger', label: 'Léger' },
                  { id: 'moyen', label: 'Moyen' },
                  { id: 'abondant', label: 'Abondant' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setFlow(item.id as MenstrualFlow | 'spotting' | 'none')}
                    className={`py-1.5 text-[11px] rounded-xl font-bold border cursor-pointer transition-all ${
                      flow === item.id
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 ring-1 ring-rose-300'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  😣 Niveau de gêne ou douleur : <span className="text-rose-600 dark:text-rose-400 font-extrabold">{painLevel} / 10</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {painLevel === 0 ? 'Aucune' : painLevel <= 3 ? 'Légère' : painLevel <= 6 ? 'Modérée' : 'Importante'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Section 3: Symptômes et Intensités */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Symptômes & ressentis physiques
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {ALL_SYMPTOMS.map((s) => {
                const isSelected = symptoms.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-rose-600 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* Intensity sub-selector for selected symptoms */}
            {symptoms.length > 0 && (
              <div className="mt-2.5 p-3 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Intensité des ressentis notés :
                </span>
                <div className="space-y-1.5">
                  {symptoms.map((s) => (
                    <div key={s} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[160px]">
                        {s}
                      </span>
                      <div className="flex items-center gap-1">
                        {(['leger', 'moyen', 'fort'] as const).map((level) => (
                          <button
                            type="button"
                            key={level}
                            onClick={() => handleSetIntensity(s, level)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize cursor-pointer transition-colors ${
                              (symptomIntensities[s] || 'moyen') === level
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Mon Quotidien (Sommeil, Hydratation, Activité) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Mon quotidien & Rythme de vie
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Sommeil ({sleepHours}h)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="range"
                    min="4"
                    max="12"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Hydratation ({hydrationGlasses} verres ~ {(hydrationGlasses * 0.25).toFixed(1)}L)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={hydrationGlasses}
                    onChange={(e) => setHydrationGlasses(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Activité physique
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'repos', label: 'Repos' },
                  { id: 'marche_legere', label: 'Marche' },
                  { id: 'etirements_yoga', label: 'Étirements' },
                  { id: 'cardio_sport', label: 'Sport actif' }
                ].map((act) => (
                  <button
                    type="button"
                    key={act.id}
                    onClick={() => setActivity(act.id as ActivityLevel)}
                    className={`py-1.5 text-[10px] rounded-xl font-bold border cursor-pointer transition-all ${
                      activity === act.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Notes personnelles
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Sensations particulières, tisanes, moments de calme..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-rose-500 text-xs"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            {existingLog && onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(selectedDate)}
                className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Effacer</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs cursor-pointer"
              >
                Fermer
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Enregistrer ma journée</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
