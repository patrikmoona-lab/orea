import React from 'react';
import { TrendingUp, Info, Activity } from 'lucide-react';
import { CycleCalculationResult } from '../../types/cycle';

interface OreaCycleRegularityCardProps {
  cycleStats: CycleCalculationResult;
}

export const OreaCycleRegularityCard: React.FC<OreaCycleRegularityCardProps> = ({
  cycleStats
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0056d6] dark:text-blue-400 flex items-center justify-center">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Ma régularité
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Observation de la durée et des variations observées
          </p>
        </div>
      </div>

      {cycleStats.hasSufficientData ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Moyenne observée
              </span>
              <p className="text-2xl font-black text-[#0056d6] dark:text-blue-400 mt-1">
                {cycleStats.averageCycleDays} jours
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                {cycleStats.cyclesObservedCount > 1
                  ? `Calculée sur ${cycleStats.cyclesObservedCount} cycles`
                  : 'Basée sur votre premier cycle'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Plage observée
              </span>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {cycleStats.shortestCycleDays === cycleStats.longestCycleDays
                  ? `${cycleStats.averageCycleDays} j`
                  : `${cycleStats.shortestCycleDays} à ${cycleStats.longestCycleDays} j`}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                Variation : ±{Math.max(1, Math.round(cycleStats.cycleLengthVariationDays / 2))} jour(s)
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#0056d6]" />
              <span>Observation descriptive OREA :</span>
            </p>
            <p>
              {cycleStats.cyclesObservedCount >= 2
                ? `Les données disponibles montrent une variation de ${cycleStats.cycleLengthVariationDays} jour(s) entre vos cycles enregistrés (durées observées de ${cycleStats.shortestCycleDays} à ${cycleStats.longestCycleDays} jours).`
                : "Vos premières données enregistrées constituent un repère initial. L'observation des variations s'affinera avec vos prochains cycles."}
            </p>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-slate-400 dark:text-slate-500 space-y-2">
          <Activity className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
          <p className="text-xs font-semibold">
            Enregistrez au moins 1 cycle pour visualiser votre rythme et vos variations.
          </p>
        </div>
      )}
    </div>
  );
};
