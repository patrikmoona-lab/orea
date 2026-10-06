import React, { useState } from 'react';
import {
  X,
  Play,
  Heart,
  Clock,
  Dumbbell,
  ShieldAlert,
  Lightbulb,
  Layers,
  Sparkles,
  Video,
  Box,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { EnergieExercise, ENERGIE_CATEGORIES_LIST, ENERGIE_DIFFICULTIES_LIST } from '../../types/energie';
import { Orea3DExerciseViewer } from './Orea3DExerciseViewer';
import { OreaVideoPlayer } from './OreaVideoPlayer';

interface OreaExerciseDetailModalProps {
  exercise: EnergieExercise | null;
  isOpen: boolean;
  onClose: () => void;
  onStartExercise: (exercise: EnergieExercise) => void;
  onAddToCustomSession?: (exercise: EnergieExercise) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (exerciseId: string) => void;
}

export const OreaExerciseDetailModal: React.FC<OreaExerciseDetailModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onStartExercise,
  onAddToCustomSession,
  isFavorite = false,
  onToggleFavorite,
}) => {
  // Demonstration tab: '3d' or 'video' (default to 3d if available, else video)
  const defaultTab = exercise?.model3D ? '3d' : exercise?.videoUrl ? 'video' : '3d';
  const [activeMediaTab, setActiveMediaTab] = useState<'3d' | 'video'>(defaultTab);

  if (!isOpen || !exercise) return null;

  const categoryItem = ENERGIE_CATEGORIES_LIST.find((c) => c.id === exercise.category);
  const difficultyItem = ENERGIE_DIFFICULTIES_LIST.find((d) => d.id === exercise.difficulty);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-detail-title"
    >
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{categoryItem?.icon || '💪'}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  {categoryItem?.label || exercise.category}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 capitalize">
                  Niveau {difficultyItem?.label || exercise.difficulty}
                </span>
              </div>
              <h2 id="exercise-detail-title" className="text-base sm:text-lg font-black text-[#0f2347] dark:text-white line-clamp-1">
                {exercise.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(exercise.id)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isFavorite
                    ? 'text-red-500 bg-red-50 dark:bg-red-950/40 hover:bg-red-100'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fermer"
              aria-label="Fermer la fiche"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Séries</span>
              <span className="text-sm font-extrabold text-[#0f2347] dark:text-white mt-0.5 block">
                {exercise.sets} séries
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Volume</span>
              <span className="text-sm font-extrabold text-[#0f2347] dark:text-white mt-0.5 block">
                {exercise.repetitions || `${exercise.duration}s`}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Repos</span>
              <span className="text-sm font-extrabold text-[#0f2347] dark:text-white mt-0.5 block">
                {exercise.rest}s de pause
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Matériel</span>
              <span className="text-sm font-extrabold text-[#0f2347] dark:text-white mt-0.5 block truncate capitalize">
                {exercise.equipment.join(', ') || 'Aucun'}
              </span>
            </div>
          </div>

          {/* Demonstration Section with 3D & Video Switcher */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-[#0f2347] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Démonstration du mouvement</span>
              </h3>

              {/* Media Switcher Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('3d')}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeMediaTab === '3d'
                      ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>3D Interactive</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMediaTab('video')}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeMediaTab === 'video'
                      ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Vidéo</span>
                </button>
              </div>
            </div>

            {/* Render 3D or Video */}
            {activeMediaTab === '3d' ? (
              exercise.model3D ? (
                <Orea3DExerciseViewer
                  exerciseType={exercise.model3D.type}
                  exerciseName={exercise.name}
                />
              ) : (
                <div className="w-full min-h-[200px] rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                  <Box className="w-8 h-8 text-slate-600" />
                  <p className="text-sm font-bold text-slate-300">Modèle 3D bientôt disponible pour cet exercice.</p>
                  <p className="text-xs text-slate-500">Utilisez l’onglet Vidéo ou les instructions pas-à-pas ci-dessous.</p>
                </div>
              )
            ) : (
              <OreaVideoPlayer
                videoUrl={exercise.videoUrl}
                exerciseName={exercise.name}
              />
            )}
          </section>

          {/* Comment faire (Instructions) */}
          <section className="space-y-2.5">
            <h3 className="text-xs font-extrabold text-[#0f2347] dark:text-white uppercase tracking-wider">
              Comment exécuter le mouvement
            </h3>
            <div className="space-y-2">
              {exercise.instructions.map((inst, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                >
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{inst}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Erreurs fréquentes & Conseils */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Erreurs à éviter */}
            <div className="p-4 rounded-3xl bg-red-50/70 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 space-y-2">
              <h4 className="text-xs font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span>Erreurs fréquentes</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-red-950/80 dark:text-red-200/80">
                {exercise.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Conseils OREA */}
            <div className="p-4 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Conseils & Respiration</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-950/80 dark:text-amber-200/80">
                {exercise.tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Variantes */}
          {exercise.variants && exercise.variants.length > 0 && (
            <section className="space-y-2">
              <h4 className="text-xs font-extrabold text-[#0f2347] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-orange-500" />
                <span>Variantes de progression</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.variants.map((v, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 flex items-center justify-between gap-3">
          {onAddToCustomSession && (
            <button
              type="button"
              onClick={() => {
                onAddToCustomSession(exercise);
                onClose();
              }}
              className="px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter à ma séance</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onStartExercise(exercise);
              onClose();
            }}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Lancer cet exercice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
