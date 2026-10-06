import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Search,
  Filter,
  Bookmark,
  Play,
  Zap,
  FileText,
  Clock,
  TrendingUp,
  Video,
  ShieldCheck,
  Compass,
  Check,
  SlidersHorizontal,
  Sliders,
  Edit3,
} from 'lucide-react';
import { OreaUserProfile } from '../types';
import { hasFeature } from '../services/subscription/featureAccess';
import { LockedFeatureView } from './subscription/LockedFeatureView';
import { BacG2Course, BacG2Domain, BacG2UserProgress } from '../types/bacG2';
import { ALL_BAC_G2_COURSES, BAC_G2_DOMAIN_LABELS, getCoursesByDomain, getCourseById } from '../data/bacG2/allCourses';
import { BacG2CourseDetail } from './bacG2/BacG2CourseDetail';
import { BacG2ExamSimulator } from './bacG2/BacG2ExamSimulator';
import { BacG2ExpressRevision } from './bacG2/BacG2ExpressRevision';
import { BacG2AnnalesView } from './bacG2/BacG2AnnalesView';
import { BacG2VideosView } from './bacG2/BacG2VideosView';
import { BacG2CheatSheetsView } from './bacG2/BacG2CheatSheetsView';
import { BacG2AICoachModal } from './bacG2/BacG2AICoachModal';
import { BacG2AdminModal } from './bacG2/BacG2AdminModal';
import { OreaEducationSkeleton } from './bacG2/OreaEducationSkeleton';
import { ModuleOnboardingWizard } from './onboarding/ModuleOnboardingWizard';
import { EDUCATION_QUESTIONS } from '../data/modulesOnboardingData';
import { OreaModuleAIWidget } from './common/OreaModuleAIWidget';
import {
  isModuleConfigured,
  getModuleProfile,
  saveModuleProfile,
  clearModuleProfile,
} from '../utils/oreaProfileStorage';
import { useAuth } from '../context/AuthContext';
import { fetchFirestoreModule } from '../lib/firebase';

interface OreaEducationViewProps {
  currentUserProfile?: OreaUserProfile | null;
  onGoToPricing?: () => void;
  onBackToHome: () => void;
}

const LOCAL_STORAGE_PROGRESS_KEY = 'orea_bac_g2_progress_v2';

