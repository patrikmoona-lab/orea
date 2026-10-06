import React, { useState } from 'react';
import {
  Menu,
  Sparkles,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { OREALogo } from '../OREALogo';
import { OreaUserProfile, NavSection } from '../../types';
import { MonOreaInternalTab } from './OreaSidebar';

interface OreaHeaderProps {
  userProfile: OreaUserProfile;
  isAuthenticated: boolean;
  onNavigate: (section: NavSection) => void;
  onSelectTab: (tab: MonOreaInternalTab) => void;
  onToggleMobileSidebar: () => void;
  onBackToHome: () => void;
  onLogout: () => void;
  unreadNotifsCount: number;
  openSearchModal: () => void;
}

export const OreaHeader: React.FC<OreaHeaderProps> = ({
  userProfile,
  isAuthenticated,
  onNavigate,
  onSelectTab,
  onToggleMobileSidebar,
  onBackToHome,
  onLogout,
  unreadNotifsCount,
  openSearchModal,
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const userFirstName = userProfile?.firstName || 'Membre OREA';
  const userInitials = (
    (userProfile?.firstName?.[0] || 'O') + (userProfile?.lastName?.[0] || 'R')
  ).toUpperCase();

  return (
    <header className="bg-white border-b border-[#e2eaf4] sticky top-0 z-40 shadow-2xs w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Trigger + Logo + Mon Espace */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-[#0056d6] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Ouvrir le menu latéral"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={onBackToHome}>
            <OREALogo size="sm" showTagline={false} />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056d6] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Mon Espace</span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div
            onClick={openSearchModal}
            className="w-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 rounded-2xl px-3.5 py-2 flex items-center justify-between text-xs text-slate-500 cursor-pointer transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-[#0056d6] transition-colors" />
              <span>Rechercher dans OREA (modules, IA, profil)...</span>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-mono text-slate-400">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right: Status, Notifications, Profile User Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={openSearchModal}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-[#0056d6] hover:bg-slate-100 transition-colors"
            title="Rechercher"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Connection Status Badge */}
          <div
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
              isAuthenticated
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isAuthenticated ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{isAuthenticated ? 'Connecté • Sync' : 'Mode Visiteur'}</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-[#0056d6] hover:bg-slate-100 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Popover Panel */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h4 className="text-sm font-bold text-[#0f2347]">Notifications OREA</h4>
                  <button
                    onClick={() => {
                      onSelectTab('notifications');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 rounded-full transition-colors"
                  >
                    Voir tout
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs">
                    <div className="font-bold text-[#0f2347]">Espace OREA synchronisé</div>
                    <p className="text-slate-600 mt-0.5">
                      Données sécurisées dans Firestore ({userProfile?.email || 'Membre'}).
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Récemment</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="font-bold text-[#0f2347]">Fondateur Officiel d'OREA</div>
                    <p className="text-slate-600 mt-0.5">
                      Mr Tsoumou Patrick Bonheur. « Mieux comprendre. Mieux vivre. Mieux évoluer. »
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge Button */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0f2347] transition-all cursor-pointer border border-slate-200/80"
            >
              <div className="w-7 h-7 rounded-lg bg-[#0056d6] text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
                {userInitials}
              </div>
              <span className="hidden sm:inline-block text-xs font-bold max-w-[120px] truncate">
                {userFirstName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
            </button>

            {/* User Dropdown */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="p-3 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                  <p className="text-xs font-bold text-[#0f2347] truncate">
                    {userProfile?.displayName || userFirstName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{userProfile?.email}</p>
                </div>
                <button
                  onClick={() => {
                    onSelectTab('profil');
                    setIsUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Mon profil</span>
                </button>
                <button
                  onClick={() => {
                    onSelectTab('parametres');
                    setIsUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Paramètres</span>
                </button>
                <div className="my-1 border-t border-slate-100" />
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      onLogout();
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onNavigate('auth');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#0056d6] hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>Se connecter</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
