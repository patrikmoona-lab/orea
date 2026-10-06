import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { UserFitnessProfile, WorkoutSessionLog, EnergieExercise } from '../types/energie';

const LOCAL_PROFILE_KEY = 'orea_fitness_profile';
const LOCAL_SESSIONS_KEY = 'orea_workout_sessions';
const LOCAL_FAVORITES_KEY = 'orea_workout_favorites';

/**
 * Saves the user's fitness profile to Firestore & localStorage
 */
export async function saveFitnessProfile(
  userId: string | undefined,
  profile: UserFitnessProfile
): Promise<UserFitnessProfile> {
  const now = new Date().toISOString();
  const dataToSave: UserFitnessProfile = {
    ...profile,
    onboardingCompleted: true,
    completedAt: profile.completedAt || now,
    updatedAt: now,
  };

  // 1. Save to local storage for instant cache
  try {
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(dataToSave));
    localStorage.setItem('orea_configured_sport', 'true');
    localStorage.setItem('orea_configured_energie', 'true');
    // Mirror into module answers
    localStorage.setItem('orea_profile_sport', JSON.stringify({
      id: `profile-sport-${Date.now()}`,
      module: 'sport',
      name: profile.name || 'Membre OREA',
      answers: dataToSave,
      updatedAt: now,
    }));
  } catch (e) {
    console.warn('[EnergieService] LocalStorage write error:', e);
  }

  // 2. Save to Firestore if user is authenticated
  const targetUid = userId || auth.currentUser?.uid;
  if (targetUid && !targetUid.startsWith('guest_') && targetUid !== 'anonymous_user') {
    try {
      const docRef = doc(db, 'users', targetUid, 'fitnessProfile', 'profile');
      await setDoc(docRef, dataToSave, { merge: true });

      // Mirror in /users/{userId}/modules/sport for backwards compatibility
      const modRef = doc(db, 'users', targetUid, 'modules', 'sport');
      await setDoc(modRef, {
        enabled: true,
        data: dataToSave,
        updatedAt: now,
        createdAt: profile.completedAt || now,
      }, { merge: true });
    } catch (err) {
      console.warn('[EnergieService] Firestore profile save error:', err);
    }
  }

  return dataToSave;
}

/**
 * Retrieves the user's fitness profile from Firestore or local cache
 */
export async function getFitnessProfile(userId?: string): Promise<UserFitnessProfile | null> {
  const targetUid = userId || auth.currentUser?.uid;

  if (targetUid && !targetUid.startsWith('guest_') && targetUid !== 'anonymous_user') {
    try {
      const docRef = doc(db, 'users', targetUid, 'fitnessProfile', 'profile');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as UserFitnessProfile;
        localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('[EnergieService] Firestore fetch error, falling back to cache:', err);
    }
  }

  // Fallback to local cache
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
    if (raw) {
      return JSON.parse(raw) as UserFitnessProfile;
    }
    // Check legacy module profile
    const legacy = localStorage.getItem('orea_profile_sport');
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (parsed?.answers && parsed.answers.niveau) {
        return {
          level: (parsed.answers.niveau.toLowerCase()) as any,
          bodyParts: parsed.answers.zone || ['corps-complet'],
          goals: parsed.answers.objectif ? [parsed.answers.objectif] : ['améliorer ma condition physique'],
          duration: parsed.answers.temps || '20 min',
          frequency: parsed.answers.joursParSemaine || '3 jours',
          equipment: parsed.answers.materiel || ['aucun'],
          limitations: parsed.answers.remarques || '',
          onboardingCompleted: true,
          completedAt: parsed.createdAt || new Date().toISOString(),
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Saves a completed workout session to Firestore & local history
 */
export async function logWorkoutSession(
  userId: string | undefined,
  session: Omit<WorkoutSessionLog, 'id' | 'completedAt'>
): Promise<WorkoutSessionLog> {
  const id = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const fullSession: WorkoutSessionLog = {
    ...session,
    id,
    completedAt: now,
  };

  // Local storage save
  try {
    const existingRaw = localStorage.getItem(LOCAL_SESSIONS_KEY);
    const list: WorkoutSessionLog[] = existingRaw ? JSON.parse(existingRaw) : [];
    list.unshift(fullSession);
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('[EnergieService] Error saving local session:', e);
  }

  // Firestore save
  const targetUid = userId || auth.currentUser?.uid;
  if (targetUid && !targetUid.startsWith('guest_') && targetUid !== 'anonymous_user') {
    try {
      const docRef = doc(db, 'users', targetUid, 'workoutSessions', id);
      await setDoc(docRef, fullSession);
    } catch (err) {
      console.warn('[EnergieService] Firestore session log error:', err);
    }
  }

  return fullSession;
}

/**
 * Fetches user's past workout sessions
 */
export async function getWorkoutSessions(userId?: string): Promise<WorkoutSessionLog[]> {
  const targetUid = userId || auth.currentUser?.uid;

  if (targetUid && !targetUid.startsWith('guest_') && targetUid !== 'anonymous_user') {
    try {
      const collRef = collection(db, 'users', targetUid, 'workoutSessions');
      const q = query(collRef, orderBy('completedAt', 'desc'), limit(50));
      const snap = await getDocs(q);
      const list: WorkoutSessionLog[] = [];
      snap.forEach((d) => list.push(d.data() as WorkoutSessionLog));
      if (list.length > 0) {
        localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(list));
        return list;
      }
    } catch (err) {
      console.warn('[EnergieService] Firestore sessions query error:', err);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as WorkoutSessionLog[]) : [];
  } catch {
    return [];
  }
}

/**
 * Manages user favorite exercises (toggle & fetch)
 */
export async function toggleFavoriteExercise(userId: string | undefined, exerciseId: string): Promise<string[]> {
  let favorites: string[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_FAVORITES_KEY);
    favorites = raw ? JSON.parse(raw) : [];
  } catch {
    favorites = [];
  }

  if (favorites.includes(exerciseId)) {
    favorites = favorites.filter((id) => id !== exerciseId);
  } else {
    favorites.push(exerciseId);
  }

  try {
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.warn(e);
  }

  const targetUid = userId || auth.currentUser?.uid;
  if (targetUid && !targetUid.startsWith('guest_') && targetUid !== 'anonymous_user') {
    try {
      const docRef = doc(db, 'users', targetUid, 'workoutFavorites', 'list');
      await setDoc(docRef, { exerciseIds: favorites, updatedAt: new Date().toISOString() });
    } catch (e) {
      console.warn('[EnergieService] Error saving favorite to Firestore:', e);
    }
  }

  return favorites;
}

export async function getFavoriteExercises(userId?: string): Promise<string[]> {
  const targetUid = userId || auth.currentUser?.uid;

  if (targetUid && !targetUid.startsWith('guest_') && targetUid !== 'anonymous_user') {
    try {
      const docRef = doc(db, 'users', targetUid, 'workoutFavorites', 'list');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const ids = snap.data()?.exerciseIds || [];
        localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(ids));
        return ids;
      }
    } catch (e) {
      console.warn('[EnergieService] Error fetching favorites:', e);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
