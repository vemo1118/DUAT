import React from 'react';

const STICKER_IMAGES = {
  'st-born-dawn': 'https://res.cloudinary.com/ikim5u08/image/upload/v1786029411/born_at_dawn_lrnbz6.jpg',
  'st-through-night': 'https://res.cloudinary.com/ikim5u08/image/upload/v1786029411/through_the_night_tuaiqp.jpg',
  'st-crescent': 'https://res.cloudinary.com/ikim5u08/image/upload/v1786029411/MOON_nogd7g.jpg',
  'st-starry': 'https://res.cloudinary.com/ikim5u08/image/upload/v1786029411/STARS_dky4yc.jpg',
  'st-sun': 'https://res.cloudinary.com/ikim5u08/image/upload/v1786029411/DUAT_SUN_mj2hid.jpg',
  'st-duat': 'https://res.cloudinary.com/ikim5u08/image/upload/v1786029411/DUAT_TEXT_net8dw.jpg'
};

export const StickerIcon = ({ stickerId, image, imageUrl, size = 44, color, bgColor }) => {
  const customImg = image || imageUrl || STICKER_IMAGES[stickerId];

  if (customImg) {
    const isCapsuleSlogan = stickerId === 'st-born-dawn' || stickerId === 'st-through-night';
    const isBrandPill = stickerId === 'st-duat';
    const isSquareDome = stickerId === 'st-crescent' || stickerId === 'st-starry' || stickerId === 'st-sun';

    let containerStyle = { width: `${size}px`, height: `${size}px`, borderRadius: '12px' };
    let imgScaleClass = 'scale-[2.2]';

    if (isCapsuleSlogan) {
      containerStyle = { width: '120px', height: '38px', borderRadius: '9999px' };
      imgScaleClass = 'scale-[2.3]';
    } else if (isBrandPill) {
      containerStyle = { width: '84px', height: '34px', borderRadius: '9999px' };
      imgScaleClass = 'scale-[2.3]';
    } else if (isSquareDome) {
      containerStyle = { width: '44px', height: '44px', borderRadius: '12px' };
      imgScaleClass = 'scale-[2.3]';
    }

    return (
      <div
        style={containerStyle}
        className="relative overflow-hidden flex items-center justify-center select-none shadow-[0_6px_16px_rgba(0,0,0,0.55)] shrink-0 pointer-events-none"
      >
        <img
          src={customImg}
          alt="Sticker"
          className={`w-full h-full object-cover ${imgScaleClass} object-center pointer-events-none select-none`}
        />
      </div>
    );
  }

  const strokeColor = color || '#E0A93B';
  const fillColor = color || '#E0A93B';

  // Dynamic prefix matching for Arabic Letters, English Letters, Numbers/Years, and Quotes
  if (typeof stickerId === 'string') {
    if (stickerId.startsWith('ar-letter-')) {
      const char = stickerId.replace('ar-letter-', '');
      return (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            color: color || '#E8A33D',
            backgroundColor: bgColor === 'transparent' ? 'transparent' : (bgColor || '#14110F'),
            borderColor: color || '#E8A33D'
          }}
          className="rounded-full border-2 flex items-center justify-center shadow-lg relative overflow-hidden select-none"
        >
          <div className="absolute top-1 left-1.5 w-1/3 h-1/3 bg-white/20 rounded-full blur-[1px] pointer-events-none" />
          <span style={{ color: color || '#E8A33D' }} className="font-kufi font-bold text-lg leading-none transform translate-y-[-1px]">
            {char}
          </span>
        </div>
      );
    }

    if (stickerId.startsWith('en-letter-')) {
      const char = stickerId.replace('en-letter-', '');
      return (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            color: color || '#E8A33D',
            backgroundColor: bgColor === 'transparent' ? 'transparent' : (bgColor || '#14110F'),
            borderColor: color || '#E8A33D'
          }}
          className="rounded-full border-2 flex items-center justify-center shadow-lg relative overflow-hidden select-none"
        >
          <div className="absolute top-1 left-1.5 w-1/3 h-1/3 bg-white/20 rounded-full blur-[1px] pointer-events-none" />
          <span style={{ color: color || '#E8A33D' }} className="font-mono font-bold text-base leading-none">
            {char}
          </span>
        </div>
      );
    }
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: bgColor || '#E8A33D'
      }}
      className="rounded-full shadow flex items-center justify-center"
    >
      <span className="font-mono text-xs font-bold text-void">DU</span>
    </div>
  );
};
