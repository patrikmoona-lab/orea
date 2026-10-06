import React, { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle2, Clock, Trash2, Sparkles, Filter, Edit2, RotateCcw, AlertCircle } from 'lucide-react';
import { OreaButton } from '../common/OreaButton';
import {
  fetchUserObjectives,
  saveUserObjective,
  updateUserObjective,
  deleteUserObjective,
  OreaObjectiveDoc,
  logUserActivity,
} from '../../lib/firebase';
import { NavSection } from '../../types';

interface OreaObjectivesTabProps {
  userId: string;
  onNavigate?: (section: NavSection) => void;
}

export const OreaObjectivesTab: React.FC<OreaObjectivesTabProps> = ({ userId, onNavigate }) => {
  const [objectives, setObjectives] = useState<OreaObjectiveDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterModule, setFilterModule] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<OreaObjectiveDoc | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formModule, setFormModule] = useState('cycle');
  const [formTargetDate, setFormTargetDate] = useState('');
  const [formProgress, setFormProgress] = useState(0);
  const [formStatus, setFormStatus] = useState<'en_cours' | 'termine'>('en_cours');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    loadObjectives();
  }, [userId]);

  const loadObjectives = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserObjectives(userId);
      setObjectives(data);
    } catch (err: any) {
      console.error('Error loading objectives:', err);
      setError('Impossible de charger vos objectifs. Veuillez vérifier votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingObjective(null);
    setFormTitle('');
    setFormModule('cycle');
    setFormTargetDate('');
    setFormProgress(0);
    setFormStatus('en_cours');
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (obj: OreaObjectiveDoc) => {
    setEditingObjective(obj);
    setFormTitle(obj.title);
    setFormModule(obj.module);
    setFormTargetDate(obj.targetDate || '');
    setFormProgress(obj.progress || 0);
    setFormStatus(obj.status || 'en_cours');
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !userId) return;

    setSaving(true);
    try {
      const computedStatus = formProgress >= 100 ? 'termine' : formStatus;

      if (editingObjective) {
        // Update
        await updateUserObjective(userId, editingObjective.id, {
          title: formTitle.trim(),
          module: formModule,
          progress: Number(formProgress),
          targetDate: formTargetDate || undefined,
          status: computedStatus,
        });

        await logUserActivity(userId, {
          title: 'Objectif mis à jour',
          description: `Objectif: ${formTitle.trim()} (${formProgress}%)`,
          module: formModule,
          type: 'objectif_mis_a_jour',
        });

        setObjectives((prev) =>
          prev.map((o) =>
            o.id === editingObjective.id
              ? {
                  ...o,
                  title: formTitle.trim(),
                  module: formModule,
                  progress: Number(formProgress),
                  targetDate: formTargetDate || undefined,
                  status: computedStatus,
                }
              : o
          )
        );
      } else {
        // Create
        const newObj = await saveUserObjective(userId, {
          title: formTitle.trim(),
          module: formModule,
          progress: Number(formProgress),
          targetDate: formTargetDate || undefined,
          status: computedStatus,
        });

        await logUserActivity(userId, {
          title: 'Nouvel objectif créé',
          description: `Objectif: ${formTitle.trim()} (${formModule})`,
          module: formModule,
          type: 'objectif_mis_a_jour',
        });

        setObjectives((prev) => [newObj, ...prev]);
      }

      setIsCreateModalOpen(false);
    } catch (err: any) {
      console.error('Error saving objective:', err);
      alert('Erreur lors de l’enregistrement de l’objectif.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComplete = async (obj: OreaObjectiveDoc) => {
    if (!userId) return;
    const isCompleted = obj.progress >= 100;
    const newProgress = isCompleted ? 0 : 100;
    const newStatus = isCompleted ? 'en_cours' : 'termine';

    try {
      await updateUserObjective(userId, obj.id, {
        progress: newProgress,
        status: newStatus,
      });

      setObjectives((prev) =>
        prev.map((o) =>
          o.id === obj.id ? { ...o, progress: newProgress, status: newStatus } : o
        )
      );

      await logUserActivity(userId, {
        title: isCompleted ? 'Objectif réouvert' : 'Objectif accompli !',
        description: `Objectif: ${obj.title}`,
        module: obj.module,
        type: 'objectif_mis_a_jour',
      });
    } catch (err) {
      console.error('Error toggling objective:', err);
    }
  };

  const handleDelete = async (id: string, titleStr: string, modStr: string) => {
    if (!userId) return;
    if (!window.confirm(`Supprimer l'objectif "${titleStr}" ?`)) return;

    try {
      await deleteUserObjective(userId, id);
      setObjectives((prev) => prev.filter((o) => o.id !== id));
      await logUserActivity(userId, {
        title: 'Objectif supprimé',
        description: `Objectif: ${titleStr}`,
        module: modStr || 'mon_orea',
        type: 'autre',
      });
    } catch (err) {
      console.error('Error deleting objective:', err);
    }
  };

  const filteredObjectives = objectives.filter(
    (o) => filterModule === 'all' || o.module === filterModule
  );

  const getModuleBadge = (mod: string) => {
    switch (mod) {
      case 'cycle':
        return <span className="px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700 text-[11px] font-bold border border-pink-200">Mon Cycle</span>;
      case 'sport':
        return <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-[11px] font-bold border border-orange-200">Sport & Workout</span>;
      case 'nutrition':
        return <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">Nutrition & Terroir</span>;
      case 'education':
        return <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200">BAC G2 & Éloquence</span>;
      case 'finance':
        return <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">Finance & Budget</span>;
      case 'planner':
        return <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">OREA Planner</span>;
      default:
        return <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">{mod}</span>;
    }
  };

  const modulesList = [
    { id: 'all', label: 'Tous' },
    { id: 'cycle', label: 'Mon Cycle' },
    { id: 'sport', label: 'Sport' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'education', label: 'BAC G2' },
    { id: 'finance', label: 'Finance' },
    { id: 'planner', label: 'Planner' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-[#0f2347] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
              <Target className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
              MON SUIVI OREA
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Mes Objectifs Personnels</h2>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
            Définissez, mesurez et atteignez vos jalons concrets à travers vos 6 espaces de vie.
          </p>
        </div>

        <OreaButton
          variant="primary"
          onClick={handleOpenCreateModal}
          className="shrink-0 flex items-center gap-2 shadow-lg py-3 px-5"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel objectif</span>
        </OreaButton>
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

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadObjectives}
            className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Objectives List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200/80">
          <Sparkles className="w-8 h-8 text-blue-500 mx-auto animate-spin mb-3" />
          <p className="text-xs font-medium">Chargement de vos objectifs depuis Firestore...</p>
        </div>
      ) : filteredObjectives.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0f2347]">
            {filterModule === 'all'
              ? 'Aucun objectif pour le moment'
              : 'Aucun objectif pour cet espace'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Fixez un premier objectif concret pour mesurer votre progression au quotidien.
          </p>
          <div className="pt-2">
            <OreaButton variant="primary" size="sm" onClick={handleOpenCreateModal}>
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Créer un objectif</span>
            </OreaButton>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredObjectives.map((obj) => {
            const isDone = obj.progress >= 100 || obj.status === 'termine';
            return (
              <div
                key={obj.id}
                className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between space-y-4 ${
                  isDone
                    ? 'border-emerald-200/80 bg-emerald-50/20'
                    : 'border-slate-200/80 shadow-2xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {getModuleBadge(obj.module)}
                    <button
                      onClick={() => handleToggleComplete(obj)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Terminé (100%)</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>En cours ({obj.progress}%)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className={`text-base font-bold ${isDone ? 'line-through text-slate-400' : 'text-[#0f2347]'}`}>
                    {obj.title}
                  </h3>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 my-3.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Avancement</span>
                      <span className="text-[#0056d6] font-bold">{obj.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDone
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-blue-500 to-[#0056d6]'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, obj.progress))}%` }}
                      />
                    </div>
                  </div>

                  {obj.targetDate && (
                    <p className="text-xs text-slate-400">
                      Échéance: <span className="font-semibold text-slate-700">{obj.targetDate}</span>
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {obj.createdAt ? new Date(obj.createdAt).toLocaleDateString('fr-FR') : ''}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(obj)}
                      className="p-2 rounded-xl text-slate-500 hover:text-[#0056d6] hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Modifier l'objectif"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(obj.id, obj.title, obj.module)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Supprimer l'objectif"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Create / Edit Objective */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#0f2347]">
                {editingObjective ? 'Modifier l’objectif' : 'Créer un nouvel objectif'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Intitulé de l'objectif</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Réviser 5 chapitres de SYSCOHADA"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Espace OREA associé</label>
                <select
                  value={formModule}
                  onChange={(e) => setFormModule(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs bg-white"
                >
                  <option value="cycle">Mon Cycle</option>
                  <option value="sport">Sport & Workout</option>
                  <option value="nutrition">Nutrition & Terroir</option>
                  <option value="education">BAC G2 & Éloquence</option>
                  <option value="finance">Finance & Budget</option>
                  <option value="planner">OREA Planner</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Progression</label>
                    <span className="font-bold text-[#0056d6]">{formProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formProgress}
                    onChange={(e) => setFormProgress(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Échéance (optionnel)</label>
                  <input
                    type="date"
                    value={formTargetDate}
                    onChange={(e) => setFormTargetDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <OreaButton variant="primary" type="submit" disabled={saving}>
                  {saving ? 'Enregistrement...' : editingObjective ? 'Mettre à jour' : 'Créer l’objectif'}
                </OreaButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
