import React, { useState } from 'react';
import { User, Edit3, Save, Check, ShieldCheck } from 'lucide-react';
import { OreaUserProfile } from '../../types';
import { OreaButton } from '../common/OreaButton';
import { updateUserProfileDetails } from '../../lib/firebase';

interface OreaProfileTabProps {
  userProfile: OreaUserProfile;
  reloadProfile: () => void;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  whatsapp: string;
  country: string;
  gender: 'homme' | 'femme' | 'autre' | 'non-specifie';
  language: string;
}

export const OreaProfileTab: React.FC<OreaProfileTabProps> = ({ userProfile, reloadProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    whatsapp: userProfile?.whatsapp || '',
    country: userProfile?.country || 'Congo',
    gender: (userProfile?.gender as any) || 'non-specifie',
    language: userProfile?.language || 'Français',
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.uid) return;

    setSaving(true);
    setSuccessMsg('');

    try {
      const displayName = `${formData.firstName} ${formData.lastName}`.trim();
      await updateUserProfileDetails(userProfile.uid, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        displayName,
        whatsapp: formData.whatsapp.trim(),
        country: formData.country.trim(),
        gender: formData.gender as 'homme' | 'femme' | 'autre' | 'non-specifie',
        language: formData.language.trim(),
      });

      await reloadProfile();
      setSuccessMsg('Profil mis à jour avec succès dans Firestore.');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-[#0f2347] to-slate-900 text-white p-6 rounded-3xl shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
              <User className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
              GESTION DU COMPTE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Mon Profil Personnel</h2>
          <p className="text-xs text-blue-200 mt-1">
            Mettez à jour vos informations personnelles synchronisées en temps réel.
          </p>
        </div>

        {!isEditing && (
          <OreaButton
            variant="primary"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Modifier le profil</span>
          </OreaButton>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Form / View */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Prénom</label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              ) : (
                <p className="text-xs font-semibold text-[#0f2347] bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {userProfile?.firstName || 'Non renseigné'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nom de famille</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              ) : (
                <p className="text-xs font-semibold text-[#0f2347] bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {userProfile?.lastName || 'Non renseigné'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Adresse Email</label>
              <p className="text-xs font-semibold text-slate-500 bg-slate-100 p-3 rounded-xl border border-slate-200 cursor-not-allowed">
                {userProfile?.email || 'Visiteur'} (Compte vérifié)
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Numéro WhatsApp</label>
              {isEditing ? (
                <input
                  type="tel"
                  placeholder="+242 06 ... / +241 ..."
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              ) : (
                <p className="text-xs font-semibold text-[#0f2347] bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {userProfile?.whatsapp || 'Non renseigné'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pays de résidence</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              ) : (
                <p className="text-xs font-semibold text-[#0f2347] bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {userProfile?.country || 'Congo'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Genre</label>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="non-specifie">Non spécifié</option>
                </select>
              ) : (
                <p className="text-xs font-semibold text-[#0f2347] bg-slate-50 p-3 rounded-xl border border-slate-100 capitalize">
                  {userProfile?.gender || 'Non spécifié'}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Annuler
              </button>
              <OreaButton variant="primary" type="submit" disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
              </OreaButton>
            </div>
          )}
        </form>

        <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Identifiant Firestore unique (UID): <code className="font-mono text-[#0056d6] font-bold">{userProfile?.uid}</code>
          </span>
        </div>
      </div>
    </div>
  );
};
