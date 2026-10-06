import { BacG2CheatSheet } from '../../types/bacG2';

export const BAC_G2_CHEAT_SHEETS: BacG2CheatSheet[] = [
  {
    id: 'fiche-001',
    title: 'Les 9 Principes & Postulats du SYSCOHADA Révisé',
    domain: 'syscohada',
    readTime: '4 min',
    highlights: [
      'Postulat de l’entité & Continuité d’exploitation',
      'Convention de prudence & Coût historique',
      'Indépendance des exercices & Permanence des méthodes',
    ],
    content: `Le Système Comptable OHADA (SYSCOHADA) repose sur des règles fondamentales garantissant l’image fidèle :
1. **Entité comptable** : Séparation stricte entre le patrimoine de l’entreprise et celui de ses propriétaires.
2. **Continuité d’exploitation** : Évaluation des biens dans la perspective de poursuite normale de l’activité.
3. **Comptabilité d’engagement** : Enregistrement des flux dès leur naissance juridique, indépendamment du paiement effectif.
4. **Indépendance des exercices** : Rattachement exclusif des charges et produits à l’exercice au cours duquel ils ont été consommés ou acquis.
5. **Coût historique** : Maintien de la valeur d’entrée des biens au bilan sans réévaluation arbitraire.
6. **Prudence** : Constatation immédiate des pertes probables (dépréciations) dès qu’elles sont prévisibles, mais non-prise en compte des gains potentiels.
7. **Permanence des méthodes** : Utilisation constante des mêmes règles d’évaluation d’un exercice à l’autre.
8. **Intangibilité du bilan d’ouverture** : Le bilan d’ouverture d’un exercice doit correspondre exactement au bilan de clôture de l’exercice précédent.
9. **Prééminence de la réalité économique (Substance over form)** : Enregistrement selon la substance économique (ex : crédit-bail inscrit à l’actif).`,
    formulasOrRules: [
      { label: 'Bilan d\'ouverture', formula: 'Bilan Ouverture (N) = Bilan Clôture (N-1)', explanation: 'Principe d\'intangibilité du bilan' },
      { label: 'Règle de prudence', formula: 'Gains certains = comptabilisés / Pertes probables = provisionnées', explanation: 'Principe de prudence comptable' },
    ],
  },
  {
    id: 'fiche-002',
    title: 'Formules Clés de l’Analyse Financière (FRNG, BFR, TN & Ratios)',
    domain: 'comptabilite',
    readTime: '5 min',
    highlights: [
      'FRNG : Ressources Stables - Emplois Stables',
      'BFR : Actif Circulant Exploitation - Passif Circulant Exploitation',
      'Trésorerie Nette : TN = FRNG - BFR = TA - TP',
    ],
    content: `L’analyse de l’équilibre financier repose sur la confrontation des masses fonctionnelles du bilan :
- **FRNG (Fonds de Roulement Net Global)** : Excédent de capitaux permanents restant après financement des investissements durables.
- **BFR (Besoin en Fonds de Roulement)** : Montant net nécessaire pour financer le cycle d’exploitation (stocks + créances clients - dettes fournisseurs).
- **Trésorerie Nette (TN)** : Liquidités réelles disponibles. Elle représente le solde de la relation d’équilibre fondamental.`,
    formulasOrRules: [
      { label: 'FRNG', formula: 'Ressources Stables - Emplois Stables', explanation: 'Doit être positif pour sécuriser le financement long terme' },
      { label: 'BFR', formula: 'Actif Circulant (Hors Trésorerie) - Passif Circulant (Hors Trésorerie)', explanation: 'Financement net du cycle d\'activité' },
      { label: 'Trésorerie Nette', formula: 'FRNG - BFR = Trésorerie Actif - Trésorerie Passif', explanation: 'Relation fondamentale d\'équilibre' },
      { label: 'Ratio de Liquidité Générale', formula: 'Actif Circulant Total / Passif Circulant Total', explanation: 'Doit être supérieur à 1' },
      { label: 'Ratio d\'Autonomie Financière', formula: 'Capitaux Propres / Total Dettes Financières', explanation: 'Doit être supérieur ou égal à 1' },
    ],
  },
  {
    id: 'fiche-003',
    title: 'Mécanismes & Règles de Déclaration de la TVA',
    domain: 'fiscalite',
    readTime: '4 min',
    highlights: [
      'TVA Collectée sur ventes (4431)',
      'TVA Déductible sur achats et immobilisations (445)',
      'TVA à décaisser = TVA Collectée - TVA Déductible - Crédit antérieur',
    ],
    content: `La Taxe sur la Valeur Ajoutée (TVA) est un impôt indirect et neutre pour l’entreprise intermédiaire qui agit comme collecteur pour l’État :
1. **Fait générateur** :
   - Ventes de biens matériels : Livraison du bien.
   - Prestations de services : Encaissement du prix (sauf option pour les débits).
2. **Exclusions du droit à déduction** :
   - Dépenses de logement des dirigeants.
   - Véhicules de tourisme et carburant associé.
   - Cadeaux d’une valeur unitaire supérieure au plafond légal.
3. **Liquidation mensuelle** :
   - Si TVA Collectée > TVA Déductible $\\rightarrow$ **TVA à Décaisser (4441)** à régler avant le 15 du mois suivant.
   - Si TVA Déductible > TVA Collectée $\\rightarrow$ **Crédit de TVA (4449)** à reporter sur les mois suivants.`,
    formulasOrRules: [
      { label: 'TVA Collectée', formula: 'Prix de Vente HT × Taux de TVA (18%)', explanation: 'Dette envers le Trésor Public' },
      { label: 'Montant TTC', formula: 'Montant HT × (1 + Taux TVA)', explanation: 'Prix facturé au client final' },
      { label: 'TVA Nette due', formula: 'TVA Collectée - (TVA Déductible + Crédit reporté)', explanation: 'Solde de la déclaration mensuelle' },
    ],
  },
  {
    id: 'fiche-004',
    title: 'Méthodologie du Cas Pratique Juridique (Le Syllogisme)',
    domain: 'droit',
    readTime: '3 min',
    highlights: [
      '1. Majeure : Règle de droit générale et abstraite',
      '2. Mineure : Qualification des faits de l’espèce',
      '3. Conclusion : Solution juridique motivée',
    ],
    content: `Pour obtenir le maximum de points à l’épreuve de Droit au BAC G2, appliquez rigoureusement le syllogisme judiciaire :
- **Étape 1 : Qualification juridique**
  - Transformer les termes profanes en termes juridiques (ex : "M. Paul a loué un hangar pour vendre du tissu" $\\rightarrow$ "Contrat de bail à usage professionnel conclu entre commerçants").
- **Étape 2 : Énoncé du problème de droit**
  - Poser la question de droit sous forme abstraite (ex : "Le bailleur peut-il refuser le renouvellement du bail commercial sans motif légitime ?").
- **Étape 3 : La Majeure (La règle)**
  - Citer le texte légal : "Selon l’article 123 de l’Acte Uniforme OHADA portant sur le Droit Commercial Général...".
- **Étape 4 : La Mineure (L’application)**
  - "En l’espèce, le locataire remplit la condition de durée...".
- **Étape 5 : La Conclusion**
  - Répondre explicitement à la question posée.`,
    formulasOrRules: [
      { label: 'Structure Syllogisme', formula: 'Majeure (Règle) + Mineure (Faits) = Conclusion (Solution)', explanation: 'Raisonnement déductif juridique incontournable' },
    ],
  },
];
