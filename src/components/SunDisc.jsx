import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const SunDisc = ({ size = 24, variant = 'gold', className = '', strokeColor }) => {
  let theme = 'night';
  try {
    const themeContext = useTheme();
    if (themeContext?.theme) theme = themeContext.theme;
  } catch (err) {
    // Fallback default
  }

  const isDawn = theme === 'dawn';
  const sizePx = typeof size === 'number' ? `${size}px` : size;

  // Horizon line color: explicit strokeColor prop OR bone (#EDE4D3) in dark/night OR dark (#0A0C16) in light/dawn
  const horizonColor = strokeColor || (isDawn ? '#0A0C16' : '#EDE4D3');
  const sunColor = isDawn ? '#C97B22' : '#E8A33D';

  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 transition-transform duration-300 ${className}`}
      aria-hidden="true"
    >
      {/* Rising Sun Disc */}
      <circle
        cx="60"
        cy="56"
        r="26"
        fill={sunColor}
      />
      {/* Horizon Line */}
      <line
        x1="14"
        y1="74"
        x2="106"
        y2="74"
        stroke={horizonColor}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default SunDisc;
