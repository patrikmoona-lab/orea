import React from 'react';
import { X, ArrowRight, ShieldCheck, Heart, Clock, Sparkles } from 'lucide-react';
import { OREALogo } from './OREALogo';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExplore: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartExplore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#dbeaf8] p-8 sm:p-12 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Centered Official OREA Logo */}
        <OREALogo
          variant="full"
          size="xl"
          showTagline={true}
          clickable={false}
          className="mb-4"
        />

        <div className="mt-4 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f2347] tracking-tight">
            Bienvenue sur OREA Santé
          </h2>
          <p className="text-sm sm:text-base text-[#64748b] leading-relaxed max-w-md mx-auto">
            « Votre espace pour mieux comprendre votre santé, trouver un service d'urgence, s'informer sur les médicaments et organiser vos rendez-vous. »
          </p>
        </div>

        {/* 3 Pillars highlight */}
        <div className="grid grid-cols-3 gap-3 my-6 pt-5 border-t border-[#f0f4f9]">
          <div className="p-3 rounded-2xl bg-[#eff6ff] text-center">
            <ShieldCheck className="w-5 h-5 text-[#0056d6] mx-auto mb-1.5" />
            <span className="text-[11px] font-bold text-[#0f2347] block">Conseils fiables</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#ecfdf5] text-center">
            <Heart className="w-5 h-5 text-[#00bfa5] mx-auto mb-1.5" />
            <span className="text-[11px] font-bold text-[#0f2347] block">Prévention</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#fff7ed] text-center">
            <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
            <span className="text-[11px] font-bold text-[#0f2347] block">Agenda & Rappels</span>
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
            onStartExplore();
          }}
          className="w-full py-3.5 rounded-xl bg-[#0056d6] hover:bg-[#0044b2] text-white font-bold text-sm sm:text-base shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
        >
          <span>Découvrir la plateforme</span>
          <ArrowRight className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
};
