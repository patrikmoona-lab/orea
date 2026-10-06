import React, { useState, useEffect } from 'react';
import { X, User, Bell, MapPin, Shield, Check, Trash2, Heart } from 'lucide-react';
import { UserProfile } from '../types';
import { OREASymbol } from './OREALogo';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  firstName: 'Camille',
  lastName: 'Dupont',
  birthDate: '1988-05-14',
  city: 'Paris',
  country: 'France',
  notificationsEnabled: true,
  emergencyContact: {
    name: 'Thomas Dupont',
    relation: 'Conjoint',
    phone: '06 12 34 56 78',
  },
};

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('orea_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PROFILE;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  useEffect(() => {
    if (savedSuccess) {
      const timer = setTimeout(() => setSavedSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [savedSuccess]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('orea_user_profile', JSON.stringify(profile));
      setSavedSuccess(true);
    } catch {
      // ignore
    }
  };

  const handleClearData = () => {
    try {
      localStorage.removeItem('orea_med_reminders');
      localStorage.removeItem('orea_agenda_events');
      localStorage.removeItem('orea_user_profile');
      setProfile(DEFAULT_PROFILE);
      setConfirmingReset(false);
      setSavedSuccess(true);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#dbeaf8] p-6 sm:p-8 max-w-xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0f4f9] mb-5">
          <div className="flex items-center gap-3">
            <OREASymbol className="w-10 h-10 shrink-0" />
            <div>
              <h3 className="text-xl font-extrabold text-[#0f2347]">Mon profil OREA</h3>
              <p className="text-xs text-[#64748b]">Préférences personnelles & confidentialité locale</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Vos informations ont été enregistrées avec succès sur votre appareil.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#0f2347] mb-1">Prénom</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0f2347] mb-1">Nom</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f2347] mb-1">Date de naissance</label>
            <input
              type="date"
              value={profile.birthDate}
              onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#0f2347] mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Ville de résidence</span>
              </label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0f2347] mb-1">Pays</label>
              <input
                type="text"
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#cfe2f5] text-sm text-[#0f2347] focus:border-[#2563eb] outline-none"
              />
            </div>
          </div>

          {/* Contact d'urgence (optionnel) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-[#0f2347] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Contact d'urgence (optionnel)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <input
                  type="text"
                  placeholder="Nom & prénom"
                  value={profile.emergencyContact?.name || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      emergencyContact: {
                        ...(profile.emergencyContact || { relation: '', phone: '' }),
                        name: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-[#0f2347] bg-white outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Lien (ex: conjoint)"
                  value={profile.emergencyContact?.relation || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      emergencyContact: {
                        ...(profile.emergencyContact || { name: '', phone: '' }),
                        relation: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-[#0f2347] bg-white outline-none"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={profile.emergencyContact?.phone || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      emergencyContact: {
                        ...(profile.emergencyContact || { name: '', relation: '' }),
                        phone: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-[#0f2347] bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#dce9f6] bg-[#f8fbfe]">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#2563eb]" />
              <div>
                <span className="text-xs font-bold text-[#0f2347] block">Alertes & Rappels de santé</span>
                <span className="text-[11px] text-[#64748b]">
                  Activer les alertes de rendez-vous et prises de médicaments
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={profile.notificationsEnabled}
              onChange={(e) => setProfile({ ...profile, notificationsEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-[#2563eb]"
            />
          </div>

          {/* Privacy note */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Confidentialité garantie :</strong> Vos données de profil et vos rappels sont conservés localement sur votre navigateur. OREA ne collecte aucune donnée médicale sensible.
            </p>
          </div>

          {/* Submit & Reset actions */}
          <div className="pt-4 border-t border-[#f0f4f9] flex flex-col sm:flex-row items-center justify-between gap-3">
            {confirmingReset ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-medium">Confirmer ?</span>
                <button
                  type="button"
                  onClick={handleClearData}
                  className="px-2.5 py-1 rounded bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer"
                >
                  Oui, réinitialiser
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingReset(false)}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingReset(true)}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Réinitialiser les données locales</span>
              </button>
            )}

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Fermer
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
