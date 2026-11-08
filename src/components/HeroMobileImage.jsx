import React from 'react';

export const EMPTY_HERO_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export function HeroMobileImage({ src, storefront = false }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-coal" data-mobile-hero-frame>
      {src && (
        <picture className="absolute inset-0 block">
          {storefront && <source media="(max-width: 767px)" srcSet={src} />}
          <img src={storefront ? EMPTY_HERO_IMAGE : src} alt="" className="h-full w-full object-contain" />
        </picture>
      )}
    </div>
  );
}
