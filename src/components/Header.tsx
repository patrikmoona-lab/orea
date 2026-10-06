import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Menu,
  Bot,
  ChevronDown,
  HeartPulse,
  AlertCircle,
  Pill,
  Calendar,
  Dumbbell,
  Apple,
  GraduationCap,
  Stethoscope,
  BookOpen,
  Droplets,
  Activity,
  Clock,
  FolderOpen,
  Coins,
  Users,
  User,
  LogOut,
  UserCheck,
  Settings,
} from 'lucide-react';
import { NavSection } from '../types';
import { OREALogo } from './OREALogo';
import { OreaButton } from './common/OreaButton';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeNav: NavSection;
  onSelectNav: (section: NavSection) => void;
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
}

type DropdownId = 'sante' | 'bien-etre' | 'etude' | null;

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  onSelectNav,
  onOpenSearch,
  onToggleMobileMenu,
}) => {
  const { userProfile, isAuthenticated, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (dropdown: DropdownId) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const handleToggleClick = (dropdown: DropdownId) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };

  const handleSelectSubItem = (section: NavSection) => {
    onSelectNav(section);
    setOpenDropdown(null);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Determine active states for dropdown parents
  const isSanteActive = ['sante', 'urgence', 'medicaments', 'agenda', 'symptom_checker', 'encyclopedie', 'bilan_pdf'].includes(activeNav);
  const isBienEtreActive = ['sport', 'workout', 'nutrition', 'hydratation', 'habitudes'].includes(activeNav);
  const isEtudeActive = ['education', 'planner', 'finance', 'documents', 'famille'].includes(activeNav);

  return (
    <header className="w-full bg-white/98 backdrop-blur-md border-b border-[#e2edf8] sticky top-0 z-40 transition-all select-none shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 h-13 sm:h-14 lg:h-16 flex items-center justify-between gap-2">
        
        {/* =========================================================================
            1. LOGO OREA (Toujours visible et parfaitement dimensionné)
        ========================================================================= */}
        <div className="shrink-0 flex items-center">
          <OREALogo
            variant="compact"
            size="sm"
            showTagline={false}
            clickable={true}
            onClick={() => {
              onSelectNav('accueil');
              setOpenDropdown(null);
            }}
          />
        </div>

        {/* =========================================================================
            2. NAVIGATION PRINCIPALE DESKTOP / TABLETTE :
               Accueil → Santé ▾ → Bien-être ▾ → Mon Cycle → Étude ▾ → Tarifs PRO
        ========================================================================= */}
        <nav
          ref={navRef}
          aria-label="Navigation principale"
          className="hidden lg:flex items-center justify-center flex-1 min-w-0 gap-1 xl:gap-1.5 px-2"
        >
          {/* 1. Accueil */}
          <button
            type="button"
            onClick={() => {
              onSelectNav('accueil');
              setOpenDropdown(null);
            }}
            className={`relative inline-flex items-center justify-center h-8.5 px-3 rounded-xl text-[13px] xl:text-[13.5px] font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeNav === 'accueil'
                ? 'text-[#0056d6] font-bold bg-[#eff6ff]'
                : 'text-[#334155] hover:text-[#0056d6] hover:bg-[#f8fafc]'
            }`}
          >
            <span>Accueil</span>
            {activeNav === 'accueil' && (
              <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#0056d6] rounded-full" />
            )}
          </button>

          {/* 2. Santé ▾ (Santé, Urgence, Médicaments, Agenda) */}
          <div
            className="relative shrink-0"
            onMouseEnter={() => handleMouseEnter('sante')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => handleToggleClick('sante')}
              aria-expanded={openDropdown === 'sante'}
              className={`relative inline-flex items-center justify-center gap-1.5 h-8.5 px-3 rounded-xl text-[13px] xl:text-[13.5px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSanteActive || openDropdown === 'sante'
                  ? 'text-[#0056d6] font-bold bg-[#eff6ff]'
                  : 'text-[#334155] hover:text-[#0056d6] hover:bg-[#f8fafc]'
              }`}
            >
              <span>Santé</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'sante' ? 'rotate-180 text-[#0056d6]' : 'text-slate-400'
                }`}
              />
              {isSanteActive && (
                <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#0056d6] rounded-full" />
              )}
            </button>

            {/* Dropdown Menu Santé */}
            {openDropdown === 'sante' && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Item 1 : Santé & Prévention */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('sante')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    activeNav === 'sante'
                      ? 'bg-blue-50/80 text-[#0056d6]'
                      : 'hover:bg-slate-50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0056d6] flex items-center justify-center shrink-0 mt-0.5">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Santé & Prévention</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">Fiches conseils & décryptage</div>
                  </div>
                </button>

                {/* Item 2 : Symptômes */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('symptom_checker')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer mt-1 ${
                    activeNav === 'symptom_checker'
                      ? 'bg-blue-50/80 text-[#0056d6]'
                      : 'hover:bg-slate-50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 text-[#00A6C7] flex items-center justify-center shrink-0 mt-0.5">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Vérificateur de Symptômes</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">Évaluation guidée & tri d'urgence</div>
                  </div>
                </button>

                {/* Item 3 : Encyclopédie */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('encyclopedie')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer mt-1 ${
                    activeNav === 'encyclopedie'
                      ? 'bg-blue-50/80 text-[#0056d6]'
                      : 'hover:bg-slate-50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0056d6] flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Encyclopédie Médicale</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">14 catégories cliniques complètes</div>
                  </div>
                </button>

                {/* Item 4 : Urgence 24/7 */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('urgence')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer mt-1 ${
                    activeNav === 'urgence'
                      ? 'bg-red-50 text-[#dc2626]'
                      : 'hover:bg-red-50/50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-[#dc2626] flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#dc2626] flex items-center gap-1.5">
                      <span>Urgence 24/7</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    </div>
                    <div className="text-[11px] text-red-600/80 line-clamp-1">Numéros d'urgence & gestes vitaux</div>
                  </div>
                </button>

                {/* Item 5 : Médicaments */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('medicaments')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer mt-1 ${
                    activeNav === 'medicaments'
                      ? 'bg-blue-50/80 text-[#0056d6]'
                      : 'hover:bg-slate-50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Médicaments & Armoire</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">Posologies & rappels quotidiens</div>
                  </div>
                </button>

                {/* Item 6 : Agenda Médical */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('agenda')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer mt-1 ${
                    activeNav === 'agenda'
                      ? 'bg-blue-50/80 text-[#0056d6]'
                      : 'hover:bg-slate-50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Agenda Médical</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">Rappels de consultations & soins</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 3. Bien-être ▾ (Sport, Nutrition, Hydratation, Habitudes) */}
          <div
            className="relative shrink-0"
            onMouseEnter={() => handleMouseEnter('bien-etre')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => handleToggleClick('bien-etre')}
              aria-expanded={openDropdown === 'bien-etre'}
              className={`relative inline-flex items-center justify-center gap-1.5 h-8.5 px-3 rounded-xl text-[13px] xl:text-[13.5px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                isBienEtreActive || openDropdown === 'bien-etre'
                  ? 'text-orange-600 font-bold bg-orange-50'
                  : 'text-[#334155] hover:text-orange-600 hover:bg-orange-50/50'
              }`}
            >
              <span>Bien-être</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'bien-etre' ? 'rotate-180 text-orange-600' : 'text-slate-400'
                }`}
              />
              {isBienEtreActive && (
                <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-orange-600 rounded-full" />
              )}
            </button>

            {/* Dropdown Menu Bien-être */}
            {openDropdown === 'bien-etre' && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Item 1 : Énergie (Sport & Workout) */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('sport')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    activeNav === 'sport' || activeNav === 'workout'
                      ? 'bg-orange-50 text-orange-700 font-bold'
                      : 'hover:bg-slate-50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">ÉNERGIE (Sport & Workout)</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">Entraînements & vitalité au poids du corps</div>
                  </div>
                </button>

                {/* Item 2 : Nutrition & Terroir */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('nutrition')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer mt-1 ${
                    activeNav === 'nutrition'
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'hover:bg-slate-50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Apple className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Nutrition & Terroir</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">Super-aliments africains & équilibre</div>
                  </div>
                </button>

                {/* Item 3 : Hydratation */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('hydratation')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer mt-1 ${
                    activeNav === 'hydratation'
                      ? 'bg-cyan-50 text-cyan-700 font-bold'
                      : 'hover:bg-slate-50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-[#00A6C7] flex items-center justify-center shrink-0 mt-0.5">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Calculateur d'Hydratation</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">Objectif personnalisé & jauge live</div>
                  </div>
                </button>

                {/* Item 4 : Habitudes */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('habitudes')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer mt-1 ${
                    activeNav === 'habitudes'
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'hover:bg-slate-50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Tracker d'Habitudes</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">Routines quotidiennes & séries</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 4. Mon Cycle */}
          <button
            type="button"
            onClick={() => {
              onSelectNav('cycle');
              setOpenDropdown(null);
            }}
            className={`relative inline-flex items-center justify-center h-8.5 px-3 rounded-xl text-[13px] xl:text-[13.5px] font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeNav === 'cycle'
                ? 'text-pink-600 font-bold bg-pink-50'
                : 'text-[#334155] hover:text-pink-600 hover:bg-pink-50/50'
            }`}
          >
            <span>Mon Cycle</span>
            {activeNav === 'cycle' && (
              <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-pink-600 rounded-full" />
            )}
          </button>

          {/* 5. Organisation & Étude ▾ */}
          <div
            className="relative shrink-0"
            onMouseEnter={() => handleMouseEnter('etude')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => handleToggleClick('etude')}
              aria-expanded={openDropdown === 'etude'}
              className={`relative inline-flex items-center justify-center gap-1.5 h-8.5 px-3 rounded-xl text-[13px] xl:text-[13.5px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                isEtudeActive || openDropdown === 'etude'
                  ? 'text-indigo-600 font-bold bg-indigo-50'
                  : 'text-[#334155] hover:text-indigo-600 hover:bg-indigo-50/50'
              }`}
            >
              <span>Organisation & Étude</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'etude' ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                }`}
              />
              {isEtudeActive && (
                <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-indigo-600 rounded-full" />
              )}
            </button>

            {/* Dropdown Menu Étude */}
            {openDropdown === 'etude' && (
              <div className="absolute top-full left-0 mt-1.5 w-68 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Item 1 : BAC G2 */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('education')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    activeNav === 'education'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'hover:bg-slate-50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">BAC G2 & SYSCOHADA</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">Fiches de révision & simulateur</div>
                  </div>
                </button>

                {/* Item 2 : Planner */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('planner')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer mt-1 ${
                    activeNav === 'planner'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'hover:bg-slate-50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0056d6] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Planner Dynamique</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">Journée 07h à 21h & blocs prioritaires</div>
                  </div>
                </button>

                {/* Item 3 : Finance */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('finance')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer mt-1 ${
                    activeNav === 'finance'
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'hover:bg-slate-50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Finance & Budget (FCFA)</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">Règle 50/30/20 & épargne santé</div>
                  </div>
                </button>

                {/* Item 4 : Documents */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('documents')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer mt-1 ${
                    activeNav === 'documents'
                      ? 'bg-blue-50 text-[#0056d6] font-bold'
                      : 'hover:bg-slate-50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0056d6] flex items-center justify-center shrink-0 mt-0.5">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Coffre Documents</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">Bilans, ordonnances & certificats</div>
                  </div>
                </button>

                {/* Item 5 : Profils Famille */}
                <button
                  type="button"
                  onClick={() => handleSelectSubItem('famille')}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer mt-1 ${
                    activeNav === 'famille'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'hover:bg-slate-50 text-[#1e293b]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Profils Famille</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">Jusqu’à 4 profils isolés étanches</div>
                  </div>
                </button>
              </div>
            )}
          </div>


        </nav>

        {/* =========================================================================
            3. ACTIONS DROITES :
               Mobile: [Votre IA] [☰]
               Desktop: [Votre IA] [Recherche] [Menu]
        ========================================================================= */}
        <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
          
          {/* Votre IA (Toujours accessible et visible sur mobile, tablette et desktop avec OreaButton) */}
          <OreaButton
            variant="ai"
            size="xs"
            onClick={() => {
              onSelectNav('assistant');
              setOpenDropdown(null);
            }}
            icon={<Bot className="w-3.5 h-3.5 text-cyan-300" />}
            className="font-bold whitespace-nowrap"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Votre IA</span>
            </span>
          </OreaButton>

          {/* Account status or Connexion button */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => onSelectNav('mon_orea')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer border border-slate-200/80"
              title="Accéder à Mon Espace OREA"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="max-w-[100px] truncate">{userProfile.firstName || userProfile.displayName}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSelectNav('auth')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0056D6] hover:bg-[#0044b2] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>Connexion</span>
            </button>
          )}

          {/* Recherche (Desktop / Tablette) */}
          <button
            id="btn-search-header"
            type="button"
            onClick={() => {
              setOpenDropdown(null);
              onOpenSearch();
            }}
            aria-label="Rechercher des symptômes ou informations de santé"
            className="hidden sm:inline-flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 text-[#334155] hover:text-[#0056d6] hover:bg-[#eff6ff] rounded-xl transition-colors cursor-pointer shrink-0"
            title="Rechercher"
          >
            <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={2} />
          </button>

          {/* Menu Hamburger [☰] (Mobile, Tablette, Desktop) */}
          <button
            id="btn-menu-header"
            type="button"
            onClick={() => {
              setOpenDropdown(null);
              onToggleMobileMenu();
            }}
            aria-label="Menu principal"
            className="inline-flex items-center justify-center w-8.5 h-8.5 text-[#1e293b] hover:text-[#0056d6] hover:bg-[#eff6ff] rounded-xl transition-colors cursor-pointer shrink-0 ml-0.5"
            title="Ouvrir toutes les rubriques OREA"
          >
            <Menu className="w-5 h-5" strokeWidth={2.2} />
          </button>

          {/* Raccourci Paramètres (Settings) — Tout à droite de l'écran */}
          <button
            id="btn-settings-header"
            type="button"
            onClick={() => {
              setOpenDropdown(null);
              onSelectNav('parametres');
            }}
            aria-label="Accéder aux Paramètres OREA"
            className={`inline-flex items-center justify-center w-8.5 h-8.5 rounded-xl transition-all cursor-pointer shrink-0 ml-0.5 ${
              activeNav === 'parametres'
                ? 'bg-[#0056d6] text-white shadow-xs'
                : 'text-[#334155] dark:text-slate-300 hover:text-[#0056d6] dark:hover:text-blue-400 hover:bg-[#eff6ff] dark:hover:bg-slate-800'
            }`}
            title="Paramètres de l'application"
          >
            <Settings className="w-4.5 h-4.5" strokeWidth={2} />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
