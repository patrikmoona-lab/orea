import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Sparkles,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BAC_G2_CHEAT_SHEETS } from '../../data/bacG2/cheatSheetsData';
import { BacG2Domain, BacG2CheatSheet } from '../../types/bacG2';
import { BAC_G2_DOMAIN_LABELS } from '../../data/bacG2/allCourses';

export const BacG2CheatSheetsView: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<BacG2Domain | 'all'>('all');
  const [expandedSheetId, setExpandedSheetId] = useState<string | null>(BAC_G2_CHEAT_SHEETS[0].id);

  const filteredSheets = BAC_G2_CHEAT_SHEETS.filter(
    (sheet) => selectedDomain === 'all' || sheet.domain === selectedDomain
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2347]">
                Fiches Synthétiques & Formulaires BAC G2
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                L’essentiel à mémoriser rapidement : formules, principes juridiques et schémas SYSCOHADA.
              </p>
            </div>
          </div>

          {/* Domain filter buttons */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedDomain('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDomain === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Toutes
            </button>
            {(['comptabilite', 'fiscalite', 'droit', 'syscohada'] as BacG2Domain[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDomain(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDomain === d
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {BAC_G2_DOMAIN_LABELS[d].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sheets List */}
      <div className="space-y-4">
        {filteredSheets.map((sheet) => {
          const domainInfo = BAC_G2_DOMAIN_LABELS[sheet.domain];
          const isExpanded = expandedSheetId === sheet.id;

          return (
            <div
              key={sheet.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
            >
              {/* Collapsible Header */}
              <div
                onClick={() => setExpandedSheetId(isExpanded ? null : sheet.id)}
                className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-[240px]">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border"
                      style={{
                        backgroundColor: domainInfo.bg,
                        color: domainInfo.color,
                        borderColor: domainInfo.border,
                      }}
                    >
                      {domainInfo.label}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sheet.readTime}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0f2347]">
                    {sheet.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {sheet.highlights.map((hl, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        • {hl}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Body */}
              {isExpanded && (
                <div className="p-5 sm:p-6 border-t border-slate-100 space-y-5 bg-slate-50/40 animate-fadeIn">
                  <div className="prose prose-sm text-slate-700 max-w-none whitespace-pre-line leading-relaxed">
                    {sheet.content}
                  </div>

                  {sheet.formulasOrRules && sheet.formulasOrRules.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-slate-200/60">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Formules & Règles à appliquer :
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {sheet.formulasOrRules.map((f, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs"
                          >
                            <span className="text-xs font-bold text-blue-700 block">
                              {f.label}
                            </span>
                            <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 block bg-slate-50 p-2 rounded border border-slate-100">
                              {f.formula}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {f.explanation}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
