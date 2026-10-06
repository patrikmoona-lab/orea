import {
  CycleEntry,
  DailyCycleLog,
  CycleNoteItem,
  CycleSettings
} from '../types/cycle';
import { DEFAULT_CYCLE_SETTINGS } from './cycleEngine';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export interface CycleUserData {
  welcomeShown: boolean;
  entries: CycleEntry[];
  dailyLogs: Record<string, DailyCycleLog>;
  notes: CycleNoteItem[];
  settings: CycleSettings;
  lastVisitedAt: string;
}

const LOCAL_KEY_PREFIX = 'orea_cycle_v2_';

function getLocalKey(uid: string | undefined, suffix: string): string {
  const safeUid = uid || 'guest';
  return `${LOCAL_KEY_PREFIX}${safeUid}_${suffix}`;
}

export async function loadCycleUserData(uid: string | undefined): Promise<CycleUserData> {
  const safeUid = uid || 'guest';
  const defaultData: CycleUserData = {
    welcomeShown: false,
    entries: [],
    dailyLogs: {},
    notes: [],
    settings: DEFAULT_CYCLE_SETTINGS,
    lastVisitedAt: new Date().toISOString()
  };

  // 1. First try reading from localStorage for instant offline access
  try {
    const localWelcome = localStorage.getItem(getLocalKey(uid, 'welcomeShown'));
    const localEntries = localStorage.getItem(getLocalKey(uid, 'entries'));
    const localLogs = localStorage.getItem(getLocalKey(uid, 'dailyLogs'));
    const localNotes = localStorage.getItem(getLocalKey(uid, 'notes'));
    const localSettings = localStorage.getItem(getLocalKey(uid, 'settings'));

    if (localWelcome !== null) defaultData.welcomeShown = localWelcome === 'true';
    if (localEntries) defaultData.entries = JSON.parse(localEntries);
    if (localLogs) defaultData.dailyLogs = JSON.parse(localLogs);
    if (localNotes) defaultData.notes = JSON.parse(localNotes);
    if (localSettings) defaultData.settings = { ...DEFAULT_CYCLE_SETTINGS, ...JSON.parse(localSettings) };
  } catch (err) {
    console.warn('[cycleStorageService] Error loading local cache:', err);
  }

  // 2. If authenticated with a real Firestore UID, try fetching cloud data
  if (db && uid && uid !== 'guest-user' && !uid.startsWith('guest_') && uid !== 'anonymous_user') {
    try {
      const cycleDocRef = doc(db, 'users', uid, 'cycleData', 'profile');
      const snap = await getDoc(cycleDocRef);
      if (snap.exists()) {
        const cloudData = snap.data() as Partial<CycleUserData>;
        if (cloudData.welcomeShown !== undefined) defaultData.welcomeShown = cloudData.welcomeShown;
        if (Array.isArray(cloudData.entries)) defaultData.entries = cloudData.entries;
        if (cloudData.dailyLogs) defaultData.dailyLogs = cloudData.dailyLogs;
        if (Array.isArray(cloudData.notes)) defaultData.notes = cloudData.notes;
        if (cloudData.settings) defaultData.settings = { ...DEFAULT_CYCLE_SETTINGS, ...cloudData.settings };

        // Sync back to local storage
        saveCycleUserDataToLocal(uid, defaultData);
      }
    } catch (firestoreErr) {
      console.warn('[cycleStorageService] Firestore fetch skipped/failed, using local storage:', firestoreErr);
    }
  }

  return defaultData;
}

export function saveCycleUserDataToLocal(uid: string | undefined, data: CycleUserData): void {
  try {
    localStorage.setItem(getLocalKey(uid, 'welcomeShown'), String(data.welcomeShown));
    localStorage.setItem(getLocalKey(uid, 'entries'), JSON.stringify(data.entries));
    localStorage.setItem(getLocalKey(uid, 'dailyLogs'), JSON.stringify(data.dailyLogs));
    localStorage.setItem(getLocalKey(uid, 'notes'), JSON.stringify(data.notes));
    localStorage.setItem(getLocalKey(uid, 'settings'), JSON.stringify(data.settings));
    localStorage.setItem(getLocalKey(uid, 'lastVisitedAt'), data.lastVisitedAt || new Date().toISOString());
  } catch (err) {
    console.warn('[cycleStorageService] Error saving to localStorage:', err);
  }
}

export async function persistCycleUserData(uid: string | undefined, data: CycleUserData): Promise<void> {
  // Always save locally immediately
  saveCycleUserDataToLocal(uid, data);

  // If authenticated, persist to Firestore
  if (db && uid && uid !== 'guest-user' && !uid.startsWith('guest_') && uid !== 'anonymous_user') {
    try {
      const cycleDocRef = doc(db, 'users', uid, 'cycleData', 'profile');
      await setDoc(
        cycleDocRef,
        {
          welcomeShown: data.welcomeShown,
          entries: data.entries,
          dailyLogs: data.dailyLogs,
          notes: data.notes,
          settings: data.settings,
          lastVisitedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('[cycleStorageService] Failed to persist to Firestore:', err);
    }
  }
}

export async function clearAllCycleUserData(uid: string | undefined): Promise<void> {
  // Clear local storage
  try {
    localStorage.removeItem(getLocalKey(uid, 'welcomeShown'));
    localStorage.removeItem(getLocalKey(uid, 'entries'));
    localStorage.removeItem(getLocalKey(uid, 'dailyLogs'));
    localStorage.removeItem(getLocalKey(uid, 'notes'));
    localStorage.removeItem(getLocalKey(uid, 'settings'));
    localStorage.removeItem(getLocalKey(uid, 'lastVisitedAt'));
    // also remove old keys
    localStorage.removeItem(`orea_cycle_entries_${uid || 'guest'}`);
    localStorage.removeItem(`orea_cycle_daily_logs_${uid || 'guest'}`);
    localStorage.removeItem(`orea_cycle_settings_${uid || 'guest'}`);
  } catch (err) {
    console.warn('[cycleStorageService] Error clearing local storage:', err);
  }

  // Clear Firestore if authenticated
  if (db && uid && uid !== 'guest-user' && !uid.startsWith('guest_') && uid !== 'anonymous_user') {
    try {
      const cycleDocRef = doc(db, 'users', uid, 'cycleData', 'profile');
      await deleteDoc(cycleDocRef);
    } catch (err) {
      console.warn('[cycleStorageService] Error deleting Firestore document:', err);
    }
  }
}
