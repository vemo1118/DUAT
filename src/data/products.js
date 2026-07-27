export const CATEGORIES = [
  { id: 'all', key: 'all' },
  { id: 'cases', key: 'cases', num: '01' },
  { id: 'stickers', key: 'stickers', num: '02' },
  { id: 'charms', key: 'charms', num: '03' },
  { id: 'accessories', key: 'accessories', num: '04' }
];

export const PRODUCTS = [
  // CASES
  {
    id: 'case-bone',
    category: 'cases',
    nameEn: 'Bone Canvas Case',
    nameAr: 'جراب الكانفس العظمي',
    price: 650,
    tagEn: 'Bone Matte',
    tagAr: 'عظمي مطفي',
    image: '/images/hero_case.png',
    descriptionEn: 'Clean bone matte acrylic blank canvas designed for custom 3D epoxy sticker layouts.',
    descriptionAr: 'كانفس مطفي بلون العظم النقي مُصمم لترتيب ملصقات الإيبوكسي المجسمة.',
    specsEn: ['Material: High-Density Polycarbonate', 'Finish: Soft-Touch Bone', 'Weight: 38g', 'Warranty: 1 Year Replacement'],
    specsAr: ['المادة: بوليكاربونات عالي الكثافة', 'النهاية: ملمس ناعم بلون العظم', 'الوزن: ٣٨ جرام', 'الضمان: سنة استبدال كامل'],
    caseTypeConfig: { bg: '#EDE4D3', ring: '#9A9384' }
  },
  {
    id: 'case-midnight',
    category: 'cases',
    nameEn: 'Midnight Case',
    nameAr: 'جراب منتصف الليل',
    price: 650,
    tagEn: 'Midnight Black',
    tagAr: 'أسود الليل',
    image: '/images/hero_case.png',
    descriptionEn: 'Deep midnight black finish with reinforced camera housing and dawn gold ring.',
    descriptionAr: 'لمسة داكنة بلون أسود الليل مع حماية معززة للكاميرا وحلقة ذهبية.',
    specsEn: ['Material: Polycarbonate Composite', 'Finish: Ultra-Matte Shockproof', 'Weight: 40g'],
    specsAr: ['المادة: مركب البوليكاربونات', 'النهاية: مطفي مضاد للصدمات', 'الوزن: ٤٠ جرام'],
    caseTypeConfig: { bg: '#0A0C16', ring: '#232A55' }
  },
  {
    id: 'case-burgundy',
    category: 'cases',
    nameEn: 'Burgundy Ember Case',
    nameAr: 'جراب الجمر النبيذي',
    price: 690,
    tagEn: 'Burgundy Matte',
    tagAr: 'نبيذي داكن',
    image: '/images/hero_case.png',
    descriptionEn: 'Rich mahogany burgundy finish with rose gold rim detailing.',
    descriptionAr: 'درجة نبيذي داكن مع تفاصيل حافة بلون الروز جولد.',
    specsEn: ['Material: Soft Composite', 'Finish: Velvet Matte', 'Weight: 40g'],
    specsAr: ['المادة: مركب ناعم', 'النهاية: مخملي مطفي', 'الوزن: ٤٠ جرام'],
    caseTypeConfig: { bg: '#3A121A', ring: '#6B2232' }
  },
  {
    id: 'case-olive',
    category: 'cases',
    nameEn: 'Olive Twilight Case',
    nameAr: 'جراب الزيتوني',
    price: 690,
    tagEn: 'Tactical Olive',
    tagAr: 'زيتوني تكتيكي',
    image: '/images/hero_case.png',
    descriptionEn: 'Deep tactical olive green shell designed for dusk-to-dawn protection.',
    descriptionAr: 'غطاء زيتوني داكن بتصميم تكتيكي لحماية طوال الليل والنهار.',
    specsEn: ['Material: High-Impact TPU', 'Finish: Matte Olive', 'Weight: 42g'],
    specsAr: ['المادة: TPU عالي الصدمات', 'النهاية: زيتوني مطفي', 'الوزن: ٤٢ جرام'],
    caseTypeConfig: { bg: '#1E2A20', ring: '#324536' }
  },
  {
    id: 'case-solar-clear',
    category: 'cases',
    nameEn: 'Solar Clear Case',
    nameAr: 'جراب الشمس الشفاف',
    price: 720,
    tagEn: 'Clear + Gold Ring',
    tagAr: 'شفاف + حلقة ذهبية',
    image: '/images/hero_case.png',
    descriptionEn: 'Crystal clear acrylic canvas with anodized dawn-gold camera housing ring.',
    descriptionAr: 'أكريليك شفاف نقي مع حلقة كاميرا مؤكسدة بذهبي الفجر.',
    specsEn: ['Material: Optical Grade Acrylic', 'Finish: Anti-Yellowing Clear', 'Weight: 42g'],
    specsAr: ['المادة: أكريليك بصري', 'النهاية: شفاف مقوم للاصفرار', 'الوزن: ٤٢ جرام'],
    caseTypeConfig: { bg: 'rgba(22, 26, 50, 0.4)', ring: '#E8A33D' }
  },

  // DOME STICKERS
  {
    id: 'sticker-tale3-noor',
    category: 'stickers',
    nameEn: 'Tale3 Noor Dome Pill',
    nameAr: 'ملصق مجسم — طالع نور',
    price: 120,
    tagEn: '3D Epoxy Slogan',
    tagAr: 'إيبوكسي مجسم',
    image: '/images/stickers.png',
    descriptionEn: 'High-gloss raised 3D epoxy slogan pill: "طالع نور".',
    descriptionAr: 'ملصق بيضاوي مجسم ثلاثي الأبعاد بارز بعبارة "طالع نور".',
    stickerType: 'pill-tale3-noor'
  },
  {
    id: 'sticker-3addi-lel',
    category: 'stickers',
    nameEn: '3addi El-Lel Dome Pill',
    nameAr: 'ملصق مجسم — عدّي الليل',
    price: 120,
    tagEn: '3D Epoxy Slogan',
    tagAr: 'إيبوكسي مجسم',
    image: '/images/stickers.png',
    descriptionEn: 'High-gloss raised 3D epoxy slogan pill: "عدّي الليل".',
    descriptionAr: 'ملصق بيضاوي مجسم ثلاثي الأبعاد بارز بعبارة "عدّي الليل".',
    stickerType: 'pill-3addi-lel'
  },
  {
    id: 'sticker-bokra-ahla',
    category: 'stickers',
    nameEn: 'Bokra Ahla Dome Pill',
    nameAr: 'ملصق مجسم — بكرة أحلى',
    price: 120,
    tagEn: '3D Epoxy Slogan',
    tagAr: 'إيبوكسي مجسم',
    image: '/images/stickers.png',
    descriptionEn: 'High-gloss raised 3D epoxy slogan pill: "بكرة أحلى".',
    descriptionAr: 'ملصق بيضاوي مجسم ثلاثي الأبعاد بارز بعبارة "بكرة أحلى".',
    stickerType: 'pill-bokra-ahla'
  },
  {
    id: 'sticker-born-dawn',
    category: 'stickers',
    nameEn: 'Born At Dawn Dome Pill',
    nameAr: 'ملصق مجسم — BORN AT DAWN',
    price: 120,
    tagEn: '3D Epoxy Slogan',
    tagAr: 'إيبوكسي مجسم',
    image: '/images/stickers.png',
    descriptionEn: 'High-gloss raised 3D epoxy slogan pill: "BORN AT DAWN".',
    descriptionAr: 'ملصق مجسم ثلاثي الأبعاد بارز بعبارة "BORN AT DAWN".',
    stickerType: 'pill-born-dawn'
  },

  // CHARMS
  {
    id: 'charm-gold-ring',
    category: 'charms',
    nameEn: 'Gold Ring Charm',
    nameAr: 'تعليقة الحلقة الذهبية',
    price: 180,
    tagEn: 'Brass + Gold Plate',
    tagAr: 'نحاس مطل بالذهب',
    image: '/images/charms.png',
    descriptionEn: 'Heavyweight solid brass ring charm plated in 18k dawn gold.',
    descriptionAr: 'تعليقة حلقة من النحاس الصلب المطلية بذهب الفجر عيار ١٨.',
    charmType: 'gold-ring'
  },
  {
    id: 'charm-ember-bead',
    category: 'charms',
    nameEn: 'Ember Bead',
    nameAr: 'خرزة الجمر',
    price: 150,
    tagEn: 'Hand-Set Epoxy',
    tagAr: 'تركيب يدوي',
    image: '/images/charms.png',
    descriptionEn: 'Dark red volcanic glass style bead with engraved accent ring.',
    descriptionAr: 'خرزة بأسلوب الزجاج البركاني الأحمر الداكن مع حلقة محفورة.',
    charmType: 'ember-bead'
  },

  // ACCESSORIES
  {
    id: 'acc-lanyard',
    category: 'accessories',
    nameEn: 'Duat Tactical Lanyard',
    nameAr: 'حبل دوات التكتيكي',
    price: 240,
    tagEn: 'Woven Cotton',
    tagAr: 'قطن منسوج',
    image: '/images/charms.png',
    descriptionEn: 'Heavy duty tactical wrist strap made from high-density black woven cotton.',
    descriptionAr: 'حبل معصم تكتيكي منسوج من القطن الأسود عالي الكثافة.',
    accType: 'lanyard'
  }
];

