import React from 'react';
import { OreaLoader } from './OreaLoader';

interface SplashScreenProps {
  onFinish?: () => void;
  isLoaded?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
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

export default SplashScreen;


