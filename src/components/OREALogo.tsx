import React from 'react';
import officialLogoImg from '../assets/branding/orea-logo-official.png';
import { OreaLogo, OreaLogoProps } from './branding/OreaLogo';

export type { OreaLogoProps };
export { OreaLogo };

export interface OREALogoProps extends OreaLogoProps {
  animated?: boolean;
  useImage?: boolean;
}

/**
 * Official OREA Logo Symbol Emblem
 * Directly renders the official OREA brand emblem from the official logo asset.
 */
export const OREASymbol: React.FC<{
  className?: string;
  size?: number | string;
  animated?: boolean;
  idPrefix?: string;
}> = ({ className = 'w-10 h-10', size }) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl overflow-hidden bg-[#070e1c] border border-white/10 shadow-2xs shrink-0 select-none ${className}`}
      style={size ? { width: size, height: size, aspectRatio: '1 / 1' } : { aspectRatio: '1 / 1' }}
      role="img"
      aria-label="Symbole OREA"
    >
      <img
        src={officialLogoImg}
        alt="Symbole OREA"
        className="w-full h-full object-contain"
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

/**
 * Official OREA Wordmark
 */
export const OREAWordmark: React.FC<{
  className?: string;
  theme?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}> = ({ className = '', size = 'medium' }) => {
  const heightClasses = {
    small: 'h-8 sm:h-9',
    medium: 'h-10 sm:h-12',
    large: 'h-14 sm:h-16',
    xs: 'h-7',
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  }[size] || 'h-10 sm:h-12';

  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl overflow-hidden bg-[#070e1c] border border-white/10 shadow-2xs shrink-0 select-none ${heightClasses} ${className}`}
      style={{ aspectRatio: '1 / 1' }}
      role="img"
      aria-label="OREA"
    >
      <img
        src={officialLogoImg}
        alt="OREA"
        className="h-full w-full object-contain"
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

/**
 * Letter A with golden triangle
 */
export const OREALetterA: React.FC<{ className?: string; isDark?: boolean }> = ({
  className = 'w-7 h-7',
}) => {
  return (
    <span className={`inline-flex items-center justify-center rounded-xl overflow-hidden bg-[#070e1c] p-0.5 shrink-0 ${className}`}>
      <img
        src={officialLogoImg}
        alt="A"
        className="w-full h-full object-contain"
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </span>
  );
};

/**
 * Universal Official OREA Logo
 * Centralizes all references throughout the entire project to the single official logo asset.
 */
export const OREALogo: React.FC<OREALogoProps> = ({
  size = 'md',
  variant = 'compact',
  theme,
  showTagline = true,
  clickable = true,
  onClick,
  className = '',
  id,
}) => {
  // Height presets
  const sizeMap: Record<string, string> = {
    xs: 'h-8 sm:h-9',
    small: 'h-9 sm:h-10',
    sm: 'h-9 sm:h-10',
    medium: 'h-11 sm:h-13',
    md: 'h-11 sm:h-13',
    lg: 'h-14 sm:h-18',
    large: 'h-14 sm:h-18',
    xl: 'h-24 sm:h-32',
  };

  const heightClass = sizeMap[size] || sizeMap.md;

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
        className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-2xs border border-white/10 bg-[#070e1c] ${heightClass}`}
        style={{ aspectRatio: '1 / 1' }}
      >
        <img
          src={officialLogoImg}
          alt="OREA — Mieux comprendre, mieux évoluer, mieux vivre"
          className="h-full w-full object-contain"
          loading="eager"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

export default OREALogo;
