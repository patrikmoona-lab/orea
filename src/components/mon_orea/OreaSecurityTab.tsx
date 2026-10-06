import React, { useState } from 'react';
import { Shield, Lock, Mail, Check, AlertCircle } from 'lucide-react';
import { OreaButton } from '../common/OreaButton';
import { sendPasswordReset } from '../../lib/firebase';

interface OreaSecurityTabProps {
  userEmail: string;
}

export const OreaSecurityTab: React.FC<OreaSecurityTabProps> = ({ userEmail }) => {
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleResetPassword = async () => {
    if (!userEmail) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await sendPasswordReset(userEmail);
      setResetSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setErrorMsg(err?.message || 'Impossible d\'envoyer le courriel de réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-[#0f2347] to-slate-900 text-white p-6 rounded-3xl shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
            <Shield className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
            SÉCURITÉ DU COMPTE
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">Sécurité & Authentification</h2>
        <p className="text-xs text-blue-200 mt-1">
          Gérez votre mot de passe, l'accès sécurisé et les autorisations de votre compte OREA.
        </p>
      </div>

      {resetSent && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Un lien de réinitialisation sécurisé a été envoyé à <strong>{userEmail}</strong>.
          </span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0056d6]" />
              <h4 className="text-xs font-bold text-[#0f2347]">Changer votre mot de passe</h4>
            </div>
            <p className="text-xs text-slate-500">
              Recevez un email officiel Firebase d'OREA pour définir un nouveau mot de passe sécurisé.
            </p>
          </div>

          <OreaButton
            variant="outline"
            onClick={handleResetPassword}
            disabled={loading || resetSent}
            className="shrink-0 flex items-center gap-2 text-xs font-bold"
          >
            <Mail className="w-4 h-4" />
            <span>{loading ? 'Envoi...' : 'Réinitialiser le mot de passe'}</span>
          </OreaButton>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2 text-xs text-slate-700">
          <h4 className="font-bold text-[#0f2347]">Chiffrement des données dans Firestore</h4>
          <p>
            Votre session est protégée par des tokens d'accès chiffrés. Firestore garantit l'isolation de vos 6 espaces personnels via l'architecture d'accès utilisateur par UID.
          </p>
        </div>
      </div>
    </div>
  );
};
