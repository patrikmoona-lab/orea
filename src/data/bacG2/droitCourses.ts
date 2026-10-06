import { BacG2Course } from '../../types/bacG2';

const DROIT_DATA_ITEMS = [
  { t: 'Introduction générale au droit : Définition, caractères de la règle de droit et finalités', sub: 'Introduction au Droit', l: 'Débutant' as const, d: 20 },
  { t: 'Les sources du droit : Traités internationaux, lois, règlements, coutume et jurisprudence', sub: 'Introduction au Droit', l: 'Débutant' as const, d: 25 },
  { t: 'La hiérarchie des normes juridiques et le principe de constitutionnalité', sub: 'Introduction au Droit', l: 'Débutant' as const, d: 20 },
  { t: 'Les personnes physiques : Personnalité juridique, nom, domicile, état civil et nationalité', sub: 'Les Personnes & La Capacité', l: 'Débutant' as const, d: 25 },
  { t: 'Les personnes morales : Définition, création, organes de direction et responsabilité', sub: 'Les Personnes & La Capacité', l: 'Intermédiaire' as const, d: 25 },
  { t: 'La capacité juridique et les régimes d’incapacité (Mineurs, majeurs protégés, tutelle, curatelle)', sub: 'Les Personnes & La Capacité', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Le patrimoine juridique : Théorie d’Aubry et Rau, droits patrimoniaux et extrapatrimoniaux', sub: 'Les Personnes & La Capacité', l: 'Intermédiaire' as const, d: 25 },
  { t: 'Théorie générale des contrats : Définition, classification et principe de la liberté contractuelle', sub: 'Théorie Générale des Contrats', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Les conditions de validité des contrats : Consentement, capacité, objet et cause (ou contenu licite)', sub: 'Théorie Générale des Contrats', l: 'Intermédiaire' as const, d: 35 },
  { t: 'Les vices du consentement : L’Erreur, le Dol et la Violence (Articles du Code Civil)', sub: 'Théorie Générale des Contrats', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Les sanctions de l’invalidité : Nullité absolue versus Nullité relative', sub: 'Théorie Générale des Contrats', l: 'Avancé' as const, d: 30 },
  { t: 'Les effets du contrat : Force obligatoire du contrat (Art. 1134) et effet relatif à l’égard des tiers', sub: 'Théorie Générale des Contrats', l: 'Avancé' as const, d: 30 },
  { t: 'Inexécution contractuelle et remèdes : Exception d’inexécution, exécution forcée, résolution et résiliation', sub: 'Théorie Générale des Contrats', l: 'Avancé' as const, d: 35 },
  { t: 'La responsabilité civile contractuelle : Faute contractuelle, dommage certain et lien de causalité', sub: 'Responsabilité Civile', l: 'Avancé' as const, d: 35 },
  { t: 'La responsabilité civile délictuelle et quasi-délictuelle (Faute personnelle, du fait des choses et d’autrui)', sub: 'Responsabilité Civile', l: 'Avancé' as const, d: 35 },
  { t: 'Droit commercial général : La qualité de commerçant, critères et actes de commerce par nature et par la forme', sub: 'Droit Commercial Général', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Les obligations professionnelles du commerçant (RCCM, tenue de la comptabilité, publicité légale)', sub: 'Droit Commercial Général', l: 'Intermédiaire' as const, d: 25 },
  { t: 'Le fonds de commerce : Éléments corporels, incorporels (clientèle, achalandage, nom commercial, enseigne)', sub: 'Droit Commercial Général', l: 'Intermédiaire' as const, d: 35 },
  { t: 'Les opérations sur fonds de commerce : La vente (cession), l’apport en société et le nantissement', sub: 'Droit Commercial Général', l: 'Avancé' as const, d: 40 },
  { t: 'Le bail commercial à usage professionnel selon l’Acte Uniforme OHADA : Droit au renouvellement', sub: 'Droit Commercial Général', l: 'Avancé' as const, d: 35 },
  { t: 'Droit des sociétés commerciales : Typologie générale des sociétés (Sociétés de personnes vs Sociétés de capitaux)', sub: 'Droit des Sociétés', l: 'Intermédiaire' as const, d: 30 },
  { t: 'La Société à Responsabilité Limitée (SARL & SARL Unipersonnelle) : Statuts, gérance et droits des associés', sub: 'Droit des Sociétés', l: 'Révision BAC' as const, d: 40 },
  { t: 'La Société Anonyme (SA) avec Conseil d’Administration ou Administrateur Général : Gouvernance et organes', sub: 'Droit des Sociétés', l: 'Avancé' as const, d: 40 },
  { t: 'Droit du travail : Conclusion du contrat de travail, période d’essai et distinction CDD / CDI', sub: 'Droit du Travail', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Obligations réciproques de l’employeur et du salarié, pouvoir de direction et pouvoir disciplinaire', sub: 'Droit du Travail', l: 'Intermédiaire' as const, d: 25 },
  { t: 'Modification du contrat de travail : Modification des conditions de travail vs Modification substantielle', sub: 'Droit du Travail', l: 'Avancé' as const, d: 30 },
  { t: 'Rupture du contrat de travail : Démission, rupture conventionnelle et licenciement pour motif personnel', sub: 'Droit du Travail', l: 'Révision BAC' as const, d: 40 },
  { t: 'Le licenciement pour motif économique : Procédure préalable, ordre des licenciements et indemnités', sub: 'Droit du Travail', l: 'Révision BAC' as const, d: 35 },
  { t: 'Les litiges du travail : Le Tribunal du Travail, tentative de conciliation préalable et voies de recours', sub: 'Droit du Travail', l: 'Intermédiaire' as const, d: 30 },
  { t: 'Organisation judiciaire et commerciale : Tribunaux de Commerce, Cours d’Appel et CCJA de l’OHADA', sub: 'Organisation Judiciaire', l: 'Révision BAC' as const, d: 35 },
];

export const DROIT_COURSES: BacG2Course[] = DROIT_DATA_ITEMS.map((item, index) => {
  const num = index + 1;
  const id = `BAC-DRO-${String(num).padStart(3, '0')}`;
  return {
    id,
    title: item.t,
    domain: 'droit',
    subcategory: item.sub,
    level: item.l,
    durationMinutes: item.d,
    description: `Cours exhaustif de Droit pour le BAC G2 : ${item.t}. Notions juridiques fondamentales, textes légaux applicables (Code Civil, Actes Uniformes OHADA, Code du Travail), cas pratiques et méthodologie de résolution juridique.`,
    objectives: [
      `Définir et expliciter les concepts juridiques de : ${item.t}`,
      'Identifier les textes de loi et la jurisprudence applicables',
      'Résoudre un cas pratique juridique selon la méthode du syllogisme (Majeure, Mineure, Conclusion)',
    ],
    introduction: `Le droit organise la vie en société et encadre les relations d'affaires et de travail. Cette leçon détaille « ${item.t} » en adéquation avec les épreuves de Droit du BAC G2.`,
    content: `### 1. Définition et cadre légal
La règle de droit présente quatre caractères fondamentaux : elle est **générale, impersonnelle, obligatoire et assortie d'une sanction étatique**.

### 2. Principes applicables
- Les règles applicables protègent l'ordre public, l'équilibre des contrats et les droits des parties.
- En zone OHADA, les Actes Uniformes priment sur le droit national interne pour les matières harmonisées (Droit commercial, Sociétés, Sûretés, Droit comptable).

### 3. Méthodologie du cas pratique juridique (Syllogisme)
1. **La Majeure** : Rappel précis de la règle de droit applicable (Article de loi, principe général).
2. **La Mineure** : Application concrète aux faits de l'espèce exposés dans l'exercice.
3. **La Conclusion** : Réponse claire et motivée à la question de droit posée.`,
    keyNotions: [item.sub, 'Règle de droit', 'Syllogisme juridique', 'Acte Uniforme OHADA', 'Ordre public'],
    definitions: [
      { term: 'Règle de droit', definition: 'Règle de conduite sociale dont le respect est assuré par l’autorité publique par le biais de la contrainte légale.' },
      { term: 'Syllogisme juridique', definition: 'Raisonnement déductif en trois temps (règle générale, faits particuliers, solution juridique).' },
    ],
    example: {
      title: `Cas pratique juridique - ${item.t.slice(0, 35)}`,
      statement: `Un litige survient entre deux parties concernant l'application de « ${item.t.toLowerCase()} ». Le demandeur sollicite l'application des règles légales de protection et de réparation.`,
      solution: `Majeure : Selon la règle légale en vigueur, la condition doit être strictement satisfaite. Mineure : Les faits démontrent que les critères sont réunis. Conclusion : Le juge prononce la décision conforme aux droits du requérant.`,
    },
    methodology: [
      '1. Lire attentivement l’énoncé et qualifier juridiquement les personnes et les faits.',
      '2. Formuler le problème de droit en termes généraux et abstraits.',
      '3. Rédiger le syllogisme complet (Majeure, Mineure, Conclusion).',
    ],
    exercise: {
      question: `Dans l’analyse juridique de « ${item.t} », quel principe fondamental doit être respecté ?`,
      options: [
        'Le respect scrupuleux de la règle de droit impérative et la méthode du syllogisme juridique',
        'L’appréciation purement subjective des juges sans référence aux textes de loi',
        'L’application rétroactive systématique de toutes les lois nouvelles',
        'L’interdiction totale pour les citoyens de saisir les tribunaux compétents',
      ],
      correctOptionIndex: 0,
      correction: 'Option A : La règle de droit s’impose impérativement et l’analyse juridique repose sur la méthode rigoureuse du syllogisme.',
      explanation: 'En droit, tout raisonnement valide doit énoncer la règle applicable avant de la confronter aux faits pour en déduire la solution.',
    },
    summary: [
      `${item.t} fait partie des fondamentaux incontournables de l’épreuve de Droit au BAC G2.`,
      'Toujours structurer sa réponse selon la méthode du syllogisme juridique.',
      'Distinguer les règles d’ordre public des règles simplement supplétives de volonté.',
    ],
    youtubeId: 'q2K4nI4aV2w',
    videoTitle: `Cours de Droit BAC G2 : ${item.t}`,
    keywords: ['droit', item.sub.toLowerCase(), 'ohada', 'contrat', 'bac g2', 'syllogisme'],
  };
});
