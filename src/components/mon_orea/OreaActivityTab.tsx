import React, { useState, useEffect } from 'react';
import {
  History,
  Sparkles,
  Plus,
  Clock,
  Activity,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Calendar,
} from 'lucide-react';
import { OreaButton } from '../common/OreaButton';
import { fetchUserActivities, logUserActivity, OreaActivityDoc } from '../../lib/firebase';
import { NavSection } from '../../types';

interface OreaActivityTabProps {
  userId: string;
  onNavigate?: (section: NavSection) => void;
}

export const OreaActivityTab: React.FC<OreaActivityTabProps> = ({ userId, onNavigate }) => {
  const [activities, setActivities] = useState<OreaActivityDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterModule, setFilterModule] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Manual Log Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [module, setModule] = useState('mon_orea');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    loadActivities();
  }, [userId]);

  const loadActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchUserActivities(userId);
      setActivities(list);
    } catch (err: any) {
      console.error('Error loading activities:', err);
      setError('Impossible de charger votre historique d’activité.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !userId) return;

    setSaving(true);
    try {
      const act = await logUserActivity(userId, {
        title: title.trim(),
        description: description.trim(),
        module,
        type: 'autre',
      });

      setActivities((prev) => [act, ...prev]);
      setTitle('');
      setDescription('');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error logging activity:', err);
      alert('Erreur lors de l’enregistrement du journal.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const filteredActivities = activities.filter(
    (a) => filterModule === 'all' || a.module === filterModule
  );

  const modulesList = [
    { id: 'all', label: 'Toutes' },
    { id: 'mon_orea', label: 'Mon OREA' },
    { id: 'cycle', label: 'Mon Cycle' },
    { id: 'sport', label: 'Sport' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'education', label: 'BAC G2' },
    { id: 'finance', label: 'Finance' },
    { id: 'planner', label: 'Planner' },
  ];

  const getModuleBadge = (mod: string) => {
    switch (mod) {
      case 'cycle':
        return <span className="px-2.5 py-0.5 rounded-md bg-pink-50 text-pink-700 text-[10px] font-bold border border-pink-200">Mon Cycle</span>;
      case 'sport':
        return <span className="px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-700 text-[10px] font-bold border border-orange-200">Sport & Workout</span>;
      case 'nutrition':
        return <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">Nutrition</span>;
      case 'education':
        return <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">BAC G2</span>;
      case 'finance':
        return <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">Finance</span>;
      case 'planner':
        return <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">Planner</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">{mod}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-[#0f2347] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
              <History className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
              MON SUIVI OREA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Historique & Activité Récente</h2>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
            Chronologie de vos actions, synchronisations et mises à jour enregistrées dans Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadActivities}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/15 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
          <OreaButton
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 flex items-center gap-2 shadow-lg py-2.5 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une entrée</span>
          </OreaButton>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {modulesList.map((m) => (
          <button
            key={m.id}
            onClick={() => setFilterModule(m.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterModule === m.id
                ? 'bg-[#0056d6] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadActivities}
            className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold transition-colors cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Activity Timeline */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200/80">
          <Sparkles className="w-8 h-8 text-blue-500 mx-auto animate-spin mb-3" />
          <p className="text-xs font-medium">Récupération de votre historique Firestore...</p>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0f2347]">
            {filterModule === 'all'
              ? 'Aucune activité enregistrée pour le moment'
              : 'Aucune activité dans cet espace'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Vos actions, créations d'objectifs et utilisations d'espaces s'afficheront automatiquement ici.
          </p>
          <div className="pt-2">
            <OreaButton variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Ajouter une entrée manuelle</span>
            </OreaButton>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="relative border-l-2 border-slate-200 ml-3 sm:ml-4 pl-6 space-y-6">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#0056d6] ring-4 ring-white" />

                <div className="bg-slate-50/80 hover:bg-slate-50 p-5 rounded-2xl border border-slate-200/70 transition-all space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-sm font-bold text-[#0f2347]">{act.title}</h4>
                      {getModuleBadge(act.module)}
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5 shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(act.createdAt)}
                    </span>
                  </div>

                  {act.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Manual Log Entry */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#0f2347]">Ajouter une entrée au journal</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Titre de l'action</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Séance de révision ou entraînement matinal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Espace associé</label>
                <select
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs bg-white"
                >
                  <option value="mon_orea">Mon OREA (Général)</option>
                  <option value="cycle">Mon Cycle</option>
                  <option value="sport">Sport & Workout</option>
                  <option value="nutrition">Nutrition & Terroir</option>
                  <option value="education">BAC G2 & Éloquence</option>
                  <option value="finance">Finance & Budget</option>
                  <option value="planner">OREA Planner</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Détails / Notes (optionnel)</label>
                <textarea
                  rows={3}
                  placeholder="Notes sur la séance, ressenti ou accomplissements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <OreaButton variant="primary" type="submit" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Ajouter au journal'}
                </OreaButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
