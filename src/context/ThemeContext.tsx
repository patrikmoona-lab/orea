import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AppLanguage = 'fr' | 'en';
export type TextSizeMode = 'normal' | 'large' | 'xlarge';

export interface OreaAppSettings {
  theme: ThemeMode;
  language: AppLanguage;
  notifications: {
    general: boolean;
    reminders: boolean;
    programs: boolean;
    tips: boolean;
    important: boolean;
    time: string;
  };
  ai: {
    voiceAnswers: boolean;
    customSuggestions: boolean;
    useProfileContext: boolean;
    memoryContext: boolean;
  };
  privacy: {
    healthDataEncrypted: boolean;
    personalization: boolean;
    shareAnalytics: boolean;
  };
  accessibility: {
    textSize: TextSizeMode;
    highContrast: boolean;
    reducedMotion: boolean;
  };
}

const DEFAULT_SETTINGS: OreaAppSettings = {
  theme: 'system',
  language: 'fr',
  notifications: {
    general: true,
    reminders: true,
    programs: true,
    tips: true,
    important: true,
    time: '08:30',
  },
  ai: {
    voiceAnswers: false,
    customSuggestions: true,
    useProfileContext: true,
    memoryContext: true,
  },
  privacy: {
    healthDataEncrypted: true,
    personalization: true,
    shareAnalytics: false,
  },
  accessibility: {
    textSize: 'normal',
    highContrast: false,
    reducedMotion: false,
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  effectiveTheme: 'light' | 'dark';
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  settings: OreaAppSettings;
  updateSettings: (newSettings: Partial<OreaAppSettings>) => Promise<void>;
  updateNotificationSettings: (notifs: Partial<OreaAppSettings['notifications']>) => Promise<void>;
  updateAiSettings: (ai: Partial<OreaAppSettings['ai']>) => Promise<void>;
  updatePrivacySettings: (privacy: Partial<OreaAppSettings['privacy']>) => Promise<void>;
  updateAccessibilitySettings: (access: Partial<OreaAppSettings['accessibility']>) => Promise<void>;
  isSaving: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userProfile, isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<OreaAppSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem('orea_app_settings');
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
      // Also check legacy orea_theme if present
      const legacyTheme = localStorage.getItem('orea_theme') as ThemeMode;
      if (legacyTheme && ['light', 'dark', 'system'].includes(legacyTheme)) {
        return { ...DEFAULT_SETTINGS, theme: legacyTheme };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isSaving, setIsSaving] = useState(false);

  // Listen to OS Dark Mode Preference changes in real-time
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute effective theme ('light' or 'dark')
  const effectiveTheme: 'light' | 'dark' =
    settings.theme === 'system'
      ? systemIsDark
        ? 'dark'
        : 'light'
      : settings.theme;

  // Apply dark mode class and accessibility styles to document root
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Dark class
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // High Contrast
    if (settings.accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced Motion
    if (settings.accessibility.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Text Size
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    root.classList.add(`text-size-${settings.accessibility.textSize}`);

    // Language attribute
    root.setAttribute('lang', settings.language);
  }, [effectiveTheme, settings.accessibility, settings.language]);

  // Sync settings with Firestore on login
  useEffect(() => {
    if (!isAuthenticated || !userProfile?.uid || userProfile.uid.startsWith('guest_') || userProfile.uid === 'guest-user') {
      return;
    }

    let isMounted = true;
    const fetchUserSettings = async () => {
      try {
        const settingsRef = doc(db, 'users', userProfile.uid, 'config', 'settings');
        const snap = await getDoc(settingsRef);
        if (snap.exists() && isMounted) {
          const remote = snap.data() as Partial<OreaAppSettings>;
          setSettings((prev) => {
            const merged = {
              ...prev,
              ...remote,
              notifications: { ...prev.notifications, ...(remote.notifications || {}) },
              ai: { ...prev.ai, ...(remote.ai || {}) },
              privacy: { ...prev.privacy, ...(remote.privacy || {}) },
              accessibility: { ...prev.accessibility, ...(remote.accessibility || {}) },
            };
            localStorage.setItem('orea_app_settings', JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.warn('[ThemeContext] Note reading remote settings:', err);
      }
    };

    fetchUserSettings();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, userProfile?.uid]);

  // Persist settings locally and to Firestore
  const persistSettings = async (newSettings: OreaAppSettings) => {
    try {
      localStorage.setItem('orea_app_settings', JSON.stringify(newSettings));
      localStorage.setItem('orea_theme', newSettings.theme);
      localStorage.setItem('orea_lang', newSettings.language);

      if (isAuthenticated && userProfile?.uid && !userProfile.uid.startsWith('guest_') && userProfile.uid !== 'guest-user') {
        setIsSaving(true);
        const settingsRef = doc(db, 'users', userProfile.uid, 'config', 'settings');
        await setDoc(settingsRef, newSettings, { merge: true });
        setIsSaving(false);
      }
    } catch (err) {
      console.warn('[ThemeContext] Error saving settings:', err);
      setIsSaving(false);
    }
  };

  const updateSettings = async (partial: Partial<OreaAppSettings>) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        ...partial,
        notifications: { ...prev.notifications, ...(partial.notifications || {}) },
        ai: { ...prev.ai, ...(partial.ai || {}) },
        privacy: { ...prev.privacy, ...(partial.privacy || {}) },
        accessibility: { ...prev.accessibility, ...(partial.accessibility || {}) },
      };
      persistSettings(updated);
      return updated;
    });
  };

  const setTheme = (mode: ThemeMode) => {
    updateSettings({ theme: mode });
  };

  const toggleTheme = () => {
    if (effectiveTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const setLanguage = (lang: AppLanguage) => {
    updateSettings({ language: lang });
  };

  const updateNotificationSettings = async (notifs: Partial<OreaAppSettings['notifications']>) => {
    await updateSettings({
      notifications: { ...settings.notifications, ...notifs },
    });
  };

  const updateAiSettings = async (ai: Partial<OreaAppSettings['ai']>) => {
    await updateSettings({
      ai: { ...settings.ai, ...ai },
    });
  };

  const updatePrivacySettings = async (privacy: Partial<OreaAppSettings['privacy']>) => {
    await updateSettings({
      privacy: { ...settings.privacy, ...privacy },
    });
  };

  const updateAccessibilitySettings = async (access: Partial<OreaAppSettings['accessibility']>) => {
    await updateSettings({
      accessibility: { ...settings.accessibility, ...access },
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: settings.theme,
        effectiveTheme,
        setTheme,
        toggleTheme,
        language: settings.language,
        setLanguage,
        settings,
        updateSettings,
        updateNotificationSettings,
        updateAiSettings,
        updatePrivacySettings,
        updateAccessibilitySettings,
        isSaving,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
