import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sparkles,
  Droplets,
  Heart
} from 'lucide-react';
import { CycleCalculationResult, CycleEntry, DailyCycleLog } from '../../types/cycle';

interface OreaCycleCalendarProps {
  currentCalendarDate: Date;
  selectedDate: string; // YYYY-MM-DD
  cycleStats: CycleCalculationResult;
  entries: CycleEntry[];
  dailyLogs: Record<string, DailyCycleLog>;
  averagePeriodDays: number;
  onSelectDate: (isoDate: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onTodayMonth: () => void;
  onOpenAddPeriod: () => void;
}

const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const OreaCycleCalendar: React.FC<OreaCycleCalendarProps> = ({
  currentCalendarDate,
  selectedDate,
  cycleStats,
  entries,
  dailyLogs,
  averagePeriodDays,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onTodayMonth,
  onOpenAddPeriod
}) => {
  const today = new Date();
  const todayIso = today.toISOString().split('T')[0];

  const calYear = currentCalendarDate.getFullYear();
  const calMonth = currentCalendarDate.getMonth();

  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay(); // 0 = Sunday
  const daysInCalMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Mon = 0

  // Helper to determine status for a calendar day
  const getDayStatus = (dayNum: number) => {
    const yStr = String(calYear);
    const mStr = String(calMonth + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    const isoDate = `${yStr}-${mStr}-${dStr}`;

    const isToday = isoDate === todayIso;
    const isSelected = isoDate === selectedDate;
    const hasDailyLog = Boolean(dailyLogs[isoDate]);
    const log = dailyLogs[isoDate];

    // Check if recorded period
    let isPeriodRecorded = false;
    for (const ent of entries) {
      if (ent.startDate === isoDate) {
        isPeriodRecorded = true;
        break;
      }
      if (ent.endDate) {
        if (isoDate >= ent.startDate && isoDate <= ent.endDate) {
          isPeriodRecorded = true;
          break;
        }
      } else {
        // approximate span based on averagePeriodDays
        const st = new Date(ent.startDate);
        const en = new Date(st);
        en.setDate(en.getDate() + (averagePeriodDays - 1));
        const enStr = en.toISOString().split('T')[0];
        if (isoDate >= ent.startDate && isoDate <= enStr) {
          isPeriodRecorded = true;
          break;
        }
      }
    }

    // Check if estimated period
    let isPeriodEstimated = false;
    if (cycleStats.estimatedNextPeriodDate) {
      const estStart = new Date(cycleStats.estimatedNextPeriodDate);
      const estEnd = new Date(estStart);
      estEnd.setDate(estEnd.getDate() + (averagePeriodDays - 1));
      const estEndStr = estEnd.toISOString().split('T')[0];
      if (isoDate >= cycleStats.estimatedNextPeriodDate && isoDate <= estEndStr) {
        isPeriodEstimated = true;
      }
    }

    // Check fertile window & ovulation
    const isFertile =
      Boolean(cycleStats.fertileWindowStart && cycleStats.fertileWindowEnd) &&
      isoDate >= (cycleStats.fertileWindowStart || '') &&
      isoDate <= (cycleStats.fertileWindowEnd || '');

    const isOvulation =
      Boolean(cycleStats.estimatedOvulationDate) &&
      isoDate === cycleStats.estimatedOvulationDate;

    return {
      isoDate,
      isToday,
      isSelected,
      hasDailyLog,
      log,
      isPeriodRecorded,
      isPeriodEstimated,
      isFertile,
      isOvulation
    };
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 lg:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white capitalize">
              {MONTH_NAMES_FR[calMonth]} {calYear}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calendrier mensuel & repères physiologiques
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <button
            type="button"
            onClick={onPrevMonth}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Mois précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onTodayMonth}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Aujourd'hui
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Mois suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[11px] sm:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        <span>Lun</span>
        <span>Mar</span>
        <span>Mer</span>
        <span>Jeu</span>
        <span>Ven</span>
        <span>Sam</span>
        <span>Dim</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Leading empty slots */}
        {Array.from({ length: adjustedFirstDay }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="h-14 sm:h-16 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-transparent"
          />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInCalMonth }).map((_, i) => {
          const dayNum = i + 1;
          const status = getDayStatus(dayNum);

          let bgClasses = 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700';

          if (status.isSelected) {
            bgClasses = 'border-rose-600 dark:border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 ring-2 ring-rose-400 dark:ring-rose-500 text-slate-900 dark:text-white font-extrabold shadow-sm';
          } else if (status.isPeriodRecorded) {
            bgClasses = 'border-rose-300 dark:border-rose-800 bg-rose-100/90 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-bold';
          } else if (status.isPeriodEstimated) {
            bgClasses = 'border-dashed border-rose-300 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 font-semibold';
          } else if (status.isOvulation) {
            bgClasses = 'border-purple-300 dark:border-purple-800 bg-purple-100/90 dark:bg-purple-950/60 text-purple-950 dark:text-purple-200 font-bold';
          } else if (status.isFertile) {
            bgClasses = 'border-purple-200 dark:border-purple-900/60 bg-purple-50/70 dark:bg-purple-950/30 text-purple-900 dark:text-purple-300';
          } else if (status.isToday) {
            bgClasses = 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/30 text-[#0056d6] dark:text-blue-400 font-bold';
          }

          return (
            <button
              key={`day-${dayNum}`}
              type="button"
              onClick={() => onSelectDate(status.isoDate)}
              className={`h-14 sm:h-16 rounded-2xl p-1.5 sm:p-2 flex flex-col justify-between items-center transition-all cursor-pointer relative border ${bgClasses}`}
            >
              {/* Day header with today tag */}
              <div className="w-full flex items-center justify-between">
                <span className={`text-xs sm:text-[13px] ${status.isToday ? 'font-black text-[#0056d6] dark:text-blue-400' : ''}`}>
                  {dayNum}
                </span>

                {status.isToday && (
                  <span className="text-[9px] px-1 py-0.2 rounded-md bg-[#0056d6] text-white font-black leading-tight">
                    Auj.
                  </span>
                )}
              </div>

              {/* Status Indicator Dots */}
              <div className="flex items-center gap-1">
                {status.isPeriodRecorded && (
                  <span className="w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-500 shadow-xs" title="Règles enregistrées" />
                )}
                {status.isPeriodEstimated && !status.isPeriodRecorded && (
                  <span className="w-2 h-2 rounded-full border border-rose-500 bg-rose-200 dark:bg-rose-800 animate-pulse" title="Règles prévues" />
                )}
                {status.isOvulation && (
                  <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 shadow-xs" title="Jour d'ovulation estimé" />
                )}
                {status.isFertile && !status.isOvulation && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400/80" title="Fenêtre fertile" />
                )}
                {status.hasDailyLog && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" title="Symptômes / humeur enregistrés" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend & Quick Action */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-600 dark:bg-rose-500" />
            <span className="font-medium">Règles enregistrées</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-rose-400 bg-rose-100 dark:bg-rose-900" />
            <span className="font-medium">Règles estimées</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-300 dark:bg-purple-800" />
            <span className="font-medium">Fenêtre fertile</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-600 dark:bg-purple-400" />
            <span className="font-medium">Ovulation estimée</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-medium">Ressentis notés</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAddPeriod}
          className="px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100/70 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Droplets className="w-3.5 h-3.5 text-rose-600" />
          <span>+ Enregistrer mes règles</span>
        </button>
      </div>
    </div>
  );
};
