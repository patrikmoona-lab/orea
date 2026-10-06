import React from 'react';
import { Settings, Sun, User, Globe, Bell, Bot, Shield, Database, Lock, Eye, ArrowRight } from 'lucide-react';
import { ThemeSwitch } from '../common/ThemeSwitch';
import { useTheme } from '../../context/ThemeContext';
import { OreaButton } from '../common/OreaButton';
import { NavSection } from '../../types';

interface OreaSettingsTabProps {
  userId: string;
  onNavigate?: (section: NavSection) => void;
}

export const OreaSettingsTab: React.FC<OreaSettingsTabProps> = ({ userId, onNavigate }) => {
  const { theme, effectiveTheme, setTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-[#0f2347] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
              <Settings className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
              CONFIGURATION GLOBALE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Paramètres OREA</h2>
          <p className="text-xs text-blue-200 mt-1">
            Gérez vos thèmes (Clair, Sombre, Système), alertes, langue et confidentialité.
          </p>
        </div>

        {/* Quick Theme Switch */}
        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shrink-0 flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-white">Thème Rapide</div>
            <div className="text-[11px] text-blue-200">
              {effectiveTheme === 'dark' ? 'Mode Nuit' : 'Mode Jour'}
            </div>
          </div>
          <ThemeSwitch size="md" />
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0e192d] border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0f2347] dark:text-white">
            Centre de Réglages & Personnalisation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Accédez à toutes les sections de personnalisation de la plateforme OREA.
          </p>
        </div>

        {/* Grid of Settings Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0f2347] dark:text-white">Mode d'Apparence</div>
                <div className="text-[11px] text-slate-500 capitalize">{theme} ({effectiveTheme})</div>
              </div>
            </div>
            <ThemeSwitch size="sm" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0f2347] dark:text-white">Langue de l'interface</div>
                <div className="text-[11px] text-slate-500">Français (officiel)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Settings View Button */}
        {onNavigate && (
          <div className="pt-2">
            <OreaButton
              variant="primary"
              size="md"
              onClick={() => onNavigate('parametres')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ouvrir la page Paramètres Complète</span>
              <ArrowRight className="w-4 h-4" />
            </OreaButton>
          </div>
        )}
      </div>
    </div>
  );
};
export default OreaSettingsTab;
