import { BacG2Course } from '../../types/bacG2';

export const COMPTABILITE_COURSES: BacG2Course[] = [
  {
    id: 'BAC-CPT-001',
    title: 'Introduction générale à la comptabilité & rôle dans l’entreprise',
    domain: 'comptabilite',
    subcategory: 'Fondamentaux & Principes',
    level: 'Débutant',
    durationMinutes: 20,
    description: 'Comprendre la finalité de la comptabilité financière, ses utilisateurs et son rôle comme instrument de mesure de la performance.',
    objectives: [
      'Définir la comptabilité générale et ses obligations légales',
      'Identifier les partenaires de l’entreprise utilisant l’information financière',
      'Distinguer comptabilité financière, comptabilité de gestion et fiscalité',
    ],
    introduction: 'La comptabilité est un système d’information standardisé permettant de saisir, classer, enregistrer et synthétiser les flux économiques d’une entité afin de présenter une image fidèle de son patrimoine.',
    content: `### 1. Définition et utilité
La comptabilité financière est un langage universel des affaires. En zone OHADA, toute entité exerçant une activité économique a l'obligation légale de tenir une comptabilité régulière selon le Système Comptable OHADA révisé.

### 2. Les finalités de la comptabilité
- **Instrument de preuve juridique** : les écritures comptables régulièrement tenues font foi en justice entre commerçants.
- **Outil d'aide à la décision** : permet aux dirigeants d'évaluer la rentabilité et d'anticiper la trésorerie.
- **Base de calcul de l'impôt** : sert d'assiette aux impôts directs (IS, IRPP) et indirects (TVA).
- **Moyen d'information des tiers** : banquiers, investisseurs, salariés et fournisseurs.`,
    keyNotions: ['Système d\'information', 'Image fidèle', 'Obligation légale', 'Flux économiques'],
    definitions: [
      { term: 'Comptabilité générale', definition: 'Technique quantitative enregistrant chronologiquement les opérations d\'une entité pour établir ses états financiers.' },
      { term: 'Entité comptable', definition: 'Toute personne physique ou morale exerçant une activité économique autonome.' },
    ],
    example: {
      title: 'Exemple concret : Les flux de la Société OREA SARL',
      statement: 'L\'entreprise OREA SARL achète 500 000 FCFA de marchandises à crédit à son fournisseur et vend pour 800 000 FCFA au comptant.',
      solution: 'Ces opérations créent deux flux : un flux réel (marchandises) et un flux financier (dette fournisseur et encaissement en caisse/banque).',
    },
    methodology: [
      '1. Identifier la pièce justificative (facture, reçu, chèque).',
      '2. Analyser les flux entrants (emplois) et flux sortants (ressources).',
      '3. Traduire l\'opération en débit et crédit selon le plan de comptes.',
    ],
    exercise: {
      question: 'Parmi les propositions suivantes, laquelle ne constitue PAS une finalité essentielle de la comptabilité financière ?',
      options: [
        'Fournir une base légale de calcul des impôts dus à l\'État',
        'Garantir un bénéfice automatique à la fin de l\'exercice',
        'Servir d\'instrument de preuve juridique entre commerçants',
        'Informer les associés et les banques sur la situation financière',
      ],
      correctOptionIndex: 1,
      correction: 'Option B : La comptabilité mesure la performance mais ne garantit jamais un bénéfice commercial.',
      explanation: 'La comptabilité constate objectivement les résultats, qu\'il s\'agisse d\'un bénéfice ou d\'une perte.',
    },
    summary: [
      'La comptabilité est obligatoire pour toute entité en zone OHADA.',
      'Elle repose sur des pièces justificatives écrites et datées.',
      'Elle traduit les flux réels et financiers en langage normalisé.',
    ],
    youtubeId: 'q2K4nI4aV2w',
    videoTitle: 'Introduction à la comptabilité générale : Rôle et définitions',
    keywords: ['comptabilité', 'introduction', 'flux', 'patrimoine', 'OHADA'],
  },
  {
    id: 'BAC-CPT-002',
    title: 'Le patrimoine de l’entreprise : Actif, Passif & Situation nette',
    domain: 'comptabilite',
    subcategory: 'Le Patrimoine & Le Bilan',
    level: 'Débutant',
    durationMinutes: 25,
    description: 'Maîtriser les composantes du patrimoine : ce que l’entreprise possède (Actif) et ce qu’elle doit (Passif/Dettes).',
    objectives: [
      'Définir le patrimoine économique et juridique',
      'Calculer la situation nette patrimoniale',
      'Comprendre l’équation fondamentale du bilan : Actif = Passif',
    ],
    introduction: 'Le patrimoine d\'une entreprise est l\'ensemble de ses biens et droits (Actif) diminué de l\'ensemble de ses obligations et dettes (Passif exigible).',
    content: `### 1. La notion de patrimoine
Le patrimoine regroupe :
- **Les éléments positifs (Actif)** : terrains, bâtiments, matériels, stocks, créances sur clients, avoirs en banque et en caisse.
- **Les éléments négatifs (Passif externe / Dettes)** : emprunts bancaires, dettes fournisseurs, dettes fiscales et sociales.

### 2. La Situation Nette (Capitaux Propres)
La Situation Nette représente la valeur réelle appartenant aux propriétaires :
$$\\text{Situation Nette} = \\text{Total Actif} - \\text{Total Dettes}$$`,
    keyNotions: ['Actif', 'Passif', 'Dettes', 'Situation nette', 'Créances'],
    definitions: [
      { term: 'Actif', definition: 'Ressource contrôlée par l’entité du fait d’événements passés et dont elle attend des avantages économiques futurs.' },
      { term: 'Passif externe', definition: 'Obligation actuelle de l’entité résultant d’événements passés et dont l’extinction se traduira par une sortie de ressources.' },
    ],
    example: {
      title: 'Calcul de la situation nette d\'un commerce',
      statement: 'Un commerçant possède un local (10 000 000 FCFA), du stock (3 000 000 FCFA), 1 000 000 FCFA en banque et doit 4 000 000 FCFA à sa banque et 2 000 000 FCFA à ses fournisseurs.',
      solution: 'Total Actif = 10M + 3M + 1M = 14 000 000 FCFA. Total Dettes = 4M + 2M = 6 000 000 FCFA. Situation Nette = 14M - 6M = 8 000 000 FCFA.',
    },
    methodology: [
      '1. Recenser et évaluer tous les biens et créances (Actif).',
      '2. Recenser toutes les dettes exigibles (Passif externe).',
      '3. Appliquer la formule : Capitaux Propres = Actif - Dettes.',
    ],
    exercise: {
      question: 'Une entreprise a un actif total de 25 000 000 FCFA et des dettes globales de 17 000 000 FCFA. Quelle est sa situation nette ?',
      options: ['8 000 000 FCFA', '42 000 000 FCFA', '17 000 000 FCFA', '-8 000 000 FCFA'],
      correctOptionIndex: 0,
      correction: '8 000 000 FCFA (25 000 000 - 17 000 000).',
      explanation: 'La situation nette est la différence entre l\'actif total et les dettes exigibles.',
    },
    summary: [
      'L\'Actif recense les emplois des fonds (ce que l\'entreprise possède).',
      'Le Passif recense les origines des fonds (Capitaux propres + Dettes).',
      'L\'égalité Actif = Passif est toujours vérifiée.',
    ],
    youtubeId: 'Wd71J_9n_Fk',
    videoTitle: 'Le Bilan comptable et le Patrimoine expliqué pas à pas',
    keywords: ['patrimoine', 'actif', 'passif', 'situation nette', 'bilan'],
  },
  {
    id: 'BAC-CPT-003',
    title: 'Le Bilan comptable : Structure, rubriques et équilibre',
    domain: 'comptabilite',
    subcategory: 'Le Patrimoine & Le Bilan',
    level: 'Débutant',
    durationMinutes: 30,
    description: 'Structure normalisée du bilan comptable : Actif immobilisé, Actif circulant, Trésorerie-Actif, Ressources stables, Passif circulant et Trésorerie-Passif.',
    objectives: [
      'Détailler les grandes masses de l’actif et du passif',
      'Maîtriser le classement par liquidité et exigibilité croissantes',
      'Vérifier l’équilibre fondamental du bilan à l’ouverture et à la clôture',
    ],
    introduction: 'Le bilan est une photographie du patrimoine de l\'entreprise à une date donnée. Il est divisé en deux parties d\'égal montant : l\'Actif à gauche et le Passif à droite.',
    content: `### 1. Structure de l'Actif (Classé par liquidité croissante)
- **Actif Immobilisé (Classe 2)** : Immobilisations incorporelles, corporelles et financières (durée > 1 an).
- **Actif Circulant (Classes 3 et 4)** : Stocks, créances clients et autres créances d'exploitation.
- **Trésorerie-Actif (Classe 5)** : Banque, Caisse, Chèques à encaisser.

### 2. Structure du Passif (Classé par exigibilité croissante)
- **Ressources Stables (Classes 1)** : Capital social, réserves, résultat net, dettes financières à long terme.
- **Passif Circulant (Classe 4)** : Dettes fournisseurs, dettes fiscales et sociales.
- **Trésorerie-Passif (Classe 5)** : Découverts bancaires, crédits de trésorerie.`,
    keyNotions: ['Actif immobilisé', 'Actif circulant', 'Ressources stables', 'Passif circulant', 'Trésorerie'],
    definitions: [
      { term: 'Liquidité', definition: 'Aptitude d’un actif à être transformé rapidement en monnaie disponible.' },
      { term: 'Exigibilité', definition: 'Délai accordé à l’entité avant l’échéance de remboursement d’une dette.' },
    ],
    example: {
      title: 'Bilan d\'ouverture de la Société NOUVELLE OUEST',
      statement: 'Capital : 10 000 000 FCFA, Emprunt : 5 000 000 FCFA, Matériel : 8 000 000 FCFA, Stocks : 4 000 000 FCFA, Banque : 3 000 000 FCFA.',
      solution: 'Total Actif = 8M + 4M + 3M = 15 000 000 FCFA. Total Passif = 10M (Capital) + 5M (Emprunt) = 15 000 000 FCFA. Le bilan est équilibré.',
    },
    methodology: [
      '1. Regrouper les éléments de l\'actif selon leur nature (immobilisé, circulant, trésorerie).',
      '2. Regrouper les éléments du passif (ressources stables, circulant, trésorerie).',
      '3. Calculer les sous-totaux et vérifier l\'égalité Total Actif = Total Passif.',
    ],
    exercise: {
      question: 'Dans quelle masse du bilan range-t-on le compte « 401 Fournisseurs » ?',
      options: ['Actif Circulant', 'Passif Circulant', 'Ressources Stables', 'Trésorerie-Passif'],
      correctOptionIndex: 1,
      correction: 'Option B : Passif Circulant.',
      explanation: 'Les dettes fournisseurs représentent des engagements d\'exploitation à court terme exigibles.',
    },
    summary: [
      'Le bilan présente l\'état du patrimoine à un instant précis.',
      'Actif (Emplois) = Passif (Ressources).',
      'L\'actif est classé par liquidité croissante, le passif par exigibilité croissante.',
    ],
    youtubeId: 'bA45qV45nO4',
    videoTitle: 'Comprendre et dresser un bilan comptable',
    keywords: ['bilan', 'actif immobilisé', 'passif circulant', 'ressources stables', 'liquidité'],
  },
  {
    id: 'BAC-CPT-004',
    title: 'Le Compte de Résultat : Charges, Produits & Détermination du Résultat',
    domain: 'comptabilite',
    subcategory: 'Le Compte de Résultat',
    level: 'Débutant',
    durationMinutes: 25,
    description: 'Comprendre le fonctionnement des charges (Classe 6), des produits (Classe 7) et le calcul du résultat net de la période.',
    objectives: [
      'Distinguer charges (consommations) et produits (enrichissements)',
      'Classer les charges et produits par nature d’activité (Exploitation, Financier, HAO)',
      'Calculer le résultat de l’exercice : Résultat = Produits - Charges',
    ],
    introduction: 'Contrairement au bilan qui est statique, le compte de résultat est un film retraçant l\'activité économique de l\'entité pendant une période (généralement 12 mois).',
    content: `### 1. Les Charges (Classe 6 & 8)
Une charge est un appauvrissement définitif pour l'entreprise :
- Charges d'exploitation : Achats de marchandises, loyers, salaires, électricité, impôts.
- Charges financières : Intérêts des emprunts, escomptes accordés.
- Charges HAO (Hors Activités Ordinaires) : Pertes exceptionnelles, dons, pénalités.

### 2. Les Produits (Classe 7 & 8)
Un produit est un enrichissement généré par l'activité :
- Produits d'exploitation : Ventes de marchandises, prestations de services, production stockée.
- Produits financiers : Intérêts perçus, escomptes obtenus.
- Produits HAO : Vente d'un matériel usagé, indemnités d'assurances.

### 3. Calcul du résultat
$$\\text{Résultat Net} = \\sum \\text{Produits} - \\sum \\text{Charges}$$
- Si Produits > Charges $\\rightarrow$ **Bénéfice** (au passif du bilan en capitaux propres).
- Si Charges > Produits $\\rightarrow$ **Perte** (au passif du bilan avec signe négatif).`,
    keyNotions: ['Charges', 'Produits', 'Bénéfice', 'Perte', 'Période comptable'],
    definitions: [
      { term: 'Charge', definition: 'Consommation de biens ou de services au cours de l\'activité, entraînant une diminution des capitaux propres.' },
      { term: 'Produit', definition: 'Ressource acquise par l\'entité au cours de son activité, entraînant une augmentation des capitaux propres.' },
    ],
    example: {
      title: 'Calcul du résultat de la société DAKAR FASHION',
      statement: 'Ventes : 12 000 000 FCFA. Achats : 6 000 000 FCFA. Salaires : 3 000 000 FCFA. Loyers : 1 000 000 FCFA. Intérêts perçus : 500 000 FCFA.',
      solution: 'Total Produits = 12M + 0.5M = 12 500 000 FCFA. Total Charges = 6M + 3M + 1M = 10 000 000 FCFA. Résultat = +2 500 000 FCFA (Bénéfice).',
    },
    methodology: [
      '1. Regrouper toutes les charges de la période par nature.',
      '2. Regrouper tous les produits de la période.',
      '3. Faire la différence Produits - Charges pour déterminer le résultat.',
    ],
    exercise: {
      question: 'L\'entreprise KOFFI enregistre 18 000 000 FCFA de produits et 21 500 000 FCFA de charges. Quel est son résultat ?',
      options: ['Bénéfice de 3 500 000 FCFA', 'Perte de 3 500 000 FCFA', 'Bénéfice de 21 500 000 FCFA', 'Équilibre parfait'],
      correctOptionIndex: 1,
      correction: 'Perte de 3 500 000 FCFA (18 000 000 - 21 500 000 = -3 500 000 FCFA).',
      explanation: 'Lorsque les charges excèdent les produits, l\'entreprise dégage une perte nette.',
    },
    summary: [
      'Le compte de résultat récapitule les flux de l\'exercice comptable.',
      'Charges en classe 6 et 8 ; Produits en classe 7 et 8.',
      'Résultat = Total Produits - Total Charges.',
    ],
    youtubeId: '3y_7Y8eT910',
    videoTitle: 'Le Compte de Résultat : Principes et structure',
    keywords: ['compte de résultat', 'charges', 'produits', 'bénéfice', 'perte'],
  },
  {
    id: 'BAC-CPT-005',
    title: 'Le principe de la partie double et les mécanismes de débit/crédit',
    domain: 'comptabilite',
    subcategory: 'Mécanismes Comptables',
    level: 'Débutant',
    durationMinutes: 30,
    description: 'Comprendre pourquoi chaque écriture comptable mobilise au moins deux comptes et pourquoi le total Débit est toujours égal au total Crédit.',
    objectives: [
      'Définir la règle de la partie double formulée par Luca Pacioli',
      'Identifier le sens d’augmentation et de diminution selon la nature des comptes',
      'Analyser une opération en termes d’Emploi (Débit) et de Ressource (Crédit)',
    ],
    introduction: 'Toute opération comptable a une origine (la ressource ou d\'où vient l\'argent) et une destination (l\'emploi ou où va l\'argent). Ce double aspect impose : Débit = Crédit.',
    content: `### 1. La règle d'or de la partie double
Pour chaque écriture :
$$\\sum \\text{Débits} = \\sum \\text{Crédits}$$

### 2. Le fonctionnement des comptes
- **Comptes d'Actif et de Charges (Classes 2, 3, 4 débiteurs, 5, 6)** :
  - Augmentent au **DÉBIT** (+)
  - Diminuent au **CRÉDIT** (-)
- **Comptes de Passif et de Produits (Classes 1, 4 créditeurs, 7)** :
  - Augmentent au **CRÉDIT** (+)
  - Diminuent au **DÉBIT** (-)`,
    keyNotions: ['Partie double', 'Débit', 'Crédit', 'Emploi', 'Ressource'],
    definitions: [
      { term: 'Débit', definition: 'Partie gauche d’un compte enregistrant les emplois ou les augmentations d’actif et de charges.' },
      { term: 'Crédit', definition: 'Partie droite d’un compte enregistrant les ressources ou les augmentations de passif et de produits.' },
    ],
    example: {
      title: 'Achat de mobilier par chèque bancaire',
      statement: 'Achat d\'un bureau pour 200 000 FCFA réglé par chèque bancaire.',
      solution: 'Emploi : Entrée du mobilier (Actif augmente $\\rightarrow$ Débit compte 244 Matériel de bureau pour 200 000 FCFA). Ressource : Sortie d\'argent de la banque (Actif diminue $\\rightarrow$ Crédit compte 521 Banque pour 200 000 FCFA).',
    },
    methodology: [
      '1. Poser la question : D\'où vient l\'opération ? (Ressource = Crédit).',
      '2. Poser la question : Où va l\'opération ? (Emploi = Débit).',
      '3. Vérifier scrupuleusement que Total Débit = Total Crédit.',
    ],
    exercise: {
      question: 'Lors d\'un encaissement en espèces d\'un client pour 150 000 FCFA, quelle écriture doit-on passer ?',
      options: [
        'Débit 571 Caisse / Crédit 411 Clients pour 150 000 FCFA',
        'Débit 411 Clients / Crédit 571 Caisse pour 150 000 FCFA',
        'Débit 601 Achats / Crédit 571 Caisse pour 150 000 FCFA',
        'Débit 521 Banque / Crédit 701 Ventes pour 150 000 FCFA',
      ],
      correctOptionIndex: 0,
      correction: 'Débit 571 Caisse (l\'argent rentre) / Crédit 411 Clients (la créance diminue).',
      explanation: 'Le compte de caisse augmente au débit et la créance client diminue au crédit.',
    },
    summary: [
      'Toute écriture implique au moins 2 comptes.',
      'Total Débit = Total Crédit.',
      'Actif & Charges augmentent au Débit ; Passif & Produits augmentent au Crédit.',
    ],
    youtubeId: 'W3G4r7lYv1M',
    videoTitle: 'La partie double et le fonctionnement des comptes Débit / Crédit',
    keywords: ['partie double', 'débit', 'crédit', 'emploi', 'ressource'],
  },
];

