import React from 'react';

export const SunDisc = ({ size = 28, className = '', variant = 'default' }) => {
  const getColors = () => {
    switch (variant) {
      case 'eclipse':
        return { sun: '#C97B22', line: '#0A0C16' };
      case 'rose':
        return { sun: '#E0917A', line: '#EDE4D3' };
      case 'dark':
        return { sun: '#E8A33D', line: '#0A0C16' };
      case 'gold':
      default:
        return { sun: '#E8A33D', line: '#EDE4D3' };
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
      {/* Sun Disc Rising */}
      <circle cx="50" cy="52" r="24" fill={colors.sun} />
      {/* Horizon Line */}
      <line
        x1="12"
        y1="70"
        x2="88"
        y2="70"
        stroke={colors.line}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
