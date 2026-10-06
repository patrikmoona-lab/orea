import React, { useState } from 'react';
import {
  X,
  Search,
  ChevronDown,
  ChevronRight,
  HeartPulse,
  AlertCircle,
  Pill,
  Calendar,
  Dumbbell,
  Apple,
  GraduationCap,
  Bot,
  Heart,
  Home,
  PhoneCall,
  User,
  LogOut,
  UserCheck,
  Settings,
} from 'lucide-react';
import { NavSection } from '../types';
import { OREALogo } from './OREALogo';
import { useAuth } from '../context/AuthContext';
import { ThemeSwitch } from './common/ThemeSwitch';

interface MobileMenuProps {
  isOpen: boolean;
  activeNav: NavSection;
  onClose: () => void;
  onSelectNav: (section: NavSection) => void;
  onOpenSearch: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  activeNav,
  onClose,
  onSelectNav,
  onOpenSearch,
}) => {
  const { userProfile, isAuthenticated, logout } = useAuth();
  // Accordions for Santé, Bien-être, Étude in mobile drawer
  const [isSanteOpen, setIsSanteOpen] = useState(true);
  const [isBienEtreOpen, setIsBienEtreOpen] = useState(true);
  const [isEtudeOpen, setIsEtudeOpen] = useState(true);

  if (!isOpen) return null;

  const handleNavClick = (section: NavSection) => {
    onSelectNav(section);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white h-full shadow-2xl p-5 sm:p-6 flex flex-col justify-between overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <OREALogo
              variant="compact"
              size="sm"
              clickable={true}
              onClick={() => handleNavClick('accueil')}
            />

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Bar */}
          <div className="mt-4">
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#f0f7ff] border border-blue-100 text-[#0f2347] text-xs sm:text-sm text-left hover:bg-blue-100/60 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#2563eb]" />
              <span className="text-slate-500 font-medium">Rechercher symptômes, fiches santé...</span>
            </button>
          </div>

          {/* Navigation Sections */}
          <nav className="mt-5 space-y-2">
            
            {/* 1. Accueil */}
            <button
              onClick={() => handleNavClick('accueil')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left font-semibold text-sm transition-all cursor-pointer ${
                activeNav === 'accueil'
                  ? 'bg-[#0056d6] text-white shadow-xs'
                  : 'text-[#1e293b] hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4" />
                <span>Accueil</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeNav === 'accueil' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* 2. Section Santé (Regroupée) */}
            <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/40">
              <button
                onClick={() => setIsSanteOpen(!isSanteOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-left font-bold text-xs uppercase tracking-wider text-slate-600 hover:bg-slate-100/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-[#0056d6]">
                  <HeartPulse className="w-4 h-4" />
                  <span>Santé</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSanteOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSanteOpen && (
                <div className="p-1 space-y-1 bg-white border-t border-slate-100">
                  {/* Santé & Prévention */}
                  <button
                    onClick={() => handleNavClick('sante')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeNav === 'sante'
                        ? 'bg-blue-50 text-[#0056d6] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Santé & Prévention</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Symptômes */}
                  <button
                    onClick={() => handleNavClick('symptom_checker')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeNav === 'symptom_checker'
                        ? 'bg-blue-50 text-[#0056d6] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Vérificateur de Symptômes</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Encyclopédie */}
                  <button
                    onClick={() => handleNavClick('encyclopedie')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeNav === 'encyclopedie'
                        ? 'bg-blue-50 text-[#0056d6] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Encyclopédie Médicale</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Urgence 24/7 */}
                  <button
                    onClick={() => handleNavClick('urgence')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeNav === 'urgence'
                        ? 'bg-red-50 text-[#dc2626]'
                        : 'text-[#dc2626] hover:bg-red-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span>Urgence 24/7</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-red-400" />
                  </button>

                  {/* Médicaments */}
                  <button
                    onClick={() => handleNavClick('medicaments')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeNav === 'medicaments'
                        ? 'bg-blue-50 text-[#0056d6] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Médicaments & Armoire</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Agenda */}
                  <button
                    onClick={() => handleNavClick('agenda')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeNav === 'agenda'
                        ? 'bg-blue-50 text-[#0056d6] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Agenda Médical</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            {/* 3. Section Bien-être (Regroupée) */}
            <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/40">
              <button
                onClick={() => setIsBienEtreOpen(!isBienEtreOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-left font-bold text-xs uppercase tracking-wider text-slate-600 hover:bg-slate-100/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-orange-600">
                  <Dumbbell className="w-4 h-4" />
                  <span>Bien-être</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isBienEtreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isBienEtreOpen && (
                <div className="p-1 space-y-1 bg-white border-t border-slate-100">
                  {/* ÉNERGIE (Sport & Workout) */}
                  <button
                    onClick={() => handleNavClick('sport')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeNav === 'sport' || activeNav === 'workout'
                        ? 'bg-orange-50 text-orange-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>ÉNERGIE (Sport & Workout)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Nutrition & Terroir */}
                  <button
                    onClick={() => handleNavClick('nutrition')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeNav === 'nutrition'
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Nutrition & Terroir</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Hydratation */}
                  <button
                    onClick={() => handleNavClick('hydratation')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeNav === 'hydratation'
                        ? 'bg-cyan-50 text-[#00A6C7] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Calculateur d'Hydratation</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Habitudes */}
                  <button
                    onClick={() => handleNavClick('habitudes')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeNav === 'habitudes'
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Tracker d'Habitudes</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            {/* 4. Mon Cycle */}
            <button
              onClick={() => handleNavClick('cycle')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left font-semibold text-sm transition-all cursor-pointer ${
                activeNav === 'cycle'
                  ? 'bg-pink-600 text-white shadow-xs font-bold'
                  : 'text-pink-700 hover:bg-pink-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>Mon Cycle</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeNav === 'cycle' ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-700'
                }`}>
                  Femme
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeNav === 'cycle' ? 'text-white' : 'text-slate-400'}`} />
            </button>

            {/* 5. Section Organisation & Étude */}
            <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/40">
              <button
                onClick={() => setIsEtudeOpen(!isEtudeOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-left font-bold text-xs uppercase tracking-wider text-slate-600 hover:bg-slate-100/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-indigo-600">
                  <GraduationCap className="w-4 h-4" />
                  <span>Organisation & Étude</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isEtudeOpen ? 'rotate-180' : ''}`} />
              </button>

              {isEtudeOpen && (
                <div className="p-1 space-y-1 bg-white border-t border-slate-100">
                  <button
                    onClick={() => handleNavClick('education')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeNav === 'education'
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>BAC G2 & SYSCOHADA</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('planner')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeNav === 'planner'
                        ? 'bg-blue-50 text-[#0056d6] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Planner Dynamique</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('finance')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeNav === 'finance'
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Finance & Budget (FCFA)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('documents')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeNav === 'documents'
                        ? 'bg-blue-50 text-[#0056d6] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Coffre Documents</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('famille')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeNav === 'famille'
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Profils Famille</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              )}
            </div>



            {/* 7. Votre IA */}
            <button
              onClick={() => handleNavClick('assistant')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left font-bold text-sm transition-all cursor-pointer ${
                activeNav === 'assistant'
                  ? 'bg-gradient-to-r from-[#0056d6] to-[#00A6C7] text-white shadow-md'
                  : 'bg-blue-50 text-[#0056d6] border border-blue-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>Votre IA</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
              </div>
              <ChevronRight className={`w-4 h-4 ${activeNav === 'assistant' ? 'text-white' : 'text-blue-500'}`} />
            </button>

            {/* 8. Paramètres & Thème */}
            <div className="pt-1 space-y-2">
              <button
                onClick={() => handleNavClick('parametres')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left font-bold text-sm transition-all cursor-pointer ${
                  activeNav === 'parametres'
                    ? 'bg-[#0056d6] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 border border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-blue-600" />
                  <span>Paramètres</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${activeNav === 'parametres' ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* Theme switch in mobile menu */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Thème Jour / Nuit</span>
                <ThemeSwitch size="sm" />
              </div>
            </div>

            {/* 9. Account / Connexion */}
            <div className="pt-2">
              {isAuthenticated ? (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0B2F5B]">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>{userProfile.displayName || userProfile.email}</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleNavClick('mon_orea')}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-[#0056D6] text-white text-xs font-semibold text-center cursor-pointer"
                    >
                      Mon Espace
                    </button>
                    <button
                      onClick={async () => {
                        await logout();
                        handleNavClick('connexion');
                      }}
                      className="py-1.5 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick('auth')}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0056D6] text-white font-bold text-sm cursor-pointer shadow-2xs hover:bg-[#0044b2] transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Se connecter / S’inscrire</span>
                </button>
              )}
            </div>
          </nav>
        </div>

        {/* Footer info in Drawer with Emergency Call Shortcut */}
        <div className="pt-5 border-t border-slate-100 space-y-3">
          <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-red-700">Urgence vitale :</span>
            </div>
            <div className="flex gap-1.5">
              <a href="tel:15" className="px-2.5 py-1 rounded bg-[#dc2626] text-white font-bold text-xs">15</a>
              <a href="tel:112" className="px-2.5 py-1 rounded bg-slate-800 text-white font-bold text-xs">112</a>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-y-1 text-xs text-slate-500 pt-1">
            <button
              onClick={() => handleNavClick('confidentialite')}
              className="hover:text-[#0056d6] transition-colors cursor-pointer text-left"
            >
              Confidentialité
            </button>
            <span>•</span>
            <button
              onClick={() => handleNavClick('conditions_utilisation')}
              className="hover:text-[#0056d6] transition-colors cursor-pointer text-left"
            >
              Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => handleNavClick('preferences_cookies')}
              className="hover:text-[#0056d6] transition-colors cursor-pointer text-left"
            >
              Cookies
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            © {new Date().getFullYear()} OREA Santé. Tous droits réservés. Informations fiables sans prescription.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
