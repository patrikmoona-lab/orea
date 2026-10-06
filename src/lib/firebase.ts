import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  getDocFromServer,
  writeBatch,
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  type AuthError,
} from 'firebase/auth';

export type { FirebaseUser, AuthError };
import firebaseConfig from '../../firebase-applet-config.json';
import { OreaUserProfile, OnboardingResponses, OreaSubscription, PaymentTransaction } from '../types';

export const ADMIN_EMAIL = 'patrik.moona@gmail.com';

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with designated database ID
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Validate Firestore connection on boot
export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : String(error);
    const code = error?.code || '';
    if (msg.includes('the client is offline') || msg.includes('offline') || code === 'unavailable') {
      console.warn('[OREA Firestore] Mode hors-ligne actif ou backend en attente de reconnexion.');
    }
  }
}
// Execute non-blocking connectivity check
testConnection().catch(() => {});

// Core Types
export interface OreaConversation {
  id: string;
  title: string;
  userId: string;
  messageCount: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessageSnippet?: string;
}

export interface OreaChatMessage {
  conversationId: string;
  messageId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  action?: {
    type: string;
    target: string;
    label: string;
  } | null;
  isError?: boolean;
  metadata?: Record<string, any>;
}

// Google User Profile in Firestore (Preserves existing data, creates minimal clean profile on first login)
export async function saveGoogleUserProfile(user: FirebaseUser): Promise<OreaUserProfile> {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);
    const now = new Date().toISOString();
    const existing = userSnap.exists() ? (userSnap.data() as Partial<OreaUserProfile>) : null;

    const email = user.email || existing?.email || '';
    const isAdminUser =
      (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ||
      existing?.role === 'admin';

    let profileData: OreaUserProfile;

    if (existing) {
      // 6. Si le profil existe déjà : NE PAS écraser WhatsApp, pays, préférences, modules, objectifs, historique
      profileData = {
        ...existing,
        uid: user.uid,
        displayName: user.displayName || existing.displayName || 'Membre OREA',
        firstName: existing.firstName || (user.displayName ? user.displayName.split(' ')[0] : 'Membre'),
        lastName: existing.lastName || (user.displayName ? user.displayName.split(' ').slice(1).join(' ') : ''),
        email,
        gender: existing.gender || 'non-specifie',
        whatsapp: existing.whatsapp || '', // Préserve le WhatsApp existant
        country: existing.country || '',   // Préserve le pays existant
        language: existing.language || 'Français',
        photoURL: user.photoURL || existing.photoURL || '',
        provider: 'google',
        role: isAdminUser ? 'admin' : 'user',
        onboardingCompleted: existing.onboardingCompleted ?? false,
        lastLogin: now,
        createdAt: existing.createdAt || now,
        updatedAt: now,
      } as OreaUserProfile;

      // Update document with safe merged fields
      await setDoc(userDocRef, profileData, { merge: true });
    } else {
      // 7. Si c'est la première connexion Google : Profil minimal sans inventer WhatsApp, pays, âge
      profileData = {
        uid: user.uid,
        displayName: user.displayName || email.split('@')[0] || 'Membre OREA',
        firstName: user.displayName ? user.displayName.split(' ')[0] : 'Membre',
        lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '',
        email,
        gender: 'non-specifie',
        whatsapp: '', // Pas de numéro inventé
        country: '',  // Pas de pays inventé
        language: 'Français',
        photoURL: user.photoURL || '',
        provider: 'google',
        role: isAdminUser ? 'admin' : 'user',
        onboardingCompleted: false, // Nécessite l'onboarding pour les modules
        lastLogin: now,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(userDocRef, profileData);
    }

    // Miroir users/{uid}/profile/main pour conformité sous-collection
    try {
      const profileSubDoc = doc(db, 'users', user.uid, 'profile', 'main');
      await setDoc(
        profileSubDoc,
        {
          uid: user.uid,
          displayName: profileData.displayName,
          email: profileData.email,
          photoURL: profileData.photoURL || null,
          provider: 'google',
          updatedAt: now,
        },
        { merge: true }
      );
    } catch (subErr) {
      // Non-bloquant
    }

    return profileData;
  } catch (err) {
    console.warn('[Firestore] Profil utilisateur Google non sauvegardé:', err);
    throw err;
  }
}

