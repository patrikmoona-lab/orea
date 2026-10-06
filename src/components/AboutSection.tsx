import React from 'react';
import { Heart, Activity, Apple, ShieldCheck, Award, UserCheck } from 'lucide-react';
import oreaPreventionImg from '../assets/images/orea_prevention_care_1788513887905.jpg';

export const AboutSection: React.FC = () => {
  return (
    <section id="section-apropos" className="w-full py-10 sm:py-16 scroll-mt-20 bg-white">
      <div className="max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 pr-0 lg:pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Prévention & Bien-être OREA</span>
            </div>

            <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-extrabold text-[#0f2347] leading-[1.12] tracking-tight">
              Une santé mieux comprise,<br />
              chaque jour.
            </h2>

            <p className="text-[#64748b] text-[15px] sm:text-[16.5px] leading-relaxed max-w-[520px] font-normal">
              OREA vous accompagne dans l'adoption de réflexes simples et préventifs : santé globale, nutrition équilibrée, exercice physique, révisions d'excellence et organisation personnelle.
            </p>

            {/* Founder Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0B2F5B]/5 to-[#0056D6]/10 border border-[#0056D6]/20 flex items-start gap-3.5 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#0B2F5B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#0056D6]">Créateur & Fondateur Officiel</span>
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <h3 className="text-base font-bold text-[#0B2F5B] mt-0.5">Mr Tsoumou Patrick Bonheur</h3>
                <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                  À l'origine de la vision et du concept de la plateforme OREA. Devise : <span className="font-semibold text-[#0B2F5B]">« Mieux comprendre. Mieux vivre. Mieux évoluer. »</span>
                </p>
              </div>
            </div>

            {/* Prevention Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#f8fbfe] border border-[#e2edf8]">
                <div className="w-8 h-8 rounded-lg bg-[#eff6ff] text-[#0056d6] flex items-center justify-center mb-2">
                  <Apple className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#0f2347]">Nutrition équilibrée</h4>
                <p className="text-[11px] text-[#64748b] mt-1 leading-normal">Repères diététiques protecteurs</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8fbfe] border border-[#e2edf8]">
                <div className="w-8 h-8 rounded-lg bg-[#eff6ff] text-[#0056d6] flex items-center justify-center mb-2">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#0f2347]">Activité physique</h4>
                <p className="text-[11px] text-[#64748b] mt-1 leading-normal">30 min de mouvement quotidien</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8fbfe] border border-[#e2edf8]">
                <div className="w-8 h-8 rounded-lg bg-[#eff6ff] text-[#0056d6] flex items-center justify-center mb-2">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#0f2347]">Suivi régulier</h4>
                <p className="text-[11px] text-[#64748b] mt-1 leading-normal">Consultations & bilans périodiques</p>
              </div>
            </div>
          </div>

          {/* Right Photo Column */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[580px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_12px_35px_rgba(20,40,75,0.08)] border border-[#dbeaf8] group">
              <img
                src={oreaPreventionImg}
                alt="Médecin OREA Santé échangeant sur la prévention et les bonnes habitudes avec une famille"
                className="w-full h-auto object-cover object-center max-h-[380px] sm:max-h-[420px] group-hover:scale-[1.02] transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-5 text-white">
                <p className="text-xs font-semibold tracking-wide text-white/90">OREA — Fondé par Mr Tsoumou Patrick Bonheur</p>
                <p className="text-sm font-bold text-white">Cultiver les bonnes habitudes en famille pour une vie en pleine santé</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

