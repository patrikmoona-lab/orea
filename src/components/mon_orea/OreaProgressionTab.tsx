import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Heart,
  Activity,
  Apple,
  GraduationCap,
  Coins,
  Clock,
  Sparkles,
  Target,
  History,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { NavSection } from '../../types';
import { fetchUserObjectives, fetchUserActivities, OreaObjectiveDoc } from '../../lib/firebase';
import { OreaButton } from '../common/OreaButton';

interface OreaProgressionTabProps {
  userId?: string;
  moduleStatuses: {
    cycle: boolean;
    sport: boolean;
    nutrition: boolean;
    education: boolean;
    finance: boolean;
    planner: boolean;
  };
  onNavigate: (section: NavSection) => void;
}

export const OreaProgressionTab: React.FC<OreaProgressionTabProps> = ({
  userId,
  moduleStatuses,
  onNavigate,
}) => {
  const [objectives, setObjectives] = useState<OreaObjectiveDoc[]>([]);
  const [activitiesCount, setActivitiesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    loadData();
  }, [userId]);

  const loadData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [objs, acts] = await Promise.all([
        fetchUserObjectives(userId),
        fetchUserActivities(userId),
      ]);
      setObjectives(objs);
      setActivitiesCount(acts.length);
    } catch (err) {
      console.error('Error loading progression data:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeSpacesCount = Object.values(moduleStatuses).filter(Boolean).length;
  const spacesProgress = Math.round((activeSpacesCount / 6) * 100);

  const completedObjectivesCount = objectives.filter((o) => o.progress >= 100).length;
  const avgObjectiveProgress =
    objectives.length > 0
      ? Math.round(objectives.reduce((acc, o) => acc + (o.progress || 0), 0) / objectives.length)
      : 0;

  const modulesData = [
    {
      id: 'cycle' as NavSection,
      name: 'Mon Cycle',
      desc: 'Santé féminine & rythme biologique',
      icon: Heart,
      color: 'pink',
      bg: 'bg-pink-500',
      active: moduleStatuses.cycle,
    },
    {
      id: 'sport' as NavSection,
      name: 'Sport & Workout',
      desc: 'Force, mobilité & discipline physique',
      icon: Activity,
      color: 'orange',
      bg: 'bg-orange-500',
      active: moduleStatuses.sport,
    },
    {
      id: 'nutrition' as NavSection,
      name: 'Nutrition & Terroir',
      desc: 'Alimentation équilibrée & hydratation',
      icon: Apple,
      color: 'emerald',
      bg: 'bg-emerald-500',
      active: moduleStatuses.nutrition,
    },
    {
      id: 'education' as NavSection,
      name: 'BAC G2 & Éloquence',
      desc: 'Comptabilité, SYSCOHADA & examen',
      icon: GraduationCap,
      color: 'indigo',
      bg: 'bg-indigo-500',
      active: moduleStatuses.education,
    },
    {
      id: 'finance' as NavSection,
      name: 'Finance & Budget',
      desc: 'Gestion des dépenses & épargne en FCFA',
      icon: Coins,
      color: 'teal',
      bg: 'bg-teal-600',
      active: moduleStatuses.finance,
    },
    {
      id: 'planner' as NavSection,
      name: 'OREA Planner',
      desc: 'Planning & organisation de vos journées',
      icon: Clock,
      color: 'blue',
      bg: 'bg-blue-500',
      active: moduleStatuses.planner,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-[#0f2347] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
                <BarChart3 className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
                MON SUIVI OREA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Progression Globale</h2>
            <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
              Analyse consolidée de vos 6 espaces de vie, vos objectifs et votre activité.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/15 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
            <span>Score d'Activation OREA</span>
            <span className="text-blue-300 font-black">{spacesProgress}% ({activeSpacesCount}/6 espaces)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${spacesProgress}%` }}
            />
          </div>
          <p className="text-xs text-blue-200 pt-1">
            {activeSpacesCount === 6
              ? 'Tous vos 6 espaces OREA sont pleinement configurés et actifs.'
              : `${6 - activeSpacesCount} espace(s) restants à activer pour compléter votre écosystème.`}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Espaces Actifs</span>
            <Sparkles className="w-4 h-4 text-[#0056d6]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#0f2347]">{activeSpacesCount} / 6</p>
          <p className="text-[11px] text-slate-500">{spacesProgress}% de l'écosystème activé</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Objectifs</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#0f2347]">
            {completedObjectivesCount} / {objectives.length}
          </p>
          <p className="text-[11px] text-slate-500">
            {objectives.length > 0 ? `${avgObjectiveProgress}% d'avancement moyen` : 'Aucun objectif défini'}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Journal d'activité</span>
            <History className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#0f2347]">{activitiesCount}</p>
          <p className="text-[11px] text-slate-500">Actions enregistrées dans Firestore</p>
        </div>
      </div>

      {/* Grid of 6 Modules */}
      <div>
        <h3 className="text-sm font-bold text-[#0f2347] uppercase tracking-wider mb-4">
          État détaillé des 6 Espaces OREA
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulesData.map((m) => {
            const IconComp = m.icon;
            const moduleObjectives = objectives.filter((o) => o.module === m.id);
            const moduleDoneCount = moduleObjectives.filter((o) => o.progress >= 100).length;

            return (
              <div
                key={m.id}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="p-3 rounded-2xl bg-slate-100 text-[#0f2347]">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        m.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {m.active ? 'Espace Actif' : 'Non configuré'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#0f2347]">{m.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{m.desc}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Objectifs liés</span>
                      <span className="font-bold text-[#0f2347]">
                        {moduleDoneCount} / {moduleObjectives.length} terminés
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate(m.id)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 text-[#0f2347] hover:bg-[#0056d6] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{m.active ? "Ouvrir l'espace" : "Configurer l'espace"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
