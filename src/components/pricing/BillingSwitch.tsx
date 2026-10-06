import React from 'react';
import { Sparkles } from 'lucide-react';
import { BillingCycle } from '../../types';

interface BillingSwitchProps {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
  maxSavingsMonths?: number;
  maxSavingsPercent?: number;
}

export const BillingSwitch: React.FC<BillingSwitchProps> = ({
  value,
  onChange,
  maxSavingsMonths = 2,
  maxSavingsPercent = 17,
}) => {
  const isYearly = value === 'yearly';

  const toggle = () => {
    onChange(isYearly ? 'monthly' : 'yearly');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onChange('monthly');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onChange('yearly');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 select-none">
      {/* Container row: Mensuel | Switch | Annuel */}
      <div className="inline-flex items-center gap-3 sm:gap-4 p-2 sm:p-2.5 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-inner">
        {/* Mensuel Label Button */}
        <button
          type="button"
          id="btn-billing-monthly"
          onClick={() => onChange('monthly')}
          className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            !isYearly
              ? 'bg-white text-[#0B2F5B] shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-pressed={!isYearly}
        >
          Mensuel
        </button>

        {/* Physical Styled Switch Button */}
        <button
          type="button"
          id="toggle-billing-switch"
          role="switch"
          aria-checked={isYearly}
          aria-label="Basculer entre facturation mensuelle et annuelle"
          tabIndex={0}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          className={`relative w-14 h-8 sm:w-16 sm:h-8.5 rounded-full p-1 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0056d6] focus-visible:ring-offset-2 cursor-pointer ${
            isYearly ? 'bg-gradient-to-r from-[#0056d6] to-[#00A6C7]' : 'bg-slate-300'
          }`}
        >
          {/* Sliding Knob Thumb */}
          <span
            className={`block w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
              isYearly ? 'translate-x-6 sm:translate-x-7.5' : 'translate-x-0'
            }`}
          >
            {/* Subtle center indicator */}
            <span
              className={`block w-2 h-2 rounded-full mx-auto my-auto mt-2 transition-colors duration-200 ${
                isYearly ? 'bg-[#00A6C7]' : 'bg-slate-400'
              }`}
            />
          </span>
        </button>

        {/* Annuel Label Button */}
        <button
          type="button"
          id="btn-billing-yearly"
          onClick={() => onChange('yearly')}
          className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            isYearly
              ? 'bg-[#0056d6] text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-pressed={isYearly}
        >
          <span>Annuel</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-tight shadow-xs">
            -{maxSavingsPercent}%
          </span>
        </button>
      </div>

      {/* Calculated Real Savings Callout */}
      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium animate-in fade-in duration-200">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>
          Facturation annuelle : <strong className="text-[#0B2F5B] font-bold">Économisez jusqu’à {maxSavingsMonths} mois</strong> par rapport au tarif mensuel.
        </span>
      </div>
    </div>
  );
};
