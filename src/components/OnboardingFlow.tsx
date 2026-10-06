import React, { useState } from 'react';
import {
  Sparkles,
  HeartPulse,
  Activity,
  Apple,
  Brain,
  GraduationCap,
  Target,
  Clock,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Loader2,
} from 'lucide-react';
import { OREALogo } from './OREALogo';
import { OnboardingResponses, OreaUserProfile } from '../types';
import { saveUserOnboarding } from '../lib/firebase';

interface OnboardingFlowProps {
  userProfile: OreaUserProfile;
  onComplete: (responses: OnboardingResponses) => void;
  onSkip?: () => void;
}

const MAIN_GOALS = [
  { id: 'sante', label: 'Améliorer ma santé', desc: 'Prévention, hydratation, suivi et bien-être quotidien' },
  { id: 'forme', label: 'Améliorer ma forme physique', desc: 'Entraînement régulier, renforcement, mobilité' },
  { id: 'apprendre', label: 'Mieux apprendre & mémoriser', desc: 'Concentration, techniques de révision, mémoire active' },
  { id: 'organiser', label: 'Mieux m’organiser', desc: 'Planner, discipline des habitudes, clarté mentale' },
  { id: 'etudes', label: 'Réussir mes études', desc: 'Orientation, préparation aux examens, BAC & filières' },
  { id: 'carriere', label: 'Préparer mon avenir professionnel', desc: 'Compétences concrètes, gestion, insertion pro' },
  { id: 'projet', label: 'Développer un projet', desc: 'Planification, budget, rigueur et persévérance' },
  { id: 'equilibre', label: 'Équilibrer tous les aspects de ma vie', desc: 'Harmonie corps, esprit, relations et ambitions' },
];

const DOMAINS = [
  { id: 'sante', label: 'Santé & Prévention', icon: HeartPulse, color: 'text-blue-600 bg-blue-50' },
  { id: 'sport', label: 'Sport & Fitness', icon: Activity, color: 'text-orange-600 bg-orange-50' },
  { id: 'nutrition', label: 'Nutrition & Équilibre', icon: Apple, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'esprit', label: 'Esprit & Savoirs', icon: Brain, color: 'text-indigo-600 bg-indigo-50' },
  { id: 'orientation', label: 'Études & BAC G2', icon: GraduationCap, color: 'text-amber-600 bg-amber-50' },
  { id: 'planner', label: 'Organisation & Planner', icon: Target, color: 'text-cyan-600 bg-cyan-50' },
  { id: 'sommeil', label: 'Sommeil & Récupération', icon: Clock, color: 'text-purple-600 bg-purple-50' },
  { id: 'finance', label: 'Finance personnelle', icon: Briefcase, color: 'text-emerald-700 bg-emerald-50' },
];

const DAILY_TIMES = [
  { id: '10min', label: '10 minutes par jour', detail: 'Idéal pour démarrer en douceur et ancrer une routine' },
  { id: '20min', label: '20 minutes par jour', detail: 'Équilibre parfait pour la forme et la concentration' },
  { id: '30min', label: '30 minutes par jour', detail: 'Recommandé pour un impact mesurable chaque semaine' },
  { id: '1h', label: '1 heure par jour', detail: 'Immersion soutenue pour de grandes ambitions d’études ou sport' },
  { id: 'plus', label: 'Plus d’une heure par jour', detail: 'Préparation intensive d’examens ou transition majeure' },
];

