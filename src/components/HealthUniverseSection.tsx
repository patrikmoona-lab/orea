import React from 'react';
import { HealthCardItem, HealthCategoryKey } from '../types';

interface HealthUniverseSectionProps {
  cards: HealthCardItem[];
  onSelectCategory: (category: HealthCategoryKey) => void;
}

export const HealthUniverseSection: React.FC<HealthUniverseSectionProps> = ({
  cards,
  onSelectCategory,
}) => {
  return (
    <section id="section-univers-sante" className="w-full py-12 sm:py-16 scroll-mt-20 bg-gradient-to-b from-transparent via-[#f8fbfe] to-transparent">
      <div className="max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block text-[12px] sm:text-[12.5px] font-bold tracking-wider text-[#2563eb] uppercase">
            NOS UNIVERS SANTÉ
          </span>
          <h2 className="text-[30px] sm:text-[38px] font-extrabold text-[#0f2347] mt-2 tracking-tight">
            Pour votre santé
          </h2>
          {/* Blue accent indicator bar */}
          <div className="w-9 h-[3.5px] bg-[#2563eb] rounded-full mx-auto mt-3 opacity-80" />
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {cards.map((card) => {
            const isHighlighted = card.isHighlighted;

            return (
              <div
                key={card.id}
                onClick={() => onSelectCategory(card.id)}
                className={`group p-6 rounded-2xl transition-all duration-200 cursor-pointer flex items-center gap-5 ${
                  isHighlighted
                    ? 'bg-[#2563eb] text-white shadow-[0_12px_30px_-4px_rgba(37,99,235,0.38)] hover:bg-[#1d4ed8] hover:shadow-[0_16px_35px_-4px_rgba(37,99,235,0.48)] hover:-translate-y-0.5'
                    : 'bg-white border border-[#deecf8] hover:border-[#93c5fd] hover:shadow-[0_10px_25px_rgba(37,99,235,0.06)] text-[#0f2347] hover:-translate-y-0.5'
                }`}
              >
                {/* Circular Icon Container */}
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                    isHighlighted
                      ? 'bg-white/20 text-white'
                      : 'bg-[#f0f7fe] text-[#2563eb] border border-[#e1eef9]'
                  }`}
                >
                  {/* 1. Symptômes: Magnifying glass with pulse */}
                  {card.id === 'symptomes' && (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6.5 h-6.5">
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                      <path
                        d="M20 20L16 16"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M8 11h1.5l1-2 1.5 4 1-2H14"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}

                  {/* 2. Prévention: Shield with star / pulse */}
                  {card.id === 'prevention' && (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6.5 h-6.5">
                      <path
                        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 8l1 2 2.5.5-2 1.8.5 2.7-2-1.3-2 1.3.5-2.7-2-1.8 2.5-.5z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}

                  {/* 3. Nutrition: Apple with stem/leaf */}
                  {card.id === 'nutrition' && (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6.5 h-6.5">
                      <path
                        d="M12 20.5c-4 0-7-2.5-7-7.5 0-3.5 2.5-6.5 5.5-6.5 1 0 1.5.5 1.5.5s.5-.5 1.5-.5c3 0 5.5 3 5.5 6.5 0 5-3 7.5-7 7.5z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 6.5C12 4.5 13.5 3 15 3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {/* 4. Sommeil: Crescent moon with small star */}
                  {card.id === 'sommeil' && (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6.5 h-6.5">
                      <path
                        d="M20.5 14.5A8.5 8.5 0 1111 3.5a6.5 6.5 0 009.5 11z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17 5v2m-1-1h2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {/* 5. Sport & activité: Running shoe */}
                  {card.id === 'sport' && (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6.5 h-6.5">
                      <path
                        d="M4 17h16c.5 0 1-.5 1-1.5 0-1.5-1-3-3-4l-3-2-3 1-3-2-4 2.5c-1 1-1 3.5-1 6z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 12.5l2-1m-1 3l2-1"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {/* 6. Santé mentale: Brain */}
                  {card.id === 'mentale' && (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6.5 h-6.5">
                      <path
                        d="M9.5 4a3.5 3.5 0 00-3.5 3.5c0 .5.1 1 .3 1.4A3.5 3.5 0 004 12a3.5 3.5 0 001.5 2.9A3.5 3.5 0 009.5 20H10V4h-.5z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.5 4a3.5 3.5 0 013.5 3.5c0 .5-.1 1-.3 1.4A3.5 3.5 0 0120 12a3.5 3.5 0 01-1.5 2.9A3.5 3.5 0 0114.5 20H14V4h.5z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                {/* Title & Description */}
                <div className="flex flex-col min-w-0">
                  <h3
                    className={`text-[16px] font-bold leading-tight ${
                      isHighlighted ? 'text-white' : 'text-[#0f2347]'
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`text-[12.5px] leading-snug mt-1 ${
                      isHighlighted ? 'text-white/90' : 'text-[#64748b]'
                    }`}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
