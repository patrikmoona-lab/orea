import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Zap,
  Flame,
  Play,
  Pause,
  Clock,
  Dumbbell,
  Target,
  Sliders,
  Search,
  Filter,
  Heart,
  Calendar,
  Award,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Plus,
  Edit3,
  Box,
  Video,
  Layers,
  Info
} from 'lucide-react';
import {
  EnergieCategory,
  EnergieDifficulty,
  EnergieExercise,
  UserFitnessProfile,
  ENERGIE_CATEGORIES_LIST,
  ENERGIE_DIFFICULTIES_LIST
} from '../types/energie';
import { OREA_ENERGIE_EXERCISES, OREA_ENERGIE_PROGRAMS } from '../data/energieExercises';
import { OreaEnergieQuestionnaireModal } from './energie/OreaEnergieQuestionnaireModal';
import { OreaExerciseDetailModal } from './energie/OreaExerciseDetailModal';
import { OreaWorkoutSessionModal } from './energie/OreaWorkoutSessionModal';
import { OreaWorkoutCreatorModal } from './energie/OreaWorkoutCreatorModal';
import { OreaWorkoutHistoryView } from './energie/OreaWorkoutHistoryView';
import {
  getFitnessProfile,
  saveFitnessProfile,
  getFavoriteExercises,
  toggleFavoriteExercise
} from '../services/energieService';
import { useAuth } from '../context/AuthContext';
import { OreaModuleAIWidget } from './common/OreaModuleAIWidget';

interface OreaWorkoutViewProps {
  onBackToHome: () => void;
  currentUserProfile?: any;
}

