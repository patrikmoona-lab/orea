import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { OREASymbol } from '../OREALogo';
import { OreaButton } from './OreaButton';
import { OreaFlux } from './OreaFlux';

export type OREALoaderVariant = 'fullscreen' | 'page' | 'component' | 'button';
export type OREALoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type OREALoaderTheme = 'light' | 'dark' | 'auto';

export interface OREALoaderProps {
  /**
   * Type of loader:
   * - 'fullscreen': Full screen immersive launch / major switch
   * - 'page': Dedicated section or page loader
   * - 'component': Compact card / widget loader
   * - 'button': Micro inline loader for buttons
   */
  variant?: OREALoaderVariant;

  /**
   * Sizing preset
   */
  size?: OREALoaderSize;

  /**
   * Color theme: 'light' (clean slate/pearl) or 'dark' (deep obsidian/navy)
   */
  theme?: OREALoaderTheme;

  /**
   * Explicit progress percentage (0 - 100). If not provided in fullscreen mode,
   * an organic smooth progression is orchestrated.
   */
  progress?: number;

  /**
   * Custom loading messages array to cycle through
   */
  customMessages?: string[];

  /**
   * Show or hide the official slogan "Mieux comprendre. Mieux vivre. Mieux évoluer."
   */
  showTagline?: boolean;

  /**
   * Show progress bar & percentage
   */
  showProgress?: boolean;

  /**
   * Callback fired when transition out completes (e.g. at 100%)
   */
  onFinish?: () => void;

  /**
   * Callback fired if the user clicks Retry on timeout error
   */
  onRetry?: () => void;

  /**
   * Safety timeout in milliseconds before displaying error fallback (default: 18000ms, set to 0 to disable)
   */
  timeoutMs?: number;

  /**
   * Minimum display duration in milliseconds to prevent flickering
   */
  minDurationMs?: number;

  /**
   * Additional container CSS classes
   */
  className?: string;
}

const DEFAULT_MESSAGES = [
  'Préparation de votre espace...',
  'Connexion à votre univers OREA...',
  'Organisation de votre expérience...',
  'Chargement de vos informations...',
  'Presque prêt...',
];

/**
 * Universal OREA Loader
 * Delivers a distinctive, ultra-premium, hardware-accelerated loading experience
 * strictly true to the OREA visual identity and philosophical motto.
 */
