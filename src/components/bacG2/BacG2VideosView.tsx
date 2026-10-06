import React, { useState } from 'react';
import {
  Play,
  Search,
  Filter,
  ExternalLink,
  Clock,
  Award,
  Video,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { BAC_G2_VIDEOS_DATABASE, searchYoutubeVideos } from '../../data/bacG2/videosData';
import { BacG2Domain, BacG2Video } from '../../types/bacG2';
import { BAC_G2_DOMAIN_LABELS } from '../../data/bacG2/allCourses';

interface BacG2VideosViewProps {
  onSelectCourse?: (courseId: string) => void;
}

export const BacG2VideosView: React.FC<BacG2VideosViewProps> = ({ onSelectCourse }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<BacG2Domain | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<'fr' | 'all'>('fr'); // Default to French
  const [activePlayingVideo, setActivePlayingVideo] = useState<BacG2Video | null>(null);

  const filteredVideos = searchYoutubeVideos(searchQuery, {
    domain: selectedDomain === 'all' ? undefined : selectedDomain,
    language: languageFilter,
    videoType: selectedType === 'all' ? undefined : selectedType,
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2347]">
                Apprendre en Vidéo — BAC G2
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Sélection vérifiée de cours, exercices corrigés et méthodes en français.
              </p>
            </div>
          </div>

          {/* Language filter badge */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setLanguageFilter('fr')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                languageFilter === 'fr'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇫🇷 Français (Par défaut)
            </button>
            <button
              type="button"
              onClick={() => setLanguageFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                languageFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toutes les langues
            </button>
          </div>
        </div>

        {/* Search bar & domain filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une vidéo (bilan, TVA, contrat, SYSCOHADA)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedDomain('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedDomain === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tous
            </button>
            {(['comptabilite', 'fiscalite', 'droit', 'syscohada'] as BacG2Domain[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDomain(d)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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

      {/* Active Modal Video Player if selected */}
      {activePlayingVideo && (
        <div className="p-6 bg-white rounded-3xl border border-blue-200 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                Lecteur Intégré Certifié
              </span>
              <h3 className="text-lg font-bold text-[#0f2347]">
                {activePlayingVideo.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActivePlayingVideo(null)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Fermer le lecteur
            </button>
          </div>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activePlayingVideo.youtubeId}?autoplay=1&rel=0`}
              title={activePlayingVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((video) => {
          const domainInfo = BAC_G2_DOMAIN_LABELS[video.domain];
          return (
            <div
              key={video.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col group hover:shadow-md transition-all"
            >
              {/* Thumbnail with overlay Play */}
              <div
                className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                onClick={() => setActivePlayingVideo(video)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center group-hover:bg-slate-900/10 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                <span className="absolute bottom-2 right-2 bg-slate-950/80 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                      style={{
                        backgroundColor: domainInfo.bg,
                        color: domainInfo.color,
                        borderColor: domainInfo.border,
                      }}
                    >
                      {domainInfo.label}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {video.channel}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#0f2347] line-clamp-2 leading-snug">
                    {video.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {video.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActivePlayingVideo(video)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Regarder</span>
                  </button>

                  {video.courseId && onSelectCourse && (
                    <button
                      type="button"
                      onClick={() => onSelectCourse(video.courseId!)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      Voir le cours associé →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
