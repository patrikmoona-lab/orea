import React from 'react';
import { AlertCircle } from 'lucide-react';

interface OreaCycleUnsavedPromptProps {
  isOpen: boolean;
  onStay: () => void;
  onConfirmLeave: () => void;
}

export const OreaCycleUnsavedPrompt: React.FC<OreaCycleUnsavedPromptProps> = ({
  isOpen,
  onStay,
  onConfirmLeave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Quitter Mon Cycle ?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Certaines informations saisies ne sont peut-être pas encore enregistrées. Souhaitez-vous quitter cette page ?
          </p>
        </div>

        <div className="flex items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onStay}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-xs cursor-pointer"
          >
            Rester
          </button>
          <button
            type="button"
            onClick={onConfirmLeave}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer"
          >
            Quitter
          </button>
        </div>
      </div>
    </div>
  );
};
