import {
  auth,
  saveFirestoreModule,
  fetchFirestoreModule,
  clearFirestoreModule,
  fetchAllFirestoreModules
} from '../lib/firebase';

export interface OreaModuleProfile {
  id: string;
  module: string;
  name: string;
  answers: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

const MODULE_KEY_MAP: Record<string, { profileKey: string; configKey: string; aliases?: { profileKey: string; configKey: string } }> = {
  cycle: {
    profileKey: 'orea_profile_cycle',
    configKey: 'orea_configured_cycle',
    aliases: { profileKey: 'orea_profile_mon_cycle', configKey: 'orea_configured_mon_cycle' },
  },
  mon_cycle: {
    profileKey: 'orea_profile_cycle',
    configKey: 'orea_configured_cycle',
    aliases: { profileKey: 'orea_profile_mon_cycle', configKey: 'orea_configured_mon_cycle' },
  },
  sport: {
    profileKey: 'orea_profile_sport',
    configKey: 'orea_configured_sport',
    aliases: { profileKey: 'orea_profile_energie', configKey: 'orea_configured_energie' },
  },
  energie: {
    profileKey: 'orea_profile_sport',
    configKey: 'orea_configured_sport',
    aliases: { profileKey: 'orea_profile_energie', configKey: 'orea_configured_energie' },
  },
  workout: {
    profileKey: 'orea_profile_sport',
    configKey: 'orea_configured_sport',
    aliases: { profileKey: 'orea_profile_energie', configKey: 'orea_configured_energie' },
  },
  nutrition: {
    profileKey: 'orea_profile_nutrition',
    configKey: 'orea_configured_nutrition',
  },
  education: {
    profileKey: 'orea_profile_education',
    configKey: 'orea_configured_education',
    aliases: { profileKey: 'orea_profile_excellence', configKey: 'orea_configured_excellence' },
  },
  excellence: {
    profileKey: 'orea_profile_education',
    configKey: 'orea_configured_education',
    aliases: { profileKey: 'orea_profile_excellence', configKey: 'orea_configured_excellence' },
  },
  finance: {
    profileKey: 'orea_profile_finance',
    configKey: 'orea_configured_finance',
  },
  planner: {
    profileKey: 'orea_profile_planner',
    configKey: 'orea_configured_planner',
  },
};

/**
 * Saves a module profile with Firestore as primary Source of Truth.
 * If user is authenticated, writes to Firestore, awaits promise, verifies document exists in Firestore,
 * and then populates local cache.
 */
export async function saveModuleProfileAsync(
  moduleId: string,
  answers: Record<string, any>,
  userId?: string
): Promise<OreaModuleProfile> {
  const map = MODULE_KEY_MAP[moduleId] || {
    profileKey: `orea_profile_${moduleId}`,
    configKey: `orea_configured_${moduleId}`,
  };

  const pseudo =
    answers?.pseudo ||
    answers?.name ||
    answers?.prenom ||
    answers?.first_name ||
    'Membre OREA';

  const now = new Date().toISOString();
  const profile: OreaModuleProfile = {
    id: `profile-${moduleId}-${Date.now()}`,
    module: moduleId,
    name: pseudo,
    answers: answers || {},
    createdAt: now,
    updatedAt: now,
  };

  const currentUid = userId || auth.currentUser?.uid;

  // 1. Write to Firestore & Verify if authenticated user
  if (currentUid) {
    try {
      console.log(`[Firestore] Écriture module ${moduleId} pour l'utilisateur ${currentUid}...`);
      await saveFirestoreModule(currentUid, moduleId, answers);

      // Verify Firestore document read back
      console.log(`[Firestore] Verification de la présence du document ${moduleId}...`);
      const docSnap = await fetchFirestoreModule(currentUid, moduleId);
      if (!docSnap || !docSnap.enabled) {
        throw new Error(`Échec de confirmation Firestore : Le document pour ${moduleId} n'a pas été retrouvé dans la base.`);
      }
      console.log(`[Firestore] Confirmation réussie pour ${moduleId} dans Firestore !`);
    } catch (err: any) {
      console.error(`[Firestore Error] Échec d'enregistrement module ${moduleId}:`, err);
      throw new Error(err?.message || `Erreur de sauvegarde Firestore pour le module ${moduleId}.`);
    }
  }

  // 2. Update local UI cache
  const payload = JSON.stringify(profile);
  try {
    localStorage.setItem(map.profileKey, payload);
    localStorage.setItem(map.configKey, 'true');

    if (map.aliases) {
      localStorage.setItem(map.aliases.profileKey, payload);
      localStorage.setItem(map.aliases.configKey, 'true');
    }
  } catch (err) {
    console.error(`[OREA Cache] Storage error for module ${moduleId}:`, err);
  }

  return profile;
}

/**
 * Legacy sync wrapper for saveModuleProfileAsync
 */
export function saveModuleProfile(moduleId: string, answers: Record<string, any>): OreaModuleProfile {
  const map = MODULE_KEY_MAP[moduleId] || {
    profileKey: `orea_profile_${moduleId}`,
    configKey: `orea_configured_${moduleId}`,
  };

  const pseudo =
    answers?.pseudo ||
    answers?.name ||
    answers?.prenom ||
    answers?.first_name ||
    'Membre OREA';

  const profile: OreaModuleProfile = {
    id: `profile-${moduleId}-${Date.now()}`,
    module: moduleId,
    name: pseudo,
    answers: answers || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const payload = JSON.stringify(profile);
  try {
    localStorage.setItem(map.profileKey, payload);
    localStorage.setItem(map.configKey, 'true');

    if (map.aliases) {
      localStorage.setItem(map.aliases.profileKey, payload);
      localStorage.setItem(map.aliases.configKey, 'true');
    }
  } catch (err) {
    console.error(`[OREA Cache] Error:`, err);
  }

  const currentUid = auth.currentUser?.uid;
  if (currentUid) {
    saveFirestoreModule(currentUid, moduleId, answers).catch((err) => {
      console.warn(`[Firestore] Background save warn for ${moduleId}:`, err);
    });
  }

  return profile;
}

export function getModuleProfile(moduleId: string): OreaModuleProfile | null {
  const map = MODULE_KEY_MAP[moduleId] || {
    profileKey: `orea_profile_${moduleId}`,
    configKey: `orea_configured_${moduleId}`,
  };

  try {
    let raw = localStorage.getItem(map.profileKey);
    if (!raw && map.aliases) {
      raw = localStorage.getItem(map.aliases.profileKey);
    }

    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed) return null;

    // Handle legacy raw answers structure
    if (parsed && typeof parsed === 'object' && !parsed.answers) {
      return {
        id: `profile-${moduleId}-legacy`,
        module: moduleId,
        name: parsed.pseudo || parsed.name || 'Membre OREA',
        answers: parsed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return parsed as OreaModuleProfile;
  } catch (err) {
    console.error(`[OREA Cache] Error loading profile for ${moduleId}:`, err);
    return null;
  }
}

export function isModuleConfigured(moduleId: string): boolean {
  const map = MODULE_KEY_MAP[moduleId] || {
    profileKey: `orea_profile_${moduleId}`,
    configKey: `orea_configured_${moduleId}`,
  };

  try {
    const isConf = localStorage.getItem(map.configKey) === 'true';
    if (isConf) return true;

    if (map.aliases) {
      return localStorage.getItem(map.aliases.configKey) === 'true';
    }

    return false;
  } catch {
    return false;
  }
}

export function clearModuleProfile(moduleId: string): void {
  const map = MODULE_KEY_MAP[moduleId] || {
    profileKey: `orea_profile_${moduleId}`,
    configKey: `orea_configured_${moduleId}`,
  };

  try {
    localStorage.removeItem(map.profileKey);
    localStorage.removeItem(map.configKey);

    if (map.aliases) {
      localStorage.removeItem(map.aliases.profileKey);
      localStorage.removeItem(map.aliases.configKey);
    }
  } catch (err) {
    console.error(`[OREA Cache] Error clearing profile for ${moduleId}:`, err);
  }

  const currentUser = auth.currentUser;
  if (currentUser) {
    clearFirestoreModule(currentUser.uid, moduleId).catch((err) => {
      console.warn(`[OREA Firestore] Non-blocking module clear warn for ${moduleId}:`, err);
    });
  }
}

const lastSyncedForUser: Record<string, number> = {};

/**
 * Syncs module state directly from Firestore into local cache on login or session restore.
 * If localStorage is deleted, calling this function restores all configured modules from Firestore.
 */
export async function syncModulesFromFirestore(userId: string, force = false): Promise<void> {
  // Never attempt to sync guest or anonymous users from Firestore
  if (!userId || userId === 'guest-user' || userId.startsWith('guest_') || userId === 'anonymous_user') {
    return;
  }

  // Deduplicate: prevent repeated simultaneous syncs for the same user within 60 seconds
  const now = Date.now();
  if (!force && lastSyncedForUser[userId] && (now - lastSyncedForUser[userId] < 60000)) {
    return;
  }
  lastSyncedForUser[userId] = now;

  try {
    console.log(`[Firestore Sync] Consultation de Firestore /users/${userId}/modules pour la restauration...`);
    const firestoreModules = await fetchAllFirestoreModules(userId);
    const modules = ['cycle', 'sport', 'nutrition', 'education', 'finance', 'planner'];

    for (const modId of modules) {
      const docData = firestoreModules[modId];
      const map = MODULE_KEY_MAP[modId] || {
        profileKey: `orea_profile_${modId}`,
        configKey: `orea_configured_${modId}`,
      };

      if (docData && docData.enabled) {
        const pseudo =
          docData.data?.pseudo ||
          docData.data?.name ||
          docData.data?.prenom ||
          'Membre OREA';

        const profile: OreaModuleProfile = {
          id: `profile-${modId}-firestore`,
          module: modId,
          name: pseudo,
          answers: docData.data || {},
          createdAt: docData.createdAt || new Date().toISOString(),
          updatedAt: docData.updatedAt || new Date().toISOString(),
        };

        const payload = JSON.stringify(profile);
        localStorage.setItem(map.profileKey, payload);
        localStorage.setItem(map.configKey, 'true');

        if (map.aliases) {
          localStorage.setItem(map.aliases.profileKey, payload);
          localStorage.setItem(map.aliases.configKey, 'true');
        }
      } else {
        // Module not enabled in Firestore: purge from local cache
        localStorage.removeItem(map.profileKey);
        localStorage.removeItem(map.configKey);
        if (map.aliases) {
          localStorage.removeItem(map.aliases.profileKey);
          localStorage.removeItem(map.aliases.configKey);
        }
      }
    }
    console.log('[Firestore Sync] Synchronisation terminée avec succès depuis Firestore.');
  } catch (err) {
    console.warn('[Firestore Sync] Impossible de synchroniser les modules:', err);
  }
}


