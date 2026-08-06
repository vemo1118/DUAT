import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSocialGrid } from '../context/SocialGridContext';
import { ArrowUpRight } from 'lucide-react';

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
  const { settings, tiles } = useSocialGrid();
  const isAr = lang === 'ar';

  const activeTiles = Array.isArray(tiles)
    ? tiles.filter((t) => t && t.is_active !== false && t.isActive !== false)
    : [];

  const eyebrow = settings?.eyebrow || 'DUAT / SOCIALS';
  const title = isAr ? settings?.titleAr || 'تابع الرحلة على إنستجرام' : settings?.titleEn || 'FOLLOW THE PASSAGE';
  const handleLabel = settings?.handleLabel || '@WEARDUAT';
  const handleUrl = settings?.handleUrl || 'https://instagram.com/wearduat';

  if (activeTiles.length === 0) return null;

  return (
    <section className="w-full space-y-8 reveal-fade-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-grave pb-6">
        <div>
          <span className="font-mono text-xs text-gold uppercase tracking-[0.25em] block">
            {eyebrow}
          </span>
          <h2 className="font-clash text-2xl sm:text-4xl text-bone uppercase mt-1">
            {title}
          </h2>
        </div>

        <a
          href={handleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost flex items-center gap-2 text-xs py-3 px-6 min-h-[44px]"
        >
          <InstagramIcon size={16} className="text-gold" />
          <span>{handleLabel}</span>
          <ArrowUpRight size={14} />
        </a>
      </div>

      {/* Grid Visual Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {activeTiles.map((tile) => (
          <a
            key={tile.id}
            href={tile.linkUrl || handleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square bg-stone border border-grave overflow-hidden card-depth-highlight flex items-center justify-center p-4 rounded-lg"
          >
            <img
              src={tile.image || tile.imageUrl}
              alt={tile.title}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
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
