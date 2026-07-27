import React, { useState } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { SunDisc } from '../components/SunDisc';
import { Search, SlidersHorizontal } from 'lucide-react';

export const ShopView = ({ selectedCategory, setSelectedCategory, onSelectProduct }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Filter by category and search query
  let filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      product.nameEn.toLowerCase().includes(query) ||
      product.nameAr.toLowerCase().includes(query) ||
      product.tagEn.toLowerCase().includes(query) ||
      product.tagAr.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Sort logic
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filteredProducts.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-screen">
      
      {/* Shop Header */}
      <div className="space-y-4 border-b border-grave pb-8">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-ash">
          <SunDisc size={14} />
          <span>{t('shopEyebrow')}</span>
        </div>
        <h1 className="font-archivo text-5xl sm:text-6xl uppercase text-bone">
          {t('shopTitle')}
        </h1>
      </div>

      {/* Controls Bar: Category Filters + Live Search + Sort */}
      <div className="space-y-6">
        
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          
          {/* Category Swatches */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`font-mono text-xs uppercase tracking-widest px-4 py-3 transition-colors border whitespace-nowrap ${
                    isSelected
                      ? 'border-gold text-gold bg-gold/10 font-bold'
                      : 'border-grave text-bone/70 hover:border-gold hover:text-bone bg-coal'
                  }`}
                >
                  {cat.id === 'all' && t('allProducts')}
                  {cat.id === 'cases' && t('catCases')}
                  {cat.id === 'stickers' && t('catStickers')}
                  {cat.id === 'charms' && t('catCharms')}
                  {cat.id === 'accessories' && t('catAccessories')}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Input Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* Live Search */}
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-3.5 text-ash" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-coal border border-grave text-bone pl-10 pr-4 py-2.5 text-xs font-mono focus:border-gold focus:outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal size={16} className="text-ash flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-coal border border-grave text-bone px-3 py-2.5 text-xs font-mono focus:border-gold focus:outline-none cursor-pointer w-full"
              >
                <option value="featured">{t('sortFeatured')}</option>
                <option value="price-low">{t('sortPriceLow')}</option>
                <option value="price-high">{t('sortPriceHigh')}</option>
                <option value="name">{t('sortName')}</option>
              </select>
            </div>

          </div>

        </div>

      </div>

      {/* Product Grid: 4-up desktop, 2-up tablet, 1-up mobile */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-stone border border-grave">
          <SunDisc size={48} variant="eclipse" className="opacity-40" />
          <p className="font-mono text-xs uppercase tracking-widest text-ash">
            {t('noProductsFound')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} onClick={() => onSelectProduct?.(product)}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
