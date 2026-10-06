import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, Shield, Activity, Apple, Moon, Footprints, Brain } from 'lucide-react';
import { HealthCardItem, HealthCategoryKey } from '../types';
import { OreaButton } from './common/OreaButton';

interface CategoryModalProps {
  category: HealthCardItem | null;
  onClose: () => void;
  onSwitchCategory: (key: HealthCategoryKey) => void;
  allCategories: HealthCardItem[];
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  category,
  onClose,
  onSwitchCategory,
  allCategories,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tips' | 'warning'>('overview');

  if (!category) return null;

  const getIcon = (id: HealthCategoryKey) => {
    switch (id) {
      case 'symptomes':
        return <Activity className="w-5 h-5 text-[#2563eb]" />;
      case 'prevention':
        return <Shield className="w-5 h-5 text-[#2563eb]" />;
      case 'nutrition':
        return <Apple className="w-5 h-5 text-[#2563eb]" />;
      case 'sommeil':
        return <Moon className="w-5 h-5 text-[#2563eb]" />;
      case 'sport':
        return <Footprints className="w-5 h-5 text-[#2563eb]" />;
      case 'mentale':
        return <Brain className="w-5 h-5 text-[#2563eb]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-[#f8fbfe] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              {getIcon(category.id)}
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#2563eb] uppercase tracking-wider">
                Espace Thématique OREA
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2347]">
                {category.title}
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                {category.details.tagline}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Quick Tabs Bar */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b border-slate-100 bg-white overflow-x-auto text-xs font-medium">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSwitchCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                cat.id === category.id
                  ? 'bg-[#2563eb] text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Overview text */}
          <div className="bg-[#f0f7ff] border border-blue-100 rounded-2xl p-4">
            <p className="text-sm sm:text-[14.5px] leading-relaxed text-[#1e293b]">
              {category.details.overview}
            </p>
          </div>

          {/* Key Points */}
          <div>
            <h3 className="text-sm font-bold text-[#0f2347] uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
              Points clés essentiels
            </h3>
            <ul className="space-y-2.5">
              {category.details.keyPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] mt-2 shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Practical Tips */}
          <div>
            <h3 className="text-sm font-bold text-[#0f2347] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Conseils pratiques au quotidien
            </h3>
            <div className="space-y-2.5">
              {category.details.practicalTips.map((tip, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Warning Signs if present */}
          {category.details.warningSigns && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Signes d'alerte devant motiver un avis médical
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-800">
                {category.details.warningSigns.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-[#f8fbfe] flex items-center justify-between">
          <span className="text-xs text-[#64748b]">
            Validé scientifiquement par l'équipe OREA Santé
          </span>
          <OreaButton
            variant="sante"
            size="sm"
            onClick={onClose}
          >
            Fermer l'aperçu
          </OreaButton>
        </div>
      </div>
    </div>
  );
};
