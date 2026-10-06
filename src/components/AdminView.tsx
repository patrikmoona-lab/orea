import React, { useState } from 'react';
import {
  ShieldCheck,
  Database,
  Users,
  Activity,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Target,
  BarChart3,
  History,
  Bell,
  ArrowRight
} from 'lucide-react';
import { OreaUserProfile, NavSection } from '../types';
import { ADMIN_EMAIL } from '../lib/firebase';

interface AdminViewProps {
  userProfile: OreaUserProfile | null;
  onNavigate: (section: NavSection) => void;
  initialTab?: 'suivi' | 'system';
}

export const AdminView: React.FC<AdminViewProps> = ({
  userProfile,
  onNavigate,
  initialTab = 'suivi'
}) => {
  const [adminSection, setAdminSection] = useState<'suivi' | 'system'>(initialTab);

  const isAuthorized =
    userProfile &&
    (userProfile.role === 'admin' ||
      userProfile.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  if (!isAuthorized) {
    return (
      <div className="w-full min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[28px] border border-red-200 p-8 text-center shadow-xl">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-[#07111F]">Accès Administrateur Restreint</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 mb-6">
            Cette zone de configuration et de supervision est strictement réservée aux administrateurs autorisés d'OREA.
          </p>
          <button
            type="button"
            onClick={() => onNavigate(userProfile ? 'dashboard' : 'auth')}
            className="w-full py-3 rounded-xl bg-[#0056d6] text-white font-bold text-xs sm:text-sm hover:bg-blue-700 transition-colors cursor-pointer"
          >
            {userProfile ? 'Retourner à mon tableau de bord' : 'Se connecter'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)] py-6 sm:py-8 px-4 sm:px-8 max-w-[1440px] mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Retour au tableau de bord"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#07111F]">
                Console d'Administration OREA
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Connecté en tant que <span className="font-semibold text-slate-800">{userProfile.email}</span>
            </p>
          </div>
        </div>

        {/* Global Admin Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAdminSection('suivi')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              adminSection === 'suivi'
                ? 'bg-[#0056d6] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>📊 Mon Suivi Admin</span>
          </button>

          <button
            onClick={() => setAdminSection('system')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              adminSection === 'system'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>🛡️ Supervision Système</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          SECTION 1: MON SUIVI ADMIN
         ========================================================= */}
      {adminSection === 'suivi' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#07111F]">
                  Section « MON SUIVI » — Espace de Suivi Administrateur
                </h2>
                <p className="text-xs text-slate-500">
                  Accédez directement à vos 4 outils de suivi connectés en temps réel à Firestore.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Objectifs */}
              <div
                onClick={() => onNavigate('objectifs')}
                className="p-5 rounded-2xl bg-white border border-[#cfe2f5] hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0056d6] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Target className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-[#07111F] group-hover:text-blue-600 transition-colors">
                  Objectifs
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Gérer, créer et suivre les objectifs personnalisés et jalons.
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-blue-600">
                  <span>Ouvrir les Objectifs</span>
                  <span className="text-slate-400">/mon-orea/objectifs</span>
                </div>
              </div>

              {/* 2. Progression */}
              <div
                onClick={() => onNavigate('progression')}
                className="p-5 rounded-2xl bg-white border border-[#cfe2f5] hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-[#07111F] group-hover:text-emerald-600 transition-colors">
                  Progression
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Analyse en temps réel de l'activation des 6 espaces OREA.
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-600">
                  <span>Ouvrir la Progression</span>
                  <span className="text-slate-400">/mon-orea/progression</span>
                </div>
              </div>

              {/* 3. Activité */}
              <div
                onClick={() => onNavigate('activite')}
                className="p-5 rounded-2xl bg-white border border-[#cfe2f5] hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <History className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-[#07111F] group-hover:text-purple-600 transition-colors">
                  Activité
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Journal d'audit et historique complet des actions effectuées.
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-purple-600">
                  <span>Ouvrir l'Activité</span>
                  <span className="text-slate-400">/mon-orea/activite</span>
                </div>
              </div>

              {/* 4. Notifications */}
              <div
                onClick={() => onNavigate('notifications')}
                className="p-5 rounded-2xl bg-white border border-[#cfe2f5] hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Bell className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-[#07111F] group-hover:text-amber-600 transition-colors">
                  Notifications
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Centre de notifications, alertes systèmes et rappels.
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-amber-600">
                  <span>Ouvrir les Notifications</span>
                  <span className="text-slate-400">/mon-orea/notifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 2: SUPERVISION SYSTÈME & SÉCURITÉ
         ========================================================= */}
      {adminSection === 'system' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Firebase Authentication */}
            <div className="bg-white rounded-2xl p-5 border border-[#cfe2f5] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-[#07111F]">Firebase Authentication</h3>
              <p className="text-xs text-slate-500">
                Chiffrement des mots de passe géré côté serveur par Firebase Auth. Aucun mot de passe en clair.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-emerald-600">
                Statut : Actif & Sécurisé
              </div>
            </div>

            {/* Firestore Database & RBAC */}
            <div className="bg-white rounded-2xl p-5 border border-[#cfe2f5] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-[#07111F]">Firestore & Sécurité RBAC</h3>
              <p className="text-xs text-slate-500">
                Règles Firestore déployées. Cloisonnement strict des données utilisateurs et privilèges admin.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-emerald-600">
                Règles actives : 8 Piliers de Sécurité
              </div>
            </div>

            {/* Intelligence Engine */}
            <div className="bg-white rounded-2xl p-5 border border-[#cfe2f5] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-[#07111F]">Moteur IA & Connaissances</h3>
              <p className="text-xs text-slate-500">
                Modèles de langage et assistance médicale préventive OREA disponibles.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-purple-600">
                Assistant OREA : Connecté
              </div>
            </div>
          </div>

          {/* Admin Information Panel */}
          <div className="bg-white rounded-[24px] border border-[#cfe2f5] p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-black text-[#07111F]">
              Droits d'administration et configuration
            </h2>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <p>
                • <strong>Compte Super Administrateur principal :</strong> {ADMIN_EMAIL}
              </p>
              <p>
                • <strong>Permissions :</strong> Audits de sécurité, supervision des rôles utilisateurs et des règles Firestore.
              </p>
              <p>
                • <strong>Isolement des données :</strong> Les utilisateurs standard ont un accès exclusif à leur document personnel <code className="bg-white px-1.5 py-0.5 rounded border">users/&#123;uid&#125;</code>.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2.5 rounded-xl bg-[#0056d6] hover:bg-blue-700 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Accéder à mon tableau personnel (Mon OREA)
              </button>
              <button
                type="button"
                onClick={() => onNavigate('accueil')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Voir le site public
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminView;
