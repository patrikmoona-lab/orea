import React from 'react';
import { Sparkles, Droplets, Calendar, Activity, Info } from 'lucide-react';
import { CycleCalculationResult } from '../../types/cycle';
import { formatFrenchCycleDate } from '../../services/cycleEngine';

interface OreaCycleCurrentSummaryProps {
  cycleStats: CycleCalculationResult;
  userFirstName: string;
  onEditCycle?: () => void;
}

const PHASE_LABELS: Record<string, { label: string; color: string; desc: string }> = {
  menstruelle: {
    label: 'Phase Menstruelle',
    color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    desc: 'Renouvellement utérin & besoin de ressourcement.'
  },
  folliculaire: {
    label: 'Phase Folliculaire',
    color: 'bg-blue-50 dark:bg-blue-950/60 text-[#0056d6] dark:text-blue-300 border-blue-200 dark:border-blue-800',
    desc: 'Montée des œstrogènes & regain d’énergie.'
  },
  ovulatoire: {
    label: 'Phase Ovulatoire',
    color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    desc: 'Pic hormonal & vitalité maximale.'
  },
  luteale: {
    label: 'Phase Lutéale',
    color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    desc: 'Progestérone active & transition prémenstruelle.'
  }
};

export const OreaCycleCurrentSummary: React.FC<OreaCycleCurrentSummaryProps> = ({
  cycleStats,
  userFirstName,
  onEditCycle
}) => {
  const currentPhaseInfo = PHASE_LABELS[cycleStats.currentPhase] || PHASE_LABELS.folliculaire;

  return (
    <div className="space-y-3">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Jour actuel */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Cycle actuel
          </span>
          <div className="my-2 flex items-baseline gap-1.5">
            {cycleStats.hasSufficientData ? (
              <>
                <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
                  Jour {cycleStats.currentDay}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  / {cycleStats.averageCycleDays}j
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-slate-500">
                Non démarré
              </span>
            )}
          </div>
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
            <span
              className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-lg border ${currentPhaseInfo.color}`}
            >
              {cycleStats.hasSufficientData ? currentPhaseInfo.label : 'En attente de règles'}
            </span>
          </div>
        </div>

        {/* 2. Prochaine période */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Prochaines règles estimées
          </span>
          <div className="my-2">
            {cycleStats.daysUntilNextPeriod !== null ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-[#0056d6] dark:text-blue-400">
                  {cycleStats.daysUntilNextPeriod > 0
                    ? `Dans ${cycleStats.daysUntilNextPeriod} j`
                    : cycleStats.daysUntilNextPeriod === 0
                    ? "Aujourd'hui"
                    : `+${Math.abs(cycleStats.daysUntilNextPeriod)} j`}
                </span>
              </div>
            ) : (
              <span className="text-xs font-semibold text-slate-400">
                Données insuffisantes
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate pt-1 border-t border-slate-100 dark:border-slate-800">
            {cycleStats.estimatedNextPeriodDate
              ? `Prévues le ${formatFrenchCycleDate(cycleStats.estimatedNextPeriodDate)}`
              : 'Enregistrez votre dernier cycle'}
          </p>
        </div>

        {/* 3. Durée moyenne */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Durée moyenne
          </span>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {cycleStats.averageCycleDays}
            </span>
            <span className="text-xs font-bold text-slate-400">jours</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-800">
            Règles : <strong className="text-slate-700 dark:text-slate-300 font-bold">{cycleStats.averagePeriodDays} jours</strong>
          </p>
        </div>

        {/* 4. Fenêtre de fertilité & ovulation */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Fertilité & Ovulation
          </span>
          <div className="my-2">
            {cycleStats.estimatedOvulationDate ? (
              <span className="text-base sm:text-lg font-black text-purple-700 dark:text-purple-300">
                {formatFrenchCycleDate(cycleStats.estimatedOvulationDate).split(' ').slice(0, 2).join(' ')}
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-400">
                Estimation indisponible
              </span>
            )}
          </div>
          <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 font-medium truncate pt-1 border-t border-slate-100 dark:border-slate-800">
            {cycleStats.fertileWindowStart && cycleStats.fertileWindowEnd
              ? `Fenêtre : ${cycleStats.fertileWindowStart.split('-')[2]} au ${cycleStats.fertileWindowEnd.split('-')[2]} ${formatFrenchCycleDate(cycleStats.fertileWindowEnd).split(' ')[1]}`
              : 'Estimations indicatives'}
          </p>
        </div>
      </div>

      {/* Confidence & Edit banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Info className="w-3.5 h-3.5 text-[#0056d6] shrink-0" />
          <span>{cycleStats.confidenceNote}</span>
        </div>
        {onEditCycle && (
          <button
            type="button"
            onClick={onEditCycle}
            className="text-rose-700 dark:text-rose-400 font-bold hover:underline cursor-pointer self-start sm:self-auto shrink-0"
          >
            Modifier mon cycle & mes repères →
          </button>
        )}
      </div>
    </div>
  );
};
