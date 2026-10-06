import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  CheckCircle2,
  Lock,
  Trash2,
  Edit2,
  ArrowRight,
  Shield,
  Heart,
  Calendar,
  Activity,
  Award,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { OreaUserProfile, FamilyProfile } from '../../types';
import { hasFeature } from '../../services/subscription/featureAccess';

interface FamilyProfilesManagerProps {
  currentUserProfile: OreaUserProfile;
  activeProfileId?: string;
  onSelectActiveProfile?: (profile: FamilyProfile) => void;
  onGoToPricing: () => void;
}

const AVATAR_COLORS = ['#0056d6', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0284c7'];

export const FamilyProfilesManager: React.FC<FamilyProfilesManagerProps> = ({
  currentUserProfile,
  activeProfileId,
  onSelectActiveProfile,
  onGoToPricing,
}) => {
  const canAccessFamily = hasFeature(currentUserProfile, 'family_profiles');
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<FamilyProfile['relationship']>('enfant');
  const [age, setAge] = useState<number | ''>('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [errorMessage, setErrorMessage] = useState('');

  // Load profiles from backend
  useEffect(() => {
    async function load() {
      if (!currentUserProfile?.uid) return;
      setIsLoading(true);
      try {
        const resp = await fetch(`/api/family-profiles/${currentUserProfile.uid}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.success && Array.isArray(data.profiles)) {
            setProfiles(data.profiles);
          }
        }
      } catch (err) {
        console.warn('Erreur chargement profils familiaux:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [currentUserProfile?.uid]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setErrorMessage('');

    try {
      const resp = await fetch(`/api/family-profiles/${currentUserProfile.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          relationship,
          age: age ? Number(age) : null,
          avatarColor,
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        setErrorMessage(data.error || 'Erreur lors de la création');
        return;
      }

      setProfiles(data.profiles || []);
      setName('');
      setAge('');
      setIsAdding(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur réseau');
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce profil familial ?')) return;
    try {
      const resp = await fetch(`/api/family-profiles/${currentUserProfile.uid}/${profileId}`, {
        method: 'DELETE',
      });
      const data = await resp.json();
      if (data.success) {
        setProfiles(data.profiles || []);
      }
    } catch (err) {
      console.warn('Erreur suppression profil:', err);
    }
  };

  if (!canAccessFamily) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cfe2f5] shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#0B2F5B]">Profils Familiaux (Jusqu'à 4 profils)</h3>
            <p className="text-xs text-slate-500">Fonctionnalité exclusive OREA Pro</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 text-center">
          <Lock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-purple-950 mb-1">
            Partagez OREA avec vos proches en toute indépendance
          </h4>
          <p className="text-xs text-purple-800 max-w-md mx-auto mb-4 leading-relaxed">
            Chaque membre de votre foyer (conjoint, enfants, parents) bénéficie de ses propres habitudes,
            son agenda médical, ses données sportives, son suivi nutritionnel et sa progression éducative.
          </p>
          <button
            onClick={onGoToPricing}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs inline-flex items-center gap-2"
          >
            <span>Passer à OREA Pro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cfe2f5] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-[#0B2F5B]">Espace Multi-Profils Familial</h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                {profiles.length} / 4 profils
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Chaque profil dispose de ses propres habitudes, nutrition, agenda et progression distincts.
            </p>
          </div>
        </div>

        {profiles.length < 4 && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Ajouter un profil</span>
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200">
          {errorMessage}
        </div>
      )}

      {/* Add profile form */}
      {isAdding && (
        <form onSubmit={handleCreateProfile} className="mb-6 p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-[#0B2F5B] uppercase tracking-wider">
              Nouveau profil familial
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Annuler
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Prénom ou Nom</label>
              <input
                type="text"
                placeholder="Ex: Sophie, Papa, Junior..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Lien de parenté</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="conjoint">Conjoint(e)</option>
                <option value="enfant">Enfant / Adolescent</option>
                <option value="parent">Parent</option>
                <option value="autre">Autre proche</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Âge (optionnel)</label>
              <input
                type="number"
                placeholder="Ex: 14"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1.5">Couleur d'avatar</label>
            <div className="flex items-center gap-2">
              {AVATAR_COLORS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setAvatarColor(col)}
                  style={{ backgroundColor: col }}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    avatarColor === col ? 'ring-2 ring-offset-2 ring-purple-600 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer shadow-xs"
            >
              Enregistrer le profil
            </button>
          </div>
        </form>
      )}

      {/* Profiles list */}
      {isLoading ? (
        <div className="text-center py-6 text-xs text-slate-400">
          Chargement des profils familiaux...
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
          <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="font-bold text-slate-700">Aucun profil secondaire créé</p>
          <p className="mt-0.5 max-w-sm mx-auto">
            Vous pouvez créer jusqu'à 4 profils familiaux distincts avec votre abonnement OREA Pro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((p) => {
            const isActive = activeProfileId === p.id;
            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-purple-50/50 border-purple-500 shadow-xs ring-1 ring-purple-500'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs"
                      style={{ backgroundColor: p.avatarColor || '#7c3aed' }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0B2F5B] flex items-center gap-2">
                        <span>{p.name}</span>
                        {isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">
                            Actif
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 capitalize">
                        {p.relationship} {p.age ? `• ${p.age} ans` : ''}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProfile(p.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                    title="Supprimer le profil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-[11px] text-slate-600 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>{p.habits?.length || 0} habitudes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Sport & Bien-être</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Progression</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onSelectActiveProfile?.(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-purple-200 text-purple-900 cursor-default'
                        : 'bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800'
                    }`}
                  >
                    {isActive ? 'Profil en cours d’utilisation' : 'Basculer sur ce profil'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
