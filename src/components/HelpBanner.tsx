import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HelpBannerProps {
  onOpenResources: () => void;
}

export const HelpBanner: React.FC<HelpBannerProps> = ({ onOpenResources }) => {
  return (
    <section id="section-besoin-daide" className="w-full py-8 sm:py-12 bg-white">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="w-full rounded-2xl sm:rounded-3xl bg-[#f0f7fd] border border-[#d4e8fa] p-6 sm:p-7 lg:p-8 shadow-[0_4px_20px_rgba(37,99,235,0.04)] transition-all">
          {/* Responsive Layout: Centered stacked on mobile, 3-column auto-1fr-auto on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 sm:gap-6 lg:gap-8 text-center md:text-left">
            {/* 1. Icon: Blue circular badge with centered Pin & Medical Cross */}
            <div className="flex justify-center md:justify-start">
              <div
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-7 h-7 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Location pin outline */}
                  <path
                    d="M12 21.5C16 17.5 19 13.2 19 9.5C19 5.634 15.866 2.5 12 2.5C8.134 2.5 5 5.634 5 9.5C5 13.2 8 17.5 12 21.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Centered medical cross */}
                  <path
                    d="M12 6.8V12.2M9.3 9.5H14.7"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* 2. Text Content: Title & Breathing 2-3 lines description */}
            <div className="flex flex-col space-y-1.5 md:pr-4">
              <h3 className="text-lg sm:text-xl font-bold text-[#0f2347] tracking-tight leading-snug">
                Besoin d'aide ?
              </h3>
              <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed max-w-2xl mx-auto md:mx-0">
                Trouver un professionnel ou un service de santé proche pour vous accompagner au bon moment.
              </p>
            </div>

            {/* 3. CTA Button: Vertically centered on desktop, full-width / max-w-xs on mobile */}
            <div className="flex justify-center md:justify-end shrink-0 w-full md:w-auto pt-2 md:pt-0">
              <button
                type="button"
                id="btn-voir-ressources-aide"
                onClick={onOpenResources}
                className="group w-full sm:w-auto min-w-[210px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl sm:rounded-2xl bg-[#0b1528] hover:bg-[#142646] active:scale-[0.98] text-white text-sm font-semibold shadow-md shadow-slate-950/15 hover:shadow-lg hover:shadow-slate-950/25 transition-all duration-200 cursor-pointer"
              >
                <span>Voir les ressources</span>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