export const PHONE_MODELS = [
  'iPhone 17 Pro Max',
  'iPhone 17 Pro',
  'iPhone 17',
  'iPhone 16 Pro Max',
  'iPhone 16 Pro',
  'iPhone 16',
  'iPhone 15 Pro Max',
  'iPhone 15 Pro',
  'iPhone 15',
  'iPhone 14 Pro Max',
  'iPhone 14 Pro',
  'iPhone 14',
  'iPhone 13 Pro',
  'iPhone 13',
  'Samsung Galaxy S25 Ultra',
  'Samsung Galaxy S25',
  'Samsung Galaxy S24 Ultra',
  'Samsung Galaxy S24',
  'Samsung Galaxy S23',
  'Samsung Galaxy Note 20',
  'Google Pixel 9 Pro',
  'Google Pixel 9',
  'Google Pixel 8',
  'Xiaomi 14 Pro',
  'OnePlus 12',
  'Huawei P60 Pro'
];

export const CASE_TYPES = [
  { id: 'bone', nameEn: 'Bone Canvas', nameAr: 'عظمي مطفي', bg: '#EDE4D3', ring: '#9A9384' },
  { id: 'midnight', nameEn: 'Midnight Black', nameAr: 'أسود الليل', bg: '#0A0C16', ring: '#232A55' },
  { id: 'burgundy', nameEn: 'Burgundy Ember', nameAr: 'نبيذي داكن', bg: '#3A121A', ring: '#6B2232' },
  { id: 'olive', nameEn: 'Olive Twilight', nameAr: 'زيتوني تكتيكي', bg: '#1E2A20', ring: '#324536' },
  { id: 'solar-clear', nameEn: 'Solar Clear', nameAr: 'شفاف', bg: 'rgba(22, 26, 50, 0.4)', ring: '#E8A33D' }
];

