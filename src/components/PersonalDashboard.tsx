import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Activity,
  Apple,
  Brain,
  GraduationCap,
  Target,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  User,
  Phone,
  Globe,
  Languages,
  ShieldCheck,
  Sparkles,
  LogOut,
  Edit3,
  Save,
  ArrowUpRight,
  Flame,
  Droplets,
  BookOpen,
  Settings,
} from 'lucide-react';
import { OreaUserProfile, NavSection } from '../types';
import { updateUserProfileDetails, signOutUser, ADMIN_EMAIL } from '../lib/firebase';
import { OREALogo } from './OREALogo';

interface PersonalDashboardProps {
  userProfile: OreaUserProfile;
  onNavigate: (section: NavSection) => void;
  onProfileUpdated: (newProfile: OreaUserProfile) => void;
  onLogout: () => void;
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({
  userProfile,
  onNavigate,
  onProfileUpdated,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'habits' | 'profile'>('overview');

  // Edit Profile States
  const [editFirstName, setEditFirstName] = useState(userProfile.firstName || '');
  const [editLastName, setEditLastName] = useState(userProfile.lastName || '');
  const [editWhatsApp, setEditWhatsApp] = useState(userProfile.whatsapp || '');
  const [editCountry, setEditCountry] = useState(userProfile.country || 'Congo');
  const [editLanguage, setEditLanguage] = useState(userProfile.language || 'Français');
  const [editGender, setEditGender] = useState<'homme' | 'femme' | 'autre' | 'non-specifie'>(
    userProfile.gender || 'non-specifie'
  );

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Daily Habits State (persisted in local state)
  const [habits, setHabits] = useState([
    { id: 'water', label: 'Boire 1,5L d’eau fraîche', category: 'Santé', done: true },
    { id: 'stretch', label: '15 min d’étirements & mobilité', category: 'Sport', done: false },
    { id: 'reading', label: 'Lecture approfondie ou révision', category: 'Esprit', done: false },
    { id: 'planner', label: 'Pointer mes priorités du jour', category: 'Planner', done: true },
    { id: 'walk', label: 'Marche active ou grand bol d’air', category: 'Santé', done: false },
  ]);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h))
    );
  };

  // Dynamic Greeting based on local time
  const getGreeting = (name: string): string => {
    const hour = new Date().getHours();
    const cleanName = name || 'Membre OREA';
    if (hour >= 5 && hour < 12) {
      return `Bonjour, ${cleanName} 👋`;
    } else if (hour >= 12 && hour < 18) {
      return `Bon après-midi, ${cleanName} 👋`;
    } else {
      return `Bonsoir, ${cleanName} 👋`;
    }
  };

  // Format Last Login
  const formatLastLogin = (isoString?: string): string => {
    if (!isoString) return 'Première visite';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (isToday) {
        return `Connecté aujourd’hui à ${timeStr}`;
      }
      return `Dernière connexion le ${date.toLocaleDateString()} à ${timeStr}`;
    } catch {
      return 'Récemment';
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccessMsg(null);

    const fullDisplay = `${editFirstName.trim()} ${editLastName.trim()}`.trim() || userProfile.displayName;

    const updatedData: Partial<OreaUserProfile> = {
      firstName: editFirstName.trim(),
      lastName: editLastName.trim(),
      displayName: fullDisplay,
      whatsapp: editWhatsApp.trim(),
      country: editCountry.trim(),
      language: editLanguage.trim(),
      gender: editGender,
    };

    try {
      if (userProfile.uid) {
        await updateUserProfileDetails(userProfile.uid, updatedData);
      }
      const newProfile: OreaUserProfile = {
        ...userProfile,
        ...updatedData,
      };
      onProfileUpdated(newProfile);
      setProfileSuccessMsg('Profil mis à jour avec succès dans votre espace.');
      setTimeout(() => setProfileSuccessMsg(null), 3500);
    } catch (err) {
      console.error('[PersonalDashboard] Erreur mise à jour profil:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const isAdmin =
    userProfile.role === 'admin' ||
    userProfile.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const onboarding = userProfile.onboardingData;

  return (
    <div className="w-full min-h-[calc(100vh-80px)] py-6 sm:py-10 px-3.5 sm:px-6 lg:px-10 bg-gradient-to-b from-[#f3f8fd] via-white to-[#f4f9fd]">
      <div className="max-w-[1400px] mx-auto space-y-6 sm:space-y-8">
        {/* =========================================================================
            TOP WELCOME HERO HEADER (Warm, Human, Dynamic Greeting)
        ========================================================================= */}
        <div className="bg-gradient-to-r from-[#07111F] via-[#0B2F5B] to-[#0056d6] rounded-[28px] p-6 sm:p-9 text-white shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 border border-white/20 text-cyan-200">
                  Espace Personnel OREA
                </span>

                {isAdmin ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Administrateur OREA</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-400/20 border border-emerald-300/30 text-emerald-300">
                    Membre vérifié
                  </span>
                )}

                {/* Espace OREA Badge */}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/30 border border-blue-400/40 text-blue-200">
                  <span>Mon Espace OREA</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                {getGreeting(userProfile.firstName || userProfile.displayName)}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{formatLastLogin(userProfile.lastLogin)}</span>
                </span>
                {userProfile.country && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-cyan-300" />
                      <span>{userProfile.country}</span>
                    </span>
                  </>
                )}
                {onboarding?.mainGoal && (
                  <>
                    <span>•</span>
                    <span className="text-cyan-200 font-medium">
                      Cap : {onboarding.mainGoal}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">


              {isAdmin && (
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-[#07111F] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Console Admin</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onNavigate('assistant')}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Assistant OREA</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await signOutUser();
                  onLogout();
                }}
                className="px-3.5 py-2.5 rounded-xl bg-black/25 hover:bg-red-500/25 border border-white/15 hover:border-red-400/40 text-slate-200 hover:text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#0056d6] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Vue d’ensemble & Recommandations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('habits')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'habits'
                ? 'bg-[#0056d6] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Habitudes & Planner ({habits.filter((h) => h.done).length}/{habits.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#0056d6] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Mon Profil & Préférences
          </button>
        </div>

        {/* =========================================================================
            TAB 1: VUE D'ENSEMBLE
        ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Vitality Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Santé */}
              <div
                onClick={() => onNavigate('sante')}
                className="bg-white rounded-2xl p-5 border border-[#cfe2f5] hover:border-blue-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-[#07111F]">Espace Santé & Prévention</h3>
                <p className="text-xs text-slate-500 mt-1">Vérification de symptômes, guides clairs et rappels.</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-bold">
                  <span>Accéder à la santé</span>
                  <span>→</span>
                </div>
              </div>

              {/* Sport */}
              <div
                onClick={() => onNavigate('sport')}
                className="bg-white rounded-2xl p-5 border border-[#cfe2f5] hover:border-orange-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <h3 className="text-sm font-bold text-[#07111F]">Sport & Condition Physique</h3>
                <p className="text-xs text-slate-500 mt-1">Séances guidées, renforcement et régularité.</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-orange-600 font-bold">
                  <span>Lancer l’entraînement</span>
                  <span>→</span>
                </div>
              </div>

              {/* BAC G2 & Savoirs */}
              <div
                onClick={() => onNavigate('education')}
                className="bg-white rounded-2xl p-5 border border-[#cfe2f5] hover:border-indigo-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                </div>
                <h3 className="text-sm font-bold text-[#07111F]">BAC G2 & Formation</h3>
                <p className="text-xs text-slate-500 mt-1">Comptabilité, gestion financière et révisions ciblées.</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-600 font-bold">
                  <span>Ouvrir les modules BAC G2</span>
                  <span>→</span>
                </div>
              </div>

              {/* Planner */}
              <div
                onClick={() => onNavigate('planner')}
                className="bg-white rounded-2xl p-5 border border-[#cfe2f5] hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <Calendar className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-[#07111F]">Planner & Habitudes</h3>
                <p className="text-xs text-slate-500 mt-1">Structurez vos journées et validez vos priorités.</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-600 font-bold">
                  <span>Voir mon agenda</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Recommandations personnalisées OREA selon l'Onboarding */}
            <div className="bg-white rounded-[24px] border border-[#cfe2f5] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#0056d6]" />
                <h2 className="text-base sm:text-lg font-black text-[#07111F]">
                  Recommandations personnalisées selon votre profil
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recommendation 1 */}
                <div className="p-4 rounded-2xl bg-[#f0f7ff] border border-[#d2e5f8] space-y-2">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                    Hydratation & Corps
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#07111F]">
                    Buvez votre prochain verre d'eau
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Une bonne hydratation augmente immédiatement votre concentration mentale de 15% et évite la fatigue de milieu de journée.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('nutrition')}
                    className="text-xs font-bold text-[#0056d6] hover:underline pt-1 inline-block cursor-pointer"
                  >
                    Guide nutrition OREA →
                  </button>
                </div>

                {/* Recommendation 2 */}
                <div className="p-4 rounded-2xl bg-[#fef9ee] border border-[#fae7b9] space-y-2">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                    Orientation & Études
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#07111F]">
                    {onboarding?.situation === 'bac_g2'
                      ? 'Réviser le journal comptable SYSCOHADA'
                      : 'Structurer vos objectifs de la semaine'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {onboarding?.situation === 'bac_g2'
                      ? 'Révisez les principes fondamentaux de l’enregistrement comptable et de la TVA avec les fiches synthétiques OREA.'
                      : 'Découpez vos grands projets en 3 actions concrètes réalisables aujourd’hui.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('education')}
                    className="text-xs font-bold text-amber-700 hover:underline pt-1 inline-block cursor-pointer"
                  >
                    Accéder aux révisions →
                  </button>
                </div>

                {/* Recommendation 3 */}
                <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] space-y-2">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    Mouvement Quotidien
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#07111F]">
                    Pause active de 10 minutes
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Une courte session d'étirement des épaules et de mobilité de la colonne libère les tensions accumulées devant les écrans.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('sport')}
                    className="text-xs font-bold text-emerald-700 hover:underline pt-1 inline-block cursor-pointer"
                  >
                    Lancer la séance express →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: HABITUDES & PLANNER
        ========================================================================= */}
        {activeTab === 'habits' && (
          <div className="bg-white rounded-[24px] border border-[#cfe2f5] p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#07111F]">
                  Vos habitudes quotidiennes
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cochez vos actions au fur et à mesure de votre journée.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                {habits.filter((h) => h.done).length} sur {habits.length} complétées
              </div>
            </div>

            <div className="space-y-3">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    habit.done
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {habit.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                    <div>
                      <p className={`text-xs sm:text-sm font-bold ${habit.done ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                        {habit.label}
                      </p>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {habit.category}
                      </span>
                    </div>
                  </div>

                  <span className={`text-xs font-semibold ${habit.done ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                    {habit.done ? 'Fait ✓' : 'À faire'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => onNavigate('planner')}
                className="px-4 py-2 rounded-xl bg-[#0056d6] text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Ouvrir le Planner complet OREA
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: MON PROFIL & PRÉFÉRENCES
        ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-[24px] border border-[#cfe2f5] p-6 sm:p-8 shadow-xs max-w-2xl">
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-black text-[#07111F]">
                Gestion de votre profil OREA
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Modifiez vos coordonnées et préférences. Toutes les modifications sont enregistrées en direct dans votre compte sécurisé.
              </p>
            </div>

            {profileSuccessMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cfe2f5] text-xs sm:text-sm outline-none focus:border-[#0056d6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Nom de famille</label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cfe2f5] text-xs sm:text-sm outline-none focus:border-[#0056d6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Adresse email</label>
                <input
                  type="email"
                  disabled
                  value={userProfile.email}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400 mt-1">Géré par Firebase Authentication</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Numéro WhatsApp</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={editWhatsApp}
                    onChange={(e) => setEditWhatsApp(e.target.value)}
                    placeholder="+242 06 123 4567"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#cfe2f5] text-xs sm:text-sm outline-none focus:border-[#0056d6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Pays de résidence</label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cfe2f5] text-xs sm:text-sm outline-none focus:border-[#0056d6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Langue</label>
                  <select
                    value={editLanguage}
                    onChange={(e) => setEditLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#cfe2f5] text-xs sm:text-sm bg-white outline-none focus:border-[#0056d6]"
                  >
                    <option value="Français">Français</option>
                    <option value="Anglais">Anglais</option>
                    <option value="Lingala">Lingala</option>
                    <option value="Kituba">Kituba</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Genre</label>
                <select
                  value={editGender}
                  onChange={(e: any) => setEditGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#cfe2f5] text-xs sm:text-sm bg-white outline-none focus:border-[#0056d6]"
                >
                  <option value="non-specifie">Préfère ne pas préciser</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 rounded-xl bg-[#0056d6] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                </button>

                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Synchronisé Firestore</span>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default PersonalDashboard;
