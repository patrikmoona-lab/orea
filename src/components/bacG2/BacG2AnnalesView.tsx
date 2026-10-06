import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  BookOpen,
} from 'lucide-react';
import { BAC_G2_ANNALES_DATABASE } from '../../data/bacG2/annalesData';
import { BacG2Annale } from '../../types/bacG2';
import { BAC_G2_DOMAIN_LABELS } from '../../data/bacG2/allCourses';

export const BacG2AnnalesView: React.FC = () => {
  const [selectedAnnale, setSelectedAnnale] = useState<BacG2Annale>(
    BAC_G2_ANNALES_DATABASE[0] || {
      id: 'default-annale',
      year: 2024,
      session: 'Session Normale',
      domain: 'comptabilite',
      title: 'Épreuve de Comptabilité & Gestion Financière',
      durationMinutes: 240,
      coefficient: 5,
      instructions: 'Calculatrice non programmable autorisée.',
      statement: 'Sujet officiel en cours de chargement...',
      sections: [],
    }
  );
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(true);

  const domainInfo = (selectedAnnale?.domain && BAC_G2_DOMAIN_LABELS[selectedAnnale.domain]) || {
    label: 'Comptabilité',
    bg: '#eff6ff',
    color: '#1e40af',
    border: '#bfdbfe',
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2347]">
              Annales & Épreuves Officielles BAC G2
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Sujets officiels des sessions antérieures accompagnés de leur barème et corrigé intégral.
            </p>
          </div>
        </div>

        {/* Annale Selector Buttons */}
        <div className="flex flex-wrap gap-2">
          {BAC_G2_ANNALES_DATABASE.map((annale) => (
            <button
              key={annale.id}
              type="button"
              onClick={() => setSelectedAnnale(annale)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedAnnale.id === annale.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {annale.session} • {annale.year}
            </button>
          ))}
        </div>
      </div>

      {/* Main Annale Content */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        {/* Annale Header */}
        <div className="border-b border-slate-200 pb-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border"
              style={{
                backgroundColor: domainInfo.bg,
                color: domainInfo.color,
                borderColor: domainInfo.border,
              }}
            >
              {domainInfo.label}
            </span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              Durée : {selectedAnnale.durationMinutes / 60} heures
            </span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              Coefficient : {selectedAnnale.coefficient}
            </span>
          </div>

          <h3 className="text-2xl font-extrabold text-[#0f2347]">
            {selectedAnnale.title} — {selectedAnnale.session}
          </h3>

          <p className="text-xs text-slate-500 italic">
            Instructions : {selectedAnnale.instructions}
          </p>
        </div>

        {/* Statement context */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-800 leading-relaxed">
          <strong>Contexte du dossier :</strong> {selectedAnnale.statement}
        </div>

        {/* Sections & Questions */}
        <div className="space-y-6">
          {selectedAnnale.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <h4 className="text-base font-bold text-[#0f2347]">
                  {section.title}
                </h4>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {section.points} points
                </span>
              </div>

              <div className="space-y-4">
                {section.questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                        {q.question}
                      </p>
                      <span className="text-xs font-bold text-slate-500 shrink-0">
                        {q.points} pts
                      </span>
                    </div>

                    {showAnswerKey && (
                      <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-1.5 animate-fadeIn">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Corrigé officiel & Barème</span>
                        </div>
                        <pre className="font-sans whitespace-pre-wrap leading-relaxed text-slate-800">
                          {q.answerKey}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