// User Profile in Firestore (Email / Mot de passe classique)
export async function saveUserProfile(
  user: FirebaseUser,
  additionalData?: Partial<OreaUserProfile>
): Promise<OreaUserProfile> {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);
    const now = new Date().toISOString();
    const existing = userSnap.exists() ? (userSnap.data() as Partial<OreaUserProfile>) : {};

    const isAdminUser = (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) || existing.role === 'admin';

    const profileData: OreaUserProfile = {
      uid: user.uid,
      displayName: additionalData?.displayName || user.displayName || existing.displayName || 'Membre OREA',
      firstName: additionalData?.firstName || existing.firstName || (user.displayName ? user.displayName.split(' ')[0] : 'Membre'),
      lastName: additionalData?.lastName || existing.lastName || (user.displayName ? user.displayName.split(' ').slice(1).join(' ') : ''),
      email: user.email || existing.email || '',
      gender: additionalData?.gender || existing.gender || 'non-specifie',
      whatsapp: additionalData?.whatsapp !== undefined ? additionalData.whatsapp : (existing.whatsapp || ''),
      country: additionalData?.country !== undefined ? additionalData.country : (existing.country || ''),
      language: additionalData?.language || existing.language || 'Français',
      photoURL: user.photoURL || existing.photoURL || '',
      provider: user.providerData?.[0]?.providerId || existing.provider || 'password',
      role: isAdminUser ? 'admin' : 'user',
      onboardingCompleted: additionalData?.onboardingCompleted ?? existing.onboardingCompleted ?? false,
      lastLogin: now,
      createdAt: existing.createdAt || now,
      updatedAt: now,
      onboardingData: additionalData?.onboardingData || existing.onboardingData,
    };

    await setDoc(userDocRef, profileData, { merge: true });
    return profileData;
  } catch (err) {
    console.warn('[Firestore] Profil utilisateur non sauvegardé:', err);
    throw err;
  }
}

// Fetch complete user profile from Firestore
export async function fetchUserProfile(uid: string): Promise<OreaUserProfile | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return null;
    return snap.data() as OreaUserProfile;
  } catch (err) {
    console.warn('[Firestore] Impossible de récupérer le profil:', err);
    return null;
  }
}

// Register with Email, Password & Detailed Profile Info
export interface RegisterPayload {
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  gender: 'homme' | 'femme' | 'autre' | 'non-specifie';
  whatsapp: string;
  country: string;
  language: string;
}

export async function registerWithEmailPassword(payload: RegisterPayload): Promise<OreaUserProfile> {
  const credential = await createUserWithEmailAndPassword(auth, payload.email.trim(), payload.password);
  const user = credential.user;

  const displayName = payload.fullName.trim();
  await updateProfile(user, { displayName });

  const firstName = payload.firstName?.trim() || displayName.split(' ')[0] || displayName;
  const lastName = payload.lastName?.trim() || displayName.split(' ').slice(1).join(' ') || '';

  const profile = await saveUserProfile(user, {
    displayName,
    firstName,
    lastName,
    gender: payload.gender,
    whatsapp: payload.whatsapp.trim(),
    country: payload.country.trim(),
    language: payload.language.trim(),
    onboardingCompleted: false,
    role: payload.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
  });

  return profile;
}

// Sign in with Email & Password and record lastLogin
export async function loginWithEmailPassword(email: string, password: string): Promise<OreaUserProfile> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const user = credential.user;
  const now = new Date().toISOString();

  // Update lastLogin in Firestore
  const userDocRef = doc(db, 'users', user.uid);
  await setDoc(userDocRef, { lastLogin: now, updatedAt: now }, { merge: true });

  const profile = await fetchUserProfile(user.uid);
  if (profile) return profile;

  return await saveUserProfile(user);
}

// Save Onboarding Questionnaire Responses
export async function saveUserOnboarding(uid: string, responses: OnboardingResponses): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  const now = new Date().toISOString();
  await updateDoc(userDocRef, {
    onboardingCompleted: true,
    onboardingData: {
      ...responses,
      completedAt: now,
    },
    updatedAt: now,
  });
}

