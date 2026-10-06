import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  PhoneCall,
  ShieldAlert,
  Clock,
  HeartPulse,
  Thermometer,
  Brain,
  Wind,
  Stethoscope,
  Info,
} from 'lucide-react';
import { OreaButton } from './common/OreaButton';

interface SymptomCheckerState {
  mainSymptom: string;
  location: string;
  duration: string;
  intensity: number; // 1 to 10
  associatedSigns: string[];
}

const MAIN_SYMPTOMS = [
  { id: 'fever', label: 'Fièvre ou frissons', icon: Thermometer, commonLocations: ['Corps entier', 'Tête'] },
  { id: 'headache', label: 'Maux de tête / Céphalées', icon: Brain, commonLocations: ['Front', 'Températures', 'Arrière du crâne', 'Côté gauche/droit'] },
  { id: 'chest_pain', label: 'Douleur ou gêne thoracique', icon: HeartPulse, commonLocations: ['Milieu de la poitrine', 'Côté gauche', 'Irradiant au bras'] },
  { id: 'stomach', label: 'Douleur abdominale / Ventre', icon: Activity, commonLocations: ['Bas ventre', 'Creux de l’estomac', 'Côté droit', 'Côté gauche'] },
  { id: 'breathing', label: 'Essoufflement / Toux / Gêne respiratoire', icon: Wind, commonLocations: ['Poumons / Gorge', 'Trachée'] },
  { id: 'fatigue', label: 'Fatigue intense ou vertiges', icon: Activity, commonLocations: ['Corps entier', 'Tête'] },
];

const DURATION_OPTIONS = [
  { id: 'hours', label: 'Depuis quelques heures (< 12h)' },
  { id: 'days_1_3', label: 'Depuis 1 à 3 jours' },
  { id: 'week', label: 'Depuis 4 à 7 jours' },
  { id: 'chronic', label: 'Depuis plus d’une semaine / Récurrent' },
];

const CRITICAL_WARNING_SIGNS = [
  { id: 'loss_consciousness', label: 'Perte de connaissance ou confusion mentale' },
  { id: 'chest_radiation', label: 'Douleur à la poitrine irradiant au bras gauche ou à la mâchoire' },
  { id: 'breathing_distress', label: 'Difficulté majeure à respirer (incapacité à parler)' },
  { id: 'stiff_neck', label: 'Nuque très raide avec fièvre et intolérance à la lumière' },
  { id: 'bleeding', label: 'Saignements abondants ou vomissements noirs / sang' },
  { id: 'paralysis', label: 'Faiblesse brutale d’un bras ou déviation de la bouche' },
];

const MILD_ASSOCIATED_SIGNS = [
  { id: 'mild_nausea', label: 'Légère nausée ou manque d’appétit' },
  { id: 'runny_nose', label: 'Nez qui coule ou éternuements' },
  { id: 'muscle_aches', label: 'Courbatures musculaires' },
  { id: 'mild_cough', label: 'Petite toux sèche' },
];

interface OreaSymptomCheckerViewProps {
  onNavigateToUrgence?: () => void;
}

