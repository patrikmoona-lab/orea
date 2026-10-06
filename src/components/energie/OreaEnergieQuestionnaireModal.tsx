import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  Clock,
  Dumbbell,
  Calendar,
  MessageSquare,
  Shield,
  Award,
  Flame,
  Activity,
  Heart,
  HelpCircle,
  Check,
  User,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import { OreaLogo } from '../branding/OreaLogo';
import {
  EnergieCategory,
  EnergieDifficulty,
  UserFitnessProfile,
  ENERGIE_CATEGORIES_LIST,
  ENERGIE_DIFFICULTIES_LIST
} from '../../types/energie';
import { saveFitnessProfile, getFitnessProfile } from '../../services/energieService';
import { useAuth } from '../../context/AuthContext';

export interface QuestionnaireState {
  name: string;
  ageGroup: string;
  level: EnergieDifficulty | '';
  bodyParts: EnergieCategory[];
  goals: string[];
  duration: string;
  frequency: string;
  equipment: string[];
  limitations?: string;
}

interface OreaEnergieQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: UserFitnessProfile) => void;
  initialProfile?: Partial<UserFitnessProfile>;
}

export const OreaEnergieQuestionnaireModal: React.FC<OreaEnergieQuestionnaireModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialProfile,
}) => {
  const { currentUser } = useAuth();

  // Current step:
  // 0: Welcome screen (« Préparons votre expérience ÉNERGIE 💪 »)
  // 1: Profil personnel (Prénom & Âge) - auto-rempli si connu
  // 2: Niveau d'expérience physique (les 7 niveaux exacts)
  // 3: Zones du corps prioritaires (les 10 zones exactes)
  // 4: Objectifs (sélection multiple)
  // 5: Durée disponible
  // 6: Matériel disponible (sélection multiple)
  // 7: Fréquence souhaitée
  // 8: Contraintes / limitations (champ libre facultatif avec prudence)
  // 9: Écran final (« Votre espace ÉNERGIE est prêt. »)
  const [step, setStep] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [formData, setFormData] = useState<QuestionnaireState>(() => {
    return {
      name: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Membre OREA',
      ageGroup: '26 - 35 ans',
      level: (initialProfile?.level as EnergieDifficulty) || 'débutant',
      bodyParts: initialProfile?.bodyParts || ['corps-complet'],
      goals: initialProfile?.goals || ['améliorer ma condition physique'],
      duration: initialProfile?.duration || '20 min',
      frequency: initialProfile?.frequency || '3 jours/semaine',
      equipment: initialProfile?.equipment || ['aucun'],
      limitations: initialProfile?.limitations || '',
    };
  });

  // Load existing profile if available
  useEffect(() => {
    async function loadExisting() {
      if (initialProfile && Object.keys(initialProfile).length > 0) {
        setFormData((prev) => ({
          ...prev,
          level: (initialProfile.level as EnergieDifficulty) || prev.level,
          bodyParts: initialProfile.bodyParts || prev.bodyParts,
          goals: initialProfile.goals || prev.goals,
          duration: initialProfile.duration || prev.duration,
          frequency: initialProfile.frequency || prev.frequency,
          equipment: initialProfile.equipment || prev.equipment,
          limitations: initialProfile.limitations || prev.limitations,
        }));
        return;
      }
      try {
        const existing = await getFitnessProfile(currentUser?.uid);
        if (existing) {
          setFormData((prev) => ({
            ...prev,
            level: existing.level || prev.level,
            bodyParts: existing.bodyParts || prev.bodyParts,
            goals: existing.goals || prev.goals,
            duration: existing.duration || prev.duration,
            frequency: existing.frequency || prev.frequency,
            equipment: existing.equipment || prev.equipment,
            limitations: existing.limitations || prev.limitations,
          }));
        }
      } catch (e) {
        console.warn(e);
      }
    }
    if (isOpen) {
      loadExisting();
    }
  }, [isOpen, initialProfile, currentUser]);

  if (!isOpen) return null;

  // Options definitions matching exact user prompt
  const GOAL_OPTIONS = [
    { id: 'être plus actif', label: 'Être plus actif', desc: 'Bouger davantage et rompre la sédentarité' },
    { id: 'améliorer ma condition physique', label: 'Améliorer ma condition physique', desc: 'Gagner en tonus général, en souffle et en aisance' },
    { id: 'renforcer mon corps', label: 'Renforcer mon corps', desc: 'Solidifier muscles et articulations en profondeur' },
    { id: 'travailler une zone précise', label: 'Travailler une zone précise', desc: 'Cibler des groupes musculaires prioritaires' },
    { id: 'améliorer mon endurance', label: 'Améliorer mon endurance', desc: 'Développer ma résistance cardiovasculaire' },
    { id: 'améliorer ma mobilité', label: 'Améliorer ma mobilité', desc: 'Gagner en souplesse et fluidité articulaire' },
    { id: 'créer une routine', label: 'Créer une routine', desc: 'Ancrer une habitude sportive régulière' },
    { id: 'suivre un programme', label: 'Suivre un programme', desc: 'Avoir un cap structuré semaine après semaine' },
  ];

  const DURATION_OPTIONS = [
    { id: '5 min', label: '5 min', desc: 'Micro-séance express pour réveiller le corps' },
    { id: '10 min', label: '10 min', desc: 'Pause active tonique et rapide' },
    { id: '15 min', label: '15 min', desc: 'Format équilibré pour routine quotidienne' },
    { id: '20 min', label: '20 min', desc: 'Séance complète et stimulante' },
    { id: '30 min', label: '30 min', desc: 'Format standard : séries, travail & récupération' },
    { id: '45 min', label: '45 min', desc: 'Immersion sportive approfondie' },
    { id: '60 min ou plus', label: '60 min ou plus', desc: 'Entraînement complet athlétique' },
  ];

  const FREQUENCY_OPTIONS = [
    { id: '1 jour/semaine', label: '1 jour / semaine', desc: 'Démarrage en douceur sans contrainte' },
    { id: '2 jours/semaine', label: '2 jours / semaine', desc: 'Maintien de base' },
    { id: '3 jours/semaine', label: '3 jours / semaine', desc: 'La fréquence idéale recommandée pour progresser' },
    { id: '4 jours/semaine', label: '4 jours / semaine', desc: 'Rythme sportif soutenu' },
    { id: '5 jours/semaine', label: '5 jours / semaine', desc: 'Progression rapide' },
    { id: '6 jours/semaine', label: '6 jours / semaine', desc: 'Engagement athlétique poussé' },
    { id: '7 jours/semaine', label: '7 jours / semaine', desc: 'Discipline quotidienne & mouvement constant' },
  ];

  const EQUIPMENT_OPTIONS = [
    { id: 'aucun', label: 'Aucun', desc: '100% au poids du corps' },
    { id: 'tapis', label: 'Tapis', desc: 'Confort au sol et gainage' },
    { id: 'chaise', label: 'Chaise', desc: 'Dips, fentes surélevées' },
    { id: 'élastique', label: 'Élastique', desc: 'Résistance progressive' },
    { id: 'haltères', label: 'Haltères', desc: 'Charges libres' },
    { id: 'plusieurs équipements', label: 'Plusieurs équipements', desc: 'Espace fitness ou matériel varié' },
    { id: 'autre', label: 'Autre', desc: 'Autre équipement disponible' },
  ];

  const AGE_GROUPS = ['Moins de 18 ans', '18 - 25 ans', '26 - 35 ans', '36 - 45 ans', '46 - 55 ans', '56 ans et plus'];

  // Toggle helpers
  const toggleBodyPart = (cat: EnergieCategory) => {
    setFormData((prev) => {
      if (cat === 'corps-complet') {
        return { ...prev, bodyParts: ['corps-complet'] };
      }
      const filtered = prev.bodyParts.filter((p) => p !== 'corps-complet');
      const exists = filtered.includes(cat);
      const updated = exists ? filtered.filter((p) => p !== cat) : [...filtered, cat];
      return { ...prev, bodyParts: updated.length === 0 ? ['corps-complet'] : updated };
    });
  };

  const toggleGoal = (goalId: string) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goalId);
      const updated = exists ? prev.goals.filter((g) => g !== goalId) : [...prev.goals, goalId];
      return { ...prev, goals: updated.length === 0 ? [goalId] : updated };
    });
  };

  const toggleEquipment = (eqId: string) => {
    setFormData((prev) => {
      if (eqId === 'aucun') {
        return { ...prev, equipment: ['aucun'] };
      }
      const filtered = prev.equipment.filter((e) => e !== 'aucun');
      const exists = filtered.includes(eqId);
      const updated = exists ? filtered.filter((e) => e !== eqId) : [...filtered, eqId];
      return { ...prev, equipment: updated.length === 0 ? ['aucun'] : updated };
    });
  };

  // Step validation
  const canContinue = (): boolean => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return Boolean(formData.level);
      case 3:
        return formData.bodyParts.length > 0;
      case 4:
        return formData.goals.length > 0;
      case 5:
        return Boolean(formData.duration);
      case 6:
        return formData.equipment.length > 0;
      case 7:
        return Boolean(formData.frequency);
      case 8:
        return true; // Optional limitations question
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canContinue()) return;
    if (step < 9) setStep((s) => s + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleFinish = async () => {
    setIsSaving(true);
    setSaveError(null);

    const now = new Date().toISOString();
    const finalizedProfile: UserFitnessProfile = {
      level: (formData.level as EnergieDifficulty) || 'débutant',
      bodyParts: formData.bodyParts,
      goals: formData.goals,
      duration: formData.duration,
      frequency: formData.frequency,
      equipment: formData.equipment,
      limitations: formData.limitations?.trim() || undefined,
      onboardingCompleted: true,
      completedAt: now,
      updatedAt: now,
      name: formData.name,
      ageGroup: formData.ageGroup,
    };

    try {
      await saveFitnessProfile(currentUser?.uid, finalizedProfile);
      onComplete(finalizedProfile);
      onClose();
    } catch (err) {
      console.warn('[Questionnaire] Error saving:', err);
      // Fallback
      onComplete(finalizedProfile);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const isQuestionStep = step >= 1 && step <= 8;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto transition-colors">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-sm shadow-orange-500/20">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block">
                OREA ÉNERGIE
              </span>
              <h2 className="text-sm font-extrabold text-[#0f2347] dark:text-white">
                {step === 0
                  ? 'Préparons votre expérience ÉNERGIE 💪'
                  : step === 9
                  ? 'Votre espace ÉNERGIE est prêt.'
                  : 'Personnalisation sportive'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {isQuestionStep && (
          <div className="px-6 pt-3 pb-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-orange-600 dark:text-orange-400">
                Étape {step} / 8
              </span>
              <span className="text-slate-400 font-medium">
                {Math.round((step / 8) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${(step / 8) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[72vh] overflow-y-auto">
          {/* STEP 0: Welcome Screen */}
          {step === 0 && (
            <div className="text-center py-4 space-y-6">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-xl shadow-orange-500/25">
                <span className="text-4xl">💪</span>
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-2xl sm:text-3xl font-black text-[#0f2347] dark:text-white tracking-tight">
                  Préparons votre expérience ÉNERGIE 💪
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Quelques questions pour mieux adapter vos entraînements à votre profil et à vos objectifs.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
                >
                  <span>Commencer la personnalisation</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Profil personnel */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase">Étape 1 / 8</span>
                <h3 className="text-xl font-black text-[#0f2347] dark:text-white mt-1">
                  Confirmez votre identité sportive
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Informations de base pour personnaliser votre suivi et vos encouragements.
                </p>
              </div>

              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Prénom ou pseudo :
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm font-bold text-[#0f2347] dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Votre prénom"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tranche d'âge :
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AGE_GROUPS.map((ag) => (
                      <button
                        key={ag}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, ageGroup: ag }))}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          formData.ageGroup === ag
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {ag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Niveau (Exact 7 levels per Rule #6) */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase">Étape 2 / 8</span>
                <h3 className="text-xl font-black text-[#0f2347] dark:text-white mt-1">
                  Quel est votre niveau actuel ?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choisissez le niveau qui correspond fidèlement à votre capacité d'effort.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {ENERGIE_DIFFICULTIES_LIST.map((item) => {
                  const isSelected = formData.level === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, level: item.id }))}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/30 text-orange-950 dark:text-orange-100 ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:border-orange-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <span className="font-extrabold text-sm block">{item.label}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                          isSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Zones du corps (Exact 10 categories per Rule #7) */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase">Étape 3 / 8</span>
                <h3 className="text-xl font-black text-[#0f2347] dark:text-white mt-1">
                  Quelle zone souhaitez-vous principalement travailler ?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sélectionnez vos zones d'intérêt (sélectionnez une ou plusieurs).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 pt-1">
                {ENERGIE_CATEGORIES_LIST.map((item) => {
                  const isSelected = formData.bodyParts.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleBodyPart(item.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/30 text-orange-950 dark:text-orange-100 ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:border-orange-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl">{item.icon}</span>
                        <div className="min-w-0">
                          <span className="font-extrabold text-sm block truncate">{item.label}</span>
                          <span className="text-[10px] text-slate-500 block truncate">{item.muscles}</span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-1 ${
                          isSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Objectifs (Multiple selection allowed per Rule #8) */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase">Étape 4 / 8</span>
                <h3 className="text-xl font-black text-[#0f2347] dark:text-white mt-1">
                  Quel est votre objectif ?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vous pouvez cocher plusieurs objectifs complémentaires.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {GOAL_OPTIONS.map((item) => {
                  const isSelected = formData.goals.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleGoal(item.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/30 text-orange-950 dark:text-orange-100 ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:border-orange-200'
                      }`}
                    >
                      <div className="pr-2">
                        <span className="font-extrabold text-xs block">{item.label}</span>
                        <span className="text-[10px] text-slate-500 block line-clamp-1">{item.desc}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Durée disponible (Exact 7 choices per Rule #9) */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase">Étape 5 / 8</span>
                <h3 className="text-xl font-black text-[#0f2347] dark:text-white mt-1">
                  Combien de temps pouvez-vous consacrer à une séance ?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  La régularité est plus puissante que les sessions isolées trop longues.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {DURATION_OPTIONS.map((item) => {
                  const isSelected = formData.duration === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, duration: item.id }))}
                      className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-950 dark:text-orange-100 ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:border-orange-200'
                      }`}
                    >
                      <div>
                        <span className="font-extrabold text-sm block">{item.label}</span>
                        <span className="text-[11px] text-slate-500 block">{item.desc}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Matériel (Multiple choices per Rule #11) */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase">Étape 6 / 8</span>
                <h3 className="text-xl font-black text-[#0f2347] dark:text-white mt-1">
                  Quel matériel avez-vous ?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vous pouvez cocher plusieurs équipements. Aucun matériel n'est obligatoire !
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {EQUIPMENT_OPTIONS.map((item) => {
                  const isSelected = formData.equipment.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleEquipment(item.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-950 dark:text-orange-100 ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:border-orange-200'
                      }`}
                    >
                      <div>
                        <span className="font-extrabold text-xs block">{item.label}</span>
                        <span className="text-[10px] text-slate-500 block">{item.desc}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-1 ${
                          isSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: Fréquence (Exact 7 choices per Rule #10) */}
          {step === 7 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase">Étape 7 / 8</span>
                <h3 className="text-xl font-black text-[#0f2347] dark:text-white mt-1">
                  Combien de jours par semaine souhaitez-vous vous entraîner ?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fixez un objectif soutenable. 3 jours par semaine est la référence pour progresser.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {FREQUENCY_OPTIONS.map((item) => {
                  const isSelected = formData.frequency === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, frequency: item.id }))}
                      className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-950 dark:text-orange-100 ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:border-orange-200'
                      }`}
                    >
                      <div>
                        <span className="font-extrabold text-xs block">{item.label}</span>
                        <span className="text-[10px] text-slate-500 block">{item.desc}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 8: Limitation / contrainte facultative (Rule #5) */}
          {step === 8 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase">Étape 8 / 8 (Facultatif)</span>
                <h3 className="text-xl font-black text-[#0f2347] dark:text-white mt-1">
                  Y a-t-il une contrainte ou une limitation que vous souhaitez signaler ?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Indiquez vos éventuelles sensibilités articulaires, douleurs ou préférences d'exercice.
                </p>
              </div>

              {/* Medical Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Avertissement bien-être OREA :</strong> Cette information sert à adapter le rythme et éviter les mouvements contre-indiqués. OREA ne pose aucun diagnostic médical. En cas de douleur persistante, consultez un professionnel de santé.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Vos remarques libres (facultatif) :
                </label>
                <textarea
                  rows={4}
                  value={formData.limitations || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, limitations: e.target.value }))}
                  placeholder="Ex : Douleur lombaire légère, éviter les sauts violents en appartement, reprise après entorse de cheville..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sm text-[#0f2347] dark:text-white focus:ring-2 focus:ring-orange-500 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {/* STEP 9: Final Screen (Rule #12) */}
          {step === 9 && (
            <div className="text-center py-2 space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/25">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-2xl font-black text-[#0f2347] dark:text-white tracking-tight">
                  Votre espace ÉNERGIE est prêt.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Vos préférences vont être utilisées pour personnaliser vos exercices et vos séances.
                </p>
              </div>

              {/* Recap Card */}
              <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left space-y-3 max-w-md mx-auto text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Niveau</span>
                    <span className="font-extrabold text-[#0f2347] dark:text-white capitalize mt-0.5 block">
                      {formData.level}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Durée</span>
                    <span className="font-extrabold text-[#0f2347] dark:text-white mt-0.5 block">
                      {formData.duration}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Zones & Matériel</span>
                  <span className="font-bold text-[#0f2347] dark:text-white mt-0.5 block">
                    {formData.bodyParts.join(', ')} • Matériel : {formData.equipment.join(', ')}
                  </span>
                </div>
              </div>

              {saveError && (
                <div className="p-3 rounded-2xl bg-red-50 text-red-700 text-xs">
                  {saveError}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isSaving}
                  className="w-full sm:w-auto min-w-[260px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm shadow-xl shadow-orange-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <span>Commencer</span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step > 0 && step < 9 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90">
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canContinue()}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                canContinue()
                  ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-600/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>{step === 8 ? 'Finaliser' : 'Continuer'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
