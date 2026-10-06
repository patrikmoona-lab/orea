import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  X,
  Dumbbell
} from 'lucide-react';
import { WorkoutSessionLog } from '../../types/energie';
import { getWorkoutSessions } from '../../services/energieService';
import { useAuth } from '../../context/AuthContext';

interface OreaWorkoutHistoryViewProps {
  onStartNewSession?: () => void;
}

export const OreaWorkoutHistoryView: React.FC<OreaWorkoutHistoryViewProps> = ({
  onStartNewSession,
}) => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSessionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<WorkoutSessionLog | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const list = await getWorkoutSessions(currentUser?.uid);
        setSessions(list);
      } catch (err) {
        console.warn('[History] Error loading sessions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [currentUser]);

  // Real calculated metrics (No invented statistics per Rule #34)
  const totalSessionsCount = sessions.length;
  const totalActiveMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalSetsCount = sessions.reduce((acc, s) => acc + (s.totalSetsCompleted || 0), 0);

  // Group by date
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Detail Modal for Selected Past Session */}
      {selectedSession && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-extrabold text-base text-[#0f2347] dark:text-white">
                  Détail de la séance
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <p className="font-extrabold text-sm text-[#0f2347] dark:text-white">
                {selectedSession.sessionTitle}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date & Heure</span>
                  <span>{formatDate(selectedSession.completedAt)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Durée réelle</span>
                  <span>{selectedSession.durationMinutes} minutes</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Exercices complétés</span>
                  <span>{selectedSession.exercisesCompletedCount} exercices</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Volume de travail</span>
                  <span>{selectedSession.totalSetsCompleted} séries</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedSession(null)}
              className="w-full py-3 rounded-2xl bg-[#0f2347] dark:bg-slate-800 text-white font-extrabold text-xs cursor-pointer hover:bg-orange-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Progression Metrics Cards */}
      <section className="space-y-3">
        <h3 className="text-xs font-extrabold text-[#0f2347] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          <span>Ma Progression Réelle</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-[#e2eaf4] dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Séances complétées</span>
              <span className="text-xl font-black text-[#0f2347] dark:text-white">
                {totalSessionsCount}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-[#e2eaf4] dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Temps total actif</span>
              <span className="text-xl font-black text-[#0f2347] dark:text-white">
                {totalActiveMinutes} <span className="text-xs text-slate-400 font-normal">min</span>
              </span>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-[#e2eaf4] dark:border-slate-800 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Volume total</span>
              <span className="text-xl font-black text-[#0f2347] dark:text-white">
                {totalSetsCount} <span className="text-xs text-slate-400 font-normal">séries</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* History List */}
      <section className="space-y-3">
        <h3 className="text-xs font-extrabold text-[#0f2347] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-orange-500" />
          <span>Mon Historique de Séances</span>
        </h3>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Chargement de votre historique...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#e2eaf4] dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 mx-auto flex items-center justify-center">
              <Dumbbell className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#0f2347] dark:text-white">
              Aucune séance enregistrée pour le moment.
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Lancez votre première séance d’entraînement pour voir apparaître vos statistiques et vos progrès réels.
            </p>
            {onStartNewSession && (
              <button
                type="button"
                onClick={onStartNewSession}
                className="px-5 py-2.5 rounded-2xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 transition-colors cursor-pointer"
              >
                Démarrer une séance
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedSession(item)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#e2eaf4] dark:border-slate-800 flex items-center justify-between hover:border-orange-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#0f2347] dark:text-white">
                      {item.sessionTitle}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(item.completedAt)} • {item.durationMinutes} min • {item.totalSetsCompleted} séries
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 capitalize">
                    {item.level}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
