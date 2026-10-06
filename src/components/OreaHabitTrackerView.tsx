import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Activity,
  Edit2,
  Trash2,
  Sparkles,
  Lock,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Heart,
  BookOpen,
  Dumbbell,
  Moon,
  Droplets,
} from 'lucide-react';
import { OreaUserProfile } from '../types';
import { OreaButton } from './common/OreaButton';

export interface HabitItem {
  id: string;
  title: string;
  category: 'sante' | 'sport' | 'sommeil' | 'esprit' | 'hydratation' | 'nutrition' | 'autre';
  frequency: 'quotidienne' | 'ouvres' | '3x_semaine';
  targetDaysPerWeek: number;
  streak: number;
  historyLast7Days: boolean[]; // true if completed
  createdAt: string;
}

interface OreaHabitTrackerViewProps {
  userProfile: OreaUserProfile;
  onUpgradeToPro?: () => void;
}

export const OreaHabitTrackerView: React.FC<OreaHabitTrackerViewProps> = ({
  userProfile,
  onUpgradeToPro,
}) => {
  const isPro = userProfile.plan === 'pro' || userProfile.plan === 'premium' || userProfile.plan === 'business';
  const maxAllowed = isPro ? Infinity : 3;

  const [habits, setHabits] = useState<HabitItem[]>([
    {
      id: 'h-1',
      title: 'Boire 2L d’eau fraîche',
      category: 'hydratation',
      frequency: 'quotidienne',
      targetDaysPerWeek: 7,
      streak: 12,
      historyLast7Days: [true, true, true, true, true, true, true],
      createdAt: '2026-09-01',
    },
    {
      id: 'h-2',
      title: '15 min de mobilité & étirements',
      category: 'sport',
      frequency: 'quotidienne',
      targetDaysPerWeek: 7,
      streak: 5,
      historyLast7Days: [false, true, true, true, true, true, false],
      createdAt: '2026-09-03',
    },
    {
      id: 'h-3',
      title: 'Lecture 20 minutes sans écran',
      category: 'esprit',
      frequency: 'quotidienne',
      targetDaysPerWeek: 7,
      streak: 8,
      historyLast7Days: [true, true, false, true, true, true, true],
      createdAt: '2026-09-05',
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HabitItem['category']>('sante');
  const [newFrequency, setNewFrequency] = useState<HabitItem['frequency']>('quotidienne');

  const activeCount = habits.length;
  const isLimitReached = !isPro && activeCount >= maxAllowed;

  const handleToggleToday = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const currentToday = h.historyLast7Days[6]; // last day is today
        const newToday = !currentToday;
        const newHistory = [...h.historyLast7Days];
        newHistory[6] = newToday;
        const newStreak = newToday ? h.streak + 1 : Math.max(0, h.streak - 1);
        return {
          ...h,
          historyLast7Days: newHistory,
          streak: newStreak,
        };
      })
    );
  };

  const handleDelete = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (isLimitReached) return;

    const newHabit: HabitItem = {
      id: `habit-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      frequency: newFrequency,
      targetDaysPerWeek: newFrequency === '3x_semaine' ? 3 : newFrequency === 'ouvres' ? 5 : 7,
      streak: 1,
      historyLast7Days: [false, false, false, false, false, false, true],
      createdAt: new Date().toISOString(),
    };

    setHabits((prev) => [...prev, newHabit]);
    setNewTitle('');
    setIsCreating(false);
  };

  const getCategoryIcon = (cat: HabitItem['category']) => {
    switch (cat) {
      case 'hydratation':
        return <Droplets className="w-4 h-4 text-cyan-600" />;
      case 'sport':
        return <Dumbbell className="w-4 h-4 text-orange-600" />;
      case 'sommeil':
        return <Moon className="w-4 h-4 text-indigo-600" />;
      case 'esprit':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      default:
        return <Heart className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Régularité & Progression OREA</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2F5B] tracking-tight">
              Tracker d'Habitudes Personnelles
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Construisez des routines durables et mesurez vos séries quotidiennes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Plan Quota Badge */}
            <div className={`px-3.5 py-2 rounded-2xl text-xs font-bold border ${isPro ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
              {isPro ? (
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Plan PRO : Habitudes illimitées</span>
                </span>
              ) : (
                <span>Plan Standard : {activeCount} / 3 habitudes actives</span>
              )}
            </div>

            <button
              onClick={() => {
                if (isLimitReached && onUpgradeToPro) {
                  onUpgradeToPro();
                } else {
                  setIsCreating(true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#0056d6] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              {isLimitReached ? <Lock className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isLimitReached ? 'Passer en PRO (Illimité)' : 'Nouvelle habitude'}</span>
            </button>
          </div>
        </div>

        {/* Modal / Form Creation */}
        {isCreating && (
          <form
            onSubmit={handleCreateHabit}
            className="bg-white rounded-3xl p-6 border border-blue-200 shadow-lg space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Créer une nouvelle habitude</h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Annuler
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Intitulé de l'habitude :
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ex: 10 000 pas quotidiens, Prise de traitement matinale..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0056d6] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Domaine :
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="sante">Santé générale</option>
                  <option value="hydratation">Hydratation</option>
                  <option value="sport">Sport & Mouvement</option>
                  <option value="sommeil">Sommeil & Récupération</option>
                  <option value="esprit">Esprit & Savoirs</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Fréquence :</span>
                <div className="flex gap-1">
                  {[
                    { id: 'quotidienne', label: '7j / 7' },
                    { id: 'ouvres', label: 'Jours ouvrés' },
                    { id: '3x_semaine', label: '3x / sem' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setNewFrequency(f.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${newFrequency === f.id ? 'bg-[#0B2F5B] text-white border-[#0B2F5B]' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Enregistrer l'habitude
              </button>
            </div>
          </form>
        )}

        {/* Habits List */}
        <div className="space-y-3.5">
          {habits.map((habit) => {
            const isDoneToday = habit.historyLast7Days[6];
            return (
              <div
                key={habit.id}
                className={`bg-white rounded-3xl p-5 border transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDoneToday ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => handleToggleToday(habit.id)}
                    className="cursor-pointer shrink-0 transition-transform active:scale-90"
                    title={isDoneToday ? 'Marquer non fait' : 'Valider pour aujourd’hui'}
                  >
                    {isDoneToday ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-8 h-8 text-slate-300 hover:text-emerald-500" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-slate-100">
                        {getCategoryIcon(habit.category)}
                      </span>
                      <h4 className={`text-sm font-bold ${isDoneToday ? 'text-slate-900 line-through opacity-70' : 'text-slate-900'}`}>
                        {habit.title}
                      </h4>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>Fréquence : {habit.frequency === 'quotidienne' ? 'Quotidienne' : habit.frequency === 'ouvres' ? 'Jours ouvrés' : '3x par semaine'}</span>
                    </div>
                  </div>
                </div>

                {/* Right side: Streak & 7 days dots & actions */}
                <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  
                  {/* Streak */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span>{habit.streak} j</span>
                  </div>

                  {/* Last 7 days pills */}
                  <div className="flex items-center gap-1">
                    {habit.historyLast7Days.map((val, dIdx) => (
                      <div
                        key={dIdx}
                        className={`w-4 h-6 rounded-md ${
                          val ? 'bg-emerald-500' : 'bg-slate-200'
                        } ${dIdx === 6 ? 'ring-2 ring-blue-400' : ''}`}
                        title={dIdx === 6 ? "Aujourd'hui" : `Jour -${6 - dIdx}`}
                      />
                    ))}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Supprimer l'habitude"
                  >
                    <Trash2 className="w-4 h-4" />
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

export default OreaHabitTrackerView;
