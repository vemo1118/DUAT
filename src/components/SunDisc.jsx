import React from 'react';

export const SunDisc = ({ size = 20, variant = 'gold', className = '' }) => {
  const goldColor = '#E0A93B';
  const sizePx = typeof size === 'number' ? `${size}px` : size;

  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 transition-transform duration-300 ${className}`}
      aria-hidden="true"
    >
      {/* Outer Golden Geometric Ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke={goldColor}
        strokeWidth="7"
        strokeOpacity="0.9"
      />
      {/* Solid Inner Gold Disc with Partial Eclipse Cutout */}
      <circle
        cx="50"
        cy="50"
        r="26"
        fill={goldColor}
      />
      {/* Subtle Partial Eclipse Shadow Arc */}
      <path
        d="M50 24 A26 26 0 0 1 76 50 A26 26 0 0 0 50 24 Z"
        fill="#050505"
        fillOpacity="0.25"
      />
    </svg>
  );
};

export default SunDisc;
