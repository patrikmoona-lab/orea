import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { OREASymbol, OREAWordmark } from './OREALogo';

export interface OreaLoaderProps {
  /**
   * External readiness flag.
   * If provided, OreaLoader will wait until BOTH:
   * 1. minDuration (3000ms default) is reached
   * 2. isReady is true
   */
  isReady?: boolean;

  /**
   * Minimum display duration in milliseconds (default: 3000 ms)
   */
  minDuration?: number;

  /**
   * Callback fired when fade out completes
   */
  onFinish?: () => void;

  /**
   * Whether to render full screen (default: true) or inline component
   */
  fullScreen?: boolean;

  /**
   * Theme: 'light' (default) or 'dark'
   */
  theme?: 'light' | 'dark';

  /**
   * Primary loading text message
   */
  message?: string;

  /**
   * Optional list of messages to cycle through during long loads
   */
  customMessages?: string[];

  /**
   * Controlled error string. If non-null, displays safe error state rather than blank page.
   */
  error?: string | null;

  /**
   * Callback fired if user clicks Retry on error
   */
  onRetry?: () => void;

  /**
   * Safety timeout in milliseconds (default: 25000ms, 0 to disable)
   */
  timeoutMs?: number;

  /**
   * Additional container CSS classes
   */
  className?: string;
}

const DEFAULT_MESSAGES = [
  'Initialisation sécurisée d’OREA...',
  'Synchronisation de votre univers de santé...',
  'Préparation de vos modules personnalisés...',
  'Finalisation de votre expérience...',
];

/**
 * Official OreaLoader Component
 *
 * Implements continuous kinetic motion inspired by progression loaders:
 * - Floating, levitating and gliding OREA hero emblem
 * - Moving kinetic light track & particle stream beneath the emblem
 * - Responsive dynamic progress bar synchronized with app readiness
 * - GUARANTEED MINIMUM DURATION: 3000ms (never hides prematurely)
 * - Safe error fallback: Never leaves a blank page
 * - Fully accessible: role="status", aria-live="polite", aria-label="Chargement d'OREA"
 * - Supports prefers-reduced-motion
 */
