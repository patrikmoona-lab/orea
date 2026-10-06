import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Heart,
  Activity,
  Apple,
  GraduationCap,
  Coins,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Target,
  CheckCircle2,
  Calendar,
  Zap,
  HelpCircle,
  Search,
  X,
} from 'lucide-react';
import { NavSection, OreaUserProfile } from '../types';
import { OreaButton } from './common/OreaButton';
import {
  isModuleConfigured,
  getModuleProfile,
  syncModulesFromFirestore,
} from '../utils/oreaProfileStorage';
import { useAuth } from '../context/AuthContext';
import { logUserActivity } from '../lib/firebase';

// Sub-components
import { OreaSidebar, MonOreaInternalTab } from './mon_orea/OreaSidebar';
import { OreaHeader } from './mon_orea/OreaHeader';
import { OreaObjectivesTab } from './mon_orea/OreaObjectivesTab';
import { OreaProgressionTab } from './mon_orea/OreaProgressionTab';
import { OreaActivityTab } from './mon_orea/OreaActivityTab';
import { OreaNotificationsTab } from './mon_orea/OreaNotificationsTab';
import { OreaDocumentsTab } from './mon_orea/OreaDocumentsTab';
import { OreaProfileTab } from './mon_orea/OreaProfileTab';
import { OreaSettingsTab } from './mon_orea/OreaSettingsTab';
import { OreaSecurityTab } from './mon_orea/OreaSecurityTab';
import { OreaAiAssistantTab } from './mon_orea/OreaAiAssistantTab';
import { OreaDashboardAiCard } from './mon_orea/OreaDashboardAiCard';

// Workspace Module Views
import { OreaCycleView } from './OreaCycleView';
import { OreaWorkoutView } from './OreaWorkoutView';
import { OreaNutritionView } from './OreaNutritionView';
import { OreaEducationView } from './OreaEducationView';
import { OreaFinanceView } from './OreaFinanceView';
import { OreaPlannerView } from './OreaPlannerView';

interface OreaMonOreaDashboardProps {
  currentUserProfile: OreaUserProfile;
  onNavigate: (section: NavSection) => void;
  onBackToHome: () => void;
  activeNav?: NavSection;
}

