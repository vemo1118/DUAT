import React from 'react';
import { StickerIcon } from './StickerIcon';

const GENERATED_STICKER_PREFIXES = ['month-', 'year-', 'ar-letter-', 'en-letter-'];

export function resolveStickerRenderId(item) {
  if (!item) return null;

  const candidates = [
    item.stickerRenderId,
    item.sticker_render_id,
    item.id,
    item.productId,
    item.product_id,
    item.product?.stickerRenderId,
    item.product?.sticker_render_id,
    item.product?.id
  ];

  return candidates.find((candidate) => (
    typeof candidate === 'string' &&
    GENERATED_STICKER_PREFIXES.some((prefix) => candidate.startsWith(prefix))
  )) || null;
}

export function resolveStickerImage(item) {
  if (!item) return null;

  const candidates = [
    item.image,
    item.imageUrl,
    item.designSnapshot,
    item.images?.[0],
    item.product?.image,
    item.product?.imageUrl,
    item.product?.designSnapshot,
    item.product?.images?.[0]
  ];

  return candidates.find((candidate) => (
    typeof candidate === 'string' &&
    (candidate.startsWith('data:image') || candidate.startsWith('http://') || candidate.startsWith('https://'))
  )) || null;
}

export function CustomStickerThumbnail({ item, size = 'normal' }) {
  if (!item) return null;

  const cDetails = item.customDetails || item.customConfig || {};
  const customText = cDetails.customText || (typeof item.nameAr === 'string' && item.nameAr.includes('"') ? item.nameAr.split('"')[1] : null);
  const image = resolveStickerImage(item);
  const renderId = resolveStickerRenderId(item);
  const usesGeneratedStickerArtwork = Boolean(renderId);

  if (usesGeneratedStickerArtwork) {
    const previewSize = size === 'small' ? 38 : 48;
    return (
      <div className="w-full h-full flex items-center justify-center overflow-hidden select-none">
        <StickerIcon
          stickerId={renderId}
          size={previewSize}
          color="#182744"
          bgColor="#FFFFFF"
        />
      </div>
    );
  }

  // If we have an uploaded image or generated snapshot image, use it!
  const isDataOrRealImage = Boolean(image);

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

  const getFontClass = (fontId) => {
    switch (fontId) {
      case 'ruqaa': return 'font-arabic-ruqaa';
      case 'kufi': return 'font-arabic-kufi';
      case 'amiri': return 'font-arabic-amiri';
      case 'rakkas': return 'font-arabic-rakkas';
      case 'cairo': return 'font-arabic-cairo';
      case 'changa': return 'font-arabic-changa';
      case 'katibeh': return 'font-arabic-katibeh';
      case 'camel':
      default: return 'font-arabic-camel';
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
          className={`font-bold text-[10px] sm:text-xs truncate relative z-10 drop-shadow-sm px-1 ${getFontClass(cDetails.selectedFont)}`}
          style={{ color: textColor }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}

export default CustomStickerThumbnail;