export const OreaWorkoutView: React.FC<OreaWorkoutViewProps> = ({ onBackToHome }) => {
  const { currentUser, authLoading } = useAuth();

  // Profile and Onboarding status
  const [fitnessProfile, setFitnessProfile] = useState<UserFitnessProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState<boolean>(false);

  // Active navigation tab inside ÉNERGIE
  const [currentTab, setCurrentTab] = useState<'exercices' | 'programmes' | 'favoris' | 'historique'>('exercices');

  // Exercise Detail Modal state
  const [selectedExercise, setSelectedExercise] = useState<EnergieExercise | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // Guided Workout Session Modal state
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [activeSessionTitle, setActiveSessionTitle] = useState<string>('');
  const [activeSessionExercises, setActiveSessionExercises] = useState<EnergieExercise[]>([]);
  const [activeSessionLevel, setActiveSessionLevel] = useState<EnergieDifficulty>('débutant');

  // Custom Workout Creator Modal state
  const [isCreatorOpen, setIsCreatorOpen] = useState<boolean>(false);

  // Favorites state
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Search & Filters for Exercise Library
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterEquipment, setFilterEquipment] = useState<string>('all');

  // Load Fitness Profile & Favorites on mount
  useEffect(() => {
    async function loadData() {
      if (authLoading) return;
      try {
        const [profile, favs] = await Promise.all([
          getFitnessProfile(currentUser?.uid),
          getFavoriteExercises(currentUser?.uid),
        ]);

        if (profile && profile.onboardingCompleted) {
          setFitnessProfile(profile);
        } else {
          // Rule #3: First access opens the questionnaire modal
          setIsQuestionnaireOpen(true);
        }

        setFavoriteIds(favs);
      } catch (err) {
        console.warn('[OreaWorkoutView] Error loading data:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    loadData();
  }, [currentUser, authLoading]);

  // Toggle favorite handler
  const handleToggleFavorite = async (exerciseId: string) => {
    try {
      const updated = await toggleFavoriteExercise(currentUser?.uid, exerciseId);
      setFavoriteIds(updated);
    } catch (e) {
      console.warn(e);
    }
  };

  // Launch a session directly
  const handleLaunchSession = (title: string, exercises: EnergieExercise[], level: EnergieDifficulty) => {
    setActiveSessionTitle(title);
    setActiveSessionExercises(exercises);
    setActiveSessionLevel(level);
    setIsSessionActive(true);
  };

  // Start single exercise as a quick session
  const handleStartSingleExercise = (exercise: EnergieExercise) => {
    handleLaunchSession(`Session : ${exercise.name}`, [exercise], exercise.difficulty);
  };

  // Recommended exercises based strictly on user preferences per Rule #15
  const recommendedExercises = useMemo(() => {
    if (!fitnessProfile) return OREA_ENERGIE_EXERCISES.slice(0, 4);

    const targetCategories = fitnessProfile.bodyParts || ['corps-complet'];
    const userLevel = fitnessProfile.level;

    return OREA_ENERGIE_EXERCISES.filter((ex) => {
      if (!ex.isActive) return false;
      const matchesCategory =
        targetCategories.includes('corps-complet') ||
        targetCategories.includes(ex.category) ||
        (ex.secondaryCategories && ex.secondaryCategories.some((sc) => targetCategories.includes(sc)));
      return matchesCategory;
    }).slice(0, 4);
  }, [fitnessProfile]);

  // Today's workout session based on profile
  const todaysSession = useMemo(() => {
    const title = `Séance du jour : ${fitnessProfile?.bodyParts?.join(', ') || 'Corps complet'}`;
    const level = fitnessProfile?.level || 'débutant';
    const exercises = recommendedExercises.length > 0 ? recommendedExercises : OREA_ENERGIE_EXERCISES.slice(0, 3);
    const duration = fitnessProfile?.duration || '20 min';

    return {
      title,
      level,
      duration,
      exercises,
      targetZones: fitnessProfile?.bodyParts || ['corps-complet'],
    };
  }, [fitnessProfile, recommendedExercises]);

  // Filtered Exercises for the Library
  const filteredExercises = useMemo(() => {
    const normalize = (str: string) =>
      str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const query = normalize(searchQuery.trim());

    return OREA_ENERGIE_EXERCISES.filter((ex) => {
      if (!ex.isActive) return false;

      // Filter by Category
      if (filterCategory !== 'all' && ex.category !== filterCategory) {
        if (!ex.secondaryCategories || !ex.secondaryCategories.includes(filterCategory as EnergieCategory)) {
          return false;
        }
      }

      // Filter by Difficulty
      if (filterDifficulty !== 'all' && ex.difficulty !== filterDifficulty) {
        return false;
      }

      // Filter by Equipment
      if (filterEquipment !== 'all' && !ex.equipment.includes(filterEquipment)) {
        return false;
      }

      // Search Query
      if (query.length > 0) {
        const matchName = normalize(ex.name).includes(query);
        const matchDesc = normalize(ex.description).includes(query);
        const matchCategory = normalize(ex.category).includes(query);
        const matchDifficulty = normalize(ex.difficulty).includes(query);
        const matchTags = ex.tags.some((t) => normalize(t).includes(query));

        if (!matchName && !matchDesc && !matchCategory && !matchDifficulty && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, filterCategory, filterDifficulty, filterEquipment]);

  // Favorite Exercises list
  const favoriteExercisesList = useMemo(() => {
    return OREA_ENERGIE_EXERCISES.filter((ex) => favoriteIds.includes(ex.id));
  }, [favoriteIds]);

  // Display user name
  const userName = fitnessProfile?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Membre OREA';

  // Loading Screen
  if (authLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-[#f8fbfe] dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4 animate-pulse">
          <Zap className="w-7 h-7 fill-orange-500 animate-bounce" />
        </div>
        <p className="text-base font-extrabold text-[#0f2347] dark:text-white">
          Chargement de votre univers ÉNERGIE...
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Synchronisation de votre profil sportif et de vos séances
        </p>
      </div>
    );
  }

  // FIRST ACCESS MANDATE: If no fitness profile, show Questionnaire Modal directly
  if (!fitnessProfile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <OreaEnergieQuestionnaireModal
          isOpen={true}
          onClose={onBackToHome}
          onComplete={(profile) => {
            setFitnessProfile(profile);
            setIsQuestionnaireOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbfe] dark:bg-slate-950 pb-20 transition-colors">
      {/* Questionnaire Modal (Re-opened via "Modifier mes préférences") */}
      <OreaEnergieQuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        initialProfile={fitnessProfile || undefined}
        onComplete={(newProfile) => {
          setFitnessProfile(newProfile);
          setIsQuestionnaireOpen(false);
        }}
      />

      {/* Detailed Exercise Modal */}
      <OreaExerciseDetailModal
        exercise={selectedExercise}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedExercise(null);
        }}
        onStartExercise={handleStartSingleExercise}
        onAddToCustomSession={(ex) => {
          handleLaunchSession(`Séance personnalisée`, [ex], ex.difficulty);
        }}
        isFavorite={selectedExercise ? favoriteIds.includes(selectedExercise.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Workout Session Execution Modal */}
      <OreaWorkoutSessionModal
        isOpen={isSessionActive}
        onClose={() => setIsSessionActive(false)}
        sessionTitle={activeSessionTitle}
        exercises={activeSessionExercises}
        level={activeSessionLevel}
      />

      {/* Custom Workout Creator Modal */}
      <OreaWorkoutCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onLaunchSession={handleLaunchSession}
        initialLevel={fitnessProfile?.level || 'débutant'}
      />

      {/* Top Main Navigation Bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-[#e2eaf4] dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Retour à l'accueil"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h1 className="text-lg font-black text-[#0f2347] dark:text-white flex items-center gap-2">
                  <span>ÉNERGIE</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 font-bold border border-orange-200 dark:border-orange-800 capitalize">
                    Niveau {fitnessProfile.level}
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  Bougez à votre rythme, progressez à votre manière.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreatorOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Créer ma séance</span>
              <span className="sm:hidden">Créer</span>
            </button>

            <button
              type="button"
              onClick={() => setIsQuestionnaireOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Modifier mes préférences ÉNERGIE"
            >
              <Edit3 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span className="hidden md:inline">Modifier mes préférences</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Bonjour & Hero Banner (Rule #14) */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white shadow-xl shadow-orange-600/15 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
            <Zap className="w-64 h-64 fill-white" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-white/20 uppercase tracking-wide">
                  ÉNERGIE
                </span>
                <span className="text-xs text-orange-100">
                  Cadence : {fitnessProfile.frequency}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Bonjour {userName} 👋
              </h2>

              <p className="text-xs sm:text-sm text-orange-50/95 leading-relaxed max-w-2xl font-medium">
                Bougez à votre rythme, progressez à votre manière. Vos entraînements sont calibrés pour vos zones ciblées : <strong className="text-white">{fitnessProfile.bodyParts.join(', ')}</strong>.
              </p>

              {fitnessProfile.limitations && (
                <div className="mt-2 text-xs bg-black/20 backdrop-blur-xs border border-white/20 p-2.5 rounded-xl text-orange-100 inline-flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>
                    Prise en compte : <strong className="text-white">« {fitnessProfile.limitations} »</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Quick Session of the Day Launcher (Rule #14) */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-200 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                  Votre séance du jour
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white">
                  {todaysSession.duration}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-white">{todaysSession.title}</h3>
                <p className="text-[11px] text-orange-100 mt-0.5">
                  {todaysSession.exercises.length} exercices ciblés • Niveau {todaysSession.level}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchSession(todaysSession.title, todaysSession.exercises, todaysSession.level)}
                className="w-full py-3 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-orange-700" />
                <span>Commencer la séance</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'exercices', label: 'Bibliothèque d\'exercices', icon: Dumbbell },
            { id: 'programmes', label: 'Programmes guidés', icon: Award },
            { id: 'favoris', label: `Mes favoris (${favoriteIds.length})`, icon: Heart },
            { id: 'historique', label: 'Historique & Progression', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: BIBLIOTHÈQUE D'EXERCICES */}
        {currentTab === 'exercices' && (
          <div className="space-y-6">
            {/* Section « Recommandé pour vous » (Rule #15) */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#0f2347] dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span>Recommandé pour vous</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Exercices personnalisés selon vos critères : {fitnessProfile.bodyParts.join(', ')} • Niveau {fitnessProfile.level}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendedExercises.map((ex) => (
                  <div
                    key={ex.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-[#e2eaf4] dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-orange-300 dark:hover:border-slate-700 transition-all group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 uppercase">
                          {ex.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(ex.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          title="Ajouter aux favoris"
                        >
                          <Heart className={`w-4 h-4 ${favoriteIds.includes(ex.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      </div>

                      <h4 className="font-extrabold text-sm text-[#0f2347] dark:text-white group-hover:text-orange-600 transition-colors line-clamp-1">
                        {ex.name}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {ex.description}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="capitalize">{ex.difficulty}</span>
                        <span>•</span>
                        <span>{ex.repetitions || `${ex.duration}s`}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedExercise(ex);
                          setIsDetailOpen(true);
                        }}
                        className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 hover:text-orange-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        Voir l'exercice
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartSingleExercise(ex)}
                        className="p-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-colors cursor-pointer"
                        title="Lancer cet exercice"
                      >
                        <Play className="w-4 h-4 fill-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Complete Library with Real Filters & Search (Rule #18 & #19) */}
            <section className="space-y-4 pt-2">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#0f2347] dark:text-white">
                    Toute la bibliothèque ({filteredExercises.length} exercices)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Exercices réels classés par anatomie, niveau et équipement
                  </p>
                </div>

                {/* Search Bar (Rule #19) */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un exercice..."
                    className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-[#0f2347] dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Effacer
                    </button>
                  )}
                </div>
              </div>

              {/* Exact Category Filters Bar (10 categories per Rule #7) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    filterCategory === 'all'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Toutes les zones
                </button>
                {ENERGIE_CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFilterCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      filterCategory === cat.id
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Exact Difficulty Filters Bar (7 levels per Rule #6) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  type="button"
                  onClick={() => setFilterDifficulty('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    filterDifficulty === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Tous les niveaux
                </button>
                {ENERGIE_DIFFICULTIES_LIST.map((diff) => (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setFilterDifficulty(diff.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 capitalize ${
                      filterDifficulty === diff.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-600'
                    }`}
                  >
                    <span>{diff.icon}</span>
                    <span>{diff.label}</span>
                  </button>
                ))}
              </div>

              {/* Grid of Exercises */}
              {filteredExercises.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <p className="font-extrabold text-sm text-[#0f2347] dark:text-white">
                    Aucun exercice ne correspond à votre filtre.
                  </p>
                  <p className="text-xs text-slate-500">
                    Modifiez vos critères de recherche ou réinitialisez les filtres.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterCategory('all');
                      setFilterDifficulty('all');
                      setFilterEquipment('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredExercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-[#e2eaf4] dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-orange-300 dark:hover:border-slate-700 transition-all group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 uppercase">
                            {ex.category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {ex.model3D && (
                              <span className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-orange-500" title="Démonstration 3D disponible">
                                <Box className="w-3.5 h-3.5" />
                              </span>
                            )}
                            {ex.videoUrl && (
                              <span className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-500" title="Démonstration vidéo disponible">
                                <Video className="w-3.5 h-3.5" />
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleToggleFavorite(ex.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors p-1"
                              title="Ajouter aux favoris"
                            >
                              <Heart className={`w-4 h-4 ${favoriteIds.includes(ex.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-extrabold text-sm text-[#0f2347] dark:text-white group-hover:text-orange-600 transition-colors">
                          {ex.name}
                        </h4>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {ex.description}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span className="font-semibold text-slate-600 dark:text-slate-300 capitalize">
                            Niveau {ex.difficulty}
                          </span>
                          <span>{ex.repetitions || `${ex.duration}s`}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedExercise(ex);
                            setIsDetailOpen(true);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 hover:text-orange-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold transition-colors cursor-pointer text-center"
                        >
                          Voir l'exercice
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartSingleExercise(ex)}
                          className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-colors cursor-pointer"
                          title="Lancer cet exercice"
                        >
                          <Play className="w-4 h-4 fill-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: PROGRAMMES (Rule #36 & #37) */}
        {currentTab === 'programmes' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#0f2347] dark:text-white">
                Programmes structurés OREA ÉNERGIE
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cycles d’entraînement progressifs et persistants
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {OREA_ENERGIE_PROGRAMS.map((prog) => (
                <div
                  key={prog.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between hover:border-orange-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 uppercase">
                        {prog.durationDays} Jours
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {prog.frequencyPerWeek} séances / sem.
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-[#0f2347] dark:text-white">
                      {prog.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Exercices inclus :
                      </span>
                      {prog.exercises.map((ex, idx) => (
                        <div key={ex.id} className="text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/60">
                          <span>{idx + 1}. {ex.name}</span>
                          <span className="text-slate-400 text-[11px]">{ex.repetitions || `${ex.duration}s`}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => handleLaunchSession(prog.title, prog.exercises, prog.level)}
                      className="w-full py-3 rounded-2xl bg-[#0f2347] hover:bg-orange-600 dark:bg-slate-800 dark:hover:bg-orange-600 text-white font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Commencer le programme</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MES FAVORIS (Rule #35) */}
        {currentTab === 'favoris' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#0f2347] dark:text-white">
                Mes exercices favoris ({favoriteExercisesList.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vos mouvements enregistrés pour un accès rapide
              </p>
            </div>

            {favoriteExercisesList.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <Heart className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-extrabold text-sm text-[#0f2347] dark:text-white">
                  Aucun favori enregistré.
                </p>
                <p className="text-xs text-slate-500">
                  Cliquez sur l'icône cœur sur une carte d'exercice pour l'ajouter à vos favoris.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteExercisesList.map((ex) => (
                  <div
                    key={ex.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 uppercase">
                          {ex.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(ex.id)}
                          className="text-red-500 p-1"
                          title="Retirer des favoris"
                        >
                          <Heart className="w-4 h-4 fill-red-500" />
                        </button>
                      </div>

                      <h4 className="font-extrabold text-sm text-[#0f2347] dark:text-white">{ex.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{ex.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedExercise(ex);
                          setIsDetailOpen(true);
                        }}
                        className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-orange-50 hover:text-orange-700"
                      >
                        Voir
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStartSingleExercise(ex)}
                        className="p-2 rounded-xl bg-orange-600 text-white hover:bg-orange-500"
                      >
                        <Play className="w-4 h-4 fill-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: HISTORIQUE & PROGRESSION (Rule #33 & #34) */}
        {currentTab === 'historique' && (
          <OreaWorkoutHistoryView
            onStartNewSession={() => setCurrentTab('exercices')}
          />
        )}
      </div>

      {/* AI Assistant Widget for ÉNERGIE (Rule #38) */}
      <OreaModuleAIWidget moduleId="sport" moduleTitle="OREA ÉNERGIE" />
    </div>
  );
};
