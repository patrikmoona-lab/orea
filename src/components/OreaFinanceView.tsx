import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Coins,
  TrendingUp,
  PiggyBank,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PieChart,
  Sliders,
  Edit3
} from 'lucide-react';
import { DEFAULT_BUDGET_CATEGORIES } from '../data';
import { ModuleOnboardingWizard } from './onboarding/ModuleOnboardingWizard';
import { FINANCE_QUESTIONS } from '../data/modulesOnboardingData';
import { OreaModuleAIWidget } from './common/OreaModuleAIWidget';
import { OreaUserProfile } from '../types';
import {
  isModuleConfigured,
  getModuleProfile,
  saveModuleProfile,
  clearModuleProfile,
} from '../utils/oreaProfileStorage';
import { useAuth } from '../context/AuthContext';
import { fetchFirestoreModule } from '../lib/firebase';

interface OreaFinanceViewProps {
  onBackToHome: () => void;
  currentUserProfile?: OreaUserProfile | null;
}

export const OreaFinanceView: React.FC<OreaFinanceViewProps> = ({ onBackToHome, currentUserProfile }) => {
  const { currentUser, authLoading } = useAuth();
  const [isConfigured, setIsConfigured] = useState<boolean>(() => {
    return isModuleConfigured('finance');
  });
  const [dbLoading, setDbLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkConfig() {
      if (authLoading) return;
      if (!currentUser) {
        setDbLoading(false);
        return;
      }
      try {
        const docSnap = await fetchFirestoreModule(currentUser.uid, 'finance');
        if (docSnap && docSnap.enabled) {
          const pseudo = docSnap.data?.pseudo || docSnap.data?.name || docSnap.data?.prenom || 'Membre OREA';
          const profile = {
            id: 'profile-finance-firestore',
            module: 'finance',
            name: pseudo,
            answers: docSnap.data || {},
            createdAt: docSnap.createdAt,
            updatedAt: docSnap.updatedAt,
          };
          localStorage.setItem('orea_profile_finance', JSON.stringify(profile));
          localStorage.setItem('orea_configured_finance', 'true');
          setIsConfigured(true);
        } else {
          localStorage.removeItem('orea_profile_finance');
          localStorage.removeItem('orea_configured_finance');
          setIsConfigured(false);
        }
      } catch (err) {
        console.warn("[OreaFinanceView] Firestore check error:", err);
        setIsConfigured(isModuleConfigured('finance'));
      } finally {
        setDbLoading(false);
      }
    }
    checkConfig();
  }, [currentUser, authLoading]);

  const moduleProfile = useMemo(() => getModuleProfile('finance'), [isConfigured]);

  const [categories, setCategories] = useState(DEFAULT_BUDGET_CATEGORIES);
  const [monthlyIncomeFcfa, setMonthlyIncomeFcfa] = useState<number>(350000); // 350,000 FCFA
  const [savingsGoal, setSavingsGoal] = useState({
    title: 'Fonds de Sécurité Santé & Projet OREA',
    targetFcfa: 1000000,
    currentFcfa: 420000,
    deadline: 'Décembre 2026',
  });

  if (authLoading || dbLoading) {
    return (
      <div className="min-h-screen bg-[#f8fbfe] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 animate-pulse">
          <Coins className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Vérification de votre espace OREA...</p>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <ModuleOnboardingWizard
        moduleId="finance"
        moduleTitle="OREA Finance & Budget"
        moduleSubtitle="Suivi budgétaire en FCFA & épargne"
        moduleIcon={<Coins className="w-8 h-8 text-emerald-700" />}
        accentColor="emerald"
        questions={FINANCE_QUESTIONS}
        onComplete={(answers) => {
          saveModuleProfile('finance', answers);
          setIsConfigured(true);
        }}
        onCancel={onBackToHome}
      />
    );
  }

  const totalSpentFcfa = categories.reduce((acc, curr) => acc + curr.spentFcfa, 0);
  const totalAllocatedFcfa = categories.reduce((acc, curr) => acc + curr.allocatedFcfa, 0);
  const remainingBudgetFcfa = monthlyIncomeFcfa - totalSpentFcfa;

  const formatFcfa = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';
  };

  return (
    <div className="min-h-screen bg-[#f8fbfe] pb-16">
      {/* Header */}
      <div className="bg-white border-b border-[#e2eaf4] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl text-slate-500 hover:text-[#0056d6] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Coins className="w-4.5 h-4.5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#0f2347] flex items-center gap-2">
                  <span>OREA Finance & Budget</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                    FCFA (XAF/XOF)
                  </span>
                </h1>
                <p className="text-xs text-slate-500">
                  Bonjour {moduleProfile?.name || 'Membre OREA'} — Gérez votre budget personnel en FCFA.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsConfigured(false);
              }}
              className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Modifier mes préférences financières"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Modifier mon profil</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Règle 50/30/20</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#e2eaf4] shadow-xs">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Revenu Mensuel Prévu</span>
            <div className="mt-2 text-2xl font-extrabold text-[#0f2347]">
              {formatFcfa(monthlyIncomeFcfa)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Salaire, activité ou commerce</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2eaf4] shadow-xs">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Dépenses Engagées</span>
            <div className="mt-2 text-2xl font-extrabold text-orange-600">
              {formatFcfa(totalSpentFcfa)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Sur {formatFcfa(totalAllocatedFcfa)} budgetisé
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2eaf4] shadow-xs">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Solde Disponible Réel</span>
            <div className={`mt-2 text-2xl font-extrabold ${remainingBudgetFcfa >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatFcfa(remainingBudgetFcfa)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Capacité d'épargne ou réserve</p>
          </div>
        </div>

        {/* Budget categories table & Savings goal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#e2eaf4] shadow-xs">
            <h3 className="text-base sm:text-lg font-bold text-[#0f2347] mb-4">
              Répartition par postes de dépenses
            </h3>

            <div className="space-y-4">
              {categories.map((cat) => {
                const percent = Math.min(100, Math.round((cat.spentFcfa / cat.allocatedFcfa) * 100));
                return (
                  <div key={cat.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-[#0f2347]">{cat.name}</span>
                      <div className="text-xs text-slate-600">
                        <strong className="text-[#0f2347]">{formatFcfa(cat.spentFcfa)}</strong> / {formatFcfa(cat.allocatedFcfa)}
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          percent > 90 ? 'bg-red-500' : percent > 70 ? 'bg-orange-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                      <span>Utilisation : {percent}%</span>
                      <span>Reste : {formatFcfa(Math.max(0, cat.allocatedFcfa - cat.spentFcfa))}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Savings Goal Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#e2eaf4] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <PiggyBank className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0f2347] mb-1">{savingsGoal.title}</h4>
              <p className="text-xs text-slate-500 mb-4">Échéance fixée à {savingsGoal.deadline}</p>

              <div className="text-2xl font-extrabold text-emerald-600 mb-1">
                {formatFcfa(savingsGoal.currentFcfa)}
              </div>
              <p className="text-xs text-slate-400 mb-4">Objectif : {formatFcfa(savingsGoal.targetFcfa)}</p>

              {/* Progress */}
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden mb-2">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(savingsGoal.currentFcfa / savingsGoal.targetFcfa) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 font-semibold text-right">
                {Math.round((savingsGoal.currentFcfa / savingsGoal.targetFcfa) * 100)}% réalisé
              </p>
            </div>

            {/* Financial Health Rule */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xs space-y-2">
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Conseil OREA Finance :</span>
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Constituez d'abord un <strong>coussin d'urgence de 3 mois de dépenses</strong> avant d'investir dans des projets spéculatifs. Une santé financière sereine protège directement votre santé mentale et votre tension artérielle.
              </p>
            </div>
          </div>
        </div>
      </div>

      <OreaModuleAIWidget moduleId="finance" moduleTitle="Finance & Budget" currentUserProfile={currentUserProfile} />
    </div>
  );
};
