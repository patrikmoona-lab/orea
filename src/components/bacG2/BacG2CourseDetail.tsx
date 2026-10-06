import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Play,
  FileText,
  Lightbulb,
  Sparkles,
  Award,
  HelpCircle,
  ExternalLink,
  Clock,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { BacG2Course } from '../../types/bacG2';
import { BAC_G2_DOMAIN_LABELS } from '../../data/bacG2/allCourses';

interface BacG2CourseDetailProps {
  course: BacG2Course;
  isCompleted: boolean;
  isFavorite: boolean;
  onToggleComplete: (courseId: string) => void;
  onToggleFavorite: (courseId: string) => void;
  onNavigateCourse: (courseId: string) => void;
  onBackToList: () => void;
  onOpenAICoach: (course: BacG2Course) => void;
  allCoursesInDomain: BacG2Course[];
}

export const BacG2CourseDetail: React.FC<BacG2CourseDetailProps> = ({
  course,
  isCompleted,
  isFavorite,
  onToggleComplete,
  onToggleFavorite,
  onNavigateCourse,
  onBackToList,
  onOpenAICoach,
  allCoursesInDomain,
}) => {
  const [activeTab, setActiveTab] = useState<'cours' | 'methode' | 'exercice' | 'video' | 'resume'>('cours');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const domainInfo = BAC_G2_DOMAIN_LABELS[course.domain];

  // Find index in domain list for previous / next
  const currentIndex = allCoursesInDomain.findIndex((c) => c.id === course.id);
  const prevCourse = currentIndex > 0 ? allCoursesInDomain[currentIndex - 1] : null;
  const nextCourse = currentIndex < allCoursesInDomain.length - 1 ? allCoursesInDomain[currentIndex + 1] : null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={onBackToList}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue BAC G2</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Favorite Button */}
          <button
            type="button"
            onClick={() => onToggleFavorite(course.id)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-amber-600'
            }`}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* AI Coach Button */}
          <button
            type="button"
            onClick={() => onOpenAICoach(course)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span>Assistant IA BAC G2</span>
          </button>

          {/* Mark Complete Button */}
          <button
            type="button"
            onClick={() => onToggleComplete(course.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Validé & Terminé' : 'Marquer comme terminé'}</span>
          </button>
        </div>
      </div>

      {/* Main Course Header Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: domainInfo.color }}
        />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border"
            style={{
              backgroundColor: domainInfo.bg,
              color: domainInfo.color,
              borderColor: domainInfo.border,
            }}
          >
            {domainInfo.label} • {course.subcategory}
          </span>
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            {course.id}
          </span>
          <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            Niveau : {course.level}
          </span>
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {course.durationMinutes} min estimées
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f2347] tracking-tight leading-tight mb-3">
          {course.title}
        </h1>

        <p className="text-base text-slate-600 leading-relaxed mb-6">
          {course.description}
        </p>

        {/* Objectives Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/70 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Objectifs Pédagogiques du Cours</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
            {course.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Course Content Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        {[
          { id: 'cours', label: '📖 Le Cours', icon: BookOpen },
          { id: 'methode', label: '💡 Exemple & Méthode', icon: Lightbulb },
          { id: 'exercice', label: '📝 Exercice Pratique', icon: FileText },
          { id: 'video', label: '🎥 Vidéo Pédagogique', icon: Play },
          { id: 'resume', label: '📌 À Retenir', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0056d6] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Detailed Course Text */}
      {activeTab === 'cours' && (
        <div className="space-y-6">
          {/* Introduction Card */}
          <div className="p-6 bg-blue-50/60 rounded-2xl border border-blue-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-800 mb-2">
              Introduction
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {course.introduction}
            </p>
          </div>

          {/* Definitions glossary */}
          {course.definitions && course.definitions.length > 0 && (
            <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#0f2347] flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Notions & Définitions Clés</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.definitions.map((def, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="font-bold text-sm text-[#0f2347] block mb-1">
                      {def.term}
                    </span>
                    <span className="text-xs text-slate-600 leading-relaxed block">
                      {def.definition}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Content */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs prose prose-slate max-w-none">
            <div className="whitespace-pre-line text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
              {course.content}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Example & Step-by-Step Methodology */}
      {activeTab === 'methode' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-[#0f2347] flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>{course.example.title}</span>
            </h3>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-sm text-amber-900 leading-relaxed">
              <strong>Énoncé du cas :</strong> {course.example.statement}
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-sm text-emerald-900 leading-relaxed">
              <strong>Solution & Analyse :</strong> {course.example.solution}
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-[#0f2347]">
              Méthodologie pas à pas pour l'examen
            </h3>
            <div className="space-y-2">
              {course.methodology.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Application Exercise & Correction */}
      {activeTab === 'exercice' && (
        <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0f2347] flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Exercice d'Application Directe</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
              Auto-évaluation
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
            {course.exercise.question}
          </div>

          {/* Options */}
          {course.exercise.options && (
            <div className="space-y-2.5">
              {course.exercise.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === course.exercise.correctOptionIndex;
                let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';
                if (showCorrection) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 border-rose-300 text-rose-900';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-blue-50 border-blue-400 text-blue-900 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!showCorrection) setSelectedOption(idx);
                    }}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!showCorrection ? (
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={() => setShowCorrection(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Vérifier ma réponse
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowCorrection(false);
                  setSelectedOption(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer"
              >
                Recommencer l'exercice
              </button>
            )}
          </div>

          {/* Correction card */}
          {showCorrection && (
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Correction & Explications pédagogiques</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">{course.exercise.correction}</p>
              <p className="text-xs text-emerald-800/90 italic pt-1">{course.exercise.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: French YouTube Video */}
      {activeTab === 'video' && (
        <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-[#0f2347]">
                🎥 Vidéo Pédagogique en Français
              </h3>
              <p className="text-xs text-slate-500">
                {course.videoTitle || `Support vidéo pour le cours : ${course.title}`}
              </p>
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${course.youtubeId || 'q2K4nI4aV2w'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
            >
              <span>Regarder sur YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Official YouTube Embed */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-md">
            {!isVideoLoaded ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsVideoLoaded(true)}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer mb-3"
                  aria-label="Lancer la vidéo"
                >
                  <Play className="w-7 h-7 fill-current ml-1" />
                </button>
                <span className="text-sm font-semibold block">Cliquer pour charger la vidéo YouTube</span>
                <span className="text-xs text-slate-400 mt-1">Intégration officielle certifiée pour la révision</span>
              </div>
            ) : (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${course.youtubeId || 'q2K4nI4aV2w'}?autoplay=1&rel=0`}
                title={course.videoTitle || course.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Summary & Cheat Sheet */}
      {activeTab === 'resume' && (
        <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-[#0f2347]">
              Points Clés & Fiche Mémorisable pour le BAC G2
            </h3>
          </div>

          <div className="space-y-2.5">
            {course.summary.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* Keywords tags */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Mots-clés d'examen :</span>
            {course.keywords.map((kw, idx) => (
              <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                #{kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Course Navigator (Previous / Next) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        {prevCourse ? (
          <button
            type="button"
            onClick={() => onNavigateCourse(prevCourse.id)}
            className="w-full sm:w-auto flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-200/70 text-left transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-600 block font-semibold">
                Cours précédent
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#0f2347] line-clamp-1">
                {prevCourse.title}
              </span>
            </div>
          </button>
        ) : (
          <div />
        )}

        {nextCourse ? (
          <button
            type="button"
            onClick={() => onNavigateCourse(nextCourse.id)}
            className="w-full sm:w-auto flex items-center justify-end gap-3 p-3 rounded-xl hover:bg-blue-50 border border-blue-200/70 text-right transition-all cursor-pointer ml-auto"
          >
            <div>
              <span className="text-[11px] uppercase tracking-wider text-blue-600 block font-semibold">
                Cours suivant
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#0f2347] line-clamp-1">
                {nextCourse.title}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-600" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
