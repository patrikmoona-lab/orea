import React from 'react';
import { NavSection } from '../types';
import { OREALogo } from './OREALogo';

interface FooterProps {
  onSelectNav: (section: NavSection) => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectNav,
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
}) => {
  return (
    <footer className="w-full border-t border-[#dbeaf8] bg-[#f8fbfe] pt-12 pb-10 mt-auto select-none">
      <div className="max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#e2edf8]">
          {/* Left Column: Official OREA Logo & Description */}
          <div className="md:col-span-5 lg:col-span-5 space-y-3">
            <OREALogo
              variant="footer"
              size="md"
              showTagline={true}
              clickable={true}
              onClick={() => onSelectNav('accueil')}
            />
            <p className="text-xs text-[#64748b] leading-relaxed pt-2 max-w-sm">
              Plateforme d'information, d'orientation d'urgence, de documentation médicale et d'organisation personnelle. OREA ne se substitue pas à une consultation médicale.
            </p>
          </div>

          {/* Middle Column: Universes & Navigation Links */}
          <div className="md:col-span-4 lg:col-span-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0f2347]">
              Les 4 Univers OREA
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-[#334155]">
              <button
                onClick={() => onSelectNav('sante')}
                className="text-left hover:text-[#0056d6] transition-colors cursor-pointer py-1"
              >
                Santé & Prévention
              </button>
              <button
                onClick={() => onSelectNav('urgence')}
                className="text-left hover:text-[#dc2626] font-semibold text-[#dc2626] transition-colors cursor-pointer py-1"
              >
                Urgence 24/7
              </button>
              <button
                onClick={() => onSelectNav('medicaments')}
                className="text-left hover:text-[#0056d6] transition-colors cursor-pointer py-1"
              >
                Médicaments
              </button>
              <button
                onClick={() => onSelectNav('agenda')}
                className="text-left hover:text-[#0056d6] transition-colors cursor-pointer py-1"
              >
                Agenda Santé
              </button>
              <button
                onClick={() => onSelectNav('ressources')}
                className="text-left hover:text-[#0056d6] transition-colors cursor-pointer py-1"
              >
                Ressources
              </button>
              <button
                onClick={() => onSelectNav('apropos')}
                className="text-left hover:text-[#0056d6] transition-colors cursor-pointer py-1"
              >
                À propos d'OREA
              </button>
            </div>
          </div>

          {/* Right Column: Legal & Contact */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0f2347]">
              Informations légales
            </h4>
            <div className="flex flex-col space-y-2 text-sm text-[#475569]">
              <a
                href="/confidentialite"
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenPrivacy) {
                    onOpenPrivacy();
                  } else {
                    onSelectNav('confidentialite');
                  }
                }}
                className="text-left hover:text-[#0056d6] transition-colors cursor-pointer"
              >
                Politique de confidentialité
              </a>
              <a
                href="/conditions-utilisation"
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenTerms) {
                    onOpenTerms();
                  } else {
                    onSelectNav('conditions_utilisation');
                  }
                }}
                className="text-left hover:text-[#0056d6] transition-colors cursor-pointer"
              >
                Conditions d'utilisation
              </a>
              <a
                href="/preferences-cookies"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectNav('preferences_cookies');
                }}
                className="text-left hover:text-[#0056d6] transition-colors cursor-pointer"
              >
                Gérer mes cookies
              </a>
              <button
                type="button"
                onClick={onOpenContact}
                className="text-left hover:text-[#0056d6] transition-colors cursor-pointer"
              >
                Contact & Assistance
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} OREA Santé. Tous droits réservés.</span>
          </div>
          <div className="text-[11px] text-slate-500 text-center sm:text-right max-w-lg">
            En cas de détresse vitale immédiate, contactez sans délai le 15 (SAMU), le 112 (Europe) ou le 18 (Pompiers).
          </div>
        </div>
      </div>
    </footer>
  );
};
