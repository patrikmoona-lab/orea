import React, { useState } from 'react';
import {
  X,
  Plus,
  Video,
  BookOpen,
  CheckCircle2,
  Trash2,
  Edit,
  ShieldCheck,
} from 'lucide-react';
import { BacG2Domain } from '../../types/bacG2';

interface BacG2AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideo: (video: any) => void;
}

export const BacG2AdminModal: React.FC<BacG2AdminModalProps> = ({
  isOpen,
  onClose,
  onAddVideo,
}) => {
  const [tab, setTab] = useState<'videos' | 'courses'>('videos');
  const [videoTitle, setVideoTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [domain, setDomain] = useState<BacG2Domain>('comptabilite');
  const [level, setLevel] = useState('Intermédiaire');
  const [channel, setChannel] = useState('');
  const [language, setLanguage] = useState<'fr' | 'all'>('fr');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !youtubeId.trim()) return;

    onAddVideo({
      id: `custom-vid-${Date.now()}`,
      youtubeId: youtubeId.trim(),
      title: videoTitle.trim(),
      channel: channel.trim() || 'Enseignant Agréé BAC G2',
      description: 'Ressource vidéo pédagogique validée pour le programme BAC G2.',
      language: language,
      domain: domain,
      level: level,
      duration: '15:00',
      thumbnail: `https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80`,
      status: 'approved',
      videoType: 'cours',
    });

    setSuccessMsg('Vidéo pédagogique ajoutée et validée avec succès !');
    setVideoTitle('');
    setYoutubeId('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold">Espace Pédagogique & Modération</h3>
              <p className="text-xs text-slate-400">Gestion des cours et validation des vidéos certifiées</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 space-y-4">
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveVideo} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Titre de la vidéo ou du cours
              </label>
              <input
                type="text"
                required
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Ex: Les Amortissements dérogatoires en SYSCOHADA"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Identifiant YouTube (ID)
                </label>
                <input
                  type="text"
                  required
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  placeholder="Ex: q2K4nI4aV2w"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Chaîne / Auteur
                </label>
                <input
                  type="text"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  placeholder="Ex: Professeur Compta"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Matière BAC G2
                </label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as BacG2Domain)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="comptabilite">Comptabilité</option>
                  <option value="fiscalite">Fiscalité</option>
                  <option value="droit">Droit</option>
                  <option value="syscohada">SYSCOHADA</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Niveau
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Avancé">Avancé</option>
                  <option value="Révision BAC">Révision BAC</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Fermer
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publier la ressource</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