export const OREALoader: React.FC<OREALoaderProps> = ({
  variant = 'fullscreen',
  size = 'lg',
  theme = 'light',
  progress: controlledProgress,
  customMessages = DEFAULT_MESSAGES,
  showTagline = true,
  showProgress = true,
  onFinish,
  onRetry,
  timeoutMs = 18000,
  minDurationMs = 1400,
  className = '',
}) => {
  const isDark = theme === 'dark';
  const autoId = useId().replace(/:/g, '');

  const [simulatedProgress, setSimulatedProgress] = useState<number>(
    controlledProgress !== undefined ? controlledProgress : 0
  );
  const [currentMsgIdx, setCurrentMsgIdx] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Sync controlled progress if provided
  useEffect(() => {
    if (controlledProgress !== undefined) {
      setSimulatedProgress(controlledProgress);
      if (controlledProgress >= 100 && !isExiting) {
        setIsExiting(true);
        const timer = setTimeout(() => {
          onFinish?.();
        }, 450);
        return () => clearTimeout(timer);
      }
    }
  }, [controlledProgress, isExiting, onFinish]);

  // Organic smooth progression if not controlled
  useEffect(() => {
    if (controlledProgress !== undefined) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(elapsed / minDurationMs, 1);

      // Ease-out smooth curve
      const nextProgress = Math.round(100 * (1 - Math.pow(1 - ratio, 2.5)));
      setSimulatedProgress(nextProgress);

      if (ratio >= 1) {
        clearInterval(interval);
        setIsExiting(true);
        setTimeout(() => {
          onFinish?.();
        }, 400);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [controlledProgress, minDurationMs, onFinish]);

  // Messages cycling
  useEffect(() => {
    if (customMessages.length <= 1) return;
    const msgInterval = setInterval(() => {
      setCurrentMsgIdx((prev) => (prev + 1) % customMessages.length);
    }, 2200);

    return () => clearInterval(msgInterval);
  }, [customMessages]);

  // Safety timeout check
  useEffect(() => {
    if (!timeoutMs || timeoutMs <= 0 || controlledProgress === 100) return;

    const timeoutTimer = setTimeout(() => {
      if (simulatedProgress < 100) {
        setIsTimedOut(true);
      }
    }, timeoutMs);

    return () => clearTimeout(timeoutTimer);
  }, [timeoutMs, simulatedProgress, controlledProgress]);

  const handleRetry = () => {
    setIsTimedOut(false);
    setSimulatedProgress(10);
    setCurrentMsgIdx(0);
    if (onRetry) {
      onRetry();
    }
  };

  // Dimensions based on size
  const ringDimensions = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28 sm:w-32 sm:h-32',
    xl: 'w-36 h-36 sm:w-44 sm:h-44',
  }[size];

  const symbolDimensions = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-12 h-12',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-22 h-22 sm:w-28 sm:h-28',
  }[size];

  // ==================== VARIANT: BUTTON LOADER ====================
  if (variant === 'button') {
    return (
      <div className={`inline-flex items-center gap-2 select-none ${className}`}>
        <div className="relative w-4 h-4 rounded-full flex items-center justify-center">
          <div className="orea-loader-outer-ring !inset-[-2px] !mask-[radial-gradient(farthest-side,transparent_calc(100%-1.5px),#fff_calc(100%-1px))]" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>
        <span className="text-xs font-semibold tracking-wide">Chargement...</span>
      </div>
    );
  }

  // ==================== VARIANT: COMPONENT / INLINE ====================
  if (variant === 'component') {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 text-center select-none ${
          isDark ? 'text-slate-200' : 'text-slate-800'
        } ${className}`}
      >
        <div className={`orea-loader-ring-wrapper ${ringDimensions} relative`}>
          <div className="orea-loader-halo" />
          <div className="orea-loader-outer-ring" />
          <div className="orea-loader-inner-ring" />
          <OREASymbol className={symbolDimensions} animated={false} />
        </div>

        <p className="mt-3 text-xs sm:text-sm font-medium text-slate-500 animate-pulse">
          {customMessages[currentMsgIdx] || 'Chargement des données...'}
        </p>
      </div>
    );
  }

  // ==================== VARIANT: PAGE LOADER ====================
  if (variant === 'page') {
    return (
      <div
        className={`w-full min-h-[360px] py-12 flex flex-col items-center justify-center select-none ${
          isDark ? 'bg-[#0B1528] text-white' : 'bg-slate-50/70 text-[#0B2F5B]'
        } ${className}`}
      >
        <div className={`orea-loader-ring-wrapper ${ringDimensions} relative mb-6`}>
          <div className="orea-loader-halo" />
          <div className="orea-loader-outer-ring" />
          <div className="orea-loader-inner-ring" />
          <OREASymbol className={symbolDimensions} animated={false} />
        </div>

        {/* Animated Letter OREA */}
        <div className="flex items-center gap-1.5 text-lg sm:text-xl tracking-[0.2em] font-extrabold">
          <span className="orea-loader-char text-[#00A6C7]" style={{ animationDelay: '0s' }}>
            O
          </span>
          <span className="orea-loader-char text-[#0077B6]" style={{ animationDelay: '0.2s' }}>
            R
          </span>
          <span className="orea-loader-char text-[#075FA8]" style={{ animationDelay: '0.4s' }}>
            E
          </span>
          <span className="orea-loader-char text-[#0B3B75]" style={{ animationDelay: '0.6s' }}>
            A
          </span>
        </div>

        {/* Dynamic message */}
        <div className="h-6 mt-3 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMsgIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide text-center"
            >
              {customMessages[currentMsgIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="w-48 sm:w-56 h-1.5 bg-slate-200 dark:bg-slate-700/60 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0077B6] via-[#00A6C7] to-[#00C49F] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${simulatedProgress}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  // ==================== VARIANT: FULL SCREEN LOADER ====================
  return (
    <AnimatePresence>
      <motion.div
        id="orea-application-loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden ${
          isDark
            ? 'bg-gradient-to-b from-[#060e1c] via-[#09152b] to-[#040913] text-white'
            : 'bg-gradient-to-b from-[#f8fafc] via-[#f0f4f9] to-[#e8eef8] text-[#0B2F5B]'
        } ${className}`}
        aria-live="polite"
        aria-busy={simulatedProgress < 100}
      >
        {/* Le Flux OREA in Loader Background */}
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <OreaFlux variant="ambient" theme={isDark ? 'dark' : 'light'} />
        </div>

        {/* Subtle Ambient Radial Glow in Background */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-40 transition-all duration-1000"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(0,166,199,0.2) 0%, rgba(11,59,117,0.15) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(0,166,199,0.18) 0%, rgba(186,230,253,0.3) 50%, transparent 75%)',
          }}
        />

        {/* Main Content Container */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
          {isTimedOut ? (
            /* ================= TIMEOUT / ERROR FALLBACK ================= */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 mb-4">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#0B2F5B] dark:text-white">
                Chargement prolongé
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-center">
                La connexion à l’écosystème OREA prend plus de temps que prévu. Vérifiez votre réseau ou relancez.
              </p>
              <div className="mt-5 w-full">
                <OreaButton
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleRetry}
                  icon={<RefreshCw className="w-4 h-4" />}
                >
                  Réessayer
                </OreaButton>
              </div>
            </motion.div>
          ) : (
            /* ================= ACTIVE LOADER CONTENT ================= */
            <>
              {/* Central Glowing Circle with Official OREA Symbol */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`orea-loader-ring-wrapper ${ringDimensions} relative mb-6`}
              >
                {/* 1. Core Halo with subtle organic breathing */}
                <div className="orea-loader-halo" />

                {/* 2. Outer Gradient Glowing Ring */}
                <div className="orea-loader-outer-ring" />

                {/* 3. Inner Counter-Rotating Ring */}
                <div className="orea-loader-inner-ring" />

                {/* 4. Central Vector Official OREA Symbol */}
                <div className="relative z-10 flex items-center justify-center drop-shadow-md">
                  <OREASymbol
                    className={symbolDimensions}
                    animated={true}
                    idPrefix={`loader_${autoId}_`}
                  />
                </div>
              </motion.div>

              {/* Individual Animated Letters O-R-E-A */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-2 select-none">
                <span
                  className="orea-loader-char text-2xl sm:text-3xl font-black text-[#00A6C7]"
                  style={{ animationDelay: '0s' }}
                >
                  O
                </span>
                <span
                  className="orea-loader-char text-2xl sm:text-3xl font-black text-[#0077B6]"
                  style={{ animationDelay: '0.25s' }}
                >
                  R
                </span>
                <span
                  className="orea-loader-char text-2xl sm:text-3xl font-black text-[#075FA8]"
                  style={{ animationDelay: '0.5s' }}
                >
                  E
                </span>
                <span
                  className="orea-loader-char text-2xl sm:text-3xl font-black text-[#0B3B75] dark:text-cyan-300"
                  style={{ animationDelay: '0.75s' }}
                >
                  A
                </span>
              </div>

              {/* Official Motto: Exact order "Mieux comprendre, mieux évoluer, mieux vivre." */}
              {showTagline && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className={`text-xs sm:text-sm font-semibold tracking-wide mt-1 select-none ${
                    isDark ? 'text-slate-300' : 'text-[#29476D]'
                  }`}
                  style={{ letterSpacing: '0.045em' }}
                >
                  Mieux comprendre, mieux évoluer, mieux vivre.
                </motion.p>
              )}

              {/* Dynamic Loading Message */}
              <div className="h-7 mt-6 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMsgIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#00A6C7] animate-ping shrink-0" />
                    <span>{customMessages[currentMsgIdx]}</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progression Indicator & Percentage */}
              {showProgress && (
                <div className="w-56 sm:w-64 mt-4 flex flex-col items-center">
                  <div className="w-full h-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#0B3B75] via-[#00A6C7] to-[#00C49F] rounded-full"
                      style={{ width: `${simulatedProgress}%` }}
                      transition={{ ease: 'easeOut', duration: 0.2 }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between w-full text-[11px] font-bold text-slate-400 dark:text-slate-500 px-0.5">
                    <span>Écosystème OREA</span>
                    <span>{simulatedProgress}%</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Convenient Named Component Presets
 */
export const FullScreenLoader: React.FC<Omit<OREALoaderProps, 'variant'>> = (props) => (
  <OREALoader variant="fullscreen" size="lg" {...props} />
);

export const PageLoader: React.FC<Omit<OREALoaderProps, 'variant'>> = (props) => (
  <OREALoader variant="page" size="md" {...props} />
);

export const ComponentLoader: React.FC<Omit<OREALoaderProps, 'variant'>> = (props) => (
  <OREALoader variant="component" size="sm" showProgress={false} {...props} />
);

export const ButtonLoader: React.FC<Omit<OREALoaderProps, 'variant'>> = (props) => (
  <OREALoader variant="button" size="xs" showProgress={false} showTagline={false} {...props} />
);

export { OreaLoader } from '../OreaLoader';
export default OREALoader;