// Update User Profile Details
export async function updateUserProfileDetails(
  uid: string,
  details: Partial<OreaUserProfile>
): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  const now = new Date().toISOString();
  await updateDoc(userDocRef, {
    ...details,
    updatedAt: now,
  });
}

// Google Sign-In with popup (desktop) or redirect (mobile)
export async function signInWithGoogle(options?: { preferRedirect?: boolean }): Promise<OreaUserProfile> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  // Detect mobile / small screens if preferRedirect not explicitly specified
  const isMobile =
    typeof window !== 'undefined' &&
    (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth < 768);

  if (options?.preferRedirect || (isMobile && options?.preferRedirect !== false)) {
    try {
      await signInWithRedirect(auth, provider);
      throw { code: 'auth/redirect-started', message: 'Redirection vers Google en cours...' };
    } catch (redirectErr: any) {
      if (redirectErr.code === 'auth/redirect-started') {
        throw redirectErr;
      }
      console.warn('[Firebase Auth] signInWithRedirect non supporté, tentative avec popup:', redirectErr);
      const result = await signInWithPopup(auth, provider);
      return await saveGoogleUserProfile(result.user);
    }
  } else {
    try {
      const result = await signInWithPopup(auth, provider);
      return await saveGoogleUserProfile(result.user);
    } catch (popupErr: any) {
      // Si la popup est bloquée sur mobile ou navigateur strict, fallback sur redirect si possible
      if (popupErr.code === 'auth/popup-blocked' && isMobile) {
        await signInWithRedirect(auth, provider);
        throw { code: 'auth/redirect-started', message: 'Redirection vers Google en cours...' };
      }
      throw popupErr;
    }
  }
}

// Traiter le résultat de redirection Google (après retour sur l'application)
export async function handleGoogleRedirectResult(): Promise<OreaUserProfile | null> {
  // Only execute getRedirectResult if a redirect was actually initiated
  if (typeof window !== 'undefined' && sessionStorage.getItem('orea_pending_google_redirect') !== 'true') {
    return null;
  }

  try {
    const result = await getRedirectResult(auth);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('orea_pending_google_redirect');
    }
    if (result && result.user) {
      return await saveGoogleUserProfile(result.user);
    }
    return null;
  } catch (err: any) {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('orea_pending_google_redirect');
    }
    const msg = (err?.message || '').toLowerCase();
    if (msg.includes('database is closing') || err?.code === 'auth/database-closing') {
      // Benign IndexedDB shutdown during quick page refresh/HMR
      return null;
    }
    console.warn('[Firebase Auth] Notice handleGoogleRedirectResult:', err?.message || err);
    return null;
  }
}

// Convertir les erreurs Firebase en messages clairs en français pour l'utilisateur
export function getAuthErrorMessage(err: any): { message: string; action?: 'login_password' | 'retry' | 'domain' } {
  if (!err) return { message: 'Une erreur inattendue est survenue.' };
  const code = err.code || err.message || '';

  switch (code) {
    case 'auth/popup-closed-by-user':
      return {
        message: 'La fenêtre de connexion Google a été fermée avant la finalisation de votre authentification.',
        action: 'retry',
      };
    case 'auth/popup-blocked':
      return {
        message: 'La fenêtre contextuelle Google a été bloquée par votre navigateur. Veuillez autoriser les fenêtres pop-up ou réessayer.',
        action: 'retry',
      };
    case 'auth/account-exists-with-different-credential':
      return {
        message: 'Un compte OREA existe déjà avec cette adresse email mais utilise un mode de connexion différent (mot de passe ou autre fournisseur). Veuillez vous connecter avec vos identifiants habituels.',
        action: 'login_password',
      };
    case 'auth/network-request-failed':
      return {
        message: 'Impossible de contacter les serveurs Firebase. Veuillez vérifier votre connexion internet et réessayer.',
        action: 'retry',
      };
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return {
        message: 'Identifiants incorrects. Veuillez vérifier votre adresse email et votre mot de passe.',
      };
    case 'auth/unauthorized-domain':
      return {
        message: "Ce domaine web n'est pas encore autorisé dans Firebase Authentication (Console Firebase > Authentication > Settings > Domaines autorisés).",
        action: 'domain',
      };
    case 'auth/operation-not-allowed':
      return {
        message: "L'authentification Google n'est pas activée sur ce projet Firebase. Activez-la dans la console Firebase (Authentication > Fournisseurs de connexion > Google).",
      };
    case 'auth/cancelled-popup-request':
      return {
        message: 'Une requête de connexion est déjà en cours.',
      };
    case 'auth/user-disabled':
      return {
        message: 'Ce compte utilisateur a été désactivé. Veuillez contacter le support OREA.',
      };
    case 'auth/email-already-in-use':
      return {
        message: 'Cette adresse email est déjà associée à un compte OREA existant. Veuillez vous connecter.',
        action: 'login_password',
      };
    case 'auth/redirect-started':
      return {
        message: 'Redirection vers Google en cours...',
      };
    case 'auth/timeout':
      return {
        message: 'Le délai de connexion a expiré. Veuillez réessayer.',
        action: 'retry',
      };
    default:
      if (typeof err.message === 'string' && err.message.length > 0 && !err.message.startsWith('{')) {
        return { message: err.message };
      }
      return {
        message: 'Erreur d’authentification. Veuillez réessayer ou utiliser la connexion par email.',
        action: 'retry',
      };
  }
}

