import React, { useState } from 'react';
import {
  X,
  Play,
  Sliders,
  Dumbbell,
  Clock,
  Target,
  Sparkles,
  AlertCircle,
  Check
} from 'lucide-react';
import {
  EnergieCategory,
  EnergieDifficulty,
  EnergieExercise,
  ENERGIE_CATEGORIES_LIST,
  ENERGIE_DIFFICULTIES_LIST
} from '../../types/energie';
import { OREA_ENERGIE_EXERCISES } from '../../data/energieExercises';

interface OreaWorkoutCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchSession: (title: string, exercises: EnergieExercise[], level: EnergieDifficulty) => void;
  initialLevel?: EnergieDifficulty;
}

export const OreaWorkoutCreatorModal: React.FC<OreaWorkoutCreatorModalProps> = ({
  isOpen,
  onClose,
  onLaunchSession,
  initialLevel = 'débutant',
}) => {
  const [selectedLevel, setSelectedLevel] = useState<EnergieDifficulty>(initialLevel);
  const [selectedCategory, setSelectedCategory] = useState<EnergieCategory>('corps-complet');
  const [selectedDuration, setSelectedDuration] = useState<string>('20 min');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['aucun']);
  const [selectedGoal, setSelectedGoal] = useState<string>('Renforcer mon corps');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleEquipment = (eq: string) => {
    setSelectedEquipment((prev) => {
      if (eq === 'aucun') return ['aucun'];
      const filtered = prev.filter((e) => e !== 'aucun');
      return filtered.includes(eq)
        ? filtered.filter((e) => e !== eq)
        : [...filtered, eq];
    });
  };

  const handleGenerate = () => {
    setErrorMsg(null);

    // Filter candidate exercises strictly matching user criteria per Rule #28
    const matching = OREA_ENERGIE_EXERCISES.filter((ex) => {
      if (!ex.isActive) return false;

      // Category match: primary or secondary or if 'corps-complet' was picked
      const matchesCategory =
        selectedCategory === 'corps-complet' ||
        ex.category === selectedCategory ||
        (ex.secondaryCategories && ex.secondaryCategories.includes(selectedCategory));

      if (!matchesCategory) return false;

      // Equipment match: exercise equipment must be among available
      const requiresEquipment = ex.equipment.some((eq) => eq !== 'aucun');
      if (requiresEquipment) {
        const hasAllReq = ex.equipment.every((eq) => eq === 'aucun' || selectedEquipment.includes(eq));
        if (!hasAllReq) return false;
      }

      return true;
    });

    if (matching.length === 0) {
      setErrorMsg('Aucun exercice ne correspond exactement à cette combinaison. Essayez avec "Corps complet" ou ajoutez un équipement.');
      return;
    }

    // Number of exercises depends on duration:
    // 5 min -> 2 exercises
    // 10-15 min -> 3 exercises
    // 20-30 min -> 4-5 exercises
    // 45+ min -> 6 exercises
    let count = 3;
    if (selectedDuration === '5 min') count = 2;
    else if (selectedDuration === '10 min' || selectedDuration === '15 min') count = 3;
    else if (selectedDuration === '20 min' || selectedDuration === '30 min') count = 4;
    else count = 5;

    const chosen = matching.slice(0, count);

    const title = `Séance ${ENERGIE_CATEGORIES_LIST.find((c) => c.id === selectedCategory)?.label || 'Personnalisée'} (${selectedDuration})`;
    onLaunchSession(title, chosen, selectedLevel);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600/10 text-orange-600 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                Générateur d'entraînement
              </span>
              <h2 className="text-base font-extrabold text-[#0f2347] dark:text-white">
                Créer ma séance personnalisée
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* 1. Niveau */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-[#0f2347] dark:text-white uppercase tracking-wider">
              1. Niveau d'intensité
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ENERGIE_DIFFICULTIES_LIST.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedLevel === lvl.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-200'
                  }`}
                >
                  <span>{lvl.icon}</span>
                  <span className="capitalize">{lvl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Zone du corps */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-[#0f2347] dark:text-white uppercase tracking-wider">
              2. Zone du corps ciblée
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ENERGIE_CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Durée */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-[#0f2347] dark:text-white uppercase tracking-wider">
              3. Durée estimée
            </label>
            <div className="flex flex-wrap gap-2">
              {['5 min', '10 min', '15 min', '20 min', '30 min', '45 min'].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setSelectedDuration(dur)}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                    selectedDuration === dur
                      ? 'border-orange-500 bg-orange-600 text-white'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Matériel */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-[#0f2347] dark:text-white uppercase tracking-wider">
              4. Matériel à disposition
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'aucun', label: 'Aucun (poids du corps)' },
                { id: 'tapis', label: 'Tapis' },
                { id: 'chaise', label: 'Chaise' },
                { id: 'élastique', label: 'Élastique' },
                { id: 'haltères', label: 'Haltères' },
              ].map((m) => {
                const isChecked = selectedEquipment.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleEquipment(m.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isChecked
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 text-orange-600" />}
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Générer et lancer ma séance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
