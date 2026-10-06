import { BacG2Course } from '../../types/bacG2';

const FISCALITE_DATA_ITEMS = [
  { t: 'Introduction générale au droit fiscal et rôle des impôts', sub: 'Fondements Fiscaux', l: 'Débutant' as const, d: 20 },
  { t: 'Classification des impôts : Impôts directs versus Impôts indirects', sub: 'Fondements Fiscaux', l: 'Débutant' as const, d: 25 },
  { t: 'Les principes fondamentaux de l’impôt (Légalité, Nécessité, Égalité, Annualité)', sub: 'Fondements Fiscaux', l: 'Débutant' as const, d: 20 },
  { t: 'Le champ d’application de la Taxe sur la Valeur Ajoutée (TVA) : Opérations imposables et exonérations', sub: 'TVA & Taxes sur le Chiffre d’Affaires', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Règles de territorialité et fait générateur de la TVA (Ventes de biens vs Prestations de services)', sub: 'TVA & Taxes sur le Chiffre d’Affaires', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Calcul de la base d’imposition de la TVA : Éléments à inclure et à exclure', sub: 'TVA & Taxes sur le Chiffre d’Affaires', l: 'Intermédiaire' as const, d: 25 },
  { t: 'Régime des déductions de la TVA : Conditions de forme, de fond, de délai et exclusions', sub: 'TVA & Taxes sur le Chiffre d’Affaires', l: 'Avancé' as const, d: 35 },
  { t: 'La règle du prorata de déduction de TVA pour les assujettis partiels', sub: 'TVA & Taxes sur le Chiffre d’Affaires', l: 'Avancé' as const, d: 40 },
  { t: 'Déclaration mensuelle de TVA : Calcul de la TVA due ou du crédit de TVA reportable', sub: 'TVA & Taxes sur le Chiffre d’Affaires', l: 'Révision BAC' as const, d: 40 },
  { t: 'Régularisations de TVA sur cessions d’immobilisations et disparitions de biens', sub: 'TVA & Taxes sur le Chiffre d’Affaires', l: 'Avancé' as const, d: 35 },
  { t: 'L’Impôt sur les Sociétés (IS / IBS / IBIC) : Champ d’application et personnes imposables', sub: 'Fiscalité des Entreprises (IS)', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Détermination du résultat fiscal : Du résultat comptable au résultat fiscal', sub: 'Fiscalité des Entreprises (IS)', l: 'Révision BAC' as const, d: 45 },
  { t: 'Les réintégrations fiscales obligatoires (Charges non déductibles, amendes, dons excédentaires)', sub: 'Fiscalité des Entreprises (IS)', l: 'Avancé' as const, d: 40 },
  { t: 'Les déductions fiscales extra-comptables (Produits non imposables, plus-values exonérées)', sub: 'Fiscalité des Entreprises (IS)', l: 'Avancé' as const, d: 35 },
  { t: 'Le régime fiscal des amortissements et dépréciations (Plafonds fiscaux de déductibilité)', sub: 'Fiscalité des Entreprises (IS)', l: 'Avancé' as const, d: 35 },
  { t: 'Traitement fiscal des déficits reportables et règles de limitation dans le temps', sub: 'Fiscalité des Entreprises (IS)', l: 'Avancé' as const, d: 30 },
  { t: 'Calcul de l’Impôt Minimum Forfaitaire (IMF) / Minimum de perception sur chiffre d’affaires', sub: 'Fiscalité des Entreprises (IS)', l: 'Révision BAC' as const, d: 35 },
  { t: 'Liquidation de l’IS : Système des acomptes provisionnels trimestriels et solde de liquidation', sub: 'Fiscalité des Entreprises (IS)', l: 'Révision BAC' as const, d: 40 },
  { t: 'L’Impôt sur le Revenu des Personnes Physiques (IRPP / IGR) : Catégories de revenus imposables', sub: 'Fiscalité des Personnes (IRPP)', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Imposition des Traitements et Salaires (ITS) : Retenues à la source par l’employeur', sub: 'Fiscalité des Personnes (IRPP)', l: 'Révision BAC' as const, d: 40 },
  { t: 'Avantages en nature (logement, véhicule, nourriture) : Évaluation forfaitaire fiscale', sub: 'Fiscalité des Personnes (IRPP)', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Les cotisations et taxes patronales assises sur les salaires (Taxe d’apprentissage, FDFP/ONFP)', sub: 'Fiscalité des Personnes (IRPP)', l: 'Intermédiaire' as const, d: 30 },
  { t: 'La Contribution des Patentes et Licences : Droit fixe et droit proportionnel sur valeur locative', sub: 'Fiscalité Locale & Autres Taxes', l: 'Intermédiaire' as const, d: 35 },
  { t: 'La Taxe Foncière sur les propriétés bâties et non bâties', sub: 'Fiscalité Locale & Autres Taxes', l: 'Débutant' as const, d: 25 },
  { t: 'Droits d’enregistrement et de timbre : Contrats de bail, actes de constitution de sociétés, mutations', sub: 'Fiscalité des Actes & Enregistrement', l: 'Intermédiaire' as const, d: 35 },
  { t: 'Retenues à la source sur prestations de services versées à des non-résidents (BNC étranger)', sub: 'Fiscalité Internationale', l: 'Avancé' as const, d: 35 },
  { t: 'Obligations déclaratives, calendrier fiscal de l’entreprise et tenue de la liasse fiscale', sub: 'Procédures Fiscales', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Le contrôle fiscal : Vérification de comptabilité sur place, droits et garanties du contribuable', sub: 'Procédures Fiscales', l: 'Avancé' as const, d: 40 },
  { t: 'Contentieux fiscal : Procédure de redressement contradictoire, réclamation préalable et recours', sub: 'Procédures Fiscales', l: 'Avancé' as const, d: 40 },
  { t: 'Synthèse & Cas pratique d’examen BAC G2 : Déclaration de TVA et liquidation complète de l’IS', sub: 'Révision & Annales BAC', l: 'Révision BAC' as const, d: 50 },
];

export const FISCALITE_COURSES: BacG2Course[] = FISCALITE_DATA_ITEMS.map((item, index) => {
  const num = index + 1;
  const id = `BAC-FIS-${String(num).padStart(3, '0')}`;
  return {
    id,
    title: item.t,
    domain: 'fiscalite',
    subcategory: item.sub,
    level: item.l,
    durationMinutes: item.d,
    description: `Cours structuré de fiscalité pour BAC G2 : ${item.t}. Principes du Code Général des Impôts, mécanismes de calcul, assiette, taux, déductions et cas pratiques corrigés.`,
    objectives: [
      `Comprendre les règles fiscales relatives à : ${item.t}`,
      'Identifier l’assiette imposable, le fait générateur et les obligations déclaratives',
      'Calculer avec précision l’impôt ou la taxe due et remplir les bordereaux fiscaux',
    ],
    introduction: `La fiscalité régit les prélèvements obligatoires opérés par l'État pour financer les charges publiques. Ce cours aborde en détail « ${item.t} » selon les règles en vigueur applicables aux examens du BAC G2.`,
    content: `### 1. Fondements juridiques et fiscaux
Le droit fiscal organise le prélèvement de l'impôt en vertu du principe de légalité fiscale (seule la loi peut créer, modifier ou supprimer un impôt).

### 2. Mécanisme de calcul et assiette
- **Fait générateur** : Événement qui donne naissance à la dette fiscale envers le Trésor Public.
- **Exigibilité** : Date à laquelle le fisc est en droit de réclamer le paiement.
- **Taux applicable** : Taux normal (ex : 18% pour la TVA dans la plupart des pays de l'UEMOA/CEMAC) ou taux proportionnel / progressif.

### 3. Obligations déclaratives et comptables
L'entité doit déposer ses déclarations périodiques (mensuelles ou annuelles) dans les délais légaux prescrits sous peine de pénalités et d'intérêts de retard.`,
    keyNotions: [item.sub, 'Assiette fiscale', 'Fait générateur', 'Déductibilité', 'Trésor Public'],
    definitions: [
      { term: 'Impôt', definition: 'Prélèvement pécuniaire obligatoire effectué par voie d’autorité, à titre définitif et sans contrepartie directe, au profit des personnes publiques.' },
      { term: 'Assiette', definition: 'Base monétaire sur laquelle est appliqué le taux de l’impôt pour déterminer le montant dû.' },
    ],
    example: {
      title: `Cas pratique d'application : ${item.t.slice(0, 35)}`,
      statement: `Une entreprise réalise une opération soumise à la fiscalité étudiée avec une base imposable de 5 000 000 FCFA. Taux légal applicable : 18%.`,
      solution: `Base imposable = 5 000 000 FCFA. Montant du prélèvement fiscal = 5 000 000 × 18% = 900 000 FCFA. Montant total à reverser dans les délais légaux.`,
    },
    methodology: [
      '1. Vérifier si l\'opération entre dans le champ d\'application de l\'impôt.',
      '2. Déterminer la base imposable nette (après déductions et abattements légaux).',
      '3. Appliquer le taux légal et vérifier les conditions de paiement (acomptes / retenues).',
    ],
    exercise: {
      question: `Dans le cadre de « ${item.t} », quelle est la règle fondamentale d'exigibilité fiscale ?`,
      options: [
        'L’impôt est dû selon les règles définies par le Code Général des Impôts à la date légale d’exigibilité',
        'Le contribuable peut choisir librement le montant et la date de paiement de ses impôts',
        'L’impôt n’est dû que si l’entreprise a réalisé plus de 100 000 000 FCFA de bénéfice net',
        'Les déclarations fiscales peuvent être ignorées sans pénalités si l’exercice est déficitaire',
      ],
      correctOptionIndex: 0,
      correction: 'Option A : L’impôt est régi par la loi fiscale qui fixe impérativement l’assiette, le taux et les dates d’exigibilité.',
      explanation: 'Le principe de légalité fiscale s’impose à tous les assujettis avec des délais de paiement stricts.',
    },
    summary: [
      `${item.t} est un point clé du programme de fiscalité au BAC G2.`,
      'La distinction entre fait générateur et exigibilité doit être rigoureusement appliquée.',
      'Le non-respect des échéances entraîne des pénalités d’assiette et de recouvrement.',
    ],
    youtubeId: 'bA45qV45nO4',
    videoTitle: `Fiscalité des entreprises : ${item.t}`,
    keywords: ['fiscalité', item.sub.toLowerCase(), 'impôts', 'tva', 'bac g2', 'calcul fiscal'],
  };
});