// Sign-out helper (Déconnexion sans supprimer les données Firestore)
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// Ensure an authenticated session exists (anonymous if user has not logged in via Google yet)
export async function ensureFirebaseAuth(): Promise<FirebaseUser> {
  if (auth.currentUser) {
    return auth.currentUser;
  }
  const userCredential = await signInAnonymously(auth);
  return userCredential.user;
}

// Get fresh ID token for backend authentication
export async function getFirebaseIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken();
  } catch (err) {
    console.error('[Firebase] Erreur acquisition ID token:', err);
    return null;
  }
}

// Authentication observer
export function onAuthUserChanged(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

// Subscribe to User's conversations from Firestore in real-time
export function subscribeUserConversations(
  userId: string,
  callback: (conversations: OreaConversation[]) => void,
  errorCallback?: (err: Error) => void
): () => void {
  const collRef = collection(db, 'users', userId, 'conversations');
  const q = query(collRef, orderBy('updatedAt', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: OreaConversation[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as OreaConversation;
        list.push({
          id: docSnap.id,
          title: data.title || 'Nouvelle discussion',
          userId: data.userId || userId,
          messageCount: typeof data.messageCount === 'number' ? data.messageCount : 0,
          isArchived: Boolean(data.isArchived),
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          lastMessageSnippet: data.lastMessageSnippet || '',
        });
      });
      callback(list);
    },
    (err) => {
      console.error('[Firestore] Error fetching conversations:', err);
      if (errorCallback) errorCallback(err);
    }
  );
}

// Create a new conversation in Firestore
export async function createFirestoreConversation(
  userId: string,
  initialTitle: string = 'Nouvelle discussion'
): Promise<OreaConversation> {
  const collRef = collection(db, 'users', userId, 'conversations');
  const newDocRef = doc(collRef);
  const now = new Date().toISOString();

  const conversation: OreaConversation = {
    id: newDocRef.id,
    title: initialTitle,
    userId,
    messageCount: 0,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(newDocRef, conversation);

  try {
    const rootDocRef = doc(db, 'assistantConversations', newDocRef.id);
    await setDoc(rootDocRef, conversation);
  } catch (e) {
    // Non-blocking
  }

  return conversation;
}

// Update conversation title
export async function updateFirestoreConversationTitle(
  userId: string,
  conversationId: string,
  newTitle: string
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'conversations', conversationId);
  const payload = {
    title: newTitle.trim(),
    updatedAt: new Date().toISOString(),
  };
  await updateDoc(docRef, payload);
  try {
    await updateDoc(doc(db, 'assistantConversations', conversationId), payload);
  } catch (e) {
    // Non-blocking
  }
}

