import React, { useState, useEffect } from 'react';
import {
  Timer,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Play,
  ArrowRight,
  HelpCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { BacG2Domain, BacG2ExamQuestion } from '../../types/bacG2';
import { getExamQuestions } from '../../data/bacG2/examQuestionsData';
import { BAC_G2_DOMAIN_LABELS } from '../../data/bacG2/allCourses';

interface BacG2ExamSimulatorProps {
  onSaveScore: (scoreRecord: {
    domain: string;
    score: number;
    totalQuestions: number;
    correctQuestions: number;
  }) => void;
  onNavigateToCourse?: (domain: string) => void;
}

export const BacG2ExamSimulator: React.FC<BacG2ExamSimulatorProps> = ({
  onSaveScore,
  onNavigateToCourse,
}) => {
  // Configuration state
  const [selectedDomain, setSelectedDomain] = useState<BacG2Domain | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('Tous');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [durationMinutes, setDurationMinutes] = useState<number>(15);

  // Exam state
  const [examStatus, setExamStatus] = useState<'config' | 'in_progress' | 'completed'>('config');
  const [questions, setQuestions] = useState<BacG2ExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (examStatus === 'in_progress' && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [examStatus, secondsRemaining]);

  const handleStartExam = () => {
    const fetched = getExamQuestions(selectedDomain, questionCount, selectedLevel);
    setQuestions(fetched);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setSecondsRemaining(durationMinutes * 60);
    setExamStatus('in_progress');
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleFinishExam = () => {
    setExamStatus('completed');
    // Calculate score
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correct += 1;
      }
    });
    const finalScore = Number(((correct / (questions.length || 1)) * 20).toFixed(1));
    onSaveScore({
      domain: selectedDomain === 'all' ? 'Toutes Matières' : BAC_G2_DOMAIN_LABELS[selectedDomain].label,
      score: finalScore,
      totalQuestions: questions.length,
      correctQuestions: correct,
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Score calculation for completed state
  const totalCorrect = questions.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correctIndex ? acc + 1 : acc;
  }, 0);
  const noteSur20 = Number(((totalCorrect / (questions.length || 1)) * 20).toFixed(1));
  const percentage = Math.round((totalCorrect / (questions.length || 1)) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 1. CONFIGURATION VIEW */}
      {examStatus === 'config' && (
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2347]">
                Simulateur d'Examen BAC G2
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Entraînez-vous en conditions réelles avec chronomètre et notation officielle sur 20.
              </p>
            </div>
          </div>

          {/* Domain Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Matière de l'épreuve
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => setSelectedDomain('all')}
                className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedDomain === 'all'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Toutes matières
              </button>
              {(['comptabilite', 'fiscalite', 'droit', 'syscohada'] as BacG2Domain[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDomain(d)}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedDomain === d
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {BAC_G2_DOMAIN_LABELS[d].label}
                </button>
              ))}
            </div>
          </div>

          {/* Level & Question Count */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Niveau de difficulté
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Tous">Tous niveaux confondus</option>
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
                <option value="Révision BAC">Spécial Révision BAC</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Nombre de questions
              </label>
              <div className="flex gap-2">
                {[5, 10, 15].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`flex-1 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      questionCount === count
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {count} Qs
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Temps alloué (Chrono)
              </label>
              <div className="flex gap-2">
                {[10, 15, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`flex-1 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      durationMinutes === mins
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Start CTA */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={handleStartExam}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 hover:scale-[1.01] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Démarrer l'examen maintenant</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. EXAM IN PROGRESS VIEW */}
      {examStatus === 'in_progress' && questions.length > 0 && (
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
          {/* Header with Timer and Progress Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Question {currentQuestionIndex + 1} sur {questions.length}
              </span>
              <span className="text-sm font-bold text-[#0f2347]">
                {BAC_G2_DOMAIN_LABELS[questions[currentQuestionIndex].domain].label} • {questions[currentQuestionIndex].subcategory}
              </span>
            </div>

            {/* Countdown Badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
              secondsRemaining < 60
                ? 'bg-rose-100 text-rose-700 animate-pulse'
                : 'bg-slate-100 text-slate-800'
            }`}>
              <Timer className="w-4 h-4" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 text-base sm:text-lg font-semibold text-[#0f2347] leading-relaxed">
            {questions[currentQuestionIndex].question}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {questions[currentQuestionIndex].options.map((opt, optIdx) => {
              const isSelected = userAnswers[currentQuestionIndex] === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-medium flex items-start gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Question Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex gap-1.5 flex-wrap">
              {questions.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    i === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : userAnswers[i] !== undefined
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentQuestionIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Précédent
                </button>
              )}

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishExam}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Terminer l'examen
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. COMPLETED VIEW / RESULTS & CORRECTIONS */}
      {examStatus === 'completed' && (
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-6 animate-fadeIn">
          <div className="text-center space-y-3 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0f2347]">
              Résultats de votre Simulation BAC G2
            </h2>
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="text-center">
                <span className="text-3xl font-black text-blue-600 block">
                  {noteSur20} / 20
                </span>
                <span className="text-xs text-slate-500 font-medium">Note Officielle</span>
              </div>
              <div className="text-center">
                <span className="text-3xl font-black text-emerald-600 block">
                  {percentage}%
                </span>
                <span className="text-xs text-slate-500 font-medium">Taux de Réussite</span>
              </div>
              <div className="text-center">
                <span className="text-3xl font-black text-slate-700 block">
                  {totalCorrect}/{questions.length}
                </span>
                <span className="text-xs text-slate-500 font-medium">Bonnes Réponses</span>
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Correction Détaillée & Explications
            </h3>

            {questions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctIndex;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-2 flex-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        Question {idx + 1} • {BAC_G2_DOMAIN_LABELS[q.domain].label}
                      </span>
                      <p className="text-sm font-bold text-slate-900">{q.question}</p>

                      <div className="text-xs space-y-1 pt-1">
                        <p className={isCorrect ? 'text-emerald-800 font-semibold' : 'text-rose-800'}>
                          Votre réponse : {userAns !== undefined ? q.options[userAns] : 'Non répondue'}
                        </p>
                        {!isCorrect && (
                          <p className="text-emerald-800 font-semibold">
                            Bonne réponse : {q.options[q.correctIndex]}
                          </p>
                        )}
                        <p className="text-slate-600 italic pt-1">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reset CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setExamStatus('config')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Nouvelle simulation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
