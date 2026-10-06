import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  ArrowLeft,
  Plus,
  Sliders,
  Bell,
  Lock,
  Sparkles,
  BookOpen,
  Calendar as CalendarIcon,
  FileText,
  Shield,
  Activity,
  Droplets,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Edit3
} from 'lucide-react';
import { OreaUserProfile } from '../types';
import {
  CycleEntry,
  DailyCycleLog,
  CycleNoteItem,
  CycleSettings,
  CycleCalculationResult
} from '../types/cycle';
import {
  calculateDeterministicCycle,
  formatFrenchCycleDate,
  DEFAULT_CYCLE_SETTINGS
} from '../services/cycleEngine';
import {
  loadCycleUserData,
  persistCycleUserData,
  clearAllCycleUserData,
  CycleUserData
} from '../services/cycleStorageService';
import { useAuth } from '../context/AuthContext';

// Subcomponents
import { OreaCycleQuestionnaireModal, CycleQuestionnaireAnswers } from './cycle/OreaCycleQuestionnaireModal';
import { OreaCycleCalendar } from './cycle/OreaCycleCalendar';
import { OreaCycleCurrentSummary } from './cycle/OreaCycleCurrentSummary';
import { OreaCycleQuickSymptomsSection } from './cycle/OreaCycleQuickSymptomsSection';
import { OreaCycleAddPeriodModal } from './cycle/OreaCycleAddPeriodModal';
import { OreaCycleDailyLogModal } from './cycle/OreaCycleDailyLogModal';
import { OreaCycleRegularityCard } from './cycle/OreaCycleRegularityCard';
import { OreaCycleFertilityCard } from './cycle/OreaCycleFertilityCard';
import { OreaCycleHistoryView } from './cycle/OreaCycleHistoryView';
import { OreaCycleEducationView } from './cycle/OreaCycleEducationView';
import { OreaCycleNotesModal } from './cycle/OreaCycleNotesModal';
import { OreaCycleRemindersModal } from './cycle/OreaCycleRemindersModal';
import { OreaCyclePrivacyModal } from './cycle/OreaCyclePrivacyModal';
import { OreaCycleAiModal } from './cycle/OreaCycleAiModal';
import { OreaCycleUnsavedPrompt } from './cycle/OreaCycleUnsavedPrompt';

interface OreaCycleViewProps {
  onBackToHome: () => void;
  currentUserProfile?: OreaUserProfile | null;
  onNavigateToSante?: () => void;
  onNavigateToSos?: () => void;
}

