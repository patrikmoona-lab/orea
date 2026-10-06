import { BacG2Course } from '../../types/bacG2';

const SYSCOHADA_DATA_ITEMS = [
  { t: 'Le cadre conceptuel du Système Comptable OHADA (SYSCOHADA Révisé) et ses objectifs', sub: 'Cadre & Postulats OHADA', l: 'Débutant' as const, d: 20 },
  { t: 'Les postulats comptables fondamentaux : Entité comptable, Continuité d’exploitation, Comptabilité d’engagement, Indépendance des exercices', sub: 'Cadre & Postulats OHADA', l: 'Débutant' as const, d: 25 },
  { t: 'Les conventions comptables fondamentales : Coût historique, Prudence, Permanence des méthodes, Intangibilité du bilan d’ouverture', sub: 'Cadre & Postulats OHADA', l: 'Débutant' as const, d: 25 },
  { t: 'Le principe de prééminence de la réalité économique sur l’apparence juridique (Substance over form)', sub: 'Cadre & Postulats OHADA', l: 'Intermédiaire' as const, d: 25 },
  { t: 'Organisation et codification du Plan de Comptes SYSCOHADA Révisé (Structure décimale à 9 classes)', sub: 'Plan de Comptes & Codification', l: 'Débutant' as const, d: 25 },
  { t: 'Fonctionnement détaillé des comptes de la Classe 1 : Ressources Durables (Capitaux propres et Dettes financières)', sub: 'Plan de Comptes & Codification', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Fonctionnement détaillé des comptes de la Classe 2 : Actif Immobilisé (Incorporel, Corporel, Financier)', sub: 'Plan de Comptes & Codification', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Fonctionnement détaillé des comptes de la Classe 3 : Stocks et Encours de production', sub: 'Plan de Comptes & Codification', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Fonctionnement détaillé des comptes de la Classe 4 : Comptes de Tiers (Fournisseurs, Clients, Personnel, État)', sub: 'Plan de Comptes & Codification', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Fonctionnement détaillé des comptes de la Classe 5 : Trésorerie (Titres de placement, Valeurs à encaisser, Banques, Caisse)', sub: 'Plan de Comptes & Codification', l: 'Intermédiaire' as const, d: 25 },
  { t: 'Fonctionnement détaillé des comptes de la Classe 6 : Charges des Activités Ordinaires', sub: 'Plan de Comptes & Codification', l: 'Intermédiaire' as const, d: 25 },
  { t: 'Fonctionnement détaillé des comptes de la Classe 7 : Produits des Activités Ordinaires', sub: 'Plan de Comptes & Codification', l: 'Intermédiaire' as const, d: 25 },
  { t: 'Fonctionnement détaillé des comptes de la Classe 8 : Comptes des Autres Charges et Produits (HAO - Hors Activités Ordinaires)', sub: 'Plan de Comptes & Codification', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Présentation de la Classe 9 : Comptabilité des engagements et Comptabilité analytique de gestion', sub: 'Plan de Comptes & Codification', l: 'Avancé' as const, d: 25 },
  { t: 'Comptabilisation des contrats de crédit-bail (Location-Financement) selon le SYSCOHADA Révisé', sub: 'Opérations Spécifiques OHADA', l: 'Avancé' as const, d: 40 },
  { t: 'Comptabilisation des subventions d’investissement et leur étalement dans le temps (Compte 14 / 799)', sub: 'Opérations Spécifiques OHADA', l: 'Avancé' as const, d: 35 },
  { t: 'Traitement des frais de développement et logiciels immobilisés (Comptes 211, 213)', sub: 'Opérations Spécifiques OHADA', l: 'Avancé' as const, d: 30 },
  { t: 'Comptabilisation des abandons de créances et aides financières à caractère commercial ou financier', sub: 'Opérations Spécifiques OHADA', l: 'Avancé' as const, d: 35 },
  { t: 'Traitement des emballages consignés, prêtés, détruits ou conservés par le client (Comptes 4094, 4194)', sub: 'Opérations Spécifiques OHADA', l: 'Intermédiaire' as const, d: 35 },
  { t: 'Traitement des opérations en monnaies étrangères : Écarts de conversion actif et passif (478 / 479)', sub: 'Opérations Spécifiques OHADA', l: 'Avancé' as const, d: 40 },
  { t: 'Travaux d’inventaire OHADA : Écritures d’ajustement des amortissements dérogatoires (151 / 851)', sub: 'Travaux d’Inventaire OHADA', l: 'Avancé' as const, d: 40 },
  { t: 'Travaux d’inventaire OHADA : Écritures de clôture des comptes de gestion et virement des soldes', sub: 'Travaux d’Inventaire OHADA', l: 'Avancé' as const, d: 35 },
  { t: 'Le Bilan normalisé SYSCOHADA : Présentation Actif/Passif, lecture des rubriques et agrégats', sub: 'États Financiers Annuels', l: 'Révision BAC' as const, d: 45 },
  { t: 'Le Compte de Résultat normalisé SYSCOHADA : Soldes intermédiaires de gestion et structure en cascade', sub: 'États Financiers Annuels', l: 'Révision BAC' as const, d: 45 },
  { t: 'Le Tableau des Flux de Trésorerie (TFT) : Flux des activités opérationnelles, d’investissement et de financement', sub: 'États Financiers Annuels', l: 'Révision BAC' as const, d: 50 },
  { t: 'Les Notes annexes aux états financiers : Rôle, contenu obligatoire et informations qualitatives', sub: 'États Financiers Annuels', l: 'Avancé' as const, d: 35 },
  { t: 'Le Système Minimal de Trésorerie (SMT) pour les très petites entités en zone OHADA', sub: 'Systèmes Comptables OHADA', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Audit comptable et contrôle de conformité des états financiers selon l’Acte Uniforme OHADA', sub: 'Audit & Contrôle', l: 'Avancé' as const, d: 35 },
  { t: 'Cas de synthèse BAC G2 : Régularisations d’inventaire, balance après inventaire et bilan SYSCOHADA', sub: 'Cas de Synthèse BAC', l: 'Révision BAC' as const, d: 60 },
  { t: 'Cas de synthèse BAC G2 : Du Compte de résultat au Tableau des Flux de Trésorerie (TFT)', sub: 'Cas de Synthèse BAC', l: 'Révision BAC' as const, d: 60 },
];

export const SYSCOHADA_COURSES: BacG2Course[] = SYSCOHADA_DATA_ITEMS.map((item, index) => {
  const num = index + 1;
  const id = `BAC-SYS-${String(num).padStart(3, '0')}`;
  return {
    id,
    title: item.t,
    domain: 'syscohada',
    subcategory: item.sub,
    level: item.l,
    durationMinutes: item.d,
    description: `Cours officiel SYSCOHADA Révisé pour le BAC G2 : ${item.t}. Conformité stricte à l'Acte Uniforme relatif au Droit Comptable et à l'Information Financière (AUDCIF). Écritures exactes, schémas de comptes et cas d'école résolus.`,
    objectives: [
      `Maîtriser les prescriptions normatives de l'OHADA relatives à : ${item.t}`,
      'Identifier et employer la numérotation exacte du plan de comptes SYSCOHADA',
      'Établir les écritures conformes et construire les états financiers normalisés',
    ],
    introduction: `L'Acte Uniforme OHADA portant sur le Droit Comptable unifie les règles financières dans les 17 États membres. Ce cours traite avec exactitude pédagogique de « ${item.t} » selon le SYSCOHADA Révisé.`,
    content: `### 1. Cadre juridique de l'Acte Uniforme (AUDCIF)
Le SYSCOHADA Révisé garantit la comparabilité internationale des états financiers des entités africaines tout en intégrant les standards IFRS adaptés aux réalités économiques régionales.

### 2. Nomenclature et Logique des Comptes
- La codification décimale de l'OHADA structure les opérations de la Classe 1 à la Classe 9.
- Chaque compte à 2, 3 ou 4 chiffres possède une signification univoque permettant l'automatisation et le contrôle comptable.

### 3. Les documents de synthèse normalisés
Toute entité soumise au système normal doit produire le Bilan, le Compte de Résultat, le Tableau des Flux de Trésorerie (TFT) et les Notes Annexes.`,
    keyNotions: [item.sub, 'SYSCOHADA Révisé', 'AUDCIF', 'Plan de comptes', 'États financiers normalisés'],
    definitions: [
      { term: 'SYSCOHADA', definition: 'Système Comptable de l’Organisation pour l’Harmonisation en Afrique du Droit des Affaires, régissant la comptabilité des 17 pays membres.' },
      { term: 'Postulat comptable', definition: 'Hypothèse fondamentale admise sans démonstration préalable sur laquelle repose l’élaboration des états financiers.' },
    ],
    example: {
      title: `Application pratique SYSCOHADA - ${item.t.slice(0, 35)}`,
      statement: `L'entité SAHEL INDUSTRIE procède à l'opération de ${item.t.toLowerCase()} pour une valeur d'origine de 10 000 000 FCFA conformément aux dispositions du SYSCOHADA révisé.`,
      solution: `Enregistrement selon la nomenclature OHADA : Débit du compte approprié / Crédit du compte de contrepartie. Les états financiers reflètent fidèlement l'opération.`,
    },
    methodology: [
      '1. Consulter le plan de comptes OHADA et identifier la classe et le numéro de compte adéquats.',
      '2. Vérifier l\'application des postulats et conventions comptables applicables.',
      '3. Dresser le tableau ou l\'écriture au journal en indiquant le libellé de la pièce justificative.',
    ],
    exercise: {
      question: `Dans le système comptable SYSCOHADA Révisé, quelle est la caractéristique essentielle de : « ${item.t} » ?`,
      options: [
        'L’application obligatoire des règles et numéros de comptes normalisés de l’Acte Uniforme OHADA',
        'L’autorisation pour chaque comptable de créer des numéros de compte sans logique décimale',
        'L’absence totale de pièces justificatives pour les opérations de clôture',
        'L’interdiction d’utiliser des logiciels informatiques de gestion comptable',
      ],
      correctOptionIndex: 0,
      correction: 'Option A : Le SYSCOHADA impose une nomenclature stricte et des principes normalisés d’application impérative dans tous les pays membres de l’OHADA.',
      explanation: 'L’Acte Uniforme de l’OHADA est d’application directe et obligatoire pour assurer la transparence et la fiabilité des comptes.',
    },
    summary: [
      `${item.t} est une pièce maîtresse du programme SYSCOHADA au BAC G2.`,
      'La conformité à la nomenclature OHADA est rigoureusement évaluée lors des examens officiels.',
      'Les états financiers doivent refléter une image fidèle, sincère et régulière du patrimoine.',
    ],
    youtubeId: '3y_7Y8eT910',
    videoTitle: `SYSCOHADA Révisé : ${item.t}`,
    keywords: ['syscohada', 'ohada', item.sub.toLowerCase(), 'plan comptable', 'bac g2', 'bilan normalisé'],
  };
});