export const STICKER_PRESETS = [
  { id: 'pill-tale3-noor', nameEn: 'طالع نور', nameAr: 'طالع نور' },
  { id: 'pill-3addi-lel', nameEn: 'عدّي الليل', nameAr: 'عدّي الليل' },
  { id: 'pill-bokra-ahla', nameEn: 'بكرة أحلى', nameAr: 'بكرة أحلى' },
  { id: 'pill-lesa-badri', nameEn: 'لسه بدري عليك', nameAr: 'لسه بدري عليك' },
  { id: 'pill-born-dawn', nameEn: 'BORN AT DAWN', nameAr: 'BORN AT DAWN' },
  { id: 'pill-through-night', nameEn: 'THROUGH THE NIGHT', nameAr: 'THROUGH THE NIGHT' },
  { id: 'dome-palm', nameEn: 'Palm Dome', nameAr: 'نخلة مجسمة' },
  { id: 'dome-horse', nameEn: 'Horse Dome', nameAr: 'خيل مجسم' },
  { id: 'dome-scarab', nameEn: 'Scarab Dome', nameAr: 'جعران مجسم' },
  { id: 'dome-ankh', nameEn: 'Ankh Dome', nameAr: 'عنخ مجسم' },
  { id: 'dome-sun', nameEn: 'Sun Disc', nameAr: 'قرص الشمس' }
];

