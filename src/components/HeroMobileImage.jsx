import React from 'react';

export const EMPTY_HERO_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export function HeroMobileImage({ src, ratio, storefront = false }) {
  if (!src) return null;
  const tall = ratio === '5:4';
  return (
    <div
      className="relative isolate overflow-hidden rounded-md bg-coal"
      style={{ aspectRatio: tall ? '5 / 4' : '16 / 9' }}
    >
      {tall && (
        <div className="absolute -inset-6 -z-10 bg-cover bg-center blur-xl brightness-75"
          style={{ backgroundImage: `url(${JSON.stringify(src)})` }} aria-hidden="true" />
      )}
      <picture className="absolute inset-0 block">
        {storefront && <source media="(max-width: 767px)" srcSet={src} />}
        <img src={storefront ? EMPTY_HERO_IMAGE : src} alt="" className="h-full w-full object-contain" />
      </picture>
    </div>
  );
}
