import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Compass,
  HeartPulse,
  Activity,
  Apple,
  Brain,
  GraduationCap,
  Target,
  Sun,
} from 'lucide-react';
import { NavSection } from '../types';
import { OREALogo } from './OREALogo';
import { OreaButton, OreaButtonVariant } from './common/OreaButton';

// Photographic slide assets
import slideWelcomeImg from '../assets/images/orea_slide_welcome_1789129952301.jpg';
import slideSanteImg from '../assets/images/orea_slide_sante_1789129967890.jpg';
import slideSportImg from '../assets/images/orea_slide_sport_1789129986153.jpg';
import slideNutritionImg from '../assets/images/orea_slide_nutrition_1789130002996.jpg';
import slideEspritImg from '../assets/images/orea_slide_esprit_1789130023734.jpg';
import slideOrientationImg from '../assets/images/orea_slide_orientation_1789130044320.jpg';
import slideObjectifsImg from '../assets/images/orea_slide_objectifs_1789130058738.jpg';
import slideLifestyleImg from '../assets/images/orea_slide_lifestyle_1789130075863.jpg';

export interface OreaSlide {
  id: string | number;
  category: string;
  categorySub?: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  description: string;
  shortDescription?: string;
  ctaLabel: string;
  targetSection: NavSection;
  actionType: 'navigate' | 'onboarding' | 'prevention';
  image: string;
  alt: string;
  accentColor: string;
  badgeClass: string;
}

export interface HeroProps {
  slides?: OreaSlide[];
  onNavigate?: (section: NavSection) => void;
  onExploreHealth?: () => void;
  onDiscoverPrevention?: () => void;
  autoplayDurationMs?: number;
}