export const PRESET_TEMPLATES = [
  {
    id: 'preset-tale3-noor',
    nameEn: 'Tale3 Noor Canvas',
    nameAr: 'كانفس طالع نور',
    caseTypeId: 'bone',
    layers: [
      { id: 'l1', type: 'sticker', stickerId: 'dome-palm', x: 50, y: 35, scale: 1.2, rotation: 0 },
      { id: 'l2', type: 'sticker', stickerId: 'pill-tale3-noor', x: 50, y: 65, scale: 1.1, rotation: 0 }
    ]
  },
  {
    id: 'preset-3addi-lel',
    nameEn: '3addi El-Lel Midnight',
    nameAr: 'ميدنايت عدّي الليل',
    caseTypeId: 'midnight',
    layers: [
      { id: 'l1', type: 'sticker', stickerId: 'dome-sun', x: 50, y: 38, scale: 1.3, rotation: 0 },
      { id: 'l2', type: 'sticker', stickerId: 'pill-3addi-lel', x: 50, y: 68, scale: 1.1, rotation: 0 }
    ]
  },
  {
    id: 'preset-born-dawn',
    nameEn: 'Born At Dawn Olive',
    nameAr: 'زيتوني BORN AT DAWN',
    caseTypeId: 'olive',
    layers: [
      { id: 'l1', type: 'sticker', stickerId: 'dome-scarab', x: 50, y: 40, scale: 1.2, rotation: 0 },
      { id: 'l2', type: 'sticker', stickerId: 'pill-born-dawn', x: 50, y: 70, scale: 1.0, rotation: 0 }
    ]
  }
];

export const GOVERNORATES = [
  { id: 'alex', nameEn: 'Alexandria', nameAr: 'الإسكندرية', fee: 35 },
  { id: 'cairo', nameEn: 'Cairo', nameAr: 'القاهرة', fee: 50 },
  { id: 'giza', nameEn: 'Giza', nameAr: 'الجيزة', fee: 50 },
  { id: 'qalyubia', nameEn: 'Qalyubia', nameAr: 'القليوبية', fee: 55 },
  { id: 'sharqia', nameEn: 'Sharqia', nameAr: 'الشرقية', fee: 60 },
  { id: 'dakahlia', nameEn: 'Dakahlia (Mansoura)', nameAr: 'الدقهلية (المنصورة)', fee: 60 },
  { id: 'monufia', nameEn: 'Monufia', nameAr: 'المنوفية', fee: 60 },
  { id: 'gharbia', nameEn: 'Gharbia (Tanta)', nameAr: 'الغربية (طنطا)', fee: 60 },
  { id: 'beheira', nameEn: 'Beheira (Damanhour)', nameAr: 'البحيرة (دمنهور)', fee: 50 },
  { id: 'ismailia', nameEn: 'Ismailia', nameAr: 'الإسماعيلية', fee: 65 },
  { id: 'suez', nameEn: 'Suez', nameAr: 'السويس', fee: 65 },
  { id: 'port-said', nameEn: 'Port Said', nameAr: 'بورسعيد', fee: 65 },
  { id: 'red-sea', nameEn: 'Red Sea (Hurghada)', nameAr: 'البحر الأحمر (الغردقة)', fee: 80 },
  { id: 'luxor', nameEn: 'Luxor', nameAr: 'الأقصر', fee: 85 },
  { id: 'aswan', nameEn: 'Aswan', nameAr: 'أسوان', fee: 90 }
];

export const REVIEWS = [
  {
    id: 'rev-1',
    author: 'Moataz K.',
    city: 'Alexandria',
    cityAr: 'الإسكندرية',
    rating: 5,
    textEn: 'The 3D epoxy slogan pills feel insane in hand. "طالع نور" on Bone canvas is pure art.',
    textAr: 'استيكر "طالع نور" المجسم على كفر العظمي خرافة في الإيد. ستايل تكوير حقيقي ومش طابع سياحي تقليدي.'
  },
  {
    id: 'rev-2',
    author: 'Nour El-Din M.',
    city: 'Cairo',
    cityAr: 'القاهرة',
    rating: 5,
    textEn: 'Built a custom Midnight case with "BORN AT DAWN" text. Quality exceeds expectations. 10/10.',
    textAr: 'صممت جراب ميدنايت مخصص مع كتابة "BORN AT DAWN". الجودة تتفوق على كاستيفاي وبسعر ممتاز.'
  }
];

export const FAQS = [
  {
    id: 'faq-1',
    qEn: 'How long does custom case production & shipping take?',
    qAr: 'كم يستغرق تصنيع الجراب المخصص وشحنه؟',
    aEn: 'Every custom case is made to order in our Alexandria forge within 2–3 business days. Delivery takes 1 day for Alexandria & Cairo, and 2–3 days for other governorates.',
    aAr: 'كل جراب مخصص بيتم تصنيعه حسب الطلب في مصنعنا بالإسكندرية خلال ٢-٣ أيام عمل. التوصيل بياخد يوم واحد للإسكندرية والقاهرة، و٢-٣ أيام لباقي المحافظات.'
  }
];