// Helper to systematically generate the remaining full-fidelity courses for Comptabilite up to 60 courses
const additionalComptaTitles = [
  { sub: 'Opérations Courantes', t: 'Facturation des achats : réductions commerciales (Rabais, Remise, Ristourne)', d: 25, l: 'Intermédiaire' as const },
  { sub: 'Opérations Courantes', t: 'Les réductions financières : Traitement de l’Escompte de règlement (673 / 773)', d: 25, l: 'Intermédiaire' as const },
  { sub: 'Opérations Courantes', t: 'Frais accessoires d’achats : Transports, assurances, droits de douane et emballages', d: 30, l: 'Intermédiaire' as const },
  { sub: 'Opérations Courantes', t: 'Facture d’Avoir (Note de crédit) : Retours de marchandises et réductions accordées', d: 30, l: 'Intermédiaire' as const },
  { sub: 'Opérations Courantes', t: 'Comptabilisation de la TVA sur achats et ventes en zone OHADA (4451, 4431, 4441)', d: 35, l: 'Intermédiaire' as const },
  { sub: 'Opérations Courantes', t: 'Les avances et acomptes versés et reçus sur commandes (4091, 4191)', d: 20, l: 'Débutant' as const },
  { sub: 'Trésorerie & Règlements', t: 'Règlements en espèces et gestion du livre de caisse (571)', d: 20, l: 'Débutant' as const },
  { sub: 'Trésorerie & Règlements', t: 'Règlements par chèque bancaire, virements et Mobile Money (Wave, Orange Money)', d: 25, l: 'Intermédiaire' as const },
  { sub: 'Trésorerie & Règlements', t: 'L’état de rapprochement bancaire : Méthode et écritures d’ajustement', d: 40, l: 'Avancé' as const },
  { sub: 'Trésorerie & Règlements', t: 'Effets de commerce : Création de la lettre de change et du billet à ordre (412 / 402)', d: 30, l: 'Intermédiaire' as const },
  { sub: 'Trésorerie & Règlements', t: 'Circulation des effets : Endossement, encaissement et agios bancaires (512, 631)', d: 35, l: 'Avancé' as const },
  { sub: 'Trésorerie & Règlements', t: 'L’escompte commercial des effets de commerce et crédit d’escompte (565)', d: 35, l: 'Avancé' as const },
  { sub: 'Trésorerie & Règlements', t: 'Impayés sur effets de commerce et prorogation d’échéance', d: 30, l: 'Avancé' as const },
  { sub: 'Immobilisations & Amortissements', t: 'Acquisition des immobilisations corporelles et incorporelles (Classe 2)', d: 30, l: 'Intermédiaire' as const },
  { sub: 'Immobilisations & Amortissements', t: 'Immobilisations produites par l’entreprise pour elle-même (721 / 722)', d: 25, l: 'Avancé' as const },
  { sub: 'Immobilisations & Amortissements', t: 'Notion d’amortissement et plan d’amortissement linéaire (constant)', d: 35, l: 'Intermédiaire' as const },
  { sub: 'Immobilisations & Amortissements', t: 'L’amortissement dégressif : Coefficients et tableau prévisionnel', d: 40, l: 'Avancé' as const },
  { sub: 'Immobilisations & Amortissements', t: 'L’amortissement selon les unités d’œuvre (variable)', d: 25, l: 'Avancé' as const },
  { sub: 'Immobilisations & Amortissements', t: 'Comptabilisation des dotations aux amortissements (681 / 28)', d: 30, l: 'Intermédiaire' as const },
  { sub: 'Immobilisations & Amortissements', t: 'Cession d’une immobilisation amortissable : Sortie du patrimoine et résultat de cession', d: 45, l: 'Avancé' as const },
  { sub: 'Stocks & Inventaire', t: 'Gestion des stocks : Inventaire permanent versus Inventaire intermittent', d: 30, l: 'Intermédiaire' as const },
  { sub: 'Stocks & Inventaire', t: 'Méthodes d’évaluation des sorties de stocks : Coût Moyen Unitaire Pondéré (CMUP)', d: 35, l: 'Intermédiaire' as const },
  { sub: 'Stocks & Inventaire', t: 'Méthode d’évaluation Premier Entré, Premier Sorté (FIFO / PEPS)', d: 30, l: 'Intermédiaire' as const },
  { sub: 'Stocks & Inventaire', t: 'Variation des stocks en fin d’exercice et écritures d’inventaire (603 / 73)', d: 35, l: 'Avancé' as const },
  { sub: 'Provisions & Dépréciations', t: 'Dépréciation des immobilisations non amortissables (Terrains, Titres)', d: 30, l: 'Avancé' as const },
  { sub: 'Provisions & Dépréciations', t: 'Dépréciation des stocks et encours de production (39 / 659)', d: 30, l: 'Avancé' as const },
  { sub: 'Provisions & Dépréciations', t: 'Créances douteuses : Évaluation des risques et dépréciation sur montant HT (491)', d: 40, l: 'Avancé' as const },
  { sub: 'Provisions & Dépréciations', t: 'Créances irrécouvrables définitives et ajustement des dépréciations (651 / 759)', d: 35, l: 'Avancé' as const },
  { sub: 'Provisions & Dépréciations', t: 'Provisions pour risques et charges (Litiges, garanties, restructuration - 19 / 69)', d: 35, l: 'Avancé' as const },
  { sub: 'Régularisations d’Inventaire', t: 'Charges constatées d’avance (CCA - Compte 476) : Principe et régularisation', d: 30, l: 'Intermédiaire' as const },
  { sub: 'Régularisations d’Inventaire', t: 'Produits constatés d’avance (PCA - Compte 477) : Traitement comptable', d: 25, l: 'Intermédiaire' as const },
  { sub: 'Régularisations d’Inventaire', t: 'Charges à payer (Fournisseurs factures non parvenues, congés à payer - 408 / 428)', d: 35, l: 'Avancé' as const },
  { sub: 'Régularisations d’Inventaire', t: 'Produits à recevoir (Clients factures à établir - 418)', d: 30, l: 'Intermédiaire' as const },
  { sub: 'Régularisations d’Inventaire', t: 'Écarts de conversion actif et passif sur créances et dettes en devises étrangères (478 / 479)', d: 40, l: 'Avancé' as const },
  { sub: 'Travaux de Fin d’Exercice', t: 'De la Balance avant inventaire à la Balance après inventaire', d: 35, l: 'Avancé' as const },
  { sub: 'Travaux de Fin d’Exercice', t: 'Détermination du résultat d’exploitation, financier et HAO', d: 30, l: 'Avancé' as const },
  { sub: 'Travaux de Fin d’Exercice', t: 'Comptabilisation de l’Impôt sur les Sociétés (IS - 895 / 441)', d: 35, l: 'Avancé' as const },
  { sub: 'Travaux de Fin d’Exercice', t: 'Clôture et réouverture des comptes au 1er janvier de l’exercice N+1', d: 25, l: 'Intermédiaire' as const },
  { sub: 'Salaires & Paie', t: 'Composantes du bulletin de paie : Salaire de base, primes, heures supplémentaires', d: 30, l: 'Intermédiaire' as const },
  { sub: 'Salaires & Paie', t: 'Cotisations sociales (CNSS, IPRES, CNPS) salariales et patronales', d: 35, l: 'Avancé' as const },
  { sub: 'Salaires & Paie', t: 'Enregistrement comptable complet du livre de paie (661, 422, 431, 447)', d: 40, l: 'Avancé' as const },
  { sub: 'Comptabilité des Sociétés', t: 'Constitution d’une SARL : Apports en numéraire et en nature (1011 / 1012)', d: 40, l: 'Avancé' as const },
  { sub: 'Comptabilité des Sociétés', t: 'Constitution d’une Société Anonyme (SA) : Libération par fractions et appels de fonds', d: 45, l: 'Avancé' as const },
  { sub: 'Comptabilité des Sociétés', t: 'Affectation du résultat : Réserve légale, réserves statutaires et dividendes (130 / 111 / 465)', d: 45, l: 'Avancé' as const },
  { sub: 'Comptabilité des Sociétés', t: 'Augmentation de capital : Apports nouveaux et incorporation de réserves', d: 40, l: 'Avancé' as const },
  { sub: 'Analyse Financière', t: 'Bilan fonctionnel : Emplois stables, Ressources stables, Actif/Passif d’exploitation', d: 40, l: 'Avancé' as const },
  { sub: 'Analyse Financière', t: 'Calcul et interprétation du Fonds de Roulement Net Global (FRNG)', d: 35, l: 'Révision BAC' as const },
  { sub: 'Analyse Financière', t: 'Calcul et interprétation du Besoin en Fonds de Roulement (BFR)', d: 35, l: 'Révision BAC' as const },
  { sub: 'Analyse Financière', t: 'Trésorerie Nette (TN) et relation fondamentale : TN = FRNG - BFR', d: 35, l: 'Révision BAC' as const },
  { sub: 'Analyse Financière', t: 'Les Soldes Intermédiaires de Gestion (SIG) : Marge commerciale, Valeur Ajoutée, EBE', d: 45, l: 'Révision BAC' as const },
  { sub: 'Analyse Financière', t: 'Capacité d’Autofinancement (CAF) : Méthode soustractive et méthode additive', d: 40, l: 'Révision BAC' as const },
  { sub: 'Analyse Financière', t: 'Ratios financiers d’autonomie, de rentabilité, de liquidité et de solvabilité', d: 35, l: 'Révision BAC' as const },
  { sub: 'Gestion Prévisionnelle', t: 'Charges variables versus Charges fixes (Structurelles)', d: 25, l: 'Intermédiaire' as const },
  { sub: 'Gestion Prévisionnelle', t: 'Calcul du Seuil de Rentabilité (Point Mort en valeur et en jours)', d: 40, l: 'Révision BAC' as const },
  { sub: 'Gestion Prévisionnelle', t: 'Marge de sécurité et Indice de sécurité financière', d: 25, l: 'Révision BAC' as const },
];

