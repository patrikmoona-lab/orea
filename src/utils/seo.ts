/**
 * Configuration & Services SEO pour OREA Santé
 * Gestion dynamique des balises meta, URL canoniques, robots, Open Graph, Twitter Cards et Schema.org
 */

export const DEFAULT_PRODUCTION_DOMAIN = 'https://oreasante.com';

export interface RouteSeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
  robots: string;
  ogType: 'website' | 'article';
  isPublic: boolean;
  ogImage?: string;
}

/**
 * Détermine l'origine du site pour les URLs canoniques et partages sociaux
 * Utilise la variable d'environnement si fournie, sinon l'origine du navigateur en production,
 * avec repli vers DEFAULT_PRODUCTION_DOMAIN
 */
export function getSiteOrigin(): string {
  // 1. Variable d'environnement client Vite (si définie au build ou runtime)
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) {
    return (import.meta.env.VITE_SITE_URL as string).replace(/\/+$/, '');
  }

  // 2. Origine du navigateur (évite localhost pour le SEO externe s'il est exécuté localement)
  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = window.location.origin;
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return origin.replace(/\/+$/, '');
    }
  }

  // 3. Domaine de référence de production OREA
  return DEFAULT_PRODUCTION_DOMAIN;
}

/**
 * Métadonnées SEO exhaustives pour l'ensemble des routes OREA
 */
