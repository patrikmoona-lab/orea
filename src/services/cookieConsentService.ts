import { CookieConsent } from '../types';

const COOKIE_NAME = 'orea_cookie_consent_v1';
const STORAGE_KEY = 'orea_cookie_consent_v1';
const CONSENT_VERSION = '1.0';

/**
 * Lit un cookie standard par son nom
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Enregistre un cookie sécurisé (1 an)
 * Sans données sensibles (uniquement statut et catégories)
 */
function setCookie(name: string, value: string, days: number = 365): void {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  // Attributs standard : SameSite=Lax, path=/
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Valide et convertit un objet en structure CookieConsent valide
 */
function parseConsent(raw: unknown): CookieConsent | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  if (
    typeof obj.status === 'string' &&
    ['accepted', 'rejected', 'custom'].includes(obj.status) &&
    typeof obj.preferences === 'boolean' &&
    typeof obj.analytics === 'boolean' &&
    typeof obj.timestamp === 'number' &&
    typeof obj.version === 'string'
  ) {
    return {
      status: obj.status as CookieConsent['status'],
      necessary: true,
      preferences: obj.preferences,
      analytics: obj.analytics,
      timestamp: obj.timestamp,
      version: obj.version,
    };
  }
  return null;
}

/**
 * Récupère le consentement actif (priorité localStorage puis document.cookie)
 */
export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;

  // 1. Essai depuis localStorage
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      const valid = parseConsent(parsed);
      if (valid) return valid;
    }
  } catch {
    // Ignorer les restrictions de stockage local (mode navigation privée strict)
  }

  // 2. Essai depuis document.cookie
  try {
    const rawCookie = getCookie(COOKIE_NAME);
    if (rawCookie) {
      const parsed = JSON.parse(rawCookie);
      const valid = parseConsent(parsed);
      if (valid) return valid;
    }
  } catch {
    // Cookie corrompu ou illisible
  }

  return null;
}

/**
 * Vérifie si l'utilisateur a déjà effectué un choix (Accepter, Refuser, ou Personnalisé)
 */
export function hasUserConsented(): boolean {
  return getCookieConsent() !== null;
}

/**
 * Vérifie si l'utilisation des cookies de préférence est autorisée
 */
export function canUsePreferences(): boolean {
  const consent = getCookieConsent();
  return consent ? consent.preferences : false;
}

/**
 * Vérifie si l'utilisation des cookies analytiques est autorisée
 */
export function canUseAnalytics(): boolean {
  const consent = getCookieConsent();
  return consent ? consent.analytics : false;
}

/**
 * Enregistre et diffuse le choix de consentement de l'utilisateur
 */
export function saveCookieConsent(consent: CookieConsent): void {
  if (typeof window === 'undefined') return;

  const payload = JSON.stringify(consent);

  // 1. Sauvegarde dans localStorage
  try {
    localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    // Mode privé ou quota dépassé
  }

  // 2. Sauvegarde dans le cookie
  try {
    setCookie(COOKIE_NAME, payload, 365);
  } catch {
    // Erreur d'écriture de cookie
  }

  // 3. Application immédiate des effets de bord
  applyConsentEffects(consent);

  // 4. Notification des composants abonnés
  window.dispatchEvent(
    new CustomEvent<CookieConsent>('orea_cookie_consent_changed', {
      detail: consent,
    })
  );
}

/**
 * Applique immédiatement le consentement (désactivation de trackers si refusé)
 */
function applyConsentEffects(consent: CookieConsent): void {
  if (typeof window === 'undefined') return;

  if (!consent.analytics) {
    // Désactiver tout tracker analytics éventuel conformément au standard GA opt-out
    (window as unknown as Record<string, unknown>)['ga-disable-OREA'] = true;
  }

  if (!consent.preferences) {
    // Si l'utilisateur refuse les préférences, supprimer les caches d'affichage non essentiels
    try {
      sessionStorage.removeItem('orea_temp_pref');
    } catch {
      // Ignorer
    }
  }
}

/**
 * Accepte tous les cookies (Nécessaires + Préférences + Analytiques)
 */
export function acceptAllCookies(): CookieConsent {
  const consent: CookieConsent = {
    status: 'accepted',
    necessary: true,
    preferences: true,
    analytics: true,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  saveCookieConsent(consent);
  return consent;
}

/**
 * Refuse tous les cookies non nécessaires (Nécessaires conservés, Préférences=false, Analytiques=false)
 */
export function rejectAllCookies(): CookieConsent {
  const consent: CookieConsent = {
    status: 'rejected',
    necessary: true,
    preferences: false,
    analytics: false,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  saveCookieConsent(consent);
  return consent;
}

/**
 * Enregistre un choix personnalisé par catégorie
 */
export function saveCustomConsent(preferences: boolean, analytics: boolean): CookieConsent {
  const consent: CookieConsent = {
    status: 'custom',
    necessary: true,
    preferences,
    analytics,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  saveCookieConsent(consent);
  return consent;
}

/**
 * S'abonne aux changements de consentement (utile pour les composants React)
 */
export function subscribeToConsent(
  callback: (consent: CookieConsent | null) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<CookieConsent>;
    callback(custom.detail || getCookieConsent());
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getCookieConsent());
    }
  };

  window.addEventListener('orea_cookie_consent_changed', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener('orea_cookie_consent_changed', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}
