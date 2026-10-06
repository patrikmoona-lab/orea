import React, { useState } from 'react';
import { X, Bell, Shield, Check, Clock, EyeOff } from 'lucide-react';
import { CycleSettings } from '../../types/cycle';

interface OreaCycleRemindersModalProps {
  isOpen: boolean;
  settings: CycleSettings;
  onClose: () => void;
  onSaveSettings: (settings: CycleSettings) => void;
}

export const OreaCycleRemindersModal: React.FC<OreaCycleRemindersModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSaveSettings
}) => {
  const [localSettings, setLocalSettings] = useState<CycleSettings>(settings);

  if (!isOpen) return null;

  const handleTogglePeriodBefore = (checked: boolean) => {
    setLocalSettings({
      ...localSettings,
      remindPeriodBeforeDays: checked ? 2 : 0
    });
  };

  const handleToggleFertility = (checked: boolean) => {
    setLocalSettings({
      ...localSettings,
      remindFertility: checked
    });
  };

  const handleToggleDailyLog = (checked: boolean) => {
    setLocalSettings({
      ...localSettings,
      remindDailyLog: checked
    });
  };

  const handleTogglePeriodStart = (checked: boolean) => {
    setLocalSettings({
      ...localSettings,
      remindPeriodStart: checked
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-rose-100 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0056d6] dark:text-blue-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Mes rappels & alertes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Notifications discrètes et respectueuses de votre vie privée
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs sm:text-sm">
          {/* Lockscreen Privacy Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
            <EyeOff className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-slate-900 dark:text-white block mb-0.5">
                Notifications neutres sur écran verrouillé :
              </strong>
              <p>
                OREA n’affiche jamais de termes intimes ou explicites sur vos notifications visibles. Les messages restent sobres et discrets (ex : « Rappel bien-être OREA »).
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {/* Rappel 1: Période estimée */}
            <label className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800/80">
              <div className="space-y-0.5 pr-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Rappel avant période estimée (J-2)
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Notification 2 jours avant la date prévisionnelle pour vous organiser en douceur.
                </p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.remindPeriodBeforeDays > 0}
                onChange={(e) => handleTogglePeriodBefore(e.target.checked)}
                className="mt-1 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
            </label>

            {/* Rappel 2: Enregistrer les règles */}
            <label className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800/80">
              <div className="space-y-0.5 pr-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Rappel pour enregistrer mes règles
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Aide à garder vos calculs et vos repères à jour.
                </p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(localSettings.remindPeriodStart)}
                onChange={(e) => handleTogglePeriodStart(e.target.checked)}
                className="mt-1 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
            </label>

            {/* Rappel 3: Fenêtre fertile */}
            <label className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800/80">
              <div className="space-y-0.5 pr-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Repère de fenêtre fertile estimée
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Notification discrète au début de la fenêtre d’ovulation estimée.
                </p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.remindFertility}
                onChange={(e) => handleToggleFertility(e.target.checked)}
                className="mt-1 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </label>

            {/* Rappel 4: Suivi quotidien */}
            <label className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800/80">
              <div className="space-y-0.5 pr-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Bilan de soirée (Humeur & Énergie)
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Petit rappel bienveillant à 20h pour noter vos sensations du jour.
                </p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.remindDailyLog}
                onChange={(e) => handleToggleDailyLog(e.target.checked)}
                className="mt-1 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs cursor-pointer"
            >
              Fermer
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Enregistrer mes rappels</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
