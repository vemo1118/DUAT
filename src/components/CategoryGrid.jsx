import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useCategoryBanners } from '../context/CategoryBannersContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const CategoryGrid = ({ onSelectCategory }) => {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const { categoryBanners } = useCategoryBanners();
  const isDawn = theme === 'dawn';

  const isAr = lang === 'ar';
  const isRtl = isAr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const navigate = useNavigate();

  const categories = categoryBanners.map((cat) => ({
    ...cat,
    image: cat.imageUrl || cat.image || 'https://res.cloudinary.com/ikim5u08/image/upload/v1785764123/B1_DarkNight_dzbmmn.jpg'
  }));

  const handleClick = (catId) => {
    if (onSelectCategory) onSelectCategory(catId);
    navigate('/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 reveal-fade-up">
      <div className="flex items-end justify-between border-b border-grave pb-6">
        <div>
          <span className="font-mono text-xs text-gold uppercase tracking-[0.25em] font-bold block">
            DUAT / COLLECTIONS
          </span>
          <h2 className="font-clash text-3xl sm:text-4xl text-bone uppercase font-bold mt-1">
            {isAr ? 'الأقسام الرئيسية' : 'BROWSE CATEGORIES'}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleClick(cat.id)}
            className="group relative h-80 sm:h-96 bg-stone border border-grave overflow-hidden cursor-pointer card-depth-highlight flex flex-col justify-between p-6 sm:p-8"
          >
            {/* Background Image / Render */}
            <div className="absolute inset-0 z-0">
              <img
                src={cat.image}
                alt={cat.nameEn}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 opacity-100"
              />
              <div
                className={`absolute bottom-0 left-0 right-0 h-3/5 ${
                  isDawn
                    ? 'bg-gradient-to-t from-[#FAF6F0] via-[#FAF6F0]/65 to-transparent'
                    : 'bg-gradient-to-t from-[#0A0C16] via-[#0A0C16]/65 to-transparent'
                } pointer-events-none`}
              />
            </div>

            {/* Top Badge */}
            <div className="relative z-10 flex justify-between items-start">
              <span className="font-mono text-xs text-gold font-bold bg-stone border border-grave px-3 py-1 shadow-md">
                {cat.badge}
              </span>
              <span className="font-mono text-[10px] text-ash uppercase tracking-widest bg-stone border border-grave px-2.5 py-1">
                DUAT CRAFT
              </span>
            </div>

            {/* Bottom Content Overlay */}
            <div className="relative z-10 space-y-2">
              <h3 className={`font-clash text-2xl sm:text-3xl ${isDawn ? 'text-[#0A0C16]' : 'text-[#EDE4D3]'} font-bold uppercase group-hover:text-gold transition-colors drop-shadow-md`}>
                {isAr ? cat.nameAr : cat.nameEn}
              </h3>
              <p className={`font-space text-xs sm:text-sm ${isDawn ? 'text-[#1C1814]' : 'text-[#EDE4D3]/90'} font-semibold drop-shadow-sm`}>
                {isAr ? cat.subtitleAr : cat.subtitleEn}
              </p>
              
              <div className="pt-2 flex items-center gap-2 font-mono text-xs font-bold text-gold group-hover:translate-x-2 transition-transform duration-300 drop-shadow">
                <span>EXPLORE</span>
                <ArrowIcon size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
