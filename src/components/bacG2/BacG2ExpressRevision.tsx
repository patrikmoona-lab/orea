import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { BacG2Course } from '../../types/bacG2';
import { BAC_G2_DOMAIN_LABELS } from '../../data/bacG2/allCourses';

interface BacG2ExpressRevisionProps {
  allCourses: BacG2Course[];
  onSelectCourse: (courseId: string) => void;
}

export const BacG2ExpressRevision: React.FC<BacG2ExpressRevisionProps> = ({
  allCourses,
  onSelectCourse,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Filter high-yield BAC revision courses (fallback to allCourses if none match)
  const revisionCourses = (allCourses && allCourses.length > 0)
    ? allCourses.filter((c) => c.level === 'Révision BAC' || c.level === 'Avancé')
    : [];

  const effectiveCourses = revisionCourses.length > 0 ? revisionCourses : (allCourses || []);
  const safeLength = effectiveCourses.length || 1;
  const activeCourse = effectiveCourses[((currentIndex % safeLength) + safeLength) % safeLength] || allCourses?.[0];

  const handleNextCard = () => {
    if (effectiveCourses.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % effectiveCourses.length);
    }
  };

  const handlePrevCard = () => {
    if (effectiveCourses.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + effectiveCourses.length) % effectiveCourses.length);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2347]">
                Mode Révision Express BAC G2
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Sélectionnez votre temps disponible pour réviser les notions à fort coefficient.
              </p>
            </div>
          </div>

          {/* Duration Pills */}
          <div className="flex items-center gap-2">
            {[5, 10, 15, 30].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setSelectedDuration(mins)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDuration === mins
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>
        </div>

        {/* Flashcard Concept View */}
        {activeCourse && (
          <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-2xl border border-amber-200/60 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-lg">
                Notion Clé #{currentIndex + 1} • {BAC_G2_DOMAIN_LABELS[activeCourse.domain].label}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {revisionCourses.length} fiches disponibles
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#0f2347]">
              {activeCourse.title}
            </h3>

            <p className="text-sm text-slate-700 leading-relaxed">
              {activeCourse.introduction}
            </p>

            {/* Essential points */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Points clés à mémoriser pour l'examen :
              </span>
              {activeCourse.summary.slice(0, 3).map((pt, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-amber-200/50">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevCard}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Précédent
                </button>
                <button
                  type="button"
                  onClick={handleNextCard}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 text-xs font-bold transition-all cursor-pointer"
                >
                  Fiche suivante
                </button>
              </div>

              <button
                type="button"
                onClick={() => onSelectCourse(activeCourse.id)}
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <span>Ouvrir le cours complet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
