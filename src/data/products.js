export const CATEGORIES = [
  { id: 'all', key: 'all' },
  { id: 'bundles', key: 'bundles', num: '01' },
  { id: 'stickers', key: 'stickers', num: '02' },
  { id: 'letters', key: 'letters', num: '03' },
  { id: 'badges', key: 'badges', num: '04' }
];

export const PRODUCTS = [
  // 1. STICKER BUNDLES (category "bundles", listed FIRST)
  {
    id: 'bundle-passage-6pack',
    category: 'bundles',
    nameEn: 'The Passage Pack (6 Stickers)',
    nameAr: 'باكدج العبور الكاملة (٦ استيكرات)',
    price: 450,
    originalPrice: 600,
    savings: 150,
    tagEn: 'Bundle Discount • Save 150 EGP',
    tagAr: 'خصم البندل • توفير ١٥٠ ج.م',
    craftTagEn: 'Collector Box • Egypt Craft',
    craftTagAr: 'علبة هدايا خاصة • صنع في مصر',
    descriptionEn: 'The complete DUAT 6-sticker collector set featuring all raised 3D slogan pills and motifs in a premium gift box at a discounted bundle price.',
    descriptionAr: 'المجموعة الكاملة المكونة من ٦ ملصقات بارزة مجسمة من دوات في علبة فاخرة بسعر بندل موفر جداً عن الشراء المنفرد.',
    specsEn: ['Includes: All 6 DUAT Raised 3D Stickers', 'Save 150 EGP vs Individual Purchase', 'Collector Gift Packaging Included'],
    specsAr: ['تتضمن: جميع ملصقات دوات الـ ٦ المجسمة', 'توفير ١٥٠ ج.م عن الشراء المنفرد', 'تأتي داخل علبة هدايا فاخرة'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785825222/SH1_ST_j1z2h3.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785825222/SH1_ST_j1z2h3.png'],
    is_active: true,
    reviewCount: 12,
    reviews: []
  },
  {
    id: 'bundle-trio-3pack',
    category: 'bundles',
    nameEn: 'Passage Trio (3 Slogan Stickers)',
    nameAr: 'ثلاثية العبور (٣ استيكرات عبارات)',
    price: 250,
    originalPrice: 300,
    savings: 50,
    tagEn: 'Save 50 EGP • Any 3 Slogans',
    tagAr: 'توفير ٥٠ ج.م • اختر ٣ استيكرات',
    craftTagEn: 'Raised 3D Finish • Egypt Craft',
    craftTagAr: 'مجسم بارز • صنع في مصر',
    descriptionEn: 'Select any 3 DUAT slogan raised stickers of your choice in a bundled discount set.',
    descriptionAr: 'تجميعة من ٣ ملصقات بارزة مجسمة من عبارات دوات من اختيارك بسعر موفر.',
    specsEn: ['Includes: 3 Slogan Premium Domes', 'Save 50 EGP vs Individual Price', 'Hand-finished in Egypt'],
    specsAr: ['تتضمن: ٣ استيكرات عبارات بارزة مجسمة', 'توفير ٥٠ ج.م عن السعر المنفرد', 'تشطيب مصري يدوي'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786036786/born_at_dawn_k5gb1v.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786036786/born_at_dawn_k5gb1v.png'],
    is_active: true,
    reviewCount: 8,
    reviews: []
  },
  {
    id: 'bundle-name-4letters',
    category: 'bundles',
    nameEn: 'Custom 4-Letter Name Bundle',
    nameAr: 'بندل اسمك بالحروف (٤ حروف بارزة)',
    price: 330,
    originalPrice: 400,
    savings: 70,
    tagEn: 'Save 70 EGP • Any 4 Letters',
    tagAr: 'توفير ٧٠ ج.م • ركب اسمك ٤ حروف',
    craftTagEn: 'Raised 3D Letters • Egypt Craft',
    craftTagAr: 'حروف بارزة ثلاثية الأبعاد',
    descriptionEn: 'Build your name or custom 4-letter word with raised 3D letters at a special bundle rate.',
    descriptionAr: 'ركب اسمك أو كلمتك المكونة من ٤ حروف بارزة مجسمة بسعر البندل المخفض.',
    specsEn: ['Includes: 4 Custom Raised 3D Letters', 'Save 70 EGP vs Buying Separately', 'Ready for phones, laptops, and personal gear'],
    specsAr: ['تتضمن: ٤ حروف بارزة مجسمة من اختيارك', 'توفير ٧٠ ج.م عن الشراء المنفرد', 'مناسبة للموبايل واللابتوب وأغراضك الشخصية'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103674/DUAT_TEXT_zixxvh.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103674/DUAT_TEXT_zixxvh.png'],
    is_active: true,
    reviewCount: 15,
    reviews: []
  },
  {
    id: 'bundle-year-month',
    category: 'bundles',
    nameEn: 'Birth Date Badge Bundle (Month + Year)',
    nameAr: 'بندل تاريخ الميلاد (شارة الشهر + السنة)',
    price: 170,
    originalPrice: 200,
    savings: 30,
    tagEn: 'Save 30 EGP • Month + Year Badge',
    tagAr: 'توفير ٣٠ ج.م • شارة شهر + سنة ميلادك',
    craftTagEn: 'Amber Dome Badges • Egypt Craft',
    craftTagAr: 'شارات عنبرية بارزة • صنع في مصر',
    descriptionEn: 'Match your birth month badge with your birth year badge in a clean, discounted duo bundle.',
    descriptionAr: 'احصل على شارة شهر ميلادك مع شارة سنة ميلادك في بندل ثنائي بسعر موفر.',
    specsEn: ['Includes: 1 Month Badge + 1 Year Badge', 'Save 30 EGP', 'Premium raised amber finish'],
    specsAr: ['تتضمن: شارة شهر + شارة سنة ميلاد', 'توفير ٣٠ ج.م', 'تشطيب بارز عنبري فاخر'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103660/STARS_imo15w.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103660/STARS_imo15w.png'],
    is_active: true,
    reviewCount: 6,
    reviews: []
  },
  {
    id: 'bundle-custom-5pack',
    category: 'bundles',
    nameEn: 'Custom 5-Sticker Mix Bundle',
    nameAr: 'بندل مكس ٥ استيكرات مخصصة',
    price: 400,
    originalPrice: 500,
    savings: 100,
    tagEn: 'Save 100 EGP • Pick Any 5 Stickers',
    tagAr: 'توفير ١٠٠ ج.م • ٥ استيكرات من اختيارك',
    craftTagEn: 'Custom Mix & Match • Egypt Craft',
    craftTagAr: 'تشكيلة مخصصة • صنع في مصر',
    descriptionEn: 'Mix and match any 5 stickers from our entire collection of slogans, badges, letters, and shapes.',
    descriptionAr: 'اختر أي ٥ استيكرات من التشكيلة الكاملة (عبارات، حروف، شارات، أشكال) واستمتع بخصم ١٠٠ جنيه.',
    specsEn: ['Includes: Any 5 Stickers of your choice', 'Save 100 EGP', 'Premium Raised 3D Finish'],
    specsAr: ['تتضمن: ٥ استيكرات من اختيارك بالكامل', 'توفير ١٠٠ ج.م', 'مجسم بارز مقاوم للماء والخدش'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103675/DUAT_SUN_rqu7s4.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103675/DUAT_SUN_rqu7s4.png'],
    is_active: true,
    reviewCount: 9,
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
    descriptionEn: 'The complete DUAT 6-sticker collector set featuring all raised 3D slogan pills and motifs.',
    descriptionAr: 'المجموعة الكاملة المكونة من ٦ ملصقات بارزة مجسمة من دوات في علبة فاخرة.',
    specsEn: ['Includes: All 6 DUAT Raised 3D Stickers', 'Save 100 EGP vs Individual Purchase', 'Collector Gift Packaging Included'],
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
    tagEn: 'Raised 3D Finish Slogan',
    tagAr: 'شعار مجسم بارز',
    craftTagEn: 'Ships in 3–5 Days • Egypt Craft',
    craftTagAr: 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
    descriptionEn: 'Raised 3D slogan sticker "Born at Dawn" with an amber gloss finish.',
    descriptionAr: 'ملصق مجسم بارز عبارة "طالع نور" بتشطيب عنبري فاخر.',
    specsEn: ['Raised 3D look', 'Glossy amber finish', 'Made for everyday use', 'Water & scratch resistant'],
    specsAr: ['شكل بارز ثلاثي الأبعاد', 'لمعة عنبرية', 'مناسبة للاستخدام اليومي', 'مقاومة للماء والخدش'],
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
    tagEn: 'Raised 3D Finish Slogan',
    tagAr: 'شعار مجسم بارز',
    craftTagEn: 'Ships in 3–5 Days • Egypt Craft',
    craftTagAr: 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
    descriptionEn: 'Deep navy blue raised 3D slogan sticker "Through the Night".',
    descriptionAr: 'ملصق مجسم بارز باللون الكحلي العميق عبارة "عدّي الليل".',
    specsEn: ['Raised 3D look', 'Royal navy gloss', 'Made for everyday use', 'Water & scratch resistant'],
    specsAr: ['شكل بارز ثلاثي الأبعاد', 'كحلي ملكي لامع', 'مناسبة للاستخدام اليومي', 'مقاومة للماء والخدش'],
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
    tagEn: 'Raised 3D Motif',
    tagAr: 'رمز مجسم بارز',
    craftTagEn: 'Ships in 3–5 Days • Egypt Craft',
    craftTagAr: 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
    descriptionEn: 'Raised 3D crescent moon dome motif in dark obsidian glaze.',
    descriptionAr: 'رمز الهلال البارز المجسم بتشطيب أسود فحمي فاخر.',
    specsEn: ['Raised 3D look', 'Obsidian crescent finish', 'Made for everyday use', 'Water resistant'],
    specsAr: ['شكل بارز مجسم', 'هلال فحمي', 'مناسبة للاستخدام اليومي', 'مقاومة للماء'],
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
    tagEn: 'Raised 3D Finish',
    tagAr: 'قبة بارز نجوم',
    craftTagEn: 'Ships in 3–5 Days • Egypt Craft',
    craftTagAr: 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
    descriptionEn: 'Deep starry night blue 3D dome with subtle cosmic glitter depth.',
    descriptionAr: 'استيكر مجسم بلون سماء الليل الكحلي المرصعة بالنجوم.',
    specsEn: ['Raised 3D look', 'Starry night glitter', 'Made for everyday use'],
    specsAr: ['شكل بارز مجسم', 'بريق سماء الليل', 'مناسبة للاستخدام اليومي'],
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
    specsEn: ['Raised 3D look', 'Alabaster & dawn-gold finish', 'Made for everyday use'],
    specsAr: ['شكل بارز مجسم', 'عاجي وذهب الفجر', 'مناسبة للاستخدام اليومي'],
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
    tagAr: 'شعار دوات المجسم',
    craftTagEn: 'Ships in 3–5 Days • Egypt Craft',
    craftTagAr: 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
    descriptionEn: 'Translucent smoked gray oval dome with engraved gold DUAT logotype.',
    descriptionAr: 'ملصق بيضاوي رمادي شفاف مزين بشعار دوات الذهبي المحفور.',
    specsEn: ['Raised 3D look', 'Smoked finish with gold details', 'Made for everyday use'],
    specsAr: ['شكل بارز مجسم', 'تشطيب دخاني وتفاصيل ذهبية', 'مناسبة للاستخدام اليومي'],
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103674/DUAT_TEXT_zixxvh.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786103674/DUAT_TEXT_zixxvh.png'],
    is_active: true,
    reviewCount: 0,
    reviews: []
  }
];


// ── Arabic Letter Sticker Products ──────────────────────────────────────────
const ARABIC_LETTERS_CHARS = ['أ','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','هـ','و','ي'];
export const ARABIC_LETTER_PRODUCTS = ARABIC_LETTERS_CHARS.map((char) => ({
  id: `ar-letter-${char}`,
  category: 'letters',
  nameEn: `Arabic Letter ${char}`,
  nameAr: `حرف ${char}`,
  price: 100,
  tagEn: 'RAISED 3D ARABIC LETTER',
  tagAr: 'حرف عربي مجسم بارز',
  craftTagEn: 'Ships in 3-5 Days',
  craftTagAr: 'يُشحن خلال 3-5 أيام',
  descriptionEn: `Raised 3D finish Arabic letter ${char}.`,
  descriptionAr: `حرف عربي مجسم بارز ${char}.`,
  specsEn: ['Raised 3D look','Glossy finish','Made for everyday use'],
  specsAr: ['شكل بارز مجسم','لمعة واضحة','مناسبة للاستخدام اليومي'],
  stickerRenderId: `ar-letter-${char}`,
  is_active: true,
  reviewCount: 0,
  reviews: []
}));

// ── English Letter Sticker Products ─────────────────────────────────────────
const ENGLISH_LETTERS_CHARS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
export const ENGLISH_LETTER_PRODUCTS = ENGLISH_LETTERS_CHARS.map((char) => ({
  id: `en-letter-${char}`,
  category: 'letters',
  nameEn: `English Letter ${char}`,
  nameAr: `حرف إنجليزي ${char}`,
  price: 100,
  tagEn: 'RAISED 3D ENGLISH LETTER',
  tagAr: 'حرف إنجليزي مجسم بارز',
  craftTagEn: 'Ships in 3-5 Days',
  craftTagAr: 'يُشحن خلال 3-5 أيام',
  descriptionEn: `Raised 3D finish English letter ${char}.`,
  descriptionAr: `حرف إنجليزي مجسم بارز ${char}.`,
  specsEn: ['Raised 3D look','Glossy finish','Made for everyday use'],
  specsAr: ['شكل بارز مجسم','لمعة واضحة','مناسبة للاستخدام اليومي'],
  stickerRenderId: `en-letter-${char}`,
  is_active: true,
  reviewCount: 0,
  reviews: []
}));

// ── Month Sticker Products ───────────────────────────────────────────────────
const MONTHS_PRODUCT_LIST = [
  { id:'month-jan', en:'Made In January',   ar:'صُنع في يناير' },
  { id:'month-feb', en:'Made In February',  ar:'صُنع في فبراير' },
  { id:'month-mar', en:'Made In March',     ar:'صُنع في مارس' },
  { id:'month-apr', en:'Made In April',     ar:'صُنع في أبريل' },
  { id:'month-may', en:'Made In May',       ar:'صُنع في مايو' },
  { id:'month-jun', en:'Made In June',      ar:'صُنع في يونيو' },
  { id:'month-jul', en:'Made In July',      ar:'صُنع في يوليو' },
  { id:'month-aug', en:'Made In August',    ar:'صُنع في أغسطس' },
  { id:'month-sep', en:'Made In September', ar:'صُنع في سبتمبر' },
  { id:'month-oct', en:'Made In October',   ar:'صُنع في أكتوبر' },
  { id:'month-nov', en:'Made In November',  ar:'صُنع في نوفمبر' },
  { id:'month-dec', en:'Made In December',  ar:'صُنع في ديسمبر' },
];
export const MONTH_STICKER_PRODUCTS = MONTHS_PRODUCT_LIST.map((m) => ({
  id: m.id,
  category: 'letters',
  nameEn: m.en,
  nameAr: m.ar,
  price: 100,
  tagEn: '3D MONTH BADGE',
  tagAr: 'شارة شهر ميلاد بارزة',
  craftTagEn: 'Ships in 3-5 Days',
  craftTagAr: 'يُشحن خلال 3-5 أيام',
  descriptionEn: `Raised 3D badge ${m.en}.`,
  descriptionAr: `شارة بارزة ${m.ar}.`,
  specsEn: ['Raised 3D look','Glossy finish','Made for everyday use'],
  specsAr: ['شكل بارز مجسم','لمعة واضحة','مناسبة للاستخدام اليومي'],
  stickerRenderId: m.id,
  is_active: true,
  reviewCount: 0,
  reviews: []
}));

// ── Year Sticker Products ────────────────────────────────────────────────────
const YEARS_PRODUCT_LIST = [
  { id:'year-199x', en:'Made In 199X', ar:'صُنع في التسعينات' },
  ...Array.from({ length: 27 }, (_, index) => {
    const year = 2000 + index;
    return {
      id: `year-${year}`,
      en: `Made In ${year}`,
      ar: `صُنع في عام ${year}`
    };
  }),
];
export const YEAR_STICKER_PRODUCTS = YEARS_PRODUCT_LIST.map((y) => ({
  id: y.id,
  category: 'letters',
  nameEn: y.en,
  nameAr: y.ar,
  price: 100,
  tagEn: '3D YEAR BADGE',
  tagAr: 'شارة سنة ميلادية بارزة',
  craftTagEn: 'Ships in 3-5 Days',
  craftTagAr: 'يُشحن خلال 3-5 أيام',
  descriptionEn: `Raised 3D badge ${y.en}.`,
  descriptionAr: `شارة بارزة ${y.ar}.`,
  specsEn: ['Raised 3D look','Glossy finish','Made for everyday use'],
  specsAr: ['شكل بارز مجسم','لمعة واضحة','مناسبة للاستخدام اليومي'],
  stickerRenderId: y.id,
  is_active: true,
  reviewCount: 0,
  reviews: []
}));

export const REVIEWS = [];

export const FAQS = [
  {
    id: 'faq-1',
    questionEn: 'How are DUAT stickers made?',
    questionAr: 'كيف يتم تصنيع استيكرات دوات؟',
    answerEn: 'Each sticker is made to order in Egypt with a premium raised 3D look designed for everyday use.',
    answerAr: 'كل استيكر بيتعمل حسب الطلب في مصر بشكل مجسّم بارز ومناسب للاستخدام اليومي.'
  },
  {
    id: 'faq-2',
    questionEn: 'When is a custom pre-order made?',
    questionAr: 'إمتى بيتصنع طلب الكستمايز؟',
    answerEn: 'The booking window lasts 7 days. Production and shipping take 3–5 days after it closes.',
    answerAr: 'باب الحجز بيفضل مفتوح ٧ أيام، وبعد ما يقفل التصنيع والشحن بياخدوا من ٣ لـ٥ أيام.'
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
