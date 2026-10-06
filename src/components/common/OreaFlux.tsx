import React from 'react';

interface OreaFluxProps {
  variant?: 'subtle' | 'ambient' | 'hero' | 'auth';
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
}

/**
 * Le Flux OREA — Signature Visual Element
 * Replaces generic AI stars and cosmic particles with elegant, organic flow lines
 * representing health, well-being, mind, studies, and continuous human evolution.
 */
export const OreaFlux: React.FC<OreaFluxProps> = ({
  variant = 'subtle',
  className = '',
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  if (variant === 'auth') {
    return (
      <div
        className={`relative w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
        aria-hidden="true"
      >
        {/* Soft Organic Atmospheric Halos */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-60 transition-transform duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(0, 166, 199, 0.28) 0%, rgba(0, 86, 214, 0.15) 50%, transparent 75%)',
          }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-50 transition-transform duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(0, 196, 159, 0.22) 0%, rgba(11, 47, 91, 0.12) 60%, transparent 80%)',
          }}
        />

        {/* Dynamic Organic Flow Ribbons (Vector Bézier Paths) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-70"
          viewBox="0 0 600 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="fluxGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0056D6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#00A6C7" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#00C49F" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="fluxGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B2F5B" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#00A6C7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#9333EA" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="fluxGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00C49F" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#00A6C7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0056D6" stopOpacity="0.2" />
            </linearGradient>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ribbon Path 1 - Primary Life Flow */}
          <path
            d="M -100,200 C 150,120 250,380 450,280 C 600,200 650,420 750,480"
            stroke="url(#fluxGrad1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="orea-flux-ribbon-1"
          />

          {/* Ribbon Path 2 - Evolution & Growth Path */}
          <path
            d="M -50,450 C 120,380 200,620 420,520 C 580,440 620,680 750,600"
            stroke="url(#fluxGrad2)"
            strokeWidth="2"
            strokeLinecap="round"
            className="orea-flux-ribbon-2"
          />

          {/* Ribbon Path 3 - Harmonic Connection */}
          <path
            d="M 50,-50 C 220,150 180,480 380,680 C 480,780 620,720 700,900"
            stroke="url(#fluxGrad3)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            className="orea-flux-ribbon-3"
          />

          {/* Human Connection Nodes (Subtle, non-cliché points of evolution) */}
          <circle cx="250" cy="380" r="3.5" fill="#00A6C7" opacity="0.8" />
          <circle cx="450" cy="280" r="4.5" fill="#00C49F" opacity="0.85" filter="url(#softGlow)" />
          <circle cx="200" cy="620" r="3" fill="#0056D6" opacity="0.75" />
          <circle cx="420" cy="520" r="4" fill="#00A6C7" opacity="0.85" filter="url(#softGlow)" />
        </svg>
      </div>
    );
  }

  // Subtle / Ambient Variant
  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full opacity-40"
        viewBox="0 0 1200 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ambientGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#0056D6" stopOpacity="0" />
            <stop offset="25%" stopColor="#00A6C7" stopOpacity={isDark ? "0.35" : "0.2"} />
            <stop offset="60%" stopColor="#00C49F" stopOpacity={isDark ? "0.4" : "0.25"} />
            <stop offset="100%" stopColor="#0056D6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,200 C300,120 500,280 800,180 C1000,100 1100,240 1200,190"
          stroke="url(#ambientGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M0,240 C280,180 550,320 850,230 C1050,170 1150,290 1200,250"
          stroke="url(#ambientGrad)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};

export default OreaFlux;