// Toggle conversation archive status
export async function toggleFirestoreConversationArchive(
  userId: string,
  conversationId: string,
  isArchived: boolean
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'conversations', conversationId);
  const payload = {
    isArchived,
    updatedAt: new Date().toISOString(),
  };
  await updateDoc(docRef, payload);
  try {
    await updateDoc(doc(db, 'assistantConversations', conversationId), payload);
  } catch (e) {
    // Non-blocking
  }
}

// Delete conversation and all its messages permanently from Firestore
export async function deleteFirestoreConversation(
  userId: string,
  conversationId: string
): Promise<void> {
  // Delete all messages in subcollection first
  const msgsColl = collection(db, 'users', userId, 'conversations', conversationId, 'messages');
  const msgsSnap = await getDocs(msgsColl);
  const batch = writeBatch(db);

  msgsSnap.forEach((msgDoc) => {
    batch.delete(msgDoc.ref);
  });

  // Delete conversation document
  const convDocRef = doc(db, 'users', userId, 'conversations', conversationId);
  batch.delete(convDocRef);

  await batch.commit();

  try {
    const rootMsgs = await getDocs(collection(db, 'assistantConversations', conversationId, 'messages'));
    const rootBatch = writeBatch(db);
    rootMsgs.forEach((d) => rootBatch.delete(d.ref));
    rootBatch.delete(doc(db, 'assistantConversations', conversationId));
    await rootBatch.commit();
  } catch (e) {
    // Non-blocking
  }
}

// Subscribe to conversation messages from Firestore in real-time
export function subscribeConversationMessages(
  userId: string,
  conversationId: string,
  callback: (messages: OreaChatMessage[]) => void,
  errorCallback?: (err: Error) => void
): () => void {
  const msgsColl = collection(db, 'users', userId, 'conversations', conversationId, 'messages');
  const q = query(msgsColl, orderBy('createdAt', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: OreaChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as OreaChatMessage;
        list.push({
          conversationId,
          messageId: docSnap.id,
          userId: data.userId || userId,
          role: data.role || 'assistant',
          content: data.content || '',
          createdAt: data.createdAt || new Date().toISOString(),
          action: data.action || null,
          isError: Boolean(data.isError),
          metadata: data.metadata || undefined,
        });
      });
      callback(list);
    },
    (err) => {
      console.error('[Firestore] Error fetching messages:', err);
      if (errorCallback) errorCallback(err);
    }
  );
}

// Save a message to Firestore and update conversation metadata
export async function saveFirestoreMessage(
  userId: string,
  conversationId: string,
  message: {
    role: 'user' | 'assistant' | 'system';
    content: string;
    action?: { type: string; target: string; label: string } | null;
    isError?: boolean;
    metadata?: Record<string, any>;
  },
  options?: { isFirstMessage?: boolean; customTitle?: string }
): Promise<string> {
  const msgsColl = collection(db, 'users', userId, 'conversations', conversationId, 'messages');
  const newMsgRef = doc(msgsColl);
  const now = new Date().toISOString();

  const chatMessage: OreaChatMessage = {
    conversationId,
    messageId: newMsgRef.id,
    userId,
    role: message.role,
    content: message.content,
    createdAt: now,
    action: message.action || null,
    isError: Boolean(message.isError),
    metadata: message.metadata,
  };

  const convRef = doc(db, 'users', userId, 'conversations', conversationId);

  // Update conversation doc
  const convSnap = await getDoc(convRef);
  const currentCount = convSnap.exists() ? (convSnap.data().messageCount || 0) : 0;

  const batch = writeBatch(db);
  batch.set(newMsgRef, chatMessage);

  const updatePayload: Record<string, any> = {
    updatedAt: now,
    messageCount: currentCount + 1,
    lastMessageSnippet: message.content.slice(0, 80),
  };

  if (options?.customTitle) {
    updatePayload.title = options.customTitle;
  } else if (options?.isFirstMessage && message.role === 'user') {
    // Generate clean concise title
    const generatedTitle = generateTitleFromMessage(message.content);
    updatePayload.title = generatedTitle;
  }

  batch.update(convRef, updatePayload);
  await batch.commit();

  return newMsgRef.id;
}

