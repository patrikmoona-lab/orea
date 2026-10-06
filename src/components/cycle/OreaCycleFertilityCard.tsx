import React from 'react';
import { Sparkles, Heart, ShieldAlert, Calendar } from 'lucide-react';
import { CycleCalculationResult } from '../../types/cycle';
import { formatFrenchCycleDate } from '../../services/cycleEngine';

interface OreaCycleFertilityCardProps {
  cycleStats: CycleCalculationResult;
}

export const OreaCycleFertilityCard: React.FC<OreaCycleFertilityCardProps> = ({
  cycleStats
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Fertilité & Ovulation estimées
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Estimations algorithmiques calculées par OREA
          </p>
        </div>
      </div>

      {cycleStats.hasSufficientData ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-1">
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                Ovulation estimée
              </span>
              <p className="text-xl font-black text-purple-900 dark:text-purple-100">
                {formatFrenchCycleDate(cycleStats.estimatedOvulationDate)}
              </p>
              <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 font-medium">
                Environ 14 jours avant vos prochaines règles
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/30 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1">
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                Fenêtre fertile estimée
              </span>
              <p className="text-base sm:text-lg font-black text-purple-900 dark:text-purple-100">
                Du {cycleStats.fertileWindowStart ? formatFrenchCycleDate(cycleStats.fertileWindowStart).split(' ').slice(0, 2).join(' ') : '—'} au {cycleStats.fertileWindowEnd ? formatFrenchCycleDate(cycleStats.fertileWindowEnd) : '—'}
              </p>
              <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 font-medium">
                Période de probabilité biologique accrue
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-950 dark:text-amber-100">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Avertissement déontologique :</span>
            </p>
            <p>
              Ces dates sont des <strong>estimations indicatives</strong> calculées à partir de vos cycles précédents. 
              Le corps féminin peut présenter des variations naturelles. Ces informations ne remplacent pas une méthode de contraception médicale ni un avis professionnel.
            </p>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-slate-400 dark:text-slate-500 space-y-2">
          <Calendar className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
          <p className="text-xs font-semibold">
            Enregistrez vos règles pour activer les estimations de fertilité.
          </p>
        </div>
      )}
    </div>
  );
};
