import React, { useState } from 'react';
import {
  Calendar,
  Droplets,
  Edit3,
  Trash2,
  Plus,
  Heart,
  ChevronRight,
  Activity,
  Zap,
  Smile,
  Sparkles,
  FileText,
  Info,
  Sliders
} from 'lucide-react';
import { CycleEntry, DailyCycleLog } from '../../types/cycle';
import { formatFrenchCycleDate, calculateSymptomTrends } from '../../services/cycleEngine';

interface OreaCycleHistoryViewProps {
  entries: CycleEntry[];
  dailyLogs?: Record<string, DailyCycleLog>;
  onOpenAddPeriod: (entryToEdit?: CycleEntry) => void;
  onDeletePeriod: (id: string) => void;
  onSelectDateToEdit?: (isoDate: string) => void;
}

export const OreaCycleHistoryView: React.FC<OreaCycleHistoryViewProps> = ({
  entries,
  dailyLogs = {},
  onOpenAddPeriod,
  onDeletePeriod,
  onSelectDateToEdit
}) => {
  const [historyTab, setHistoryTab] = useState<'cycles' | 'symptoms'>('cycles');

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const sortedDailyLogs = Object.entries(dailyLogs)
    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
    .map(([date, log]) => ({ date, log }));

  const symptomTrends = React.useMemo(() => {
    return calculateSymptomTrends(dailyLogs, entries);
  }, [dailyLogs, entries]);

  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Mon historique & Synthèse</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {sortedEntries.length} cycle(s) et {sortedDailyLogs.length} journée(s) de ressentis enregistrées
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setHistoryTab('cycles')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                historyTab === 'cycles'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              Cycles ({sortedEntries.length})
            </button>
            <button
              type="button"
              onClick={() => setHistoryTab('symptoms')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                historyTab === 'symptoms'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              Journal des ressentis ({sortedDailyLogs.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenAddPeriod()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ajouter un cycle</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SYNTHÈSE DESCRIPTIVE OREA SUR LES SYMPTÔMES ENREGISTRÉS
      ========================================================================= */}
      {symptomTrends.totalLoggedDays > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50/70 via-rose-50/40 to-slate-50 dark:from-purple-950/30 dark:via-rose-950/20 dark:to-slate-900 border border-purple-100 dark:border-purple-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Synthèse descriptive OREA des ressentis</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              Basée sur {symptomTrends.totalLoggedDays} jour(s) noté(s)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Top Symptom */}
            <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-900/40 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Ressenti le plus fréquent
              </span>
              <p className="font-extrabold text-slate-900 dark:text-white">
                {symptomTrends.frequentSymptoms[0]?.name || 'Aucun symptôme physique noté'}
              </p>
              {symptomTrends.frequentSymptoms[0] && (
                <p className="text-[11px] text-purple-700 dark:text-purple-300 font-medium mt-0.5">
                  Présent dans {symptomTrends.frequentSymptoms[0].percentage}% des suivis
                </p>
              )}
            </div>

            {/* Dominant Mood */}
            <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-900/40 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Tendance d'humeur
              </span>
              <p className="font-extrabold text-slate-900 dark:text-white">
                {symptomTrends.dominantMood?.label || 'Non renseignée'}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {symptomTrends.dominantMood ? `Observée ${symptomTrends.dominantMood.count} fois` : 'Ajoutez vos humeurs'}
              </p>
            </div>

            {/* Average Energy */}
            <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-900/40 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Niveau d'énergie moyen
              </span>
              <p className="font-extrabold text-slate-900 dark:text-white">
                {symptomTrends.averageEnergy?.label || 'Non renseigné'}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {symptomTrends.averageEnergy ? `Observé ${symptomTrends.averageEnergy.count} fois` : 'Ajoutez votre énergie'}
              </p>
            </div>
          </div>

          {/* Descriptive text observations */}
          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/70 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-purple-600" />
              <span>Observations statistiques descriptives :</span>
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              {symptomTrends.descriptiveObservations.map((obs, idx) => (
                <li key={idx}>{obs}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 1: CYCLES ENREGISTRÉS
      ========================================================================= */}
      {historyTab === 'cycles' && (
        <>
          {sortedEntries.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-500">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Aucun cycle dans votre historique
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Enregistrez vos premières règles pour commencer à construire votre courbe et observer votre rythme.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenAddPeriod()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enregistrer mon premier cycle</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedEntries.map((item, index) => {
                let cycleLength = null;
                if (index < sortedEntries.length - 1) {
                  const prevStart = new Date(sortedEntries[index + 1].startDate);
                  const curStart = new Date(item.startDate);
                  cycleLength = Math.round((curStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24));
                }

                return (
                  <div
                    key={item.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          Du {formatFrenchCycleDate(item.startDate)}
                        </span>
                        {item.endDate && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            au {formatFrenchCycleDate(item.endDate)}
                          </span>
                        )}
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 font-bold capitalize">
                          Flux : {item.flow || 'moyen'}
                        </span>
                        {item.hasClots && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-medium">
                            Caillots notés
                          </span>
                        )}
                      </div>

                      {cycleLength && (
                        <p className="text-xs text-[#0056d6] dark:text-blue-400 font-semibold">
                          Durée de ce cycle : <strong>{cycleLength} jours</strong>
                        </p>
                      )}

                      {item.symptoms && item.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {item.symptoms.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80 inline-block">
                          « {item.notes} »
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenAddPeriod(item)}
                        className="p-2 text-slate-400 hover:text-[#0056d6] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                        title="Modifier ce cycle"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeletePeriod(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                        title="Supprimer ce cycle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* =========================================================================
          TAB 2: JOURNAL DES RESSENTIS QUOTIDIENS
      ========================================================================= */}
      {historyTab === 'symptoms' && (
        <>
          {sortedDailyLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
              <Activity className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Aucun ressenti quotidien noté pour le moment.
              </p>
              <p className="text-xs text-slate-400">
                Utilisez la section « Mes Symptômes & Ressentis » sur le tableau de bord pour enregistrer vos journées en 1 clic.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedDailyLogs.map(({ date, log }) => (
                <div
                  key={date}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 p-2 rounded-2xl transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {formatFrenchCycleDate(date)}
                      </span>

                      {log.mood && (
                        <span className="text-[11px] px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 font-bold border border-purple-100 dark:border-purple-900">
                          Humeur : {log.mood.replace('_', ' ')}
                        </span>
                      )}

                      {log.energy && (
                        <span className="text-[11px] px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold border border-amber-100 dark:border-amber-900">
                          Énergie : {log.energy.replace('_', ' ')}
                        </span>
                      )}

                      {log.painLevel !== undefined && log.painLevel > 0 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-lg bg-red-50 dark:bg-red-950/70 text-red-800 dark:text-red-300 font-bold border border-red-100 dark:border-red-900">
                          Douleur : {log.painLevel}/10
                        </span>
                      )}

                      {log.flow && log.flow !== 'none' && (
                        <span className="text-[11px] px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 font-bold border border-rose-100 dark:border-rose-900">
                          Écoulement : {log.flow}
                        </span>
                      )}
                    </div>

                    {/* Symptoms pills */}
                    {log.symptoms && log.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {log.symptoms.map((symp) => (
                          <span
                            key={symp}
                            className="px-2 py-0.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            {symp}
                            {log.symptomIntensities?.[symp] && (
                              <span className="opacity-70 text-[10px]"> ({log.symptomIntensities[symp]})</span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}

                    {log.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 inline-block">
                        « {log.notes} »
                      </p>
                    )}
                  </div>

                  {onSelectDateToEdit && (
                    <button
                      type="button"
                      onClick={() => onSelectDateToEdit(date)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs self-end sm:self-center transition-colors cursor-pointer"
                    >
                      Ajuster
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
};
