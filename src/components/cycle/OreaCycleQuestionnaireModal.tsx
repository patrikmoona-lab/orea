import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Shield,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  Check,
  Plus,
  Trash2,
  HelpCircle,
  Activity,
  Smile,
  Zap,
  Moon,
  FileText
} from 'lucide-react';
import { CycleEntry, CycleSettings } from '../../types/cycle';
import { formatFrenchCycleDate } from '../../services/cycleEngine';

export interface CycleQuestionnaireAnswers {
  birthDate?: string;
  lastPeriodStartDate?: string;
  periodDurationDays?: number | 'inconnu';
  cycleDurationDays?: number | 'inconnu';
  perceivedRegularity: 'regulier' | 'parfois_variable' | 'souvent_variable' | 'inconnu';
  pastCyclesDates: string[];
  trackedAspects: ('symptomes' | 'humeur' | 'energie' | 'sommeil' | 'activite' | 'notes')[];
}

interface OreaCycleQuestionnaireModalProps {
  isOpen: boolean;
  userFirstName: string;
  initialBirthDate?: string;
  existingSettings?: CycleSettings;
  existingEntries?: CycleEntry[];
  onComplete: (answers: CycleQuestionnaireAnswers) => void;
  onSkipLater: () => void;
}

export const OreaCycleQuestionnaireModal: React.FC<OreaCycleQuestionnaireModalProps> = ({
  isOpen,
  userFirstName,
  initialBirthDate,
  existingSettings,
  existingEntries,
  onComplete,
  onSkipLater
}) => {
  // Step tracker: 0 = Intro, 1..7 = Questions, 8 = Summary
  const [step, setStep] = useState<number>(0);

  // Form states
  const [birthDate, setBirthDate] = useState<string>(initialBirthDate || existingSettings?.birthDate || '');
  const [lastPeriodStartDate, setLastPeriodStartDate] = useState<string>(
    existingEntries && existingEntries.length > 0 ? existingEntries[0].startDate : ''
  );
  const [lastPeriodUnknown, setLastPeriodUnknown] = useState<boolean>(false);

  const [periodDurationDays, setPeriodDurationDays] = useState<number | 'inconnu'>(
    existingSettings?.averagePeriodDays || 5
  );
  const [cycleDurationDays, setCycleDurationDays] = useState<number | 'inconnu'>(
    existingSettings?.averageCycleDays || 28
  );
  const [perceivedRegularity, setPerceivedRegularity] = useState<
    'regulier' | 'parfois_variable' | 'souvent_variable' | 'inconnu'
  >(existingSettings?.perceivedRegularity || 'regulier');

  const [wantAddPastCycles, setWantAddPastCycles] = useState<boolean>(false);
  const [pastCyclesDates, setPastCyclesDates] = useState<string[]>([]);

  const [trackedAspects, setTrackedAspects] = useState<
    ('symptomes' | 'humeur' | 'energie' | 'sommeil' | 'activite' | 'notes')[]
  >(
    existingSettings?.trackedAspects || [
      'symptomes',
      'humeur',
      'energie',
      'sommeil',
      'activite',
      'notes'
    ]
  );

  useEffect(() => {
    if (isOpen) {
      if (initialBirthDate && !birthDate) {
        setBirthDate(initialBirthDate);
      }
    }
  }, [isOpen, initialBirthDate]);

  if (!isOpen) return null;

  const totalSteps = 7; // questions 1 through 7

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 8));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const toggleAspect = (aspect: 'symptomes' | 'humeur' | 'energie' | 'sommeil' | 'activite' | 'notes') => {
    if (trackedAspects.includes(aspect)) {
      setTrackedAspects(trackedAspects.filter((a) => a !== aspect));
    } else {
      setTrackedAspects([...trackedAspects, aspect]);
    }
  };

  const handleAddPastDate = () => {
    setPastCyclesDates([...pastCyclesDates, '']);
  };

  const handleUpdatePastDate = (index: number, val: string) => {
    const next = [...pastCyclesDates];
    next[index] = val;
    setPastCyclesDates(next);
  };

  const handleRemovePastDate = (index: number) => {
    setPastCyclesDates(pastCyclesDates.filter((_, i) => i !== index));
  };

  const handleFinish = () => {
    onComplete({
      birthDate: birthDate.trim() || undefined,
      lastPeriodStartDate: lastPeriodUnknown ? undefined : lastPeriodStartDate || undefined,
      periodDurationDays,
      cycleDurationDays,
      perceivedRegularity,
      pastCyclesDates: pastCyclesDates.filter((d) => d.trim().length > 0),
      trackedAspects
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-100/80 dark:border-slate-800 text-left relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Subtle decorative glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-200/40 dark:bg-rose-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-100/40 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

        {/* =========================================================================
            SCREEN 0 : ACCUEIL
        ========================================================================= */}
        {step === 0 && (
          <div className="relative z-10 space-y-6 text-center py-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-sm">
              <span className="text-3xl">🌸</span>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold tracking-wide border border-rose-200/50 dark:border-rose-900/50">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personnalisation OREA</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Commençons votre suivi 🌸
              </h2>
              <p className="text-sm font-bold text-rose-700 dark:text-rose-400">
                Bonjour {userFirstName} 👋
              </p>
            </div>

            <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
              Pour personnaliser votre espace Mon Cycle, OREA va vous poser quelques questions rapides. Vous pourrez modifier vos réponses à tout moment.
            </p>

            <div className="pt-4 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Commencer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onSkipLater}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 py-1 transition-colors cursor-pointer"
              >
                Plus tard (ouvrir sans questionnaire)
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 pt-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Données 100% privées & modifiables à tout moment</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            QUESTIONS 1 THROUGH 7 (STEPPED INTERFACE)
        ========================================================================= */}
        {step >= 1 && step <= 7 && (
          <div className="relative z-10 flex flex-col flex-1">
            {/* Step Progress Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleBack}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>

              <div className="text-right">
                <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                  Étape {step} / {totalSteps}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden my-3">
              <div
                className="bg-gradient-to-r from-rose-500 to-rose-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>

            {/* Questions Body */}
            <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-4 text-slate-800 dark:text-slate-200">
              
              {/* Question 1: Date de naissance */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Profil & Âge
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      Quelle est votre date de naissance ?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Cette information facultative aide à adapter nos conseils pédagogiques selon les étapes de vie.
                    </p>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Date de naissance (JJ / MM / AAAA)
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                </div>
              )}

              {/* Question 2: Dernières règles */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Repère clé
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      Quand ont commencé vos dernières règles ?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Il s'agit du premier jour de saignement de vos dernières règles.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <input
                        type="date"
                        disabled={lastPeriodUnknown}
                        value={lastPeriodStartDate}
                        onChange={(e) => {
                          setLastPeriodStartDate(e.target.value);
                          setLastPeriodUnknown(false);
                        }}
                        className={`w-full px-4 py-3 rounded-2xl border bg-white dark:bg-slate-800 text-sm font-semibold outline-none transition-all ${
                          lastPeriodUnknown
                            ? 'opacity-40 border-slate-200 dark:border-slate-800'
                            : 'border-slate-200 dark:border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                        }`}
                      />
                    </div>

                    <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lastPeriodUnknown}
                        onChange={(e) => {
                          setLastPeriodUnknown(e.target.checked);
                          if (e.target.checked) setLastPeriodStartDate('');
                        }}
                        className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Je ne m'en souviens pas exactement pour l'instant
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Question 3: Durée des règles */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Écoulement
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      Combien de jours durent généralement vos règles ?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      La durée habituelle constatée entre le 1er et le dernier jour.
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setPeriodDurationDays(num)}
                        className={`py-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                          periodDurationDays === num
                            ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 ring-2 ring-rose-300'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {num === 7 ? '7+ jours' : `${num} jours`}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPeriodDurationDays('inconnu')}
                      className={`py-3 rounded-2xl font-bold text-xs border transition-all cursor-pointer ${
                        periodDurationDays === 'inconnu'
                          ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 ring-2 ring-rose-300'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-500'
                      }`}
                    >
                      Je ne sais pas
                    </button>
                  </div>
                </div>
              )}

              {/* Question 4: Durée habituelle du cycle */}
              {step === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Rythme global
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      Combien de jours dure généralement votre cycle ?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Nombre de jours entre le 1er jour des règles et la veille des règles suivantes (moyenne courante : 28 jours).
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {[24, 26, 28, 30, 32].map((d) => (
                        <button
                          type="button"
                          key={d}
                          onClick={() => setCycleDurationDays(d)}
                          className={`py-2.5 rounded-2xl font-bold text-xs border transition-all cursor-pointer ${
                            cycleDurationDays === d
                              ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 ring-2 ring-rose-300'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {d} jours
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Ou saisissez un nombre exact de jours :
                        </label>
                        <input
                          type="number"
                          min="18"
                          max="60"
                          value={typeof cycleDurationDays === 'number' ? cycleDurationDays : ''}
                          placeholder="Ex : 29"
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val >= 15 && val <= 70) {
                              setCycleDurationDays(val);
                            } else if (e.target.value === '') {
                              setCycleDurationDays(28);
                            }
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setCycleDurationDays('inconnu')}
                        className={`self-end py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                          cycleDurationDays === 'inconnu'
                            ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 ring-1 ring-rose-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        Je ne sais pas
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Question 5: Régularité perçue */}
              {step === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Variations
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      Votre cycle est-il généralement… ?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Sert uniquement à adapter la présentation de vos estimations déterministes.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    {[
                      { id: 'regulier', title: 'Plutôt régulier', desc: 'Les règles arrivent généralement à la date prévue.' },
                      { id: 'parfois_variable', title: 'Parfois variable', desc: 'Variations de quelques jours selon le stress, voyages...' },
                      { id: 'souvent_variable', title: 'Souvent variable', desc: 'Durées fluctuantes d’un mois à l’autre.' },
                      { id: 'inconnu', title: 'Je ne sais pas', desc: 'Début de suivi ou reprise récente.' }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setPerceivedRegularity(opt.id as any)}
                        className={`w-full p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                          perceivedRegularity === opt.id
                            ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-slate-900 dark:text-white ring-2 ring-rose-300'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {opt.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {opt.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question 6: Historique des règles */}
              {step === 6 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Historique (facultatif)
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      Souhaitez-vous ajouter vos cycles précédents ?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Plus OREA dispose d'anciens repères, plus le calcul des moyennes est précis.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setWantAddPastCycles(true);
                          if (pastCyclesDates.length === 0) setPastCyclesDates(['']);
                        }}
                        className={`py-3 rounded-2xl font-bold text-xs border transition-all cursor-pointer ${
                          wantAddPastCycles
                            ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 ring-2 ring-rose-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        Oui, ajouter mes anciens cycles
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setWantAddPastCycles(false);
                          setPastCyclesDates([]);
                        }}
                        className={`py-3 rounded-2xl font-bold text-xs border transition-all cursor-pointer ${
                          !wantAddPastCycles
                            ? 'border-slate-800 dark:border-slate-200 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        Pas maintenant
                      </button>
                    </div>

                    {wantAddPastCycles && (
                      <div className="p-3.5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-2.5">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                          Dates de début de vos cycles précédents :
                        </span>
                        {pastCyclesDates.map((pDate, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="date"
                              value={pDate}
                              onChange={(e) => handleUpdatePastDate(idx, e.target.value)}
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePastDate(idx)}
                              className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={handleAddPastDate}
                          className="text-xs text-rose-700 dark:text-rose-400 hover:underline font-bold flex items-center gap-1 cursor-pointer pt-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter une date de cycle précédent</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Question 7: Options de suivi personnel */}
              {step === 7 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Suivi sur-mesure
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      Souhaitez-vous également suivre vos ressentis ?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Cochez les éléments que vous souhaitez voir dans votre fiche quotidienne (tout reste modifiable).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {[
                      { id: 'symptomes', label: 'Symptômes physiques', icon: Activity },
                      { id: 'humeur', label: 'Humeur & Moral', icon: Smile },
                      { id: 'energie', label: 'Niveau d’énergie', icon: Zap },
                      { id: 'sommeil', label: 'Qualité du sommeil', icon: Moon },
                      { id: 'activite', label: 'Activité physique', icon: Heart },
                      { id: 'notes', label: 'Notes personnelles', icon: FileText }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isChecked = trackedAspects.includes(item.id as any);
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => toggleAspect(item.id as any)}
                          className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            isChecked
                              ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 ring-1 ring-rose-300'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isChecked ? 'text-rose-600' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs cursor-pointer"
              >
                Précédent
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{step === 7 ? 'Voir le récapitulatif' : 'Continuer'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 8 : RÉCAPITULATIF AVANT VALIDATION
        ========================================================================= */}
        {step === 8 && (
          <div className="relative z-10 space-y-4 animate-fade-in flex flex-col flex-1">
            <div className="space-y-1 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Confirmation
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Votre suivi personnalisé
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vérifiez vos repères avant de générer votre calendrier intelligent.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Date de naissance :</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {birthDate ? formatFrenchCycleDate(birthDate) : 'Non renseignée'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Dernières règles :</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {lastPeriodStartDate
                      ? formatFrenchCycleDate(lastPeriodStartDate)
                      : 'À enregistrer ultérieurement'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Durée habituelle des règles :</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {periodDurationDays === 'inconnu' ? 'Inconnue' : `${periodDurationDays} jours`}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Durée habituelle du cycle :</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {cycleDurationDays === 'inconnu' ? 'Inconnue' : `${cycleDurationDays} jours`}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Cycle perçu :</span>
                  <span className="font-bold text-slate-900 dark:text-white capitalize">
                    {perceivedRegularity === 'regulier'
                      ? 'Plutôt régulier'
                      : perceivedRegularity === 'parfois_variable'
                      ? 'Parfois variable'
                      : perceivedRegularity === 'souvent_variable'
                      ? 'Souvent variable'
                      : 'Non renseigné'}
                  </span>
                </div>

                {pastCyclesDates.length > 0 && (
                  <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500 font-medium block mb-1">
                      Anciens cycles ajoutés :
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {pastCyclesDates
                        .filter((d) => d.trim().length > 0)
                        .map((d, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-semibold text-[11px]"
                          >
                            {formatFrenchCycleDate(d)}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed">
                ✓ <strong>Calcul automatique OREA :</strong> Dès validation, vos phases, vos estimations déterministes et votre calendrier interactif seront immédiatement calculés. Vous pourrez modifier ces informations à tout moment.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Modifier
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-600/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer et continuer</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
