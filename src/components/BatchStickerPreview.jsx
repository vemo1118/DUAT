import React, { useId } from 'react';

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

// Outline follows the cut line visible on the Little Fawn artwork.
const fawnOutline = 'M 43,27 Q 51,17 66,25 C 113,48 133,88 151,145 Q 179,133 212,140 C 242,85 295,32 346,6 Q 373,-8 376,20 C 376,100 348,160 305,186 Q 331,214 332,235 Q 314,247 327,291 Q 337,302 355,290 C 403,271 455,279 488,293 C 547,295 593,322 619,361 C 646,391 660,434 659,473 Q 660,527 628,554 Q 605,582 572,600 Q 556,621 528,605 Q 503,591 479,606 Q 443,624 405,622 Q 382,643 343,640 Q 323,653 312,641 Q 276,653 255,637 Q 236,641 214,628 C 163,637 110,607 78,590 Q 54,574 41,529 Q 33,524 18,527 Q 0,522 5,505 C 48,467 65,424 82,373 Q 103,319 111,272 Q 105,253 96,223 C 38,209 19,180 26,129 Q 24,58 43,27 Z';

function FawnPreview({ src, alt }) {
  const clipId = useId();
  const glossId = useId();
  return (
    <svg viewBox="0 0 661 650" role={alt ? 'img' : undefined} aria-label={alt || undefined}
      aria-hidden={!alt} className="block w-[55%] drop-shadow-[0_5px_4px_rgba(23,21,34,0.25)]">
      <defs>
        <clipPath id={clipId}><path d={fawnOutline} /></clipPath>
        <linearGradient id={glossId} x2="0%" y2="100%">
          <stop stopColor="#fff" stopOpacity=".36" />
          <stop offset=".36" stopColor="#fff" stopOpacity="0" />
          <stop offset=".72" stopColor="#312635" stopOpacity="0" />
          <stop offset="1" stopColor="#312635" stopOpacity=".11" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <image href={src} width="661" height="650" />
        <path d={fawnOutline} fill={`url(#${glossId})`} stroke="#5a4b42" strokeOpacity=".16" strokeWidth="4" />
      </g>
    </svg>
  );
}

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
      {productId === 'st-fpb-fawn' ? <FawnPreview src={src} alt={alt} /> : (
      <div
        className="batch-sticker-dome relative isolate overflow-hidden"
        style={{ aspectRatio: ratio, width: `${size}%`, borderRadius: cornerRadius }}
      >
        <img src={src} alt={alt} loading="lazy" className="block h-full w-full object-fill" />
        <span aria-hidden="true" className="batch-sticker-gloss pointer-events-none absolute inset-0" />
      </div>
      )}
    </div>
  );
}
