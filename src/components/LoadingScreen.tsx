import React from 'react';
import { OreaLoader } from './OreaLoader';

export interface LoadingScreenProps {
  /** Optional callback fired when fade out completes */
  onFinish?: () => void;
  /** Force completion status if controlled externally */
  isLoaded?: boolean;
}

/**
 * Official OREA Loading Screen
 * Wrapped over OreaLoader to ensure consistent minimum 3-second kinetic experience.
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onFinish,
  isLoaded,
}) => {
  return (
    <OreaLoader
      isReady={isLoaded}
      minDuration={3000}
      onFinish={onFinish}
    />
  );
};

export default LoadingScreen;

