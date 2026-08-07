import React, { useState, useEffect } from 'react';

const STICKER_IMAGES = {
  'st-born-dawn': 'https://res.cloudinary.com/ikim5u08/image/upload/v1786029411/born_at_dawn_lrnbz6.jpg',
  'st-through-night': 'https://res.cloudinary.com/ikim5u08/image/upload/v1786029411/through_the_night_tuaiqp.jpg',
  'st-crescent': 'https://res.cloudinary.com/ikim5u08/image/upload/v1786029411/MOON_nogd7g.jpg',
  'st-starry': 'https://res.cloudinary.com/ikim5u08/image/upload/v1786029411/STARS_dky4yc.jpg',
  'st-sun': 'https://res.cloudinary.com/ikim5u08/image/upload/v1786029411/DUAT_SUN_mj2hid.jpg',
  'st-duat': 'https://res.cloudinary.com/ikim5u08/image/upload/v1786029411/DUAT_TEXT_net8dw.jpg'
};

const transparentCache = {};

function processTransparentImage(src, onComplete) {
  if (!src) return;
  if (transparentCache[src]) {
    onComplete(transparentCache[src]);
    return;
  }

  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = src;

  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Sample background color from top-left corner pixel
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance from corner background paper pixel
        const diff = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);

        // Alpha keying: transparent if close to off-white/grey paper background
        if (diff < 36 || (r > 200 && g > 195 && b > 185 && Math.abs(r - g) < 25)) {
          data[i + 3] = 0; // Transparent
        } else if (diff < 52) {
          data[i + 3] = Math.round(((diff - 36) / 16) * 255); // Smooth anti-aliased edge
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const transparentDataUrl = canvas.toDataURL('image/png');
      transparentCache[src] = transparentDataUrl;
      onComplete(transparentDataUrl);
    } catch (err) {
      transparentCache[src] = src;
      onComplete(src);
    }
  };

  img.onerror = () => {
    transparentCache[src] = src;
    onComplete(src);
  };
}

export const StickerIcon = ({ stickerId, image, imageUrl, size = 44, color, bgColor }) => {
  const rawSrc = image || imageUrl || STICKER_IMAGES[stickerId];
  const [processedSrc, setProcessedSrc] = useState(transparentCache[rawSrc] || null);

  useEffect(() => {
    if (!rawSrc) return;
    processTransparentImage(rawSrc, (cleanedUrl) => {
      setProcessedSrc(cleanedUrl);
    });
  }, [rawSrc]);

  if (rawSrc) {
    const displayUrl = processedSrc || rawSrc;
    const isCapsuleSlogan = stickerId === 'st-born-dawn' || stickerId === 'st-through-night';
    const isBrandPill = stickerId === 'st-duat';
    const isSquareDome = stickerId === 'st-crescent' || stickerId === 'st-starry' || stickerId === 'st-sun';

    let sizingStyle = { maxWidth: `${size}px`, maxHeight: `${size}px` };
    if (isCapsuleSlogan) {
      sizingStyle = { width: '125px', height: '40px', maxWidth: '125px', maxHeight: '40px' };
    } else if (isBrandPill) {
      sizingStyle = { width: '88px', height: '35px', maxWidth: '88px', maxHeight: '35px' };
    } else if (isSquareDome) {
      sizingStyle = { width: '46px', height: '46px', maxWidth: '46px', maxHeight: '46px' };
    }

    return (
      <div className="flex items-center justify-center relative select-none pointer-events-none p-0.5 shrink-0">
        <img
          src={displayUrl}
          alt="Sticker"
          style={sizingStyle}
          className="object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)] pointer-events-none select-none"
        />
      </div>
    );
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
