import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronRight,
  RotateCcw,
  Trophy,
  Heart,
  Clock,
  CheckCircle2,
  Sparkles,
  Box,
  Video,
  Volume2,
  VolumeX,
  Flame,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { EnergieExercise, EnergieDifficulty, UserFitnessProfile } from '../../types/energie';
import { Orea3DExerciseViewer } from './Orea3DExerciseViewer';
import { OreaVideoPlayer } from './OreaVideoPlayer';
import { logWorkoutSession } from '../../services/energieService';
import { calculateRestTime, formatRestMinutesSeconds } from '../../services/energieRestService';
import { useAuth } from '../../context/AuthContext';

interface OreaWorkoutSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionTitle: string;
  exercises: EnergieExercise[];
  level: EnergieDifficulty;
  userFitnessProfile?: UserFitnessProfile | null;
  onSessionFinished?: () => void;
}

export const OreaWorkoutSessionModal: React.FC<OreaWorkoutSessionModalProps> = ({
  isOpen,
  onClose,
  sessionTitle,
  exercises,
  level,
  userFitnessProfile,
  onSessionFinished,
}) => {
  const { currentUser } = useAuth();

  // Active workout execution pointers
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);

  // States: 'active' | 'rest' | 'transitioning' | 'completed'
  const [sessionPhase, setSessionPhase] = useState<'active' | 'rest' | 'transitioning' | 'completed'>('active');
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Audio / Speech Guidance
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Timers
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [initialRestSeconds, setInitialRestSeconds] = useState(60);
  const [timedExerciseCountdown, setTimedExerciseCountdown] = useState<number | null>(null);
  const [isTimedExerciseRunning, setIsTimedExerciseRunning] = useState(false);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0); // in seconds
  const [completedSetsCount, setCompletedSetsCount] = useState(0);

  // Media view mode: '3d' | 'video' | 'instructions'
  const [activeMediaTab, setActiveMediaTab] = useState<'3d' | 'video' | 'instructions'>('3d');

  // Persistence status
  const [isSavingLog, setIsSavingLog] = useState(false);

  const currentExercise = exercises[currentIndex];
  const nextExercise = exercises[currentIndex + 1];

  // Check if current exercise is timed (e.g. Planche, Superman 30s)
  const isTimedExercise = useMemo(() => {
    if (!currentExercise) return false;
    const repStr = (currentExercise.repetitions || '').toLowerCase();
    return (
      repStr.includes('seconde') ||
      repStr.includes('sec') ||
      (currentExercise.duration > 0 && !repStr.includes('répétition') && !repStr.includes('rep'))
    );
  }, [currentExercise]);

  const exerciseDurationTarget = currentExercise?.duration || 30;

  // Speak helper using Web Speech Synthesis API
  const speakCue = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis unsupported or blocked
    }
  };

  // Reset or initialize session state when modal opens or exercises change
  useEffect(() => {
    if (isOpen && exercises.length > 0) {
      setCurrentIndex(0);
      setCurrentSet(1);
      setSessionPhase('active');
      setIsPaused(false);
      setShowExitConfirm(false);
      setTotalElapsedTime(0);
      setCompletedSetsCount(0);

      const firstEx = exercises[0];
      if (firstEx.model3D) {
        setActiveMediaTab('3d');
      } else if (firstEx.videoUrl) {
        setActiveMediaTab('video');
      } else {
        setActiveMediaTab('instructions');
      }

      if (firstEx.duration && (firstEx.repetitions || '').includes('sec')) {
        setTimedExerciseCountdown(firstEx.duration);
        setIsTimedExerciseRunning(true);
      } else {
        setTimedExerciseCountdown(null);
        setIsTimedExerciseRunning(false);
      }

      speakCue('Préparez-vous. Début de votre séance.');
    }
  }, [isOpen, exercises]);

  // Handle media tab fallback when exercise changes
  useEffect(() => {
    if (currentExercise) {
      if (currentExercise.model3D) {
        setActiveMediaTab('3d');
      } else if (currentExercise.videoUrl) {
        setActiveMediaTab('video');
      } else {
        setActiveMediaTab('instructions');
      }

      if (isTimedExercise) {
        setTimedExerciseCountdown(exerciseDurationTarget);
        setIsTimedExerciseRunning(true);
      } else {
        setTimedExerciseCountdown(null);
        setIsTimedExerciseRunning(false);
      }
    }
  }, [currentIndex, currentExercise, isTimedExercise, exerciseDurationTarget]);

  // Overall session elapsed time tracker (stops when paused or completed)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isOpen && sessionPhase !== 'completed' && !isPaused) {
      interval = setInterval(() => {
        setTotalElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, sessionPhase, isPaused]);

  // Global Keyboard Shortcuts (Escape to quit / return, Enter to confirm/finish, Space to pause/resume)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is focused on an input/textarea, do not intercept
      if (
        document.activeElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)
      ) {
        return;
      }

      if (sessionPhase === 'completed') {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ' || e.key.toLowerCase() === 'q') {
          e.preventDefault();
          onClose();
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        if (showExitConfirm) {
          setShowExitConfirm(false);
        } else {
          setShowExitConfirm(true);
        }
      } else if (e.key === ' ' && !showExitConfirm) {
        e.preventDefault();
        if (sessionPhase === 'active') {
          setIsPaused((prev) => !prev);
        } else if (sessionPhase === 'rest') {
          handleRestCompleted();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, sessionPhase, showExitConfirm, onClose]);

  // Timed Exercise Active Countdown (e.g. Planche 30s)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (
      isOpen &&
      sessionPhase === 'active' &&
      !isPaused &&
      isTimedExercise &&
      isTimedExerciseRunning &&
      timedExerciseCountdown !== null &&
      timedExerciseCountdown > 0
    ) {
      interval = setInterval(() => {
        setTimedExerciseCountdown((prev) => (prev !== null ? prev - 1 : 0));
      }, 1000);
    } else if (
      timedExerciseCountdown === 0 &&
      sessionPhase === 'active' &&
      isTimedExercise &&
      isTimedExerciseRunning
    ) {
      // Timed set completed -> launch rest
      handleCompleteSet();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, sessionPhase, isPaused, isTimedExercise, isTimedExerciseRunning, timedExerciseCountdown]);

  // Rest Timer Countdown (01:00 -> 00:59 -> ... -> 00:00)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isOpen && sessionPhase === 'rest' && !isPaused && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && sessionPhase === 'rest' && isOpen) {
      // Rest timer hit 00:00 -> trigger transition to next set or exercise
      handleRestCompleted();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, sessionPhase, isPaused, timerSeconds]);

  // Helper to start Rest Phase using intelligent calculation
  const startRestPhase = (isLastSetOfCurrentExercise: boolean) => {
    const isStandardPref = userFitnessProfile?.restMode === 'standard' || !userFitnessProfile?.restMode;

    const restResult = calculateRestTime({
      exerciseDifficulty: currentExercise?.difficulty || level,
      exerciseType: currentExercise?.model3D?.type || currentExercise?.name || '',
      category: currentExercise?.category,
      sets: currentExercise?.sets || 3,
      currentSet: currentSet,
      duration: currentExercise?.duration,
      userLevel: userFitnessProfile?.level || level,
      userRestPreference: isStandardPref ? 'standard' : userFitnessProfile.restMode,
      isLastSetOfExercise: isLastSetOfCurrentExercise,
      nextExercise: nextExercise,
    });

    const restDuration = restResult.effectiveRest;
    setInitialRestSeconds(restDuration);
    setTimerSeconds(restDuration);
    setSessionPhase('rest');

    speakCue(
      restDuration >= 60
        ? "Série terminée. Repos d'une minute."
        : `Série terminée. Récupération de ${restDuration} secondes.`
    );
  };

  // Called when user finishes a set (reps or timed)
  const handleCompleteSet = () => {
    setCompletedSetsCount((prev) => prev + 1);

    if (currentExercise && currentSet < currentExercise.sets) {
      // More sets remaining in current exercise
      startRestPhase(false);
    } else {
      // Last set of current exercise completed!
      if (currentIndex < exercises.length - 1) {
        startRestPhase(true);
      } else {
        // Workout finished completely!
        finishSession();
      }
    }
  };

  // Rest completed or skipped -> advance to next set / exercise with a brief 2s transition
  const handleRestCompleted = () => {
    setSessionPhase('transitioning');
    const isExerciseFinished = currentExercise && currentSet >= currentExercise.sets;

    if (isExerciseFinished) {
      const nextIdx = currentIndex + 1;
      const nextEx = exercises[nextIdx];
      speakCue(`Préparez-vous pour ${nextEx?.name || 'le prochain exercice'}.`);

      setTimeout(() => {
        setCurrentIndex(nextIdx);
        setCurrentSet(1);
        setSessionPhase('active');
      }, 2000);
    } else {
      const nextSetNum = currentSet + 1;
      speakCue(`Préparez-vous pour la série ${nextSetNum}.`);

      setTimeout(() => {
        setCurrentSet(nextSetNum);
        setSessionPhase('active');
        if (isTimedExercise) {
          setTimedExerciseCountdown(exerciseDurationTarget);
          setIsTimedExerciseRunning(true);
        }
      }, 1800);
    }
  };

  // Finish session & record data to Firestore + local storage
  const finishSession = async () => {
    setSessionPhase('completed');
    setIsSavingLog(true);

    const durationMinutes = Math.max(1, Math.round(totalElapsedTime / 60));
    const allCategories = Array.from(new Set(exercises.map((e) => e.category)));

    try {
      await logWorkoutSession(currentUser?.uid, {
        userId: currentUser?.uid || 'guest',
        sessionTitle,
        level,
        categories: allCategories,
        durationMinutes,
        exercisesCompletedCount: exercises.length,
        totalSetsCompleted: completedSetsCount + 1,
        exerciseIds: exercises.map((e) => e.id),
        restConfiguredSeconds: initialRestSeconds,
      });
      speakCue('Félicitations ! Vous avez terminé votre séance.');
      onSessionFinished?.();
    } catch (e) {
      console.warn('[Session] Error saving log:', e);
    } finally {
      setIsSavingLog(false);
    }
  };

  if (!isOpen || !currentExercise) return null;

  const currentCategoryDisplay = currentExercise.category.replace('-', ' ');
  const progressPercent = Math.round(((currentIndex + 1) / exercises.length) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl overflow-y-auto p-2 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white my-auto max-h-[96vh]">
        {/* TOP BAR: SÉANCE DU JOUR • Zone • Exercice X sur Y */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-orange-600/25 text-orange-400 border border-orange-500/30 flex items-center justify-center font-extrabold text-xs shadow-xs">
              {currentIndex + 1}/{exercises.length}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">
                  SÉANCE DU JOUR
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] font-bold text-slate-300 capitalize">
                  {currentCategoryDisplay}
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Exercice {currentIndex + 1} sur {exercises.length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick controls: Voice audio toggle, Pause button, Quit button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nextVal = !voiceEnabled;
                setVoiceEnabled(nextVal);
                if (nextVal) speakCue('Guidage vocal activé.');
              }}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                voiceEnabled ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800/80'
              }`}
              title={voiceEnabled ? 'Désactiver la voix guidée' : 'Activer la voix guidée'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {sessionPhase !== 'completed' && (
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isPaused ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title={isPaused ? 'Reprendre' : 'Mettre en pause'}
              >
                {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
                <span className="hidden sm:inline">{isPaused ? 'Reprendre' : 'Pause'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (sessionPhase !== 'completed') {
                  setShowExitConfirm(true);
                } else {
                  onClose();
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Quitter la séance"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress line */}
        <div className="w-full h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* MODAL MAIN CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* PAUSE OVERLAY */}
          {isPaused && sessionPhase !== 'completed' && (
            <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                <Pause className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white">Séance en pause</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Prenez un instant. Votre progression est conservée.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  Reprendre la séance
                </button>
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(true)}
                  className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs transition-all cursor-pointer"
                >
                  Quitter la séance
                </button>
              </div>
            </div>
          )}

          {/* QUIT CONFIRMATION DIALOG (Prompt Rule #35) */}
          {showExitConfirm && (
            <div className="p-6 rounded-3xl bg-red-950/40 border border-red-800/60 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 mx-auto flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-white">
                Voulez-vous vraiment arrêter cette séance ?
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Votre progression pour cette séance ne sera pas enregistrée dans l'historique complet.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition-all cursor-pointer"
                >
                  Continuer la séance
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  Quitter
                </button>
              </div>
            </div>
          )}

          {/* STATE 1: WORKOUT COMPLETED 🎉 */}
          {sessionPhase === 'completed' ? (
            <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/25">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-3xl font-black text-white">Bravo ! Séance terminée 🎉</h3>
                <p className="text-sm text-slate-300">
                  Votre entraînement a été validé et enregistré dans votre profil OREA ÉNERGIE.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-left">
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Durée totale</span>
                  <span className="text-base font-extrabold text-white mt-0.5 block">
                    {formatRestMinutesSeconds(totalElapsedTime)}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Exercices</span>
                  <span className="text-base font-extrabold text-white mt-0.5 block">
                    {exercises.length} réalisés
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Séries validées</span>
                  <span className="text-base font-extrabold text-white mt-0.5 block">
                    {completedSetsCount} séries
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Niveau</span>
                  <span className="text-base font-extrabold text-orange-400 mt-0.5 block capitalize">
                    {level}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-orange-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>Quitter et revenir à ÉNERGIE</span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-lg bg-white/20 text-white text-[11px] font-mono font-bold">
                    Entrée ↵
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Raccourcis clavier :</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]">
                    Échap
                  </kbd>
                  <span>ou</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]">
                    Entrée
                  </kbd>
                  <span>pour fermer instantanément</span>
                </div>
              </div>
            </div>
          ) : sessionPhase === 'rest' ? (
            /* STATE 2: RÉCUPÉRATION STATE (Prompt 1 #14 & Prompt 2 #19, #20, #22) */
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 animate-in fade-in duration-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-extrabold border border-blue-500/30">
                <Heart className="w-3.5 h-3.5 text-blue-400" />
                <span>RÉCUPÉRATION ACTIVE</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  Temps de récupération
                </h3>
                {/* Big clear Countdown (01:00 -> 00:59 ...) */}
                <div className="text-6xl sm:text-7xl font-black text-white tracking-tight font-mono py-2">
                  {formatRestMinutesSeconds(timerSeconds)}
                </div>
              </div>

              {/* Next Exercise or Next Set preview */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 text-left">
                {currentSet < currentExercise.sets ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">
                        Prochaine série
                      </span>
                      <span className="text-sm font-extrabold text-white block mt-0.5">
                        Série {currentSet + 1} sur {currentExercise.sets}
                      </span>
                      <span className="text-xs text-slate-400 block">
                        {currentExercise.repetitions || `${currentExercise.duration}s`}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-slate-700 text-slate-300 text-xs font-bold">
                      {currentExercise.name}
                    </span>
                  </div>
                ) : nextExercise ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                        Exercice terminé ✅ — Prochain exercice :
                      </span>
                      <span className="text-base font-extrabold text-white block mt-0.5">
                        {nextExercise.name}
                      </span>
                      <span className="text-xs text-slate-400 block capitalize">
                        {nextExercise.category} • Niveau {nextExercise.difficulty}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-orange-400 shrink-0 ml-2" />
                  </div>
                ) : (
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                      Dernier exercice complété !
                    </span>
                    <span className="text-sm font-extrabold text-white block mt-0.5">
                      Préparez-vous pour le bilan de séance
                    </span>
                  </div>
                )}
              </div>

              {/* Passer button (Prompt 1 #15 & Prompt 2 #22) */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleRestCompleted}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700 cursor-pointer"
                >
                  Passer la récupération
                </button>
              </div>
            </div>
          ) : sessionPhase === 'transitioning' ? (
            /* STATE 3: "PRÉPAREZ-VOUS…" TRANSITION (Prompt 1 #21) */
            <div className="py-16 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-orange-600/20 text-orange-400 border border-orange-500/30 mx-auto flex items-center justify-center animate-bounce">
                <Flame className="w-8 h-8 fill-orange-500" />
              </div>
              <h3 className="text-3xl font-black text-white">Préparez-vous…</h3>
              <p className="text-sm text-slate-300 font-medium">
                Respirez, positionnez-vous correctement.
              </p>
            </div>
          ) : (
            /* STATE 4: ACTIVE EXERCISE STAGE */
            <div className="space-y-4">
              {/* Exercise Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {currentExercise.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-orange-400 capitalize">
                      {currentCategoryDisplay}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400 capitalize">
                      Niveau {currentExercise.difficulty}
                    </span>
                    {currentExercise.equipment.length > 0 && currentExercise.equipment[0] !== 'aucun' && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-400 capitalize">
                          {currentExercise.equipment.join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Media Toggle Switcher */}
                <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-2xl border border-slate-700/80 self-start sm:self-auto">
                  {currentExercise.model3D && (
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('3d')}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeMediaTab === '3d'
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>3D</span>
                    </button>
                  )}

                  {currentExercise.videoUrl && (
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('video')}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeMediaTab === 'video'
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Vidéo</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('instructions')}
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeMediaTab === 'instructions'
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Consignes</span>
                  </button>
                </div>
              </div>

              {/* IMMERSIVE DEMONSTRATION VIEWPORT (Prompt 2 #1 to #16) */}
              <div className="w-full">
                {activeMediaTab === '3d' && currentExercise.model3D ? (
                  <Orea3DExerciseViewer
                    exerciseType={currentExercise.model3D.type}
                    exerciseName={currentExercise.name}
                  />
                ) : activeMediaTab === 'video' && currentExercise.videoUrl ? (
                  <OreaVideoPlayer
                    videoUrl={currentExercise.videoUrl}
                    exerciseName={currentExercise.name}
                    className="h-80 sm:h-96 md:h-[460px]"
                  />
                ) : (
                  <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700 space-y-4">
                    <h3 className="text-sm font-extrabold text-orange-400 uppercase tracking-wider">
                      Instructions & Posture
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                      {currentExercise.instructions.map((ins, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{ins}</span>
                        </li>
                      ))}
                    </ul>
                    {currentExercise.tips && currentExercise.tips.length > 0 && (
                      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                        💡 <strong>Conseil OREA :</strong> {currentExercise.tips[0]}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SET STATUS & ACTIONS BAR (Prompt 2 #17, #18, #32, #33) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                      SÉRIE {currentSet} SUR {currentExercise.sets}
                    </span>
                    {isTimedExercise && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                        Chronométré
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-baseline justify-center sm:justify-start gap-2">
                    {isTimedExercise ? (
                      <span className="text-2xl font-black text-white font-mono">
                        {formatRestMinutesSeconds(timedExerciseCountdown || 0)}
                      </span>
                    ) : (
                      <span className="text-xl font-black text-white">
                        {currentExercise.repetitions || `${currentExercise.duration}s`}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {isTimedExercise ? 'temps restant pour cette série' : 'prévues pour cette série'}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
                  <button
                    type="button"
                    onClick={handleCompleteSet}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-orange-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>
                      {currentSet >= currentExercise.sets ? 'Exercice terminé' : 'Série terminée'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
