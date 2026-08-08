export const CATEGORIES = [
  { id: 'all', key: 'all' },
  { id: 'cases', key: 'cases', num: '01' },
  { id: 'stickers', key: 'stickers', num: '02' },
  { id: 'charms', key: 'charms', num: '03' },
  { id: 'accessories', key: 'accessories', num: '04' }
];

export const PRODUCTS = [
  // 1. CASES & BUNDLES (category "cases", listed FIRST)
  {
    id: 'bundle-clear',
    category: 'cases',
    nameEn: 'Clear Bundle',
    nameAr: 'بندل شفاف',
    price: 620,
    tagEn: 'Clear Case + 6 DUAT Stickers Applied',
    tagAr: 'جراب شفاف + ٦ استيكرات دوات كاملة',
    craftTagEn: 'Hand-assembled in Egypt',
    craftTagAr: 'تجميع وتسطيح يدوي في مصر',
    descriptionEn: 'Crystal clear optical acrylic phone case complete with all 6 DUAT raised 3D epoxy slogan pills and motifs pre-applied.',
    descriptionAr: 'جراب أكريليك شفاف نقي مجهز ومزين مسبقاً بجميع ملصقات دوات الـ ٦ البارزة المجسمة.',
    specsEn: ['Base: Crystal Clear Optical Acrylic Case', 'Includes: All 6 3D Epoxy Domes Applied', 'Hand-finished in Egypt'],
    specsAr: ['الأساس: جراب أكريليك شفاف نقي مقاوم للاصفرار', 'يتضمن: جميع ملصقات دوات الـ ٦ مثبة يدوياً', 'تشطيب مصري يدوي فاخر'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785768478/B1_TB_w1zemr.jpg',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785768478/B1_TB_w1zemr.jpg'],
    caseTypeId: 'clear',
    is_active: true,
    reviewCount: 0,
    reviews: []
  },
  {
    id: 'bundle-bone',
    category: 'cases',
    nameEn: 'Bone Bundle',
    nameAr: 'بندل عاجي',
    price: 590,
    tagEn: 'Bone Case + 6 DUAT Stickers Applied',
    tagAr: 'جراب عاجي + ٦ استيكرات دوات كاملة',
    craftTagEn: 'Hand-assembled in Egypt',
    craftTagAr: 'تجميع وتسطيح يدوي في مصر',
    descriptionEn: 'Warm alabaster bone phone case complete with all 6 DUAT raised 3D epoxy slogan pills and motifs pre-applied.',
    descriptionAr: 'جراب عاجي دافئ مجهز ومزين مسبقاً بجميع ملصقات دوات الـ ٦ البارزة المجسمة.',
    specsEn: ['Base: Soft-touch Alabaster Bone Case', 'Includes: All 6 3D Epoxy Domes Applied', 'Hand-finished in Egypt'],
    specsAr: ['الأساس: جراب عاجي دافئ بملمس حريري', 'يتضمن: جميع ملصقات دوات الـ ٦ مثبة يدوياً', 'تشطيب مصري يدوي فاخر'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785764123/B1_Whit_rkck3n.jpg',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785764123/B1_Whit_rkck3n.jpg'],
    caseTypeId: 'bone',
    is_active: true,
    reviewCount: 0,
    reviews: []
  },
  {
    id: 'bundle-midnight',
    category: 'cases',
    nameEn: 'Midnight Bundle',
    nameAr: 'بندل كحلي',
    price: 590,
    tagEn: 'Midnight Case + 6 DUAT Stickers Applied',
    tagAr: 'جراب كحلي + ٦ استيكرات دوات كاملة',
    craftTagEn: 'Hand-assembled in Egypt',
    craftTagAr: 'تجميع وتسطيح يدوي في مصر',
    descriptionEn: 'Deep royal navy midnight phone case complete with all 6 DUAT raised 3D epoxy slogan pills and motifs pre-applied.',
    descriptionAr: 'جراب كحلي ملكي عميق مجهز ومزين مسبقاً بجميع ملصقات دوات الـ ٦ البارزة المجسمة.',
    specsEn: ['Base: Deep Royal Navy Midnight Case', 'Includes: All 6 3D Epoxy Domes Applied', 'Hand-finished in Egypt'],
    specsAr: ['الأساس: جراب كحلي ملكي عميق', 'يتضمن: جميع ملصقات دوات الـ ٦ مثبة يدوياً', 'تشطيب مصري يدوي فاخر'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785764123/B1_DarkNight_dzbmmn.jpg',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785764123/B1_DarkNight_dzbmmn.jpg'],
    caseTypeId: 'tide',
    is_active: true,
    reviewCount: 0,
    reviews: []
  },

  // 2. STICKERS (category "stickers", listed SECOND)
  {
    id: 'pack-passage',
    category: 'stickers',
    nameEn: 'The Passage Pack (6 stickers)',
    nameAr: 'باكدج العبور (٦ استيكرات)',
    price: 500,
    tagEn: 'Complete 6-Sticker Collector Set',
    tagAr: 'مجموعة العبور الكاملة (٦ استيكرات)',
    craftTagEn: 'Collector Box • Egypt Craft',
    craftTagAr: 'علبة العبور الخاصة • صنع في مصر',
    descriptionEn: 'The complete DUAT 6-sticker collector set featuring all raised 3D epoxy slogan pills and motifs.',
    descriptionAr: 'المجموعة الكاملة المكونة من ٦ ملصقات إيبوكسي مجسمة من دوات في علبة فاخرة.',
    specsEn: ['Includes: All 6 DUAT 3D Epoxy Stickers', 'Save 100 EGP vs Individual Purchase', 'Collector Gift Packaging Included'],
    specsAr: ['تتضمن: جميع ملصقات دوات الـ ٦ المجسمة', 'توفير ١٠٠ ج.م عن الشراء المنفرد', 'تأتي داخل علبة هدايا فاخرة'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785825222/SH1_ST_j1z2h3.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785825222/SH1_ST_j1z2h3.png'],
    is_active: true,
    reviewCount: 0,
    reviews: []
  },
  {
    id: 'st-born-dawn',
    category: 'stickers',
    nameEn: 'Born at Dawn',
    nameAr: 'طالع نور',
    price: 100,
    tagEn: '3D Epoxy Dome Slogan',
    tagAr: 'شعار إيبوكسي بارز',
    craftTagEn: 'Ships in 3–5 Days • Egypt Craft',
    craftTagAr: 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
    descriptionEn: 'Raised 3D polyurethane epoxy slogan sticker "Born at Dawn" with amber resin finish.',
    descriptionAr: 'ملصق إيبوكسي مجسم بارز عبارة "طالع نور" بتشطيب عنبري فاخر.',
    specsEn: ['Material: 3D Polyurethane Epoxy', 'Finish: Glossy Amber Resin', 'Adhesive: High-tack 3M', 'Waterproof & Scratch-resistant'],
    specsAr: ['المادة: إيبوكسي مجسم ثلاثي الأبعاد', 'التشطيب: صمغ عنبري لامع', 'اللاصق: 3M عالي الالتصاق', 'مقاوم للماء والخدش'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786036786/born_at_dawn_k5gb1v.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786036786/born_at_dawn_k5gb1v.png'],
    is_active: true,
    reviewCount: 0,
    reviews: []
  },
  {
    id: 'st-through-night',
    category: 'stickers',
    nameEn: 'Through the Night',
    nameAr: 'عدّي الليل',
    price: 100,
    tagEn: '3D Epoxy Dome Slogan',
    tagAr: 'شعار إيبوكسي بارز',
    craftTagEn: 'Ships in 3–5 Days • Egypt Craft',
    craftTagAr: 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
    descriptionEn: 'Deep navy blue raised 3D epoxy slogan sticker "Through the Night".',
    descriptionAr: 'ملصق إيبوكسي مجسم بارز باللون الكحلي العميق عبارة "عدّي الليل".',
    specsEn: ['Material: 3D Polyurethane Epoxy', 'Finish: Royal Navy Gloss', 'Adhesive: High-tack 3M', 'Waterproof & Scratch-resistant'],
    specsAr: ['المادة: إيبوكسي مجسم ثلاثي الأبعاد', 'التشطيب: كحلي ملكي لامع', 'اللاصق: 3M عالي الالتصاق', 'مقاوم للماء والخدش'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103661/through_the_night_squ9bn.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103661/through_the_night_squ9bn.png'],
    is_active: true,
    reviewCount: 0,
    reviews: []
  },
  {
    id: 'st-crescent',
    category: 'stickers',
    nameEn: 'Crescent Moon',
    nameAr: 'الهلال',
    price: 100,
    tagEn: '3D Epoxy Motif',
    tagAr: 'رمز إيبوكسي مجسم',
    craftTagEn: 'Ships in 3–5 Days • Egypt Craft',
    craftTagAr: 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
    descriptionEn: 'Raised 3D epoxy crescent moon dome motif in dark obsidian glaze.',
    descriptionAr: 'رمز الهلال الإيبوكسي المجسم بتشطيب أسود فحمي فاخر.',
    specsEn: ['Material: 3D Polyurethane Epoxy', 'Finish: Obsidian Crescent', 'Adhesive: High-tack 3M', 'Waterproof'],
    specsAr: ['المادة: إيبوكسي مجسم', 'التشطيب: هلال فحمي', 'اللاصق: 3M عالي الالتصاق', 'مقاوم للماء'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103660/MOON_qqyojj.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103660/MOON_qqyojj.png'],
    is_active: true,
    reviewCount: 0,
    reviews: []
  },
  {
    id: 'st-starry',
    category: 'stickers',
    nameEn: 'Starry Night',
    nameAr: 'سماء الليل',
    price: 100,
    tagEn: '3D Epoxy Dome',
    tagAr: 'قبة إيبوكسي نجوم',
    craftTagEn: 'Ships in 3–5 Days • Egypt Craft',
    craftTagAr: 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
    descriptionEn: 'Deep starry night blue 3D dome with subtle cosmic glitter depth.',
    descriptionAr: 'قبة إيبوكسي مجسمة بلون سماء الليل الكحلي المرصعة بالنجوم.',
    specsEn: ['Material: 3D Polyurethane Epoxy', 'Finish: Starry Night Glitter', 'Adhesive: High-tack 3M'],
    specsAr: ['المادة: إيبوكسي مجسم', 'التشطيب: بريق سماء الليل', 'اللاصق: 3M عالي الالتصاق'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103660/STARS_imo15w.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103660/STARS_imo15w.png'],
    is_active: true,
    reviewCount: 0,
    reviews: []
  },
  {
    id: 'st-sun',
    category: 'stickers',
    nameEn: 'DUAT Sun',
    nameAr: 'شمس دوات',
    price: 100,
    tagEn: '3D Sun Disc Dome',
    tagAr: 'قرص الشمس المجسم',
    craftTagEn: 'Ships in 3–5 Days • Egypt Craft',
    craftTagAr: 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
    descriptionEn: 'Square ivory dome with raised dawn gold sun disc emblem.',
    descriptionAr: 'قبة مربعة عاجية مزينة بشعار قرص الشمس الذهبي المجسم.',
    specsEn: ['Material: 3D Polyurethane Epoxy', 'Finish: Alabaster & Dawn Gold', 'Adhesive: High-tack 3M'],
    specsAr: ['المادة: إيبوكسي مجسم', 'التشطيب: عاجي وذهب الفجر', 'اللاصق: 3M عالي الالتصاق'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103675/DUAT_SUN_rqu7s4.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103675/DUAT_SUN_rqu7s4.png'],
    is_active: true,
    reviewCount: 0,
    reviews: []
  },
  {
    id: 'st-duat',
    category: 'stickers',
    nameEn: 'DUAT',
    nameAr: 'دوات',
    price: 100,
    tagEn: '3D Brand Pill',
    tagAr: 'شعار دوات الإيبوكسي',
    craftTagEn: 'Ships in 3–5 Days • Egypt Craft',
    craftTagAr: 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
    descriptionEn: 'Translucent smoked gray oval dome with engraved gold DUAT logotype.',
    descriptionAr: 'ملصق بيضاوي رمادي شفاف مزين بشعار دوات الذهبي المحفور.',
    specsEn: ['Material: 3D Polyurethane Epoxy', 'Finish: Smoked Glass & Gold', 'Adhesive: High-tack 3M'],
    specsAr: ['المادة: إيبوكسي مجسم', 'التشطيب: دخاني وذهب محفور', 'اللاصق: 3M عالي الالتصاق'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103674/DUAT_TEXT_zixxvh.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103674/DUAT_TEXT_zixxvh.png'],
    is_active: true,
    reviewCount: 0,
    reviews: []
  }
];

export const CASE_TYPES = [
  { id: 'clear', nameEn: 'Clear Acrylic Canvas', nameAr: 'شفاف أكرليك نقي', color: '#FAF9F6', bg: '#FAF9F6', ring: '#C0C0C0' },
  { id: 'frost', nameEn: 'Frost Iced White', nameAr: 'أبيض ثلجي مطفي', color: '#F4F5F7', bg: '#F4F5F7', ring: '#D8DCE3' },
  { id: 'matte-black', nameEn: 'Void Stealth Black', nameAr: 'أسود فحمي مطفي', color: '#121214', bg: '#121214', ring: '#333336' },
  { id: 'bone', nameEn: 'Bone Alabaster Cream', nameAr: 'عاجي ألباستر دافئ', color: '#EFEAE0', bg: '#EFEAE0', ring: '#D8CFBC' },
  { id: 'frosted-ember', nameEn: 'Frosted Crimson Ruby', nameAr: 'جمر نبيذي ضبابي', color: '#8B1E24', bg: '#8B1E24', ring: '#C93A43' },
  { id: 'tide', nameEn: 'Royal Deep Navy', nameAr: 'كحلي ملكي عميق', color: '#0F1C2E', bg: '#0F1C2E', ring: '#2A4365' },
  { id: 'sage', nameEn: 'Sage Muted Green', nameAr: 'أخضر مرامي مطفي', color: '#26382D', bg: '#26382D', ring: '#405B4A' },
  { id: 'rose', nameEn: 'Rose Quartz Frosted', nameAr: 'وردي كوارنز ضبابي', color: '#E8C5C8', bg: '#E8C5C8', ring: '#D49DA3' },
  { id: 'titanium', nameEn: 'Natural Titanium', nameAr: 'تيتانيوم طبيعي مصقول', color: '#9E9A93', bg: '#9E9A93', ring: '#BDBA8B' },
  { id: 'purple', nameEn: 'Imperial Purple', nameAr: 'بنفسجي ملكي فاخر', color: '#382049', bg: '#382049', ring: '#6B4086' },
  { id: 'desert', nameEn: 'Desert Gold Sand', nameAr: 'رمال الصحراء الذهبية', color: '#D6C0A0', bg: '#D6C0A0', ring: '#B89B70' },
  { id: 'gold-ring', nameEn: 'Gold Ring Armor (MagSafe)', nameAr: 'درع حلقة الذهب (ماج سيف)', color: '#E0A93B', bg: '#121214', ring: '#E0A93B' },
  { id: 'carbon', nameEn: 'Carbon Techwear', nameAr: 'كربون تكتيكي', color: '#1C1D21', bg: '#1C1D21', ring: '#444' }
];

export const PHONE_MODELS = [
  // 1. Custom User Input Option (DEFAULT FIRST OPTION)
  { id: 'other-custom', name: 'Other Device (Type model below 📱)', nameEn: 'Other Device (Type model below 📱)', nameAr: 'جهاز آخر (اكتب اسم موديلك بالأسفل 📱)', category: 'Other' },

  // Apple iPhones (Latest models up to iPhone 17 Pro Max)
  { id: 'ip17pro-max', name: 'iPhone 17 Pro Max', category: 'Apple' },
  { id: 'ip17pro', name: 'iPhone 17 Pro', category: 'Apple' },
  { id: 'ip17plus', name: 'iPhone 17 Plus', category: 'Apple' },
  { id: 'ip17', name: 'iPhone 17', category: 'Apple' },
  { id: 'ip16pro-max', name: 'iPhone 16 Pro Max', category: 'Apple' },
  { id: 'ip16pro', name: 'iPhone 16 Pro', category: 'Apple' },
  { id: 'ip16plus', name: 'iPhone 16 Plus', category: 'Apple' },
  { id: 'ip16', name: 'iPhone 16', category: 'Apple' },
  { id: 'ip15pro-max', name: 'iPhone 15 Pro Max', category: 'Apple' },
  { id: 'ip15pro', name: 'iPhone 15 Pro', category: 'Apple' },
  { id: 'ip15plus', name: 'iPhone 15 Plus', category: 'Apple' },
  { id: 'ip15', name: 'iPhone 15', category: 'Apple' },
  { id: 'ip14pro-max', name: 'iPhone 14 Pro Max', category: 'Apple' },
  { id: 'ip14pro', name: 'iPhone 14 Pro', category: 'Apple' },
  { id: 'ip14plus', name: 'iPhone 14 Plus', category: 'Apple' },
  { id: 'ip14', name: 'iPhone 14', category: 'Apple' },
  { id: 'ip13pro-max', name: 'iPhone 13 Pro Max', category: 'Apple' },
  { id: 'ip13pro', name: 'iPhone 13 Pro', category: 'Apple' },
  { id: 'ip13', name: 'iPhone 13', category: 'Apple' },
  { id: 'ip12pro-max', name: 'iPhone 12 Pro Max', category: 'Apple' },
  { id: 'ip12pro', name: 'iPhone 12 Pro', category: 'Apple' },
  { id: 'ip12', name: 'iPhone 12', category: 'Apple' },
  { id: 'ip11', name: 'iPhone 11', category: 'Apple' },

  // Samsung Galaxy
  { id: 's25ultra', name: 'Samsung Galaxy S25 Ultra', category: 'Samsung' },
  { id: 's25plus', name: 'Samsung Galaxy S25+', category: 'Samsung' },
  { id: 's25', name: 'Samsung Galaxy S25', category: 'Samsung' },
  { id: 's24ultra', name: 'Samsung Galaxy S24 Ultra', category: 'Samsung' },
  { id: 's24plus', name: 'Samsung Galaxy S24+', category: 'Samsung' },
  { id: 's24', name: 'Samsung Galaxy S24', category: 'Samsung' },
  { id: 's23ultra', name: 'Samsung Galaxy S23 Ultra', category: 'Samsung' },
  { id: 'zfold6', name: 'Samsung Galaxy Z Fold 6', category: 'Samsung' },
  { id: 'zflip6', name: 'Samsung Galaxy Z Flip 6', category: 'Samsung' },
  { id: 'a55', name: 'Samsung Galaxy A55 5G', category: 'Samsung' },

  // Xiaomi & Poco
  { id: 'pocox6pro', name: 'Poco X6 Pro 5G', category: 'Xiaomi' },
  { id: 'xiaomi14ultra', name: 'Xiaomi 14 Ultra', category: 'Xiaomi' },
  { id: 'xiaomi14', name: 'Xiaomi 14', category: 'Xiaomi' },
  { id: 'redminote13pro', name: 'Redmi Note 13 Pro+ 5G', category: 'Xiaomi' },

  // Honor, Huawei, Realme, OnePlus, Pixel
  { id: 'honormagic6', name: 'Honor Magic 6 Pro', category: 'Honor' },
  { id: 'realmegt6', name: 'Realme GT 6', category: 'Realme' },
  { id: 'oneplus12', name: 'OnePlus 12', category: 'OnePlus' },
  { id: 'pixel9pro', name: 'Google Pixel 9 Pro XL', category: 'Google' },
  { id: 'pixel8pro', name: 'Google Pixel 8 Pro', category: 'Google' }
];

const ARABIC_LETTERS = [
  'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'
];

export const ARABIC_LETTER_STICKERS = ARABIC_LETTERS.map((char) => ({
  id: `ar-letter-${char}`,
  nameEn: `Letter ${char}`,
  nameAr: `حرف ${char}`,
  tagEn: '3D EPOXY SQUARE LETTER',
  tagAr: 'حرف رقعة مجسم',
  category: 'letters'
}));

const ENGLISH_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

export const ENGLISH_LETTER_STICKERS = ENGLISH_LETTERS.map((char) => ({
  id: `en-letter-${char}`,
  nameEn: `Letter ${char}`,
  nameAr: `حرف ${char}`,
  tagEn: '3D EPOXY SERIF LETTER',
  tagAr: 'حرف إنجليزي بارز',
  category: 'letters-en'
}));

const GREGORIAN_YEARS = [
  { id: 'year-199x', nameEn: 'Made In 199x', nameAr: 'صنع في 199x' },
  { id: 'year-2000', nameEn: "2000's", nameAr: 'عام 2000' },
  { id: 'year-2001', nameEn: "2001's", nameAr: 'عام 2001' },
  { id: 'year-2002', nameEn: "2002's", nameAr: 'عام 2002' },
  { id: 'year-2003', nameEn: "2003's", nameAr: 'عام 2003' },
  { id: 'year-2004', nameEn: "2004's", nameAr: 'عام 2004' },
  { id: 'year-2005', nameEn: "2005's", nameAr: 'عام 2005' },
  { id: 'year-2006', nameEn: "2006's", nameAr: 'عام 2006' },
  { id: 'year-2007', nameEn: "2007's", nameAr: 'عام 2007' },
  { id: 'year-2008', nameEn: "2008's", nameAr: 'عام 2008' },
];

export const YEAR_STICKERS = GREGORIAN_YEARS.map((y) => ({
  id: y.id,
  nameEn: y.nameEn,
  nameAr: y.nameAr,
  tagEn: '3D YEAR BADGE',
  tagAr: 'شارة سنة ميلادية',
  category: 'years'
}));

const MONTHS_LIST = [
  { id: 'month-jan', nameEn: 'Made In January', nameAr: 'يناير', label: 'January' },
  { id: 'month-feb', nameEn: 'Made In February', nameAr: 'فبراير', label: 'February' },
  { id: 'month-mar', nameEn: 'Made In March', nameAr: 'مارس', label: 'March' },
  { id: 'month-apr', nameEn: 'Made In April', nameAr: 'أبريل', label: 'April' },
  { id: 'month-may', nameEn: 'Made In May', nameAr: 'مايو', label: 'May' },
  { id: 'month-jun', nameEn: 'Made In June', nameAr: 'يونيو', label: 'June' },
  { id: 'month-jul', nameEn: 'Made In July', nameAr: 'يوليو', label: 'July' },
  { id: 'month-aug', nameEn: 'Made In August', nameAr: 'أغسطس', label: 'August' },
  { id: 'month-sep', nameEn: 'Made In September', nameAr: 'سبتمبر', label: 'September' },
  { id: 'month-oct', nameEn: 'Made In October', nameAr: 'أكتوبر', label: 'October' },
  { id: 'month-nov', nameEn: 'Made In November', nameAr: 'نوفمبر', label: 'November' },
  { id: 'month-dec', nameEn: 'Made In December', nameAr: 'ديسمبر', label: 'December' },
];

export const MONTH_STICKERS = MONTHS_LIST.map((m) => ({
  id: m.id,
  nameEn: m.nameEn,
  nameAr: m.nameAr,
  tagEn: '3D MONTH BADGE',
  tagAr: 'شارة شهر الميلاد',
  category: 'months'
}));

export const STICKER_PRESETS = [
  { id: 'st-born-dawn',    nameEn: 'Born at Dawn',    nameAr: 'طالع نور',    tagEn: '3D EPOXY DOME SLOGAN', tagAr: 'شعار إيبوكسي بارز', category: 'quotes-ar', image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786036786/born_at_dawn_k5gb1v.png' },
  { id: 'st-through-night',nameEn: 'Through the Night',nameAr: 'عدّي الليل', tagEn: '3D EPOXY DOME SLOGAN', tagAr: 'شعار إيبوكسي بارز', category: 'quotes-ar', image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103661/through_the_night_squ9bn.png' },
  { id: 'st-crescent',     nameEn: 'Crescent Moon',   nameAr: 'الهلال',      tagEn: '3D EPOXY MOTIF',      tagAr: 'رمز إيبوكسي مجسم',  category: 'motifs',  image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103660/MOON_qqyojj.png' },
  { id: 'st-starry',       nameEn: 'Starry Night',    nameAr: 'سماء الليل',  tagEn: '3D EPOXY DOME',       tagAr: 'قبة إيبوكسي نجوم',  category: 'motifs',  image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103660/STARS_imo15w.png' },
  { id: 'st-sun',          nameEn: 'DUAT Sun',        nameAr: 'شمس دوات',    tagEn: '3D SUN DISC DOME',    tagAr: 'قرص الشمس المجسم',  category: 'motifs',  image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103675/DUAT_SUN_rqu7s4.png' },
  { id: 'st-duat',         nameEn: 'DUAT',            nameAr: 'دوات',        tagEn: '3D BRAND PILL',       tagAr: 'شعار دوات الإيبوكسي',category: 'quotes-en', image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103674/DUAT_TEXT_zixxvh.png' },
  ...ARABIC_LETTER_STICKERS,
  ...ENGLISH_LETTER_STICKERS,
  ...YEAR_STICKERS,
  ...MONTH_STICKERS
];

export const PRESET_TEMPLATES = [
  {
    id: 'preset-passage-full',
    nameEn: 'The Passage Collection (All 6 Domes)',
    nameAr: 'مجموعة العبور الكاملة (٦ استيكرات)',
    caseTypeId: 'clear',
    layers: [
      { id: 'p1', type: 'sticker', stickerId: 'st-born-dawn', x: 50, y: 22, scale: 1.0, rotation: 0 },
      { id: 'p2', type: 'sticker', stickerId: 'st-through-night', x: 50, y: 38, scale: 1.0, rotation: 0 },
      { id: 'p3', type: 'sticker', stickerId: 'st-crescent', x: 72, y: 54, scale: 1.0, rotation: 0 },
      { id: 'p4', type: 'sticker', stickerId: 'st-starry', x: 28, y: 54, scale: 1.0, rotation: 0 },
      { id: 'p5', type: 'sticker', stickerId: 'st-sun', x: 50, y: 70, scale: 1.0, rotation: 0 },
      { id: 'p6', type: 'sticker', stickerId: 'st-duat', x: 50, y: 84, scale: 0.9, rotation: 0 }
    ]
  },
  {
    id: 'preset-dawn-duo',
    nameEn: 'Born at Dawn & Crescent Duo',
    nameAr: 'طالع نور + الهلال',
    caseTypeId: 'bone',
    layers: [
      { id: 'p1', type: 'sticker', stickerId: 'st-born-dawn', x: 50, y: 40, scale: 1.1, rotation: 0 },
      { id: 'p2', type: 'sticker', stickerId: 'st-crescent', x: 50, y: 62, scale: 1.1, rotation: 0 }
    ]
  },
  {
    id: 'preset-night-duo',
    nameEn: 'Through the Night & Starry Duo',
    nameAr: 'عدّي الليل + سماء الليل',
    caseTypeId: 'midnight',
    layers: [
      { id: 'p1', type: 'sticker', stickerId: 'st-through-night', x: 50, y: 40, scale: 1.1, rotation: 0 },
      { id: 'p2', type: 'sticker', stickerId: 'st-starry', x: 50, y: 62, scale: 1.1, rotation: 0 }
    ]
  }
];

export const REVIEWS = [];

export const FAQS = [
  {
    id: 'faq-1',
    questionEn: 'How are DUAT cases made?',
    questionAr: 'كيف يتم تصنيع جرابات دوات؟',
    answerEn: 'Each case is made to order in Egypt using optical grade acrylic and raised polyurethane 3D epoxy domes.',
    answerAr: 'يتم تصنيع كل جراب حسب الطلب في مصر باستخدام أكريليك بصري وملصقات إيبوكسي مجسمة ثلاثية الأبعاد.'
  },
  {
    id: 'faq-2',
    questionEn: 'What is your return policy?',
    questionAr: 'ما هي سياسة الإرجاع؟',
    answerEn: 'We offer 14-day hassle-free returns across all Egyptian governorates.',
    answerAr: 'نقدم إمكانية الإرجاع بسهولة خلال ١٤ يوماً لكافة المحافظات.'
  }
];

export const GOVERNORATES = [
  // Zone 1 — 110 EGP
  { id: 'cairo', nameEn: 'Cairo', nameAr: 'القاهرة', fee: 110 },
  { id: 'giza', nameEn: 'Giza', nameAr: 'الجيزة', fee: 110 },
  { id: 'qalyubia', nameEn: 'Qalyubia', nameAr: 'القليوبية', fee: 110 },

  // Zone 2 — 125 EGP
  { id: 'alexandria', nameEn: 'Alexandria', nameAr: 'الإسكندرية', fee: 125 },
  { id: 'beheira', nameEn: 'Beheira', nameAr: 'البحيرة', fee: 125 },
  { id: 'gharbia', nameEn: 'Gharbia', nameAr: 'الغربية', fee: 125 },
  { id: 'monufia', nameEn: 'Monufia', nameAr: 'المنوفية', fee: 125 },
  { id: 'dakahlia', nameEn: 'Dakahlia', nameAr: 'الدقهلية', fee: 125 },
  { id: 'kafr-el-sheikh', nameEn: 'Kafr El Sheikh', nameAr: 'كفر الشيخ', fee: 125 },
  { id: 'damietta', nameEn: 'Damietta', nameAr: 'دمياط', fee: 125 },
  { id: 'sharqia', nameEn: 'Sharqia', nameAr: 'الشرقية', fee: 125 },
  { id: 'port-said', nameEn: 'Port Said', nameAr: 'بورسعيد', fee: 125 },
  { id: 'ismailia', nameEn: 'Ismailia', nameAr: 'الإسماعيلية', fee: 125 },
  { id: 'suez', nameEn: 'Suez', nameAr: 'السويس', fee: 125 },

  // Zone 3 — 155 EGP
  { id: 'beni-suef', nameEn: 'Beni Suef', nameAr: 'بني سويف', fee: 155 },
  { id: 'faiyum', nameEn: 'Faiyum', nameAr: 'الفيوم', fee: 155 },
  { id: 'minya', nameEn: 'Minya', nameAr: 'المنيا', fee: 155 },
  { id: 'asyut', nameEn: 'Asyut', nameAr: 'أسيوط', fee: 155 },
  { id: 'sohag', nameEn: 'Sohag', nameAr: 'سوهاج', fee: 155 },
  { id: 'qena', nameEn: 'Qena', nameAr: 'قنا', fee: 155 },
  { id: 'luxor', nameEn: 'Luxor', nameAr: 'الأقصر', fee: 155 },
  { id: 'aswan', nameEn: 'Aswan', nameAr: 'أسوان', fee: 155 },
  { id: 'red-sea', nameEn: 'Red Sea', nameAr: 'البحر الأحمر', fee: 155 },
  { id: 'matrouh', nameEn: 'Matrouh', nameAr: 'مطروح', fee: 155 },

  // Zone 4 — 185 EGP
  { id: 'north-sinai', nameEn: 'North Sinai', nameAr: 'شمال سيناء', fee: 185 },
  { id: 'south-sinai', nameEn: 'South Sinai', nameAr: 'جنوب سيناء', fee: 185 },
  { id: 'new-valley', nameEn: 'New Valley', nameAr: 'الوادي الجديد', fee: 185 }
];
