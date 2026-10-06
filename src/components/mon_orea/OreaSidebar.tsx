import React from 'react';
import {
  Sparkles,
  Heart,
  Activity,
  Apple,
  GraduationCap,
  Coins,
  Clock,
  Target,
  BarChart3,
  History,
  Bell,
  Bot,
  Search,
  FileText,
  User,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { NavSection, OreaUserProfile } from '../../types';
import { ADMIN_EMAIL } from '../../lib/firebase';

export type MonOreaInternalTab =
  | 'dashboard'
  | 'objectifs'
  | 'progression'
  | 'activite'
  | 'notifications'
  | 'ia_assistant'
  | 'recherche'
  | 'documents'
  | 'profil'
  | 'parametres'
  | 'securite'
  | 'aide';

interface OreaSidebarProps {
  currentTab: MonOreaInternalTab;
  onSelectTab: (tab: MonOreaInternalTab) => void;
  onNavigate: (section: NavSection) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  userProfile: OreaUserProfile;
  isAuthenticated: boolean;
  onLogout: () => void;
  moduleStatuses: {
    cycle: boolean;
    sport: boolean;
    nutrition: boolean;
    education: boolean;
    finance: boolean;
    planner: boolean;
  };
  activeNav?: NavSection;
}

export const OreaSidebar: React.FC<OreaSidebarProps> = ({
  currentTab,
  onSelectTab,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
  userProfile,
  isAuthenticated,
  onLogout,
  moduleStatuses,
  activeNav = 'mon_orea',
}) => {
  const userInitials = (
    (userProfile?.firstName?.[0] || 'O') + (userProfile?.lastName?.[0] || 'R')
  ).toUpperCase();

  const displayName =
    userProfile?.displayName ||
    `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() ||
    'Membre OREA';

  const handleTabClick = (tab: MonOreaInternalTab) => {
    onSelectTab(tab);
    if (tab === 'objectifs') {
      onNavigate('objectifs');
    } else if (tab === 'progression') {
      onNavigate('progression');
    } else if (tab === 'activite') {
      onNavigate('activite');
    } else if (tab === 'notifications') {
      onNavigate('notifications');
    } else {
      onNavigate('mon_orea');
    }
    onCloseMobile();
  };

  const isObjectifsActive = activeNav === 'objectifs' || (activeNav === 'mon_orea' && currentTab === 'objectifs');
  const isProgressionActive = activeNav === 'progression' || (activeNav === 'mon_orea' && currentTab === 'progression');
  const isActiviteActive = activeNav === 'activite' || (activeNav === 'mon_orea' && currentTab === 'activite');
  const isNotificationsActive = activeNav === 'notifications' || (activeNav === 'mon_orea' && currentTab === 'notifications');

  return (
    <>
      <aside
        className={`fixed left-0 top-0 bottom-0 z-30 w-72 sm:w-80 lg:w-[285px] h-dvh min-h-dvh bg-white border-r border-[#e2eaf4] flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 overflow-hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Main scrollable content area */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-5 space-y-6">
          {/* User Profile Card */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-3 select-none">
            <div className="w-9 h-9 rounded-lg bg-[#0056d6] text-white font-semibold text-sm flex items-center justify-center shrink-0">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-semibold text-[#0f2347] truncate leading-tight">
                {displayName}
              </h3>
              <span className="inline-block text-[#0056d6] text-[11px] font-semibold uppercase tracking-wider mt-0.5">
                Espace personnel
              </span>
            </div>
          </div>

          {/* SECTION: TABLEAU DE BORD */}
          <div>
            <p className="px-3 text-[13px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              TABLEAU DE BORD
            </p>
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-colors cursor-pointer ${
                activeNav === 'mon_orea' && currentTab === 'dashboard'
                  ? 'bg-[#0056d6] text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#0f2347]'
              }`}
            >
              <Sparkles className="w-[20px] h-[20px] shrink-0" />
              <span>Tableau de bord</span>
            </button>
          </div>

          {/* SECTION: MES ESPACES (6 Modules) */}
          <div>
            <p className="px-3 text-[13px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              MES ESPACES
            </p>
            <nav className="space-y-1.5">
              {/* 1. Cycle */}
              <button
                onClick={() => onNavigate('cycle')}
                className={`w-full flex items-center justify-between py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-colors group cursor-pointer ${
                  activeNav === 'cycle'
                    ? 'bg-pink-50 text-pink-900 font-semibold border-l-4 border-pink-500 rounded-l-none'
                    : 'text-slate-700 hover:bg-pink-50 hover:text-pink-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Heart
                    className={`w-[20px] h-[20px] shrink-0 ${
                      activeNav === 'cycle' ? 'text-pink-600' : 'text-pink-500'
                    }`}
                  />
                  <span className="truncate">Mon Cycle</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      moduleStatuses.cycle ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  <span
                    className={`text-[13px] font-semibold ${
                      activeNav === 'cycle' ? 'text-pink-800' : 'text-slate-400'
                    }`}
                  >
                    {moduleStatuses.cycle ? 'Actif' : 'À créer'}
                  </span>
                </div>
              </button>

              {/* 2. Sport */}
              <button
                onClick={() => onNavigate('sport')}
                className={`w-full flex items-center justify-between py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-colors group cursor-pointer ${
                  activeNav === 'sport' || activeNav === 'workout'
                    ? 'bg-orange-50 text-orange-900 font-semibold border-l-4 border-orange-500 rounded-l-none'
                    : 'text-slate-700 hover:bg-orange-50 hover:text-orange-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Activity
                    className={`w-[20px] h-[20px] shrink-0 ${
                      activeNav === 'sport' || activeNav === 'workout'
                        ? 'text-orange-600'
                        : 'text-orange-500'
                    }`}
                  />
                  <span className="truncate">Énergie & Vitalité</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      moduleStatuses.sport ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  <span
                    className={`text-[13px] font-semibold ${
                      activeNav === 'sport' || activeNav === 'workout'
                        ? 'text-orange-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {moduleStatuses.sport ? 'Actif' : 'À créer'}
                  </span>
                </div>
              </button>

              {/* 3. Nutrition */}
              <button
                onClick={() => onNavigate('nutrition')}
                className={`w-full flex items-center justify-between py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-colors group cursor-pointer ${
                  activeNav === 'nutrition'
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border-l-4 border-emerald-500 rounded-l-none'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Apple
                    className={`w-[20px] h-[20px] shrink-0 ${
                      activeNav === 'nutrition' ? 'text-emerald-600' : 'text-emerald-500'
                    }`}
                  />
                  <span className="truncate">Nutrition & Terroir</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      moduleStatuses.nutrition ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  <span
                    className={`text-[13px] font-semibold ${
                      activeNav === 'nutrition' ? 'text-emerald-800' : 'text-slate-400'
                    }`}
                  >
                    {moduleStatuses.nutrition ? 'Actif' : 'À créer'}
                  </span>
                </div>
              </button>

              {/* 4. BAC G2 */}
              <button
                onClick={() => onNavigate('education')}
                className={`w-full flex items-center justify-between py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-colors group cursor-pointer ${
                  activeNav === 'education' || activeNav === 'evolution' || activeNav === 'eloquence' || activeNav === 'etudes'
                    ? 'bg-indigo-50 text-indigo-900 font-semibold border-l-4 border-indigo-500 rounded-l-none'
                    : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <GraduationCap
                    className={`w-[20px] h-[20px] shrink-0 ${
                      activeNav === 'education' || activeNav === 'evolution' || activeNav === 'eloquence' || activeNav === 'etudes'
                        ? 'text-indigo-600'
                        : 'text-indigo-500'
                    }`}
                  />
                  <span className="truncate">BAC G2 & Éloquence</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      moduleStatuses.education ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  <span
                    className={`text-[13px] font-semibold ${
                      activeNav === 'education' || activeNav === 'evolution' || activeNav === 'eloquence' || activeNav === 'etudes'
                        ? 'text-indigo-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {moduleStatuses.education ? 'Actif' : 'À créer'}
                  </span>
                </div>
              </button>

              {/* 5. Finance */}
              <button
                onClick={() => onNavigate('finance')}
                className={`w-full flex items-center justify-between py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-colors group cursor-pointer ${
                  activeNav === 'finance'
                    ? 'bg-teal-50 text-teal-900 font-semibold border-l-4 border-teal-500 rounded-l-none'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Coins
                    className={`w-[20px] h-[20px] shrink-0 ${
                      activeNav === 'finance' ? 'text-teal-600' : 'text-emerald-600'
                    }`}
                  />
                  <span className="truncate">Finance & Budget</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      moduleStatuses.finance ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  <span
                    className={`text-[13px] font-semibold ${
                      activeNav === 'finance' ? 'text-teal-800' : 'text-slate-400'
                    }`}
                  >
                    {moduleStatuses.finance ? 'Actif' : 'À créer'}
                  </span>
                </div>
              </button>

              {/* 6. Planner */}
              <button
                onClick={() => onNavigate('planner')}
                className={`w-full flex items-center justify-between py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-colors group cursor-pointer ${
                  activeNav === 'planner'
                    ? 'bg-blue-50 text-blue-900 font-semibold border-l-4 border-blue-500 rounded-l-none'
                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Clock
                    className={`w-[20px] h-[20px] shrink-0 ${
                      activeNav === 'planner' ? 'text-blue-600' : 'text-blue-500'
                    }`}
                  />
                  <span className="truncate">OREA Planner</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      moduleStatuses.planner ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  <span
                    className={`text-[13px] font-semibold ${
                      activeNav === 'planner' ? 'text-blue-800' : 'text-slate-400'
                    }`}
                  >
                    {moduleStatuses.planner ? 'Actif' : 'À créer'}
                  </span>
                </div>
              </button>
            </nav>
          </div>

          {/* SECTION: MON SUIVI */}
          <div>
            <p className="px-3 text-[13px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              MON SUIVI
            </p>
            <nav className="space-y-1.5">
              <button
                onClick={() => handleTabClick('objectifs')}
                className={`w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-all cursor-pointer ${
                  isObjectifsActive
                    ? 'bg-[#0056d6] text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0f2347]'
                }`}
              >
                <Target className="w-[20px] h-[20px] shrink-0" />
                <span>Objectifs</span>
              </button>

              <button
                onClick={() => handleTabClick('progression')}
                className={`w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-all cursor-pointer ${
                  isProgressionActive
                    ? 'bg-[#0056d6] text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0f2347]'
                }`}
              >
                <BarChart3 className="w-[20px] h-[20px] shrink-0" />
                <span>Progression</span>
              </button>

              <button
                onClick={() => handleTabClick('activite')}
                className={`w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-all cursor-pointer ${
                  isActiviteActive
                    ? 'bg-[#0056d6] text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0f2347]'
                }`}
              >
                <History className="w-[20px] h-[20px] shrink-0" />
                <span>Activité</span>
              </button>

              <button
                onClick={() => handleTabClick('notifications')}
                className={`w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-all cursor-pointer ${
                  isNotificationsActive
                    ? 'bg-[#0056d6] text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0f2347]'
                }`}
              >
                <Bell className="w-[20px] h-[20px] shrink-0" />
                <span>Notifications</span>
              </button>
            </nav>
          </div>

          {/* SECTION: OUTILS */}
          <div>
            <p className="px-3 text-[13px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              OUTILS
            </p>
            <nav className="space-y-1.5">
              <button
                onClick={() => handleTabClick('ia_assistant')}
                className={`w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-colors cursor-pointer ${
                  currentTab === 'ia_assistant'
                    ? 'bg-purple-600 text-white font-semibold shadow-2xs'
                    : 'text-purple-700 bg-purple-50/50 hover:bg-purple-100'
                }`}
              >
                <Bot className="w-[20px] h-[20px] shrink-0" />
                <span>Votre IA</span>
              </button>

              <button
                onClick={() => handleTabClick('recherche')}
                className={`w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-colors cursor-pointer ${
                  currentTab === 'recherche'
                    ? 'bg-[#0056d6] text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0f2347]'
                }`}
              >
                <Search className="w-[20px] h-[20px] shrink-0" />
                <span>Recherche</span>
              </button>

              <button
                onClick={() => handleTabClick('documents')}
                className={`w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-colors cursor-pointer ${
                  currentTab === 'documents'
                    ? 'bg-[#0056d6] text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0f2347]'
                }`}
              >
                <FileText className="w-[20px] h-[20px] shrink-0" />
                <span>Documents</span>
              </button>
            </nav>
          </div>

          {/* SECTION: AUTRES - Pushed to bottom with mt-auto */}
          <div className="mt-auto pt-5 border-t border-slate-100">
            <p className="px-3 text-[13px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              AUTRES
            </p>
            <nav className="space-y-1.5">
              <button
                onClick={() => handleTabClick('profil')}
                className={`w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-colors cursor-pointer ${
                  currentTab === 'profil'
                    ? 'bg-[#0056d6] text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0f2347]'
                }`}
              >
                <User className="w-[20px] h-[20px] shrink-0" />
                <span>Mon profil</span>
              </button>

              <button
                onClick={() => handleTabClick('parametres')}
                className={`w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-colors cursor-pointer ${
                  currentTab === 'parametres'
                    ? 'bg-[#0056d6] text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0f2347]'
                }`}
              >
                <Settings className="w-[20px] h-[20px] shrink-0" />
                <span>Paramètres</span>
              </button>

              <button
                onClick={() => handleTabClick('securite')}
                className={`w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-colors cursor-pointer ${
                  currentTab === 'securite'
                    ? 'bg-[#0056d6] text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#0f2347]'
                }`}
              >
                <Shield className="w-[20px] h-[20px] shrink-0" />
                <span>Sécurité</span>
              </button>

              {userProfile &&
                (userProfile.role === 'admin' ||
                  userProfile.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) && (
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium transition-colors cursor-pointer ${
                      activeNav === 'admin'
                        ? 'bg-amber-600 text-white font-semibold shadow-2xs'
                        : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/60'
                    }`}
                  >
                    <Shield className="w-[20px] h-[20px] shrink-0 text-amber-600" />
                    <span>Console Admin</span>
                  </button>
                )}

              <button
                onClick={() => handleTabClick('aide')}
                className="w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-[20px] h-[20px] text-slate-500 shrink-0" />
                <span>Aide & Support</span>
              </button>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    onLogout();
                    onCloseMobile();
                  }}
                  className="w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-[20px] h-[20px] shrink-0" />
                  <span>Déconnexion</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('auth')}
                  className="w-full flex items-center gap-3 py-[9px] px-3.5 rounded-xl text-[15px] font-medium text-[#0056d6] hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <User className="w-[20px] h-[20px] shrink-0" />
                  <span>Se connecter</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-20 lg:hidden"
        />
      )}
    </>
  );
};
