import React, { useState, useEffect } from 'react';
import {
  Cookie,
  ShieldCheck,
  Check,
  ArrowLeft,
  Settings2,
  Lock,
  Sliders,
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { NavSection, CookieConsent } from '../../types';
import {
  getCookieConsent,
  acceptAllCookies,
  rejectAllCookies,
  saveCustomConsent,
} from '../../services/cookieConsentService';

interface CookiePreferencesViewProps {
  onNavigate: (section: NavSection) => void;
}

export const CookiePreferencesView: React.FC<CookiePreferencesViewProps> = ({ onNavigate }) => {
  const [preferencesEnabled, setPreferencesEnabled] = useState<boolean>(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(false);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  const [lastConsent, setLastConsent] = useState<CookieConsent | null>(null);

  // Charger le consentement actuel au montage
  useEffect(() => {
    const current = getCookieConsent();
    if (current) {
      setLastConsent(current);
      setPreferencesEnabled(current.preferences);
      setAnalyticsEnabled(current.analytics);
    } else {
      // Par défaut avant consentement : préférences actives, analytiques inactives
      setPreferencesEnabled(true);
      setAnalyticsEnabled(false);
    }
  }, []);

  const handleSaveCustom = () => {
    const updated = saveCustomConsent(preferencesEnabled, analyticsEnabled);
    setLastConsent(updated);
    setSavedNotification('Vos préférences de cookies ont été enregistrées avec succès.');
    setTimeout(() => setSavedNotification(null), 4000);
  };

  const handleAcceptAll = () => {
    const updated = acceptAllCookies();
    setLastConsent(updated);
    setPreferencesEnabled(true);
    setAnalyticsEnabled(true);
    setSavedNotification('Tous les cookies ont été acceptés avec succès.');
    setTimeout(() => setSavedNotification(null), 4000);
  };

  const handleRejectAll = () => {
    const updated = rejectAllCookies();
    setLastConsent(updated);
    setPreferencesEnabled(false);
    setAnalyticsEnabled(false);
    setSavedNotification('Tous les cookies non nécessaires ont été refusés.');
    setTimeout(() => setSavedNotification(null), 4000);
  };

  const formattedDate = lastConsent
    ? new Date(lastConsent.timestamp).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* En-tête avec bouton retour */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <button
            type="button"
            onClick={() => onNavigate('accueil')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0056D6] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </button>
          <button
            type="button"
            onClick={() => onNavigate('confidentialite')}
            className="text-xs sm:text-sm font-medium text-[#0056D6] hover:underline cursor-pointer"
          >
            Politique de confidentialité
          </button>
        </div>

        {/* Titre Principal */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0056D6] shrink-0">
              <Cookie className="w-6 h-6 text-[#0056D6]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Gérer mes cookies et traceurs
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Centre de préférences de confidentialité OREA
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed pt-2">
            Chez OREA, nous respectons votre vie privée et la souveraineté de vos données de santé. Vous pouvez choisir ici les catégories de cookies et technologies de stockage local autorisées sur votre appareil. Les cookies strictement nécessaires ne peuvent pas être désactivés car ils garantissent la sécurité et le bon fonctionnement de la plateforme.
          </p>

          {formattedDate && (
            <div className="inline-flex items-center gap-2 text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-mono">
              <Settings2 className="w-3.5 h-3.5 text-slate-500" />
              Dernier choix enregistré le : {formattedDate} (Statut : <span className="font-bold text-slate-800">{lastConsent?.status}</span>)
            </div>
          )}
        </div>

        {/* Notification de sauvegarde */}
        {savedNotification && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="flex-1">{savedNotification}</p>
          </div>
        )}

        {/* Catégories de cookies */}
        <div className="space-y-4">

          {/* 1. Cookies Nécessaires */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    1. Cookies strictement nécessaires
                  </h3>
                  <p className="text-xs text-slate-500">
                    Indispensables au fonctionnement technique et à la sécurité
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Toujours actifs
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 sm:pl-12">
              Ces cookies et jetons de session sont requis pour assurer l'accès sécurisé à votre espace personnel (Firebase Authentication), la protection contre les requêtes frauduleuses, le maintien de session et la navigation fluide entre les univers OREA. Ils ne peuvent être désactivés.
            </p>
          </div>

          {/* 2. Cookies de Préférence */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0056D6] flex items-center justify-center shrink-0">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    2. Cookies et stockage de préférence
                  </h3>
                  <p className="text-xs text-slate-500">
                    Personnalisation de l'affichage et fluidité de navigation
                  </p>
                </div>
              </div>

              {/* Interrupteur Toggle */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={preferencesEnabled}
                  onChange={(e) => setPreferencesEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0056D6]"></div>
              </label>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 sm:pl-12">
              Permettent de mémoriser vos préférences locales de consultation, tels que vos derniers filtres d'articles de santé, les thématiques préférées ou la configuration d'affichage de vos outils de suivi. Si désactivé, l'interface reviendra aux réglages par défaut à chaque nouvelle session.
            </p>
          </div>

          {/* 3. Cookies Analytiques */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    3. Cookies analytiques et mesures d'audience
                  </h3>
                  <p className="text-xs text-slate-500">
                    Statistiques anonymisées d'utilisation des services
                  </p>
                </div>
              </div>

              {/* Interrupteur Toggle */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0056D6]"></div>
              </label>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 sm:pl-12">
              Nous permettent de comprendre de manière agrégée et strictement anonymisée comment les visiteurs utilisent OREA (pages les plus consultées, temps de chargement, erreurs éventuelles) afin d'améliorer en continu la fiabilité de nos outils. Aucun cookie publicitaire tiers n'est utilisé.
            </p>
          </div>

        </div>

        {/* Rappel de sécurité strict */}
        <div className="flex items-start gap-3 bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 text-xs text-slate-700 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-[#0056D6] shrink-0 mt-0.5" />
          <p>
            <strong>Garantie OREA :</strong> Aucun mot de passe, clé d'API, donnée de santé déclarée ou conversation avec l'Assistant IA n'est jamais stocké dans les cookies ou partagé avec des tiers à des fins publicitaires.
          </p>
        </div>

        {/* Barre d'actions */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={handleRejectAll}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors text-center cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              Tout refuser
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-4 py-2.5 rounded-xl border border-[#0056D6] text-[#0056D6] font-semibold text-xs sm:text-sm hover:bg-blue-50 transition-colors text-center cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              Tout accepter
            </button>
          </div>

          <button
            type="button"
            onClick={handleSaveCustom}
            className="px-6 py-2.5 rounded-xl bg-[#0056D6] text-white font-bold text-xs sm:text-sm hover:bg-[#0046b3] shadow-sm hover:shadow transition-all text-center cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Enregistrer mes préférences
          </button>
        </div>

      </div>
    </div>
  );
};
