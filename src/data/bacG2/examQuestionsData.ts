import { BacG2ExamQuestion, BacG2Domain } from '../../types/bacG2';

export const BAC_G2_EXAM_QUESTIONS_BANK: BacG2ExamQuestion[] = [
  // COMPTABILITÉ
  {
    id: 'q-cpt-01',
    domain: 'comptabilite',
    subcategory: 'Bilan & Patrimoine',
    level: 'Débutant',
    question: 'Dans un bilan comptable régulier, comment sont classés les éléments de l’Actif ?',
    options: [
      'Par ordre de liquidité croissante',
      'Par ordre d’exigibilité croissante',
      'Par ordre alphabétique des intitulés de compte',
      'Par ordre de valeur marchande décroissante',
    ],
    correctIndex: 0,
    explanation: 'L’actif du bilan est structuré par degré de liquidité croissante (de l’actif immobilisé le moins liquide jusqu’aux disponibilités en banque et caisse).',
    points: 1,
  },
  {
    id: 'q-cpt-02',
    domain: 'comptabilite',
    subcategory: 'Amortissements',
    level: 'Intermédiaire',
    question: 'Une machine industrielle d’une valeur de 12 000 000 FCFA HT acquise le 01/04/N est amortie en linéaire sur 5 ans (taux 20%). Quelle est l’annuité d’amortissement de l’exercice N ?',
    options: [
      '2 400 000 FCFA',
      '1 800 000 FCFA (Prorata temporis de 9 mois)',
      '1 200 000 FCFA (Prorata temporis de 6 mois)',
      '600 000 FCFA',
    ],
    correctIndex: 1,
    explanation: 'La première annuité se calcule au prorata temporis du 01/04 au 31/12 (9 mois) : 12 000 000 × 20% × (9/12) = 1 800 000 FCFA.',
    points: 2,
  },
  {
    id: 'q-cpt-03',
    domain: 'comptabilite',
    subcategory: 'Analyse Financière',
    level: 'Révision BAC',
    question: 'Une entreprise présente des Ressources Stables de 40 000 000 FCFA, des Emplois Stables de 32 000 000 FCFA et un BFR de 5 000 000 FCFA. Quelle est sa Trésorerie Nette ?',
    options: [
      '+3 000 000 FCFA',
      '+8 000 000 FCFA',
      '-3 000 000 FCFA',
      '+13 000 000 FCFA',
    ],
    correctIndex: 0,
    explanation: 'FRNG = 40M - 32M = +8 000 000 FCFA. Trésorerie Nette = FRNG - BFR = 8 000 000 - 5 000 000 = +3 000 000 FCFA.',
    points: 2,
  },
  {
    id: 'q-cpt-04',
    domain: 'comptabilite',
    subcategory: 'Opérations Courantes',
    level: 'Intermédiaire',
    question: 'Quel est le traitement comptable d’un escompte de règlement de 2% accordé à un client sur une facture de vente ?',
    options: [
      'Il est déduit du chiffre d’affaires en classe 7 sans compte séparé',
      'Il est comptabilisé au débit du compte 673 « Escomptes accordés » (Charge financière)',
      'Il est comptabilisé au crédit du compte 773 « Escomptes obtenus »',
      'Il est reporté au bilan de clôture sans écriture de gestion',
    ],
    correctIndex: 1,
    explanation: 'Pour le fournisseur, l’escompte accordé est une réduction financière inscrite au Débit du compte 673.',
    points: 1,
  },
  // FISCALITÉ
  {
    id: 'q-fis-01',
    domain: 'fiscalite',
    subcategory: 'TVA',
    level: 'Intermédiaire',
    question: 'Dans la plupart des pays de l’espace OHADA/UEMOA, quel est le taux normal standard de la TVA ?',
    options: ['18%', '25%', '10%', '5%'],
    correctIndex: 0,
    explanation: 'Le taux normal de TVA est harmonisé à 18% dans l’espace UEMOA (Sénégal, Côte d’Ivoire, Mali, Burkina, Togo, Bénin, Niger, Guinée-Bissau).',
    points: 1,
  },
  {
    id: 'q-fis-02',
    domain: 'fiscalite',
    subcategory: 'Impôt sur les Sociétés',
    level: 'Avancé',
    question: 'Lors de la détermination du résultat fiscal, comment traite-t-on une amende pénale pour infraction au code de la route payée par l’entreprise ?',
    options: [
      'Elle est déductible du résultat fiscal sans restriction',
      'Elle doit obligatoirement être réintégrée au résultat comptable (Charge non déductible)',
      'Elle ouvre droit à un crédit d’impôt remboursable',
      'Elle est déduite extra-comptablement',
    ],
    correctIndex: 1,
    explanation: 'Les pénalités, amendes et sanctions de toute nature infligées par une autorité publique sont expressément exclues des charges déductibles et doivent être réintégrées au résultat fiscal.',
    points: 2,
  },
  {
    id: 'q-fis-03',
    domain: 'fiscalite',
    subcategory: 'TVA',
    level: 'Révision BAC',
    question: 'Une entreprise réalise 20 000 000 FCFA HT de ventes taxables (TVA 18%) et supporte 1 800 000 FCFA de TVA déductible sur achats. Elle a un crédit antérieur de 400 000 FCFA. Quel est le montant de la TVA due au Trésor ?',
    options: [
      '1 400 000 FCFA',
      '3 600 000 FCFA',
      '1 800 000 FCFA',
      '0 FCFA (Crédit reportable)',
    ],
    correctIndex: 0,
    explanation: 'TVA collectée = 20M × 18% = 3 600 000 FCFA. TVA déductible totale = 1 800 000 + 400 000 = 2 200 000 FCFA. TVA due = 3 600 000 - 2 200 000 = 1 400 000 FCFA.',
    points: 2,
  },
  // DROIT
  {
    id: 'q-dro-01',
    domain: 'droit',
    subcategory: 'Droit des Contrats',
    level: 'Intermédiaire',
    question: 'Quels sont les vices traditionnels du consentement pouvant entraîner la nullité relative d’un contrat ?',
    options: [
      'L’Erreur, le Dol et la Violence',
      'Le Retard, l’Oubli et la Négligence',
      'L’Imprudence, la Force majeure et le Cas fortuit',
      'L’Illégalité, l’Incompétence et le Préjudice',
    ],
    correctIndex: 0,
    explanation: 'Selon la théorie générale des obligations, les trois vices du consentement sanctionnés par la nullité sont l’erreur, le dol (manœuvres frauduleuses) et la violence.',
    points: 1,
  },
  {
    id: 'q-dro-02',
    domain: 'droit',
    subcategory: 'Droit Commercial OHADA',
    level: 'Intermédiaire',
    question: 'Selon l’Acte Uniforme OHADA portant sur le Droit Commercial Général, après quelle durée minimale d’exploitation un commerçant locataire bénéficie-t-il du droit au renouvellement de son bail commercial ?',
    options: [
      '6 mois',
      '1 an',
      '2 années consécutives',
      '5 ans',
    ],
    correctIndex: 2,
    explanation: 'L’article 123 de l’AUDCG prévoit que le preneur a droit au renouvellement s’il justifie avoir exploité l’activité pendant une durée minimale de deux ans.',
    points: 2,
  },
  {
    id: 'q-dro-03',
    domain: 'droit',
    subcategory: 'Droit du Travail',
    level: 'Révision BAC',
    question: 'Quelle est la différence fondamentale entre la modification des conditions de travail et la modification substantielle du contrat de travail ?',
    options: [
      'La modification substantielle touche à un élément essentiel (salaire, qualification) et nécessite l’accord exprès du salarié',
      'L’employeur peut toujours modifier le salaire unilatéralement sans accord',
      'Le salarié ne peut jamais refuser une baisse de salaire',
      'Il n’existe aucune différence juridique entre les deux notions',
    ],
    correctIndex: 0,
    explanation: 'Une modification touchant à un élément essentiel (rémunération, temps de travail, qualification) est une modification substantielle qui requiert obligatoirement le consentement écrit du salarié.',
    points: 2,
  },
  // SYSCOHADA
  {
    id: 'q-sys-01',
    domain: 'syscohada',
    subcategory: 'Plan de Comptes',
    level: 'Débutant',
    question: 'Dans le plan de comptes du SYSCOHADA Révisé, quelle classe regroupe les « Charges des activités ordinaires » ?',
    options: ['Classe 6', 'Classe 7', 'Classe 2', 'Classe 8'],
    correctIndex: 0,
    explanation: 'La Classe 6 enregistre l’ensemble des charges d’exploitation et financières liées aux activités ordinaires de l’entité.',
    points: 1,
  },
  {
    id: 'q-sys-02',
    domain: 'syscohada',
    subcategory: 'Postulats Comptables',
    level: 'Intermédiaire',
    question: 'Quel principe comptable du SYSCOHADA stipule que le bilan d’ouverture d’un exercice doit être identique au bilan de clôture de l’exercice précédent ?',
    options: [
      'Le principe d’intangibilité du bilan d’ouverture',
      'Le principe de permanence des méthodes',
      'Le principe de la partie double',
      'Le principe du coût historique',
    ],
    correctIndex: 0,
    explanation: 'L’intangibilité du bilan d’ouverture interdit toute modification directe des soldes d’ouverture sans passer par les écritures du journal de l’exercice en cours.',
    points: 1,
  },
  {
    id: 'q-sys-03',
    domain: 'syscohada',
    subcategory: 'États Financiers',
    level: 'Révision BAC',
    question: 'Quels sont les 4 documents de synthèse composant obligatoirement les états financiers annuels du système normal SYSCOHADA ?',
    options: [
      'Le Bilan, le Compte de Résultat, le Tableau des Flux de Trésorerie (TFT) et les Notes Annexes',
      'Le Journal, le Grand-livre, la Balance et le Relevé bancaire',
      'La Déclaration fiscale, le Registre de paie, la Facture et le Chèque',
      'Le Bilan et le Compte de Résultat uniquement',
    ],
    correctIndex: 0,
    explanation: 'L’Acte Uniforme OHADA révisé impose le Bilan, le Compte de Résultat, le Tableau des Flux de Trésorerie (TFT) et les Notes Annexes.',
    points: 2,
  },
  {
    id: 'q-sys-04',
    domain: 'syscohada',
    subcategory: 'Écritures d’inventaire',
    level: 'Avancé',
    question: 'En SYSCOHADA, comment enregistre-t-on la variation du stock final de marchandises de 6 000 000 FCFA lors de la clôture (après annulation du stock initial) ?',
    options: [
      'Débit 31 Marchandises / Crédit 6031 Variation de stocks de marchandises pour 6 000 000 FCFA',
      'Débit 6031 Variation de stocks / Crédit 31 Marchandises pour 6 000 000 FCFA',
      'Débit 701 Ventes / Crédit 31 Marchandises pour 6 000 000 FCFA',
      'Débit 521 Banque / Crédit 601 Achats pour 6 000 000 FCFA',
    ],
    correctIndex: 0,
    explanation: 'La constatation du stock final se fait au Débit du compte 31 (entrée à l’actif) par le Crédit du compte 6031 (atténuation des charges consommées).',
    points: 2,
  },
];

export function getExamQuestions(domain?: BacG2Domain | 'all', count = 10, level?: string): BacG2ExamQuestion[] {
  let list = [...BAC_G2_EXAM_QUESTIONS_BANK];
  if (domain && domain !== 'all') {
    list = list.filter((q) => q.domain === domain);
  }
  if (level && level !== 'Tous') {
    list = list.filter((q) => q.level === level);
  }
  // Shuffle
  const shuffled = list.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
