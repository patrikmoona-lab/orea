import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ValueBar } from './components/ValueBar';
import { UniversesOverview } from './components/UniversesOverview';
import { AboutSection } from './components/AboutSection';
import { HealthUniverseSection } from './components/HealthUniverseSection';
import { HelpBanner } from './components/HelpBanner';
import { CategoryModal } from './components/CategoryModal';
import { SearchModal } from './components/SearchModal';
import { ResourcesModal } from './components/ResourcesModal';
import { MobileMenu } from './components/MobileMenu';
import { Footer } from './components/Footer';
import { OreaLoader } from './components/OreaLoader';
import { OreaSanteView } from './components/OreaSanteView';
import { OreaUrgenceView } from './components/OreaUrgenceView';
import { OreaMedicamentsView } from './components/OreaMedicamentsView';
import { OreaAgendaView } from './components/OreaAgendaView';
import { OreaCycleView } from './components/OreaCycleView';
import { OreaWorkoutView } from './components/OreaWorkoutView';
import { OreaNutritionView } from './components/OreaNutritionView';
import { OreaEducationView } from './components/OreaEducationView';
import { OreaFinanceView } from './components/OreaFinanceView';
import { OreaPlannerView } from './components/OreaPlannerView';
import { OreaAssistantChat } from './components/OreaAssistantChat';
import { OreaSymptomCheckerView } from './components/OreaSymptomCheckerView';
import { OreaEncyclopediaView } from './components/OreaEncyclopediaView';
import { OreaHydrationCalculator } from './components/OreaHydrationCalculator';
import { OreaHabitTrackerView } from './components/OreaHabitTrackerView';
import { OreaFamilyProfilesView } from './components/OreaFamilyProfilesView';
import { OreaDocumentsArchiveView } from './components/OreaDocumentsArchiveView';
import { OreaMonOreaDashboard } from './components/OreaMonOreaDashboard';
import { SettingsView } from './components/SettingsView';
import { AdminView } from './components/AdminView';
import { OreaExportPdfModal } from './components/common/OreaExportPdfModal';
import { PricingView } from './components/pricing/PricingView';
import { CheckoutView } from './components/payment/CheckoutView';
import { PaymentSuccessView } from './components/payment/PaymentSuccessView';
import { PaymentPendingView } from './components/payment/PaymentPendingView';
import { PaymentFailedView } from './components/payment/PaymentFailedView';
import { AuthView } from './components/AuthView';
import { OreaPrivacyView } from './components/legal/OreaPrivacyView';
import { OreaTermsView } from './components/legal/OreaTermsView';
import { CookiePreferencesView } from './components/legal/CookiePreferencesView';
import { CookieBanner } from './components/legal/CookieBanner';
import { NotFoundView } from './components/NotFoundView';
import { updateDocumentSEO } from './utils/seo';
import { useAuth } from './context/AuthContext';
import { HEALTH_CARDS, VALUE_BAR_ITEMS } from './data';
import {
  NavSection,
  HealthCategoryKey,
  HealthCardItem,
  SymptomTopic,
  PlanId,
  BillingCycle,
  PaymentTransaction,
  OreaSubscription,
  OreaUserProfile,
} from './types';
import { PaymentResult } from './services/payments/types';

// Default guest profile so features work directly with full capability without login
const GUEST_PROFILE: OreaUserProfile = {
  uid: 'guest-user',
  firstName: 'Visiteur',
  lastName: 'OREA',
  displayName: 'Membre OREA',
  email: 'utilisateur@orea.app',
  gender: 'non-specifie',
  whatsapp: '+241 00 00 00 00',
  country: 'Gabon',
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
  onboardingCompleted: true,
};

