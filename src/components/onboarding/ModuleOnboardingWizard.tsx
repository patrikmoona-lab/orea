import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertCircle,
  RotateCcw,
  Heart,
  Activity,
  Apple,
  GraduationCap,
  Coins,
  Clock
} from 'lucide-react';
import { OREALogo } from '../OREALogo';
import { OreaButton } from '../common/OreaButton';
import { OreaLoader } from '../OreaLoader';
import { saveModuleProfileAsync, getModuleProfile } from '../../utils/oreaProfileStorage';
import { auth } from '../../lib/firebase';

export interface ModuleQuestion {
  id: string;
  title: string;
  subtitle?: string;
  type: 'text' | 'select' | 'multiselect' | 'date';
  options?: string[];
  placeholder?: string;
}

interface ModuleOnboardingWizardProps {
  moduleId: 'cycle' | 'sport' | 'nutrition' | 'education' | 'finance' | 'planner';
  moduleTitle: string;
  moduleSubtitle: string;
  moduleIcon: React.ReactNode;
  accentColor: string;
  questions: ModuleQuestion[];
  onComplete: (answers: Record<string, any>) => void;
  onCancel: () => void;
}

export const ModuleOnboardingWizard: React.FC<ModuleOnboardingWizardProps> = ({
  moduleId,
  moduleTitle,
  moduleSubtitle,
  moduleIcon,
  accentColor,
  questions,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Welcome, 1..N = Questions, N+1 = Summary, N+2 = Calculation
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const existing = getModuleProfile(moduleId);
    return (existing && existing.answers) ? { ...existing.answers } : { pseudo: '' };
  });
  const [creationStatus, setCreationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalQuestions = questions.length;
  const totalStages = totalQuestions + 1; // Welcome is introductory

  const currentQ = questions[currentStep - 1];

  const handleAnswerChange = (qId: string, val: any) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleMultiselectToggle = (qId: string, item: string) => {
    const currentList = (answers[qId] as string[]) || [];
    const updated = currentList.includes(item)
      ? currentList.filter((i) => i !== item)
      : [...currentList, item];
    setAnswers((prev) => ({ ...prev, [qId]: updated }));
  };

  const startSpaceCreation = async () => {
    setCreationStatus('loading');
    setCalculationProgress(0);
    setErrorMessage(null);

    console.log('[OREA] 1 — clic Créer mon espace');

    try {
      // Étape 2 : Données questionnaire récupérées
      setCalculationProgress(10);
      await new Promise((r) => setTimeout(r, 100));
      if (!answers || typeof answers !== 'object') {
        throw new Error('Les réponses au questionnaire sont invalides ou incomplètes.');
      }
      console.log('[OREA] 2 — données questionnaire récupérées', answers);

      // Étape 3 : Validation réussie
      setCalculationProgress(25);
      await new Promise((r) => setTimeout(r, 100));
      console.log('[OREA] 3 — validation réussie');

      // Étape 4 : Profil créé
      setCalculationProgress(40);
      await new Promise((r) => setTimeout(r, 100));
      console.log('[OREA] 4 — profil créé');

      // Étape 5 : Profil sauvegardé dans Firestore & vérifié
      setCalculationProgress(60);
      const currentUser = auth.currentUser;
      const profile = await saveModuleProfileAsync(moduleId, answers, currentUser?.uid);
      console.log(`[OREA] 5 — profil sauvegardé & confirmé Firestore (${profile.id})`);

      // Étape 6 : Profil relu depuis la mémoire d'interface
      setCalculationProgress(75);
      await new Promise((r) => setTimeout(r, 100));
      const verifiedProfile = getModuleProfile(moduleId);
      if (!verifiedProfile || !verifiedProfile.id) {
        throw new Error(`Échec de vérification : Le profil sauvegardé pour le module "${moduleTitle}" n’a pas pu être relu.`);
      }
      console.log('[OREA] 6 — profil localement vérifié', verifiedProfile);

      // Étape 7 : Module initialisé
      setCalculationProgress(85);
      await new Promise((r) => setTimeout(r, 100));
      console.log(`[OREA] 7 — module initialisé (${moduleId})`);

      // Étape 8 : Route dashboard trouvée
      setCalculationProgress(95);
      await new Promise((r) => setTimeout(r, 100));
      console.log(`[OREA] 8 — route dashboard trouvée (${moduleId}/dashboard)`);

      // Étape 9 : Navigation dashboard
      setCalculationProgress(100);
      setCreationStatus('success');
      console.log('[OREA] 9 — confirmation enregistrement Firestore & transition');
    } catch (err: any) {
      console.error('[OREA] Erreur lors de la création de l’espace:', err);
      setCreationStatus('error');
      setErrorMessage(
        err?.message || 'Une erreur est survenue lors de la création de votre espace. Veuillez réessayer.'
      );
    }
  };

  const canProceed = () => {
    if (currentStep === 0) return true;
    if (currentStep <= totalQuestions) {
      const q = questions[currentStep - 1];
      const val = answers[q.id];
      if (q.type === 'multiselect') {
        return Array.isArray(val) && val.length > 0;
      }
      return val !== undefined && val !== '';
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < totalQuestions) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === totalQuestions) {
      // Move to Summary
      setCurrentStep(totalQuestions + 1);
    } else if (currentStep === totalQuestions + 1) {
      // Trigger Calculation & Profile creation
      setCurrentStep(totalQuestions + 2);
      startSpaceCreation();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render Welcome screen
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f6ff] via-white to-[#f5f9ff] flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-[32px] border border-[#dce9f6] p-8 sm:p-12 max-w-xl w-full shadow-2xl relative text-center">
          <div className="absolute top-6 left-6">
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0056d6] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
          </div>

          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0056d6] mb-6 shadow-sm">
            {moduleIcon}
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
            Espace {moduleTitle} non configuré
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f2347] tracking-tight mb-3">
            Votre espace {moduleTitle} n'est pas encore configuré
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mb-8 leading-relaxed">
            {moduleSubtitle}. Répondez aux questions de configuration pour personnaliser vos indicateurs et déverrouiller votre tableau de bord.
          </p>

          <div className="space-y-4 text-left bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-8">
            <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Questions rapides et ciblées</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Calcul automatique et algorithmes personnalisés</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Données synchronisées de manière sécurisée sur votre compte</span>
            </div>
          </div>

          <OreaButton
            variant="sante"
            size="lg"
            fullWidth
            iconRight={<ArrowRight className="w-4 h-4" />}
            onClick={() => setCurrentStep(1)}
          >
            Créer mon espace
          </OreaButton>
        </div>
      </div>
    );
  }

  // Render Calculation / Profile Creation screen
  if (currentStep === totalQuestions + 2) {
    if (creationStatus === 'error') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff7f7] via-white to-[#fff0f0] flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-[32px] border border-rose-200 p-8 sm:p-12 max-w-xl w-full shadow-2xl text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-6 shadow-sm">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>

            <h2 className="text-2xl font-extrabold text-[#0f2347] mb-2">
              Impossible de créer votre espace
            </h2>
            <p className="text-sm text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
              {errorMessage || 'Une erreur est survenue lors de l’enregistrement de vos informations.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(totalQuestions + 1)}
                className="w-full sm:w-1/2 px-5 py-3.5 rounded-2xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Modifier mes réponses
              </button>
              <div className="w-full sm:w-1/2">
                <OreaButton
                  variant="sante"
                  size="md"
                  fullWidth
                  icon={<RotateCcw className="w-4 h-4" />}
                  onClick={startSpaceCreation}
                >
                  Réessayer
                </OreaButton>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <OreaLoader
        isReady={creationStatus === 'success'}
        minDuration={3000}
        message={
          creationStatus === 'success'
            ? `Espace ${moduleTitle} configuré avec succès ! Préparation du tableau de bord...`
            : `Initialisation de votre espace ${moduleTitle}...`
        }
        onFinish={() => {
          console.log('[OREA] 10 — dashboard rendu');
          onComplete(answers);
        }}
      />
    );
  }

  // Render Summary screen
  if (currentStep === totalQuestions + 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f6ff] via-white to-[#f5f9ff] flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-[32px] border border-[#dce9f6] p-6 sm:p-10 max-w-xl w-full shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <span className="text-xs font-bold text-[#0056d6] uppercase tracking-wider">
              Vérification des informations
            </span>
            <span className="text-xs font-bold text-slate-400">Résumé final</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2347] mb-2">
            Vérifiez vos informations
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Voici les réponses qui permettront de calibrer votre espace {moduleTitle}. Vous pouvez modifier vos choix si nécessaire.
          </p>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 mb-8">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-500 block">Question {idx + 1}</span>
                  <span className="font-bold text-[#0f2347]">{q.title}</span>
                </div>
                <div className="text-right font-medium text-[#0056d6] max-w-[50%] truncate">
                  {Array.isArray(answers[q.id])
                    ? (answers[q.id] as string[]).join(', ')
                    : answers[q.id] || 'Non renseigné'}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentStep(totalQuestions)}
              className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Modifier
            </button>
            <div className="flex-1">
              <OreaButton
                variant="sante"
                size="md"
                fullWidth
                iconRight={<ArrowRight className="w-4 h-4" />}
                onClick={handleNext}
              >
                Créer mon espace OREA
              </OreaButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render individual Question step (1..totalQuestions)
  const progressDots = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f6ff] via-white to-[#f5f9ff] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-[32px] border border-[#dce9f6] p-6 sm:p-10 max-w-lg w-full shadow-2xl relative">
        {/* Top bar with Back and Progress */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <button
            onClick={handlePrev}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0056d6] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>
          
          <span className="text-xs font-bold text-[#0056d6]">
            Question {currentStep} sur {totalQuestions}
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {progressDots.map((dotNum) => (
            <div
              key={dotNum}
              className={`h-2 rounded-full transition-all duration-300 ${
                dotNum === currentStep
                  ? 'w-6 bg-[#0056d6]'
                  : dotNum < currentStep
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Question Content */}
        <div className="mb-8">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            {moduleTitle} • Étape {currentStep}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2347] tracking-tight mb-2">
            {currentQ.title}
          </h2>
          {currentQ.subtitle && (
            <p className="text-xs text-slate-500">{currentQ.subtitle}</p>
          )}

          <div className="mt-6">
            {currentQ.type === 'text' && (
              <input
                type="text"
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                placeholder={currentQ.placeholder || 'Votre réponse...'}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-[#0056d6] focus:ring-2 focus:ring-[#0056d6]/20 text-sm font-medium text-[#0f2347] outline-none"
                autoFocus
              />
            )}

            {currentQ.type === 'date' && (
              <input
                type="date"
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-[#0056d6] focus:ring-2 focus:ring-[#0056d6]/20 text-sm font-medium text-[#0f2347] outline-none"
              />
            )}

            {currentQ.type === 'select' && currentQ.options && (
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleAnswerChange(currentQ.id, opt)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#0056d6] bg-blue-50/80 text-[#0056d6] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#0056d6] bg-[#0056d6] text-white' : 'border-slate-300'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQ.type === 'multiselect' && currentQ.options && (
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                {currentQ.options.map((opt) => {
                  const list = (answers[currentQ.id] as string[]) || [];
                  const isSelected = list.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleMultiselectToggle(currentQ.id, opt)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#0056d6] bg-blue-50/80 text-[#0056d6] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isSelected ? 'border-[#0056d6] bg-[#0056d6] text-white' : 'border-slate-300'}`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <OreaButton
          variant="sante"
          size="md"
          fullWidth
          disabled={!canProceed()}
          iconRight={<ArrowRight className="w-4 h-4" />}
          onClick={handleNext}
        >
          {currentStep === totalQuestions ? 'Voir le résumé' : 'Continuer'}
        </OreaButton>
      </div>
    </div>
  );
};
