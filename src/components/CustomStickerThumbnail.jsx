import React from 'react';

export function CustomStickerThumbnail({ item, size = 'normal' }) {
  if (!item) return null;

  const cDetails = item.customDetails || item.customConfig || {};
  const customText = cDetails.customText || (typeof item.nameAr === 'string' && item.nameAr.includes('"') ? item.nameAr.split('"')[1] : null);
  const image = item.image || item.designSnapshot;

  // If we have an uploaded image or generated snapshot image, use it!
  const isDataOrRealImage = image && (image.startsWith('data:image') || image.startsWith('http')) && !image.includes('born_at_dawn');

  if (isDataOrRealImage && cDetails.mode !== 'text') {
    return (
      <img
        src={image}
        alt={item.nameAr || item.nameEn || 'Sticker'}
        className="w-full h-full object-contain"
      />
    );
  }

  // If text sticker or fallback: Render interactive 3D text sticker dome
  const text = customText || 'دوات';
  const textColor = cDetails.textColor || '#E0A93B';
  const bgFinish = cDetails.bgFinish || 'obsidian';
  const cutShape = cDetails.cutShape || 'pill';

  const getBgStyle = () => {
    switch (bgFinish) {
      case 'clear':
        return 'bg-void/60 border-bone/40';
      case 'gold-foil':
        return 'bg-gradient-to-r from-amber-600 via-gold to-amber-600 border-gold';
      case 'ivory':
        return 'bg-[#EFEAE0] border-[#D8CFBC]';
      case 'amber':
        return 'bg-amber-600/30 border-amber-500';
      case 'obsidian':
      default:
        return 'bg-[#121214] border-gold/40';
    }
  };

  const getShapeStyle = () => {
    switch (cutShape) {
      case 'circle':
        return 'rounded-full w-12 h-12 p-1';
      case 'badge':
        return 'rounded-md px-2 py-1';
      case 'shield':
        return 'rounded-b-lg rounded-t-xs px-2 py-1';
      case 'pill':
      default:
        return 'rounded-full px-3 py-1';
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-1 bg-coal/90 rounded relative overflow-hidden select-none">
      {/* 3D Polyurethane Epoxy Dome Element */}
      <div
        className={`relative z-10 border shadow-lg flex items-center justify-center text-center max-w-full overflow-hidden ${getBgStyle()} ${getShapeStyle()}`}
        style={{
          boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.3)'
        }}
      >
        {/* Epoxy Sheen Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

        {/* Sticker Custom Text */}
        <span
          className="font-arabic font-bold text-[10px] sm:text-xs truncate relative z-10 drop-shadow-sm px-1"
          style={{ color: textColor }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}

export default CustomStickerThumbnail;
