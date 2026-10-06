import React, { useState } from 'react';
import {
  BookOpen,
  Droplets,
  Sun,
  Sparkles,
  Moon,
  ChevronRight,
  Heart,
  Coffee,
  Activity
} from 'lucide-react';
import { CyclePhase } from '../../types/cycle';

interface OreaCycleEducationViewProps {
  currentActivePhase?: CyclePhase;
}

export const OreaCycleEducationView: React.FC<OreaCycleEducationViewProps> = ({
  currentActivePhase = 'folliculaire'
}) => {
  const [selectedPhaseTab, setSelectedPhaseTab] = useState<CyclePhase>(currentActivePhase);

  const PHASES_DATA: Record<CyclePhase, {
    title: string;
    period: string;
    icon: string;
    summary: string;
    biologicalDetail: string;
    wellnessAdvice: string[];
    nutritionTips: string[];
    energySport: string;
  }> = {
    menstruelle: {
      title: 'Phase Menstruelle',
      period: 'Jours 1 à 5 en moyenne',
      icon: '🌸',
      summary: 'Renouvellement utérin et temps de repos régénérateur.',
      biologicalDetail: "Les taux d'œstrogènes et de progestérone sont à leur niveau le plus bas. L'endomètre se renouvelle naturellement. Le corps concentre son énergie sur ce processus physiologique.",
      wellnessAdvice: [
        'Appliquez une bouillotte tiède sur le bas-ventre pour apaiser les tensions musculaires.',
        'Privilégiez des nuits de sommeil complètes et accordez-vous des pauses calmes.',
        'Prenez des douches chaudes et portez des vêtements amples et confortables.'
      ],
      nutritionTips: [
        'Aliments riches en fer biodisponible (lentilles, épinards, graines, poissons).',
        'Tisanes tièdes de bissap (hibiscus) ou de gingembre doux pour le confort digestif.',
        'Hydratation abondante avec de l’eau minérale tempérée.'
      ],
      energySport: 'Niveau d’énergie généralement modéré. Privilégiez la marche lente, les étirements doux et le repos.'
    },
    folliculaire: {
      title: 'Phase Folliculaire',
      period: 'Jours 6 à 13 en moyenne',
      icon: '🌿',
      summary: 'Montée progressive des œstrogènes et regain naturel de vitalité.',
      biologicalDetail: "L'hormone folliculo-stimulante (FSH) stimule la maturation des follicules ovariens. Les œstrogènes augmentent progressivement, favorisant le renouvellement cellulaire et la clarté mentale.",
      wellnessAdvice: [
        'Période idéale pour initier de nouveaux projets et planifier vos activités clés.',
        'Profitez d’une meilleure concentration et d’une humeur naturellement positive.',
        'Prenez l’air et exposez-vous à la lumière naturelle du matin.'
      ],
      nutritionTips: [
        'Légumes frais, crudités colorées et fruits riches en vitamine C.',
        'Protéines de qualité pour accompagner le renouvellement cellulaire.',
        'Graines de courge et de lin riches en acides gras essentiels.'
      ],
      energySport: 'Énergie ascendante ! Idéal pour la reprise sportive, le renforcement musculaire et le cardio dynamique.'
    },
    ovulatoire: {
      title: 'Phase Ovulatoire',
      period: 'Jours 14 à 17 en moyenne',
      icon: '✨',
      summary: 'Pic hormonal, ovulation et vitalité maximale du cycle.',
      biologicalDetail: "Un pic d'hormone lutéinisante (LH) déclenche la libération de l'ovocyte par le follicule dominant. La température corporelle basale peut légèrement augmenter (0.3 à 0.5°C).",
      wellnessAdvice: [
        'La confiance en soi et l’aisance relationnelle sont souvent à leur point culminant.',
        'Écoutez les signaux de votre corps (légères tensions pelviennes passagères possibles).',
        'Rappel : Les dates affichées par OREA sont des estimations algorithmiques.'
      ],
      nutritionTips: [
        'Repas légers, équilibrés et digestes pour préserver la sensation de légèreté.',
        'Antioxydants naturels (baies, agrumes, légumes verts).',
        'Boire au minimum 2 litres d’eau par jour pour soutenir l’hydratation cellulaire.'
      ],
      energySport: 'Vitalité maximale ! Excellente période pour vos entraînements les plus intenses, la danse ou l’endurance.'
    },
    luteale: {
      title: 'Phase Lutéale',
      period: 'Jours 18 à 28 en moyenne',
      icon: '🌙',
      summary: 'Sécrétion de progestérone, stabilisation et transition prémenstruelle.',
      biologicalDetail: "Le corps jaune sécrète de la progestérone pour préparer l'endomètre. Si aucune fécondation n'a lieu, les taux d'hormones diminuent progressivement en fin de phase, ce qui peut occasionner certains ressentis prémenstruels.",
      wellnessAdvice: [
        'Pratiquez des exercices de respiration lente ou de cohérence cardiaque.',
        'Écoutez vos besoins de calme si la fatigue se fait ressentir en fin de cycle.',
        'Prenez des bains tièdes et évitez les surcharges de planning non essentielles.'
      ],
      nutritionTips: [
        'Aliments riches en magnésium (bananes plantain, chocolat noir >70%, graines de tournesol).',
        'Limitez l’excès de sel et de caféine pour réduire les sensations de gonflement.',
        'Tisanes relaxantes de camomille ou verveine en soirée.'
      ],
      energySport: 'Transition vers une intensité modérée. Privilégiez le yoga, le pilates, la marche active et les étirements.'
    }
  };

  const activeData = PHASES_DATA[selectedPhaseTab];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Comprendre mon cycle
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Guide pédagogique des 4 grandes phases physiologiques OREA
          </p>
        </div>
      </div>

      {/* 4 Phase Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(['menstruelle', 'folliculaire', 'ovulatoire', 'luteale'] as CyclePhase[]).map((pKey) => {
          const p = PHASES_DATA[pKey];
          const isSelected = selectedPhaseTab === pKey;
          const isCurrentActive = currentActivePhase === pKey;

          return (
            <button
              type="button"
              key={pKey}
              onClick={() => setSelectedPhaseTab(pKey)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-rose-600 dark:border-rose-500 bg-rose-50/80 dark:bg-rose-950/50 shadow-xs ring-1 ring-rose-300 dark:ring-rose-800'
                  : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{p.icon}</span>
                {isCurrentActive && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-rose-600 text-white font-extrabold">
                    Actuelle
                  </span>
                )}
              </div>
              <div className="mt-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {p.title}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {p.period.split(' ')[0]} {p.period.split(' ')[1]}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detail Content */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-4 animate-fade-in">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-xs font-bold mb-1.5">
              <span>{activeData.icon}</span>
              <span>{activeData.title}</span>
              <span className="opacity-60">• {activeData.period}</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {activeData.summary}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <strong className="text-slate-900 dark:text-white font-bold block mb-1">
            Ce qui se passe dans votre corps :
          </strong>
          {activeData.biologicalDetail}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Bien-être & rythme */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              <span>Conseils bien-être & confort</span>
            </h5>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              {activeData.wellnessAdvice.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nutrition & Énergie */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-amber-600" />
              <span>Nutrition & Tisanes OREA</span>
            </h5>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              {activeData.nutritionTips.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sport adaptation */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
          <Activity className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block mb-0.5 text-emerald-900 dark:text-emerald-100">
              Adaptation de l'activité physique :
            </strong>
            <p className="leading-relaxed">{activeData.energySport}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