export const OreaSymptomCheckerView: React.FC<OreaSymptomCheckerViewProps> = ({
  onNavigateToUrgence,
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<SymptomCheckerState>({
    mainSymptom: '',
    location: '',
    duration: '',
    intensity: 4,
    associatedSigns: [],
  });

  const handleSelectSymptom = (sym: string) => {
    setFormData((prev) => ({ ...prev, mainSymptom: sym, location: '' }));
    setStep(2);
  };

  const handleSelectDuration = (dur: string) => {
    setFormData((prev) => ({ ...prev, duration: dur }));
    setStep(3);
  };

  const toggleSign = (id: string) => {
    setFormData((prev) => {
      const exists = prev.associatedSigns.includes(id);
      return {
        ...prev,
        associatedSigns: exists
          ? prev.associatedSigns.filter((s) => s !== id)
          : [...prev.associatedSigns, id],
      };
    });
  };

  const resetAll = () => {
    setFormData({
      mainSymptom: '',
      location: '',
      duration: '',
      intensity: 4,
      associatedSigns: [],
    });
    setStep(1);
  };

  // Compute orientation severity
  const getOrientationResult = () => {
    const hasCriticalSign = formData.associatedSigns.some((s) =>
      CRITICAL_WARNING_SIGNS.some((c) => c.id === s)
    );
    const isHighIntensity = formData.intensity >= 8;
    const isChestPain = formData.mainSymptom === 'chest_pain';

    if (hasCriticalSign || (isChestPain && isHighIntensity)) {
      return {
        level: 'URGENCE_VITALE',
        title: '🚨 Urgence Médicale Immédiate',
        badge: 'Prise en charge vitale',
        color: 'bg-red-600 text-white',
        border: 'border-red-500',
        bgBox: 'bg-red-50 text-red-950',
        description:
          'Les signes décrits présentent un caractère d’urgence absolue. Ne prenez pas le volant vous-même et ne retardez pas l’appel aux secours.',
        recommendation:
          'Appelez immédiatement les urgences (SAMU / Pompiers / Numéros d’urgence locaux). Restez au repos complet.',
      };
    }

    if (formData.intensity >= 6 || formData.duration === 'chronic' || isChestPain) {
      return {
        level: 'CONSULTATION_RAPIDE',
        title: '⚠️ Consultation Médicale Rapide (Sous 24h)',
        badge: 'Avis médical sous 24h',
        color: 'bg-amber-600 text-white',
        border: 'border-amber-400',
        bgBox: 'bg-amber-50 text-amber-950',
        description:
          'Vos symptômes nécessitent une évaluation par un médecin généraliste ou un service de garde sans attendre l’aggravation.',
        recommendation:
          'Consultez un centre de santé ou votre médecin traitant aujourd’hui. Surveillez attentivement l’apparition de fièvre élevée ou de gêne respiratoire.',
      };
    }

    if (formData.intensity >= 4 || formData.duration === 'days_1_3') {
      return {
        level: 'CONSULTATION_ORDINAIRE',
        title: '🩺 Consultation Médicale Ordinaire',
        badge: 'Rendez-vous standard',
        color: 'bg-blue-600 text-white',
        border: 'border-blue-400',
        bgBox: 'bg-blue-50 text-blue-950',
        description:
          'Un rendez-vous médical dans les jours à venir permettra d’établir un diagnostic précis et un traitement adapté.',
        recommendation:
          'Prenez rendez-vous avec un médecin. Reposez-vous, hydratez-vous abondamment et évitez l’automédication non contrôlée.',
      };
    }

    return {
      level: 'SURVEILLANCE_BIENVEILLANTE',
      title: '💡 Surveillance & Gestes d’Auto-soin',
      badge: 'Surveillance à domicile',
      color: 'bg-emerald-600 text-white',
      border: 'border-emerald-400',
      bgBox: 'bg-emerald-50 text-emerald-950',
      description:
        'L’intensité modérée et l’absence de signes de gravité suggèrent une affection bénigne nécessitant repos et hydratation.',
      recommendation:
        'Hydratez-vous (eau, bouillons légers), accordez-vous du repos. Si les symptômes persistent au-delà de 3 jours ou s’intensifient, consultez un praticien.',
    };
  };

  const selectedSymptomObj = MAIN_SYMPTOMS.find((s) => s.id === formData.mainSymptom);

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056d6] text-xs font-black uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Guide Interactif d’Orientation Médicale</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2F5B] tracking-tight">
            Vérificateur de Symptômes OREA
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Un parcours guidé étape par étape pour identifier le degré de gravité et adopter le bon réflexe médical.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${step >= 1 ? 'bg-[#0056d6]' : 'bg-slate-300'}`}>1</span>
            <span className={step === 1 ? 'text-[#0056d6]' : ''}>Symptôme</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${step >= 2 ? 'bg-[#0056d6]' : 'bg-slate-300'}`}>2</span>
            <span className={step === 2 ? 'text-[#0056d6]' : ''}>Durée & Localisation</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${step >= 3 ? 'bg-[#0056d6]' : 'bg-slate-300'}`}>3</span>
            <span className={step === 3 ? 'text-[#0056d6]' : ''}>Intensité & Signes</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${step >= 4 ? 'bg-[#0056d6]' : 'bg-slate-300'}`}>4</span>
            <span className={step === 4 ? 'text-[#0056d6]' : ''}>Orientation</span>
          </div>
        </div>

        {/* STEP 1: Main Symptom Selection */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Étape 1 : Quel est votre symptôme principal ?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MAIN_SYMPTOMS.map((sym) => {
                const Icon = sym.icon;
                return (
                  <button
                    key={sym.id}
                    onClick={() => handleSelectSymptom(sym.id)}
                    className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0056d6] group-hover:bg-[#0056d6] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{sym.label}</div>
                      <div className="text-[11px] text-slate-500">Sélectionner</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Location & Duration */}
        {step === 2 && selectedSymptomObj && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>
              <span className="text-xs font-bold text-[#0056d6]">{selectedSymptomObj.label}</span>
            </div>

            {/* Location selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Localisation la plus précise
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedSymptomObj.commonLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setFormData((prev) => ({ ...prev, location: loc }))}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      formData.location === loc
                        ? 'bg-[#0B2F5B] text-white border-[#0B2F5B]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Depuis combien de temps ce symptôme est-il présent ?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DURATION_OPTIONS.map((dur) => (
                  <button
                    key={dur.id}
                    onClick={() => handleSelectDuration(dur.id)}
                    className={`p-3.5 rounded-2xl text-xs font-bold border text-left transition-all cursor-pointer ${
                      formData.duration === dur.id
                        ? 'bg-[#0056d6] text-white border-[#0056d6]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Intensity & Associated Signs */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>
              <span className="text-xs font-bold text-[#0056d6]">Évaluation de la sévérité</span>
            </div>

            {/* Intensity Slider 1-10 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Intensité de la douleur ou de la gêne (1 à 10)
                </label>
                <span className={`px-3 py-1 rounded-full text-xs font-black ${formData.intensity >= 8 ? 'bg-red-100 text-red-700' : formData.intensity >= 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  Niveau {formData.intensity} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.intensity}
                onChange={(e) => setFormData((prev) => ({ ...prev, intensity: Number(e.target.value) }))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0056d6]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                <span>1 (Très léger)</span>
                <span>5 (Modéré)</span>
                <span>10 (Douleur insupportable)</span>
              </div>
            </div>

            {/* Critical Red Flags */}
            <div>
              <label className="block text-xs font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Présentez-vous l’un de ces signes d’alerte majeurs ?</span>
              </label>
              <div className="space-y-2">
                {CRITICAL_WARNING_SIGNS.map((sign) => {
                  const active = formData.associatedSigns.includes(sign.id);
                  return (
                    <button
                      key={sign.id}
                      onClick={() => toggleSign(sign.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-red-50 border-red-300 text-red-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-red-50/40'
                      }`}
                    >
                      <span>{sign.label}</span>
                      <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] text-white ${active ? 'bg-red-600' : 'border border-slate-300'}`}>
                        {active && '✓'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mild Signs */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Autres signes associés (facultatif)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MILD_ASSOCIATED_SIGNS.map((sign) => {
                  const active = formData.associatedSigns.includes(sign.id);
                  return (
                    <button
                      key={sign.id}
                      onClick={() => toggleSign(sign.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? 'bg-blue-50 border-blue-300 text-blue-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{sign.label}</span>
                      <span className={`w-3.5 h-3.5 rounded text-[10px] flex items-center justify-center text-white ${active ? 'bg-[#0056d6]' : 'border border-slate-300'}`}>
                        {active && '✓'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Validate step */}
            <div className="pt-3">
              <OreaButton
                variant="sante"
                size="lg"
                onClick={() => setStep(4)}
                className="w-full"
                iconRight={<ChevronRight className="w-4 h-4" />}
              >
                Calculer l’orientation médicale
              </OreaButton>
            </div>
          </div>
        )}

        {/* STEP 4: Orientation Result */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            {(() => {
              const res = getOrientationResult();
              return (
                <div className={`bg-white rounded-3xl p-6 sm:p-8 border ${res.border} shadow-lg space-y-6`}>
                  
                  {/* Top Badge & Title */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${res.color}`}>
                      {res.badge}
                    </span>
                    <button
                      onClick={resetAll}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Recommencer le test</span>
                    </button>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {res.title}
                  </h2>

                  {/* Recommendation Box */}
                  <div className={`p-5 rounded-2xl ${res.bgBox} border border-current/20 space-y-2`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Recommandation d’orientation :
                    </h4>
                    <p className="text-sm font-semibold leading-relaxed">
                      {res.recommendation}
                    </p>
                    <p className="text-xs opacity-90 leading-relaxed mt-2">
                      {res.description}
                    </p>
                  </div>

                  {/* Emergency Direct Call Button if vital */}
                  {res.level === 'URGENCE_VITALE' && onNavigateToUrgence && (
                    <div className="pt-2">
                      <button
                        onClick={onNavigateToUrgence}
                        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm transition-all shadow-md cursor-pointer"
                      >
                        <PhoneCall className="w-5 h-5 animate-bounce" />
                        <span>Accéder immédiatement aux Numéros d’Urgence 24/7</span>
                      </button>
                    </div>
                  )}

                  {/* Summary of answers */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
                    <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                      Récapitulatif de votre saisie :
                    </div>
                    <div>• Symptôme : <span className="font-semibold text-slate-800">{selectedSymptomObj?.label}</span></div>
                    {formData.location && <div>• Localisation : <span className="font-semibold text-slate-800">{formData.location}</span></div>}
                    <div>• Durée : <span className="font-semibold text-slate-800">{DURATION_OPTIONS.find((d) => d.id === formData.duration)?.label || 'Non précisée'}</span></div>
                    <div>• Intensité déclarée : <span className="font-semibold text-slate-800">{formData.intensity} / 10</span></div>
                  </div>

                </div>
              );
            })()}

            {/* Mandatory Medical Disclaimer */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#0056d6] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-[#0B2F5B]">Avertissement déontologique obligatoire : </span>
                Cet outil est un guide d’orientation préventif automatisé basé sur des recommandations médicales courantes. Il ne remplace en aucun cas une consultation médicale, un diagnostic clinique ou un examen physique par un professionnel de santé diplômé.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OreaSymptomCheckerView;
