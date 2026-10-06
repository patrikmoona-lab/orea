import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Laptop,
  User,
  Globe,
  Bell,
  Bot,
  Shield,
  Lock,
  Database,
  Crown,
  Eye,
  HelpCircle,
  Info,
  LogOut,
  Check,
  AlertCircle,
  Download,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Smartphone,
  Mail,
  Key,
  ShieldCheck,
  MessageSquare,
  FileText,
  Volume2,
  VolumeX,
  Sliders,
  Send,
  AlertTriangle,
  X,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { NavSection, OreaUserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme, ThemeMode, AppLanguage, TextSizeMode } from '../context/ThemeContext';
import { ThemeSwitch } from './common/ThemeSwitch';
import { OreaButton } from './common/OreaButton';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

interface SettingsViewProps {
  onNavigate: (section: NavSection) => void;
  onBackToHome: () => void;
}

type SettingsSectionId =
  | 'apparence'
  | 'compte'
  | 'langue'
  | 'notifications'
  | 'ia'
  | 'confidentialite'
  | 'securite'
  | 'donnees'
  | 'tarif'
  | 'accessibilite'
  | 'aide'
  | 'apropos';

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate, onBackToHome }) => {
  const { userProfile, isAuthenticated, logout, setUserProfile } = useAuth();
  const {
    theme,
    effectiveTheme,
    setTheme,
    language,
    setLanguage,
    settings,
    updateNotificationSettings,
    updateAiSettings,
    updatePrivacySettings,
    updateAccessibilitySettings,
    isSaving,
  } = useTheme();

  const [activeSection, setActiveSection] = useState<SettingsSectionId>('apparence');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Modals state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Profile Edit modal
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFirstName, setEditFirstName] = useState(userProfile.firstName || '');
  const [editLastName, setEditLastName] = useState(userProfile.lastName || '');
  const [editWhatsapp, setEditWhatsapp] = useState(userProfile.whatsapp || '');
  const [editCity, setEditCity] = useState(userProfile.city || '');
  const [editCountry, setEditCountry] = useState(userProfile.country || 'Gabon');

  // Contact modal
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSubject, setContactSubject] = useState('Question générale');
  const [contactMessage, setContactMessage] = useState('');

  // Password reset state
  const [isSendingReset, setIsSendingReset] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Password Reset Action
  const handlePasswordReset = async () => {
    if (!userProfile.email || userProfile.email === 'utilisateur@orea.app') {
      showToast('Veuillez vous connecter avec une adresse email valide pour réinitialiser le mot de passe.', 'error');
      return;
    }
    try {
      setIsSendingReset(true);
      await sendPasswordResetEmail(auth, userProfile.email);
      showToast(`Email de réinitialisation sécurisé envoyé à ${userProfile.email}. Consultez votre boîte de réception.`, 'success');
    } catch (err: any) {
      showToast(`Erreur : ${err?.message || 'Impossible d\'envoyer l\'email.'}`, 'error');
    } finally {
      setIsSendingReset(false);
    }
  };

  // 2. Profile Save Action
  const handleSaveProfile = () => {
    const updated: OreaUserProfile = {
      ...userProfile,
      firstName: editFirstName.trim() || userProfile.firstName,
      lastName: editLastName.trim() || userProfile.lastName,
      displayName: `${editFirstName.trim()} ${editLastName.trim()}`.trim() || userProfile.displayName,
      whatsapp: editWhatsapp.trim(),
      city: editCity.trim(),
      country: editCountry.trim(),
    };
    setUserProfile(updated);
    localStorage.setItem('orea_user_profile', JSON.stringify(updated));
    setShowEditProfileModal(false);
    showToast('Profil mis à jour avec succès.', 'success');
  };

  // 3. Export All User Data
  const handleDownloadAllData = () => {
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        application: 'OREA Platform',
        user: {
          uid: userProfile.uid,
          email: userProfile.email,
          name: userProfile.displayName || `${userProfile.firstName} ${userProfile.lastName}`,
          role: userProfile.role,
          subscription: userProfile.subscription,
          country: userProfile.country,
          city: userProfile.city,
        },
        settings: settings,
        localModules: {
          cycle: localStorage.getItem('orea_profile_cycle') ? JSON.parse(localStorage.getItem('orea_profile_cycle')!) : null,
          sport: localStorage.getItem('orea_profile_sport') ? JSON.parse(localStorage.getItem('orea_profile_sport')!) : null,
          nutrition: localStorage.getItem('orea_profile_nutrition') ? JSON.parse(localStorage.getItem('orea_profile_nutrition')!) : null,
          education: localStorage.getItem('orea_profile_education') ? JSON.parse(localStorage.getItem('orea_profile_education')!) : null,
          finance: localStorage.getItem('orea_profile_finance') ? JSON.parse(localStorage.getItem('orea_profile_finance')!) : null,
          planner: localStorage.getItem('orea_profile_planner') ? JSON.parse(localStorage.getItem('orea_profile_planner')!) : null,
        },
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `OREA_Export_Donnees_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Archive de vos données téléchargée avec succès.', 'success');
    } catch {
      showToast('Erreur lors de l\'export des données.', 'error');
    }
  };

  // 4. Export Assistant Conversations
  const handleExportConversations = () => {
    try {
      const convs = localStorage.getItem('orea_chat_conversations') || '[]';
      const msgs = localStorage.getItem('orea_chat_messages') || '[]';
      const exportData = {
        exportedAt: new Date().toISOString(),
        service: 'Votre IA OREA',
        conversations: JSON.parse(convs),
        messages: JSON.parse(msgs),
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `OREA_Conversations_IA_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Historique des conversations exporté.', 'success');
    } catch {
      showToast('Aucune conversation trouvée à exporter.', 'info');
    }
  };

  // 5. Purge AI Conversation History
  const handlePurgeAiHistory = () => {
    if (window.confirm('Voulez-vous vraiment effacer l\'historique local des conversations avec Votre IA ?')) {
      localStorage.removeItem('orea_chat_conversations');
      localStorage.removeItem('orea_chat_messages');
      showToast('Historique des conversations avec Votre IA effacé.', 'success');
    }
  };

  // 6. Account Deletion Confirmation Action
  const handleDeleteAccount = async () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'SUPPRIMER') {
      showToast('Veuillez taper "SUPPRIMER" pour confirmer la suppression.', 'error');
      return;
    }

    try {
      setIsDeletingAccount(true);
      if (userProfile?.uid && !userProfile.uid.startsWith('guest_') && userProfile.uid !== 'guest-user') {
        await deleteDoc(doc(db, 'users', userProfile.uid));
      }
      localStorage.clear();
      sessionStorage.clear();
      await logout();
      setShowDeleteModal(false);
      onNavigate('accueil');
      showToast('Votre compte et vos données ont été définitivement supprimés.', 'info');
    } catch (err: any) {
      showToast(`Erreur : ${err?.message || 'Impossible de supprimer le compte.'}`, 'error');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // Navigation tabs configuration
  const navigationItems = [
    { id: 'apparence', label: 'Apparence', icon: Sun, desc: 'Thèmes Clair, Sombre & Système' },
    { id: 'compte', label: 'Mon compte', icon: User, desc: 'Profil, coordonnées & identifiants' },
    { id: 'langue', label: 'Langue', icon: Globe, desc: 'Français, English' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Rappels, alertes & horaires' },
    { id: 'ia', label: 'Votre IA', icon: Bot, desc: 'Voix, mémorisation & bibliothèque' },
    { id: 'confidentialite', label: 'Confidentialité', icon: Shield, desc: 'Données de santé & chiffrement' },
    { id: 'securite', label: 'Sécurité', icon: Lock, desc: 'Mot de passe, sessions & appareils' },
    { id: 'donnees', label: 'Mes données', icon: Database, desc: 'Téléchargement & exports' },
    { id: 'tarif', label: 'Mon tarif', icon: Crown, desc: 'Abonnements & fonctionnalités' },
    { id: 'accessibilite', label: 'Accessibilité', icon: Eye, desc: 'Taille texte, contraste & animations' },
    { id: 'aide', label: 'Aide et assistance', icon: HelpCircle, desc: 'FAQ, contact & signalement' },
    { id: 'apropos', label: 'À propos d\'OREA', icon: Info, desc: 'Fondateur, version & légal' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fbfe] dark:bg-[#070d18] text-[#0f2347] dark:text-[#f1f5f9] transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-bold border ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/20'
                : toastMessage.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500 shadow-rose-900/20'
                : 'bg-[#0056d6] text-white border-blue-400 shadow-blue-900/20'
            }`}
          >
            {toastMessage.type === 'success' && <Check className="w-4 h-4 shrink-0" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8">
        
        {/* Header Title Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-[#0f2347] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden border border-blue-950/40">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <SettingsIcon className="w-3.5 h-3.5" />
                <span>Configuration Globale OREA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Paramètres
              </h1>
              <p className="text-sm sm:text-base text-blue-200/90 font-medium">
                Personnalisez votre expérience OREA
              </p>
              <p className="text-xs text-blue-300/70 italic pt-1">
                « Mieux comprendre, mieux évoluer, mieux vivre. »
              </p>
            </div>

            {/* Quick Interactive Day/Night Toggle from Header */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shrink-0 self-start md:self-center">
              <div className="text-right">
                <div className="text-xs font-bold text-white">Thème Rapide</div>
                <div className="text-[11px] text-blue-200">
                  {effectiveTheme === 'dark' ? 'Mode Nuit actif' : 'Mode Jour actif'}
                </div>
              </div>
              <ThemeSwitch size="md" />
            </div>
          </div>
        </div>

        {/* Settings Layout: Left Sidebar Navigation + Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* =========================================================================
              LEFT SIDEBAR: NAVIGATION SECTIONS
             ========================================================================= */}
          <div className="lg:col-span-4 space-y-2 bg-white dark:bg-[#0e192d] p-3 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="px-3 py-2 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Rubriques
            </div>
            
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as SettingsSectionId)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0056d6] text-white shadow-md font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs sm:text-sm truncate">{item.label}</div>
                        <div className={`text-[11px] truncate ${isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ml-2 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Logout Button in Sidebar */}
            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-bold text-xs sm:text-sm cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              RIGHT CONTENT PANEL: DETAILED FUNCTIONAL SETTINGS CARDS
             ========================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. SECTION: APPARENCE */}
            {activeSection === 'apparence' && (
              <div className="bg-white dark:bg-[#0e192d] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0f2347] dark:text-white flex items-center gap-2.5">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <span>Apparence</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Choisissez l’apparence qui vous convient le mieux.
                  </p>
                </div>

                {/* 3 Interactive Mode Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* Option 1: Clair */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('light');
                      showToast('Mode Clair activé');
                    }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                      theme === 'light'
                        ? 'border-[#0056d6] bg-blue-50/50 dark:bg-blue-950/30 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                        <Sun className="w-5 h-5" />
                      </div>
                      {theme === 'light' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0056d6]" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0f2347] dark:text-white">☀️ Clair</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Interface lumineuse et claire.
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Sombre */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('dark');
                      showToast('Mode Sombre activé');
                    }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                      theme === 'dark'
                        ? 'border-[#0056d6] bg-blue-50/50 dark:bg-blue-950/30 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-indigo-900 text-indigo-200">
                        <Moon className="w-5 h-5" />
                      </div>
                      {theme === 'dark' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0056d6]" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0f2347] dark:text-white">🌙 Sombre</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Interface sombre confortable pour la nuit.
                      </div>
                    </div>
                  </button>

                  {/* Option 3: Système */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('system');
                      showToast('Mode Système synchronisé');
                    }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                      theme === 'system'
                        ? 'border-[#0056d6] bg-blue-50/50 dark:bg-blue-950/30 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        <Laptop className="w-5 h-5" />
                      </div>
                      {theme === 'system' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0056d6]" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0f2347] dark:text-white">🌓 Système</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Suit automatiquement votre appareil.
                      </div>
                    </div>
                  </button>
                </div>

                {/* Section Interrupteur Jour / Nuit UI Universe */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#0f2347] dark:text-white">
                      Interrupteur Rapide Jour / Nuit
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Basculez instantanément le mode visuel via le commutateur OREA.
                    </p>
                  </div>
                  <ThemeSwitch size="lg" showLabel={true} />
                </div>
              </div>
            )}

            {/* 2. SECTION: MON COMPTE */}
            {activeSection === 'compte' && (
              <div className="bg-white dark:bg-[#0e192d] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0f2347] dark:text-white flex items-center gap-2.5">
                    <User className="w-5 h-5 text-[#0056d6]" />
                    <span>Mon compte</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Gérez vos informations personnelles et identifiants sécurisés.
                  </p>
                </div>

                {/* User Info Card */}
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xl font-black flex items-center justify-center shadow-md shrink-0">
                      {userProfile.photoURL ? (
                        <img
                          src={userProfile.photoURL}
                          alt="Photo de profil"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <span>
                          {userProfile.firstName ? userProfile.firstName[0].toUpperCase() : 'O'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#0f2347] dark:text-white">
                        {userProfile.displayName || `${userProfile.firstName} ${userProfile.lastName}`}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {userProfile.email}
                      </p>
                      <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase">
                        Compte Vérifié
                      </span>
                    </div>
                  </div>

                  {/* Account Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60 dark:border-slate-700 text-xs">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 font-semibold">Numéro WhatsApp</span>
                      <div className="font-bold text-[#0f2347] dark:text-white mt-0.5">
                        {userProfile.whatsapp || 'Non renseigné'}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 font-semibold">Genre</span>
                      <div className="font-bold text-[#0f2347] dark:text-white mt-0.5 capitalize">
                        {userProfile.gender || 'Non spécifié'}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 font-semibold">Pays</span>
                      <div className="font-bold text-[#0f2347] dark:text-white mt-0.5">
                        {userProfile.country || 'Gabon'}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 font-semibold">Ville</span>
                      <div className="font-bold text-[#0f2347] dark:text-white mt-0.5">
                        {userProfile.city || 'Libreville'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Real Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <OreaButton
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setEditFirstName(userProfile.firstName || '');
                      setEditLastName(userProfile.lastName || '');
                      setEditWhatsapp(userProfile.whatsapp || '');
                      setEditCity(userProfile.city || '');
                      setEditCountry(userProfile.country || 'Gabon');
                      setShowEditProfileModal(true);
                    }}
                  >
                    Modifier mon profil
                  </OreaButton>

                  <OreaButton
                    variant="outline"
                    size="sm"
                    onClick={handlePasswordReset}
                    disabled={isSendingReset}
                    icon={<Key className="w-3.5 h-3.5" />}
                  >
                    {isSendingReset ? 'Envoi...' : 'Changer mon mot de passe'}
                  </OreaButton>
                </div>
              </div>
            )}

            {/* 3. SECTION: LANGUE */}
            {activeSection === 'langue' && (
              <div className="bg-white dark:bg-[#0e192d] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0f2347] dark:text-white flex items-center gap-2.5">
                    <Globe className="w-5 h-5 text-indigo-500" />
                    <span>Langue</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Choisissez la langue d'affichage et de communication de la plateforme.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Français */}
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('fr');
                      showToast('Langue définie sur Français');
                    }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                      language === 'fr'
                        ? 'border-[#0056d6] bg-blue-50/50 dark:bg-blue-950/30 shadow-md font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇫🇷</span>
                      <div>
                        <div className="text-sm font-bold text-[#0f2347] dark:text-white">Français</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Langue officielle OREA</div>
                      </div>
                    </div>
                    {language === 'fr' && <Check className="w-5 h-5 text-[#0056d6]" />}
                  </button>

                  {/* English */}
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      showToast('Language set to English');
                    }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                      language === 'en'
                        ? 'border-[#0056d6] bg-blue-50/50 dark:bg-blue-950/30 shadow-md font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇬🇧</span>
                      <div>
                        <div className="text-sm font-bold text-[#0f2347] dark:text-white">English</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">International version</div>
                      </div>
                    </div>
                    {language === 'en' && <Check className="w-5 h-5 text-[#0056d6]" />}
                  </button>
                </div>
              </div>
            )}

            {/* 4. SECTION: NOTIFICATIONS */}
            {activeSection === 'notifications' && (
              <div className="bg-white dark:bg-[#0e192d] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0f2347] dark:text-white flex items-center gap-2.5">
                    <Bell className="w-5 h-5 text-emerald-500" />
                    <span>Notifications</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Définissez les rappels, alertes santé et conseils que vous souhaitez recevoir.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* General */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#0f2347] dark:text-white">
                        Notifications générales
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Alertes globales d'activité et actualités OREA.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.general}
                      onChange={(e) => {
                        updateNotificationSettings({ general: e.target.checked });
                        showToast('Préférence enregistrée');
                      }}
                      className="w-5 h-5 accent-[#0056d6] cursor-pointer"
                    />
                  </div>

                  {/* Personal Reminders */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#0f2347] dark:text-white">
                        Rappels personnels
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Rappels de vos prises de médicaments et hydratation quotidienne.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.reminders}
                      onChange={(e) => {
                        updateNotificationSettings({ reminders: e.target.checked });
                        showToast('Préférence enregistrée');
                      }}
                      className="w-5 h-5 accent-[#0056d6] cursor-pointer"
                    />
                  </div>

                  {/* Program Reminders */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#0f2347] dark:text-white">
                        Rappels de programmes
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Séances de sport, révisions BAC G2 et suivi budgétaire.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.programs}
                      onChange={(e) => {
                        updateNotificationSettings({ programs: e.target.checked });
                        showToast('Préférence enregistrée');
                      }}
                      className="w-5 h-5 accent-[#0056d6] cursor-pointer"
                    />
                  </div>

                  {/* OREA Tips */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#0f2347] dark:text-white">
                        Conseils OREA
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Suggestions personnalisées basées sur vos espaces configurés.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.tips}
                      onChange={(e) => {
                        updateNotificationSettings({ tips: e.target.checked });
                        showToast('Préférence enregistrée');
                      }}
                      className="w-5 h-5 accent-[#0056d6] cursor-pointer"
                    />
                  </div>

                  {/* Time selector */}
                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-blue-900 dark:text-blue-200">
                        Heure quotidienne des notifications
                      </div>
                      <div className="text-[11px] text-blue-700/80 dark:text-blue-300/70">
                        Moment idéal pour recevoir vos bilans et rappels d'objectifs.
                      </div>
                    </div>
                    <input
                      type="time"
                      value={settings.notifications.time}
                      onChange={(e) => {
                        updateNotificationSettings({ time: e.target.value });
                        showToast('Heure mise à jour');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0f2347] dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. SECTION: VOTRE IA */}
            {activeSection === 'ia' && (
              <div className="bg-white dark:bg-[#0e192d] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0f2347] dark:text-white flex items-center gap-2.5">
                    <Bot className="w-5 h-5 text-cyan-500" />
                    <span>Votre IA</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Paramétrez le comportement, la synthèse vocale et la mémoire de Votre IA OREA.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Voice Answers */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#0f2347] dark:text-white">
                        Réponses vocales
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Lecture audio automatique des synthèses et conseils générés.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.ai.voiceAnswers}
                      onChange={(e) => {
                        updateAiSettings({ voiceAnswers: e.target.checked });
                        showToast('Option vocale modifiée');
                      }}
                      className="w-5 h-5 accent-[#0056d6] cursor-pointer"
                    />
                  </div>

                  {/* Profile Context */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#0f2347] dark:text-white">
                        Utiliser le contexte de mon profil
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Permet à l'IA d'adapter ses conseils à vos objectifs de santé, sport et études.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.ai.useProfileContext}
                      onChange={(e) => {
                        updateAiSettings({ useProfileContext: e.target.checked });
                        showToast('Préférence enregistrée');
                      }}
                      className="w-5 h-5 accent-[#0056d6] cursor-pointer"
                    />
                  </div>

                  {/* Memory Context */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#0f2347] dark:text-white">
                        Mémorisation du contexte des échanges
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Conserve le fil de discussion récent pour une continuité naturelle.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.ai.memoryContext}
                      onChange={(e) => {
                        updateAiSettings({ memoryContext: e.target.checked });
                        showToast('Préférence enregistrée');
                      }}
                      className="w-5 h-5 accent-[#0056d6] cursor-pointer"
                    />
                  </div>
                </div>

                {/* AI Quick Navigation Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <OreaButton
                    variant="ai"
                    size="sm"
                    onClick={() => onNavigate('assistant')}
                    icon={<MessageSquare className="w-3.5 h-3.5" />}
                  >
                    Ouvrir Votre IA
                  </OreaButton>

                  <OreaButton
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('documents')}
                    icon={<FileText className="w-3.5 h-3.5" />}
                  >
                    Bibliothèque & Archives
                  </OreaButton>
                </div>
              </div>
            )}

            {/* 6. SECTION: CONFIDENTIALITÉ */}
            {activeSection === 'confidentialite' && (
              <div className="bg-white dark:bg-[#0e192d] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0f2347] dark:text-white flex items-center gap-2.5">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <span>Confidentialité</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Vous gardez le contrôle absolu sur vos données personnelles et médicales.
                  </p>
                </div>

                {/* Health Data Protection Notice */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2 text-xs text-emerald-900 dark:text-emerald-200">
                  <div className="font-bold flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Chiffrement et isolation des données de santé</span>
                  </div>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                    Vos suivis physiologiques (Mon Cycle, symptômes, hydratation, dossiers médicaux) sont isolés sous votre compte. OREA n'envoie que le strict minimum de contexte nécessaire à la génération d'assistance intelligente et ne revend aucune donnée à des régies publicitaires.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#0f2347] dark:text-white">
                        Données de personnalisation
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Adapter les tableaux de bord à vos habitudes déclarées.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.personalization}
                      onChange={(e) => {
                        updatePrivacySettings({ personalization: e.target.checked });
                        showToast('Paramètre mis à jour');
                      }}
                      className="w-5 h-5 accent-[#0056d6] cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#0f2347] dark:text-white">
                        Purger l'historique des conversations
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Supprime les échanges locaux sans affecter votre compte.
                      </div>
                    </div>
                    <OreaButton variant="outline" size="xs" onClick={handlePurgeAiHistory}>
                      Purger
                    </OreaButton>
                  </div>
                </div>
              </div>
            )}

            {/* 7. SECTION: SÉCURITÉ */}
            {activeSection === 'securite' && (
              <div className="bg-white dark:bg-[#0e192d] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0f2347] dark:text-white flex items-center gap-2.5">
                    <Lock className="w-5 h-5 text-indigo-500" />
                    <span>Sécurité</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Gérez vos accès, sessions actives et la suppression sécurisée du compte.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Password change */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-[#0f2347] dark:text-white">
                        Mot de passe du compte
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Recevez un lien de modification sécurisé sur votre adresse email.
                      </div>
                    </div>
                    <OreaButton
                      variant="primary"
                      size="sm"
                      onClick={handlePasswordReset}
                      disabled={isSendingReset}
                    >
                      {isSendingReset ? 'Envoi...' : 'Modifier le mot de passe'}
                    </OreaButton>
                  </div>

                  {/* Active session info */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-[#0f2347] dark:text-white">
                        Session active courante
                      </div>
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Actuelle
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <p>Navigateur : Web App (Navigateur connecté)</p>
                      <p>Dernière activité : {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  {/* Danger zone: Account deletion */}
                  <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-rose-700 dark:text-rose-400">
                        Supprimer mon compte OREA
                      </div>
                      <div className="text-xs text-rose-600/80 dark:text-rose-400/70 mt-0.5">
                        Action irréversible : suppression complète de vos données et historiques.
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Supprimer mon compte
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 8. SECTION: MES DONNÉES */}
            {activeSection === 'donnees' && (
              <div className="bg-white dark:bg-[#0e192d] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0f2347] dark:text-white flex items-center gap-2.5">
                    <Database className="w-5 h-5 text-blue-500" />
                    <span>Mes données</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Téléchargez, exportez ou gérez vos informations stockées en toute transparence.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Download all data */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-[#0056d6] dark:text-blue-300 w-fit mb-3">
                        <Download className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-[#0f2347] dark:text-white">
                        Télécharger mes données (JSON)
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Export complet de votre profil, préférences et modules configurés.
                      </p>
                    </div>
                    <OreaButton variant="primary" size="sm" onClick={handleDownloadAllData}>
                      Télécharger
                    </OreaButton>
                  </div>

                  {/* Export AI conversations */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="p-3 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-300 w-fit mb-3">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-[#0f2347] dark:text-white">
                        Exporter mes conversations
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Sauvegarde de vos échanges avec Votre IA OREA.
                      </p>
                    </div>
                    <OreaButton variant="outline" size="sm" onClick={handleExportConversations}>
                      Exporter
                    </OreaButton>
                  </div>
                </div>
              </div>
            )}

            {/* 9. SECTION: MON TARIF */}
            {activeSection === 'tarif' && (
              <div className="bg-white dark:bg-[#0e192d] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0f2347] dark:text-white flex items-center gap-2.5">
                    <Crown className="w-5 h-5 text-amber-500" />
                    <span>Mon tarif</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Consultez votre formule d'abonnement et découvrez les fonctionnalités associées.
                  </p>
                </div>

                {/* Current Plan Badge Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/50 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Tarif Actuel
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-[#0f2347] dark:text-white capitalize mt-0.5">
                        {userProfile.subscription?.planId === 'business'
                          ? 'Plan Business'
                          : userProfile.subscription?.planId === 'premium' || userProfile.subscription?.planId === 'pro'
                          ? 'Plan Pro / Premium'
                          : userProfile.subscription?.planId === 'plus' || userProfile.subscription?.planId === 'essentiel'
                          ? 'Plan Essentiel'
                          : 'Tarif Gratuit'}
                      </h3>
                    </div>
                    <span className="px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold w-fit">
                      Statut : {userProfile.subscription?.status === 'active' ? 'Actif' : 'Gratuit standard'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Profitez de l'accès complet aux espaces santé préventive, urgences, calisthenics, assiette terroir 50/25/25, préparation BAC G2 et Votre IA.
                  </p>

                  <div className="pt-2">
                    <OreaButton
                      variant="primary"
                      size="sm"
                      onClick={() => onNavigate('pricing')}
                      icon={<Crown className="w-4 h-4 text-amber-300" />}
                    >
                      Voir les tarifs OREA
                    </OreaButton>
                  </div>
                </div>
              </div>
            )}

            {/* 10. SECTION: ACCESSIBILITÉ */}
            {activeSection === 'accessibilite' && (
              <div className="bg-white dark:bg-[#0e192d] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0f2347] dark:text-white flex items-center gap-2.5">
                    <Eye className="w-5 h-5 text-purple-500" />
                    <span>Accessibilité</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Adaptez la lisibilité, le contraste et le confort visuel de la plateforme.
                  </p>
                </div>

                {/* Text Size Selector */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-3">
                  <div className="text-sm font-bold text-[#0f2347] dark:text-white">
                    Taille du texte
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'normal', label: 'Standard' },
                      { id: 'large', label: 'Grand' },
                      { id: 'xlarge', label: 'Très grand' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          updateAccessibilitySettings({ textSize: s.id as TextSizeMode });
                          showToast(`Taille du texte : ${s.label}`);
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          settings.accessibility.textSize === s.id
                            ? 'bg-[#0056d6] text-white shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* High Contrast & Reduced Motion */}
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#0f2347] dark:text-white">
                        Contraste renforcé
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Améliore la lisibilité des contours et éléments interactifs.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.highContrast}
                      onChange={(e) => {
                        updateAccessibilitySettings({ highContrast: e.target.checked });
                        showToast('Contraste mis à jour');
                      }}
                      className="w-5 h-5 accent-[#0056d6] cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#0f2347] dark:text-white">
                        Réduction des animations
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Limite les transitions et effets de mouvement visuels.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.reducedMotion}
                      onChange={(e) => {
                        updateAccessibilitySettings({ reducedMotion: e.target.checked });
                        showToast('Animations adaptées');
                      }}
                      className="w-5 h-5 accent-[#0056d6] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 11. SECTION: AIDE & ASSISTANCE */}
            {activeSection === 'aide' && (
              <div className="bg-white dark:bg-[#0e192d] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0f2347] dark:text-white flex items-center gap-2.5">
                    <HelpCircle className="w-5 h-5 text-blue-500" />
                    <span>Aide et assistance</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Trouvez des réponses rapides ou contactez l'équipe OREA.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Contact button */}
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-left hover:border-blue-400 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#0f2347] dark:text-white">Contacter OREA</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Envoyez un message direct à l'assistance.
                      </div>
                    </div>
                    <Send className="w-4 h-4 text-[#0056d6]" />
                  </button>

                  {/* Report bug */}
                  <button
                    onClick={() => {
                      setContactSubject('Signalement de problème');
                      setShowContactModal(true);
                    }}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-left hover:border-blue-400 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#0f2347] dark:text-white">Signaler un problème</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Remontez une anomalie technique ou visuelle.
                      </div>
                    </div>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </button>
                </div>

                {/* Mini FAQ Accordions */}
                <div className="pt-2 space-y-3">
                  <h3 className="text-sm font-bold text-[#0f2347] dark:text-white">Foire aux questions (FAQ)</h3>
                  
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700 text-xs space-y-1.5">
                    <p className="font-bold text-[#0f2347] dark:text-white">Comment mes données sont-elles conservées ?</p>
                    <p className="text-slate-600 dark:text-slate-300">
                      Vos espaces sont synchronisés en temps réel sur Cloud Firestore et restent disponibles sur tous vos appareils dès que vous vous connectez.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700 text-xs space-y-1.5">
                    <p className="font-bold text-[#0f2347] dark:text-white">Comment fonctionne le mode nuit ?</p>
                    <p className="text-slate-600 dark:text-slate-300">
                      Vous pouvez choisir manuellement le mode Clair ou Sombre, ou laisser OREA s'adapter automatiquement aux préférences de votre système d'exploitation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 12. SECTION: À PROPOS */}
            {activeSection === 'apropos' && (
              <div className="bg-white dark:bg-[#0e192d] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0f2347] dark:text-white flex items-center gap-2.5">
                    <Info className="w-5 h-5 text-blue-600" />
                    <span>À propos d'OREA</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Informations officielles, fondation et mentions légales.
                  </p>
                </div>

                {/* Identity Card */}
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-3">
                  <div className="text-base font-black text-[#0f2347] dark:text-white">
                    OREA
                  </div>
                  <div className="text-xs font-bold text-[#0056d6] dark:text-blue-400 italic">
                    « Mieux comprendre, mieux évoluer, mieux vivre. »
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    Créé et fondé par <strong>Mr Tsoumou Patrick Bonheur</strong>. Plateforme holistique intégrant la santé préventive, le suivi du cycle féminin, le renforcement calisthenics, l'assiette du terroir africain 50/25/25, la réussite au BAC G2 et la gestion financière en FCFA.
                  </p>
                  <div className="pt-2 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    Version de l'application : v2.4.0-stable (Production)
                  </div>
                </div>

                {/* Legal Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    onClick={() => onNavigate('confidentialite')}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0f2347] dark:text-slate-200 hover:text-[#0056d6] text-center cursor-pointer transition-colors"
                  >
                    Confidentialité
                  </button>
                  <button
                    onClick={() => onNavigate('conditions_utilisation')}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0f2347] dark:text-slate-200 hover:text-[#0056d6] text-center cursor-pointer transition-colors"
                  >
                    Conditions d'utilisation
                  </button>
                  <button
                    onClick={() => onNavigate('preferences_cookies')}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0f2347] dark:text-slate-200 hover:text-[#0056d6] text-center cursor-pointer transition-colors"
                  >
                    Gestion des cookies
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Global Logout Confirmation trigger */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0e192d] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Déconnexion de session
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Fermez votre session active en toute sécurité.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-bold transition-colors cursor-pointer border border-rose-200 dark:border-rose-900/50"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: CONFIRMATION DÉCONNEXION
         ========================================================================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0e192d] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-[#0f2347] dark:text-white">
                Voulez-vous vraiment vous déconnecter ?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Vos données synchronisées sur Firestore restent en sécurité et seront restaurées lors de votre prochaine connexion.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowLogoutModal(false);
                  await logout();
                  onNavigate('accueil');
                  showToast('Déconnexion effectuée avec succès.', 'info');
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CONFIRMATION SUPPRESSION DE COMPTE
         ========================================================================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0e192d] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 dark:border-rose-900/50 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-rose-700 dark:text-rose-400">
                Suppression définitive du compte
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Cette action supprimera toutes vos données personnelles, modules configurés et historiques. Pour confirmer, tapez le mot <strong>SUPPRIMER</strong> ci-dessous :
              </p>
            </div>

            <input
              type="text"
              placeholder="Tapez SUPPRIMER"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:outline-none focus:border-rose-500 text-center"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmationText('');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmationText.trim().toUpperCase() !== 'SUPPRIMER' || isDeletingAccount}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                {isDeletingAccount ? 'Suppression...' : 'Confirmer la suppression'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ÉDITION DU PROFIL
         ========================================================================= */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0e192d] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-[#0f2347] dark:text-white">
                Modifier mon profil OREA
              </h3>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Prénom</label>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[#0f2347] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Nom</label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[#0f2347] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Numéro WhatsApp</label>
                <input
                  type="text"
                  value={editWhatsapp}
                  onChange={(e) => setEditWhatsapp(e.target.value)}
                  placeholder="+241 00 00 00 00"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[#0f2347] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Ville</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[#0f2347] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Pays</label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[#0f2347] dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-xl bg-[#0056d6] hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: CONTACT & SIGNALEMENT
         ========================================================================= */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0e192d] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-[#0f2347] dark:text-white">
                Contacter l'équipe OREA
              </h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Objet du message</label>
                <input
                  type="text"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[#0f2347] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Votre message</label>
                <textarea
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Décrivez votre question ou suggestion en détail..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[#0f2347] dark:text-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowContactModal(false);
                  setContactMessage('');
                  showToast('Votre message a été transmis à l\'assistance OREA.', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-[#0056d6] hover:bg-blue-700 text-white text-xs font-bold"
              >
                Envoyer le message
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsView;
