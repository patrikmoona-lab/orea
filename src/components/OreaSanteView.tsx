import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowLeft,
  AlertTriangle,
  Info,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { OREA_SANTE_12_CATEGORIES, SEARCHABLE_TOPICS, SanteCategory } from '../data';
import { SymptomTopic } from '../types';
import { OREASymbol } from './OREALogo';
import oreaSanteFamilyImg from '../assets/images/orea_sante_family_1788513814143.jpg';

interface OreaSanteViewProps {
  onBackToHome: () => void;
}

export const OreaSanteView: React.FC<OreaSanteViewProps> = ({ onBackToHome }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTopic, setActiveTopic] = useState<SymptomTopic | null>(SEARCHABLE_TOPICS[0]);

  // Filter topics based on search and category
  const filteredTopics = useMemo(() => {
    return SEARCHABLE_TOPICS.filter((topic) => {
      const matchesSearch =
        topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.causes?.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'all' ||
        topic.category.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full bg-[#f8fbfe] min-h-screen py-8 sm:py-12">
      <div className="max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Breadcrumb & Return button */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#d8ebfa] text-[#1e293b] hover:text-[#2563eb] hover:bg-[#eff6ff] text-sm font-medium transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </button>
          <span className="text-slate-400">/</span>
          <div className="inline-flex items-center gap-1.5">
            <OREASymbol className="w-4 h-4" />
            <span className="text-sm font-semibold text-[#0056d6]">OREA Santé</span>
          </div>
        </div>

        {/* Hero Header with Image 1 Integration */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dbeaf8] p-6 sm:p-10 shadow-[0_4px_24px_rgba(37,99,235,0.04)] mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff6ff] border border-[#dbeafe] text-[#0056d6] text-xs font-semibold mb-3.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Espace Information & Décryptage Médical</span>
              </div>
              <h1 className="text-[32px] sm:text-[40px] font-extrabold text-[#0f2347] tracking-tight leading-tight">
                Comprendre votre santé simplement.
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#64748b] mt-3 leading-relaxed">
                Informations de santé, symptômes, prévention et conseils fiables pour vous aider à mieux
                comprendre les signaux de votre corps et réagir de manière éclairée.
              </p>

              {/* Medical Disclaimer Alert */}
              <div className="mt-5 p-4 rounded-xl bg-[#f0f7ff] border border-[#bfdbfe] flex items-start gap-3 text-xs sm:text-sm text-[#1e3a8a]">
                <Info className="w-5 h-5 text-[#0056d6] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Information médicale importante :</strong> Ces fiches fournissent des explications générales et
                  pédagogiques. Elles ne posent aucun diagnostic définitif et ne remplacent en aucun cas une consultation médicale personnalisée.
                </p>
              </div>
            </div>

            {/* Photo Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#cfe2f5] group">
                <img
                  src={oreaSanteFamilyImg}
                  alt="Médecin OREA Santé en consultation bienveillante avec une famille"
                  className="w-full h-52 sm:h-60 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11.5px] font-medium drop-shadow-sm flex items-center justify-between">
                  <span>Consultation & pédagogie médicale</span>
                  <span className="font-bold text-blue-200">OREA Santé</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8 pt-6 border-t border-[#f0f4f9] relative max-w-2xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-[#0056d6] absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un symptôme, une maladie ou un sujet de santé..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#cfe2f5] bg-[#fafcff] focus:bg-white focus:border-[#0056d6] focus:ring-3 focus:ring-blue-100 text-[#0f2347] text-[15px] outline-none transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-md cursor-pointer"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 12 Categories Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0f2347]">Les 12 univers thématiques</h2>
            <span className="text-xs text-[#64748b]">Sélectionnez une catégorie pour filtrer</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedCategory === 'all'
                  ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm'
                  : 'bg-white border-[#dce9f6] text-[#0f2347] hover:border-[#93c5fd] hover:bg-[#f8fbfe]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-[11px] font-semibold opacity-80">Tous</span>
              </div>
              <span className="text-[13px] font-bold">Tous les sujets</span>
            </button>

            {OREA_SANTE_12_CATEGORIES.map((cat: SanteCategory) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm'
                      : 'bg-white border-[#dce9f6] text-[#0f2347] hover:border-[#93c5fd] hover:bg-[#f8fbfe]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Activity className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#2563eb]'}`} />
                    <span className={`text-[10.5px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                      {cat.topicsCount} fiches
                    </span>
                  </div>
                  <span className="text-[13px] font-bold truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Layout: Left List of Topics & Right Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: List of matching topics */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#64748b]">
                Sujets disponibles ({filteredTopics.length})
              </h3>
            </div>

            {filteredTopics.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-[#dbeaf8] text-center">
                <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-[#0f2347]">Aucun résultat correspondant</p>
                <p className="text-xs text-[#64748b] mt-1">
                  Essayez un autre mot-clé ou réinitialisez les filtres.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-3 px-3 py-1.5 text-xs text-[#2563eb] bg-[#eff6ff] rounded-lg font-medium"
                >
                  Réinitialiser
                </button>
              </div>
            ) : (
              filteredTopics.map((topic) => {
                const isActive = activeTopic?.id === topic.id;

                return (
                  <div
                    key={topic.id}
                    onClick={() => setActiveTopic(topic)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white border-[#2563eb] shadow-[0_4px_16px_rgba(37,99,235,0.1)] ring-2 ring-blue-100'
                        : 'bg-white border-[#dce9f6] hover:border-[#93c5fd] hover:bg-[#fafcff]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-semibold text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded-md">
                          {topic.category}
                        </span>
                        <h4 className="text-[15px] font-bold text-[#0f2347] mt-1.5 leading-snug">
                          {topic.name}
                        </h4>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 mt-1 ${isActive ? 'text-[#2563eb]' : 'text-slate-300'}`} />
                    </div>
                    <p className="text-xs text-[#64748b] mt-1.5 line-clamp-2 leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Scientific Topic View */}
          <div className="lg:col-span-8">
            {activeTopic ? (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dbeaf8] p-6 sm:p-9 shadow-[0_4px_24px_rgba(37,99,235,0.04)] space-y-7">
                {/* Topic Header */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-[#2563eb] uppercase tracking-wider">
                      {activeTopic.category}
                    </span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      Fiche validée OREA
                    </span>
                  </div>
                  <h3 className="text-[26px] sm:text-[32px] font-extrabold text-[#0f2347] leading-tight tracking-tight">
                    {activeTopic.name}
                  </h3>
                  <div className="w-10 h-[3px] bg-[#2563eb] rounded-full mt-3" />
                </div>

                {/* General Description */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#f8fbfe] border border-[#e1eef9]">
                  <h4 className="text-xs font-bold text-[#2563eb] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    <span>Description générale</span>
                  </h4>
                  <p className="text-[14.5px] sm:text-[15.5px] text-[#334155] leading-relaxed">
                    {activeTopic.summary}
                  </p>
                  <p className="text-xs text-slate-500 mt-2.5 italic">
                    « Ce symptôme peut avoir plusieurs causes. Voici des informations générales pour vous aider à comprendre ce phénomène. »
                  </p>
                </div>

                {/* Causes Possibles */}
                {activeTopic.causes && (
                  <div>
                    <h4 className="text-[16px] font-bold text-[#0f2347] mb-3 flex items-center gap-2">
                      <Activity className="w-4.5 h-4.5 text-[#2563eb]" />
                      <span>Causes possibles courantes</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeTopic.causes.map((cause, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white border border-[#e5edf5] flex items-start gap-2.5 text-sm text-[#334155]">
                          <span className="w-5 h-5 rounded-full bg-[#eff6ff] text-[#2563eb] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{cause}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conseils Généraux & Mesures Pratiques */}
                <div>
                  <h4 className="text-[16px] font-bold text-[#0f2347] mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Conseils généraux & bons réflexes</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {activeTopic.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-[#334155] p-2.5 rounded-lg hover:bg-slate-50">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prévention */}
                {activeTopic.prevention && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0]">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Prévention au quotidien</span>
                    </h4>
                    <ul className="space-y-1.5 text-sm text-emerald-950">
                      {activeTopic.prevention.map((prev, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{prev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quand consulter un médecin */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#eff6ff] border border-[#bfdbfe]">
                  <h4 className="text-xs font-bold text-[#1e40af] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#2563eb]" />
                    <span>Quand consulter un médecin ?</span>
                  </h4>
                  <p className="text-sm text-[#1e3a8a] leading-relaxed">
                    {activeTopic.whenToConsult}
                  </p>
                </div>

                {/* Signes d'alerte / Prise en charge urgente */}
                {activeTopic.urgentSigns && activeTopic.urgentSigns.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#fef2f2] border border-[#fecaca]">
                    <h4 className="text-xs font-bold text-[#991b1b] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#dc2626]" />
                      <span>Signes nécessitant une prise en charge urgente</span>
                    </h4>
                    <ul className="space-y-1.5 text-sm text-[#7f1d1d] mb-3">
                      {activeTopic.urgentSigns.map((sign, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#dc2626] font-bold">⚠</span>
                          <span className="font-medium">{sign}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-[#b91c1c] font-semibold bg-white/80 p-2.5 rounded-lg border border-[#fca5a5]">
                      En présence de ces signes, n'attendez pas : appelez immédiatement le 15 (SAMU) ou le 112 (Numéro d'urgence européen).
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#dbeaf8] p-12 text-center">
                <p className="text-slate-500">Sélectionnez un sujet dans la liste de gauche.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
