import React from 'react';

// Physical dimensions and corner radii from the first batch placement manifest.
const silhouettes = {
  'st-fpb-cassette': [25, 15.96, 3.99],
  'st-fpb-cinema-ticket': [25, 13.56, 3.39],
  'st-fpb-fawn': [25, 24.57, 5],
  'st-fpb-spring-tulips': [25, 14.44, 3.61],
  'st-fpb-white-swan': [22.867, 25, 5],
  'st-fpb-daisy': [25, 24.317, 5],
  'st-fpb-august': [45, 14.06, 3.515],
  'st-fpb-wa-ma-nayl': [45, 19, 4.75],
  'st-fpb-la-ajiduni': [24, 17, 4.25],
  'st-fpb-coffee-cup': [24, 24, 5],
  'st-fpb-just-like-a-dream': [55, 10, 5],
  'st-fpb-adhba-anti': [42, 14, 3.5],
  'st-fpb-pink-meem': [32, 32, 5],
  'st-fpb-ginger-kitten': [35, 35, 5],
  'st-fpb-pink-tulips': [24, 36, 5],
};

export function hasBatchStickerPreview(productId) {
  return Object.hasOwn(silhouettes, productId);
}

export function BatchStickerPreview({ productId, src, alt, className = '' }) {
  const [width, height, radius] = silhouettes[productId];
  const ratio = width / height;
  const size = ratio > 1.35 ? 76 : ratio < 0.8 ? 48 : 55;
  const cornerRadius = `${100 * radius / width}% / ${100 * radius / height}%`;

  return (
    <div className={`batch-sticker-stage grid w-full place-items-center ${className}`}>
      <div
        className="batch-sticker-dome relative isolate overflow-hidden"
        style={{ aspectRatio: ratio, width: `${size}%`, borderRadius: cornerRadius }}
      >
        <img src={src} alt={alt} loading="lazy" className="block h-full w-full object-fill" />
        <span aria-hidden="true" className="batch-sticker-gloss pointer-events-none absolute inset-0" />
      </div>
    </div>
  );
}
