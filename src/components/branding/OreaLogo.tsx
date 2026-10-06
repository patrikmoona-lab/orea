import React from 'react';
import officialLogoImg from '../../assets/branding/orea-logo-official.png';

export type OreaLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large';
export type OreaLogoVariant = 'full' | 'compact' | 'header' | 'footer' | 'icon' | 'symbol' | 'wordmark';

export interface OreaLogoProps {
  size?: OreaLogoSize;
  variant?: OreaLogoVariant;
  theme?: 'light' | 'dark';
  showTagline?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  id?: string;
}

/**
 * Official OREA Logo Component
 * Uses the exact official image asset provided by OREA:
 * - 3D metallic/glossy emblem (cyan and gold)
 * - OREA wordmark (cyan O, white RE, chevron A with golden triangle)
 * - Motto: "Mieux comprendre, mieux évoluer, mieux vivre."
 *
 * Preserves 100% original aspect ratio (object-fit: contain) and color fidelity.
 */
export const OreaLogo: React.FC<OreaLogoProps> = ({
  size = 'md',
  variant = 'compact',
  theme,
  showTagline = true,
  clickable = true,
  onClick,
  className = '',
  id,
}) => {
  // Height presets tailored for headers, sidebars, cards, and footers
  const sizeMap: Record<string, { heightClass: string; imgClass: string }> = {
    xs: { heightClass: 'h-8 sm:h-9', imgClass: 'h-7 sm:h-8 w-auto' },
    small: { heightClass: 'h-9 sm:h-10', imgClass: 'h-8 sm:h-9 w-auto' },
    sm: { heightClass: 'h-9 sm:h-10', imgClass: 'h-8 sm:h-9 w-auto' },
    medium: { heightClass: 'h-11 sm:h-13', imgClass: 'h-10 sm:h-12 w-auto' },
    md: { heightClass: 'h-11 sm:h-13', imgClass: 'h-10 sm:h-12 w-auto' },
    lg: { heightClass: 'h-14 sm:h-18', imgClass: 'h-13 sm:h-16 w-auto' },
    large: { heightClass: 'h-14 sm:h-18', imgClass: 'h-13 sm:h-16 w-auto' },
    xl: { heightClass: 'h-24 sm:h-32', imgClass: 'h-22 sm:h-28 w-auto' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const handleClick = (e: React.MouseEvent) => {
    if (clickable && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      id={id}
      onClick={clickable ? handleClick : undefined}
      role={clickable ? 'button' : 'img'}
      tabIndex={clickable ? 0 : undefined}
      aria-label="OREA — Mieux comprendre, mieux évoluer, mieux vivre"
      className={`inline-flex items-center justify-center select-none ${
        clickable ? 'cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]' : ''
      } ${className}`}
    >
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-2xs border border-white/10 bg-[#070e1c] ${currentSize.heightClass}`}
        style={{ aspectRatio: '1 / 1' }}
      >
        <img
          src={officialLogoImg}
          alt="OREA — Mieux comprendre, mieux évoluer, mieux vivre"
          className={`h-full w-full object-contain ${currentSize.imgClass}`}
          loading="eager"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

export default OreaLogo;
