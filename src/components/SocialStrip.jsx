import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowUpRight, Share2 } from 'lucide-react';

const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const SocialStrip = () => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const tiles = [
    { id: 1, image: '/images/transparent_hero_case.png', title: 'PASSAGE CASE' },
    { id: 2, image: '/images/stickers.png', title: '3D DOME PILLS' },
    { id: 3, image: '/images/charms.png', title: 'GOLD RING CHARM' },
    { id: 4, image: '/images/transparent_hero_case.png', title: 'DAWN EDITION' },
    { id: 5, image: '/images/stickers.png', title: 'TALE3 NOOR' },
    { id: 6, image: '/images/charms.png', title: 'EMBER BEAD' }
  ];

  return (
    <section className="w-full space-y-8 reveal-fade-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-grave pb-6">
        <div>
          <span className="font-mono text-xs text-gold uppercase tracking-[0.25em] block">
            DUAT / SOCIALS
          </span>
          <h2 className="font-clash text-2xl sm:text-4xl text-bone uppercase mt-1">
            {isAr ? 'تابع الرحلة على إنستجرام' : 'FOLLOW THE PASSAGE'}
          </h2>
        </div>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost flex items-center gap-2 text-xs py-3 px-6"
        >
          <InstagramIcon size={16} className="text-gold" />
          <span>@WEARDUAT</span>
          <ArrowUpRight size={14} />
        </a>
      </div>

      {/* 6 Grid Visual Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {tiles.map((tile) => (
          <a
            key={tile.id}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square bg-stone border border-grave overflow-hidden card-depth-highlight flex items-center justify-center p-4"
          >
            <img
              src={tile.image}
              alt={tile.title}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-void/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2 text-center">
              <InstagramIcon size={24} className="text-gold mb-2" />
              <span className="font-mono text-[9px] text-bone font-bold tracking-widest uppercase">
                {tile.title}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default SocialStrip;
