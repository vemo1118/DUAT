import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';

export const ProductRow = ({
  eyebrow = 'DUAT / DROPS',
  title = 'LATEST DROPS',
  products = [],
  viewAllPath = '/shop'
}) => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 reveal-fade-up">
      {/* Header with Title & Navigation Controls */}
      <div className="flex items-end justify-between border-b border-grave pb-4">
        <div>
          <span className="font-mono text-xs text-gold uppercase tracking-[0.25em] block">
            {eyebrow}
          </span>
          <h2 className="font-clash text-2xl sm:text-4xl text-bone uppercase mt-1">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to={viewAllPath}
            className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-ash hover:text-gold uppercase tracking-wider transition-colors"
          >
            <span>{isAr ? 'عرض الكل' : 'VIEW ALL'}</span>
            {isAr ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </Link>

          {/* Left / Right Scroll Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="p-2 bg-stone border border-grave text-bone hover:border-gold hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 bg-stone border border-grave text-bone hover:border-gold hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Carousel Container */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-6 overflow-x-auto scrollbar-none pb-4 pt-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-72 sm:w-80 flex-shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductRow;