// Smart title generator from first user prompt
export function generateTitleFromMessage(content: string): string {
  const clean = content.trim().replace(/^["'\s]+|["'\s]+$/g, '');
  if (!clean) return 'Nouvelle discussion';

  const lower = clean.toLowerCase();

  if (lower.includes('bac g2') || lower.includes('syscohada') || lower.includes('comptab')) {
    return 'Préparer mon BAC G2';
  }
  if (lower.includes('sport') || lower.includes('programme sportif') || lower.includes('workout') || lower.includes('calisthenics')) {
    return 'Mon programme sportif';
  }
  if (lower.includes('cycle') || lower.includes('ovulation') || lower.includes('menstruel') || lower.includes('règles')) {
    return 'Suivi de mon cycle';
  }
  if (lower.includes('budget') || lower.includes('finance') || lower.includes('épargne') || lower.includes('fcfa')) {
    return 'Gestion de mon budget';
  }
  if (lower.includes('organiser') || lower.includes('journée') || lower.includes('planner') || lower.includes('planning')) {
    return 'Organiser ma journée';
  }
  if (lower.includes('safou') || lower.includes('nutrition') || lower.includes('manger') || lower.includes('repas')) {
    return 'Nutrition & alimentation';
  }
  if (lower.includes('dormir') || lower.includes('sommeil') || lower.includes('fatigue')) {
    return 'Améliorer mon sommeil';
  }
  if (lower.includes('santé') || lower.includes('symptôme') || lower.includes('douleur') || lower.includes('malade')) {
    return 'Conseil santé & prévention';
  }

  // Fallback: truncate to 35 characters cleanly
  if (clean.length <= 35) {
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  const truncated = clean.slice(0, 32);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 10 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

// ----------------------------------------------------
// OREA SUBSCRIPTION & PAYMENTS
// ----------------------------------------------------

/**
 * Met à jour ou active l'abonnement d'un utilisateur dans Firestore
 */
export async function updateUserSubscription(
  userId: string,
  subscription: OreaSubscription
): Promise<void> {
  const userDocRef = doc(db, 'users', userId);
  const now = new Date().toISOString();
  await updateDoc(userDocRef, {
    subscription,
    updatedAt: now,
  });
}

/**
 * Enregistre ou met à jour une transaction de paiement dans la collection /payments
 */
export async function savePaymentTransaction(
  transaction: PaymentTransaction
): Promise<void> {
  const paymentDocRef = doc(db, 'payments', transaction.id);
  await setDoc(paymentDocRef, transaction, { merge: true });
}

/**
 * Récupère l'historique des paiements d'un utilisateur
 */
export async function fetchUserPayments(userId: string): Promise<PaymentTransaction[]> {
  try {
    const collRef = collection(db, 'payments');
    const q = query(collRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50));
    const snap = await getDocs(q);
    const list: PaymentTransaction[] = [];
    snap.forEach((d) => {
      list.push(d.data() as PaymentTransaction);
    });
    return list;
  } catch (err) {
    console.warn('[Firestore] Erreur récupération paiements utilisateur:', err);
    return [];
  }
}

/**
 * Écoute en temps réel les paiements de l'utilisateur
 */
export function subscribeUserPayments(
  userId: string,
  callback: (payments: PaymentTransaction[]) => void
): () => void {
  const collRef = collection(db, 'payments');
  const q = query(collRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50));

  return onSnapshot(
    q,
    (snap) => {
      const list: PaymentTransaction[] = [];
      snap.forEach((d) => {
        list.push(d.data() as PaymentTransaction);
      });
      callback(list);
    },
    (err) => {
      console.warn('[Firestore] Erreur écoute paiements:', err);
    }
  );
}

// Send password reset email
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

// ----------------------------------------------------
// OREA 6 MODULES FIRESTORE STORAGE
// ----------------------------------------------------

export interface OreaModuleDoc {
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  data: Record<string, any>;
}

/**
 * Saves or updates a user module document in Firestore: /users/{userId}/modules/{moduleId}
 */
export async function saveFirestoreModule(
  userId: string,
  moduleId: string,
  answers: Record<string, any>
): Promise<OreaModuleDoc> {
  try {
    const docRef = doc(db, 'users', userId, 'modules', moduleId);
    const existingSnap = await getDoc(docRef);
    const now = new Date().toISOString();
    const existingData = existingSnap.exists() ? (existingSnap.data() as OreaModuleDoc) : null;

    const moduleDoc: OreaModuleDoc = {
      enabled: true,
      createdAt: existingData?.createdAt || now,
      updatedAt: now,
      data: answers || {},
    };

    await setDoc(docRef, moduleDoc, { merge: true });
    return moduleDoc;
  } catch (err) {
    console.error(`[Firestore] Erreur sauvegarde module ${moduleId}:`, err);
    throw err;
  }
}

/**
 * Fetches a single user module document from Firestore
 */
export async function fetchFirestoreModule(
  userId: string,
  moduleId: string
): Promise<OreaModuleDoc | null> {
  try {
    const docRef = doc(db, 'users', userId, 'modules', moduleId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as OreaModuleDoc;
  } catch (err) {
    console.warn(`[Firestore] Erreur lecture module ${moduleId}:`, err);
    return null;
  }
}

/**
 * Fetches all 6 user modules from Firestore: /users/{userId}/modules
 */
export async function fetchAllFirestoreModules(
  userId: string
): Promise<Record<string, OreaModuleDoc>> {
  try {
    const collRef = collection(db, 'users', userId, 'modules');
    const snap = await getDocs(collRef);
    const result: Record<string, OreaModuleDoc> = {};
    snap.forEach((docSnap) => {
      result[docSnap.id] = docSnap.data() as OreaModuleDoc;
    });
    return result;
  } catch (err) {
    console.warn('[Firestore] Erreur lecture de tous les modules:', err);
    return {};
  }
}

/**
 * Disables or removes a module document from Firestore
 */
export async function clearFirestoreModule(
  userId: string,
  moduleId: string
): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'modules', moduleId);
    await updateDoc(docRef, {
      enabled: false,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn(`[Firestore] Erreur désactivation module ${moduleId}:`, err);
  }
}

// ----------------------------------------------------
// FIRESTORE SUBCOLLECTIONS: OBJECTIVES, ACTIVITIES, NOTIFICATIONS, DOCUMENTS
// ----------------------------------------------------

export interface OreaObjectiveDoc {
  id: string;
  title: string;
  module: string;
  progress: number;
  targetDate?: string;
  status: 'en_cours' | 'termine';
  createdAt: string;
  updatedAt: string;
}

export interface OreaActivityDoc {
  id: string;
  title: string;
  description: string;
  module: string;
  type: 'espace_cree' | 'profil_modifie' | 'seance_enregistree' | 'repas_ajoute' | 'tache_terminee' | 'depense_ajoutee' | 'cours_etudie' | 'objectif_mis_a_jour' | 'autre';
  createdAt: string;
}

export interface OreaNotificationDoc {
  id: string;
  title: string;
  message: string;
  type: 'rappel' | 'objectif' | 'tache' | 'activite' | 'info';
  read: boolean;
  createdAt: string;
}

export interface OreaDocumentItemDoc {
  id: string;
  title: string;
  module: string;
  type: 'rapport' | 'synthese' | 'export' | 'etude' | 'finance' | 'planning';
  summary?: string;
  content?: string;
  createdAt: string;
}

// OBJECTIVES
export async function fetchUserObjectives(userId: string): Promise<OreaObjectiveDoc[]> {
  try {
    const collRef = collection(db, 'users', userId, 'objectives');
    const q = query(collRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list: OreaObjectiveDoc[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as OreaObjectiveDoc);
    });
    return list;
  } catch (err) {
    console.warn('[Firestore] Erreur lecture objectifs:', err);
    return [];
  }
}

export async function saveUserObjective(
  userId: string,
  objective: Omit<OreaObjectiveDoc, 'id' | 'createdAt' | 'updatedAt'>
): Promise<OreaObjectiveDoc> {
  const collRef = collection(db, 'users', userId, 'objectives');
  const newDoc = doc(collRef);
  const now = new Date().toISOString();
  const obj: OreaObjectiveDoc = {
    ...objective,
    id: newDoc.id,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(newDoc, obj);
  return obj;
}

export async function deleteUserObjective(userId: string, objectiveId: string): Promise<void> {
  const docRef = doc(db, 'users', userId, 'objectives', objectiveId);
  await deleteDoc(docRef);
}

export async function updateUserObjective(
  userId: string,
  objectiveId: string,
  updates: Partial<Omit<OreaObjectiveDoc, 'id' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(db, 'users', userId, 'objectives', objectiveId);
  const now = new Date().toISOString();
  await updateDoc(docRef, {
    ...updates,
    updatedAt: now,
  });
}

// ACTIVITIES
export async function fetchUserActivities(userId: string): Promise<OreaActivityDoc[]> {
  try {
    const collRef = collection(db, 'users', userId, 'activity');
    const q = query(collRef, orderBy('createdAt', 'desc'), limit(50));
    const snap = await getDocs(q);
    const list: OreaActivityDoc[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as OreaActivityDoc);
    });
    return list;
  } catch (err) {
    console.warn('[Firestore] Erreur lecture activités:', err);
    return [];
  }
}

