import React from 'react';
import {
  HeartPulse,
  GraduationCap,
  Activity,
  Calendar,
  Heart,
  Wallet,
  Target,
  ArrowRight,
} from 'lucide-react';
import { OreaAiAvatar } from './OreaAiAvatar';

interface ChatQuickSuggestionsProps {
  onSelectPrompt: (prompt: string, category?: string) => void;
  onNavigateSection?: (section: string) => void;
}

interface SuggestionCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  prompt: string;
  category: string;
  colorClass: string;
  badgeBg: string;
}

export const ChatQuickSuggestions: React.FC<ChatQuickSuggestionsProps> = ({
  onSelectPrompt,
}) => {
  const suggestions: SuggestionCard[] = [
    {
      id: 'sante',
      icon: <HeartPulse className="w-5 h-5 text-blue-600" />,
      title: 'Comprendre un problème de santé',
      subtitle: 'Symptômes courants, conseils d\'hygiène & triage préventif prudent.',
      prompt: 'J\'aimerais comprendre mes symptômes récents et connaître les bons réflexes d\'hygiène préventifs.',
      category: 'sante',
      colorClass: 'hover:border-blue-300 hover:bg-blue-50/40',
      badgeBg: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'bac',
      icon: <GraduationCap className="w-5 h-5 text-indigo-600" />,
      title: 'Préparer mon BAC G2',
      subtitle: 'Comptabilité SYSCOHADA révisé, fiches méthodologiques & quiz.',
      prompt: 'Je veux préparer mon BAC G2. Peux-tu m\'expliquer les points clés du plan comptable SYSCOHADA ?',
      category: 'education',
      colorClass: 'hover:border-indigo-300 hover:bg-indigo-50/40',
      badgeBg: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'sport',
      icon: <Activity className="w-5 h-5 text-orange-600" />,
      title: 'Créer un programme sportif',
      subtitle: 'Calisthenics progressif (Niveaux 1 à 6 OREA Elite) au poids du corps.',
      prompt: 'Je souhaite concevoir un programme sportif au poids du corps adapté à mon niveau physique.',
      category: 'sport',
      colorClass: 'hover:border-orange-300 hover:bg-orange-50/40',
      badgeBg: 'bg-orange-100 text-orange-800',
    },
    {
      id: 'planner',
      icon: <Calendar className="w-5 h-5 text-[#0056d6]" />,
      title: 'Organiser ma journée',
      subtitle: 'Planning horaire 07h-21h, priorités & matrice d\'Eisenhower.',
      prompt: 'Aide-moi à organiser ma journée de 07h00 à 21h00 avec une bonne répartition de mes priorités.',
      category: 'planner',
      colorClass: 'hover:border-sky-300 hover:bg-sky-50/40',
      badgeBg: 'bg-sky-100 text-sky-800',
    },
    {
      id: 'cycle',
      icon: <Heart className="w-5 h-5 text-pink-600" />,
      title: 'Suivre mon cycle',
      subtitle: 'Phases physiologiques, soulagement bienveillant & suivi serein.',
      prompt: 'Peux-tu m\'expliquer les phases du cycle féminin et les conseils doux pour apaiser les inconforts ?',
      category: 'cycle',
      colorClass: 'hover:border-pink-300 hover:bg-pink-50/40',
      badgeBg: 'bg-pink-100 text-pink-800',
    },
    {
      id: 'finance',
      icon: <Wallet className="w-5 h-5 text-emerald-600" />,
      title: 'Organiser mon budget',
      subtitle: 'Règle OREA 50/30/20, calcul d\'épargne en FCFA & gestion saine.',
      prompt: 'Comment organiser mon budget mensuel en FCFA avec la règle OREA 50/30/20 ?',
      category: 'finance',
      colorClass: 'hover:border-emerald-300 hover:bg-emerald-50/40',
      badgeBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'objectif',
      icon: <Target className="w-5 h-5 text-purple-600" />,
      title: 'Créer un objectif',
      subtitle: 'Discipline personnelle, méthode SMART & suivi d\'habitudes durables.',
      prompt: 'Je veux me fixer un objectif personnel mesurable et définir un plan d\'action sur 30 jours.',
      category: 'evolution',
      colorClass: 'hover:border-purple-300 hover:bg-purple-50/40',
      badgeBg: 'bg-purple-100 text-purple-800',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* OREA Assistant Brand Welcome */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <OreaAiAvatar size="xl" showGlowRing={true} state="idle" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0f2347] tracking-tight">
          Votre IA OREA
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
          « Mieux comprendre. Mieux vivre. Mieux évoluer. »
          <br />
          Votre compagnon intelligent et holistique au quotidien.
        </p>
      </div>

      {/* Suggested actions prompt */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Que souhaitez-vous faire ?
        </span>
        <span className="text-[11px] text-slate-400">
          Sélectionnez un point de départ
        </span>
      </div>

      {/* 7 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectPrompt(s.prompt, s.category)}
            className={`p-4 rounded-2xl bg-white border border-[#e2eaf4] text-left transition-all duration-150 cursor-pointer shadow-xs group flex items-start justify-between gap-3 ${s.colorClass}`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                  {s.icon}
                </div>
                <h3 className="text-sm font-bold text-[#0f2347] truncate group-hover:text-[#0056d6] transition-colors">
                  {s.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-snug line-clamp-2">
                {s.subtitle}
              </p>
            </div>
            <div className="text-slate-300 group-hover:text-[#0056d6] group-hover:translate-x-0.5 transition-all shrink-0 mt-2">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
