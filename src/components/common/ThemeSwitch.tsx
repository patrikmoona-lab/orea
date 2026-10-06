import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeSwitchProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  className = '',
  size = 'md',
  showLabel = false,
}) => {
  const { effectiveTheme, toggleTheme, theme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  // Size scalers for toggle button
  const scaleMap = {
    xs: '0.65',
    sm: '0.8',
    md: '1',
    lg: '1.2',
  };

  const scale = scaleMap[size] || '1';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <label
        className="theme-switch"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        title={`Thème actuel : ${theme === 'system' ? 'Système (' + (isDark ? 'Sombre' : 'Clair') + ')' : isDark ? 'Sombre' : 'Clair'}. Cliquez pour basculer.`}
      >
        <input
          type="checkbox"
          className="theme-switch__checkbox"
          checked={isDark}
          onChange={toggleTheme}
          aria-label="Basculer entre le mode clair et le mode sombre"
        />
        <div className="theme-switch__container">
          <div className="theme-switch__clouds"></div>

          <div className="theme-switch__stars-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="theme-switch__circle-container">
            <div className="theme-switch__sun-moon-container">
              <div className="theme-switch__moon">
                <div className="theme-switch__spot"></div>
                <div className="theme-switch__spot"></div>
                <div className="theme-switch__spot"></div>
              </div>
            </div>
          </div>
        </div>
      </label>

      {showLabel && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {isDark ? 'Mode Nuit' : 'Mode Jour'}
        </span>
      )}
    </div>
  );
};
export default ThemeSwitch;
