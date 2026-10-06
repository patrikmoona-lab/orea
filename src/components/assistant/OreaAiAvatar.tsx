import React from 'react';

export type OreaAiAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type OreaAiAvatarState = 'idle' | 'thinking' | 'streaming' | 'error';

export interface OreaAiAvatarProps {
  size?: OreaAiAvatarSize;
  state?: OreaAiAvatarState;
  className?: string;
  showGlowRing?: boolean;
}

/**
 * OreaAiAvatar — Animated EVA Robot Mascot for Votre IA OREA
 * Based on Uiverse.io by Subaashbala, adapted specifically for OREA.
 * Fully responsive, accessible, with idle, thinking, streaming, and error states.
 */
export const OreaAiAvatar: React.FC<OreaAiAvatarProps> = ({
  size = 'md',
  state = 'idle',
  className = '',
  showGlowRing = false,
}) => {
  return (
    <div
      className={`orea-ai-avatar orea-ai-avatar--${size} orea-ai-avatar--${state} ${className}`}
      role="img"
      aria-label="Avatar de Votre IA OREA"
    >
      <div className="orea-ai-avatar__viewport">
        {/* Glowing aura if requested */}
        {showGlowRing && (
          <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-pulse pointer-events-none" />
        )}

        {/* EVA Robot Character */}
        <div className="orea-ai-avatar__eva">
          {/* Head & Glowing Visor */}
          <div className="orea-ai-avatar__head">
            <div className="orea-ai-avatar__eye-chamber">
              <div className="orea-ai-avatar__eye" />
              <div className="orea-ai-avatar__eye" />
            </div>
          </div>

          {/* Torso, Hands & Futuristic Scanner */}
          <div className="orea-ai-avatar__body">
            <div className="orea-ai-avatar__hand" />
            <div className="orea-ai-avatar__hand" />
            <div className="orea-ai-avatar__scanner" />
            <div className="orea-ai-avatar__scanner-origin" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OreaAiAvatar;