export async function logUserActivity(
  userId: string,
  activity: Omit<OreaActivityDoc, 'id' | 'createdAt'>
): Promise<OreaActivityDoc> {
  try {
    const collRef = collection(db, 'users', userId, 'activity');
    const newDoc = doc(collRef);
    const now = new Date().toISOString();
    const act: OreaActivityDoc = {
      ...activity,
      id: newDoc.id,
      createdAt: now,
    };
    await setDoc(newDoc, act);
    return act;
  } catch (err) {
    console.warn('[Firestore] Impossible de journaliser l\'activité:', err);
    return {
      id: `act-${Date.now()}`,
      ...activity,
      createdAt: new Date().toISOString(),
    };
  }
}

// NOTIFICATIONS
export async function fetchUserNotifications(userId: string): Promise<OreaNotificationDoc[]> {
  try {
    const collRef = collection(db, 'users', userId, 'notifications');
    const q = query(collRef, orderBy('createdAt', 'desc'), limit(50));
    const snap = await getDocs(q);
    const list: OreaNotificationDoc[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as OreaNotificationDoc);
    });
    return list;
  } catch (err) {
    console.warn('[Firestore] Erreur lecture notifications:', err);
    return [];
  }
}

export async function saveUserNotification(
  userId: string,
  notif: Omit<OreaNotificationDoc, 'id' | 'createdAt' | 'read'>
): Promise<OreaNotificationDoc> {
  const collRef = collection(db, 'users', userId, 'notifications');
  const newDoc = doc(collRef);
  const now = new Date().toISOString();
  const notification: OreaNotificationDoc = {
    ...notif,
    id: newDoc.id,
    read: false,
    createdAt: now,
  };
  await setDoc(newDoc, notification);
  return notification;
}

