import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Activity,
  ShieldCheck,
  Apple,
  Moon,
  Footprints,
  Brain,
  HeartHandshake,
  Baby,
  UtensilsCrossed,
  Wind,
  HeartPulse,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Filter,
  CheckCircle2,
  PhoneCall,
  Clock,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { OreaButton } from './common/OreaButton';

export interface EncyclopediaTopic {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  definition: string;
  symptoms: string[];
  riskFactors: string[];
  preventionTips: string[];
  whenToConsult: string[];
  emergencySigns?: string[];
  usefulInfo: string;
  badge?: string;
}

export const ENCYCLOPEDIA_TOPICS: EncyclopediaTopic[] = [
  // 1. CARDIOVASCULAIRE
  {
    id: 'hypertension',
    title: 'Hypertension Artérielle (HTA)',
    category: 'Santé cardiovasculaire',
    categoryId: 'cardiovasculaire',
    badge: 'Fréquent',
    definition:
      'Élévation persistante de la pression artérielle au-dessus de 140/90 mmHg. Souvent asymptomatique (« le tueur silencieux »), elle nécessite un dépistage régulier.',
    symptoms: [
      'Souvent aucun symptôme au début',
      'Maux de tête matinaux au sommet ou à l’arrière du crâne',
      'Vertiges ou sensation de mouches volantes devant les yeux',
      'Bourdonnements d’oreilles (acouphènes)',
      'Palpitations ou essoufflement à l’effort',
    ],
    riskFactors: [
      'Excès de consommation de sel',
      'Sédentarité et surpoids abdominal',
      'Stress chronique et manque de sommeil',
      'Consommation excessive d’alcool et tabagisme',
      'Antécédents familiaux d’HTA',
    ],
    preventionTips: [
      'Limiter l’apport en sel à moins de 5g par jour',
      'Pratiquer 30 minutes de marche active quotidienne',
      'Consommer des aliments riches en potassium (banane, fonio, avocat)',
      'Mesurer sa tension artérielle au moins 2 fois par an',
    ],
    whenToConsult: [
      'Tension mesurée supérieure à 140/90 mmHg à plusieurs reprises',
      'Apparition de maux de tête violents inhabituels',
      'Troubles visuels subits ou engourdissement',
    ],
    emergencySigns: [
      'Douleur dans la poitrine irradiant vers le bras gauche ou la mâchoire',
      'Difficulté subite à parler ou faiblesse d’un côté du corps',
      'Essoufflement aigu avec tension > 180/110 mmHg',
    ],
    usefulInfo:
      'Le repos de 5 minutes assis avant toute prise de tension est indispensable pour éviter les faux positifs du « syndrome de la blouse blanche ».',
  },

  // 2. PALUDISME & INFECTIONS
  {
    id: 'paludisme',
    title: 'Paludisme (Malaria)',
    category: 'Maladies courantes & Tropicales',
    categoryId: 'maladies_courantes',
    badge: 'Urgence potentielle',
    definition:
      'Infection parasitaire transmise par la piqûre de moustiques femelles Anophèles infectés. Une prise en charge rapide par Test de Diagnostic Rapide (TDR) évite les formes graves.',
    symptoms: [
      'Fièvre élevée (souvent brutale ou cyclique)',
      'Frissons intenses suivis de sueurs abondantes',
      'Maux de tête intenses et courbatures généralisées',
      'Fatigue extrême, nausées ou vomissements',
      'Perte d’appétit et douleurs abdominales',
    ],
    riskFactors: [
      'Présence d’eaux stagnantes à proximité des habitations',
      'Non-utilisation de moustiquaires imprégnées',
      'Sorties nocturnes sans protection anti-moustique',
      'Grossesse et petite enfance (populations les plus vulnérables)',
    ],
    preventionTips: [
      'Dormir impérativement sous moustiquaire imprégnée d’insecticide (MILD)',
      'Éliminer tous les récipients d’eau stagnante autour du domicile',
      'Porter des vêtements couvrants dès le coucher du soleil',
      'Utiliser des répulsifs cutanés adaptés',
    ],
    whenToConsult: [
      'Toute fièvre inexpliquée en zone d’endémie doit motiver un test TDR sous 24h',
      'Frissons et courbatures persistantes plus de 12 heures',
    ],
    emergencySigns: [
      'Convulsions, confusion mentale ou perte de conscience (paludisme cérébral)',
      'Vomissements incoercibles empêchant toute prise de comprimés',
      'Urines très sombres ou coloration jaune des yeux (ictère)',
    ],
    usefulInfo:
      'Ne commencez jamais de traitement antipaludéen sans confirmation par un test rapide (TDR) ou une goutte épaisse en laboratoire.',
  },

  // 3. DIABÈTE
  {
    id: 'diabete',
    title: 'Diabète de Type 2',
    category: 'Maladies courantes & Métabolisme',
    categoryId: 'maladies_courantes',
    badge: 'Prévention clé',
    definition:
      'Trouble métabolique caractérisé par un excès chronique de sucre dans le sang (glycémie à jeun ≥ 1,26 g/L), lié à une résistance progressive à l’insuline.',
    symptoms: [
      'Soif excessive et constante (polydipsie)',
      'Besoin fréquent d’uriner, y compris la nuit (polyurie)',
      'Fatigue inexpliquée et baisse d’énergie',
      'Cicatrisation lente des petites plaies',
      'Infections cutanées ou mycoses récurrentes',
    ],
    riskFactors: [
      'Alimentation riche en sucres raffinés, sodas et farines blanches',
      'Surpoids, notamment obésité abdominale',
      'Sédentarité et manque d’activité musculaire',
      'Antécédents familiaux de diabète',
    ],
    preventionTips: [
      'Privilégier les céréales complètes locales (fonio, mil, sorgho) aux féculents raffinés',
      'Remplacer les boissons sucrées par de l’eau ou des infusions locales sans sucre (Kinkeliba, Hibiscus)',
      'Marcher 30 minutes après le repas principal',
      'Faire un dosage de la glycémie à jeun chaque année après 35 ans',
    ],
    whenToConsult: [
      'Soif intense inhabituelle durant plusieurs semaines',
      'Plaie au pied qui ne guérit pas au bout de 7 jours',
      'Baisse inexpliquée et rapide du poids',
    ],
    emergencySigns: [
      'Respiration rapide avec odeur de pomme reinette (acidocétose)',
      'Confusion mentale, somnolence excessive ou déshydratation aiguë',
    ],
    usefulInfo:
      'L’activité physique augmente directement la sensibilité des muscles au glucose, contribuant à faire baisser la glycémie naturellement.',
  },

  // 4. SANTÉ RESPIRATOIRE
  {
    id: 'asthme',
    title: 'Asthme & Allergies Respiratoires',
    category: 'Santé respiratoire',
    categoryId: 'respiratoire',
    definition:
      'Inflammation chronique des bronches entraînant des épisodes de sifflements, d’essoufflement et d’oppression thoracique, souvent déclenchés par des allergènes.',
    symptoms: [
      'Sifflement audible à l’expiration',
      'Toux sèche nocturne ou au réveil',
      'Sensation d’étouffement ou de thorax comprimé',
      'Essoufflement rapide lors d’un effort modéré',
    ],
    riskFactors: [
      'Exposition à la poussière, aux acariens, aux moisissures',
      'Fumée de tabac ou fumées de cuisson au feu de bois',
      'Terrain allergique familial (rhinite, eczéma)',
      'Variations climatiques brutales et vents de poussière (harmattan)',
    ],
    preventionTips: [
      'Aérer les pièces quotidiennement et éviter les tapis accumulant la poussière',
      'Nettoyer les matelas et literies à l’eau chaude régulièrement',
      'Éviter l’exposition aux fumées de charbon et aérosols chimiques',
      'Garder son traitement de crise (bronchodilatateur) toujours à portée de main',
    ],
    whenToConsult: [
      'Crises nécessitant l’inhalateur plus de 2 fois par semaine',
      'Réveils nocturnes réguliers provoqués par la toux ou la gêne respiratoire',
    ],
    emergencySigns: [
      'Difficulté extrême à parler sans reprendre son souffle',
      'Lèvres ou ongles bleuâtres (cyanose)',
      'Aucune amélioration 10 minutes après 2 bouffées de spray de secours',
    ],
    usefulInfo:
      'L’asthme se contrôle très bien avec un traitement de fond adapté. Ne jamais interrompre un spray protecteur prescrit sans avis médical.',
  },

  // 5. SANTÉ DIGESTIVE
  {
    id: 'gastrite',
    title: 'Gastrite & Reflux Gastro-Œsophagien (RGO)',
    category: 'Santé digestive',
    categoryId: 'digestive',
    definition:
      'Inflammation de la muqueuse de l’estomac ou remontée d’acide gastrique dans l’œsophage, provoquant des brûlures et des aigreurs après les repas.',
    symptoms: [
      'Brûlure derrière le sternum remontant vers la gorge (pyrosis)',
      'Douleurs ou crampes dans le creux de l’estomac',
      'Régurgitations acides ou goût amer dans la bouche',
      'Ballonnements et sensation de digestion très lente',
    ],
    riskFactors: [
      'Repas trop copieux, gras ou très épicés',
      'Consommation excessive de café, alcool ou boissons gazeuses',
      'Stress prolongé et repas pris à la hâte',
      'Prise fréquente d’anti-inflammatoires (ibuprofène, aspirine) à jeun',
    ],
    preventionTips: [
      'Manger lentement et mastiquer soigneusement chaque bouchée',
      'Dîner au moins 2 à 3 heures avant d’aller se coucher',
      'Surélever légèrement la tête de lit de quelques centimètres',
      'Limiter les aliments frits et les sauces trop pimentées',
    ],
    whenToConsult: [
      'Brûlures quotidiennes persistant plus de 2 semaines',
      'Difficulté ou douleur à la déglutition (avaler des aliments solides)',
      'Perte de poids involontaire',
    ],
    emergencySigns: [
      'Vomissements contenant du sang ou d’aspect marc de café',
      'Selles noires comme du goudron (méléna)',
      'Douleur gastrique fulgurante en coup de poignard',
    ],
    usefulInfo:
      'Les anti-inflammatoires (AINS) doivent toujours être pris au milieu d’un repas consistant pour protéger l’estomac.',
  },

  // 6. SANTÉ MENTALE
  {
    id: 'burnout-stress',
    title: 'Surmenage, Anxiété & Équilibre Émotionnel',
    category: 'Santé mentale',
    categoryId: 'mentale',
    definition:
      'État d’épuisement physique, émotionnel et mental causé par un stress chronique prolongé non régulé, tant dans la vie professionnelle qu’étudiante ou familiale.',
    symptoms: [
      'Fatigue persistante non résolue par le sommeil',
      'Troubles de la concentration et oublis fréquents',
      'Irritabilité, perte d’enthousiasme et sentiment de submersion',
      'Tensions musculaires (nuque, mâchoires serrées)',
      'Insomnies d’endormissement ou réveils nocturnes à 3h du matin',
    ],
    riskFactors: [
      'Charge de travail continue sans temps de déconnexion',
      'Isolement social et absence d’espace de parole',
      'Hyper-connexion aux écrans tard le soir',
      'Perfectionnisme excessif et difficulté à poser des limites',
    ],
    preventionTips: [
      'Instaurer une pause réelle de 15 minutes sans écran à mi-journée',
      'Pratiquer la cohérence cardiaque (respiration 5s inspire / 5s expire)',
      'Maintenir des liens sociaux bienveillants et des moments de partage',
      'Fixer une heure limite pour éteindre le téléphone le soir',
    ],
    whenToConsult: [
      'Sentiment de détresse persistant au-delà de 3 semaines',
      'Incapacité à accomplir les gestes essentiels du quotidien',
      'Perte complète de motivation et d’appétit',
    ],
    emergencySigns: [
      'Idées noires, pensées d’auto-agression ou crises de panique incontrôlables',
    ],
    usefulInfo:
      'La santé mentale fait partie intégrante de la santé globale. Parler à un médecin ou un psychologue est une démarche de courage et de protection.',
  },

  // 7. PREMIERS SECOURS
  {
    id: 'premiers-secours-brulure',
    title: 'Premiers Secours : Brûlures & Traumatismes',
    category: 'Premiers secours',
    categoryId: 'premiers_secours',
    badge: 'Gestes vitaux',
    definition:
      'Actions immédiates et réflexes à adopter face à un accident domestique pour limiter les séquelles avant l’intervention des secours qualifiés.',
    symptoms: [
      'Rougeur vive, gonflement et douleur aiguë (1er degré)',
      'Cloques remplies de liquide clair (2e degré)',
      'Peau blanche cireuse ou carbonisée indolore (3e degré - grave)',
    ],
    riskFactors: [
      'Manipulation d’eau bouillante, d’huile chaude ou de feu sans protection',
      'Produits chimiques ménagers mal étiquetés',
    ],
    preventionTips: [
      'Règle des 3x15 : Refroidir à l’eau courante tiède (15°C) pendant 15 minutes à 15 cm du robinet',
      'Ne JAMAIS percer les cloques (risque d’infection majeure)',
      'Ne JAMAIS appliquer de dentifrice, beurre, huile ou farine sur une brûlure',
      'Couvrir d’un linge propre humide ou d’un film plastique non serré',
    ],
    whenToConsult: [
      'Brûlure de surface supérieure à la paume de la main de la victime',
      'Brûlure localisée sur le visage, les mains, les articulations ou les organes génitaux',
      'Brûlure chez un nourrisson ou une personne âgée',
    ],
    emergencySigns: [
      'Brûlure par flamme avec inhalation de fumées toxiques',
      'Brûlure électrique (risque d’arrêt cardiaque différé - appel SAMU obligatoire)',
    ],
    usefulInfo:
      'En cas de brûlure chimique, rincez immédiatement à grande eau pendant au moins 20 minutes sans frotter.',
  },
];

