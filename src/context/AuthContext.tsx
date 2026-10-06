import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  auth,
  onAuthUserChanged,
  fetchUserProfile,
  saveGoogleUserProfile,
  handleGoogleRedirectResult,
  signOutUser,
  type FirebaseUser,
} from '../lib/firebase';
import { OreaUserProfile } from '../types';
import { syncModulesFromFirestore } from '../utils/oreaProfileStorage';

export const GUEST_PROFILE: OreaUserProfile = {
  uid: 'guest-user',
  firstName: 'Visiteur',
  lastName: 'OREA',
  displayName: 'Visiteur OREA',
  email: '',
  gender: 'non-specifie',
  whatsapp: '',
  country: '',
  language: 'Français',
  role: 'user',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  subscription: {
    planId: 'free',
    status: 'active',
    billingCycle: 'monthly',
    startedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
  onboardingCompleted: false,
};

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: OreaUserProfile;
  isAuthenticated: boolean;
  authLoading: boolean;
  setUserProfile: React.Dispatch<React.SetStateAction<OreaUserProfile>>;
  logout: () => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<OreaUserProfile>(GUEST_PROFILE);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // Safety timeout: ensure authLoading is never stuck forever (max 1500ms)
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setAuthLoading(false);
      }
    }, 1500);

    // Vérifier si retour d'une redirection Google Auth si un flux redirect était en attente
    handleGoogleRedirectResult().catch(() => {});

    // onAuthStateChanged comme unique source de vérité de session
    const unsubscribe = onAuthUserChanged(async (user) => {
      if (!isMounted) return;

      if (user) {
        setCurrentUser(user);
        // Ensure UI is unblocked immediately
        setAuthLoading(false);

        try {
          // Asynchronously load profile and sync modules without blocking initial render
          let profile = await fetchUserProfile(user.uid);
          if (!profile && isMounted) {
            // Première connexion Google : sauvegarde minimale sans écrasement
            profile = await saveGoogleUserProfile(user);
          }
          if (profile && isMounted) {
            setUserProfile(profile);
          }
          if (isMounted) {
            await syncModulesFromFirestore(user.uid);
          }
        } catch (err) {
          console.warn('[AuthContext] Erreur chargement profil utilisateur:', err);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(GUEST_PROFILE);
        setAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setUserProfile(GUEST_PROFILE);
    } catch (err) {
      console.error('[AuthContext] Erreur lors de la déconnexion:', err);
    }
  };

  const reloadProfile = async () => {
    if (currentUser) {
      const profile = await fetchUserProfile(currentUser.uid);
      if (profile) {
        setUserProfile(profile);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAuthenticated: !!currentUser,
        authLoading,
        setUserProfile,
        logout,
        reloadProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé au sein d’un AuthProvider');
  }
  return context;
};