export async function markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
  const docRef = doc(db, 'users', userId, 'notifications', notificationId);
  await updateDoc(docRef, { read: true });
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const collRef = collection(db, 'users', userId, 'notifications');
  const snap = await getDocs(collRef);
  const batch = writeBatch(db);
  snap.forEach((d) => {
    batch.update(d.ref, { read: true });
  });
  await batch.commit();
}

export async function deleteUserNotification(userId: string, notificationId: string): Promise<void> {
  const docRef = doc(db, 'users', userId, 'notifications', notificationId);
  await deleteDoc(docRef);
}

// DOCUMENTS
export async function fetchUserDocuments(userId: string): Promise<OreaDocumentItemDoc[]> {
  try {
    const collRef = collection(db, 'users', userId, 'documents');
    const q = query(collRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const list: OreaDocumentItemDoc[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as OreaDocumentItemDoc);
    });
    return list;
  } catch (err) {
    console.warn('[Firestore] Erreur lecture documents:', err);
    return [];
  }
}

export async function saveUserDocument(
  userId: string,
  docItem: Omit<OreaDocumentItemDoc, 'id' | 'createdAt'>
): Promise<OreaDocumentItemDoc> {
  const collRef = collection(db, 'users', userId, 'documents');
  const newDoc = doc(collRef);
  const now = new Date().toISOString();
  const documentItem: OreaDocumentItemDoc = {
    ...docItem,
    id: newDoc.id,
    createdAt: now,
  };
  await setDoc(newDoc, documentItem);
  return documentItem;
}