// 8 Universes OREA Slides
export const DEFAULT_OREA_SLIDES: OreaSlide[] = [
  // 1. BIENVENUE DANS OREA
  {
    id: 'welcome',
    category: 'Écosystème Global',
    categorySub: 'Mieux comprendre. Mieux vivre.',
    icon: Compass,
    title: 'OREA',
    subtitle: 'Mieux comprendre. Mieux vivre. Mieux évoluer.',
    description:
      'Une plateforme humaine, intelligente et évolutive qui vous accompagne dans toutes les dimensions de votre vie : santé, forme, esprit, études et projets.',
    shortDescription:
      'Une plateforme humaine et accessible pour votre santé, forme et esprit.',
    ctaLabel: 'Découvrir l’écosystème',
    targetSection: 'sante',
    actionType: 'navigate',
    image: slideWelcomeImg,
    alt: 'Écosystème OREA',
    accentColor: '#00A6C7',
    badgeClass: 'bg-[#00A6C7]/20 border-[#00A6C7]/50 text-[#7de3f8]',
  },

  // 2. SANTÉ ET PRÉVENTION
  {
    id: 'sante',
    category: 'Santé & Prévention',
    categorySub: 'Prévention proactive',
    icon: HeartPulse,
    title: 'Votre santé, mieux comprise',
    subtitle: 'Informez-vous et suivez votre santé sereinement',
    description:
      'Informez-vous en toute confiance, suivez votre bien-être au quotidien et adoptez de meilleures habitudes avec des conseils clairs, sécurisés et humains.',
    shortDescription:
      'Informez-vous, suivez votre santé et adoptez de meilleures habitudes au quotidien.',
    ctaLabel: 'Explorer l’espace santé',
    targetSection: 'sante',
    actionType: 'navigate',
    image: slideSanteImg,
    alt: 'Santé et prévention OREA',
    accentColor: '#0077B6',
    badgeClass: 'bg-[#0077B6]/20 border-[#0077B6]/50 text-[#93c5fd]',
  },

  // 3. SPORT ET FITNESS
  {
    id: 'sport',
    category: 'Sport & Fitness',
    categorySub: 'Vitalité & Mouvement',
    icon: Activity,
    title: 'Bougez. Progressez. Évoluez.',
    subtitle: 'L’énergie au service de votre épanouissement',
    description:
      'Développez votre forme physique avec des séances adaptées à vos objectifs : renforcement, cardio, mobilité et récupération progressive.',
    shortDescription:
      'Développez votre forme physique avec des programmes adaptés au poids du corps.',
    ctaLabel: 'Lancer un entraînement',
    targetSection: 'sport',
    actionType: 'navigate',
    image: slideSportImg,
    alt: 'Sport et workout OREA',
    accentColor: '#63C96B',
    badgeClass: 'bg-[#63C96B]/20 border-[#63C96B]/50 text-[#86efac]',
  },

  // 4. NUTRITION ET BIEN-ÊTRE
  {
    id: 'nutrition',
    category: 'Nutrition & Équilibre',
    categorySub: 'Alimentation vivante',
    icon: Apple,
    title: 'Prenez soin de votre corps',
    subtitle: 'Nourrir sainement son énergie quotidienne',
    description:
      'Découvrez de meilleures habitudes pour votre alimentation et votre bien-être : repas colorés, hydratation optimale et énergie durable sans frustration.',
    shortDescription:
      'Découvrez de meilleures habitudes pour votre alimentation et votre bien-être.',
    ctaLabel: 'Découvrir la nutrition',
    targetSection: 'nutrition',
    actionType: 'navigate',
    image: slideNutritionImg,
    alt: 'Nutrition et terroir OREA',
    accentColor: '#14B8A6',
    badgeClass: 'bg-[#14B8A6]/20 border-[#14B8A6]/50 text-[#5eead4]',
  },

  // 5. ESPRIT ET APPRENTISSAGE
  {
    id: 'esprit',
    category: 'Esprit & Savoirs',
    categorySub: 'Capacités cognitives',
    icon: Brain,
    title: 'Développez votre esprit',
    subtitle: 'Connaissances, concentration et mémoire active',
    description:
      'Améliorez vos facultés cognitives, votre mémoire de travail, votre concentration profonde et vos compétences pour exceller au quotidien.',
    shortDescription:
      'Améliorez vos connaissances, votre concentration et vos facultés.',
    ctaLabel: 'Stimuler mon esprit',
    targetSection: 'education',
    actionType: 'navigate',
    image: slideEspritImg,
    alt: 'Esprit et savoirs OREA',
    accentColor: '#00A6C7',
    badgeClass: 'bg-[#00A6C7]/20 border-[#00A6C7]/50 text-[#67e8f9]',
  },

  // 6. ÉTUDES ET ORIENTATION
  {
    id: 'orientation',
    category: 'Études & BAC G2',
    categorySub: 'Filières d’Avenir',
    icon: GraduationCap,
    title: 'Construisez votre avenir',
    subtitle: 'Orientation scolaire, BAC G2 et métiers porteurs',
    description:
      'Découvrez des parcours scolaires et universitaires (BAC G2, gestion, compta), développez des compétences recherchées et préparez votre avenir professionnel.',
    shortDescription:
      'Fiches de révision BAC G2, gestion, compta et méthodologie.',
    ctaLabel: 'Espace BAC G2',
    targetSection: 'education',
    actionType: 'navigate',
    image: slideOrientationImg,
    alt: 'Études et BAC G2 OREA',
    accentColor: '#F4B400',
    badgeClass: 'bg-[#F4B400]/20 border-[#F4B400]/50 text-[#fde047]',
  },

  // 7. OBJECTIFS ET ÉVOLUTION
  {
    id: 'objectifs',
    category: 'Mon Cycle',
    categorySub: 'Physiologie & Rythme',
    icon: Target,
    title: 'Suivez votre cycle féminin',
    subtitle: 'Comprendre son corps avec bienveillance',
    description:
      'Un outil intime et respectueux pour suivre vos cycles, anticiper vos règles et vos périodes clés, et écouter vos ressentis au quotidien.',
    shortDescription:
      'Calendrier menstruel prédictif et suivi des symptômes intimes.',
    ctaLabel: 'Consulter Mon Cycle',
    targetSection: 'cycle',
    actionType: 'navigate',
    image: slideObjectifsImg,
    alt: 'Suivi de cycle féminin OREA',
    accentColor: '#EC4899',
    badgeClass: 'bg-pink-500/20 border-pink-500/50 text-pink-300',
  },

  // 8. UNE MEILLEURE VIE
  {
    id: 'lifestyle',
    category: 'Une Meilleure Vie',
    categorySub: 'Harmonie globale',
    icon: Sun,
    title: 'L’équilibre au quotidien',
    subtitle: 'L’harmonie entre corps, esprit et bien-être',
    description:
      'Santé, forme physique, sérénité mentale, éducation et accomplissement personnel réunis dans OREA pour vous guider au quotidien.',
    shortDescription:
      'Santé, forme, esprit et évolution personnelle réunis dans OREA.',
    ctaLabel: 'Explorer les fonctionnalités OREA',
    targetSection: 'mon_orea',
    actionType: 'navigate',
    image: slideLifestyleImg,
    alt: 'Une meilleure vie avec OREA',
    accentColor: '#F4B400',
    badgeClass: 'bg-[#F4B400]/20 border-[#F4B400]/50 text-[#fde047]',
  },
];