export const SEO_ROUTES_MAP: Record<string, RouteSeoConfig> = {
  // ==========================================
  // PAGES PUBLIQUES INDEXABLES (Googlebot autorisé)
  // ==========================================
  accueil: {
    title: 'OREA — Santé, bien-être, apprentissage, budget et organisation',
    description:
      'OREA accompagne votre quotidien avec des espaces dédiés au cycle, au sport, à la nutrition, aux études, au budget et à l’organisation personnelle.',
    canonicalPath: '/',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    isPublic: true,
  },
  sante: {
    title: 'Espace Santé & Prévention — OREA',
    description:
      'Consultez les recommandations de santé préventive, les fiches médicales validées et les réflexes bien-être pour toute la famille avec OREA.',
    canonicalPath: '/sante',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    isPublic: true,
  },
  urgence: {
    title: 'Urgences & Numéros d’aide vitale — OREA Assistance',
    description:
      'Accès rapide aux numéros d’urgence vitale, protocoles de premiers secours et géolocalisation des centres médicaux à proximité avec OREA.',
    canonicalPath: '/urgence',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    isPublic: true,
  },
  medicaments: {
    title: 'Armoire à pharmacie & Posologies — OREA Santé',
    description:
      'Gérez votre armoire à pharmacie, suivez les posologies, respectez les ordonnances et prévenez les interactions médicamenteuses.',
    canonicalPath: '/medicaments',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    isPublic: true,
  },
  agenda: {
    title: 'Agenda médical & Rappels de consultations — OREA Santé',
    description:
      'Organisez vos rendez-vous de santé, planifiez les consultations médicales et recevez des alertes de suivi pour vous et vos proches.',
    canonicalPath: '/agenda',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    isPublic: true,
  },
  pricing: {
    title: 'Tarifs & Abonnements OREA — Formules Essentiel, Plus, Premium & Pro',
    description:
      'Découvrez les offres d’abonnement OREA adaptées aux particuliers, étudiants et familles : options gratuites et formules complètes payables en FCFA.',
    canonicalPath: '/tarifs',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    isPublic: true,
  },
  symptom_checker: {
    title: 'Orientation médicale & Symptômes — OREA Santé',
    description:
      'Outil d’orientation et d’analyse préliminaire des symptômes courants pour vous guider sereinement vers la consultation médicale adaptée.',
    canonicalPath: '/symptom-checker',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    isPublic: true,
  },
  encyclopedie: {
    title: 'Encyclopédie médicale & Fiches réflexes — OREA Santé',
    description:
      'Consultez l’encyclopédie médicale OREA : fiches de synthèse claires, fiables et sans jargon sur les pathologies courantes et la prévention.',
    canonicalPath: '/encyclopedie',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    isPublic: true,
  },
  hydratation: {
    title: 'Calculateur d’hydratation quotidienne — OREA Santé',
    description:
      'Estimez avec précision vos besoins quotidiens en eau selon votre niveau d’activité, votre climat et votre profil physiologique avec OREA.',
    canonicalPath: '/hydratation',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    isPublic: true,
  },
  confidentialite: {
    title: 'Politique de confidentialité — OREA Santé & Souveraineté des données',
    description:
      'Protection absolue de vos données de santé, conformité RGPD, traitement IA sécurisé sans entraînement public et non-vente de vos informations.',
    canonicalPath: '/confidentialite',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'article',
    isPublic: true,
  },
  conditions_utilisation: {
    title: 'Conditions d’utilisation — OREA Santé & Cadre légal',
    description:
      'Conditions générales d’utilisation des services OREA : règles d’accès, engagements éthiques, abonnements et responsabilités légales.',
    canonicalPath: '/conditions-utilisation',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'article',
    isPublic: true,
  },
  'conditions-utilisation': {
    title: 'Conditions d’utilisation — OREA Santé & Cadre légal',
    description:
      'Conditions générales d’utilisation des services OREA : règles d’accès, engagements éthiques, abonnements et responsabilités légales.',
    canonicalPath: '/conditions-utilisation',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'article',
    isPublic: true,
  },
  preferences_cookies: {
    title: 'Gestion des cookies et préférences de confidentialité — OREA',
    description:
      'Personnalisez vos préférences de cookies et traceurs locaux sur OREA en toute transparence et selon votre libre consentement.',
    canonicalPath: '/preferences-cookies',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    isPublic: true,
  },
  'preferences-cookies': {
    title: 'Gestion des cookies et préférences de confidentialité — OREA',
    description:
      'Personnalisez vos préférences de cookies et traceurs locaux sur OREA en toute transparence et selon votre libre consentement.',
    canonicalPath: '/preferences-cookies',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    ogType: 'website',
    isPublic: true,
  },

  // ==========================================
  // PAGES PRIVÉES / AUTHENTIFIÉES (INTERDITES D'INDEXATION)
  // ==========================================
  mon_orea: {
    title: 'Mon OREA — Espace Personnel Sécurisé',
    description: 'Espace privé et sécurisé OREA.',
    canonicalPath: '/mon-orea',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  objectifs: {
    title: 'Mes Objectifs — Mon Suivi OREA',
    description: 'Fixez, suivez et atteignez vos objectifs personnels à travers vos espaces OREA.',
    canonicalPath: '/mon-orea/objectifs',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  progression: {
    title: 'Ma Progression — Mon Suivi OREA',
    description: 'Aperçu analytique de l’activation et de l’avancement de vos espaces de vie OREA.',
    canonicalPath: '/mon-orea/progression',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  activite: {
    title: 'Mon Activité — Mon Suivi OREA',
    description: 'Historique et chronologie de vos actions, synchronisations et événements sur OREA.',
    canonicalPath: '/mon-orea/activite',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  notifications: {
    title: 'Mes Notifications — Centre de messages OREA',
    description: 'Consultez et gérez vos rappels, alertes et notifications OREA en temps réel.',
    canonicalPath: '/mon-orea/notifications',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  cycle: {
    title: 'Mon Cycle — Suivi Intime & Bien-être Féminin | OREA',
    description: 'Suivi intime du cycle menstruel OREA.',
    canonicalPath: '/mon-orea/cycle',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  sport: {
    title: 'Mon Sport & Progression | OREA',
    description: 'Programmes d’entraînement et journal de séances OREA.',
    canonicalPath: '/mon-orea/sport',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  workout: {
    title: 'Mes Séances de Sport | OREA',
    description: 'Journal des séances de sport OREA.',
    canonicalPath: '/mon-orea/sport',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  nutrition: {
    title: 'Ma Nutrition & Terroir Africain | OREA',
    description: 'Plans nutritionnels et terroir OREA.',
    canonicalPath: '/mon-orea/nutrition',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  education: {
    title: 'BAC G2 & Révisions SYSCOHADA | OREA',
    description: 'Espace d’apprentissage et annales BAC G2 OREA.',
    canonicalPath: '/mon-orea/education',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  evolution: {
    title: 'Mon Évolution Personnelle | OREA',
    description: 'Objectifs et suivi personnel OREA.',
    canonicalPath: '/mon-orea/evolution',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  eloquence: {
    title: 'Atelier d’Éloquence & Prise de Parole | OREA',
    description: 'Exercices et perfectionnement oral OREA.',
    canonicalPath: '/mon-orea/eloquence',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  finance: {
    title: 'Mon Budget & Finances en FCFA | OREA',
    description: 'Gestion budgétaire et épargne en FCFA OREA.',
    canonicalPath: '/mon-orea/finance',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  planner: {
    title: 'Mon Planner & Organisation Quotidienne | OREA',
    description: 'Planification quotidienne et priorités OREA.',
    canonicalPath: '/mon-orea/planner',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  auth: {
    title: 'Connexion / Inscription — OREA',
    description: 'Accédez à votre espace sécurisé OREA.',
    canonicalPath: '/connexion',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  connexion: {
    title: 'Connexion — OREA',
    description: 'Accédez à votre espace sécurisé OREA.',
    canonicalPath: '/connexion',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  register: {
    title: 'Créer un compte — OREA',
    description: 'Rejoignez OREA et profitez de l’accompagnement personnalisé.',
    canonicalPath: '/inscription',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  checkout: {
    title: 'Paiement Sécurisé — OREA',
    description: 'Finalisation de votre formule OREA.',
    canonicalPath: '/checkout',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  'payment-pending': {
    title: 'Validation du paiement — OREA',
    description: 'Transaction en cours de traitement.',
    canonicalPath: '/payment-pending',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  'payment-success': {
    title: 'Confirmation de paiement — OREA',
    description: 'Votre abonnement OREA est activé.',
    canonicalPath: '/payment-success',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  'payment-failed': {
    title: 'Échec de paiement — OREA',
    description: 'Une erreur est survenue lors du paiement.',
    canonicalPath: '/payment-failed',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  assistant: {
    title: 'Assistant OREA IA — Conversation Sécurisée',
    description: 'Échange confidentiel avec l’assistant OREA.',
    canonicalPath: '/assistant',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  famille: {
    title: 'Profils Famille — OREA Santé',
    description: 'Gestion des profils membres de votre foyer.',
    canonicalPath: '/famille',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  documents: {
    title: 'Archives Médicales & Bilans PDF — OREA',
    description: 'Espace privé de documents de santé.',
    canonicalPath: '/documents',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  habitudes: {
    title: 'Suivi des Habitudes — OREA',
    description: 'Tableau de bord personnel de vos routines.',
    canonicalPath: '/habitudes',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  dashboard: {
    title: 'Tableau de bord — OREA',
    description: 'Espace de bord personnel OREA.',
    canonicalPath: '/dashboard',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
  admin: {
    title: 'Administration OREA',
    description: 'Console d’administration.',
    canonicalPath: '/admin',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },

  // ==========================================
  // PAGE 404 (Erreur introuvable)
  // ==========================================
  '404': {
    title: 'Page introuvable (404) — OREA Santé',
    description: 'La ressource que vous recherchez sur OREA n’existe pas ou a été déplacée.',
    canonicalPath: '/404',
    robots: 'noindex, nofollow',
    ogType: 'website',
    isPublic: false,
  },
};

/**
 * Met à jour dynamiquement toutes les balises d'en-tête (Title, Meta, Canonical, OG, Twitter)
 */
export function updateDocumentSEO(sectionKey: string, customPath?: string): void {
  if (typeof document === 'undefined') return;

  const config = SEO_ROUTES_MAP[sectionKey] || SEO_ROUTES_MAP['accueil'];
  const siteOrigin = getSiteOrigin();
  const canonicalPath = customPath || config.canonicalPath;
  const fullCanonicalUrl = `${siteOrigin}${canonicalPath === '/' ? '' : canonicalPath}`;
  const logoUrl = `${siteOrigin}/orea-logo.png`;

  // 1. Titre du document
  document.title = config.title;

  // 2. Balise Meta Description
  setMetaTag('name', 'description', config.description);

  // 3. Balise Robots (noindex sur les pages privées, index sur les publiques)
  setMetaTag('name', 'robots', config.robots);

  // 4. Balise Canonique
  setCanonicalTag(fullCanonicalUrl);

  // 5. Open Graph (Facebook, WhatsApp, LinkedIn)
  setMetaTag('property', 'og:title', config.title);
  setMetaTag('property', 'og:description', config.description);
  setMetaTag('property', 'og:url', fullCanonicalUrl);
  setMetaTag('property', 'og:type', config.ogType);
  setMetaTag('property', 'og:image', config.ogImage ? `${siteOrigin}${config.ogImage}` : logoUrl);
  setMetaTag('property', 'og:site_name', 'OREA');
  setMetaTag('property', 'og:locale', 'fr_FR');

  // 6. Twitter / X Card
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', config.title);
  setMetaTag('name', 'twitter:description', config.description);
  setMetaTag('name', 'twitter:image', config.ogImage ? `${siteOrigin}${config.ogImage}` : logoUrl);

  // 7. Mise à jour des Données Structurées Schema.org
  updateSchemaOrgData(siteOrigin, fullCanonicalUrl, config);
}

/**
 * Met à jour ou crée une balise meta
 */
function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string): void {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Met à jour ou crée la balise canonique
 */
function setCanonicalTag(url: string): void {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * Génère et injecte le JSON-LD Schema.org conforme
 */
export function updateSchemaOrgData(
  siteOrigin: string,
  currentUrl: string,
  config: RouteSeoConfig
): void {
  if (typeof document === 'undefined') return;

  const schemas: Record<string, unknown>[] = [
    // WebSite
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'OREA',
      alternateName: 'OREA Santé',
      url: siteOrigin,
      description:
        'Plateforme globale d’accompagnement : santé préventive, urgence, armoire à pharmacie, cycle féminin, sport, nutrition africaine, études BAC G2 et finances en FCFA.',
      inLanguage: 'fr-FR',
      publisher: {
        '@type': 'Organization',
        name: 'OREA Santé',
        logo: {
          '@type': 'ImageObject',
          url: `${siteOrigin}/orea-logo.png`,
        },
      },
    },
    // Organization
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'OREA Santé',
      alternateName: 'OREA',
      url: siteOrigin,
      logo: `${siteOrigin}/orea-logo.png`,
      founder: {
        '@type': 'Person',
        name: 'Mr Tsoumou Patrick Bonheur',
      },
      description:
        'Plateforme d’information médicale préventive, d’éducation et d’organisation du quotidien pour l’Afrique et la francophonie.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'support',
        availableLanguage: ['French'],
      },
    },
    // WebApplication
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'OREA',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'All',
      url: siteOrigin,
      inLanguage: 'fr-FR',
      browserRequirements: 'Requires JavaScript. Requires modern web browser.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'XAF',
        availability: 'https://schema.org/InStock',
      },
    },
  ];

  // Si c'est une page d'article légal (Confidentialité / CGU), ajouter DigitalDocument ou Article
  if (config.ogType === 'article') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: config.title,
      description: config.description,
      inLanguage: 'fr-FR',
      mainEntityOfPage: currentUrl,
      publisher: {
        '@type': 'Organization',
        name: 'OREA Santé',
        logo: {
          '@type': 'ImageObject',
          url: `${siteOrigin}/orea-logo.png`,
        },
      },
    });
  }

  // Si c'est une page publique autre que l'accueil, ajouter un BreadcrumbList
  if (config.isPublic && config.canonicalPath !== '/') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: siteOrigin,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: config.title.split('—')[0].trim(),
          item: currentUrl,
        },
      ],
    });
  }

  // Injection dans le DOM
  let script = document.getElementById('orea-schema-org') as HTMLScriptElement;
  if (!script) {
    script = document.createElement('script');
    script.id = 'orea-schema-org';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemas);
}