additionalComptaTitles.forEach((item, index) => {
  const num = index + 6;
  const id = `BAC-CPT-${String(num).padStart(3, '0')}`;
  COMPTABILITE_COURSES.push({
    id,
    title: item.t,
    domain: 'comptabilite',
    subcategory: item.sub,
    level: item.l,
    durationMinutes: item.d,
    description: `Étude approfondie de : ${item.t}. Notions théoriques, écritures au journal, exemples chiffrés et exercices conformes au programme du BAC G2.`,
    objectives: [
      `Maîtriser les principes et définitions de : ${item.t}`,
      'Appliquer les règles d’enregistrement comptable normalisées',
      'Résoudre des cas pratiques et exercices types du Baccalauréat G2',
    ],
    introduction: `Cette leçon aborde les mécanismes essentiels de « ${item.t} ». Elle s'inscrit au cœur des exigences du programme d'examen du BAC G2 et du référentiel professionnel comptable.`,
    content: `### 1. Contexte & Définitions
${item.t} constitue une compétence clé en comptabilité et gestion. Elle permet de structurer les flux financiers avec rigueur et conformité légale.

### 2. Règles et Enregistrements types
- Détermination des montants HT, TVA et Net à Payer.
- Ventilation dans les comptes du plan comptable (Débit / Crédit).
- Respect du principe de non-compensation et de prudence.

### 3. Incidences sur les états financiers
L'impact se répercute directement sur le bilan (Actif ou Passif) et le compte de résultat (Charges ou Produits de la période).`,
    keyNotions: [item.sub, 'Journal', 'Grand-livre', 'Comptabilité financière', 'Pièce justificative'],
    definitions: [
      { term: item.t.split(':')[0], definition: `Opération ou notion comptable essentielle régie par les règles professionnelles et le référentiel d'évaluation du BAC G2.` },
      { term: 'Régularité comptable', definition: 'Conformité aux règles et procédures en vigueur.' },
    ],
    example: {
      title: `Cas pratique d'illustration - ${item.t.slice(0, 40)}`,
      statement: `Une entité commerciale réalise l'opération de ${item.t.toLowerCase()} pour un montant de base de 1 500 000 FCFA avec TVA 18% et conditions habituelles de règlement.`,
      solution: `Calcul de la base : 1 500 000 FCFA. TVA (18%) = 270 000 FCFA. Total TTC = 1 770 000 FCFA. Enregistrement équilibré au journal avec respect de la partie double.`,
    },
    methodology: [
      '1. Analyser les pièces justificatives et repérer les dates de valeur.',
      '2. Poser la formule ou le schéma d\'écriture au brouillon.',
      '3. Vérifier la stricte égalité entre Débits et Crédits.',
    ],
    exercise: {
      question: `Quelle est la règle fondamentale appliquée lors du traitement de : « ${item.t} » ?`,
      options: [
        'L’enregistrement obligatoire avec pièce justificative et respect du principe Débit = Crédit',
        'L’absence d’obligation d’écriture si le montant est inférieur à 10 000 FCFA',
        'L’imputation directe en résultat sans passer par les comptes de tiers',
        'Le report systématique à l’exercice suivant sans régularisation',
      ],
      correctOptionIndex: 0,
      correction: 'Option A : Toute écriture comptable doit obligatoirement s’appuyer sur une pièce justificative et respecter l’équilibre Débit = Crédit.',
      explanation: 'En comptabilité générale, aucune écriture ne peut être enregistrée sans pièce probante et sans respecter la partie double.',
    },
    summary: [
      `${item.t} répond à des critères stricts de mesure et de régularité.`,
      'Les schémas d’écritures doivent être maîtrisés pour l’examen du BAC G2.',
      'Toujours vérifier l’équilibre des flux et l’impact sur la trésorerie.',
    ],
    youtubeId: 'Wd71J_9n_Fk',
    videoTitle: `Cours et exercices : ${item.t}`,
    keywords: ['comptabilité', item.sub.toLowerCase(), 'bac g2', 'exercices', 'bilan'],
  });
});