export default function App() {
  const { userProfile, setUserProfile, authLoading } = useAuth();
  const resolveInitialNav = (): NavSection => {
    if (typeof window === 'undefined') return 'accueil';
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    const hash = window.location.hash.replace('#', '').toLowerCase();

    // Pages Légales Publiques
    if (path === '/confidentialite' || hash.includes('confidentialite') || hash === 'privacy') {
      return 'confidentialite';
    }
    if (
      path === '/conditions-utilisation' ||
      path === '/conditions_utilisation' ||
      hash.includes('conditions-utilisation') ||
      hash.includes('conditions_utilisation') ||
      hash === 'cgu' ||
      hash === 'terms'
    ) {
      return 'conditions_utilisation';
    }
    if (
      path === '/preferences-cookies' ||
      path === '/preferences_cookies' ||
      hash.includes('preferences-cookies') ||
      hash.includes('preferences_cookies') ||
      hash === 'cookies'
    ) {
      return 'preferences_cookies';
    }

    // Pages & Univers Publics OREA
    if (path === '/sante' || hash === 'sante') return 'sante';
    if (path === '/urgence' || path === '/sos' || hash === 'urgence' || hash === 'sos') return 'urgence';
    if (path === '/medicaments' || hash === 'medicaments') return 'medicaments';
    if (path === '/agenda' || hash === 'agenda') return 'agenda';
    if (path === '/tarifs' || path === '/pricing' || hash === 'tarifs' || hash === 'pricing') return 'pricing';
    if (path === '/symptom-checker' || hash === 'symptom-checker') return 'symptom_checker';
    if (path === '/encyclopedie' || hash === 'encyclopedie') return 'encyclopedie';
    if (path === '/hydratation' || hash === 'hydratation') return 'hydratation';

    // Espaces Mon OREA & Mon Suivi (routes avec préfixe ou directes)
    if (path.startsWith('/mon-orea') || hash.includes('mon-orea')) {
      if (path.includes('objectifs') || path.includes('objectif') || hash.includes('objectifs') || hash.includes('objectif')) return 'objectifs';
      if (path.includes('progression') || hash.includes('progression')) return 'progression';
      if (path.includes('activite') || path.includes('activites') || hash.includes('activite')) return 'activite';
      if (path.includes('notifications') || path.includes('notification') || hash.includes('notifications')) return 'notifications';
      if (path.includes('cycle') || hash.includes('cycle')) return 'cycle';
      if (path.includes('sport') || hash.includes('sport') || path.includes('workout') || path.includes('forme') || path.includes('energie') || hash.includes('energie')) return 'sport';
      if (path.includes('nutrition') || hash.includes('nutrition')) return 'nutrition';
      if (path.includes('education') || hash.includes('education') || path.includes('evolution') || path.includes('eloquence') || path.includes('etude')) return 'education';
      if (path.includes('finance') || hash.includes('finance')) return 'finance';
      if (path.includes('planner') || hash.includes('planner')) return 'planner';
      if (path.includes('profil') || hash.includes('profil')) return 'profil';
      if (path.includes('parametre') || hash.includes('parametre') || path.includes('settings')) return 'parametres';
      return 'mon_orea';
    }

    // Direct section paths & aliases
    if (path === '/forme' || path === '/sport' || path === '/workout' || path === '/energie' || hash === 'forme' || hash === 'sport' || hash === 'workout' || hash === 'energie') return 'sport';
    if (path === '/nutrition' || hash === 'nutrition') return 'nutrition';
    if (path === '/cycle' || path === '/sante-feminine' || path === '/mon-cycle' || hash === 'cycle' || hash === 'sante-feminine') return 'cycle';
    if (path === '/education' || path === '/evolution' || path === '/eloquence' || path === '/etudes' || path === '/etude' || hash === 'education' || hash === 'evolution' || hash === 'etudes' || hash === 'etude') return 'education';
    if (path === '/finance' || hash === 'finance') return 'finance';
    if (path === '/planner' || hash === 'planner') return 'planner';
    if (path === '/esprit' || path === '/sommeil' || hash === 'esprit' || hash === 'sommeil') return 'sommeil';
    if (path === '/bien-etre' || path === '/bien_etre' || path === '/habitudes' || hash === 'bien-etre' || hash === 'bien_etre' || hash === 'habitudes') return 'habitudes';
    if (path === '/vie' || hash === 'vie') return 'mon_orea';
    if (path === '/profil' || path === '/profile' || hash === 'profil' || hash === 'profile') return 'profil';
    if (path === '/parametres' || path === '/settings' || hash === 'parametres' || hash === 'settings') return 'parametres';
    if (path === '/objectifs' || path === '/objectif' || hash === 'objectifs' || hash === 'objectif') return 'objectifs';
    if (path === '/progression' || hash === 'progression') return 'progression';
    if (path === '/activite' || path === '/activites' || hash === 'activite' || hash === 'activites') return 'activite';
    if (path === '/notifications' || path === '/notification' || hash === 'notifications' || hash === 'notification') return 'notifications';

    // Auth & Espace privé
    if (path === '/connexion' || path === '/login' || hash === 'connexion' || hash === 'login') return 'connexion';
    if (path === '/inscription' || path === '/register' || hash === 'inscription' || hash === 'register') return 'register';
    if (path === '/checkout' || hash === 'checkout') return 'checkout';
    if (path === '/payment-pending') return 'payment-pending';
    if (path === '/payment-success') return 'payment-success';
    if (path === '/payment-failed') return 'payment-failed';
    if (path === '/dashboard' || hash === 'dashboard') return 'dashboard';
    if (path === '/assistant' || path === '/ia' || path === '/ia-assistant' || hash === 'assistant' || hash === 'ia') return 'assistant';
    if (path === '/famille' || hash === 'famille') return 'famille';
    if (path === '/documents' || hash === 'documents') return 'documents';
    if (path === '/admin' || hash === 'admin') return 'admin';

    // Accueil
    if (
      path === '/' ||
      path === '' ||
      path === '/index.html' ||
      path === '/index' ||
      path === '/accueil'
    ) {
      return 'accueil';
    }

    // Route inconnue -> 404
    return '404';
  };

  const [activeNav, setActiveNav] = useState<NavSection>(resolveInitialNav);

  // Mise à jour continue du SEO (Title, Meta Description, Canonical, Robots, Open Graph, Schema.org)
  useEffect(() => {
    updateDocumentSEO(activeNav);
  }, [activeNav]);

  const isLegalRoute =
    activeNav === 'confidentialite' ||
    activeNav === 'conditions_utilisation' ||
    activeNav === 'conditions-utilisation' ||
    activeNav === 'preferences_cookies' ||
    activeNav === 'preferences-cookies';

  const isAdminRoute = [
    'mon_orea',
    'dashboard',
    'cycle',
    'sport',
    'workout',
    'forme',
    'nutrition',
    'education',
    'evolution',
    'eloquence',
    'etudes',
    'finance',
    'planner',
    'objectifs',
    'progression',
    'activite',
    'notifications',
    'profil',
    'vie',
  ].includes(activeNav);

  // Synchronisation avec l'historique du navigateur (Précédent / Suivant)
  useEffect(() => {
    const handlePopState = () => {
      setActiveNav(resolveInitialNav());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);
  const [selectedCategory, setSelectedCategory] = useState<HealthCardItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPdfExportModalOpen, setIsPdfExportModalOpen] = useState(false);
  const [activeFamilyMemberId, setActiveFamilyMemberId] = useState('member-main');

  // Centralized OreaLoader state: Smooth initial splash with guaranteed display safety timeout
  const [minTimeReached, setMinTimeReached] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [loaderFinished, setLoaderFinished] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);

  useEffect(() => {
    // Elegant quick splash (1000ms)
    const minTimer = setTimeout(() => {
      setMinTimeReached(true);
    }, 1000);

    // Hard safety timeout: Ensure site displays even if auth or network is slow (max 2200ms)
    const safetyTimer = setTimeout(() => {
      setMinTimeReached(true);
      setAppReady(true);
      setLoaderFinished(true);
    }, 2200);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  useEffect(() => {
    if (!authLoading) {
      setAppReady(true);
    }
  }, [authLoading]);

  // Loading screen displayed only while loader is animating to completion
  const showOreaLoader = !loaderFinished;

  // Payment State
  const [selectedPlan, setSelectedPlan] = useState<{ planId: PlanId; billingCycle: BillingCycle }>({
    planId: 'plus',
    billingCycle: 'monthly',
  });
  const [activePaymentPending, setActivePaymentPending] = useState<PaymentResult | null>(null);
  const [confirmedPayment, setConfirmedPayment] = useState<{
    payment: PaymentTransaction;
    subscription: OreaSubscription;
  } | null>(null);
  const [paymentFailedReason, setPaymentFailedReason] = useState<string | null>(null);

  // Navigation click handler
  const handleSelectNav = (section: NavSection) => {
    setActiveNav(section);

    if (section === 'confidentialite') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/confidentialite') {
        window.history.pushState({}, '', '/confidentialite');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'conditions_utilisation' || section === 'conditions-utilisation') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/conditions-utilisation') {
        window.history.pushState({}, '', '/conditions-utilisation');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'preferences_cookies' || section === 'preferences-cookies') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/preferences-cookies') {
        window.history.pushState({}, '', '/preferences-cookies');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'sante') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/sante') {
        window.history.pushState({}, '', '/sante');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'urgence') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/urgence') {
        window.history.pushState({}, '', '/urgence');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'medicaments') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/medicaments') {
        window.history.pushState({}, '', '/medicaments');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'agenda') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/agenda') {
        window.history.pushState({}, '', '/agenda');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'pricing') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/tarifs') {
        window.history.pushState({}, '', '/tarifs');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'symptom_checker') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/symptom-checker') {
        window.history.pushState({}, '', '/symptom-checker');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'encyclopedie') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/encyclopedie') {
        window.history.pushState({}, '', '/encyclopedie');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'hydratation') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/hydratation') {
        window.history.pushState({}, '', '/hydratation');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'connexion') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/connexion') {
        window.history.pushState({}, '', '/connexion');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'register') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/inscription') {
        window.history.pushState({}, '', '/inscription');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'mon_orea') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea') {
        window.history.pushState({}, '', '/mon-orea');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'objectifs') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea/objectifs') {
        window.history.pushState({}, '', '/mon-orea/objectifs');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'progression') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea/progression') {
        window.history.pushState({}, '', '/mon-orea/progression');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'activite') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea/activite') {
        window.history.pushState({}, '', '/mon-orea/activite');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'notifications') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea/notifications') {
        window.history.pushState({}, '', '/mon-orea/notifications');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'cycle') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea/cycle') {
        window.history.pushState({}, '', '/mon-orea/cycle');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'sport' || section === 'workout' || section === 'forme' || section === 'energie') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea/sport') {
        window.history.pushState({}, '', '/mon-orea/sport');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'nutrition') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea/nutrition') {
        window.history.pushState({}, '', '/mon-orea/nutrition');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'education' || section === 'evolution' || section === 'eloquence' || section === 'etudes') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea/education') {
        window.history.pushState({}, '', '/mon-orea/education');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'finance') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea/finance') {
        window.history.pushState({}, '', '/mon-orea/finance');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'planner') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea/planner') {
        window.history.pushState({}, '', '/mon-orea/planner');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'profil') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea/profil') {
        window.history.pushState({}, '', '/mon-orea/profil');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'parametres') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea/parametres') {
        window.history.pushState({}, '', '/mon-orea/parametres');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'vie') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea') {
        window.history.pushState({}, '', '/mon-orea');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'sos') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/urgence') {
        window.history.pushState({}, '', '/urgence');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'bien_etre') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/habitudes') {
        window.history.pushState({}, '', '/habitudes');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'esprit') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/sante') {
        window.history.pushState({}, '', '/sante');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'admin') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/admin') {
        window.history.pushState({}, '', '/admin');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'dashboard') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/mon-orea') {
        window.history.pushState({}, '', '/mon-orea');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'accueil') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/' && !window.location.pathname.includes('mon-orea')) {
        window.history.pushState({}, '', '/');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'apropos') {
      if (activeNav !== 'accueil') {
        setActiveNav('accueil');
        setTimeout(() => {
          const el = document.getElementById('section-apropos');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById('section-apropos');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (section === 'ressources') {
      setIsResourcesOpen(true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Category card click
  const handleSelectCategory = (key: HealthCategoryKey) => {
    const found = HEALTH_CARDS.find((c) => c.id === key);
    if (found) {
      setSelectedCategory(found);
    }
  };

  // Value bar item click
  const handleValueBarClick = (id: string) => {
    if (id === 'val-1') {
      handleSelectCategory('symptomes');
    } else if (id === 'val-2') {
      handleSelectCategory('prevention');
    } else if (id === 'val-3') {
      handleSelectCategory('nutrition');
    } else if (id === 'val-4') {
      setIsResourcesOpen(true);
    }
  };

  // Search topic selection
  const handleSelectSearchTopic = (topic: SymptomTopic) => {
    setIsSearchOpen(false);
    const categoryMatch = HEALTH_CARDS.find((c) => c.id === 'symptomes') || HEALTH_CARDS[0];
    setSelectedCategory(categoryMatch);
  };

  return (
    <div className="min-h-screen w-full bg-white text-[#0f2347] flex flex-col overflow-x-hidden selection:bg-[#0056d6] selection:text-white">
      {/* Official OreaLoader — Minimum 3000ms duration + application readiness */}
      {showOreaLoader && (
        <OreaLoader
          isReady={appReady && minTimeReached}
          minDuration={1000}
          timeoutMs={3000}
          error={appError}
          onRetry={() => {
            setAppError(null);
            setLoaderFinished(true);
          }}
          onFinish={() => setLoaderFinished(true)}
        />
      )}

      {/* FULL WIDTH NAVBAR (Toujours visible et collante) */}
      {activeNav !== 'assistant' && !isAdminRoute && !isLegalRoute && (
        <Header
          activeNav={activeNav}
          onSelectNav={handleSelectNav}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />
      )}

      {/* RENDER DEDICATED UNIVERSE VIEWS OR HOME */}
      <main className="flex-1 w-full">
        {activeNav === 'sante' && (
          <OreaSanteView
            onBackToHome={() => handleSelectNav('accueil')}
          />
        )}

        {activeNav === 'urgence' && (
          <OreaUrgenceView
            onBackToHome={() => handleSelectNav('accueil')}
          />
        )}

        {activeNav === 'medicaments' && (
          <OreaMedicamentsView
            onBackToHome={() => handleSelectNav('accueil')}
          />
        )}

        {activeNav === 'agenda' && (
          <OreaAgendaView
            onBackToHome={() => handleSelectNav('accueil')}
          />
        )}

        {isAdminRoute && (
          <OreaMonOreaDashboard
            currentUserProfile={userProfile || GUEST_PROFILE}
            onNavigate={handleSelectNav}
            onBackToHome={() => handleSelectNav('accueil')}
            activeNav={activeNav}
          />
        )}

        {activeNav === 'parametres' && (
          <SettingsView
            onNavigate={handleSelectNav}
            onBackToHome={() => handleSelectNav('accueil')}
          />
        )}

        {activeNav === 'admin' && (
          <AdminView
            userProfile={userProfile}
            onNavigate={handleSelectNav}
            initialTab="suivi"
          />
        )}

        {activeNav === 'assistant' && (
          <OreaAssistantChat
            onBackToHome={() => handleSelectNav('accueil')}
            onNavigateSection={handleSelectNav}
          />
        )}

        {activeNav === 'symptom_checker' && (
          <OreaSymptomCheckerView
            onNavigateToUrgence={() => handleSelectNav('urgence')}
          />
        )}

        {activeNav === 'encyclopedie' && (
          <OreaEncyclopediaView
            onNavigateToUrgence={() => handleSelectNav('urgence')}
            onNavigateToAssistant={() => handleSelectNav('assistant')}
          />
        )}

        {activeNav === 'hydratation' && (
          <OreaHydrationCalculator />
        )}

        {(activeNav === 'habitudes' || activeNav === 'sommeil' || activeNav === 'bien_etre') && (
          <OreaHabitTrackerView
            userProfile={userProfile}
            onUpgradeToPro={() => handleSelectNav('pricing')}
          />
        )}

        {activeNav === 'famille' && (
          <OreaFamilyProfilesView
            userProfile={userProfile}
            activeMemberId={activeFamilyMemberId}
            onSelectMember={(mId) => setActiveFamilyMemberId(mId)}
            onGoToPricing={() => handleSelectNav('pricing')}
          />
        )}

        {activeNav === 'documents' && (
          <OreaDocumentsArchiveView
            userProfile={userProfile}
            onOpenPdfExport={() => setIsPdfExportModalOpen(true)}
          />
        )}

        {/* OREA AUTHENTIFICATION / CONNEXION / INSCRIPTION */}
        {(activeNav === 'auth' || activeNav === 'connexion' || activeNav === 'register') && (
          <AuthView
            initialMode={activeNav === 'register' ? 'register' : 'login'}
            onNavigate={handleSelectNav}
            onAuthSuccess={(profile) => {
              setUserProfile(profile);
              handleSelectNav('mon_orea');
            }}
          />
        )}

        {/* OREA PRICING / TARIFS */}
        {activeNav === 'pricing' && (
          <PricingView
            currentUserProfile={userProfile}
            onSelectPlan={(planId, billingCycle) => {
              setSelectedPlan({ planId, billingCycle });
              handleSelectNav('checkout');
            }}
            onNavigateToAuth={() => handleSelectNav('auth')}
            onNavigateToDashboard={() => handleSelectNav('accueil')}
          />
        )}

        {/* OREA CHECKOUT / PAIEMENT */}
        {activeNav === 'checkout' && (
          <CheckoutView
            planId={selectedPlan.planId}
            billingCycle={selectedPlan.billingCycle}
            currentUserProfile={userProfile}
            onBackToPricing={() => handleSelectNav('pricing')}
            onPaymentPending={(pendingResult) => {
              setActivePaymentPending(pendingResult);
              handleSelectNav('payment-pending');
            }}
            onPaymentSuccess={(payment, subscription) => {
              setUserProfile((prev) => ({ ...prev, subscription }));
              setConfirmedPayment({ payment, subscription });
              handleSelectNav('payment-success');
            }}
            onPaymentFailed={(reason) => {
              setPaymentFailedReason(reason);
              handleSelectNav('payment-failed');
            }}
          />
        )}

        {/* PAYMENT PENDING VIEW */}
        {activeNav === 'payment-pending' && activePaymentPending && (
          <PaymentPendingView
            paymentResult={activePaymentPending}
            onPaymentConfirmed={(payment, subscription) => {
              setUserProfile((prev) => ({ ...prev, subscription }));
              setConfirmedPayment({ payment, subscription });
              handleSelectNav('payment-success');
            }}
            onCancel={() => handleSelectNav('checkout')}
          />
        )}

        {/* PAYMENT SUCCESS VIEW */}
        {activeNav === 'payment-success' && confirmedPayment && (
          <PaymentSuccessView
            payment={confirmedPayment.payment}
            subscription={confirmedPayment.subscription}
            currentUserProfile={userProfile}
            onGoToDashboard={() => handleSelectNav('accueil')}
          />
        )}

        {/* PAYMENT FAILED VIEW */}
        {activeNav === 'payment-failed' && (
          <PaymentFailedView
            reason={paymentFailedReason || undefined}
            onRetry={() => handleSelectNav('checkout')}
            onChangePaymentMethod={() => handleSelectNav('checkout')}
          />
        )}

        {/* OREA LEGAL: POLITIQUE DE CONFIDENTIALITÉ */}
        {activeNav === 'confidentialite' && (
          <OreaPrivacyView onNavigate={handleSelectNav} />
        )}

        {/* OREA LEGAL: CONDITIONS D'UTILISATION */}
        {(activeNav === 'conditions_utilisation' || activeNav === 'conditions-utilisation') && (
          <OreaTermsView onNavigate={handleSelectNav} />
        )}

        {/* OREA LEGAL: GESTION DES COOKIES */}
        {(activeNav === 'preferences_cookies' || activeNav === 'preferences-cookies') && (
          <CookiePreferencesView onNavigate={handleSelectNav} />
        )}

        {/* 404 NOT FOUND */}
        {activeNav === '404' && (
          <NotFoundView onNavigate={handleSelectNav} />
        )}

        {/* DEFAULT: HOME VIEW (ACCUEIL & A PROPOS) */}
        {(activeNav === 'accueil' || activeNav === 'apropos' || activeNav === 'ressources') && (
          <>
            {/* Hero Section - Diaporama OREA Responsive & Infini */}
            <Hero
              onNavigate={handleSelectNav}
              onExploreHealth={() => handleSelectNav('sante')}
              onDiscoverPrevention={() => handleSelectCategory('prevention')}
            />

            {/* Value Bar (4 piliers clés) */}
            <ValueBar
              items={VALUE_BAR_ITEMS}
              onItemClick={handleValueBarClick}
            />

            {/* LES 4 UNIVERS OREA (Santé, Urgence, Médicaments, Agenda) */}
            <UniversesOverview
              onNavigate={(universeId) => {
                handleSelectNav(universeId);
              }}
            />

            {/* Section À Propos */}
            <AboutSection />

            {/* Section Nos Thématiques Santé */}
            <HealthUniverseSection
              cards={HEALTH_CARDS}
              onSelectCategory={handleSelectCategory}
            />

            {/* Help Banner 24/7 */}
            <HelpBanner onOpenResources={() => setIsResourcesOpen(true)} />
          </>
        )}
      </main>

      {/* FOOTER */}
      {activeNav !== 'assistant' && !isAdminRoute && !isLegalRoute && (
        <Footer
          onSelectNav={handleSelectNav}
          onOpenPrivacy={() => handleSelectNav('confidentialite')}
          onOpenTerms={() => handleSelectNav('conditions_utilisation')}
          onOpenContact={() => setIsResourcesOpen(true)}
        />
      )}

      {/* MODALS */}
      <CategoryModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
        onSwitchCategory={handleSelectCategory}
        allCategories={HEALTH_CARDS}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTopic={handleSelectSearchTopic}
      />

      <ResourcesModal
        isOpen={isResourcesOpen}
        onClose={() => setIsResourcesOpen(false)}
      />

      <OreaExportPdfModal
        isOpen={isPdfExportModalOpen}
        onClose={() => setIsPdfExportModalOpen(false)}
        userProfile={userProfile}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        activeNav={activeNav}
        onClose={() => setIsMobileMenuOpen(false)}
        onSelectNav={handleSelectNav}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* BANNIÈRE DE CONSENTEMENT AUX COOKIES (NON-BLOQUANTE) */}
      <CookieBanner onNavigate={handleSelectNav} />

      {/* BOUTON FLOTTANT RACCOURCI PARAMÈTRES (TOUT À DROITE DE L'ÉCRAN) */}
      <aside aria-label="Raccourci Paramètres" className="fixed right-3 sm:right-5 bottom-5 sm:bottom-6 z-40">
        <button
          type="button"
          onClick={() => handleSelectNav('parametres')}
          aria-label="Accéder aux Paramètres OREA"
          className={`group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-2xl shadow-xl transition-all duration-200 cursor-pointer border ${
            activeNav === 'parametres'
              ? 'bg-[#0056d6] text-white border-blue-400 ring-4 ring-blue-500/20 scale-105'
              : 'bg-white/95 dark:bg-[#0e192d]/95 backdrop-blur-md text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:border-[#0056d6] hover:text-[#0056d6] dark:hover:text-blue-400 hover:scale-110 hover:shadow-2xl'
          }`}
          title="Paramètres de l'application"
        >
          <SettingsIcon
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${
              activeNav === 'parametres' ? 'rotate-90 text-white' : 'group-hover:rotate-45'
            }`}
          />

          {/* Tooltip on hover (desktop) */}
          <span className="pointer-events-none absolute right-full mr-3 hidden sm:group-hover:flex items-center px-2.5 py-1.5 rounded-xl bg-slate-900/90 text-white text-[11px] font-bold whitespace-nowrap shadow-lg backdrop-blur-xs animate-in fade-in slide-in-from-right-2 duration-150">
            <span>⚙️ Paramètres</span>
            <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-900/90" />
          </span>

          {/* Notification / Active pulse dot */}
          {activeNav === 'parametres' && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0e192d]" />
          )}
        </button>
      </aside>
    </div>
  );
}
