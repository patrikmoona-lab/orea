import React from 'react';
import {
  Home,
  HeartPulse,
  PhoneCall,
  Pill,
  Calendar,
  CreditCard,
  ShieldCheck,
  Search,
  ArrowRight,
} from 'lucide-react';
import { NavSection } from '../types';
import { OREALogo } from './OREALogo';

interface NotFoundViewProps {
  onNavigate: (section: NavSection) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-2xl w-full text-center space-y-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
        
        {/* Logo & 404 Badge */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <OREALogo className="h-10 w-auto" />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0056D6] font-bold text-xs tracking-wider uppercase">
            Erreur 404 • Page Introuvable
          </div>
        </div>

        {/* Explication */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Cette page n'existe pas ou a été déplacée
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            L'adresse web que vous avez saisie ne correspond à aucune page publique d'OREA. Pas d'inquiétude : toutes nos ressources de santé et nos outils sont accessibles ci-dessous.
          </p>
        </div>

        {/* Bouton principal vers l'accueil */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate('accueil')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0056D6] text-white font-bold text-sm hover:bg-[#0046b3] transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Retourner à l'accueil OREA
          </button>
        </div>

        {/* Raccourcis vers les espaces publics */}
        <div className="pt-6 border-t border-slate-100 text-left">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
            Accès directs aux espaces publics OREA
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('sante')}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#0056D6]/40 hover:bg-blue-50/40 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <HeartPulse className="w-4 h-4 text-[#0056D6]" />
                <span className="text-xs font-semibold text-slate-800">Espace Santé & Prévention</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0056D6] group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('urgence')}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/40 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-red-600" />
                <span className="text-xs font-semibold text-slate-800">Urgences & Numéros utiles</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('medicaments')}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#0056D6]/40 hover:bg-blue-50/40 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Pill className="w-4 h-4 text-[#0056D6]" />
                <span className="text-xs font-semibold text-slate-800">Armoire à Pharmacie</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0056D6] group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('agenda')}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#0056D6]/40 hover:bg-blue-50/40 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#0056D6]" />
                <span className="text-xs font-semibold text-slate-800">Agenda Médical</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0056D6] group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('pricing')}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#0056D6]/40 hover:bg-blue-50/40 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-800">Tarifs & Abonnements</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('confidentialite')}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#0056D6]/40 hover:bg-blue-50/40 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-semibold text-slate-800">Confidentialité & RGPD</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