const SITUATIONS = [
  { id: 'college_lycee', label: 'Collège / Lycée général', desc: 'Scolarité secondaire' },
  { id: 'bac_g2', label: 'BAC G2 (Gestion / Comptabilité / Commerce)', desc: 'Filière technique de référence' },
  { id: 'autre_bac', label: 'Autre BAC (Série A, C, D, TI, etc.)', desc: 'Baccalauréat général ou technique' },
  { id: 'universite', label: 'Études supérieures / Université', desc: 'Licence, Master, Grandes écoles' },
  { id: 'pro', label: 'Professionnel en activité', desc: 'Salarié, cadre ou artisan' },
  { id: 'entrepreneur', label: 'Entrepreneur / Porteur de projet', desc: 'Création ou développement d’entreprise' },
  { id: 'reconversion', label: 'En reconversion ou recherche d’emploi', desc: 'Nouvelles perspectives d’avenir' },
  { id: 'autre', label: 'Autre situation', desc: 'Parcours personnalisé' },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  userProfile,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  const [mainGoal, setMainGoal] = useState<string>('equilibre');
  const [focusAreas, setFocusAreas] = useState<string[]>(['sante', 'sport', 'esprit']);
  const [dailyTime, setDailyTime] = useState<string>('20min');
  const [situation, setSituation] = useState<string>('bac_g2');
  const [saving, setSaving] = useState<boolean>(false);

  const toggleFocusArea = (id: string) => {
    setFocusAreas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    setSaving(true);
    const responses: OnboardingResponses = {
      mainGoal,
      focusAreas: focusAreas.length > 0 ? focusAreas : ['sante', 'sport'],
      dailyTime,
      situation,
    };

    try {
      if (userProfile.uid) {
        await saveUserOnboarding(userProfile.uid, responses);
      }
    } catch (err) {
      console.warn('[OnboardingFlow] Sauvegarde Firestore avertissement:', err);
    } finally {
      setSaving(false);
      onComplete(responses);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-[28px] border border-[#cfe2f5] p-6 sm:p-10 max-w-2xl w-full shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <OREALogo variant="compact" size="small" showTagline={false} />
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-xs font-bold text-[#0056d6] uppercase tracking-wider">
              Personnalisation OREA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">
              Étape {step} sur {totalSteps}
            </span>
            {onSkip && (
              <button
                onClick={onSkip}
                className="text-xs text-slate-400 hover:text-slate-600 underline ml-2 cursor-pointer"
              >
                Passer
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0077B6] to-[#00C49F] transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* =========================================================================
            STEP 1: OBJECTIF PRINCIPAL
        ========================================================================= */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#07111F]">
                Bienvenue dans OREA, {userProfile.firstName || userProfile.displayName} 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Quel est votre objectif prioritaire en ce moment ?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {MAIN_GOALS.map((item) => {
                const isSelected = mainGoal === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMainGoal(item.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0056d6] bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <p className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#0056d6]' : 'text-slate-800'}`}>
                        {item.label}
                      </p>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0056d6] shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: DOMAINES SOUHAITÉS
        ========================================================================= */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#07111F]">
                Quels domaines souhaitez-vous suivre ?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Sélectionnez un ou plusieurs univers pour personnaliser votre tableau personnel.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {DOMAINS.map((item) => {
                const isSelected = focusAreas.includes(item.id);
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleFocusArea(item.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'border-[#0056d6] bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#0056d6]' : 'text-slate-800'}`}>
                        {item.label}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                        isSelected ? 'bg-[#0056d6] border-[#0056d6] text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: TEMPS QUOTIDIEN
        ========================================================================= */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#07111F]">
                Combien de temps pouvez-vous consacrer à votre évolution ?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Un engagement réaliste chaque jour vaut mieux qu’une longue séance occasionnelle.
              </p>
            </div>

            <div className="space-y-2.5">
              {DAILY_TIMES.map((item) => {
                const isSelected = dailyTime === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDailyTime(item.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#0056d6] bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div>
                      <p className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#0056d6]' : 'text-slate-800'}`}>
                        {item.label}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.detail}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0056d6] shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: NIVEAU D'ÉTUDES / SITUATION ACTUELLE
        ========================================================================= */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#07111F]">
                Quel est votre parcours ou votre situation actuelle ?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Cela permet à OREA d’adapter les ressources éducatives, d’orientation et de carrière.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {SITUATIONS.map((item) => {
                const isSelected = situation === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSituation(item.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0056d6] bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <p className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#0056d6]' : 'text-slate-800'}`}>
                        {item.label}
                      </p>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0056d6] shrink-0 ml-1" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0056d6] hover:bg-[#0044b2] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-700/20 transition-all cursor-pointer active:scale-[0.99]"
            >
              <span>Continuer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0077B6] via-[#00A6C7] to-[#00C49F] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-cyan-800/20 transition-all cursor-pointer active:scale-[0.99]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Personnalisation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Accéder à mon tableau OREA</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default OnboardingFlow;
