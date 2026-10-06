import React, { useEffect } from 'react';
import {
  Shield,
  ArrowLeft,
  Lock,
  Database,
  Bot,
  HeartPulse,
  Coins,
  Cookie,
  UserCheck,
  Mail,
  RefreshCw,
  FileText,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Sliders,
} from 'lucide-react';
import { NavSection } from '../../types';
import { OREALogo } from '../OREALogo';

interface OreaPrivacyViewProps {
  onNavigate: (section: NavSection) => void;
}

export const OreaPrivacyView: React.FC<OreaPrivacyViewProps> = ({ onNavigate }) => {
  // Format date dynamically to current localized date
  const currentDateFormatted = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Politique de confidentialité — OREA';
  }, []);

  const sections = [
    { id: 'qui-est-orea', title: '1. Qui est OREA' },
    { id: 'donnees-collectees', title: '2. Données collectées' },
    { id: 'authentification', title: '3. Authentification & Sécurité des accès' },
    { id: 'firebase-stockage', title: '4. Stockage & Synchronisation Cloud Firestore' },
    { id: 'ia-gemini', title: '5. Traitement par l’Intelligence Artificielle (Gemini)' },
    { id: 'sante-bien-etre', title: '6. Données de santé, bien-être et cycle' },
    { id: 'donnees-financieres', title: '7. Données financières & Budgétaires' },
    { id: 'cookies-stockage-local', title: '8. Cookies et technologies similaires (Gestion du consentement)' },
    { id: 'mesures-securite', title: '9. Mesures de protection et sécurité technique' },
    { id: 'partage-donnees', title: '10. Non-vente et partage avec prestataires techniques' },
    { id: 'conservation-donnees', title: '11. Durée de conservation des données' },
    { id: 'suppression-compte', title: '12. Procédure de suppression du compte et des données' },
    { id: 'droits-utilisateurs', title: '13. Vos droits sur vos données' },
    { id: 'contact', title: '14. Contact et Responsable de traitement' },
    { id: 'mise-a-jour', title: '15. Mise à jour de la présente politique' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbfe] text-[#0f2347] font-sans pb-16">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('accueil')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0056D6] hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <OREALogo variant="compact" size="sm" clickable onClick={() => onNavigate('accueil')} />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('conditions_utilisation')}
              className="text-xs font-semibold text-slate-500 hover:text-[#0056D6] transition-colors cursor-pointer hidden md:inline-block"
            >
              Conditions d'utilisation
            </button>
            <button
              onClick={() => onNavigate('connexion')}
              className="px-3.5 py-1.5 rounded-xl bg-[#0056D6] text-white text-xs font-bold hover:bg-[#0044b2] transition-colors cursor-pointer shadow-2xs"
            >
              Mon Espace
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-white to-[#f0f6ff] border-b border-blue-100 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 text-[#0056D6] text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Document Légal Officiel</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f2347] tracking-tight">
            Politique de confidentialité — OREA
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Votre confidentialité et la protection de vos données sont au cœur de l'expérience OREA.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              Dernière mise à jour : <strong className="text-slate-700">{currentDateFormatted}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Chiffrement HTTPS & Règles Cloud Firestore
            </span>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Table of Contents (Sidebar on Desktop) */}
        <aside className="lg:col-span-4 hidden lg:block">
          <div className="sticky top-24 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sommaire des sections
            </h3>
            <nav className="space-y-1 text-xs">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className="w-full text-left py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#0056D6] hover:bg-blue-50/70 transition-colors font-medium truncate block cursor-pointer"
                >
                  {s.title}
                </button>
              ))}
            </nav>
            <div className="pt-3 border-t border-slate-100">
              <a
                href="mailto:patrik.moona@gmail.com"
                className="text-xs text-[#0056D6] font-semibold hover:underline flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Une question ? patrik.moona@gmail.com</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Main Privacy Text */}
        <main className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xs space-y-10 text-slate-700 text-sm sm:text-[15px] leading-relaxed">
          
          {/* Introduction Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-100 text-blue-950 text-xs sm:text-sm space-y-2">
            <p className="font-semibold">
              Bienvenue sur la Politique de confidentialité d'OREA.
            </p>
            <p className="text-blue-900/90 leading-relaxed">
              La présente politique a pour vocation de vous informer en toute transparence sur la nature, la finalité et le traitement des données personnelles recueillies lors de l’utilisation de la plateforme web OREA.
            </p>
          </div>

          {/* Section 1 */}
          <section id="qui-est-orea" className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <UserCheck className="w-5 h-5 shrink-0" />
              <h2>1. Qui est OREA</h2>
            </div>
            <p>
              <strong>OREA</strong> est une plateforme numérique d'organisation personnelle, d'orientation préventive de santé, d'apprentissage et de gestion du quotidien.
            </p>
            <p>
              La plateforme regroupe des espaces thématiques intégrés dédiés notamment au suivi du cycle féminin et du bien-être, à l'activité physique et sportive, aux conseils nutritionnels de terroir, aux révisions scolaires (notamment BAC G2 et éloquence), à l'organisation budgétaire en FCFA et à la planification journalière.
            </p>
          </section>

          {/* Section 2 */}
          <section id="donnees-collectees" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <FileText className="w-5 h-5 shrink-0" />
              <h2>2. Données collectées</h2>
            </div>
            <p>
              OREA applique le principe de minimisation des données : nous ne collectons que les informations strictement nécessaires aux fonctionnalités que vous activez et utilisez volontairement. Selon les modules employés, OREA peut traiter :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Données de profil de base :</strong> Nom, prénom, adresse e-mail.</li>
              <li><strong>Données issues de Google Authentication :</strong> Photo de profil publique et adresse e-mail lorsque vous optez pour « Continuer avec Google ».</li>
              <li><strong>Coordonnées de communication (facultatives) :</strong> Numéro WhatsApp et pays de résidence si vous choisissez de les renseigner dans votre profil.</li>
              <li><strong>Données des modules personnels :</strong> Paramètres et préférences de configuration de vos espaces.</li>
              <li><strong>Données du cycle et fertilité :</strong> Dates des dernières règles, durée moyenne de cycle renseignées volontairement par l'utilisatrice.</li>
              <li><strong>Symptômes et ressentis :</strong> Symptômes généraux ou menstruels sélectionnés volontairement dans le vérificateur d'orientation.</li>
              <li><strong>Données d'activité physique & sport :</strong> Niveaux d'entraînement, séances effectuées et objectifs sportifs.</li>
              <li><strong>Données nutritionnelles :</strong> Repas enregistrés, préférences culinaires locales et suivi d'hydratation.</li>
              <li><strong>Données d'apprentissage :</strong> Matières révisées, fiches consultées, quiz et progression pour le BAC G2.</li>
              <li><strong>Données financières :</strong> Dépenses, revenus indicatifs et montants d'épargne saisis pour la ventilation budgétaire 50/30/20.</li>
              <li><strong>Données du planner et productivité :</strong> Tâches quotidiennes, plannings, priorités et rappels.</li>
              <li><strong>Objectifs et habitudes :</strong> Suivi de routines, compteurs d'habitudes et jalons personnels.</li>
              <li><strong>Historique d'utilisation :</strong> Date et heure de dernière connexion pour assurer la continuité de service.</li>
              <li><strong>Échanges avec l'IA OREA :</strong> Questions et requêtes formulées à l'assistant virtuel intelligent.</li>
              <li><strong>Données techniques de sécurité :</strong> Adresse IP, type d'appareil, navigateur et journaux techniques strictement requis pour la sécurité de la session et la prévention des abus.</li>
            </ul>
            <p className="text-xs text-slate-500 italic">
              OREA ne collecte aucune donnée bancaire directe (les paiements éventuels sont traités par des passerelles tierces certifiées) ni aucune donnée superflue non liée au service.
            </p>
          </section>

          {/* Section 3 */}
          <section id="authentification" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Lock className="w-5 h-5 shrink-0" />
              <h2>3. Authentification & Sécurité des accès</h2>
            </div>
            <p>
              L’authentification sur OREA est opérée exclusivement via le service sécurisé <strong>Firebase Authentication</strong> (Google Cloud).
            </p>
            <p>
              Deux modes d’accès sont proposés :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Adresse e-mail et mot de passe :</strong> Votre mot de passe est directement haché et géré de manière chiffrée par Firebase Authentication. <strong>Aucun mot de passe en clair ou déchiffrable n’est jamais enregistré dans notre base de données Cloud Firestore.</strong></li>
              <li><strong>Google Authentication (Fournisseur Google) :</strong> En utilisant le bouton « Continuer avec Google », vous vous authentifiez de manière sécurisée via votre compte Google. OREA reçoit un identifiant unique (UID), votre adresse e-mail et votre nom d'affichage. Aucun mot de passe Google ni jeton sensible privé n'est collecté ni stocké par OREA.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="firebase-stockage" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Database className="w-5 h-5 shrink-0" />
              <h2>4. Stockage & Synchronisation Cloud Firestore</h2>
            </div>
            <p>
              Les données de votre compte, vos préférences et le contenu de vos modules sont hébergés sur la base de données <strong>Google Cloud Firestore</strong> dans une région sécurisée d'Europe / Cloud mondial.
            </p>
            <p>
              Ce stockage sécurisé permet :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>La sauvegarde automatique de votre profil et de vos modules ;</li>
              <li>La synchronisation transparente entre votre ordinateur, tablette et smartphone ;</li>
              <li>La restauration instantanée de votre environnement lors de chaque reconnexion.</li>
            </ul>
            <p>
              Chaque enregistrement est rattaché à votre identifiant unique sécurisé (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono">/users/{'{uid}'}</code>) et protégé par des règles de sécurité strictes empêchant tout accès non autorisé par un tiers.
            </p>
          </section>

          {/* Section 5 */}
          <section id="ia-gemini" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Bot className="w-5 h-5 shrink-0" />
              <h2>5. Traitement par l’Intelligence Artificielle (Gemini)</h2>
            </div>
            <p>
              OREA intègre un assistant virtuel intelligent propulsé par l'API <strong>Google Gemini</strong> pour vous aider à synthétiser des conseils, formuler des réponses pédagogiques ou vous guider dans l'organisation de vos activités.
            </p>
            <p className="font-semibold text-slate-800">
              Garanties de contextualisation minimale :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>L'IA Gemini ne dispose <strong>pas</strong> d'un accès illimité ou automatique à l'ensemble de votre base de données Firestore.</li>
              <li>Seules les informations nécessaires et le contexte de la conversation que vous soumettez explicitement sont transmis à l'API afin de générer la réponse attendue.</li>
              <li>Les requêtes transmises sont sécurisées côté serveur et ne sont pas exploitées à des fins de profilage commercial publicitaire tiers.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="sante-bien-etre" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <HeartPulse className="w-5 h-5 shrink-0 text-pink-600" />
              <h2>6. Données de santé, bien-être et cycle féminin</h2>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Avertissement préventif et médical important</span>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Toutes les données de cycle, de symptômes ou de santé sont renseignées <strong>strictement de manière volontaire</strong> par l'utilisateur.</li>
                <li>OREA diffuse des informations à portée <strong>exclusivement éducative, préventive et indicative</strong>.</li>
                <li><strong>OREA ne remplace en aucun cas un médecin, une sage-femme ou un professionnel de santé diplômé.</strong></li>
                <li>Les calculs et estimations du cycle menstruel ou de la période fertile <strong>ne constituent en aucun cas une méthode de contraception</strong>.</li>
                <li>OREA ne pose aucun diagnostic médical ni prescription pharmacologique. En cas de doute, d'urgence ou de malaise, consultez sans délai un médecin ou composez les numéros d'urgence médicale (15, 112, 18).</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section id="donnees-financieres" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Coins className="w-5 h-5 shrink-0 text-emerald-600" />
              <h2>7. Données financières & Budgétaires</h2>
            </div>
            <p>
              Les éléments financiers renseignés dans le module Budget OREA (revenus, postes de dépenses, montants d'épargne) ont pour unique finalité d'aider l'utilisateur à modéliser et visualiser la répartition de ses finances personnelles selon des méthodologies classiques (telle que la règle 50/30/20).
            </p>
            <p>
              OREA n’agit pas en qualité d’établissement bancaire, de conseiller en investissement financier ou d’intermédiaire d'assurance. Les projections, graphiques et résumés ont une valeur purement indicative et ne constituent aucune garantie financière ou prévisionnelle.
            </p>
          </section>

          {/* Section 8 */}
          <section id="cookies-stockage-local" className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Cookie className="w-5 h-5 shrink-0 text-orange-600" />
              <h2>8. Cookies et technologies similaires (Gestion du consentement)</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              OREA utilise des cookies et des mécanismes de stockage local (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">localStorage</code>) pour assurer le bon fonctionnement de la plateforme, sécuriser vos sessions et vous offrir une expérience fluide et personnalisée.
            </p>

            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Catégories de cookies utilisées par OREA :
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
                <li>
                  <strong>Cookies strictement nécessaires (Toujours actifs) :</strong> Indispensables au fonctionnement technique et à la sécurité de l'application (maintien de la session d'authentification Firebase, intégrité des formulaires et sécurité anti-CSRF). Ils ne peuvent pas être désactivés.
                </li>
                <li>
                  <strong>Cookies et stockage de préférences (Optionnels) :</strong> Permettent de mémoriser vos choix locaux de navigation (filtres de recherche récents, préférences d'affichage). Ils nécessitent votre accord préalable et peuvent être activés ou désactivés à tout moment.
                </li>
                <li>
                  <strong>Cookies analytiques et statistiques (Optionnels) :</strong> Utilisés uniquement pour mesurer anonymement l'audience globale, repérer d'éventuels bugs et optimiser la réactivité de la plateforme. Aucun profil publicitaire tiers n'est créé et aucune donnée n'est cédée à des courtiers en données.
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Sliders className="w-4 h-4 text-[#0056D6]" />
                <span>Comment modifier votre consentement à tout moment ?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Vous conservez le contrôle total de vos préférences. Vous pouvez à tout instant accepter, refuser ou personnaliser l'utilisation des cookies non nécessaires directement depuis notre centre de gestion dédié.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('preferences_cookies')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0056D6] text-white font-semibold text-xs sm:text-sm hover:bg-[#0046b3] transition-colors cursor-pointer shadow-sm"
                >
                  <Cookie className="w-4 h-4" />
                  Gérer mes cookies
                </button>
              </div>
            </div>

            <p className="font-semibold text-slate-800 text-xs sm:text-sm">
              Rappel de souveraineté : Le stockage local et les cookies n’enregistrent jamais vos mots de passe en clair, vos données de santé intimes déclarées ou vos échanges avec l’Assistant IA.
            </p>
          </section>

          {/* Section 9 */}
          <section id="mesures-securite" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Lock className="w-5 h-5 shrink-0 text-blue-600" />
              <h2>9. Mesures de protection et sécurité technique</h2>
            </div>
            <p>
              OREA met en œuvre un ensemble de mesures organisationnelles et techniques raisonnables adaptées à la sensibilité des données traitées :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Chiffrement systématique des transferts en transit via le protocole sécurisé <strong>HTTPS / TLS</strong> ;</li>
              <li>Règles de sécurité Firestore granulaires vérifiant l'identité du propriétaire pour chaque opération de lecture et d'écriture (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">request.auth.uid == userId</code>) ;</li>
              <li>Ségrégation stricte des environnements et clés d'API protégées côté serveur ;</li>
              <li>Absence de stockage des mots de passe en clair.</li>
            </ul>
            <p className="text-xs text-slate-500 italic">
              Bien que nous déployions tous les efforts diligents pour préserver l'intégrité de vos données, aucun système informatique connecté à Internet ne peut garantir une sécurité absolue et infaillible contre toutes les attaques malveillantes.
            </p>
          </section>

          {/* Section 10 */}
          <section id="partage-donnees" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <h2>10. Non-vente et partage avec prestataires techniques</h2>
            </div>
            <p className="font-semibold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              OREA ne vend, ne loue et ne commercialise JAMAIS vos données personnelles à des tiers ou courtiers de données publicitaires.
            </p>
            <p>
              Les données sont partagées exclusivement avec les sous-traitants techniques strictement nécessaires à l'exécution de la plateforme :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Google Cloud Platform & Firebase :</strong> Pour l'hébergement serveur, la gestion de la base de données Firestore et l'infrastructure d'authentification.</li>
              <li><strong>Google Cloud Gemini AI :</strong> Pour le traitement et la génération des réponses textuelles au sein de l'assistant interactif OREA.</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section id="conservation-donnees" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Database className="w-5 h-5 shrink-0 text-slate-600" />
              <h2>11. Durée de conservation des données</h2>
            </div>
            <p>
              Vos données personnelles sont conservées aussi longtemps que votre compte utilisateur demeure actif au sein du service OREA, ou jusqu'à ce que vous formuliez une demande expresse de suppression.
            </p>
            <p>
              En cas d’inactivité prolongée du compte ou de résiliation, les données associées peuvent être archivées pour une durée strictement limitée conformément aux obligations légales de conservation (conservation comptable, sécurité ou résolution de litiges), avant leur suppression ou anonymisation définitive.
            </p>
          </section>

          {/* Section 12 */}
          <section id="suppression-compte" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <RefreshCw className="w-5 h-5 shrink-0 text-red-600" />
              <h2>12. Procédure de suppression du compte et des données</h2>
            </div>
            <p>
              Vous disposez du droit d'obtenir à tout moment l'effacement complet de votre compte et de l'ensemble des données associées à votre profil OREA.
            </p>
            <p className="font-semibold">
              Comment demander la suppression ?
            </p>
            <p>
              Il vous suffit d'adresser un e-mail à notre équipe de support à l'adresse suivante :
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-[#0f2347]">patrik.moona@gmail.com</p>
                <p className="text-xs text-slate-500">Objet suggéré : « Demande de suppression de compte OREA »</p>
              </div>
              <a
                href="mailto:patrik.moona@gmail.com?subject=Demande%20de%20suppression%20de%20compte%20OREA"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors cursor-pointer shrink-0"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Envoyer la demande</span>
              </a>
            </div>
            <p className="text-xs text-slate-500">
              Votre demande sera traitée dans un délai raisonnable après vérification de votre identité afin de prévenir toute suppression non autorisée.
            </p>
          </section>

          {/* Section 13 */}
          <section id="droits-utilisateurs" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Shield className="w-5 h-5 shrink-0" />
              <h2>13. Vos droits sur vos données personnelles</h2>
            </div>
            <p>
              Conformément aux principes reconnus de protection des données personnelles, vous bénéficiez des prérogatives suivantes :
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Droit d'accès :</strong> Vous pouvez demander confirmation du traitement de vos données et obtenir communication des informations enregistrées.</li>
              <li><strong>Droit de rectification :</strong> Vous pouvez modifier et corriger directement vos données inexactes dans les formulaires de l'espace OREA ou en nous contactant.</li>
              <li><strong>Droit à l'effacement :</strong> Vous pouvez réclamer la suppression de vos données personnelles.</li>
              <li><strong>Droit au retrait du consentement :</strong> Pour les traitements fondés sur votre accord préalable, vous pouvez retirer votre consentement à tout moment.</li>
              <li><strong>Droit d'opposition :</strong> Vous pouvez vous opposer, pour des motifs légitimes, au traitement de certaines données.</li>
            </ul>
          </section>

          {/* Section 14 */}
          <section id="contact" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Mail className="w-5 h-5 shrink-0 text-[#0056D6]" />
              <h2>14. Contact et Responsable de traitement</h2>
            </div>
            <p>
              Pour toute interrogation relative à la présente Politique de confidentialité, pour exercer l'un de vos droits ou faire part d'une remarque sur la gestion de vos données personnelles, vous pouvez contacter directement le référent OREA :
            </p>
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs sm:text-sm space-y-1 text-slate-700">
              <p><strong>Plateforme :</strong> OREA (Organisation, Santé Préventive & Bien-être)</p>
              <p><strong>Contact e-mail :</strong> <a href="mailto:patrik.moona@gmail.com" className="text-[#0056D6] font-semibold underline">patrik.moona@gmail.com</a></p>
              <p><strong>Application :</strong> OREA Web Application</p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="mise-a-jour" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <RefreshCw className="w-5 h-5 shrink-0 text-slate-600" />
              <h2>15. Mise à jour de la présente politique</h2>
            </div>
            <p>
              OREA se réserve le droit de faire évoluer la présente Politique de confidentialité afin de refléter fidèlement toute évolution fonctionnelle, technique ou légale de la plateforme.
            </p>
            <p>
              Toute mise à jour substantielle sera signalée sur cette page, la date de dernière révision faisant foi. Nous vous invitons à consulter régulièrement cette page.
            </p>
            <p className="text-xs text-slate-500 pt-1">
              Date de version actuelle : <strong className="text-slate-700">{currentDateFormatted}</strong>.
            </p>
          </section>

        </main>
      </div>

      {/* Footer minimaliste de page légale */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 mt-12 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} OREA. Tous droits réservés.</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('conditions_utilisation')}
            className="hover:text-[#0056D6] transition-colors cursor-pointer"
          >
            Conditions d'utilisation
          </button>
          <span>•</span>
          <button
            onClick={() => onNavigate('accueil')}
            className="hover:text-[#0056D6] transition-colors cursor-pointer font-semibold text-[#0056D6]"
          >
            Accueil OREA
          </button>
        </div>
      </footer>
    </div>
  );
};

export default OreaPrivacyView;