export const OreaLoader: React.FC<OreaLoaderProps> = ({
  isReady: controlledIsReady,
  minDuration = 3000,
  onFinish,
  fullScreen = true,
  theme = 'light',
  message,
  customMessages = DEFAULT_MESSAGES,
  error: externalError,
  onRetry,
  timeoutMs = 25000,
  className = '',
}) => {
  // ALL HOOKS UNCONDITIONALLY AT TOP LEVEL
  const [minTimeReached, setMinTimeReached] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  const startTimeRef = useRef<number>(Date.now());
  const onFinishCalledRef = useRef<boolean>(false);

  // 1. Minimum 3000ms duration enforcement
  useEffect(() => {
    startTimeRef.current = Date.now();
    const minTimer = setTimeout(() => {
      setMinTimeReached(true);
    }, minDuration);

    return () => clearTimeout(minTimer);
  }, [minDuration]);

  // 2. Smooth simulated progress curve
  useEffect(() => {
    const isAppActuallyReady = controlledIsReady !== undefined ? controlledIsReady : true;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const timeRatio = Math.min(elapsed / minDuration, 1);

      if (!minTimeReached || !isAppActuallyReady) {
        // Smoothly approach 90% while waiting for both conditions
        // Easing curve towards 92%
        const targetProgress = Math.min(Math.round(92 * (1 - Math.pow(1 - timeRatio, 2))), 92);
        setProgress((prev) => Math.max(prev, targetProgress));
      } else {
        // Both conditions satisfied (min 3000ms + app is ready) -> accelerate to 100%
        setProgress(100);
        clearInterval(interval);

        if (!onFinishCalledRef.current) {
          onFinishCalledRef.current = true;
          // Smooth fade out delay
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              setIsMounted(false);
              onFinish?.();
            }, 450); // Matches CSS fade transition
          }, 250);
        }
      }
    }, 40);

    return () => clearInterval(interval);
  }, [minTimeReached, controlledIsReady, minDuration, onFinish]);

  // 3. Message cycling during long loads
  useEffect(() => {
    if (message) return; // User provided custom single message
    if (customMessages.length <= 1) return;

    const msgInterval = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % customMessages.length);
    }, 2200);

    return () => clearInterval(msgInterval);
  }, [message, customMessages]);

  // 4. Safety timeout detection
  useEffect(() => {
    if (!timeoutMs || timeoutMs <= 0) return;

    const timer = setTimeout(() => {
      if (controlledIsReady === false || progress < 100) {
        setIsTimedOut(true);
      }
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [timeoutMs, controlledIsReady, progress]);

  // Handle retry
  const handleRetry = () => {
    setIsTimedOut(false);
    startTimeRef.current = Date.now();
    setMinTimeReached(false);
    setProgress(15);
    onRetry?.();
  };

  if (!isMounted) {
    return null;
  }

  const activeMessage = message || customMessages[currentMsgIndex];
  const hasError = !!externalError || isTimedOut;
  const displayErrorMessage = externalError || 'Le chargement prend plus de temps que prévu. Veuillez vérifier votre connexion ou réessayer.';

  const containerClass = fullScreen
    ? `orea-loader-screen ${theme === 'dark' ? 'dark-theme' : ''} ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${className}`
    : `orea-loader-inline ${theme === 'dark' ? 'dark-theme' : ''} ${className}`;

  return (
    <div
      className={containerClass}
      role="status"
      aria-live="polite"
      aria-label="Chargement d'OREA"
    >
      {/* Ambient background aura */}
      <div className="orea-loader-ambient-glow" />

      <div className="orea-loader-card">
        {hasError ? (
          /* Controlled safe error interface — NEVER A BLANK PAGE */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white/95 dark:bg-slate-900/95 border border-red-200 dark:border-red-900/60 rounded-3xl p-6 sm:p-8 shadow-xl text-center"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-2">
              Difficulté de chargement
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {displayErrorMessage}
            </p>

            <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0056d6] hover:bg-[#0046b3] text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Réessayer maintenant</span>
            </button>
          </motion.div>
        ) : (
          /* Normal Animated OreaLoader */
          <>
            {/* HERO OBJECT: Animated levitating OREA Emblem with halo rings */}
            <div className="orea-loader-hero">
              <div className="orea-floating-emblem">
                {/* Rotating subtle kinetic rings */}
                <div className="orea-emblem-ring-outer" />
                <div className="orea-emblem-ring-inner" />

                {/* Pure Vector OREA Symbol */}
                <OREASymbol
                  className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md"
                  animated={true}
                  idPrefix="loader_main_"
                />
              </div>
            </div>

            {/* KINETIC GROUND TRACK: Moving light beams & particles beneath object */}
            <div className="orea-loader-ground">
              {/* Dynamic Breathing Ground Shadow */}
              <div className="orea-ground-shadow" />

              {/* Glowing Runway Track Line */}
              <div className="orea-track-line">
                <div className="orea-track-pulse orea-track-pulse-1" />
                <div className="orea-track-pulse orea-track-pulse-2" />
              </div>

              {/* Forward-motion speed particles flowing backward */}
              <div className="orea-speed-particles">
                <span className="orea-particle-dash" />
                <span className="orea-particle-dash" />
                <span className="orea-particle-dash" />
                <span className="orea-particle-dash" />
              </div>
            </div>

            {/* TYPOGRAPHY: Official OREA Wordmark & Motto */}
            <div className="orea-loader-brand">
              <div className="orea-loader-wordmark-wrapper">
                <OREAWordmark theme={theme} size="medium" />
              </div>
              <p className="orea-loader-tagline">
                Mieux comprendre, mieux évoluer, mieux vivre.
              </p>
            </div>

            {/* PROGRESSION BAR & DYNAMIC STATUS */}
            <div className="orea-progress-container">
              <div className="orea-progress-track">
                <div
                  className="orea-progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="orea-status-row">
                <div className="orea-status-text">
                  <span className="orea-status-dot" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeMessage}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.25 }}
                    >
                      {activeMessage}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="orea-status-percentage">{progress}%</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OreaLoader;
