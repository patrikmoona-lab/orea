import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import {
  getCookieConsent,
  acceptAllCookies,
  rejectAllCookies,
  subscribeToConsent,
} from '../../services/cookieConsentService';
import { NavSection } from '../../types';

interface CookieBannerProps {
  onNavigate: (section: NavSection) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Vérifier après montage initial (ne bloque pas le rendu de l'interface)
    const current = getCookieConsent();
    if (!current) {
      // Petite latence fluide (300ms) pour laisser l'interface s'afficher proprement
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }

    // Écouter tout changement de consentement externe (ex: modification depuis /preferences-cookies)
    const unsubscribe = subscribeToConsent((newConsent) => {
      if (newConsent) {
        setIsVisible(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAccept = () => {
    acceptAllCookies();
    setIsVisible(false);
  };

  const handleReject = () => {
    rejectAllCookies();
    setIsVisible(false);
  };

  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate('confidentialite');
  };

  const handleCustomize = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate('preferences_cookies');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          id="orea-cookie-consent-banner"
          aria-label="Consentement aux cookies"
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl rounded-2xl p-4 sm:p-5 md:p-6 text-slate-800">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-5">
              
              {/* Contenu textuel */}
              <div className="flex items-start gap-3 sm:gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#0056D6] mt-0.5">
                  <Cookie className="w-5 h-5 text-[#0056D6]" />
                </div>
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                      Respect de votre vie privée et cookies
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      Données protégées
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                    Nous utilisons des cookies pour améliorer votre expérience sur OREA, assurer le bon fonctionnement du site et, lorsque vous y consentez, comprendre l'utilisation de nos services.
                  </p>
                  <div className="flex items-center gap-3 pt-0.5 text-xs">
                    <a
                      href="/confidentialite"
                      onClick={handleLearnMore}
                      className="text-[#0056D6] font-semibold hover:underline cursor-pointer transition-colors"
                    >
                      En savoir plus
                    </a>
                    <span className="text-slate-300">•</span>
                    <a
                      href="/preferences-cookies"
                      onClick={handleCustomize}
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-[#0056D6] font-medium cursor-pointer transition-colors"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      Personnaliser mes choix
                    </a>
                  </div>
                </div>
              </div>

              {/* Boutons d'action (équilibrés, sans dark pattern) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <button
                  type="button"
                  id="btn-cookie-reject"
                  onClick={handleReject}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-100 active:bg-slate-200 transition-colors text-center cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  Refuser
                </button>
                <button
                  type="button"
                  id="btn-cookie-accept"
                  onClick={handleAccept}
                  className="px-5 py-2.5 rounded-xl bg-[#0056D6] text-white font-semibold text-xs sm:text-sm hover:bg-[#0046b3] active:bg-[#003890] shadow-sm hover:shadow transition-all text-center cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  Accepter
                </button>
              </div>

            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
