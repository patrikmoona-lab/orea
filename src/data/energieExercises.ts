import { EnergieExercise, WorkoutProgramStructured } from '../types/energie';

export const OREA_ENERGIE_EXERCISES: EnergieExercise[] = [
  // 1. POITRINE (Pectoraux)
  {
    id: 'ex-pompes-classiques',
    name: 'Pompes classiques au sol',
    description: 'Le mouvement fondamental au poids du corps pour développer la force de poussée, la poitrine et les triceps.',
    category: 'poitrine',
    secondaryCategories: ['bras', 'épaules'],
    difficulty: 'intermédiaire',
    equipment: ['aucun'],
    duration: 45,
    sets: 4,
    repetitions: '12 répétitions',
    rest: 60,
    instructions: [
      'Placez vos mains au sol, légèrement plus écartées que la largeur des épaules.',
      'Alignez vos talons, votre bassin et votre nuque en maintenant un gainage actif.',
      'Descendez le torse de manière contrôlée jusqu’à frôler le sol, coudes orientés à 45 degrés.',
      'Repoussez fermement le sol pour revenir en position initiale sans verrouiller brutalement les coudes.',
    ],
    commonMistakes: [
      'Creuser le bas du dos ou laisser pendre le bassin vers le sol.',
      'Écarter les coudes à 90° vers l’extérieur (risque pour les épaules).',
      'Faire des demi-répétitions sans descendre suffisamment.',
    ],
    tips: [
      'Gardez le regard fixé 20 cm devant vos mains pour préserver les cervicales.',
      'Inspirez lors de la descente, soufflez puissamment lors de la remontée.',
    ],
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4', // Classic pushup instruction
    model3D: {
      type: 'pompes',
      animationName: 'PushupCycle',
    },
    variants: ['Pompes sur les genoux (débutant)', 'Pompes déclinées (avancé)', 'Pompes diamant (triceps)'],
    tags: ['poitrine', 'poussée', 'force', 'haut-du-corps'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },
  {
    id: 'ex-pompes-murales',
    name: 'Pompes murales ou inclinées',
    description: 'Variante douce adaptée aux reprises et aux débutants pour activer les pectoraux en réduisant la charge.',
    category: 'poitrine',
    secondaryCategories: ['bras'],
    difficulty: 'faible',
    equipment: ['aucun'],
    duration: 30,
    sets: 3,
    repetitions: '10 répétitions',
    rest: 45,
    instructions: [
      'Tenez-vous debout face à un mur à environ un mètre de distance.',
      'Posez vos paumes à plat à hauteur de poitrine, doigts vers le haut.',
      'Fléchissez les coudes pour rapprocher doucement votre poitrine du mur.',
      'Repoussez le mur de façon fluide et contrôlée.',
    ],
    commonMistakes: [
      'Lever les talons de manière instable.',
      'Avancer la tête plutôt que le torse.',
    ],
    tips: [
      'Idéal pour un échauffement articulaire ou une remise en mouvement sans stress articulaire.',
    ],
    model3D: {
      type: 'pompes',
    },
    variants: ['Pompes sur table stable', 'Pompes sur les genoux'],
    tags: ['débutant', 'doux', 'poitrine', 'reprise'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // 2. JAMBES
  {
    id: 'ex-squats-poids-du-corps',
    name: 'Squats profonds au poids du corps',
    description: 'Le maître des mouvements pour les membres inférieurs, tonifiant les quadriceps, les fessiers et le souffle.',
    category: 'jambes',
    secondaryCategories: ['fessiers', 'mollets'],
    difficulty: 'débutant',
    equipment: ['aucun'],
    duration: 45,
    sets: 4,
    repetitions: '15 répétitions',
    rest: 45,
    instructions: [
      'Placez vos pieds à largeur des épaules, pointes légèrement ouvertes vers l’extérieur.',
      'Engagez vos hanches vers l’arrière comme pour vous asseoir sur une chaise basse.',
      'Descendez jusqu’à ce que vos cuisses soient au moins parallèles au sol.',
      'Poussez fort sur l’ensemble de vos pieds pour revenir debout en contractant les fessiers.',
    ],
    commonMistakes: [
      'Décoller les talons du sol pendant la descente.',
      'Rentrer les genoux vers l’intérieur (valgus).',
      'Arrondir la colonne vertébrale.',
    ],
    tips: [
      'Gardez la poitrine fière et les bras tendus devant vous pour équilibrer le centre de gravité.',
      'Inspirez en descendant, expirez énergiquement en poussant.',
    ],
    videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U', // Bodyweight squat instruction
    model3D: {
      type: 'squat',
      animationName: 'SquatCycle',
    },
    variants: ['Squats tempo lent', 'Squats sautés (intensif)', 'Pistol squat (spartiate)'],
    tags: ['jambes', 'fessiers', 'quadriceps', 'mouvement-fondamental'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },
  {
    id: 'ex-fentes-marchees',
    name: 'Fentes avant alternées',
    description: 'Renforcement unilatéral de haute précision développant l’équilibre, la propulsion et les quadriceps.',
    category: 'jambes',
    secondaryCategories: ['fessiers'],
    difficulty: 'normal',
    equipment: ['aucun'],
    duration: 45,
    sets: 3,
    repetitions: '12 par jambe',
    rest: 45,
    instructions: [
      'Debout, torse droit, faites un grand pas en avant avec la jambe droite.',
      'Fléchissez les deux genoux jusqu’à former des angles droits de 90 degrés.',
      'Le genou arrière descend frôler le sol sans jamais percuter.',
      'Poussez sur le talon avant pour revenir en position initiale et alternez avec la jambe gauche.',
    ],
    commonMistakes: [
      'Avancer le buste de manière déséquilibrée vers l’avant.',
      'Laisser le genou avant dépasser excessivement les orteils.',
    ],
    tips: [
      'Fixez un point à hauteur des yeux pour stabiliser votre équilibre.',
    ],
    model3D: {
      type: 'fentes',
    },
    variants: ['Fentes arrière statiques', 'Fentes sautées (extrême)', 'Fentes bulgares (sur chaise)'],
    tags: ['jambes', 'équilibre', 'quadriceps'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // 3. ABDOS
  {
    id: 'ex-planche-ventrale',
    name: 'Gainage ventral (Planche statique)',
    description: 'Renforcement isométrique de la sangle abdominale profonde, du muscle transverse et de la posture lombaire.',
    category: 'abdos',
    secondaryCategories: ['dos', 'épaules'],
    difficulty: 'débutant',
    equipment: ['tapis'],
    duration: 40,
    sets: 3,
    repetitions: '40 secondes',
    rest: 45,
    instructions: [
      'En appui sur les avant-bras et la pointe des pieds, coudes placés directement sous les épaules.',
      'Verrouillez le bassin en rétroversion légère pour effacer la cambrure lombaire.',
      'Serrez activement les fessiers, les cuisses et aspirez le nombril vers la colonne.',
      'Maintenez la position sans bouger en conservant une respiration fluide.',
    ],
    commonMistakes: [
      'Laisser tomber le bassin vers le sol (douleur lombaire).',
      'Lever les fessiers trop haut en toit de maison.',
      'Bloquer son souffle (apnée).',
    ],
    tips: [
      'Imaginez que vous repoussez le sol avec vos coudes pour bomber le haut du dos.',
      'Respirez par le nez avec calme.',
    ],
    videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c', // Plank form
    model3D: {
      type: 'planche',
      animationName: 'PlankHold',
    },
    variants: ['Planche sur les genoux (faible)', 'Planche commando dynamique (intensif)', 'Planche latérale'],
    tags: ['gainage', 'abdos', 'posture', 'transverse'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },
  {
    id: 'ex-crunchs-controles',
    name: 'Crunchs contrôlés avec contraction haute',
    description: 'Ciblage sélectif du grand droit abdominal avec amplitude sécurisée pour le rachis lombaire.',
    category: 'abdos',
    secondaryCategories: [],
    difficulty: 'normal',
    equipment: ['tapis'],
    duration: 35,
    sets: 3,
    repetitions: '15 répétitions',
    rest: 45,
    instructions: [
      'Allongé sur le dos, genoux fléchis, pieds posés au sol à plat.',
      'Mains légères au niveau des tempes ou croisées sur la poitrine.',
      'Enroulez la partie haute du buste vers les genoux en contractant les abdominaux.',
      'Maintenez 1 seconde en contraction maximale avant de redescendre sans relâcher la tension.',
    ],
    commonMistakes: [
      'Tirer sur la nuque avec les mains.',
      'Décoller le bas du dos du tapis.',
    ],
    tips: [
      'Gardez l’espace d’une pomme entre le menton et le sternum.',
    ],
    model3D: {
      type: 'crunch',
    },
    variants: ['Crunchs bicyclette', 'Relevés de bassin inversés'],
    tags: ['abdos', 'grand-droit', 'sol'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // 4. BRAS
  {
    id: 'ex-dips-triceps-chaise',
    name: 'Dips triceps sur chaise / banc',
    description: 'Exercice roi pour tonifier et muscler l’arrière des bras (triceps) et stabiliser les épaules.',
    category: 'bras',
    secondaryCategories: ['épaules', 'poitrine'],
    difficulty: 'normal',
    equipment: ['chaise'],
    duration: 40,
    sets: 3,
    repetitions: '12 répétitions',
    rest: 45,
    instructions: [
      'Asseyez-vous sur le rebord d’une chaise stable, mains posées à plat à côté des hanches.',
      'Avancez les pieds et faites glisser les fessiers hors de l’assise, bras tendus.',
      'Fléchissez les coudes vers l’arrière jusqu’à 90 degrés en gardant le dos très proche de la chaise.',
      'Pressez avec les paumes pour remonter en tendant les bras.',
    ],
    commonMistakes: [
      'Éloigner le dos de la chaise (crée une contrainte dangereuse sur l’avant de l’épaule).',
      'Ouvrir les coudes vers l’extérieur au lieu de les garder parallèles.',
    ],
    tips: [
      'Pour simplifier : pliez les genoux à 90°. Pour corser : tendez complètement les jambes.',
    ],
    model3D: {
      type: 'dips',
    },
    variants: ['Dips jambes tendues (intensif)', 'Dips entre deux barres (spartiate)'],
    tags: ['bras', 'triceps', 'chaise'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // 5. DOS
  {
    id: 'ex-superman-lombaire',
    name: 'Superman isométrique dorsal',
    description: 'Renforcement complet de la chaîne postérieure, des érecteurs du rachis et de la zone scapulaire.',
    category: 'dos',
    secondaryCategories: ['fessiers'],
    difficulty: 'débutant',
    equipment: ['tapis'],
    duration: 35,
    sets: 3,
    repetitions: '12 répétitions (2s en haut)',
    rest: 45,
    instructions: [
      'Allongez-vous à plat ventre sur le tapis, bras tendus devant vous.',
      'Décollez simultanément vos bras, votre poitrine et vos jambes de quelques centimètres.',
      'Serrez les omoplates l’une vers l’autre et contractez les fessiers.',
      'Maintenez 2 secondes en suspension avant de redescendre avec contrôle.',
    ],
    commonMistakes: [
      'Casser la nuque en regardant vers le ciel (gardez le regard vers le tapis).',
      'Faire des à-coups brusques.',
    ],
    tips: [
      'Le mouvement doit être fluide et respiré. Soufflez en décollant.',
    ],
    model3D: {
      type: 'superman',
    },
    variants: ['Superman croisé alternatif', 'Nageur au sol rapide'],
    tags: ['dos', 'posture', 'lombaires', 'colonne'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // 6. ÉPAULES
  {
    id: 'ex-pike-pushups',
    name: 'Pike push-ups (Pompes en V inversé)',
    description: 'Développement de la force verticale des épaules (deltoïdes) et préparation aux mouvements au-dessus de la tête.',
    category: 'épaules',
    secondaryCategories: ['bras', 'poitrine'],
    difficulty: 'intensif',
    equipment: ['aucun'],
    duration: 40,
    sets: 3,
    repetitions: '8 à 10 répétitions',
    rest: 60,
    instructions: [
      'Mettez-vous en position de V inversé : fessiers hauts vers le ciel, mains et pieds au sol.',
      'Regardez vers vos pieds pour garder les cervicales neutres.',
      'Fléchissez les coudes en amenant le sommet de votre crâne vers le sol devant la ligne de vos mains.',
      'Repoussez le sol avec les épaules pour revenir en V.',
    ],
    commonMistakes: [
      'Laisser le bassin s’affaisser en position de pompe classique.',
      'Coudes trop ouverts vers l’extérieur.',
    ],
    tips: [
      'Plus vos pieds sont proches de vos mains, plus la charge sur les épaules est intense.',
    ],
    tags: ['épaules', 'deltoïdes', 'force-verticale'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // 7. FESSIERS
  {
    id: 'ex-pont-fessier',
    name: 'Pont fessier au sol (Glute Bridge)',
    description: 'Activation sélective des grands fessiers et renforcement du bassin sans impact articulaire.',
    category: 'fessiers',
    secondaryCategories: ['jambes', 'dos'],
    difficulty: 'débutant',
    equipment: ['tapis'],
    duration: 35,
    sets: 3,
    repetitions: '15 répétitions',
    rest: 40,
    instructions: [
      'Allongé sur le dos, pliez les genoux et posez vos pieds à plat écartés largeur des hanches.',
      'Bras le long du corps, paumes au sol pour l’ancrage.',
      'Pressez fortement sur vos talons pour monter le bassin jusqu’à aligner genoux, hanches et épaules.',
      'Marquez une seconde de contraction volontaire au sommet puis redescendez doucement.',
    ],
    commonMistakes: [
      'Cambrer exagérément les lombaires en fin de montée.',
      'Pousser sur la pointe des pieds plutôt que sur les talons.',
    ],
    tips: [
      'Pensez à serrer fermement les fessiers au sommet du mouvement.',
    ],
    variants: ['Pont fessier unipodal (sur une jambe)', 'Pont fessier avec élastique'],
    tags: ['fessiers', 'bassin', 'doux', 'sol'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // 8. MOLLETS
  {
    id: 'ex-elevations-mollets',
    name: 'Élévations des mollets debout',
    description: 'Renforcement ciblé des gastrocnémiens et des soléaires pour stabiliser les chevilles et améliorer l’impulsion.',
    category: 'mollets',
    secondaryCategories: ['jambes'],
    difficulty: 'faible',
    equipment: ['aucun'],
    duration: 35,
    sets: 4,
    repetitions: '20 répétitions',
    rest: 30,
    instructions: [
      'Debout, pieds parallèles espacés de la largeur des hanches, mains posées sur un mur pour l’équilibre.',
      'Montez le plus haut possible sur la pointe des pieds.',
      'Maintenez la position haute pendant 2 secondes complètes.',
      'Redescendez très lentement en contrôlant la phase excentrique.',
    ],
    commonMistakes: [
      'Rebondir vite sans marquer la contraction haute.',
      'Laisser les chevilles partir vers l’extérieur.',
    ],
    tips: [
      'Pour augmenter l’amplitude, posez la pointe des pieds sur le rebord d’une marche.',
    ],
    model3D: {
      type: 'mollets',
    },
    variants: ['Élévations sur une seule jambe (intensif)'],
    tags: ['mollets', 'chevilles', 'équilibre', 'solide'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // 9. AVANT-BRAS
  {
    id: 'ex-serrage-isometrique-poings',
    name: 'Squeeze isométrique & gainage des fléchisseurs',
    description: 'Développement de la force de préhension (grip) et endurance des muscles de l’avant-bras.',
    category: 'avant-bras',
    secondaryCategories: ['bras'],
    difficulty: 'débutant',
    equipment: ['aucun'],
    duration: 30,
    sets: 3,
    repetitions: '30 secondes intensives',
    rest: 30,
    instructions: [
      'Tendez vos bras devant vous à hauteur d’épaules, paumes vers le haut.',
      'Fermez les poings et serrez avec une intensité maximale de 100%.',
      'Maintenez la contraction sans relâcher pendant toute la durée de la série.',
      'Ouvrez et étirez ensuite les doigts pendant les 30 secondes de repos.',
    ],
    commonMistakes: [
      'Hausser les épaules vers les oreilles.',
      'Relâcher la pression au fil des secondes.',
    ],
    tips: [
      'Idéal à la fin d’une séance de haut du corps pour consolider la poigne.',
    ],
    variants: ['Suspension passive à une barre', 'Écrasement d’une balle de tennis'],
    tags: ['avant-bras', 'poigne', 'grip'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // 10. CORPS COMPLET (Full Body)
  {
    id: 'ex-mountain-climbers',
    name: 'Mountain climbers contrôlés',
    description: 'Mouvement complet alliant cardio, endurance des épaules et travail dynamique des abdominaux.',
    category: 'corps-complet',
    secondaryCategories: ['abdos', 'épaules', 'jambes'],
    difficulty: 'intermédiaire',
    equipment: ['tapis'],
    duration: 40,
    sets: 3,
    repetitions: '30 secondes',
    rest: 45,
    instructions: [
      'Commencez en position de planche haute sur les mains.',
      'Ramenez alternativement le genou droit puis le genou gauche vers la poitrine avec dynamisme.',
      'Conservez le bassin stable à la même hauteur tout au long de l’exercice.',
      'Gardez les épaules fixes au-dessus des poignets.',
    ],
    commonMistakes: [
      'Faire monter les fesses vers le haut.',
      'Sautiller excessivement en perdant le gainage.',
    ],
    tips: [
      'Pour un focus cardio : accélérez le rythme. Pour un focus abdos : ralentissez et marquez 1s au genou.',
    ],
    videoUrl: 'https://www.youtube.com/embed/nmwgirgXLYM', // Mountain climbers form
    model3D: {
      type: 'mountain-climbers',
    },
    variants: ['Mountain climbers lents (débutant)', 'Cross-body climbers (obliques)'],
    tags: ['cardio', 'abdos', 'dynamique', 'full-body'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },
  {
    id: 'ex-jumping-jacks',
    name: 'Jumping Jacks dynamiques',
    description: 'Activation cardio-vasculaire globale, oxygénation et coordination motrice de l’ensemble du corps.',
    category: 'corps-complet',
    secondaryCategories: ['mollets', 'épaules'],
    difficulty: 'faible',
    equipment: ['aucun'],
    duration: 35,
    sets: 3,
    repetitions: '30 secondes',
    rest: 30,
    instructions: [
      'Debout, pieds joints et bras le long du corps.',
      'Sautez en écartant les jambes et en levant simultanément les bras au-dessus de la tête.',
      'Revenez en position initiale dans un rebond souple sur la pointe des pieds.',
      'Maintenez une cadence constante et respirez avec aisance.',
    ],
    commonMistakes: [
      'Atterrir lourdement sur les talons (choc articulaire).',
      'Bloquer les genoux raides.',
    ],
    tips: [
      'Atterrissez toujours sur l’avant du pied avec une légère flexion des genoux pour amortir.',
    ],
    model3D: {
      type: 'jumping-jacks',
    },
    variants: ['Step Jacks sans saut (faible impact)', 'Star jumps (spartiate)'],
    tags: ['cardio', 'échauffement', 'vitalité'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },
  {
    id: 'ex-burpees-spartiates',
    name: 'Burpees OREA avec pompe complète',
    description: 'Le summum de l’intensité : enchaînement squat, pompe stricte et extension verticale explosive.',
    category: 'corps-complet',
    secondaryCategories: ['poitrine', 'jambes', 'abdos'],
    difficulty: 'spartiate',
    equipment: ['aucun'],
    duration: 50,
    sets: 4,
    repetitions: '15 répétitions',
    rest: 60,
    instructions: [
      'Depuis la position debout, descendez en squat profond et posez les mains au sol.',
      'Jetez les pieds en arrière en planche et réalisez immédiatement une pompe complète au sol.',
      'Repoussez, ramenez les pieds sous les hanches et sautez verticalement avec les bras vers le ciel.',
      'Enchaînez sans temps d’arrêt.',
    ],
    commonMistakes: [
      'Affaissement des lombaires lors du jet de jambes.',
      'Pompe incomplète avec le bassin qui touche le sol avant le torse.',
    ],
    tips: [
      'Gestion de l’effort essentielle : ne partez pas en sprint sur les 3 premières répétitions.',
    ],
    variants: ['Burpees sans pompe (intermédiaire)', 'Burpees sans saut (normal)'],
    tags: ['spartiate', 'extrême', 'cardio', 'puissance'],
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  }
];

// Structured training programs
export const OREA_ENERGIE_PROGRAMS: WorkoutProgramStructured[] = [
  {
    id: 'prog-vitalite-starter',
    title: 'Programme Débutant : Réveil & Vitalité',
    description: 'Une reprise en douceur adaptée pour construire une routine solide, réveiller les muscles et regagner en énergie.',
    level: 'débutant',
    durationDays: 7,
    frequencyPerWeek: 3,
    targetCategories: ['corps-complet', 'jambes', 'abdos'],
    exercises: [
      OREA_ENERGIE_EXERCISES[1], // Pompes murales
      OREA_ENERGIE_EXERCISES[2], // Squats
      OREA_ENERGIE_EXERCISES[4], // Planche
      OREA_ENERGIE_EXERCISES[7], // Superman
      OREA_ENERGIE_EXERCISES[11], // Jumping jacks
    ],
  },
  {
    id: 'prog-renforcement-tonus',
    title: 'Programme 30 Jours : Force & Tonus Musculaire',
    description: 'Cycle complet de 4 semaines structuré pour densifier la masse musculaire, gainer la taille et fortifier le haut du corps.',
    level: 'intermédiaire',
    durationDays: 30,
    frequencyPerWeek: 4,
    targetCategories: ['poitrine', 'bras', 'jambes', 'abdos'],
    exercises: [
      OREA_ENERGIE_EXERCISES[0], // Pompes classiques
      OREA_ENERGIE_EXERCISES[3], // Fentes
      OREA_ENERGIE_EXERCISES[6], // Dips chaise
      OREA_ENERGIE_EXERCISES[5], // Crunchs
      OREA_ENERGIE_EXERCISES[10], // Mountain climbers
    ],
  },
  {
    id: 'prog-spartiate-athlete',
    title: 'Programme Spartiate : 90 Jours Athlète Absolu',
    description: 'Le défi ultime d’endurance musculaire, de puissance et de discipline pour les pratiquants confirmés.',
    level: 'spartiate',
    durationDays: 90,
    frequencyPerWeek: 5,
    targetCategories: ['corps-complet', 'épaules', 'poitrine', 'abdos'],
    exercises: [
      OREA_ENERGIE_EXERCISES[12], // Burpees spartiates
      OREA_ENERGIE_EXERCISES[8], // Pike pushups
      OREA_ENERGIE_EXERCISES[0], // Pompes classiques
      OREA_ENERGIE_EXERCISES[4], // Planche ventrale
      OREA_ENERGIE_EXERCISES[10], // Mountain climbers
    ],
  },
];