export const ENCYCLOPEDIA_CATEGORIES = [
  { id: 'all', name: 'Tous les thèmes', icon: BookOpen },
  { id: 'cardiovasculaire', name: 'Cardiovasculaire', icon: HeartPulse },
  { id: 'maladies_courantes', name: 'Maladies courantes', icon: Activity },
  { id: 'prevention', name: 'Prévention & Hygiène', icon: ShieldCheck },
  { id: 'nutrition', name: 'Nutrition & Métabolisme', icon: Apple },
  { id: 'respiratoire', name: 'Santé respiratoire', icon: Wind },
  { id: 'digestive', name: 'Santé digestive', icon: UtensilsCrossed },
  { id: 'mentale', name: 'Santé mentale & Sommeil', icon: Brain },
  { id: 'femme', name: 'Santé de la femme', icon: HeartHandshake },
  { id: 'enfant', name: 'Santé de l’enfant', icon: Baby },
  { id: 'premiers_secours', name: 'Premiers secours', icon: Sparkles },
];

interface OreaEncyclopediaViewProps {
  onNavigateToUrgence?: () => void;
  onNavigateToAssistant?: () => void;
}

export const OreaEncyclopediaView: React.FC<OreaEncyclopediaViewProps> = ({
  onNavigateToUrgence,
  onNavigateToAssistant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState<EncyclopediaTopic | null>(null);

  const filteredTopics = useMemo(() => {
    return ENCYCLOPEDIA_TOPICS.filter((topic) => {
      const matchCat = selectedCategory === 'all' || topic.categoryId === selectedCategory;
      const matchQuery =
        searchQuery.trim() === '' ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Title & Badge */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056d6] text-xs font-black uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Encyclopédie Médicale & Préventive OREA</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0B2F5B] tracking-tight">
            Comprendre pour mieux agir
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Fiches médicales claires, vérifiées et sans publicité. Informez-vous sereinement sur les symptômes, la prévention active et les bons réflexes de santé.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une maladie, un symptôme (ex: fièvre, tension, brûlure, toux...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0056d6] focus:bg-white transition-all"
            />
          </div>

          {/* Categories Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {ENCYCLOPEDIA_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B2F5B] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-[#0056d6] uppercase tracking-wider">
                    {topic.category}
                  </span>
                  {topic.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                      {topic.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0056d6] transition-colors leading-snug">
                  {topic.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {topic.definition}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0056d6]">
                <span>Consulter la fiche complète</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">Aucune fiche trouvée</h4>
            <p className="text-xs text-slate-500 mt-1">
              Essayez d'autres mots-clés ou sélectionnez une autre catégorie.
            </p>
          </div>
        )}

        {/* Medical Ethical Disclaimer Banner */}
        <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-[#0056d6] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-[#0B2F5B]">Engagement Déontologique OREA : </span>
            Toutes les informations diffusées dans cette encyclopédie sont élaborées à visée purement éducative et préventive. Elles ne constituent en aucun cas une consultation médicale personnalisée ni une prescription. En cas de doute ou d'aggravation, contactez immédiatement un médecin.
          </div>
        </div>

      </div>

      {/* TOPIC DETAIL MODAL / DRAWER */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#0B2F5B] text-white p-5 sm:p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#7de3f8] uppercase tracking-wider">
                  {selectedTopic.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                  {selectedTopic.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedTopic(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-slate-800 text-sm">
              
              {/* Definition */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Définition & Contexte
                </h4>
                <p className="text-slate-700 leading-relaxed">{selectedTopic.definition}</p>
              </div>

              {/* Symptoms */}
              <div>
                <h4 className="text-xs font-bold text-[#0B2F5B] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-600" />
                  <span>Symptômes & Signes observables</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTopic.symptoms.map((sym, i) => (
                    <li key={i} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Factors */}
              <div>
                <h4 className="text-xs font-bold text-[#0B2F5B] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Facteurs de risque & Déclencheurs</span>
                </h4>
                <ul className="space-y-1.5">
                  {selectedTopic.riskFactors.map((rf, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{rf}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Prévention active & Bons réflexes</span>
                </h4>
                <ul className="space-y-1.5">
                  {selectedTopic.preventionTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-emerald-950 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* When to consult */}
              <div>
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Quand consulter un médecin ?</span>
                </h4>
                <ul className="space-y-1.5">
                  {selectedTopic.whenToConsult.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="text-blue-600 font-bold">→</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emergency Alert if present */}
              {selectedTopic.emergencySigns && selectedTopic.emergencySigns.length > 0 && (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-200">
                  <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Signaux d'alerte vitale (Urgence immédiate)</span>
                  </h4>
                  <ul className="space-y-1">
                    {selectedTopic.emergencySigns.map((es, i) => (
                      <li key={i} className="text-xs text-red-900 font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                        <span>{es}</span>
                      </li>
                    ))}
                  </ul>
                  {onNavigateToUrgence && (
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          setSelectedTopic(null);
                          onNavigateToUrgence();
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Accéder aux numéros d'urgence 24/7</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Useful Info */}
              <div className="text-xs text-slate-500 italic border-t border-slate-100 pt-3">
                <span className="font-semibold text-slate-700">Le conseil OREA : </span>
                {selectedTopic.usefulInfo}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Source OREA Santé & Prévention</span>
              <button
                onClick={() => setSelectedTopic(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Fermer la fiche
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OreaEncyclopediaView;
