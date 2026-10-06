import React from 'react';
import { ArrowRight, Activity, AlertCircle, Pill, Calendar } from 'lucide-react';
import { OREA_UNIVERSES, UniverseCardData } from '../data';
import { NavSection } from '../types';
import { OREASymbol } from './OREALogo';
import { OreaButton } from './common/OreaButton';
import santeImg from '../assets/images/orea_sante_family_1788513814143.jpg';
import urgenceImg from '../assets/images/orea_urgence_care_1788513835421.jpg';
import medsImg from '../assets/images/orea_meds_pharmacy_1788513853266.jpg';
import agendaImg from '../assets/images/orea_agenda_schedule_1788513869889.jpg';

interface UniversesOverviewProps {
  onNavigate: (section: NavSection) => void;
}

const UNIVERSE_IMAGES: Record<string, string> = {
  sante: santeImg,
  urgence: urgenceImg,
  medicaments: medsImg,
  agenda: agendaImg,
};

export const UniversesOverview: React.FC<UniversesOverviewProps> = ({ onNavigate }) => {
  return (
    <section className="w-full py-8 sm:py-14 bg-gradient-to-b from-[#f8fbfe] via-white to-white border-y border-[#e5f0fa]">
      <div className="max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Title & Intro */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <OREASymbol className="w-5 h-5 opacity-90" />
            <span className="text-[12px] sm:text-[12.5px] font-bold tracking-wider text-[#0056d6] uppercase">
              LES 4 PILIERS OREA
            </span>
          </div>
          <h2 className="text-[28px] sm:text-[38px] lg:text-[42px] font-extrabold text-[#0f2347] tracking-tight mt-1.5 leading-tight">
            Tout votre essentiel santé, au même endroit.
          </h2>
          <p className="text-[14.5px] sm:text-[16px] text-[#64748b] mt-3 leading-relaxed">
            Accédez à nos quatre univers conçus pour vous informer en toute sécurité, vous orienter en urgence,
            comprendre vos traitements et planifier votre parcours de soins.
          </p>
          <div className="w-10 h-[3.5px] bg-[#0056d6] rounded-full mx-auto mt-4 opacity-80" />
        </div>

        {/* 4 Cards Grid with Photographic Integration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {OREA_UNIVERSES.map((universe: UniverseCardData) => {
            const isUrgence = universe.isEmergency;
            const cardImg = UNIVERSE_IMAGES[universe.id];

            return (
              <div
                key={universe.id}
                onClick={() => onNavigate(universe.id as NavSection)}
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer border ${
                  isUrgence
                    ? 'bg-gradient-to-b from-[#fffbfb] to-[#fff7f7] border-[#fed7d7] hover:border-[#f87171] shadow-[0_4px_20px_rgba(239,68,68,0.06)] hover:shadow-[0_12px_32px_rgba(239,68,68,0.12)] hover:-translate-y-1'
                    : 'bg-white border-[#dce9f6] hover:border-[#93c5fd] shadow-[0_4px_20px_rgba(37,99,235,0.04)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.10)] hover:-translate-y-1'
                }`}
              >
                {/* Visual Image Banner */}
                {cardImg && (
                  <div className="relative w-full h-44 overflow-hidden">
                    <img
                      src={cardImg}
                      alt={universe.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Badge over photo */}
                    <div className="absolute top-3.5 right-3.5">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${
                          isUrgence
                            ? 'bg-[#fee2e2]/95 text-[#b91c1c] border border-[#fecaca]'
                            : 'bg-white/95 text-[#0056d6] border border-white'
                        }`}
                      >
                        {universe.badge}
                      </span>
                    </div>

                    {/* Linear icon floating on lower left */}
                    <div className="absolute bottom-3 left-3.5 flex items-center gap-2">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${
                          isUrgence
                            ? 'bg-[#dc2626] text-white'
                            : 'bg-[#0056d6] text-white'
                        }`}
                      >
                        {universe.iconType === 'sante' && <Activity className="w-5 h-5" strokeWidth={2} />}
                        {universe.iconType === 'urgence' && <AlertCircle className="w-5 h-5" strokeWidth={2.2} />}
                        {universe.iconType === 'medicaments' && <Pill className="w-5 h-5" strokeWidth={2} />}
                        {universe.iconType === 'agenda' && <Calendar className="w-5 h-5" strokeWidth={2} />}
                      </div>
                      <span className="text-white text-xs font-bold drop-shadow-sm">
                        {universe.title}
                      </span>
                    </div>
                  </div>
                )}

                {/* Card Content Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[19px] font-extrabold text-[#0f2347] tracking-tight group-hover:text-[#0056d6] transition-colors leading-snug">
                      {universe.title}
                    </h3>
                    <p className="text-[13px] text-[#64748b] mt-2 leading-relaxed font-normal">
                      {universe.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4 mt-4 border-t border-[#f0f4f9]">
                    <OreaButton
                      variant={isUrgence ? 'urgence' : 'sante'}
                      size="sm"
                      fullWidth
                      iconRight={<ArrowRight className="w-3.5 h-3.5" strokeWidth={2.2} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(universe.id as NavSection);
                      }}
                    >
                      {universe.buttonText}
                    </OreaButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary Ecosystem Grid: Évoluer, Vivre Mieux & Réussir */}
        <div className="mt-14 pt-10 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Écosystème Global OREA
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0f2347] mt-2">
                Mieux comprendre. Mieux vivre. Mieux évoluer.
              </h3>
            </div>
            <button
              onClick={() => onNavigate('mon_orea' as NavSection)}
              className="px-4 py-2.5 rounded-xl bg-[#0056d6] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Mon OREA (Synthèse globale)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              {
                id: 'cycle',
                title: 'Mon Cycle',
                sub: 'Santé Féminine & Rythme',
                badge: 'Femme',
                variant: 'cycle' as const,
                color: 'hover:border-pink-300 hover:bg-pink-50/30',
                badgeColor: 'bg-pink-100 text-pink-700',
              },
              {
                id: 'sport',
                title: 'Sport & Workout',
                sub: '6 Niveaux Poids du Corps',
                badge: 'Vitalité',
                variant: 'sport' as const,
                color: 'hover:border-orange-300 hover:bg-orange-50/30',
                badgeColor: 'bg-orange-100 text-orange-800',
              },
              {
                id: 'nutrition',
                title: 'Nutrition & Terroir',
                sub: 'Super-aliments Africains',
                badge: 'Équilibre',
                variant: 'nutrition' as const,
                color: 'hover:border-emerald-300 hover:bg-emerald-50/30',
                badgeColor: 'bg-emerald-100 text-emerald-800',
              },
              {
                id: 'education',
                title: 'BAC G2 & Éloquence',
                sub: 'SYSCOHADA & Prise de Parole',
                badge: 'Excellence',
                variant: 'etude' as const,
                color: 'hover:border-indigo-300 hover:bg-indigo-50/30',
                badgeColor: 'bg-indigo-100 text-indigo-800',
              },
              {
                id: 'finance',
                title: 'Finance & Budget',
                sub: 'Gestion Sereine en FCFA',
                badge: 'FCFA',
                variant: 'nutrition' as const,
                color: 'hover:border-emerald-300 hover:bg-emerald-50/30',
                badgeColor: 'bg-emerald-100 text-emerald-800',
              },
              {
                id: 'planner',
                title: 'OREA Planner',
                sub: 'Journée 07h00 - 21h00',
                badge: 'Rythme',
                variant: 'sante' as const,
                color: 'hover:border-blue-300 hover:bg-blue-50/30',
                badgeColor: 'bg-blue-100 text-blue-800',
              },
            ].map((mod) => (
              <div
                key={mod.id}
                onClick={() => onNavigate(mod.id as NavSection)}
                className={`p-4 rounded-2xl bg-white border border-[#e2eaf4] shadow-xs cursor-pointer transition-all flex flex-col justify-between ${mod.color}`}
              >
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${mod.badgeColor}`}>
                    {mod.badge}
                  </span>
                  <h4 className="font-bold text-sm text-[#0f2347] mt-2 mb-0.5">{mod.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-tight">{mod.sub}</p>
                </div>
                <div className="mt-3 pt-2">
                  <OreaButton
                    variant={mod.variant}
                    size="xs"
                    fullWidth
                    iconRight={<ArrowRight className="w-3 h-3" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(mod.id as NavSection);
                    }}
                  >
                    Ouvrir
                  </OreaButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