export const OreaCycleView: React.FC<OreaCycleViewProps> = ({
  onBackToHome,
  currentUserProfile,
  onNavigateToSante,
  onNavigateToSos
}) => {
  const { currentUser, userProfile, authLoading } = useAuth();

  const userFirstName = useMemo(() => {
    const raw =
      userProfile?.firstName ||
      currentUserProfile?.firstName ||
      userProfile?.displayName ||
      currentUserProfile?.displayName ||
      currentUser?.displayName;
    if (!raw || raw.toLowerCase() === 'visiteur' || raw.toLowerCase() === 'user' || raw.toLowerCase() === 'undefined') {
      return 'Chère Membre';
    }
    return raw.split(' ')[0];
  }, [userProfile, currentUserProfile, currentUser]);

  const uid = userProfile?.uid || currentUserProfile?.uid || currentUser?.uid || 'guest';

  // Master State
  const [loading, setLoading] = useState(true);
  const [welcomeShown, setWelcomeShown] = useState(true); // default true until loaded
  const [entries, setEntries] = useState<CycleEntry[]>([]);
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyCycleLog>>({});
  const [notes, setNotes] = useState<CycleNoteItem[]>([]);
  const [settings, setSettings] = useState<CycleSettings>(DEFAULT_CYCLE_SETTINGS);

  // Calendar State
  const today = useMemo(() => new Date(), []);
  const todayIso = today.toISOString().split('T')[0];
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);

  // View Mode: Detailed vs Simplified
  const [isSimplifiedView, setIsSimplifiedView] = useState<boolean>(() => {
    try {
      return localStorage.getItem('orea_cycle_simplified_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'calendar' | 'history' | 'stats' | 'education'>('calendar');

  // Modals & Panels
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isAddPeriodModalOpen, setIsAddPeriodModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CycleEntry | null>(null);
  const [isDailyLogModalOpen, setIsDailyLogModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isUnsavedPromptOpen, setIsUnsavedPromptOpen] = useState(false);

  // Toast confirmation message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Load User Cycle Data
  useEffect(() => {
    let isMounted = true;
    async function initData() {
      setLoading(true);
      try {
        const data: CycleUserData = await loadCycleUserData(uid);
        if (!isMounted) return;
        setWelcomeShown(data.welcomeShown);
        setEntries(data.entries);
        setDailyLogs(data.dailyLogs);
        setNotes(data.notes);
        setSettings(data.settings);

        if (!data.welcomeShown) {
          setIsQuestionnaireOpen(true);
        }
      } catch (err) {
        console.warn('[OreaCycleView] Load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    initData();
    return () => {
      isMounted = false;
    };
  }, [uid]);

  // Deterministic Cycle Calculation
  const cycleStats: CycleCalculationResult = useMemo(() => {
    return calculateDeterministicCycle(entries, settings, today);
  }, [entries, settings, today]);

  // Save changes to persistent storage
  const handlePersistChanges = async (
    newEntries = entries,
    newLogs = dailyLogs,
    newNotes = notes,
    newSettings = settings,
    newWelcome = welcomeShown
  ) => {
    const payload: CycleUserData = {
      welcomeShown: newWelcome,
      entries: newEntries,
      dailyLogs: newLogs,
      notes: newNotes,
      settings: newSettings,
      lastVisitedAt: new Date().toISOString()
    };
    await persistCycleUserData(uid, payload);
  };

  // Questionnaire Complete
  const handleQuestionnaireComplete = (answers: CycleQuestionnaireAnswers) => {
    const newSettings: CycleSettings = {
      ...settings,
      averagePeriodDays:
        typeof answers.periodDurationDays === 'number'
          ? answers.periodDurationDays
          : settings.averagePeriodDays || 5,
      averageCycleDays:
        typeof answers.cycleDurationDays === 'number'
          ? answers.cycleDurationDays
          : settings.averageCycleDays || 28,
      birthDate: answers.birthDate,
      perceivedRegularity: answers.perceivedRegularity,
      trackedAspects: answers.trackedAspects
    };

    let updatedEntries = [...entries];

    // If last period date was provided, create/update main entry
    if (answers.lastPeriodStartDate) {
      const existingLatest = updatedEntries.find((e) => e.startDate === answers.lastPeriodStartDate);
      if (!existingLatest) {
        const newMainEntry: CycleEntry = {
          id: `cycle-${Date.now()}`,
          startDate: answers.lastPeriodStartDate,
          flow: 'moyen',
          symptoms: [],
          updatedAt: new Date().toISOString()
        };
        updatedEntries.unshift(newMainEntry);
      }
    }

    // If past cycles dates were provided, add them as older entries
    if (answers.pastCyclesDates && answers.pastCyclesDates.length > 0) {
      answers.pastCyclesDates.forEach((pDate, idx) => {
        if (pDate && !updatedEntries.some((e) => e.startDate === pDate)) {
          updatedEntries.push({
            id: `cycle-past-${Date.now()}-${idx}`,
            startDate: pDate,
            flow: 'moyen',
            symptoms: [],
            updatedAt: new Date().toISOString()
          });
        }
      });
    }

    // Sort by date descending
    updatedEntries.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    setSettings(newSettings);
    setEntries(updatedEntries);
    setWelcomeShown(true);
    setIsQuestionnaireOpen(false);

    handlePersistChanges(updatedEntries, dailyLogs, notes, newSettings, true);
    triggerToast(`🌸 Bon retour, ${userFirstName} — Votre espace Mon Cycle est prêt.`);
  };

  // Skip questionnaire for later
  const handleSkipQuestionnaire = () => {
    setWelcomeShown(true);
    setIsQuestionnaireOpen(false);
    handlePersistChanges(entries, dailyLogs, notes, settings, true);
  };

  // Period Save
  const handleSavePeriod = (entry: CycleEntry) => {
    const exists = entries.some((e) => e.id === entry.id);
    let updated: CycleEntry[];
    if (exists) {
      updated = entries.map((e) => (e.id === entry.id ? entry : e));
    } else {
      updated = [entry, ...entries];
    }
    setEntries(updated);
    setIsAddPeriodModalOpen(false);
    setEditingEntry(null);
    handlePersistChanges(updated, dailyLogs, notes, settings, true);
    triggerToast('✓ Informations enregistrées');
  };

  // Period Delete
  const handleDeletePeriod = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    handlePersistChanges(updated, dailyLogs, notes, settings, true);
    triggerToast('✓ Cycle supprimé de votre historique');
  };

  // Quick Daily Log Update (1-tap inline)
  const handleQuickUpdateDailyLog = (date: string, log: DailyCycleLog) => {
    const updated = {
      ...dailyLogs,
      [date]: log
    };
    setDailyLogs(updated);
    handlePersistChanges(entries, updated, notes, settings, true);
  };

  // Daily Log Save
  const handleSaveDailyLog = (date: string, log: DailyCycleLog) => {
    const updated = {
      ...dailyLogs,
      [date]: log
    };
    setDailyLogs(updated);
    setIsDailyLogModalOpen(false);
    handlePersistChanges(entries, updated, notes, settings, true);
    triggerToast('✓ Ressentis du jour enregistrés');
  };

  // Daily Log Delete
  const handleDeleteDailyLog = (date: string) => {
    const updated = { ...dailyLogs };
    delete updated[date];
    setDailyLogs(updated);
    setIsDailyLogModalOpen(false);
    handlePersistChanges(entries, updated, notes, settings, true);
    triggerToast('✓ Note du jour effacée');
  };

  // Note Save
  const handleSaveNote = (noteItem: CycleNoteItem) => {
    const exists = notes.some((n) => n.id === noteItem.id);
    let updated: CycleNoteItem[];
    if (exists) {
      updated = notes.map((n) => (n.id === noteItem.id ? noteItem : n));
    } else {
      updated = [noteItem, ...notes];
    }
    setNotes(updated);
    handlePersistChanges(entries, dailyLogs, updated, settings, true);
    triggerToast('✓ Note enregistrée');
  };

  // Note Delete
  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    handlePersistChanges(entries, dailyLogs, updated, settings, true);
    triggerToast('✓ Note supprimée');
  };

  // Settings Save
  const handleSaveSettings = (newSettings: CycleSettings) => {
    setSettings(newSettings);
    handlePersistChanges(entries, dailyLogs, notes, newSettings, true);
    triggerToast('✓ Paramètres et rappels mis à jour');
  };

  // Export Data JSON
  const handleExportData = () => {
    const dataToExport = {
      user: userFirstName,
      exportedAt: new Date().toISOString(),
      cycleSettings: settings,
      entries,
      dailyLogs,
      notes
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orea_mon_cycle_export_${todayIso}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('✓ Fichier d’export téléchargé');
  };

  // Delete All Data
  const handleDeleteAllData = async () => {
    await clearAllCycleUserData(uid);
    setEntries([]);
    setDailyLogs({});
    setNotes([]);
    setSettings(DEFAULT_CYCLE_SETTINGS);
    setWelcomeShown(false);
    triggerToast('✓ Toutes vos données Mon Cycle ont été effacées');
  };

  // Toggle Simplified View
  const handleToggleSimplifiedView = () => {
    const nextVal = !isSimplifiedView;
    setIsSimplifiedView(nextVal);
    try {
      localStorage.setItem('orea_cycle_simplified_mode', String(nextVal));
    } catch {}
  };

  // Selected date log
  const selectedLog = dailyLogs[selectedDate];

  // Severe symptoms check for benevolent medical prudence
  const hasSeverePain = selectedLog && (selectedLog.painLevel || 0) >= 7;

  if (loading || authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 animate-pulse">
          <Heart className="w-6 h-6 text-rose-600" />
        </div>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Chargement de votre espace Mon Cycle...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 pb-24 text-slate-900 dark:text-white relative">
      {/* =========================================================================
          DISCREET FLOATING TOAST NOTIFICATION
      ========================================================================= */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-bounce-short">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 font-bold text-xs shadow-xl backdrop-blur-md flex items-center gap-2 border border-slate-700/50 dark:border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* =========================================================================
          TOP HEADER BAR
      ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 sticky top-14 sm:top-15 lg:top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="p-2 rounded-xl text-slate-500 hover:text-[#0056d6] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-xs">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Mon Cycle</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold tracking-wide">
                    2.0
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Bon retour, {userFirstName} 🌸 — Suivi intime, calme et algorithmique
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Controls */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <button
              type="button"
              onClick={handleToggleSimplifiedView}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSimplifiedView
                  ? 'border-blue-300 bg-blue-50 dark:bg-blue-950/50 text-[#0056d6] dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="Basculer entre la vue simplifiée et la vue détaillée"
            >
              {isSimplifiedView ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isSimplifiedView ? 'Vue simplifiée' : 'Vue détaillée'}</span>
            </button>

            {/* AI Assistant */}
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="p-2 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100/60 transition-colors cursor-pointer"
              title="Poser une question à Votre IA"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Edit Cycle Repères */}
            <button
              type="button"
              onClick={() => setIsQuestionnaireOpen(true)}
              className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100/60 transition-colors cursor-pointer"
              title="Modifier mon cycle & mes repères"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Notes */}
            <button
              type="button"
              onClick={() => setIsNotesModalOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative"
              title="Mes notes privées"
            >
              <FileText className="w-4 h-4" />
              {notes.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-600" />
              )}
            </button>

            {/* Reminders */}
            <button
              type="button"
              onClick={() => setIsRemindersModalOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Mes rappels"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Privacy */}
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Confidentialité de mes données"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Main Action: + Enregistrer mes règles */}
            <button
              type="button"
              onClick={() => {
                setEditingEntry(null);
                setIsAddPeriodModalOpen(true);
              }}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Enregistrer mes règles</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation (only in detailed view) */}
        {!isSimplifiedView && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto py-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className={`px-3.5 py-2 text-xs font-extrabold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Calendrier & Aujourd'hui
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-2 text-xs font-extrabold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Historique ({entries.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stats')}
              className={`px-3.5 py-2 text-xs font-extrabold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Régularité & Fertilité
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('education')}
              className={`px-3.5 py-2 text-xs font-extrabold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'education'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Comprendre mon cycle
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          MAIN CONTAINER
      ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* =========================================================================
            BENEVOLENT HEALTH DISCRETION NOTICE / ALERT
        ========================================================================= */}
        {hasSeverePain && (
          <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-950 dark:text-amber-200 text-xs sm:text-sm flex flex-col md:flex-row items-start justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-950 dark:text-amber-100">
                  Information de prudence bienveillante OREA :
                </p>
                <p className="leading-relaxed text-amber-900 dark:text-amber-300">
                  Vous avez enregistré une gêne ou douleur importante ({selectedLog?.painLevel}/10). Si cela persiste, vous inquiète ou est inhabituel pour vous, n'hésitez pas à consulter un médecin ou une sage-femme.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              {onNavigateToSante && (
                <button
                  type="button"
                  onClick={onNavigateToSante}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 hover:bg-amber-200 text-amber-900 dark:text-amber-100 font-bold text-xs transition-colors cursor-pointer"
                >
                  Ouvrir Santé
                </button>
              )}
              {onNavigateToSos && (
                <button
                  type="button"
                  onClick={onNavigateToSos}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Ouvrir SOS
                </button>
              )}
            </div>
          </div>
        )}

        {/* Empty state prompt if 0 entries recorded */}
        {entries.length === 0 && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/20 border border-rose-200/80 dark:border-rose-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                <span>Commençons simplement 🌸</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Enregistrez votre dernier cycle pour activer vos repères personnalisés et vos estimations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingEntry(null);
                setIsAddPeriodModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer shrink-0"
            >
              + Enregistrer mes règles
            </button>
          </div>
        )}

        {/* =========================================================================
            HERO: 4 KEY SUMMARY CARDS (Mon Cycle Actuel)
        ========================================================================= */}
        <OreaCycleCurrentSummary
          cycleStats={cycleStats}
          userFirstName={userFirstName}
          onEditCycle={() => setIsQuestionnaireOpen(true)}
        />

        {/* =========================================================================
            SECTION: MES SYMPTÔMES & RESSENTIS (1-CLIC QUOTIDIEN)
        ========================================================================= */}
        <OreaCycleQuickSymptomsSection
          selectedDate={selectedDate}
          todayIso={todayIso}
          dailyLogs={dailyLogs}
          cycleStats={cycleStats}
          onUpdateDailyLog={handleQuickUpdateDailyLog}
          onSelectToday={() => setSelectedDate(todayIso)}
          onOpenFullModal={() => setIsDailyLogModalOpen(true)}
        />

        {/* =========================================================================
            SIMPLIFIED VIEW OR TAB 1: CALENDAR & TODAY INTERACTIVE SECTION
        ========================================================================= */}
        {(isSimplifiedView || activeTab === 'calendar') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Calendar Main Component (8 cols on desktop) */}
            <div className="lg:col-span-8">
              <OreaCycleCalendar
                currentCalendarDate={currentCalendarDate}
                selectedDate={selectedDate}
                cycleStats={cycleStats}
                entries={entries}
                dailyLogs={dailyLogs}
                averagePeriodDays={settings.averagePeriodDays}
                onSelectDate={(d) => setSelectedDate(d)}
                onPrevMonth={() =>
                  setCurrentCalendarDate(
                    new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1)
                  )
                }
                onNextMonth={() =>
                  setCurrentCalendarDate(
                    new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1)
                  )
                }
                onTodayMonth={() => {
                  setCurrentCalendarDate(new Date(today.getFullYear(), today.getMonth(), 1));
                  setSelectedDate(todayIso);
                }}
                onOpenAddPeriod={() => {
                  setEditingEntry(null);
                  setIsAddPeriodModalOpen(true);
                }}
              />
            </div>

            {/* Selected Date Detail Interactive Panel (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Daily Log Panel */}
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Détails de la date
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white capitalize">
                      {formatFrenchCycleDate(selectedDate)}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDailyLogModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100/70 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{selectedLog ? 'Modifier' : 'Noter'}</span>
                  </button>
                </div>

                {/* Day status summary */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {selectedDate >= (cycleStats.fertileWindowStart || '') && selectedDate <= (cycleStats.fertileWindowEnd || '') ? (
                    <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-bold">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>Fenêtre de fertilité estimée</span>
                    </div>
                  ) : selectedDate === cycleStats.lastPeriodStartDate ? (
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold">
                      <Droplets className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>Début des dernières règles</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                      <Activity className="w-4 h-4 text-[#0056d6] dark:text-blue-400" />
                      <span>Phase {cycleStats.currentPhase}</span>
                    </div>
                  )}
                </div>

                {/* Recorded symptoms & feelings */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Ressentis enregistrés :
                  </label>
                  {selectedLog ? (
                    <div className="space-y-2.5">
                      {/* Mood & Energy badges */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        {selectedLog.mood && (
                          <span className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold border border-rose-100 dark:border-rose-900">
                            Humeur : {selectedLog.mood.replace('_', ' ')}
                          </span>
                        )}
                        {selectedLog.energy && (
                          <span className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-100 dark:border-amber-900">
                            Énergie : {selectedLog.energy.replace('_', ' ')}
                          </span>
                        )}
                        {selectedLog.painLevel !== undefined && selectedLog.painLevel > 0 && (
                          <span className="px-2.5 py-1 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 font-bold border border-red-100 dark:border-red-900">
                            Douleur : {selectedLog.painLevel}/10
                          </span>
                        )}
                      </div>

                      {/* Symptoms tags */}
                      {selectedLog.symptoms && selectedLog.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {selectedLog.symptoms.map((s) => (
                            <span
                              key={s}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {selectedLog.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          « {selectedLog.notes} »
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 py-4 text-center bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      Aucun ressenti noté pour cette date.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsDailyLogModalOpen(true)}
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                >
                  + Noter mes ressentis du jour
                </button>
              </div>

              {/* Natural Wellness Card */}
              <div className="bg-gradient-to-br from-white to-rose-50/50 dark:from-slate-900 dark:to-rose-950/30 p-5 sm:p-6 rounded-3xl border border-rose-100/80 dark:border-rose-900/40 shadow-xs space-y-2.5">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>Conseil OREA du jour</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cycleStats.currentPhase === 'menstruelle'
                    ? 'Privilégiez la chaleur apaisante (bouillotte tiède), le repos et des tisanes douces de bissap ou gingembre.'
                    : cycleStats.currentPhase === 'folliculaire'
                    ? 'Votre niveau d’énergie augmente naturellement. Idéal pour de nouveaux projets et une reprise active du sport.'
                    : cycleStats.currentPhase === 'ovulatoire'
                    ? 'Pic de vitalité et d’hydratation. Buvez au moins 2L d’eau et consommez des fruits frais vitaminés.'
                    : 'Le corps sécrète de la progestérone. Privilégiez des aliments riches en magnésium (bananes plantain, chocolat noir) et des étirements doux.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: HISTORIQUE
        ========================================================================= */}
        {!isSimplifiedView && activeTab === 'history' && (
          <OreaCycleHistoryView
            entries={entries}
            onOpenAddPeriod={(entry) => {
              setEditingEntry(entry || null);
              setIsAddPeriodModalOpen(true);
            }}
            onDeletePeriod={handleDeletePeriod}
          />
        )}

        {/* =========================================================================
            TAB 3: STATS, RÉGULARITÉ & FERTILITÉ
        ========================================================================= */}
        {!isSimplifiedView && activeTab === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OreaCycleRegularityCard cycleStats={cycleStats} />
            <OreaCycleFertilityCard cycleStats={cycleStats} />
          </div>
        )}

        {/* =========================================================================
            TAB 4: PÉDAGOGIE & COMPRENDRE MON CYCLE
        ========================================================================= */}
        {!isSimplifiedView && activeTab === 'education' && (
          <OreaCycleEducationView currentActivePhase={cycleStats.currentPhase} />
        )}

        {/* =========================================================================
            PRIVACY & CONFIDENTIALITY FOOTER CARD
        ========================================================================= */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                Vos données restent privées & confidentielles 🔒
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chiffrement sécurisé, zéro revente, contrôle total et suppression en un clic.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPrivacyModalOpen(true)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer shrink-0"
          >
            En savoir plus & Gérer mes données
          </button>
        </div>

      </div>

      {/* =========================================================================
          MODALS
      ========================================================================= */}
      <OreaCycleQuestionnaireModal
        isOpen={isQuestionnaireOpen}
        userFirstName={userFirstName}
        initialBirthDate={userProfile?.dateOfBirth || currentUserProfile?.dateOfBirth || settings.birthDate}
        existingSettings={settings}
        existingEntries={entries}
        onComplete={handleQuestionnaireComplete}
        onSkipLater={handleSkipQuestionnaire}
      />

      <OreaCycleAddPeriodModal
        isOpen={isAddPeriodModalOpen}
        entryToEdit={editingEntry}
        initialDate={selectedDate}
        onClose={() => {
          setIsAddPeriodModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSavePeriod}
      />

      <OreaCycleDailyLogModal
        isOpen={isDailyLogModalOpen}
        selectedDate={selectedDate}
        existingLog={selectedLog}
        onClose={() => setIsDailyLogModalOpen(false)}
        onSave={handleSaveDailyLog}
        onDelete={handleDeleteDailyLog}
      />

      <OreaCycleNotesModal
        isOpen={isNotesModalOpen}
        notes={notes}
        onClose={() => setIsNotesModalOpen(false)}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
      />

      <OreaCycleRemindersModal
        isOpen={isRemindersModalOpen}
        settings={settings}
        onClose={() => setIsRemindersModalOpen(false)}
        onSaveSettings={handleSaveSettings}
      />

      <OreaCyclePrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onExportData={handleExportData}
        onDeleteAllData={handleDeleteAllData}
      />

      <OreaCycleAiModal
        isOpen={isAiModalOpen}
        userFirstName={userFirstName}
        cycleStats={cycleStats}
        onClose={() => setIsAiModalOpen(false)}
      />

      <OreaCycleUnsavedPrompt
        isOpen={isUnsavedPromptOpen}
        onStay={() => setIsUnsavedPromptOpen(false)}
        onConfirmLeave={() => {
          setIsUnsavedPromptOpen(false);
          onBackToHome();
        }}
      />
    </div>
  );
};

export default OreaCycleView;