export const OreaMonOreaDashboard: React.FC<OreaMonOreaDashboardProps> = ({
  currentUserProfile,
  onNavigate,
  onBackToHome,
  activeNav = 'mon_orea',
}) => {
  const { userProfile, isAuthenticated, logout, reloadProfile } = useAuth();
  const [currentTab, setCurrentTab] = useState<MonOreaInternalTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [syncTick, setSyncTick] = useState(0);

  // Sync internal tab state with activeNav
  useEffect(() => {
    if (activeNav === 'objectifs') setCurrentTab('objectifs');
    else if (activeNav === 'progression') setCurrentTab('progression');
    else if (activeNav === 'activite') setCurrentTab('activite');
    else if (activeNav === 'notifications') setCurrentTab('notifications');
    else if (activeNav === 'profil') setCurrentTab('profil');
    else if (activeNav === 'parametres') setCurrentTab('parametres');
  }, [activeNav]);

  // Sync with Firestore when valid authenticated UID is available
  useEffect(() => {
    if (userProfile?.uid && userProfile.uid !== 'guest-user' && !userProfile.uid.startsWith('guest_') && userProfile.uid !== 'anonymous_user') {
      syncModulesFromFirestore(userProfile.uid).then(() => {
        setSyncTick((t) => t + 1);
      });
    }
  }, [userProfile?.uid]);

  // Read module status from local cache (synchronized from Firestore)
  const isCycleConfigured = isModuleConfigured('cycle');
  const isSportConfigured = isModuleConfigured('sport');
  const isNutritionConfigured = isModuleConfigured('nutrition');
  const isEducationConfigured = isModuleConfigured('education');
  const isFinanceConfigured = isModuleConfigured('finance');
  const isPlannerConfigured = isModuleConfigured('planner');

  const moduleStatuses = {
    cycle: isCycleConfigured,
    sport: isSportConfigured,
    nutrition: isNutritionConfigured,
    education: isEducationConfigured,
    finance: isFinanceConfigured,
    planner: isPlannerConfigured,
  };

  const configuredCount = Object.values(moduleStatuses).filter(Boolean).length;
  const globalCompletionRate = Math.round((configuredCount / 6) * 100);

  // Profile data
  const cycleProfile = getModuleProfile('cycle')?.answers || {};
  const sportProfile = getModuleProfile('sport')?.answers || {};
  const nutritionProfile = getModuleProfile('nutrition')?.answers || {};
  const educationProfile = getModuleProfile('education')?.answers || {};
  const financeProfile = getModuleProfile('finance')?.answers || {};
  const plannerProfile = getModuleProfile('planner')?.answers || {};

  const userFirstName =
    userProfile?.firstName ||
    cycleProfile.pseudo ||
    sportProfile.pseudo ||
    'Membre OREA';

  // Global search filtering
  const searchableItems = [
    { title: 'Mon Cycle', section: 'cycle', category: 'Espace', desc: 'Suivi de santé féminine et fertilité' },
    { title: 'Sport & Workout', section: 'sport', category: 'Espace', desc: 'Programme calisthenics et renforcement' },
    { title: 'Nutrition & Terroir', section: 'nutrition', category: 'Espace', desc: 'Alimentation équilibrée africaine' },
    { title: 'BAC G2 & Éloquence', section: 'education', category: 'Espace', desc: 'SYSCOHADA et révisions baccalauréat' },
    { title: 'Finance & Budget', section: 'finance', category: 'Espace', desc: 'Gestion des dépenses et épargne FCFA' },
    { title: 'OREA Planner', section: 'planner', category: 'Espace', desc: 'Planning et organisation quotidienne' },
    { title: 'Objectifs', tab: 'objectifs', category: 'Outil', desc: 'Suivi de vos objectifs stratégiques' },
    { title: 'Votre IA OREA', tab: 'ia_assistant', category: 'Outil', desc: 'Assistant virtuel intelligent Gemini' },
    { title: 'Documents & PDF', tab: 'documents', category: 'Outil', desc: 'Génération de bilans de santé et synthèses' },
    { title: 'Mon Profil', tab: 'profil', category: 'Compte', desc: 'Informations personnelles et coordonnées' },
  ];

  const filteredSearch = searchQuery.trim()
    ? searchableItems.filter(
        (i) =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchableItems;

  const handleQuickAction = async (action: string) => {
    if (!userProfile?.uid) return;
    switch (action) {
      case 'create_space':
        onNavigate('cycle');
        break;
      case 'add_task':
        onNavigate('planner');
        break;
      case 'add_expense':
        onNavigate('finance');
        break;
      case 'add_workout':
        onNavigate('sport');
        break;
      case 'add_meal':
        onNavigate('nutrition');
        break;
      case 'study':
        onNavigate('education');
        break;
      case 'add_objective':
        setCurrentTab('objectifs');
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('connexion');
    } catch (err) {
      console.error('[OreaMonOreaDashboard] Logout error:', err);
      onNavigate('connexion');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc] text-[#0f2347] flex font-sans">
      {/* Sidebar Navigation */}
      <OreaSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onNavigate={onNavigate}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        userProfile={userProfile || currentUserProfile}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        moduleStatuses={moduleStatuses}
        activeNav={activeNav}
      />

      {/* Right Content Column */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen lg:pl-[285px]">
        {/* Header Bar */}
        <OreaHeader
          userProfile={userProfile || currentUserProfile}
          isAuthenticated={isAuthenticated}
          onNavigate={onNavigate}
          onSelectTab={setCurrentTab}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onBackToHome={onBackToHome}
          onLogout={handleLogout}
          unreadNotifsCount={1}
          openSearchModal={() => setIsSearchModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Active Space Workspace Views */}
          {activeNav === 'cycle' && (
            <OreaCycleView
              currentUserProfile={userProfile || currentUserProfile}
              onBackToHome={onBackToHome}
              onNavigateToSante={() => onNavigate('sante')}
              onNavigateToSos={() => onNavigate('urgence')}
            />
          )}

          {(activeNav === 'sport' || activeNav === 'workout' || activeNav === 'forme') && (
            <OreaWorkoutView
              onBackToHome={onBackToHome}
            />
          )}

          {activeNav === 'nutrition' && (
            <OreaNutritionView
              onBackToHome={onBackToHome}
            />
          )}

          {(activeNav === 'education' || activeNav === 'evolution' || activeNav === 'eloquence' || activeNav === 'etudes') && (
            <OreaEducationView
              currentUserProfile={userProfile || currentUserProfile}
              onGoToPricing={() => onNavigate('pricing')}
              onBackToHome={onBackToHome}
            />
          )}

          {activeNav === 'finance' && (
            <OreaFinanceView
              onBackToHome={onBackToHome}
            />
          )}

          {activeNav === 'planner' && (
            <OreaPlannerView
              currentUserProfile={userProfile || currentUserProfile}
              onGoToPricing={() => onNavigate('pricing')}
              onBackToHome={onBackToHome}
            />
          )}

          {/* TAB: DASHBOARD */}
          {activeNav === 'mon_orea' && currentTab === 'dashboard' && (
            <div className="space-y-10">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-900 via-[#0f2347] to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-4xl space-y-4">
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[12.5px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-blue-300" />
                    <span>MON OREA — Centre de contrôle personnel</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                    Bonjour, {userFirstName} 👋
                  </h1>
                  <p className="text-sm sm:text-[15.5px] text-blue-100/90 leading-relaxed">
                    Bienvenue dans votre tableau de bord administrateur OREA. Pilotez l'ensemble de vos 6 espaces personnels en temps réel.
                  </p>
                </div>
              </div>

              {/* Centre de Contrôle: Key Situation Metrics */}
              <div>
                <h2 className="text-[15px] font-black uppercase tracking-wider text-slate-400 mb-4 px-1">
                  VOTRE SITUATION OREA
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Metric 1 */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                    <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">
                      Espaces actifs
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#0f2347]">{configuredCount}</span>
                      <span className="text-sm font-bold text-slate-400">/ 6</span>
                    </div>
                    <p className="text-[12px] text-slate-500 font-medium">
                      {configuredCount === 0
                        ? 'Aucun espace configuré'
                        : `${configuredCount} module(s) synchronisé(s)`}
                    </p>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                    <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">
                      Progression Globale
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#0056d6]">
                        {globalCompletionRate}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-1">
                      <div
                        className="h-full bg-[#0056d6] rounded-full"
                        style={{ width: `${globalCompletionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                    <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">
                      Aujourd'hui
                    </span>
                    <div className="text-sm font-black text-[#0f2347] mt-1">
                      {isPlannerConfigured ? '3 activités prévues' : 'Journée non planifiée'}
                    </div>
                    <p className="text-[12px] text-slate-500 font-medium">OREA Planner Sync</p>
                  </div>

                  {/* Metric 4 */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                    <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">
                      Base de données
                    </span>
                    <div className="text-sm font-black text-emerald-700 mt-1 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Firestore Actif
                    </div>
                    <p className="text-[12px] text-slate-500 font-medium">Cloud Firestore Synchronisé</p>
                  </div>
                </div>
              </div>

              {/* Actions Rapides Bar */}
              <div>
                <h2 className="text-[15px] font-black uppercase tracking-wider text-slate-400 mb-4 px-1">
                  ACTIONS RAPIDES
                </h2>
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleQuickAction('create_space')}
                    className="px-5 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0056d6] text-sm font-extrabold flex items-center gap-2.5 transition-colors cursor-pointer shadow-3xs"
                  >
                    <Plus className="w-[18px] h-[18px] shrink-0" />
                    <span>Créer un espace</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('add_task')}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0f2347] text-sm font-extrabold flex items-center gap-2.5 transition-colors cursor-pointer shadow-3xs"
                  >
                    <Clock className="w-[18px] h-[18px] text-blue-500 shrink-0" />
                    <span>Ajouter une tâche</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('add_expense')}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0f2347] text-sm font-extrabold flex items-center gap-2.5 transition-colors cursor-pointer shadow-3xs"
                  >
                    <Coins className="w-[18px] h-[18px] text-emerald-600 shrink-0" />
                    <span>Ajouter une dépense</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('add_workout')}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0f2347] text-sm font-extrabold flex items-center gap-2.5 transition-colors cursor-pointer shadow-3xs"
                  >
                    <Activity className="w-[18px] h-[18px] text-orange-500 shrink-0" />
                    <span>Enregistrer une séance</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('add_meal')}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0f2347] text-sm font-extrabold flex items-center gap-2.5 transition-colors cursor-pointer shadow-3xs"
                  >
                    <Apple className="w-[18px] h-[18px] text-emerald-500 shrink-0" />
                    <span>Ajouter un repas</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('study')}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0f2347] text-sm font-extrabold flex items-center gap-2.5 transition-colors cursor-pointer shadow-3xs"
                  >
                    <GraduationCap className="w-[18px] h-[18px] text-indigo-500 shrink-0" />
                    <span>Session d'étude BAC G2</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction('add_objective')}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0f2347] text-sm font-extrabold flex items-center gap-2.5 transition-colors cursor-pointer shadow-3xs"
                  >
                    <Target className="w-[18px] h-[18px] text-purple-600 shrink-0" />
                    <span>Ajouter un objectif</span>
                  </button>
                </div>
              </div>

              {/* Main Dashboard Layout Grid (Two Columns: Modules Grid + AI Assistant) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-10 gap-8 items-start">
                
                {/* Left Side: Vos 6 Espaces Personnels (lg:col-span-2 xl:col-span-7) */}
                <div className="lg:col-span-2 xl:col-span-7 space-y-6">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-[15px] font-black uppercase tracking-wider text-slate-400">
                      VOS 6 ESPACES PERSONNELS
                    </h2>
                    <span className="text-sm text-slate-500 font-bold">
                      {configuredCount} sur 6 configurés
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 1. Mon Cycle */}
                    <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="p-3.5 rounded-2xl bg-pink-50 text-pink-600">
                            <Heart className="w-7 h-7" />
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              isCycleConfigured
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {isCycleConfigured ? 'Actif' : 'À créer'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#0f2347]">Mon Cycle</h3>
                        <p className="text-sm text-slate-500 mt-1.5">
                          Santé féminine, suivi du cycle menstruel et fertilité.
                        </p>

                        {isCycleConfigured ? (
                          <div className="mt-4 p-4 rounded-xl bg-pink-50/50 border border-pink-100 text-sm space-y-1.5">
                            <p className="font-bold text-pink-900">Espace configuré</p>
                            <p className="text-slate-600">
                              Prénom: {cycleProfile.pseudo || userFirstName}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-500">
                            Votre espace n'est pas encore configuré.
                          </div>
                        )}
                      </div>

                      <OreaButton
                        variant={isCycleConfigured ? 'outline' : 'primary'}
                        size="md"
                        onClick={() => onNavigate('cycle')}
                        className="w-full flex items-center justify-center gap-2 cursor-pointer py-3"
                      >
                        <span>{isCycleConfigured ? 'Ouvrir l\'espace' : 'Créer mon espace'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </OreaButton>
                    </div>

                    {/* 2. Sport & Workout */}
                    <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="p-3.5 rounded-2xl bg-orange-50 text-orange-600">
                            <Activity className="w-7 h-7" />
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              isSportConfigured
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {isSportConfigured ? 'Actif' : 'À créer'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#0f2347]">Sport & Workout</h3>
                        <p className="text-sm text-slate-500 mt-1.5">
                          Programmes calisthenics, mobilité et discipline.
                        </p>

                        {isSportConfigured ? (
                          <div className="mt-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100 text-sm space-y-1.5">
                            <p className="font-bold text-orange-900">Espace configuré</p>
                            <p className="text-slate-600">
                              Niveau: {sportProfile.level || 'Tous niveaux'}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-500">
                            Votre espace n'est pas encore configuré.
                          </div>
                        )}
                      </div>

                      <OreaButton
                        variant={isSportConfigured ? 'outline' : 'primary'}
                        size="md"
                        onClick={() => onNavigate('sport')}
                        className="w-full flex items-center justify-center gap-2 cursor-pointer py-3"
                      >
                        <span>{isSportConfigured ? 'Ouvrir l\'espace' : 'Créer mon espace'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </OreaButton>
                    </div>

                    {/* 3. Nutrition & Terroir */}
                    <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
                            <Apple className="w-7 h-7" />
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              isNutritionConfigured
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {isNutritionConfigured ? 'Actif' : 'À créer'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#0f2347]">Nutrition & Terroir</h3>
                        <p className="text-sm text-slate-500 mt-1.5">
                          Alimentation équilibrée africaine et hydratation.
                        </p>

                        {isNutritionConfigured ? (
                          <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-sm space-y-1.5">
                            <p className="font-bold text-emerald-900">Espace configuré</p>
                            <p className="text-slate-600">
                              Objectif: {nutritionProfile.goal || 'Équilibre au quotidien'}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-500">
                            Votre espace n'est pas encore configuré.
                          </div>
                        )}
                      </div>

                      <OreaButton
                        variant={isNutritionConfigured ? 'outline' : 'primary'}
                        size="md"
                        onClick={() => onNavigate('nutrition')}
                        className="w-full flex items-center justify-center gap-2 cursor-pointer py-3"
                      >
                        <span>{isNutritionConfigured ? 'Ouvrir l\'espace' : 'Créer mon espace'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </OreaButton>
                    </div>

                    {/* 4. BAC G2 & Éloquence */}
                    <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600">
                            <GraduationCap className="w-7 h-7" />
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              isEducationConfigured
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {isEducationConfigured ? 'Actif' : 'À créer'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#0f2347]">BAC G2 & Éloquence</h3>
                        <p className="text-sm text-slate-500 mt-1.5">
                          Comptabilité SYSCOHADA et prise de parole en public.
                        </p>

                        {isEducationConfigured ? (
                          <div className="mt-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-sm space-y-1.5">
                            <p className="font-bold text-indigo-900">Espace configuré</p>
                            <p className="text-slate-600">
                              Niveau: {educationProfile.series || 'BAC G2'}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-500">
                            Votre espace n'est pas encore configuré.
                          </div>
                        )}
                      </div>

                      <OreaButton
                        variant={isEducationConfigured ? 'outline' : 'primary'}
                        size="md"
                        onClick={() => onNavigate('education')}
                        className="w-full flex items-center justify-center gap-2 cursor-pointer py-3"
                      >
                        <span>{isEducationConfigured ? 'Ouvrir l\'espace' : 'Créer mon espace'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </OreaButton>
                    </div>

                    {/* 5. Finance & Budget */}
                    <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700">
                            <Coins className="w-7 h-7" />
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              isFinanceConfigured
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {isFinanceConfigured ? 'Actif' : 'À créer'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#0f2347]">Finance & Budget</h3>
                        <p className="text-sm text-slate-500 mt-1.5">
                          Gestion sereine des dépenses et épargne en FCFA.
                        </p>

                        {isFinanceConfigured ? (
                          <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-sm space-y-1.5">
                            <p className="font-bold text-emerald-900">Espace configuré</p>
                            <p className="text-slate-600">
                              Devise: FCFA
                            </p>
                          </div>
                        ) : (
                          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-500">
                            Votre espace n'est pas encore configuré.
                          </div>
                        )}
                      </div>

                      <OreaButton
                        variant={isFinanceConfigured ? 'outline' : 'primary'}
                        size="md"
                        onClick={() => onNavigate('finance')}
                        className="w-full flex items-center justify-center gap-2 cursor-pointer py-3"
                      >
                        <span>{isFinanceConfigured ? 'Ouvrir l\'espace' : 'Créer mon espace'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </OreaButton>
                    </div>

                    {/* 6. OREA Planner */}
                    <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600">
                            <Clock className="w-7 h-7" />
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                              isPlannerConfigured
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {isPlannerConfigured ? 'Actif' : 'À créer'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#0f2347]">OREA Planner</h3>
                        <p className="text-sm text-slate-500 mt-1.5">
                          Organisation et structure de votre journée.
                        </p>

                        {isPlannerConfigured ? (
                          <div className="mt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-sm space-y-1.5">
                            <p className="font-bold text-blue-900">Espace configuré</p>
                            <p className="text-slate-600">
                              Planning synchronisé
                            </p>
                          </div>
                        ) : (
                          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-500">
                            Votre espace n'est pas encore configuré.
                          </div>
                        )}
                      </div>

                      <OreaButton
                        variant={isPlannerConfigured ? 'outline' : 'primary'}
                        size="md"
                        onClick={() => onNavigate('planner')}
                        className="w-full flex items-center justify-center gap-2 cursor-pointer py-3"
                      >
                        <span>{isPlannerConfigured ? 'Ouvrir l\'espace' : 'Créer mon espace'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </OreaButton>
                    </div>
                  </div>
                </div>

                {/* Right Side: Votre IA OREA Companion Card (lg:col-span-1 xl:col-span-3) */}
                <div className="lg:col-span-1 xl:col-span-3">
                  <div className="lg:sticky lg:top-6">
                    {/* 🤖 VOTRE IA OREA — Main Dashboard Card */}
                    <OreaDashboardAiCard
                      userId={userProfile?.uid || currentUserProfile?.uid}
                      userFirstName={userFirstName}
                      userEmail={userProfile?.email}
                      onNavigate={onNavigate}
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: OBJECTIFS */}
          {(activeNav === 'objectifs' || (activeNav === 'mon_orea' && currentTab === 'objectifs')) && (
            <OreaObjectivesTab
              userId={userProfile?.uid || currentUserProfile?.uid || ''}
              onNavigate={onNavigate}
            />
          )}

          {/* TAB: PROGRESSION */}
          {(activeNav === 'progression' || (activeNav === 'mon_orea' && currentTab === 'progression')) && (
            <OreaProgressionTab
              userId={userProfile?.uid || currentUserProfile?.uid || ''}
              moduleStatuses={moduleStatuses}
              onNavigate={onNavigate}
            />
          )}

          {/* TAB: ACTIVITE */}
          {(activeNav === 'activite' || (activeNav === 'mon_orea' && currentTab === 'activite')) && (
            <OreaActivityTab
              userId={userProfile?.uid || currentUserProfile?.uid || ''}
              onNavigate={onNavigate}
            />
          )}

          {/* TAB: NOTIFICATIONS */}
          {(activeNav === 'notifications' || (activeNav === 'mon_orea' && currentTab === 'notifications')) && (
            <OreaNotificationsTab
              userId={userProfile?.uid || currentUserProfile?.uid || ''}
              onNavigate={onNavigate}
            />
          )}

          {/* TAB: IA ASSISTANT */}
          {activeNav === 'mon_orea' && currentTab === 'ia_assistant' && <OreaAiAssistantTab />}

          {/* TAB: RECHERCHE */}
          {activeNav === 'mon_orea' && currentTab === 'recherche' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-900 via-[#0f2347] to-slate-900 text-white p-6 rounded-3xl shadow-md">
                <h2 className="text-xl sm:text-2xl font-black">Recherche Globale OREA</h2>
                <p className="text-xs text-blue-200 mt-1">
                  Recherchez parmi vos 6 espaces, vos outils et votre compte.
                </p>
                <div className="mt-4 relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tapez un mot-clé (ex: BAC, budget, cycle, séance...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white text-slate-800 text-xs focus:outline-none shadow-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSearch.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (item.section) onNavigate(item.section as NavSection);
                      if (item.tab) setCurrentTab(item.tab as MonOreaInternalTab);
                    }}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-blue-600">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-bold text-[#0f2347]">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DOCUMENTS */}
          {activeNav === 'mon_orea' && currentTab === 'documents' && (
            <OreaDocumentsTab
              userId={userProfile?.uid || currentUserProfile?.uid}
              userEmail={userProfile?.email}
              userName={userFirstName}
            />
          )}

          {/* TAB: PROFIL */}
          {activeNav === 'mon_orea' && currentTab === 'profil' && (
            <OreaProfileTab
              userProfile={userProfile || currentUserProfile}
              reloadProfile={reloadProfile}
            />
          )}

          {/* TAB: PARAMETRES */}
          {activeNav === 'mon_orea' && currentTab === 'parametres' && (
            <OreaSettingsTab
              userId={userProfile?.uid || currentUserProfile?.uid}
              onNavigate={onNavigate}
            />
          )}

          {/* TAB: SECURITE */}
          {activeNav === 'mon_orea' && currentTab === 'securite' && (
            <OreaSecurityTab userEmail={userProfile?.email || currentUserProfile?.email} />
          )}

          {/* TAB: AIDE & SUPPORT */}
          {activeNav === 'mon_orea' && currentTab === 'aide' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-gradient-to-r from-blue-900 via-[#0f2347] to-slate-900 text-white p-6 rounded-3xl shadow-md">
                <h2 className="text-xl sm:text-2xl font-black">Aide & Support OREA</h2>
                <p className="text-xs text-blue-200 mt-1">
                  Informations fondamentales et assistance plateforme.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-[#0f2347]">Identité Officielle d'OREA</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  OREA a été créé et fondé par <strong>Mr Tsoumou Patrick Bonheur</strong>.
                </p>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-[#0f2347]">
                  <strong>Devise d'OREA :</strong> « Mieux comprendre. Mieux vivre. Mieux évoluer. »
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0f2347]">Recherche Rapide OREA</h3>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Rechercher un module, un outil, une section..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredSearch.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (item.section) onNavigate(item.section as NavSection);
                    if (item.tab) setCurrentTab(item.tab as MonOreaInternalTab);
                    setIsSearchModalOpen(false);
                  }}
                  className="p-3 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-[#0f2347]">{item.title}</h4>
                    <p className="text-slate-500 text-[11px]">{item.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