export const Hero: React.FC<HeroProps> = ({
  slides = DEFAULT_OREA_SLIDES,
  onNavigate,
  onExploreHealth,
  onDiscoverPrevention,
  autoplayDurationMs = 5000,
}) => {
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_OREA_SLIDES;
  const totalSlides = activeSlides.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Safe slide lookup
  const activeSlide = activeSlides[currentIndex % totalSlides] || activeSlides[0];

  // Infinite Circular Navigation
  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Handle CTA Action click (pure navigation, no login redirect)
  const handleActionClick = (slide: OreaSlide) => {
    if (slide.actionType === 'prevention') {
      if (onDiscoverPrevention) {
        onDiscoverPrevention();
      } else if (onNavigate) {
        onNavigate('sante');
      }
      return;
    }

    if (onNavigate) {
      onNavigate(slide.targetSection);
    } else if (slide.targetSection === 'sante' && onExploreHealth) {
      onExploreHealth();
    }
  };

  // Continuous infinite auto-play loop (restarts from 0 when reaching the end)
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      goToNextSlide();
    }, autoplayDurationMs);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides, autoplayDurationMs, goToNextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide]);

  // Touch Swipe for Mobile & Tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Detect horizontal swipe with minimum threshold
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const IconComponent = activeSlide.icon;

  return (
    <section
      id="orea-hero-editorial"
      className="relative w-full pt-1.5 sm:pt-3 pb-3 sm:pb-5 bg-transparent select-none overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Diaporama immersif des univers OREA"
    >
      <div className="max-w-[1560px] mx-auto px-3 sm:px-5 lg:px-8">
        {/* =========================================================================
            RESPONSIVE HERO CONTAINER:
            - Mobile:  clamp(300px, 48vh, 380px)
            - Tablet:  clamp(340px, 46vh, 440px)
            - Desktop: clamp(380px, 50vh, 520px)
            - Zero bottom progress bar / Zero pagination dots
        ========================================================================= */}
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-[#cbe1f5] bg-[#07111F] transition-all duration-300
                     h-[clamp(310px,50vh,390px)] min-h-[310px]
                     sm:h-[clamp(340px,48vh,430px)] sm:min-h-[340px]
                     md:h-[clamp(370px,48vh,460px)] md:min-h-[370px]
                     lg:h-[clamp(400px,52vh,520px)] lg:min-h-[400px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background Photographic Image with Smooth Cross-fade */}
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeSlide.id}
              className="absolute inset-0 w-full h-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <img
                src={activeSlide.image}
                alt={activeSlide.alt}
                loading={currentIndex === 0 ? 'eager' : 'lazy'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {/* Responsive Gradient Overlays for High Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#07111F]/95 via-[#07111F]/80 to-[#07111F]/30 sm:from-[#07111F]/92 sm:via-[#07111F]/65 sm:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/85 via-transparent to-transparent sm:hidden" />
            </motion.div>
          </AnimatePresence>

          {/* Top Brand Watermark */}
          <div className="absolute top-3 sm:top-4.5 left-3.5 sm:left-6 z-20 pointer-events-auto">
            <OREALogo
              variant="compact"
              size="small"
              theme="dark"
              animated={false}
              clickable={true}
              onClick={() => onNavigate?.('accueil')}
            />
          </div>

          {/* =========================================================================
              SLIDE CONTENT (Centered, Responsive Typography, Clean padding)
          ========================================================================= */}
          <div className="relative z-20 h-full flex items-center px-4 sm:px-8 md:px-12 lg:px-16">
            <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl text-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="space-y-2 sm:space-y-2.5 md:space-y-3.5 pt-7 sm:pt-4 md:pt-0"
                >
                  {/* Category Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase backdrop-blur-md border shadow-xs ${activeSlide.badgeClass}`}
                    >
                      <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>{activeSlide.category}</span>
                    </span>

                    {activeSlide.categorySub && (
                      <span className="text-[10px] sm:text-[11px] font-medium text-white/70 tracking-wide hidden sm:inline-block">
                        • {activeSlide.categorySub}
                      </span>
                    )}
                  </div>

                  {/* Main Title */}
                  <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-[1.15]">
                    {activeSlide.title}
                  </h2>

                  {/* Subtitle */}
                  {activeSlide.subtitle && (
                    <p className="hidden sm:block text-xs sm:text-sm md:text-base font-semibold text-[#7de3f8] leading-snug">
                      {activeSlide.subtitle}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-[14px] text-slate-200 leading-relaxed font-normal max-w-lg line-clamp-2 sm:line-clamp-3">
                    <span className="sm:hidden">{activeSlide.shortDescription || activeSlide.description}</span>
                    <span className="hidden sm:inline">{activeSlide.description}</span>
                  </p>

                  {/* CTA Action Button with Universal OREA 3D Glow Button System */}
                  <div className="pt-1.5 sm:pt-2.5 flex items-center gap-2.5">
                    <OreaButton
                      variant={
                        (activeSlide.id === 'sante' ? 'sante' :
                         activeSlide.id === 'sport' ? 'sport' :
                         activeSlide.id === 'nutrition' ? 'nutrition' :
                         activeSlide.id === 'objectifs' ? 'cycle' :
                         activeSlide.id === 'orientation' || activeSlide.id === 'esprit' ? 'etude' :
                         activeSlide.id === 'lifestyle' ? 'primary' :
                         'primary') as OreaButtonVariant
                      }
                      size="md"
                      onClick={() => handleActionClick(activeSlide)}
                      iconRight={<ArrowRight className="w-4 h-4" strokeWidth={2.4} />}
                      animatedLetters={false}
                    >
                      {activeSlide.ctaLabel}
                    </OreaButton>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* =========================================================================
              DISCRETE PREV / NEXT NAVIGATION CHEVRONS (Continuous & Infinite)
          ========================================================================= */}
          <button
            type="button"
            onClick={goToPrevSlide}
            aria-label="Image précédente"
            className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full backdrop-blur-md bg-black/35 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.4} />
          </button>

          <button
            type="button"
            onClick={goToNextSlide}
            aria-label="Image suivante"
            className="absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full backdrop-blur-md bg-black/35 hover:bg-black/60 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-md"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
