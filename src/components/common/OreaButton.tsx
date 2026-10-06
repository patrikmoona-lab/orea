import React from 'react';
import { Loader2 } from 'lucide-react';

export type OreaButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'sante'
  | 'urgence'
  | 'sos'
  | 'sport'
  | 'bien-etre'
  | 'nutrition'
  | 'cycle'
  | 'etude'
  | 'education'
  | 'ai'
  | 'votre-ia'
  | 'pricing'
  | 'pro'
  | 'gold'
  | 'danger'
  | 'success'
  | 'warning';

export type OreaButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';

export interface OreaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: OreaButtonVariant;
  size?: OreaButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  animatedLetters?: boolean;
  flickerIcon?: boolean;
  wrapperClassName?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export const OreaButton: React.FC<OreaButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  loadingText,
  icon,
  iconRight,
  animatedLetters = false,
  flickerIcon = true,
  className = '',
  wrapperClassName = '',
  disabled,
  href,
  target,
  rel,
  type = 'button',
  onClick,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  // Compute CSS class modifiers
  const variantClass = `orea-btn-${variant}`;
  const sizeClass = `orea-btn-${size}`;
  const letterAnimClass = animatedLetters ? 'with-letter-anim' : '';
  const flickerAnimClass = flickerIcon ? 'with-flicker-anim' : '';
  const disabledClass = isDisabled ? 'is-disabled' : '';

  const buttonClasses = `
    orea-btn
    ${variantClass}
    ${sizeClass}
    ${letterAnimClass}
    ${flickerAnimClass}
    ${disabledClass}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  // Render animated letters if string child and animatedLetters = true
  const renderContent = () => {
    if (isLoading) {
      return (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-white/90 shrink-0" />
          <span>{loadingText || children || 'Chargement...'}</span>
        </span>
      );
    }

    if (animatedLetters && typeof children === 'string') {
      const letters = Array.from(children);
      return (
        <span className="inline-flex items-center">
          {letters.map((char, index) => {
            if (char === ' ') {
              return <span key={index}>&nbsp;</span>;
            }
            return (
              <span
                key={index}
                className="orea-btn-letter"
                style={{ animationDelay: `${(index * 0.07).toFixed(2)}s` }}
              >
                {char}
              </span>
            );
          })}
        </span>
      );
    }

    return children;
  };

  const innerBody = (
    <>
      {/* Optional Left Icon */}
      {icon && !isLoading && (
        <span className="orea-btn-svg" aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Main Label */}
      {renderContent()}

      {/* Optional Right Icon */}
      {iconRight && !isLoading && (
        <span className="orea-btn-svg ml-0.5" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </>
  );

  // If rendered as link
  if (href && !isDisabled) {
    return (
      <div className={`orea-btn-wrapper ${fullWidth ? 'w-full' : ''} ${wrapperClassName}`}>
        <a
          href={href}
          target={target}
          rel={target === '_blank' ? rel || 'noopener noreferrer' : rel}
          className={buttonClasses}
          onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          role="button"
          tabIndex={0}
        >
          {innerBody}
        </a>
      </div>
    );
  }

  return (
    <div className={`orea-btn-wrapper ${fullWidth ? 'w-full' : ''} ${wrapperClassName}`}>
      <button
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        className={buttonClasses}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...rest}
      >
        {innerBody}
      </button>
    </div>
  );
};

export default OreaButton;
