import React, { useEffect } from 'react';
import {
  FileCheck2,
  ArrowLeft,
  Shield,
  Scale,
  HeartPulse,
  Coins,
  GraduationCap,
  Bot,
  AlertTriangle,
  Lock,
  RefreshCw,
  Mail,
  HelpCircle,
  Layers,
  UserCheck,
} from 'lucide-react';
import { NavSection } from '../../types';
import { OREALogo } from '../OREALogo';

interface OreaTermsViewProps {
  onNavigate: (section: NavSection) => void;
}

export const OreaTermsView: React.FC<OreaTermsViewProps> = ({ onNavigate }) => {
  // Format current localized date dynamically
  const currentDateFormatted = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Conditions d’utilisation — OREA';
  }, []);

  const sections = [
    { id: 'objet-service', title: '1. Objet du service' },
    { id: 'creation-compte', title: '2. Création et sécurité du compte' },
    { id: 'authentification', title: '3. Utilisation de Google & Firebase Authentication' },
    { id: 'utilisation-acceptable', title: '4. Utilisation acceptable du service' },
    { id: 'responsabilite-utilisateur', title: '5. Responsabilité de l’utilisateur sur ses saisies' },
    { id: 'sante-bien-etre', title: '6. Fonctionnalités santé, cycle, sport & nutrition' },
    { id: 'finances-budget', title: '7. Fonctionnalités financières & budgétaires' },
    { id: 'education-bac-g2', title: '8. Fonctionnalités éducatives et BAC G2' },
    { id: 'ia-orea', title: '9. Intelligence Artificielle OREA (Gemini)' },
    { id: 'disponibilite-service', title: '10. Disponibilité et maintenance du service' },
    { id: 'propriete-intellectuelle', title: '11. Propriété intellectuelle' },
    { id: 'contenus-utilisateurs', title: '12. Données et contenus fournis par l’utilisateur' },
    { id: 'services-tiers', title: '13. Services tiers réellement exploités' },
    { id: 'limitation-responsabilite', title: '14. Limitation raisonnable de responsabilité' },
    { id: 'modification-conditions', title: '15. Modification des présentes conditions' },
    { id: 'resiliation-suppression', title: '16. Résiliation et clôture de compte' },
    { id: 'contact', title: '17. Contact et assistance' },
    { id: 'mise-a-jour', title: '18. Date de dernière mise à jour' },
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
              onClick={() => onNavigate('confidentialite')}
              className="text-xs font-semibold text-slate-500 hover:text-[#0056D6] transition-colors cursor-pointer hidden md:inline-block"
            >
              Politique de confidentialité
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
            <Scale className="w-3.5 h-3.5" />
            <span>Cadre Contractuel Utilisateur</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f2347] tracking-tight">
            Conditions d'utilisation — OREA
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Règles d'utilisation claires, équilibrées et bienveillantes pour l'ensemble des services et espaces OREA.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              Dernière mise à jour : <strong className="text-slate-700">{currentDateFormatted}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              Applicable à tous les utilisateurs enregistrés et visiteurs
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
              Articles & Sommaire
            </h3>
            <nav className="space-y-1 text-xs max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
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
                <span>Contact : patrik.moona@gmail.com</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Main Terms Text */}
        <main className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xs space-y-10 text-slate-700 text-sm sm:text-[15px] leading-relaxed">
          
          {/* Introduction Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-100 text-blue-950 text-xs sm:text-sm space-y-2">
            <p className="font-semibold">
              Bienvenue sur la plateforme OREA.
            </p>
            <p className="text-blue-900/90 leading-relaxed">
              En accédant à l'application OREA et en créant un compte, vous reconnaissez avoir pris connaissance des présentes Conditions d'utilisation et acceptez de vous y conformer sans réserve.
            </p>
          </div>

          {/* Section 1 */}
          <section id="objet-service" className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Layers className="w-5 h-5 shrink-0" />
              <h2>1. Objet du service</h2>
            </div>
            <p>
              OREA est une application web tout-en-un conçue pour assister ses utilisateurs dans l'organisation de leur quotidien à travers des modules spécialisés :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Santé & Prévention :</strong> Répertoire préventif, orientation d'urgence et fiches informatives.</li>
              <li><strong>Mon Cycle :</strong> Suivi menstruel personnalisé, estimation des phases du cycle et calendrier intime.</li>
              <li><strong>Sport & Workout :</strong> Planification des séances d'entraînement et suivi de condition physique.</li>
              <li><strong>Nutrition & Terroir :</strong> Idées repas, équilibre alimentaire axé sur les produits locaux et hydratation.</li>
              <li><strong>Éducation & BAC G2 :</strong> Fiches de révision, comptabilité SYSCOHADA, économie-droit et conseils d'éloquence.</li>
              <li><strong>Finance & Budget :</strong> Modélisation des rentrées et sorties d'argent en FCFA et objectifs d'épargne.</li>
              <li><strong>Planner & Routines :</strong> Organisation du temps, gestion de tâches quotidiennes et suivi des objectifs.</li>
              <li><strong>Assistant IA OREA :</strong> Module d'aide conversationnelle et de synthèse personnalisé.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="creation-compte" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <UserCheck className="w-5 h-5 shrink-0" />
              <h2>2. Création et sécurité du compte</h2>
            </div>
            <p>
              L'accès à certains espaces personnalisés nécessite la création d'un compte utilisateur.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>L'utilisateur s'engage à fournir des informations véridiques et à maintenir ses identifiants à jour.</li>
              <li>L'utilisateur est personnellement et exclusivement responsable du maintien de la confidentialité de ses identifiants de connexion.</li>
              <li>Toute opération effectuée depuis un compte authentifié est présumée avoir été initiée par le titulaire du compte.</li>
              <li>En cas de soupçon d'usurpation ou d'accès non autorisé, l'utilisateur s'engage à en aviser sans délai l'assistance OREA.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="authentification" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Lock className="w-5 h-5 shrink-0" />
              <h2>3. Utilisation de Google Authentication et Firebase Authentication</h2>
            </div>
            <p>
              L’authentification sur OREA repose sur les standards sécurisés de <strong>Firebase Authentication</strong> (Google Cloud Platform) :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>L'authentification via Google (« Continuer avec Google ») utilise le protocole officiel OAuth 2.0 sécurisé.</li>
              <li>OREA ne collecte ni ne stocke aucun mot de passe Google ou jeton d'accès privé sensible.</li>
              <li>Les mots de passe saisis dans le cadre de la connexion classique email/mot de passe ne sont jamais enregistrés en clair dans notre base Firestore.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="utilisation-acceptable" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Shield className="w-5 h-5 shrink-0" />
              <h2>4. Utilisation acceptable du service</h2>
            </div>
            <p>
              L'utilisateur s'interdit formellement :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Toute tentative d'intrusion, de contournement des contrôles d'accès ou de perturbation de l'infrastructure Firestore ou des serveurs OREA ;</li>
              <li>Toute injection de données malveillantes, scripts automatisés ou extraction abusive (« scraping ») du contenu pédagogique ou médical ;</li>
              <li>L'utilisation du service à des fins frauduleuses, illicites ou contraires à l'ordre public ;</li>
              <li>L'usurpation de l'identité d'un tiers ou d'un professionnel de santé.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="responsabilite-utilisateur" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <UserCheck className="w-5 h-5 shrink-0" />
              <h2>5. Responsabilité de l'utilisateur concernant les informations saisies</h2>
            </div>
            <p>
              L'utilisateur conserve la pleine et entière maîtrise des données qu'il renseigne dans son espace personnel OREA.
            </p>
            <p>
              La justesse des estimations fournies par l'application (calculs de cycle, projections budgétaires, rappels de planning) dépend directement de la sincérité et de la régularité des informations renseignées par l'utilisateur.
            </p>
          </section>

          {/* Section 6 */}
          <section id="sante-bien-etre" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <HeartPulse className="w-5 h-5 shrink-0 text-pink-600" />
              <h2>6. Fonctionnalités santé, cycle, sport & nutrition</h2>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs sm:text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Clause d'information sanitaire & médicale impérative</span>
              </div>
              <p>
                Les fonctionnalités relatives au cycle menstruel, à la condition physique, aux symptômes ou à l'alimentation sont fournies <strong>à des fins strictement informatives, préventives et éducatives</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Absence de substitution médicale :</strong> OREA ne se substitue pas à une consultation médicale ni à l'avis d'un médecin ou professionnel qualifié.</li>
                <li><strong>Pas de méthode contraceptive :</strong> Les algorithmes de prévision du cycle menstruel ou de la période d'ovulation constituent des estimations statistiques et <strong>ne peuvent en aucun cas faire office de méthode de contraception</strong>.</li>
                <li><strong>Absence d'acte de diagnostic :</strong> Les suggestions du vérificateur de symptômes et les fiches préventives ne constituent aucun diagnostic médical ni prescription de médicaments.</li>
                <li>En cas de doute, d'accident ou d'urgence médicale, contactez sans délai les services d'urgence compétents (15, 112, 18).</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section id="finances-budget" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Coins className="w-5 h-5 shrink-0 text-emerald-600" />
              <h2>7. Fonctionnalités financières & budgétaires</h2>
            </div>
            <p>
              Le module Budget OREA propose une méthodologie d'organisation personnelle des flux de trésorerie (notamment en Francs CFA).
            </p>
            <p>
              Les recommandations, ventilations et projections de soldes sont fournies <strong>à titre purement indicatif</strong>. OREA ne dispense aucun conseil en investissement financier réglementé et ne garantit aucun résultat d'épargne ou performance économique.
            </p>
          </section>

          {/* Section 8 */}
          <section id="education-bac-g2" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <GraduationCap className="w-5 h-5 shrink-0 text-indigo-600" />
              <h2>8. Fonctionnalités éducatives et BAC G2</h2>
            </div>
            <p>
              Les contenus de révision, fiches de méthodologie, cours de comptabilité SYSCOHADA et conseils d'éloquence sont élaborés comme des supports d'entraînement pédagogique.
            </p>
            <p>
              Il appartient aux candidats et apprenants de vérifier l'adéquation des contenus avec les programmes officiels, les circulaires d'examen et les référentiels en vigueur auprès de leur ministère de tutelle ou académie pour la session d'examen concernée.
            </p>
          </section>

          {/* Section 9 */}
          <section id="ia-orea" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Bot className="w-5 h-5 shrink-0 text-purple-600" />
              <h2>9. Intelligence Artificielle OREA (Gemini)</h2>
            </div>
            <p>
              L’assistant conversationnel OREA est propulsé par des modèles d'intelligence artificielle avancés (Google Gemini).
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Les réponses sont générées de manière probabiliste et automatique à partir des questions formulées par l'utilisateur.</li>
              <li>Bien qu'orientées vers la pertinence et la précision, les réponses peuvent comporter des approximations, omissions ou imperfections.</li>
              <li><strong>L'IA OREA ne constitue pas une autorité médicale, juridique, comptable ou financière.</strong> L'utilisateur doit exercer son esprit critique et vérifier toute donnée critique avant toute décision importante.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section id="disponibilite-service" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <RefreshCw className="w-5 h-5 shrink-0 text-slate-600" />
              <h2>10. Disponibilité et maintenance du service</h2>
            </div>
            <p>
              OREA met en œuvre ses meilleurs efforts pour assurer une disponibilité optimale du service 24 heures sur 24.
            </p>
            <p>
              Cependant, l'accès à la plateforme peut être temporairement interrompu ou limité sans préavis pour des raisons techniques, des mises à jour applicatives, des opérations de maintenance de routine ou des pannes indépendantes de notre volonté (fournisseur d'accès, réseau cloud). Aucune indemnité ne pourra être réclamée à ce titre.
            </p>
          </section>

          {/* Section 11 */}
          <section id="propriete-intellectuelle" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Shield className="w-5 h-5 shrink-0 text-blue-600" />
              <h2>11. Propriété intellectuelle</h2>
            </div>
            <p>
              Tous les éléments composant l'application OREA (notamment la marque OREA, les logos, la charte graphique, les icônes, les interfaces utilisateurs, les textes originaux, le code source logiciel, les bases de données et les fiches pédagogiques) sont la propriété exclusive d'OREA ou de leurs ayants droit respectifs.
            </p>
            <p>
              Toute reproduction, représentation, extraction, modification ou exploitation totale ou partielle de ces éléments sans autorisation écrite préalable est strictement interdite.
            </p>
          </section>

          {/* Section 12 */}
          <section id="contenus-utilisateurs" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Layers className="w-5 h-5 shrink-0 text-slate-600" />
              <h2>12. Données et contenus fournis par l'utilisateur</h2>
            </div>
            <p>
              L'utilisateur demeure seul propriétaire des informations et contenus qu'il renseigne dans l'application OREA.
            </p>
            <p>
              Il concède à OREA une licence technique non exclusive et sécurisée, limitée au traitement et au stockage strictement nécessaires au bon fonctionnement de la plateforme conformément à la Politique de confidentialité.
            </p>
          </section>

          {/* Section 13 */}
          <section id="services-tiers" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Lock className="w-5 h-5 shrink-0 text-slate-600" />
              <h2>13. Services tiers réellement exploités</h2>
            </div>
            <p>
              Le fonctionnement d'OREA repose sur l'intégration de services d'infrastructure tiers de premier plan :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Google Cloud & Firebase Authentication :</strong> Gestion sécurisée des identités et des connexions utilisateur.</li>
              <li><strong>Google Cloud Firestore :</strong> Hébergement et réplication sécurisée des documents et configurations de compte.</li>
              <li><strong>Google Gemini API :</strong> Traitement des requêtes textuelles soumises à l'assistant virtuel.</li>
            </ul>
            <p>
              Aucun autre tiers commercial ou partenaire publicitaire n'est connecté à votre espace privé.
            </p>
          </section>

          {/* Section 14 */}
          <section id="limitation-responsabilite" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Scale className="w-5 h-5 shrink-0 text-slate-600" />
              <h2>14. Limitation raisonnable de responsabilité</h2>
            </div>
            <p>
              Dans les limites maximales permises par la législation en vigueur :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>OREA ne pourra être tenu responsable des dommages indirects, pertes de chance, décisions médicales ou financières prises par l'utilisateur sur la base des indications du service.</li>
              <li>OREA ne peut être tenu responsable des pannes ou interruptions résultant de cas de force majeure ou de défaillances des réseaux Internet mondiaux.</li>
              <li>La responsabilité totale d'OREA envers un utilisateur, pour quelque cause que ce soit, est expressément plafonnée aux sommes éventuellement payées par l'utilisateur au cours des 12 derniers mois au titre du service.</li>
            </ul>
          </section>

          {/* Section 15 */}
          <section id="modification-conditions" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <RefreshCw className="w-5 h-5 shrink-0 text-slate-600" />
              <h2>15. Modification des présentes conditions</h2>
            </div>
            <p>
              OREA peut être amené à modifier à tout moment les présentes Conditions d'utilisation pour s'adapter aux évolutions techniques, réglementaires ou fonctionnelles.
            </p>
            <p>
              Les conditions modifiées entrent en vigueur dès leur publication en ligne. L'utilisation continue du service après publication vaut acceptation des conditions révisées.
            </p>
          </section>

          {/* Section 16 */}
          <section id="resiliation-suppression" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
              <h2>16. Résiliation et clôture de compte</h2>
            </div>
            <p>
              L'utilisateur peut à tout moment cesser d'utiliser le service OREA et solliciter la clôture de son compte conformément à la procédure décrite dans la Politique de confidentialité.
            </p>
            <p>
              OREA se réserve le droit de suspendre ou de clôturer sans préavis le compte d'un utilisateur en cas de manquement grave aux présentes Conditions (notamment tentatives d'intrusion ou propos illicites).
            </p>
          </section>

          {/* Section 17 */}
          <section id="contact" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <Mail className="w-5 h-5 shrink-0 text-[#0056D6]" />
              <h2>17. Contact et assistance</h2>
            </div>
            <p>
              Pour toute interrogation relative à l'interprétation ou à l'exécution des présentes Conditions d'utilisation, notre équipe est à votre entière disposition :
            </p>
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs sm:text-sm space-y-1 text-slate-700">
              <p><strong>Plateforme OREA :</strong> Support & Relations Utilisateurs</p>
              <p><strong>Contact e-mail officiel :</strong> <a href="mailto:patrik.moona@gmail.com" className="text-[#0056D6] font-semibold underline">patrik.moona@gmail.com</a></p>
            </div>
          </section>

          {/* Section 18 */}
          <section id="mise-a-jour" className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 text-[#0056D6] font-bold text-base sm:text-lg">
              <RefreshCw className="w-5 h-5 shrink-0 text-slate-600" />
              <h2>18. Date de dernière mise à jour</h2>
            </div>
            <p>
              Les présentes Conditions d'utilisation sont applicables à compter du : <strong className="text-slate-800">{currentDateFormatted}</strong>.
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
            onClick={() => onNavigate('confidentialite')}
            className="hover:text-[#0056D6] transition-colors cursor-pointer"
          >
            Politique de confidentialité
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

export default OreaTermsView;
