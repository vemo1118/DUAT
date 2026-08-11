import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../context/ProductsContext';
import { useStickersSettings } from '../context/StickersSettingsContext';
import { ProductCard } from '../components/ProductCard';
import { SunDisc } from '../components/SunDisc';
import { Search, Sparkles, SlidersHorizontal, ChevronRight, ChevronLeft, Palette, ArrowRight, ArrowLeft } from 'lucide-react';

export function StickersView() {
  const { products = [] } = useProducts();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const { heroSettings, promoSettings, gridSettings } = useStickersSettings();

  const isAr = lang === 'ar';
  const isRtl = isAr;
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;
  const CtaArrow = isRtl ? ArrowLeft : ArrowRight;

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'slogans', 'arabic', 'english', 'badges'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Filter individual stickers (exclude case bundles if any)
  const stickerProducts = products.filter((p) => p && p.category !== 'bundles' && !(p.id && p.id.startsWith('bundle-')));

  const filteredStickers = stickerProducts.filter((product) => {
    if (!product) return false;
    const isVisible = product.is_active !== false && product.isActive !== false;
    const pid = String(product.id || '');

    // Tab filter matching
    let matchesTab = true;
    if (activeTab === 'slogans') {
      matchesTab = product.category === 'stickers' || pid.startsWith('st-') || pid.startsWith('pack-');
    } else if (activeTab === 'arabic') {
      matchesTab = pid.startsWith('ar-letter-');
    } else if (activeTab === 'english') {
      matchesTab = pid.startsWith('en-letter-');
    } else if (activeTab === 'badges') {
      matchesTab = pid.startsWith('month-') || pid.startsWith('year-');
    }

    // Search query matching
    const query = (searchQuery || '').toLowerCase().trim();
    const matchesSearch =
      !query ||
      (product.nameEn && product.nameEn.toLowerCase().includes(query)) ||
      (product.nameAr && product.nameAr.toLowerCase().includes(query)) ||
      (product.tagEn && product.tagEn.toLowerCase().includes(query)) ||
      (product.tagAr && product.tagAr.toLowerCase().includes(query));

    return isVisible && matchesTab && matchesSearch;
  });

  // Sort logic
  if (sortBy === 'price-low') {
    filteredStickers.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === 'price-high') {
    filteredStickers.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortBy === 'name') {
    filteredStickers.sort((a, b) => (a.nameEn || '').localeCompare(b.nameEn || ''));
  }

  const tabs = [
    { id: 'all', label: isAr ? 'كل الاستيكرات' : 'All Stickers' },
    { id: 'slogans', label: isAr ? 'العبارات والموتيفات' : 'Slogans & Motifs' },
    { id: 'arabic', label: isAr ? 'حروف عربي' : 'Arabic Letters' },
    { id: 'english', label: isAr ? 'حروف إنجليزي' : 'English Letters' },
    { id: 'badges', label: isAr ? 'الشهور والسنوات' : 'Months & Years' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10 min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 font-mono text-xs text-ash uppercase tracking-wider">
        <Link to="/" className="hover:text-gold transition-colors">{isAr ? 'الرئيسية' : 'Home'}</Link>
        <ArrowIcon size={12} className="text-grave" />
        <span className="text-gold font-bold">{isAr ? 'الاستيكرات' : 'Stickers'}</span>
      </div>

      {/* Header & Title Area */}
      {heroSettings?.isActive !== false && (
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-grave p-6 sm:p-10 relative overflow-hidden rounded-sm">
          {heroSettings?.bgImage && (
            <picture className="absolute inset-0 w-full h-full pointer-events-none">
              {heroSettings?.mobileBgImage && (
                <source media="(max-width: 767px)" srcSet={heroSettings.mobileBgImage} />
              )}
              <img
                src={heroSettings.bgImage}
                alt="Stickers Header Background"
                className="w-full h-full object-cover opacity-30"
              />
            </picture>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-coal/80 via-coal/90 to-coal pointer-events-none" />
          <div className="space-y-2 relative z-10 max-w-3xl">
            {(heroSettings?.eyebrowAr || heroSettings?.eyebrowEn) && (
              <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.25em] text-gold font-bold">
                <SunDisc size={14} variant="gold" />
                <span>{isAr ? heroSettings.eyebrowAr : heroSettings.eyebrowEn}</span>
              </div>
            )}
            <h1 className="font-clash text-4xl sm:text-6xl uppercase text-bone tracking-tight">
              {isAr ? heroSettings?.titleAr : heroSettings?.titleEn}
            </h1>
            <p className="font-space text-sm text-bone/80 max-w-2xl leading-relaxed">
              {isAr ? heroSettings?.descAr : heroSettings?.descEn}
            </p>
          </div>

          {/* Count & Sort */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end relative z-10">
            <span className="font-mono text-xs text-ash uppercase">
              {filteredStickers.length} {isAr ? 'استيكر متوفر' : 'stickers'}
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-ash flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-coal border border-grave text-bone px-3 py-2 text-xs font-mono focus:border-gold focus:outline-none cursor-pointer min-h-[44px]"
              >
                <option value="featured">{t('sortFeatured')}</option>
                <option value="price-low">{t('sortPriceLow')}</option>
                <option value="price-high">{t('sortPriceHigh')}</option>
                <option value="name">{t('sortName')}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STICKER BUILDER PROMPT BANNER */}
      {promoSettings?.isActive !== false && (
        <div className="bg-coal border border-gold/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 card-depth-highlight">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold flex-shrink-0">
              <Palette size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-clash text-lg sm:text-xl uppercase text-gold font-bold">
                {isAr ? promoSettings?.titleAr : promoSettings?.titleEn}
              </h3>
              <p className="font-space text-xs text-bone/80">
                {isAr ? promoSettings?.descAr : promoSettings?.descEn}
              </p>
            </div>
          </div>

          <Link
            to={promoSettings?.buttonLink || '/sticker-builder'}
            className="btn-primary py-3 px-6 font-mono text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 whitespace-nowrap"
          >
            <span>{isAr ? promoSettings?.buttonTextAr : promoSettings?.buttonTextEn}</span>
            <CtaArrow size={14} />
          </Link>
        </div>
      )}

      {/* Search Bar & Sub-Category Tabs */}
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ash" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن اسم الاستيكر أو الحرف...' : 'Search stickers, letters, badges...'}
            className="w-full bg-coal border border-grave pl-10 pr-4 py-2.5 text-xs font-mono text-bone placeholder:text-ash focus:border-gold focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap min-h-[40px] rounded-xs border ${
                activeTab === tab.id
                  ? 'bg-gold text-void font-bold border-gold shadow-md'
                  : 'bg-stone text-bone border-grave hover:border-gold/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stickers Product Grid */}
      {filteredStickers.length === 0 ? (
        <div className="bg-stone border border-grave p-12 text-center space-y-4">
          <p className="font-space text-sm text-ash font-mono">
            {isAr ? gridSettings?.emptyMessageAr : gridSettings?.emptyMessageEn}
          </p>
          <button
            onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
            className="btn-secondary py-2.5 px-5 font-mono text-xs uppercase"
          >
            {isAr ? 'عرض الكل' : 'Clear Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredStickers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={() => navigate(`/product/${product.id}`)}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default StickersView;
