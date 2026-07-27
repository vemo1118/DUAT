import React from 'react';

export const SunDisc = ({ size = 24, className = '', variant = 'default' }) => {
  const getColors = () => {
    switch (variant) {
      case 'eclipse':
        return { stroke: '#E8B04B', fill: '#050505', ring: '#2A2523' };
      case 'ember':
        return { stroke: '#E5493A', fill: '#E5493A', ring: '#2A2523' };
      case 'gold':
      default:
        return { stroke: '#E8B04B', fill: '#E8B04B', ring: '#2A2523' };
    }
  };

  const colors = getColors();

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
        stroke={colors.stroke}
        strokeWidth="6"
      />
      {/* Inner Solid Disc (or Eclipse offset) */}
      {variant === 'eclipse' ? (
        <>
          <circle cx="50" cy="50" r="28" fill="#E8B04B" />
          <circle cx="62" cy="46" r="24" fill="#050505" />
        </>
      ) : (
        <circle cx="50" cy="50" r="26" fill={colors.fill} />
      )}
    </svg>
  );
};
