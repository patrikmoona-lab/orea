import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Phone,
  Globe,
  Languages,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  HeartPulse,
  Activity,
  GraduationCap,
  TrendingUp,
  Check,
} from 'lucide-react';
import { OREALogo } from './OREALogo';
import { OreaButton } from './common/OreaButton';
import { OreaFlux } from './common/OreaFlux';
import { OreaLoader } from './OreaLoader';
import {
  registerWithEmailPassword,
  loginWithEmailPassword,
} from '../lib/firebase';
import {
  signInWithGoogle,
  getAuthErrorMessage,
} from '../services/firebaseAuthService';
import { OreaUserProfile, NavSection } from '../types';

interface AuthViewProps {
  onNavigate: (section: NavSection) => void;
  onAuthSuccess: (profile: OreaUserProfile) => void;
  initialMode?: 'login' | 'register';
}

const COUNTRY_CODES = [
  { code: '+242', country: 'Congo (Brazzaville)', flag: '🇨🇬' },
  { code: '+243', country: 'RDC (Kinshasa)', flag: '🇨🇩' },
  { code: '+237', country: 'Cameroun', flag: '🇨🇲' },
  { code: '+225', country: 'Côte d’Ivoire', flag: '🇨🇮' },
  { code: '+221', country: 'Sénégal', flag: '🇸🇳' },
  { code: '+241', country: 'Gabon', flag: '🇬🇦' },
  { code: '+235', country: 'Tchad', flag: '🇹🇩' },
  { code: '+228', country: 'Togo', flag: '🇹🇬' },
  { code: '+229', country: 'Bénin', flag: '🇧🇯' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+1', country: 'Canada / USA', flag: '🇨🇦' },
  { code: '+32', country: 'Belgique', flag: '🇧🇪' },
];

const AFRICAN_COUNTRIES = [
  'République du Congo (Brazzaville)',
  'République démocratique du Congo (RDC)',
  'Cameroun',
  'Côte d’Ivoire',
  'Sénégal',
  'Gabon',
  'Algérie',
  'Angola',
  'Bénin',
  'Botswana',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Comores',
  'Djibouti',
  'Égypte',
  'Érythrée',
  'Eswatini',
  'Éthiopie',
  'Gambie',
  'Ghana',
  'Guinée',
  'Guinée-Bissau',
  'Guinée équatoriale',
  'Kenya',
  'Lesotho',
  'Libéria',
  'Libye',
  'Madagascar',
  'Malawi',
  'Mali',
  'Maroc',
  'Maurice',
  'Mauritanie',
  'Mozambique',
  'Namibie',
  'Niger',
  'Nigeria',
  'Ouganda',
  'République centrafricaine',
  'Rwanda',
  'Sao Tomé-et-Principe',
  'Seychelles',
  'Sierra Leone',
  'Somalie',
  'Soudan',
  'Soudan du Sud',
  'Afrique du Sud',
  'Tanzanie',
  'Tchad',
  'Togo',
  'Tunisie',
  'Zambie',
  'Zimbabwe',
  'Autre / Diaspora',
];

export const AuthView: React.FC<AuthViewProps> = ({
  onNavigate,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Registration Form Fields
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState<'homme' | 'femme' | 'autre' | 'non-specifie'>('non-specifie');
  const [countryCode, setCountryCode] = useState('+242');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [country, setCountry] = useState('Congo');
  const [language, setLanguage] = useState('Français');

  // UI States
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [authActionPrompt, setAuthActionPrompt] = useState<'login_password' | 'retry' | 'domain' | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState<string | null>(null);
  const [authenticatingProfile, setAuthenticatingProfile] = useState<OreaUserProfile | null>(null);
  const [authenticatingMessage, setAuthenticatingMessage] = useState<string>('Connexion sécurisée à votre compte OREA...');

  // Validation function
  const validateForm = (): boolean => {
    const errs: { [key: string]: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'L’adresse email est requise.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Veuillez saisir une adresse email valide.';
    }

    if (!password) {
      errs.password = 'Le mot de passe est obligatoire.';
    } else if (password.length < 6) {
      errs.password = 'Le mot de passe doit comporter au moins 6 caractères.';
    }

    if (mode === 'register') {
      if (!fullName.trim() && !firstName.trim()) {
        errs.fullName = 'Veuillez renseigner votre nom complet ou prénom.';
      }

      if (password !== confirmPassword) {
        errs.confirmPassword = 'Les mots de passe ne correspondent pas.';
      }

      const cleanPhone = whatsAppNumber.replace(/\D/g, '');
      if (!cleanPhone) {
        errs.whatsapp = 'Le numéro WhatsApp est obligatoire pour les rappels de santé.';
      } else if (cleanPhone.length < 6 || cleanPhone.length > 14) {
        errs.whatsapp = 'Numéro WhatsApp invalide (veuillez saisir 6 à 12 chiffres).';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const fullDisplayName = fullName.trim() || `${firstName.trim()} ${lastName.trim()}`.trim();
      const finalWhatsApp = `${countryCode} ${whatsAppNumber.trim()}`;

      const profile = await registerWithEmailPassword({
        fullName: fullDisplayName,
        firstName: firstName.trim() || fullDisplayName.split(' ')[0],
        lastName: lastName.trim() || fullDisplayName.split(' ').slice(1).join(' '),
        email: email.trim(),
        password,
        gender,
        whatsapp: finalWhatsApp,
        country: country.trim() || 'Congo',
        language,
      });

      setSuccessMsg('Compte OREA créé avec succès ! Préparation de votre espace...');
      setAuthenticatingProfile(profile);
    } catch (err: any) {
      console.error('[AuthView] Inscription échouée:', err);
      if (err.code === 'auth/email-already-in-use') {
        setServerError('Un compte existe déjà avec cette adresse email. Connectez-vous.');
      } else if (err.code === 'auth/weak-password') {
        setServerError('Le mot de passe est trop faible. Utilisez au moins 6 caractères.');
      } else if (err.code === 'auth/invalid-email') {
        setServerError('Format d’adresse email non valide.');
      } else {
        setServerError(err.message || 'Une erreur est survenue lors de l’inscription.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!email.trim()) {
      setErrors({ email: 'Veuillez saisir votre email.' });
      return;
    }
    if (!password) {
      setErrors({ password: 'Veuillez saisir votre mot de passe.' });
      return;
    }

    setLoading(true);

    try {
      const profile = await loginWithEmailPassword(email, password);
      setSuccessMsg(`Connexion réussie ! Bienvenue, ${profile.displayName}.`);
      setAuthenticatingProfile(profile);
    } catch (err: any) {
      console.error('[AuthView] Connexion échouée:', err);
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        setServerError('Identifiants incorrects. Vérifiez votre email et mot de passe.');
      } else {
        setServerError(err.message || 'Erreur lors de la connexion. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setServerError(null);
    setAuthActionPrompt(null);
    setLoading(true);
    try {
      const profile = await signInWithGoogle();
      setAuthenticatingMessage(`Connexion Google réussie ! Bienvenue, ${profile.displayName}.`);
      setAuthenticatingProfile(profile);
    } catch (err: any) {
      console.error('[AuthView] Google Sign-In error:', err);
      if (err.code === 'auth/redirect-started') {
        setAuthenticatingMessage('Redirection vers Google en cours...');
        return;
      }
      const errInfo = getAuthErrorMessage(err);
      setServerError(errInfo.message);
      setAuthActionPrompt(errInfo.action || null);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setServerError('Veuillez d’abord saisir votre adresse email dans le champ ci-dessous.');
      return;
    }
    setServerError(null);
    setForgotPasswordMsg(`Un lien de réinitialisation sécurisé a été envoyé à ${email}.`);
  };

  if (authenticatingProfile) {
    return (
      <OreaLoader
        isReady={true}
        minDuration={3000}
        message={authenticatingMessage}
        onFinish={() => onAuthSuccess(authenticatingProfile)}
      />
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#f7fafc]">
      <div className="max-w-5xl w-full bg-white rounded-3xl sm:rounded-[32px] border border-slate-200/90 shadow-[0_20px_50px_rgba(11,47,91,0.06)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          
          {/* =========================================================================
              CÔTÉ GAUCHE : ZONE IMMERSIVE & SIGNATURE LE FLUX OREA
             ========================================================================= */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0B2F5B] via-[#071E3D] to-[#041124] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Le Flux OREA (Organic Flow Background) */}
            <div className="absolute inset-0 pointer-events-none">
              <OreaFlux variant="auth" theme="dark" />
            </div>

            {/* Brand Header */}
            <div className="relative z-10">
              <button
                type="button"
                onClick={() => onNavigate('accueil')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white transition-colors cursor-pointer mb-8"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Retour à l’accueil</span>
              </button>

              <div className="mb-6">
                <OREALogo variant="compact" size="md" showTagline={false} clickable={false} />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Bienvenue sur OREA
              </h2>

              <p className="mt-3 text-sm text-slate-300 leading-relaxed font-normal">
                Une plateforme pour mieux comprendre, mieux vivre et mieux évoluer.
              </p>
            </div>

            {/* Core Human Pillars */}
            <div className="relative z-10 my-8 space-y-3.5">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <div className="w-7 h-7 rounded-lg bg-[#00A6C7]/20 border border-[#00A6C7]/30 flex items-center justify-center text-cyan-300 shrink-0">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <span className="font-medium">Santé & Prévention médicale quotidienne</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <div className="w-7 h-7 rounded-lg bg-[#00C49F]/20 border border-[#00C49F]/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-medium">Forme, nutrition & équilibre de vie</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <div className="w-7 h-7 rounded-lg bg-[#9333EA]/20 border border-[#9333EA]/30 flex items-center justify-center text-purple-300 shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-medium">Études, BAC G2 & développement personnel</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <div className="w-7 h-7 rounded-lg bg-[#0056D6]/20 border border-[#0056D6]/30 flex items-center justify-center text-blue-300 shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="font-medium">Évolution continue & suivi intelligent</span>
              </div>
            </div>

            {/* Reassurance Footer */}
            <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-slate-400">
              <p>Écosystème de confiance certifié • Respect strict du secret et de vos données</p>
            </div>
          </div>

          {/* =========================================================================
              CÔTÉ DROIT : FORMULAIRE ÉPURÉ, MODERNE & SÉCURISÉ
             ========================================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Mode Selector Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0B2F5B] tracking-tight">
                    {mode === 'login' ? 'Connexion' : 'Créer votre compte'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {mode === 'login'
                      ? 'Renseignez vos identifiants pour accéder à votre espace.'
                      : 'Remplissez les informations ci-dessous pour démarrer.'}
                  </p>
                </div>

                {/* Switch button */}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setServerError(null);
                    setErrors({});
                    setForgotPasswordMsg(null);
                  }}
                  className="text-xs sm:text-sm font-bold text-[#0056D6] hover:text-[#0044b2] transition-colors cursor-pointer"
                >
                  {mode === 'login' ? 'Créer un compte' : 'Déjà inscrit ?'}
                </button>
              </div>

              {/* Status Messages */}
              {serverError && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex flex-col gap-2">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <span className="leading-relaxed">{serverError}</span>
                  </div>
                  {authActionPrompt === 'login_password' && (
                    <div className="mt-1 pl-6">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setServerError(null);
                          setAuthActionPrompt(null);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Se connecter avec mot de passe</span>
                      </button>
                    </div>
                  )}
                  {authActionPrompt === 'retry' && (
                    <div className="mt-1 pl-6">
                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0056D6] hover:bg-[#0044b2] text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        <span>Réessayer la connexion Google</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="font-semibold">{successMsg}</span>
                </div>
              )}

              {forgotPasswordMsg && (
                <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm flex items-center gap-2.5">
                  <Check className="w-4 h-4 shrink-0 text-blue-600" />
                  <span>{forgotPasswordMsg}</span>
                </div>
              )}

              {/* Bouton Continuer avec Google */}
              <button
                type="button"
                id="btn-google-auth"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full min-h-[46px] py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-2xs mb-5 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.09C3.26 21.3 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.26C.46 8.18 0 9.98 0 12s.46 3.82 1.26 5.41l4.02-3.09z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.7 1.26 6.59l4.02 3.09c.95-2.83 3.6-4.93 6.72-4.93z"
                  />
                </svg>
                <span>Continuer avec Google</span>
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  ou
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Core Form */}
              <form onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
                {mode === 'register' && (
                  <>
                    {/* Nom complet */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Ex: Jean Kouka"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                            errors.fullName
                              ? 'border-red-400 bg-red-50/20'
                              : 'border-slate-200 focus:border-[#0056D6]'
                          }`}
                        />
                      </div>
                      {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Numéro WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-28 sm:w-32 px-2 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:border-[#0056D6] outline-none"
                        >
                          {COUNTRY_CODES.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.flag} {item.code}
                            </option>
                          ))}
                        </select>

                        <div className="relative flex-1">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="tel"
                            value={whatsAppNumber}
                            onChange={(e) => setWhatsAppNumber(e.target.value)}
                            placeholder="Ex: 06 123 4567"
                            className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                              errors.whatsapp
                                ? 'border-red-400 bg-red-50/20'
                                : 'border-slate-200 focus:border-[#0056D6]'
                            }`}
                          />
                        </div>
                      </div>
                      {errors.whatsapp ? (
                        <p className="text-[11px] text-red-600 mt-1">{errors.whatsapp}</p>
                      ) : (
                        <p className="text-[11px] text-slate-400 mt-1">
                          Utilisé pour vos rappels santé et notifications prioritaires
                        </p>
                      )}
                    </div>

                    {/* Pays de résidence */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pays de résidence <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:border-[#0056D6] outline-none"
                        >
                          {AFRICAN_COUNTRIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adresse email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@exemple.com"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                        errors.email
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-slate-200 focus:border-[#0056D6]'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                </div>

                {/* Mot de passe */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Mot de passe <span className="text-red-500">*</span>
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs text-[#0056D6] hover:underline font-medium cursor-pointer"
                      >
                        Mot de passe oublié ?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                        errors.password
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-slate-200 focus:border-[#0056D6]'
                      }`}
                    />
                  </div>
                  {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password (Registration only) */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirmer le mot de passe <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                          errors.confirmPassword
                            ? 'border-red-400 bg-red-50/20'
                            : 'border-slate-200 focus:border-[#0056D6]'
                        }`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-2">
                  <OreaButton
                    variant="sante"
                    size="md"
                    fullWidth
                    isLoading={loading}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {mode === 'login' ? 'Se connecter' : 'Créer mon compte OREA'}
                  </OreaButton>
                </div>

                {/* Legal notice for Google Auth Platform and Terms */}
                <div className="pt-2 text-center text-[11px] text-slate-500 leading-relaxed">
                  En continuant, vous acceptez les{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('conditions_utilisation')}
                    className="text-[#0056D6] hover:underline font-semibold cursor-pointer"
                  >
                    Conditions d'utilisation
                  </button>{' '}
                  et reconnaissez avoir pris connaissance de la{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('confidentialite')}
                    className="text-[#0056D6] hover:underline font-semibold cursor-pointer"
                  >
                    Politique de confidentialité
                  </button>
                  .
                </div>
              </form>
            </div>

            {/* Bottom Security Footer */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Données chiffrées de bout en bout • Firebase Auth sécurisé</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthView;
