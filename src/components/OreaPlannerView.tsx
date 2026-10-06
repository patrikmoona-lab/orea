import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  Sun,
  Moon,
  Coffee,
  BookOpen,
  Dumbbell,
  Sliders,
  Edit3
} from 'lucide-react';
import { DEFAULT_PLANNER_BLOCKS } from '../data';
import { PlannerBlock, OreaUserProfile } from '../types';
import { hasFeature } from '../services/subscription/featureAccess';
import { LockedFeatureView } from './subscription/LockedFeatureView';
import { ModuleOnboardingWizard } from './onboarding/ModuleOnboardingWizard';
import { PLANNER_QUESTIONS } from '../data/modulesOnboardingData';
import { OreaModuleAIWidget } from './common/OreaModuleAIWidget';
import {
  isModuleConfigured,
  getModuleProfile,
  saveModuleProfile,
  clearModuleProfile,
} from '../utils/oreaProfileStorage';
import { useAuth } from '../context/AuthContext';
import { fetchFirestoreModule } from '../lib/firebase';

interface OreaPlannerViewProps {
  currentUserProfile?: OreaUserProfile | null;
  onGoToPricing?: () => void;
  onBackToHome: () => void;
}

export const OreaPlannerView: React.FC<OreaPlannerViewProps> = ({
  currentUserProfile,
  onGoToPricing,
  onBackToHome,
}) => {
  const { currentUser, authLoading } = useAuth();
  const [isConfigured, setIsConfigured] = useState<boolean>(() => {
    return isModuleConfigured('planner');
  });
  const [dbLoading, setDbLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkConfig() {
      if (authLoading) return;
      if (!currentUser) {
        setDbLoading(false);
        return;
      }
      try {
        const docSnap = await fetchFirestoreModule(currentUser.uid, 'planner');
        if (docSnap && docSnap.enabled) {
          const pseudo = docSnap.data?.pseudo || docSnap.data?.name || docSnap.data?.prenom || 'Membre OREA';
          const profile = {
            id: 'profile-planner-firestore',
            module: 'planner',
            name: pseudo,
            answers: docSnap.data || {},
            createdAt: docSnap.createdAt,
            updatedAt: docSnap.updatedAt,
          };
          localStorage.setItem('orea_profile_planner', JSON.stringify(profile));
          localStorage.setItem('orea_configured_planner', 'true');
          setIsConfigured(true);
        } else {
          localStorage.removeItem('orea_profile_planner');
          localStorage.removeItem('orea_configured_planner');
          setIsConfigured(false);
        }
      } catch (err) {
        console.warn("[OreaPlannerView] Firestore check error:", err);
        setIsConfigured(isModuleConfigured('planner'));
      } finally {
        setDbLoading(false);
      }
    }
    checkConfig();
  }, [currentUser, authLoading]);

  const moduleProfile = useMemo(() => getModuleProfile('planner'), [isConfigured]);

  // Always unlocked for free exploration
  const canAccessPlanner = true;

  const [blocks, setBlocks] = useState<PlannerBlock[]>(DEFAULT_PLANNER_BLOCKS);
  const [newSlot, setNewSlot] = useState('15:00');
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState<PlannerBlock['domain']>('autre');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (authLoading || dbLoading) {
    return (
      <div className="min-h-screen bg-[#f8fbfe] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 animate-pulse">
          <Clock className="w-6 h-6 animate-spin text-blue-600" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Vérification de votre espace OREA...</p>
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <ModuleOnboardingWizard
        moduleId="planner"
        moduleTitle="OREA Planner & Rythme"
        moduleSubtitle="Planification quotidienne 07h00 - 21h00 & Habitudes"
        moduleIcon={<Clock className="w-8 h-8 text-blue-600" />}
        accentColor="blue"
        questions={PLANNER_QUESTIONS}
        onComplete={(answers) => {
          saveModuleProfile('planner', answers);
          setIsConfigured(true);
        }}
        onCancel={onBackToHome}
      />
    );
  }

  if (!canAccessPlanner) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="bg-white border-b border-[#cfe2f5] sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0056d6] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </button>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Planner Dynamique • OREA Plus
            </span>
          </div>
        </div>

        <LockedFeatureView
          feature="dynamic_planner"
          onGoToPricing={onGoToPricing || onBackToHome}
          onBackToHome={onBackToHome}
        />
      </div>
    );
  }

  const toggleBlock = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, completed: !b.completed } : b))
    );
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const block: PlannerBlock = {
      id: `p-${Date.now()}`,
      timeSlot: newSlot,
      title: newTitle.trim(),
      domain: newDomain,
      durationMinutes: 30,
      isPriority: false,
      completed: false,
    };
    const sorted = [...blocks, block].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
    setBlocks(sorted);
    setNewTitle('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const completedCount = blocks.filter((b) => b.completed).length;

  return (
    <div className="min-h-screen bg-[#f8fbfe] pb-16">
      {/* Header */}
      <div className="bg-white border-b border-[#e2eaf4] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl text-slate-500 hover:text-[#0056d6] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0056d6]">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#0f2347] flex items-center gap-2">
                  <span>OREA Planner</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-[#0056d6] font-semibold">
                    07h00 - 21h00
                  </span>
                </h1>
                <p className="text-xs text-slate-500">
                  Bonjour {moduleProfile?.name || 'Membre OREA'} — Votre journée rythmée avec équilibre.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsConfigured(false);
              }}
              className="px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Modifier mes préférences du planning"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Modifier mon profil</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0056d6] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un créneau</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Progress header */}
        <div className="bg-white p-6 rounded-3xl border border-[#e2eaf4] shadow-xs mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0f2347]">Objectifs de la journée</h2>
            <p className="text-xs text-slate-500">
              {completedCount} sur {blocks.length} créneaux accomplis aujourd'hui
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-extrabold text-[#0056d6]">
              {Math.round((completedCount / (blocks.length || 1)) * 100)}%
            </div>
          </div>
        </div>

        {/* Timeline of blocks */}
        <div className="space-y-4 mb-8">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={`p-5 rounded-3xl border transition-all flex items-center justify-between gap-4 ${
                block.completed
                  ? 'bg-emerald-50/40 border-emerald-200 opacity-80'
                  : 'bg-white border-[#e2eaf4] shadow-xs hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleBlock(block.id)}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                    block.completed
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 hover:border-[#0056d6]'
                  }`}
                >
                  {block.completed && <CheckCircle2 className="w-5 h-5" />}
                </button>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {block.timeSlot}
                    </span>
                    {block.isPriority && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-700">
                        Priorité
                      </span>
                    )}
                  </div>
                  <h3 className={`text-sm font-bold ${block.completed ? 'line-through text-slate-400' : 'text-[#0f2347]'}`}>
                    {block.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => handleDelete(block.id)}
                className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-[#0f2347] mb-4">Ajouter un créneau OREA</h3>
            <form onSubmit={handleAddBlock} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Heure du créneau</label>
                <input
                  type="time"
                  required
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Intitulé de l'activité</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Révision Mathématiques BAC G2"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0056d6] text-white font-bold"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <OreaModuleAIWidget moduleId="planner" moduleTitle="Planner & Rythme" currentUserProfile={currentUserProfile} />
    </div>
  );
};