export const OreaEducationView: React.FC<OreaEducationViewProps> = ({
  currentUserProfile,
  onGoToPricing,
  onBackToHome,
}) => {
  const { currentUser, authLoading } = useAuth();
  const [isConfigured, setIsConfigured] = useState<boolean>(() => {
    return isModuleConfigured('education');
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
        const docSnap = await fetchFirestoreModule(currentUser.uid, 'education');
        if (docSnap && docSnap.enabled) {
          const pseudo = docSnap.data?.pseudo || docSnap.data?.name || docSnap.data?.prenom || 'Membre OREA';
          const profile = {
            id: 'profile-education-firestore',
            module: 'education',
            name: pseudo,
            answers: docSnap.data || {},
            createdAt: docSnap.createdAt,
            updatedAt: docSnap.updatedAt,
          };
          localStorage.setItem('orea_profile_education', JSON.stringify(profile));
          localStorage.setItem('orea_configured_education', 'true');
          setIsConfigured(true);
        } else {
          localStorage.removeItem('orea_profile_education');
          localStorage.removeItem('orea_configured_education');
          setIsConfigured(false);
        }
      } catch (err) {
        console.warn("[OreaEducationView] Firestore check error:", err);
        setIsConfigured(isModuleConfigured('education'));
      } finally {
        setDbLoading(false);
      }
    }
    checkConfig();
  }, [currentUser, authLoading]);

  const moduleProfile = useMemo(() => getModuleProfile('education'), [isConfigured]);

  // Check subscription access
  // Always unlocked for free exploration
  const isSubscriber = true;

  // Main navigation tab
  const [activeTab, setActiveTab] = useState<'catalogue' | 'videos' | 'simulateur' | 'fiches' | 'annales' | 'express'>('catalogue');

  // Course Detail View state
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<BacG2Domain | 'all'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDurationFilter, setSelectedDurationFilter] = useState<string>('all'); // '<20', '20-40', '>40'
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [onlyCompleted, setOnlyCompleted] = useState<boolean>(false);

  // Modals state
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [aiCoachCourse, setAiCoachCourse] = useState<BacG2Course | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Custom added videos via admin
  const [customVideos, setCustomVideos] = useState<any[]>([]);

  // Persistent User Progress with robust fallback defaults
  const [progress, setProgress] = useState<BacG2UserProgress>(() => {
    const defaultProgress: BacG2UserProgress = {
      completedCourseIds: [],
      inProgressCourseIds: {},
      favoriteCourseIds: [],
      favoriteVideoIds: [],
      lastVisitedCourseId: undefined,
      simulatorScores: [],
      totalStudyTimeMinutes: 0,
      earnedBadgeIds: [],
    };
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROGRESS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return {
            ...defaultProgress,
            ...parsed,
            completedCourseIds: Array.isArray(parsed.completedCourseIds) ? parsed.completedCourseIds : [],
            favoriteCourseIds: Array.isArray(parsed.favoriteCourseIds) ? parsed.favoriteCourseIds : [],
            favoriteVideoIds: Array.isArray(parsed.favoriteVideoIds) ? parsed.favoriteVideoIds : [],
            simulatorScores: Array.isArray(parsed.simulatorScores) ? parsed.simulatorScores : [],
            earnedBadgeIds: Array.isArray(parsed.earnedBadgeIds) ? parsed.earnedBadgeIds : [],
            inProgressCourseIds: (parsed.inProgressCourseIds && typeof parsed.inProgressCourseIds === 'object') ? parsed.inProgressCourseIds : {},
          };
        }
      }
    } catch {
      // ignore
    }
    return defaultProgress;
  });

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Safe progress accessors (placed before early returns to preserve Hooks order)
  const safeFavoriteCourseIds = Array.isArray(progress.favoriteCourseIds) ? progress.favoriteCourseIds : [];
  const safeCompletedCourseIds = Array.isArray(progress.completedCourseIds) ? progress.completedCourseIds : [];
  const safeSimulatorScores = Array.isArray(progress.simulatorScores) ? progress.simulatorScores : [];

  // Extract unique subcategories for current domain (unconditionally rendered hook)
  const availableSubcategories = useMemo(() => {
    const list = selectedDomain === 'all' ? ALL_BAC_G2_COURSES : getCoursesByDomain(selectedDomain);
    const set = new Set(list.map((c) => c.subcategory));
    return Array.from(set);
  }, [selectedDomain]);

  // Filtered Course Catalog (unconditionally rendered hook)
  const filteredCourses = useMemo(() => {
    return ALL_BAC_G2_COURSES.filter((course) => {
      // Domain filter
      if (selectedDomain !== 'all' && course.domain !== selectedDomain) {
        return false;
      }
      // Subcategory filter
      if (selectedSubcategory !== 'all' && course.subcategory !== selectedSubcategory) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'all' && course.level !== selectedLevel) {
        return false;
      }
      // Duration filter
      if (selectedDurationFilter === '<20' && course.durationMinutes >= 20) return false;
      if (selectedDurationFilter === '20-40' && (course.durationMinutes < 20 || course.durationMinutes > 40)) return false;
      if (selectedDurationFilter === '>40' && course.durationMinutes <= 40) return false;

      // Favorites only
      if (onlyFavorites && !safeFavoriteCourseIds.includes(course.id)) {
        return false;
      }
      // Completed only
      if (onlyCompleted && !safeCompletedCourseIds.includes(course.id)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = course.title.toLowerCase().includes(q);
        const matchesDesc = course.description.toLowerCase().includes(q);
        const matchesSubcat = course.subcategory.toLowerCase().includes(q);
        const matchesId = course.id.toLowerCase().includes(q);
        const matchesKeyword = Array.isArray(course.keywords) && course.keywords.some((k) => k.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesSubcat && !matchesId && !matchesKeyword) {
          return false;
        }
      }

      return true;
    });
  }, [
    selectedDomain,
    selectedSubcategory,
    selectedLevel,
    selectedDurationFilter,
    onlyFavorites,
    onlyCompleted,
    searchQuery,
    safeFavoriteCourseIds,
    safeCompletedCourseIds,
  ]);

  if (authLoading || dbLoading) {
    return <OreaEducationSkeleton />;
  }

  if (!isConfigured) {
    return (
      <ModuleOnboardingWizard
        moduleId="education"
        moduleTitle="OREA Excellence • BAC G2"
        moduleSubtitle="Comptabilité, Fiscalité & Éloquence"
        moduleIcon={<GraduationCap className="w-8 h-8 text-indigo-600" />}
        accentColor="indigo"
        questions={EDUCATION_QUESTIONS}
        onComplete={(answers) => {
          saveModuleProfile('education', answers);
          setIsConfigured(true);
        }}
        onCancel={onBackToHome}
      />
    );
  }

  // Handlers for progression
  const handleToggleComplete = (courseId: string) => {
    setProgress((prev) => {
      const completedList = Array.isArray(prev.completedCourseIds) ? prev.completedCourseIds : [];
      const exists = completedList.includes(courseId);
      const newCompleted = exists
        ? completedList.filter((id) => id !== courseId)
        : [...completedList, courseId];
      return {
        ...prev,
        completedCourseIds: newCompleted,
      };
    });
  };

  const handleToggleFavorite = (courseId: string) => {
    setProgress((prev) => {
      const favList = Array.isArray(prev.favoriteCourseIds) ? prev.favoriteCourseIds : [];
      const exists = favList.includes(courseId);
      const newFavs = exists
        ? favList.filter((id) => id !== courseId)
        : [...favList, courseId];
      return {
        ...prev,
        favoriteCourseIds: newFavs,
      };
    });
  };

  const handleOpenCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setProgress((prev) => ({
      ...prev,
      lastVisitedCourseId: courseId,
      totalStudyTimeMinutes: (prev.totalStudyTimeMinutes || 0) + 10,
    }));
  };

  const handleSaveExamScore = (record: {
    domain: string;
    score: number;
    totalQuestions: number;
    correctQuestions: number;
  }) => {
    setProgress((prev) => ({
      ...prev,
      simulatorScores: [
        ...(Array.isArray(prev.simulatorScores) ? prev.simulatorScores : []),
        {
          id: `score-${Date.now()}`,
          date: new Date().toLocaleDateString('fr-FR'),
          domain: record.domain,
          score: record.score,
          totalQuestions: record.totalQuestions,
          correctQuestions: record.correctQuestions,
        },
      ],
    }));
  };

  // Safe totals and statistics for rendering

  // Statistics calculation
  const totalCourses = ALL_BAC_G2_COURSES.length;
  const completedCount = safeCompletedCourseIds.length;
  const completionPercentage = Math.round((completedCount / (totalCourses || 1)) * 100);

  const selectedCourse = selectedCourseId ? getCourseById(selectedCourseId) : null;
  const domainCoursesForNav = selectedCourse ? getCoursesByDomain(selectedCourse.domain) : [];

  // If feature is locked for non-subscribed users (if applicable)
  if (!isSubscriber && currentUserProfile?.role !== 'admin') {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </button>
        <LockedFeatureView
          feature="bac_g2_module"
          onGoToPricing={onGoToPricing || (() => {})}
          onBackToHome={onBackToHome}
        />
      </div>
    );
  }

  // Active Detail Course View
  if (selectedCourse) {
    return (
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6">
        <BacG2CourseDetail
          course={selectedCourse}
          isCompleted={safeCompletedCourseIds.includes(selectedCourse.id)}
          isFavorite={safeFavoriteCourseIds.includes(selectedCourse.id)}
          onToggleComplete={handleToggleComplete}
          onToggleFavorite={handleToggleFavorite}
          onNavigateCourse={(id) => handleOpenCourse(id)}
          onBackToList={() => setSelectedCourseId(null)}
          onOpenAICoach={(c) => {
            setAiCoachCourse(c);
            setIsAICoachOpen(true);
          }}
          allCoursesInDomain={domainCoursesForNav}
        />

        <BacG2AICoachModal
          course={aiCoachCourse}
          isOpen={isAICoachOpen}
          onClose={() => {
            setIsAICoachOpen(false);
            setAiCoachCourse(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-8 animate-fadeIn pb-24">
      {/* Top Bar / Brand Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au tableau de bord OREA</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsConfigured(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Modifier mes préférences BAC G2"
          >
            <Edit3 className="w-4 h-4 text-indigo-600" />
            <span>Modifier mon profil</span>
          </button>

          {/* Quick AI Coach trigger */}
          <button
            type="button"
            onClick={() => {
              setAiCoachCourse(null);
              setIsAICoachOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
            <span>Tuteur IA BAC G2</span>
          </button>

          {/* Teacher / Admin Tools */}
          <button
            type="button"
            onClick={() => setIsAdminOpen(true)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
            title="Espace Pédagogique & Modération"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Presentation & Progression Hub */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0f2347] to-[#1e3a8a] text-white rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Programme Officiel & SYSCOHADA Révisé</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                BAC G2 — Plateforme d'Excellence OREA
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Apprenez, révisez et préparez votre BAC G2 avec 150 cours complets, exercices corrigés pas à pas, vidéos certifiées et simulateur d'épreuves.
              </p>
            </div>

            {/* Resume Last Course Button if any */}
            {progress.lastVisitedCourseId && (
              <button
                type="button"
                onClick={() => handleOpenCourse(progress.lastVisitedCourseId!)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Reprendre le dernier cours</span>
              </button>
            )}
          </div>

          {/* Real Progress Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
              <span className="text-[11px] font-medium text-blue-200 block">Progression Globale</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black">{completionPercentage}%</span>
                <span className="text-[11px] text-blue-200 font-normal">
                  ({completedCount}/{totalCourses})
                </span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
              <span className="text-[11px] font-medium text-blue-200 block">Cours au Catalogue</span>
              <span className="text-xl sm:text-2xl font-black">{totalCourses}</span>
              <span className="text-[11px] text-blue-200 block font-normal">4 grandes matières</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
              <span className="text-[11px] font-medium text-blue-200 block">Favoris Enregistrés</span>
              <span className="text-xl sm:text-2xl font-black">{safeFavoriteCourseIds.length}</span>
              <span className="text-[11px] text-blue-200 block font-normal">Fiches mémorisées</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1">
              <span className="text-[11px] font-medium text-blue-200 block">Simulations Réalisées</span>
              <span className="text-xl sm:text-2xl font-black">{safeSimulatorScores.length}</span>
              <span className="text-[11px] text-blue-200 block font-normal">Évaluations / 20</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        {[
          { id: 'catalogue', label: '📚 Tous les Cours (150)', icon: BookOpen },
          { id: 'videos', label: '🎥 Vidéos YouTube', icon: Video },
          { id: 'simulateur', label: '⏱️ Simulateur d\'Examen', icon: Award },
          { id: 'express', label: '⚡ Révision Express', icon: Zap },
          { id: 'fiches', label: '📌 Fiches & Formulaires', icon: FileText },
          { id: 'annales', label: '📄 Sujets d\'Annales', icon: GraduationCap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. CATALOGUE VIEW */}
      {activeTab === 'catalogue' && (
        <div className="space-y-6">
          {/* Domain Quick Filter Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedDomain('all');
                setSelectedSubcategory('all');
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedDomain === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider block opacity-75">
                Toutes Matières
              </span>
              <span className="text-xl font-black mt-2">150 Cours</span>
            </button>

            {(['comptabilite', 'fiscalite', 'droit', 'syscohada'] as BacG2Domain[]).map((dom) => {
              const info = BAC_G2_DOMAIN_LABELS[dom];
              const count = getCoursesByDomain(dom).length;
              const isSelected = selectedDomain === dom;
              return (
                <button
                  key={dom}
                  type="button"
                  onClick={() => {
                    setSelectedDomain(dom);
                    setSelectedSubcategory('all');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'shadow-xs'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: info.bg,
                          borderColor: info.border,
                          color: info.color,
                        }
                      : {}
                  }
                >
                  <span className="text-xs font-bold uppercase tracking-wider block opacity-80">
                    {info.label}
                  </span>
                  <span className="text-xl font-black mt-2">{count} Cours</span>
                </button>
              );
            })}
          </div>

          {/* Search & Multi-Filters Toolbar */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par titre, notion, numéro de compte, mot-clé..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Effacer
                  </button>
                )}
              </div>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">Tous les niveaux</option>
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
                <option value="Révision BAC">Spécial Révision BAC</option>
              </select>

              {/* Duration Filter */}
              <select
                value={selectedDurationFilter}
                onChange={(e) => setSelectedDurationFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">Toutes durées</option>
                <option value="<20">&lt; 20 minutes</option>
                <option value="20-40">20 à 40 minutes</option>
                <option value=">40">&gt; 40 minutes</option>
              </select>
            </div>

            {/* Subcategory Pills & Status Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              {/* Subcategories */}
              <div className="flex gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedSubcategory === 'all'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tous thèmes
                </button>
                {availableSubcategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedSubcategory === sub
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Status checkboxes */}
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyFavorites}
                    onChange={(e) => setOnlyFavorites(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Favoris uniquement</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyCompleted}
                    onChange={(e) => setOnlyCompleted(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Terminés uniquement</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>
              Affichage de {filteredCourses.length} cours sur {totalCourses}
            </span>
            {(selectedDomain !== 'all' ||
              selectedSubcategory !== 'all' ||
              selectedLevel !== 'all' ||
              searchQuery ||
              onlyFavorites ||
              onlyCompleted) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDomain('all');
                  setSelectedSubcategory('all');
                  setSelectedLevel('all');
                  setSelectedDurationFilter('all');
                  setSearchQuery('');
                  setOnlyFavorites(false);
                  setOnlyCompleted(false);
                }}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Réinitialiser tous les filtres
              </button>
            )}
          </div>

          {/* Courses Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map((course) => {
                const domainInfo = BAC_G2_DOMAIN_LABELS[course.domain] || {
                  label: course.domain,
                  bg: '#f1f5f9',
                  color: '#475569',
                  border: '#cbd5e1',
                };
                const isComp = safeCompletedCourseIds.includes(course.id);
                const isFav = safeFavoriteCourseIds.includes(course.id);

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-5 space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border"
                          style={{
                            backgroundColor: domainInfo.bg,
                            color: domainInfo.color,
                            borderColor: domainInfo.border,
                          }}
                        >
                          {domainInfo.label} • {course.subcategory}
                        </span>

                        <div className="flex items-center gap-1">
                          {isComp && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Validé
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(course.id);
                            }}
                            className={`p-1 rounded-md transition-colors cursor-pointer ${
                              isFav ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3
                        onClick={() => handleOpenCourse(course.id)}
                        className="text-base font-bold text-[#0f2347] group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
                      >
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Footer Info & Action */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                          {course.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.durationMinutes} min
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenCourse(course.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors cursor-pointer"
                      >
                        <span>Étudier</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">Aucun cours trouvé</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Aucun résultat ne correspond à vos critères de recherche. Essayez d'élargir vos filtres.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. VIDEOS VIEW */}
      {activeTab === 'videos' && (
        <BacG2VideosView onSelectCourse={(id) => handleOpenCourse(id)} />
      )}

      {/* 3. SIMULATEUR D'EXAMEN */}
      {activeTab === 'simulateur' && (
        <BacG2ExamSimulator onSaveScore={handleSaveExamScore} />
      )}

      {/* 4. EXPRESS REVISION */}
      {activeTab === 'express' && (
        <BacG2ExpressRevision
          allCourses={ALL_BAC_G2_COURSES}
          onSelectCourse={(id) => handleOpenCourse(id)}
        />
      )}

      {/* 5. FICHES & FORMULAIRES */}
      {activeTab === 'fiches' && <BacG2CheatSheetsView />}

      {/* 6. ANNALES & SUJETS OFFICIELS */}
      {activeTab === 'annales' && <BacG2AnnalesView />}

      {/* Modals */}
      <BacG2AICoachModal
        course={aiCoachCourse}
        isOpen={isAICoachOpen}
        onClose={() => {
          setIsAICoachOpen(false);
          setAiCoachCourse(null);
        }}
      />

      <BacG2AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onAddVideo={(v) => {
          setCustomVideos((prev) => [v, ...prev]);
        }}
      />

      <OreaModuleAIWidget moduleId="education" moduleTitle="BAC G2 & Éloquence" currentUserProfile={currentUserProfile} />
    </div>
  );
};
