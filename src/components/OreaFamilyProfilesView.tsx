import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Edit2,
  Lock,
  Sparkles,
  ArrowLeft,
  Heart,
  Baby,
  User,
  Activity,
  Calendar,
  Pill,
} from 'lucide-react';
import { OreaUserProfile } from '../types';
import { OreaButton } from './common/OreaButton';

export interface FamilyMemberProfile {
  id: string;
  firstName: string;
  lastName: string;
  relation: 'conjoint' | 'enfant' | 'parent' | 'autre';
  age: number;
  gender: 'homme' | 'femme';
  bloodGroup?: string;
  allergies?: string[];
  medicationsCount?: number;
  activeHabitsCount?: number;
  isMain?: boolean;
}

interface OreaFamilyProfilesViewProps {
  userProfile: OreaUserProfile;
  activeMemberId: string;
  onSelectMember: (memberId: string) => void;
  onGoToPricing?: () => void;
}

export const OreaFamilyProfilesView: React.FC<OreaFamilyProfilesViewProps> = ({
  userProfile,
  activeMemberId,
  onSelectMember,
  onGoToPricing,
}) => {
  const isFamilyPlan = userProfile.plan === 'premium' || userProfile.plan === 'business' || userProfile.plan === 'pro';

  const [members, setMembers] = useState<FamilyMemberProfile[]>([
    {
      id: 'member-main',
      firstName: userProfile.firstName || 'Principal',
      lastName: userProfile.lastName || 'Titulaire',
      relation: 'conjoint',
      age: 32,
      gender: userProfile.gender === 'femme' ? 'femme' : 'homme',
      bloodGroup: 'O+',
      allergies: ['Aucune'],
      medicationsCount: 2,
      activeHabitsCount: 3,
      isMain: true,
    },
    {
      id: 'member-2',
      firstName: 'Amina',
      lastName: userProfile.lastName || 'Famille',
      relation: 'conjoint',
      age: 29,
      gender: 'femme',
      bloodGroup: 'A+',
      allergies: ['Pénicilline'],
      medicationsCount: 1,
      activeHabitsCount: 2,
    },
    {
      id: 'member-3',
      firstName: 'Kael',
      lastName: userProfile.lastName || 'Famille',
      relation: 'enfant',
      age: 6,
      gender: 'homme',
      bloodGroup: 'O+',
      allergies: ['Arachides'],
      medicationsCount: 0,
      activeHabitsCount: 1,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState(userProfile.lastName || '');
  const [newRelation, setNewRelation] = useState<FamilyMemberProfile['relation']>('enfant');
  const [newAge, setNewAge] = useState<number>(8);
  const [newGender, setNewGender] = useState<'homme' | 'femme'>('homme');
  const [newBloodGroup, setNewBloodGroup] = useState('O+');

  const maxMembers = isFamilyPlan ? 4 : 1;
  const canAdd = isFamilyPlan && members.length < maxMembers;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim()) return;

    const newMember: FamilyMemberProfile = {
      id: `member-${Date.now()}`,
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      relation: newRelation,
      age: newAge,
      gender: newGender,
      bloodGroup: newBloodGroup,
      medicationsCount: 0,
      activeHabitsCount: 0,
    };

    setMembers((prev) => [...prev, newMember]);
    setNewFirstName('');
    setIsAdding(false);
  };

  const handleDeleteMember = (id: string) => {
    if (id === 'member-main') return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (activeMemberId === id) {
      onSelectMember('member-main');
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Multi-Profils & Données Isolées OREA</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2F5B] tracking-tight">
              Profils Santé de la Famille
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Chaque membre bénéficie de son propre espace étanche : bilans, traitements et rappels individuels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3.5 py-2 rounded-2xl text-xs font-bold border ${isFamilyPlan ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
              {isFamilyPlan ? (
                <span>Plan Famille : {members.length} / 4 profils</span>
              ) : (
                <span>Plan Standard : 1 profil actif</span>
              )}
            </div>

            {canAdd ? (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#0056d6] hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Ajouter un membre</span>
              </button>
            ) : !isFamilyPlan ? (
              <button
                onClick={onGoToPricing}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#00A6C7] to-[#0056d6] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Débloquer jusqu’à 4 profils</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Modal / Form Add Member */}
        {isAdding && (
          <form
            onSubmit={handleAddMember}
            className="bg-white rounded-3xl p-6 border border-blue-200 shadow-lg space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Ajouter un profil familial</h3>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Annuler
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Prénom :</label>
                <input
                  type="text"
                  required
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  placeholder="ex: Kael, Mariam..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lien de parenté :</label>
                <select
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="enfant">Enfant</option>
                  <option value="conjoint">Conjoint(e)</option>
                  <option value="parent">Parent</option>
                  <option value="autre">Autre proche</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Âge (années) :</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={newAge}
                  onChange={(e) => setNewAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">Sexe :</span>
                <button
                  type="button"
                  onClick={() => setNewGender('homme')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border ${newGender === 'homme' ? 'bg-[#0B2F5B] text-white' : 'bg-slate-50 text-slate-700'}`}
                >
                  Homme
                </button>
                <button
                  type="button"
                  onClick={() => setNewGender('femme')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border ${newGender === 'femme' ? 'bg-[#0B2F5B] text-white' : 'bg-slate-50 text-slate-700'}`}
                >
                  Femme
                </button>
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Créer le profil
              </button>
            </div>
          </form>
        )}

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {members.map((member) => {
            const isActive = activeMemberId === member.id;
            return (
              <div
                key={member.id}
                className={`bg-white rounded-3xl p-6 border transition-all shadow-xs flex flex-col justify-between space-y-4 ${
                  isActive ? 'border-[#0056d6] ring-2 ring-blue-200 bg-blue-50/10' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm ${isActive ? 'bg-[#0056d6] text-white shadow-xs' : 'bg-slate-100 text-slate-700'}`}>
                      {member.relation === 'enfant' ? <Baby className="w-6 h-6" /> : <User className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-slate-900">
                          {member.firstName} {member.lastName}
                        </h4>
                        {member.isMain && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#0056d6] text-[10px] font-bold">
                            Titulaire
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        {member.relation.toUpperCase()} • {member.age} ans • Groupe {member.bloodGroup || 'O+'}
                      </div>
                    </div>
                  </div>

                  {!member.isMain && (
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Supprimer ce profil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sub data stats */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 text-slate-700 font-medium">
                    <Pill className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{member.medicationsCount || 0} traitement(s)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 text-slate-700 font-medium">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{member.activeHabitsCount || 0} habitude(s)</span>
                  </div>
                </div>

                {/* Switch Active Member Button */}
                <div className="pt-2">
                  <button
                    onClick={() => onSelectMember(member.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isActive
                        ? 'bg-[#0B2F5B] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#7de3f8]" />
                        <span>Profil actif actuel</span>
                      </>
                    ) : (
                      <span>Basculer sur ce profil</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Strict Separation Guarantee */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-indigo-950">Garantie d'étanchéité OREA Famille : </span>
            Chaque profil dispose d'un identifiant unique garantissant la non-contamination des historiques médicaux, des posologies médicamenteuses et des bilans PDF générés.
          </div>
        </div>

      </div>
    </div>
  );
};

export default OreaFamilyProfilesView;
