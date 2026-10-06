import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  UserPlus,
  Shield,
  Briefcase,
  BarChart3,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  GraduationCap,
  Key,
} from 'lucide-react';
import { OreaUserProfile, BusinessOrganization } from '../../types';
import { hasFeature } from '../../services/subscription/featureAccess';

interface BusinessOrgManagerProps {
  currentUserProfile: OreaUserProfile;
  onGoToPricing: () => void;
}

export const BusinessOrgManager: React.FC<BusinessOrgManagerProps> = ({
  currentUserProfile,
  onGoToPricing,
}) => {
  const canAccessBusiness = hasFeature(currentUserProfile, 'business_organization');
  const [org, setOrg] = useState<BusinessOrganization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Creation form
  const [isCreating, setIsCreating] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<BusinessOrganization['orgType']>('ecole');
  const [maxSeats, setMaxSeats] = useState(50);

  // Add member form
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState<'student' | 'employee' | 'manager'>('student');

  useEffect(() => {
    async function loadOrg() {
      if (!currentUserProfile?.uid) return;
      setIsLoading(true);
      try {
        const resp = await fetch(`/api/business/organization/${currentUserProfile.uid}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.success && data.organization) {
            setOrg(data.organization);
          }
        }
      } catch (e) {
        console.warn('Erreur chargement org business:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrg();
  }, [currentUserProfile?.uid]);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;

    try {
      const resp = await fetch('/api/business/organization/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminUid: currentUserProfile.uid,
          adminEmail: currentUserProfile.email || 'admin@organisation.com',
          name: orgName.trim(),
          orgType,
          maxSeats: Number(maxSeats) || 50,
        }),
      });

      const data = await resp.json();
      if (data.success && data.organization) {
        setOrg(data.organization);
        setIsCreating(false);
      }
    } catch (e) {
      console.warn('Erreur création organisation:', e);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberEmail.trim() || !memberName.trim()) return;

    try {
      const resp = await fetch(`/api/business/organization/${currentUserProfile.uid}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: memberEmail.trim(),
          name: memberName.trim(),
          role: memberRole,
        }),
      });

      const data = await resp.json();
      if (data.success && data.organization) {
        setOrg(data.organization);
        setMemberEmail('');
        setMemberName('');
        setIsAddingMember(false);
      }
    } catch (e) {
      console.warn('Erreur ajout membre:', e);
    }
  };

  if (!canAccessBusiness) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cfe2f5] shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#0B2F5B]">Espace Business & Établissements</h3>
            <p className="text-xs text-slate-500">Pour écoles, universités, cabinets et entreprises</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <Building2 className="w-8 h-8 text-slate-700 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            Déployez OREA à l'échelle de votre organisation
          </h4>
          <p className="text-xs text-slate-600 max-w-lg mx-auto mb-4 leading-relaxed">
            Profitez de parcours personnalisés (BAC G2 pour classes entières, bien-être au travail),
            d'une facturation groupée par convention, et d'un tableau de bord de supervision pédagogique et managérial.
          </p>
          <button
            onClick={onGoToPricing}
            className="px-5 py-2.5 rounded-xl bg-[#0B2F5B] hover:bg-[#08203e] text-white font-bold text-xs cursor-pointer shadow-xs inline-flex items-center gap-2"
          >
            <span>Découvrir l'offre OREA Business</span>
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
          <div className="w-10 h-10 rounded-xl bg-[#0B2F5B] text-amber-400 flex items-center justify-center shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-[#0B2F5B]">Tableau de Bord Administrateur Business</h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Licence Organisation
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Supervision des comptes étudiants, parcours de révision et facturation groupée.
            </p>
          </div>
        </div>

        {org && !isAddingMember && (
          <button
            onClick={() => setIsAddingMember(true)}
            className="px-4 py-2 rounded-xl bg-[#0B2F5B] hover:bg-[#08203e] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Ajouter un membre</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-xs text-slate-400">
          Chargement de l'organisation...
        </div>
      ) : !org ? (
        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800 mb-1">Aucune organisation configurée</h4>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
            Créez votre établissement ou entreprise pour attribuer des accès groupés.
          </p>

          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="px-5 py-2.5 rounded-xl bg-[#0B2F5B] text-white text-xs font-bold hover:bg-[#08203e] cursor-pointer"
            >
              Initialiser mon organisation
            </button>
          ) : (
            <form onSubmit={handleCreateOrg} className="max-w-md mx-auto p-5 bg-white rounded-2xl border border-slate-200 text-left space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nom de l'organisation</label>
                <input
                  type="text"
                  placeholder="Ex: Lycée Technique Bernard, Cabinet Audit..."
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Type d'entité</label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                >
                  <option value="ecole">Lycée / Établissement scolaire</option>
                  <option value="universite">Université / Grande École</option>
                  <option value="entreprise">Entreprise / PME</option>
                  <option value="institution">Cabinet de conseil / Institution</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre d'utilisateurs prévus</label>
                <input
                  type="number"
                  value={maxSeats}
                  onChange={(e) => setMaxSeats(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#0B2F5B] text-white text-xs font-bold"
                >
                  Créer l'organisation
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Org overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Organisation</span>
              <span className="text-base font-black text-[#0B2F5B]">{org.name}</span>
              <span className="text-[11px] text-slate-500 block capitalize mt-0.5">
                {org.orgType.replace('_', ' ')}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Membres inscrits</span>
              <span className="text-base font-black text-[#0B2F5B]">
                {org.membersCount} / {org.maxSeats}
              </span>
              <span className="text-[11px] text-emerald-600 block font-bold mt-0.5">Actifs</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Parcours attribués</span>
              <span className="text-base font-black text-[#0B2F5B]">{org.customPathways?.length || 3}</span>
              <span className="text-[11px] text-indigo-600 block font-bold mt-0.5">BAC G2 & Audit</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">Facturation</span>
              <span className="text-base font-black text-[#0B2F5B]">Groupée</span>
              <span className="text-[11px] text-slate-500 block capitalize mt-0.5">Convention annuelle</span>
            </div>
          </div>

          {/* Add member form modal */}
          {isAddingMember && (
            <form onSubmit={handleAddMember} className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#0B2F5B] uppercase tracking-wider">
                  Ajouter un bénéficiaire / étudiant
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Annuler
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Nom et prénom"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  required
                  className="px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                />
                <input
                  type="email"
                  placeholder="Email de l'apprenant"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                  className="px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                />
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value as any)}
                  className="px-3 py-2 text-xs rounded-xl bg-white border border-slate-200"
                >
                  <option value="student">Étudiant / Apprenant</option>
                  <option value="employee">Collaborateur</option>
                  <option value="manager">Responsable pédagogique</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#0B2F5B] text-white text-xs font-bold"
                >
                  Activer l'accès
                </button>
              </div>
            </form>
          )}

          {/* Members list */}
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
              Membres et apprenants de l'organisation
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Nom</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Rôle</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3">Accès accordé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {org.members.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="p-3 font-bold text-slate-800">{m.name}</td>
                      <td className="p-3 text-slate-600">{m.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                          {m.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Actif</span>
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">
                        {m.role === 'admin' ? 'Superviseur' : 'BAC G2 + Tous forfaits'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
