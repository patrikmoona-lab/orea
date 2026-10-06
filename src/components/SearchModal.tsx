import React, { useState, useMemo } from 'react';
import { Search, X, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { SEARCHABLE_TOPICS } from '../data';
import { SymptomTopic } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topic: SymptomTopic) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  const categories = ['Tous', 'Symptômes généraux', 'Respiratoire', 'Neurologie', 'Bien-être'];

  const filteredTopics = useMemo(() => {
    return SEARCHABLE_TOPICS.filter((topic) => {
      const matchesText =
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesText;
    });
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#f8fbfe] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#2563eb] shrink-0" />
          <input
            type="text"
            placeholder="Rechercher un symptôme, un conseil, une thématique..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none outline-none text-[#0f2347] placeholder:text-slate-400 text-[15px] font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 shrink-0 font-medium">Suggestions :</span>
          {['Fièvre', 'Toux', 'Céphalées', 'Fatigue', 'Palpitations', 'Nutrition'].map((pill) => (
            <button
              key={pill}
              onClick={() => setSearchQuery(pill)}
              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563eb] font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="p-5 overflow-y-auto space-y-3 divide-y divide-slate-100">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className="pt-3 first:pt-0 group cursor-pointer hover:bg-blue-50/40 p-3 rounded-2xl transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-md">
                    {topic.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-[#2563eb]">
                    <span>Consulter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h4 className="text-[15px] font-bold text-[#0f2347] mt-1.5 group-hover:text-[#2563eb] transition-colors">
                  {topic.name}
                </h4>

                <p className="text-xs sm:text-[13px] text-[#64748b] leading-relaxed mt-1 line-clamp-2">
                  {topic.summary}
                </p>

                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50/70 px-2.5 py-1 rounded-lg border border-amber-100">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">{topic.whenToConsult}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400">
              <ShieldCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">Aucun résultat trouvé pour "{searchQuery}"</p>
              <p className="text-xs mt-1 text-slate-400">Essayez avec un autre mot-clé ou consultez nos Univers Santé.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
