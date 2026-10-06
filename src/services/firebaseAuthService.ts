import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  type User as FirebaseUser,
  type AuthError,
} from 'firebase/auth';
import { auth, saveGoogleUserProfile, fetchUserProfile, ADMIN_EMAIL } from '../lib/firebase';
import { OreaUserProfile } from '../types';

export interface AuthErrorInfo {
  code: string;
  message: string;
  action?: 'login_password' | 'retry' | 'domain';
}

/**
 * Configure et retourne une instance configurée de GoogleAuthProvider.
 */
export function getGoogleAuthProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });
  return provider;
}

/**
 * Détecte si l'appareil actuel est un mobile ou petit écran.
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 768
  );
}

/**
 * Authentification Google par Pop-up (idéale sur PC / Desktop).
 * Met à jour le profil Firestore sans écraser les données existantes.
 */
export async function signInWithGooglePopup(): Promise<OreaUserProfile> {
  const provider = getGoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return await saveGoogleUserProfile(result.user);
}

/**
 * Authentification Google par Redirection (idéale sur Mobile pour éviter le blocage des popups).
 */
export async function signInWithGoogleRedirect(): Promise<void> {
  const provider = getGoogleAuthProvider();
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('orea_pending_google_redirect', 'true');
  }
  await signInWithRedirect(auth, provider);
}

/**
 * Service principal de connexion Google OREA :
 * - Détecte intelligemment l'environnement (Popup sur PC, Redirection sur mobile).
 * - Gère le repli (fallback) transparent en cas de blocage de pop-up.
 * - Préserve strictement toutes les données utilisateur déjà enregistrées dans Firestore.
 */
export async function signInWithGoogle(options?: {
  preferRedirect?: boolean;
}): Promise<OreaUserProfile> {
  const provider = getGoogleAuthProvider();
  const mobile = isMobileDevice();
  const shouldRedirect = options?.preferRedirect ?? mobile;

  if (shouldRedirect) {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('orea_pending_google_redirect', 'true');
      }
      await signInWithRedirect(auth, provider);
      throw { code: 'auth/redirect-started', message: 'Redirection vers Google en cours...' };
    } catch (redirectErr: any) {
      if (redirectErr.code === 'auth/redirect-started') {
        throw redirectErr;
      }
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('orea_pending_google_redirect');
      }
      console.warn('[firebaseAuthService] signInWithRedirect non disponible, repli sur popup:', redirectErr);
      const result = await signInWithPopup(auth, provider);
      return await saveGoogleUserProfile(result.user);
    }
  } else {
    try {
      const result = await signInWithPopup(auth, provider);
      return await saveGoogleUserProfile(result.user);
    } catch (popupErr: any) {
      if (popupErr.code === 'auth/popup-blocked' && mobile) {
        console.warn('[firebaseAuthService] Popup bloquée sur mobile, bascule vers redirect.');
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('orea_pending_google_redirect', 'true');
        }
        await signInWithRedirect(auth, provider);
        throw { code: 'auth/redirect-started', message: 'Redirection vers Google en cours...' };
      }
      throw popupErr;
    }
  }
}

/**
 * Récupère le résultat d'une redirection Google Auth si l'utilisateur revient d'une redirection.
 */
export async function handleGoogleRedirectResult(): Promise<OreaUserProfile | null> {
  if (typeof window !== 'undefined' && sessionStorage.getItem('orea_pending_google_redirect') !== 'true') {
    return null;
  }
  try {
    const result = await getRedirectResult(auth);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('orea_pending_google_redirect');
    }
    if (result?.user) {
      return await saveGoogleUserProfile(result.user);
    }
    return null;
  } catch (err: any) {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('orea_pending_google_redirect');
    }
    const msg = (err?.message || '').toLowerCase();
    if (msg.includes('database is closing') || err?.code === 'auth/database-closing') {
      return null;
    }
    console.warn('[firebaseAuthService] getRedirectResult notice:', err?.message || err);
    return null;
  }
}

/**
 * Déconnexion sécurisée Firebase Auth.
 * Ne supprime JAMAIS les données Firestore de l'utilisateur.
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Traduction conviviale et sécurisée des erreurs Firebase Authentication.
 */
export function getAuthErrorMessage(error: any): AuthErrorInfo {
  const code = error?.code || '';
  const defaultMsg =
    error?.message || 'Une erreur inattendue est survenue lors de l’authentification.';

  switch (code) {
    case 'auth/popup-closed-by-user':
      return {
        code,
        message: 'La fenêtre de connexion Google a été fermée avant la fin de l’opération.',
        action: 'retry',
      };
    case 'auth/popup-blocked':
      return {
        code,
        message: 'Votre navigateur a bloqué la fenêtre de connexion Google. Veuillez autoriser les pop-ups pour continuer.',
        action: 'retry',
      };
    case 'auth/account-exists-with-different-credential':
      return {
        code,
        message: 'Un compte OREA existe déjà avec cette adresse email en utilisant un mot de passe classique. Veuillez vous connecter avec votre mot de passe.',
        action: 'login_password',
      };
    case 'auth/network-request-failed':
      return {
        code,
        message: 'Problème de connexion réseau. Veuillez vérifier votre connexion internet et réessayer.',
        action: 'retry',
      };
    case 'auth/unauthorized-domain':
      return {
        code,
        message: 'Ce domaine web n’est pas encore configuré dans la console Google Firebase. Veuillez contacter l’administrateur.',
        action: 'domain',
      };
    case 'auth/user-disabled':
      return {
        code,
        message: 'Ce compte utilisateur a été temporairement désactivé.',
      };
    case 'auth/cancelled-popup-request':
      return {
        code,
        message: 'Une seule tentative de connexion peut être traitée à la fois.',
        action: 'retry',
      };
    case 'auth/redirect-started':
      return {
        code,
        message: 'Redirection vers Google en cours...',
      };
    default:
      return {
        code,
        message: defaultMsg.includes('Firebase:')
          ? defaultMsg.replace(/^Firebase:\s*/, '')
          : defaultMsg,
        action: 'retry',
      };
  }
}

export { auth, saveGoogleUserProfile, fetchUserProfile, ADMIN_EMAIL };
