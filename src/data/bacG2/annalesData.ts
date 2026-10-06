import { BacG2Annale } from '../../types/bacG2';

export const BAC_G2_ANNALES_DATABASE: BacG2Annale[] = [
  {
    id: 'annale-bac-2024-compta-syscohada',
    title: 'Épreuve Officielle de Comptabilité Générale & SYSCOHADA',
    session: 'Session Normale 2024',
    year: 2024,
    domain: 'syscohada',
    durationMinutes: 180,
    coefficient: 6,
    instructions: 'Calculatrice autonome non programmable autorisée. Conformité obligatoire au plan de comptes du SYSCOHADA Révisé. Tout schéma d\'écriture doit comporter le numéro du compte, l\'intitulé et le libellé.',
    statement: `La société anonyme « IVOIRE INDUSTRIE SA » au capital de 50 000 000 FCFA vous confie au 31 décembre 2023 les documents de son service comptable afin d'effectuer les travaux de régularisation et de clôture d'exercice.`,
    sections: [
      {
        title: 'Première Partie : Travaux d’inventaire et régularisations (10 points)',
        points: 10,
        questions: [
          {
            question: '1. Un camion acquis le 01/07/2021 pour 18 000 000 FCFA HT est amorti selon le mode linéaire sur 5 ans. Déterminer la dotation aux amortissements au 31/12/2023 et passer l’écriture comptable correspondante.',
            answerKey: `Calcul de la dotation N : Annuité = 18 000 000 × 20% = 3 600 000 FCFA pour une année complète (2023).
Écriture au 31/12/2023 :
- Débit : 6813 Dotations aux amortissements des immobilisations corporelles = 3 600 000 FCFA
- Crédit : 2845 Amortissements du matériel de transport = 3 600 000 FCFA
Libellé : Dotation annuelle amortissement camion.`,
            points: 4,
          },
          {
            question: '2. L’état des créances clients fait apparaître un client douteux « ETS DIOP » débiteur de 2 360 000 FCFA TTC (TVA 18%). Une dépréciation de 30% du montant HT avait été constatée au 31/12/2022. Au 31/12/2023, la perte probable est réévaluée à 50%. Enregistrer l’ajustement nécessaire.',
            answerKey: `Calculs :
- Montant HT = 2 360 000 / 1.18 = 2 000 000 FCFA.
- Dépréciation 2022 existante = 2 000 000 × 30% = 600 000 FCFA.
- Dépréciation 2023 nécessaire = 2 000 000 × 50% = 1 000 000 FCFA.
- Ajustement à constater (Dotation complémentaire) = 1 000 000 - 600 000 = 400 000 FCFA.
Écriture au 31/12/2023 :
- Débit : 6594 Charges pour dépréciations sur créances = 400 000 FCFA
- Crédit : 4911 Dépréciations des comptes clients = 400 000 FCFA.`,
            points: 3,
          },
          {
            question: '3. Le 01/10/2023, l’entreprise a réglé d’avance une prime d’assurance annuelle de 1 200 000 FCFA couvrant la période du 01/10/2023 au 30/09/2024. Passer l’écriture de régularisation.',
            answerKey: `Calcul de la quote-part sur l'exercice N+1 :
Période 2024 = 9 mois sur 12.
Montant à reporter = 1 200 000 × (9/12) = 900 000 FCFA.
Écriture au 31/12/2023 :
- Débit : 476 Charges constatées d’avance = 900 000 FCFA
- Crédit : 625 Primes d’assurances = 900 000 FCFA.`,
            points: 3,
          },
        ],
      },
      {
        title: 'Deuxième Partie : Analyse Financière & Soldes Intermédiaires (10 points)',
        points: 10,
        questions: [
          {
            question: '1. À partir des soldes de gestion (Ventes de marchandises : 45 000 000 FCFA, Achats de marchandises : 25 000 000 FCFA, Variation de stocks : +2 000 000 FCFA, Services extérieurs : 6 000 000 FCFA, Impôts et taxes : 1 500 000 FCFA, Charges de personnel : 8 500 000 FCFA), calculer la Marge Commerciale, la Valeur Ajoutée (VA) et l’Excédent Brut d’Exploitation (EBE).',
            answerKey: `Calculs pas à pas :
- Coût d'achat des marchandises vendues = Achats (25M) - Var. stocks (+2M) = 23 000 000 FCFA.
- Marge Commerciale = Ventes (45M) - Coût d'achat (23M) = 22 000 000 FCFA.
- Valeur Ajoutée (VA) = Marge Commerciale (22M) - Services extérieurs (6M) = 16 000 000 FCFA.
- Excédent Brut d'Exploitation (EBE) = VA (16M) - Impôts/taxes (1.5M) - Charges de personnel (8.5M) = 6 000 000 FCFA.`,
            points: 5,
          },
          {
            question: '2. Déterminer le Fonds de Roulement Net Global (FRNG) et la Trésorerie Nette sachant que Ressources Stables = 35 000 000 FCFA, Emplois Stables = 28 000 000 FCFA et Besoin en Fonds de Roulement (BFR) = 4 500 000 FCFA. Interpréter la situation.',
            answerKey: `Calculs :
- FRNG = Ressources Stables - Emplois Stables = 35 000 000 - 28 000 000 = +7 000 000 FCFA (Excédent de ressources à long terme).
- Trésorerie Nette (TN) = FRNG - BFR = 7 000 000 - 4 500 000 = +2 500 000 FCFA.
Interprétation : La structure financière est saine et équilibrée. Les capitaux permanents financent la totalité des immobilisations et dégagent une marge de sécurité (FRNG positif) qui couvre l'intégralité du BFR tout en laissant une trésorerie disponible positive de 2 500 000 FCFA.`,
            points: 5,
          },
        ],
      },
    ],
  },
  {
    id: 'annale-bac-2023-fiscalite-droit',
    title: 'Épreuve Officielle de Droit des Affaires & Fiscalité',
    session: 'Session Normale 2023',
    year: 2023,
    domain: 'fiscalite',
    durationMinutes: 180,
    coefficient: 5,
    instructions: 'Justifiez chaque réponse par le visa précis des textes juridiques et fiscaux (Code Général des Impôts et Actes Uniformes OHADA).',
    statement: `Mme KOUASSI est directrice d'une entreprise commerciale assujettie au régime réel normal d'imposition. Elle vous soumet deux situations juridiques et fiscales pour expertise.`,
    sections: [
      {
        title: 'Première Partie : Déclaration de TVA & Crédit d’impôt (10 points)',
        points: 10,
        questions: [
          {
            question: 'Au cours du mois de novembre, l’entreprise a réalisé un chiffre d’affaires taxable de 30 000 000 FCFA HT (Taux de TVA 18%). Les achats de matières premières s’élèvent à 12 000 000 FCFA HT. Les achats de carburant pour véhicules de tourisme de direction s’élèvent à 1 500 000 FCFA TTC. L’entreprise disposait d’un crédit de TVA reporté d’octobre de 800 000 FCFA. Calculer la TVA due ou le nouveau crédit de TVA.',
            answerKey: `Calculs de la déclaration :
1. TVA Collectée = 30 000 000 × 18% = 5 400 000 FCFA.
2. TVA Déductible sur achats = 12 000 000 × 18% = 2 160 000 FCFA.
3. TVA sur carburant véhicules de tourisme = 0 FCFA (Exclusion légale du droit à déduction selon le Code Général des Impôts).
4. Total TVA Déductible du mois = 2 160 000 FCFA.
5. Crédit de TVA antérieur reporté = 800 000 FCFA.
6. Total à déduire = 2 160 000 + 800 000 = 2 960 000 FCFA.
7. TVA Nette due = 5 400 000 - 2 960 000 = 2 440 000 FCFA à reverser au Trésor Public avant le 15 décembre.`,
            points: 10,
          },
        ],
      },
      {
        title: 'Deuxième Partie : Cas Pratique de Droit Commercial (10 points)',
        points: 10,
        questions: [
          {
            question: 'Un commerçant locataire d’un local commercial depuis 4 années consécutives reçoit un congé sans offre de renouvellement de son bailleur, sans motif grave ni indemnité. Qualifier le droit du locataire selon l’Acte Uniforme OHADA portant sur le Droit Commercial Général et formuler la solution juridique.',
            answerKey: `Résolution par syllogisme :
1. Majeure (Règle de droit) : Selon l'Acte Uniforme OHADA portant sur le Droit Commercial Général (AUDCG), le preneur qui justifie avoir exploité le fonds pendant au moins deux ans a droit au renouvellement de son bail commercial. En cas de refus injustifié de renouvellement, le bailleur est tenu de verser une indemnité d'éviction réparant le préjudice causé.
2. Mineure (Faits) : Le locataire exploite le local depuis 4 ans (supérieur au minimum légal de 2 ans) et a reçu un congé non motivé sans indemnité.
3. Conclusion : Le congé sans motif légitime donne droit au locataire d'exiger le paiement intégral d'une indemnité d'éviction fixée à dire d'expert ou par le tribunal compétent.`,
            points: 10,
          },
        ],
      },
    ],
  },
];
