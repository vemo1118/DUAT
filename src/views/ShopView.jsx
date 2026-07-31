import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, CASE_TYPES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../context/ProductsContext';
import { SunDisc } from '../components/SunDisc';
import { Search, SlidersHorizontal, Filter, X, ChevronRight, ChevronLeft } from 'lucide-react';

export const ShopView = ({ selectedCategory, setSelectedCategory, onSelectProduct }) => {
  const { products } = useProducts();
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';
  const isRtl = isAr;
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCaseType, setSelectedCaseType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter Logic
  let filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesCaseType = selectedCaseType === 'all' || product.caseTypeId === selectedCaseType;
    const matchesPrice = product.price <= maxPrice;
    
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      product.nameEn.toLowerCase().includes(query) ||
      product.nameAr.toLowerCase().includes(query) ||
      product.tagEn.toLowerCase().includes(query) ||
      product.tagAr.toLowerCase().includes(query);

    return matchesCategory && matchesCaseType && matchesPrice && matchesSearch;
  });

  // Sort Logic
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filteredProducts.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
  }

  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) + (selectedCaseType !== 'all' ? 1 : 0) + (maxPrice < 1000 ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCaseType('all');
    setMaxPrice(1000);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10 min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 font-mono text-xs text-ash uppercase tracking-wider">
        <Link to="/" className="hover:text-gold transition-colors">{isAr ? 'الرئيسية' : 'Home'}</Link>
        <ArrowIcon size={12} className="text-grave" />
        <span className="text-gold font-bold">{isAr ? 'المتجر' : 'Shop'}</span>
      </div>

      {/* Header & Title Area */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-grave pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.25em] text-ash">
            <SunDisc size={14} variant="gold" />
            <span>{t('shopEyebrow')}</span>
          </div>
          <h1 className="font-clash text-4xl sm:text-6xl uppercase text-bone tracking-tight">
            {t('shopTitle')}
          </h1>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <span className="font-mono text-xs text-ash uppercase">
            {filteredProducts.length} {isAr ? 'منتج متوفر' : 'products'}
          </span>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-stone border border-grave px-4 py-2 text-xs font-mono text-bone hover:border-gold min-h-[44px]"
          >
            <Filter size={16} className="text-gold" />
            <span>{isAr ? 'تصفية' : 'Filters'}</span>
            {activeFilterCount > 0 && (
              <span className="bg-gold text-void font-bold px-1.5 py-0.5 text-[10px] rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
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

      {/* Main Layout: Left Filter Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* DESKTOP FILTER SIDEBAR (LG+) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 bg-stone border border-grave p-6 card-depth-highlight sticky top-28">
          <div className="flex items-center justify-between border-b border-grave pb-4">
            <span className="font-mono text-xs font-bold text-bone uppercase tracking-widest flex items-center gap-2">
              <Filter size={14} className="text-gold" />
              <span>{isAr ? 'الفلاتر والتصفية' : 'FILTERS'}</span>
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="font-mono text-[10px] text-gold hover:underline uppercase"
              >
                {isAr ? 'إعادة ضبط' : 'Reset All'}
              </button>
            )}
          </div>

          {/* Live Search */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-ash uppercase tracking-widest block">
              {isAr ? 'البحث' : 'Search Collection'}
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-coal border border-grave text-bone pl-9 pr-3 py-2 text-xs font-mono focus:border-gold focus:outline-none min-h-[40px]"
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-3 pt-4 border-t border-grave">
            <label className="font-mono text-[10px] text-ash uppercase tracking-widest block">
              {isAr ? 'الأقسام' : 'Category'}
            </label>
            <div className="space-y-1.5 font-mono text-xs">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left rtl:text-right py-2 px-3 transition-colors flex justify-between items-center ${
                      active
                        ? 'bg-gold/15 text-gold font-bold border-l-2 border-gold'
                        : 'text-bone/80 hover:bg-coal hover:text-bone'
                    }`}
                  >
                    <span>
                      {cat.id === 'all' && t('allProducts')}
                      {cat.id === 'cases' && t('catCases')}
                      {cat.id === 'stickers' && t('catStickers')}
                      {cat.id === 'charms' && t('catCharms')}
                      {cat.id === 'accessories' && t('catAccessories')}
                    </span>
                    <span className="text-[10px] text-ash">
                      {cat.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === cat.id).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Case Armor Finish Filter */}
          <div className="space-y-3 pt-4 border-t border-grave">
            <label className="font-mono text-[10px] text-ash uppercase tracking-widest block">
              {isAr ? 'نوع الجراب والإنهاء' : 'Case Armor Finish'}
            </label>
            <div className="space-y-1 font-mono text-xs">
              <button
                onClick={() => setSelectedCaseType('all')}
                className={`w-full text-left rtl:text-right py-1.5 px-2 transition-colors ${
                  selectedCaseType === 'all' ? 'text-gold font-bold' : 'text-bone/70 hover:text-bone'
                }`}
              >
                {isAr ? 'جميع الإنهاءات' : 'All Finishes'}
              </button>
              {CASE_TYPES.map((type) => {
                const active = selectedCaseType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedCaseType(type.id)}
                    className={`w-full text-left rtl:text-right py-1.5 px-2 transition-colors flex items-center justify-between ${
                      active ? 'text-gold font-bold' : 'text-bone/70 hover:text-bone'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full border border-grave" style={{ backgroundColor: type.color }} />
                      <span>{isAr ? type.nameAr : type.nameEn}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-4 border-t border-grave">
            <div className="flex justify-between items-center font-mono text-[10px] text-ash uppercase tracking-widest">
              <span>{isAr ? 'أقصى سعر' : 'Max Price'}</span>
              <span className="text-gold font-bold">{maxPrice} EGP</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gold cursor-pointer"
            />
          </div>

        </aside>

        {/* RIGHT MAIN PRODUCT GRID (LG: COL 9) */}
        <main className="lg:col-span-9 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4 bg-stone border border-grave card-depth-highlight">
              <SunDisc size={48} variant="gold" className="opacity-40" />
              <p className="font-mono text-xs uppercase tracking-widest text-ash">
                {t('noProductsFound')}
              </p>
              <button
                onClick={resetFilters}
                className="btn-ghost py-2 px-6 text-xs font-mono"
              >
                {isAr ? 'إعادة إظهار كل المنتجات' : 'RESET FILTERS'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} onClick={() => onSelectProduct?.(product)}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </main>

      </div>

      {/* MOBILE DRAWER FILTERS MODAL */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div onClick={() => setMobileFiltersOpen(false)} className="absolute inset-0 bg-void/80 backdrop-blur-sm" />
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-xs bg-stone border-r border-grave p-6 space-y-6 overflow-y-auto text-bone">
              <div className="flex justify-between items-center border-b border-grave pb-4">
                <span className="font-mono text-sm font-bold uppercase tracking-widest">{isAr ? 'الفلاتر' : 'FILTERS'}</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-ash hover:text-bone min-h-[44px]">
                  <X size={18} />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-ash uppercase tracking-widest block">{isAr ? 'الأقسام' : 'Category'}</label>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setMobileFiltersOpen(false); }}
                    className={`w-full text-left py-2 px-3 font-mono text-xs border ${
                      selectedCategory === cat.id ? 'border-gold text-gold bg-gold/10' : 'border-grave text-bone'
                    }`}
                  >
                    {cat.id === 'all' && t('allProducts')}
                    {cat.id === 'cases' && t('catCases')}
                    {cat.id === 'stickers' && t('catStickers')}
                    {cat.id === 'charms' && t('catCharms')}
                    {cat.id === 'accessories' && t('catAccessories')}
                  </button>
                ))}
              </div>

              {/* Reset */}
              <button onClick={() => { resetFilters(); setMobileFiltersOpen(false); }} className="btn-ghost w-full py-3 text-xs">
                {isAr ? 'إعادة ضبط' : 'RESET ALL'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShopView;
