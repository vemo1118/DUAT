import React from 'react';

export const SunDisc = ({ size = 20, className = '', variant = 'gold' }) => {
  const strokeColor = variant === 'ember' ? '#D9432E' : '#E0A93B';
  const fillColor = variant === 'ember' ? '#D9432E' : '#E0A93B';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Outer Stroke Ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke={strokeColor}
        strokeWidth="7"
      />
      {/* Inner Solid Disc */}
      <circle
        cx="50"
        cy="50"
        r="24"
        fill={fillColor}
      />
    </svg>
  );
};
