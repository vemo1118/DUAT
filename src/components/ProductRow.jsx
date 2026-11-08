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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-8 reveal-fade-up">
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
            className="flex items-center gap-1.5 font-mono text-xs text-ash hover:text-gold uppercase tracking-wider transition-colors"
          >
            <span>{isAr ? 'عرض الكل' : 'VIEW ALL'}</span>
            {isAr ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </Link>

          {/* Left / Right Scroll Buttons */}
          <div className="hidden sm:flex items-center gap-1">
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
        className="grid grid-cols-2 items-stretch gap-3 pb-4 pt-1 sm:flex sm:gap-6 sm:overflow-x-auto sm:snap-x sm:snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-0 [&>*]:h-full sm:w-80 sm:shrink-0 sm:snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductRow;
