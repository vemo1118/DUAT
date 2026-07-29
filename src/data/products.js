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
    id: 'case-void',
    category: 'cases',
    nameEn: 'Void Case',
    nameAr: 'جراب الفراغ',
    price: 650,
    tagEn: 'Matte Black',
    tagAr: 'أسود مطفي',
    descriptionEn: 'Ultra-matte dark techwear shell with reinforced camera housing and grave-edge structure.',
    descriptionAr: 'لمسة داكنة مطفية للغاية مع حماية معززة للكاميرا وحواف صلبة.',
    specsEn: ['Material: High-Density Polycarbonate', 'Finish: Ultra-Matte Shockproof', 'Weight: 38g', 'Warranty: 1 Year Replacement'],
    specsAr: ['المادة: بوليكاربونات عالي الكثافة', 'النهاية: مطفي مضاد للصدمات', 'الوزن: ٣٨ جرام', 'الضمان: سنة استبدال كامل'],
    caseTypeConfig: { bg: '#0A0A0A', ring: '#1F1B17' }
  },
  {
    id: 'case-solar',
    category: 'cases',
    nameEn: 'Solar Case',
    nameAr: 'جراب الشمسي',
    price: 720,
    tagEn: 'Clear + Gold Ring',
    tagAr: 'شفاف + حلقة ذهبية',
    descriptionEn: 'Crystal clear acrylic canvas with anodized dawn-gold camera housing ring.',
    descriptionAr: 'أكريليك شفاف نقي مع حلقة كاميرا مؤكسدة بذهبي الفجر.',
    specsEn: ['Material: Optical Grade Acrylic + TPU', 'Finish: Anti-Yellowing Clear', 'Weight: 42g', 'Ring: Dawn Gold Anodized Alloy'],
    specsAr: ['المادة: أكريليك بصري + TPU', 'النهاية: شفاف مقوم للااصفرار', 'الوزن: ٤٢ جرام', 'الحلقة: سبيكة مؤكسدة بذهب الفجر'],
    caseTypeConfig: { bg: 'rgba(20, 20, 20, 0.4)', ring: '#E0A93B' }
  },
  {
    id: 'case-ember',
    category: 'cases',
    nameEn: 'Ember Case',
    nameAr: 'جراب الجمر',
    price: 690,
    tagEn: 'Frosted Ember',
    tagAr: 'جمر ضبابي',
    descriptionEn: 'Semi-translucent dark mahogany tint with accent detailing.',
    descriptionAr: 'درجة بني داكن شبه شفافة مع تفاصيل لون الفجر.',
    specsEn: ['Material: Matte Translucent Composite', 'Finish: Soft-Touch Frosted', 'Weight: 40g', 'Drop Protection: 3 Meters'],
    specsAr: ['المادة: مركب مطفي شبه شفاف', 'النهاية: ملمس ناعم ضبابي', 'الوزن: ٤٠ جرام', 'حماية السقوط: ٣ أمتار'],
    caseTypeConfig: { bg: '#2A1610', ring: '#4A2418' }
  },
  {
    id: 'case-eclipse',
    category: 'cases',
    nameEn: 'Eclipse Case',
    nameAr: 'جراب الكسوف',
    price: 780,
    tagEn: 'MagSafe Compatible',
    tagAr: 'متوافق مع MagSafe',
    descriptionEn: 'High-grade protective shell integrated with magnetic alignment ring.',
    descriptionAr: 'غطاء حماية عالي الجودة مزود بحلقة مغناطيسية.',
    specsEn: ['Material: Carbon Fiber Weave + TPU', 'Magnets: N52 Neodymium Array', 'Weight: 45g', 'Wireless Charging: Full Support'],
    specsAr: ['المادة: ألياف كربون منسوجة + TPU', 'المغناطيس: مصفوفة نيويميوم N52', 'الوزن: ٤٥ جرام', 'الشحن اللاسلكي: دعم كامل'],
    caseTypeConfig: { bg: '#141110', ring: '#2E2823' }
  },

  // DOME STICKERS
  {
    id: 'sticker-disc',
    category: 'stickers',
    nameEn: 'Solid Disc Dome',
    nameAr: 'ملصق قرص مجسم',
    price: 120,
    tagEn: '3D Epoxy Dome',
    tagAr: 'إيبوكسي مجسم',
    descriptionEn: 'High-gloss raised 3D epoxy sticker featuring a minimal solid disc motif.',
    descriptionAr: 'ملصق إيبوكسي ثلاثي الأبعاد بارز بحجم ناعم.',
    specsEn: ['Diameter: 35mm', 'Material: Self-Healing Polyurethane Epoxy', 'Adhesive: 3M Industrial Grade'],
    specsAr: ['القطر: ٣٥ مم', 'المادة: إيبوكسي بولي يوريثان ذاتي التثبيت', 'اللاصق: درجة صناعية من 3M'],
    stickerType: 'disc'
  },
  {
    id: 'sticker-tale3-noor',
    category: 'stickers',
    nameEn: 'Tale3 Noor Dome Pill',
    nameAr: 'ملصق مجسم — طالع نور',
    price: 120,
    tagEn: '3D Epoxy Slogan',
    tagAr: 'إيبوكسي مجسم',
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
    descriptionEn: 'High-gloss raised 3D epoxy slogan pill: "عدّي الليل".',
    descriptionAr: 'ملصق بيضاوي مجسم ثلاثي الأبعاد بارز بعبارة "عدّي الليل".',
    stickerType: 'pill-3addi-lel'
  },
  {
    id: 'sticker-born-dawn',
    category: 'stickers',
    nameEn: 'Born At Dawn Dome Pill',
    nameAr: 'ملصق مجسم — BORN AT DAWN',
    price: 120,
    tagEn: '3D Epoxy Slogan',
    tagAr: 'إيبوكسي مجسم',
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
    descriptionEn: 'Heavyweight solid brass ring charm plated in 18k dawn gold.',
    descriptionAr: 'تعليقة حلقة من النحاس الصلب المطلية بذهب الفجر عيار ١٨.',
    specsEn: ['Material: Solid Brass', 'Plating: 18k Dawn Gold', 'Loop: Heavy Duty Braided Wire'],
    specsAr: ['المادة: نحاس صلب', 'الطلاء: ذهب الفجر عيار ١٨', 'الحلقة: سلك مجدول شديد التحمل'],
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
    descriptionEn: 'Dark red volcanic glass style bead with engraved accent ring.',
    descriptionAr: 'خرزة بأسلوب الزجاج البركاني الأحمر الداكن مع حلقة محفورة.',
    specsEn: ['Material: Volcanic Epoxy Glass', 'Finish: Polished Smooth', 'Attachment: Stainless Steel Ring'],
    specsAr: ['المادة: زجاج بركاني إيبوكسي', 'النهاية: صقل مصقول', 'التثبيت: حلقة صلب مقاومة للصدأ'],
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
  { id: 'matte-black', nameEn: 'Matte Black', nameAr: 'أسود مطفي', bg: '#0A0A0A', ring: '#1F1B17' },
  { id: 'clear', nameEn: 'Clear', nameAr: 'شفاف', bg: 'rgba(20, 20, 20, 0.4)', ring: '#3A342C' },
  { id: 'frosted-ember', nameEn: 'Frosted Ember', nameAr: 'جمر ضبابي', bg: '#2A1610', ring: '#4A2418' },
  { id: 'gold-ring', nameEn: 'Gold Ring', nameAr: 'حلقة ذهبية', bg: '#0A0A0A', ring: '#E0A93B' },
  { id: 'magsafe', nameEn: 'MagSafe', nameAr: 'ماج سيف', bg: '#141110', ring: '#2E2823' }
];

export const STICKER_PRESETS = [
  { id: 'disc', nameEn: 'Disc', nameAr: 'قرص' },
  { id: 'ring', nameEn: 'Ring', nameAr: 'حلقة' },
  { id: 'crescent', nameEn: 'Crescent', nameAr: 'هلال' },
  { id: 'star-4', nameEn: 'Star', nameAr: 'نجمة' },
  { id: 'lightning', nameEn: 'Lightning', nameAr: 'صاعقة' },
  { id: 'flame', nameEn: 'Flame', nameAr: 'شعلة' },
  { id: 'spark', nameEn: 'Spark', nameAr: 'شرارة' },
  { id: 'plus', nameEn: 'Plus', nameAr: 'زائد' },
  { id: 'pill-tale3-noor', nameEn: 'طالع نور', nameAr: 'طالع نور' },
  { id: 'pill-3addi-lel', nameEn: 'عدّي الليل', nameAr: 'عدّي الليل' },
  { id: 'pill-bokra-ahla', nameEn: 'بكرة أحلى', nameAr: 'بكرة أحلى' },
  { id: 'pill-born-dawn', nameEn: 'BORN AT DAWN', nameAr: 'BORN AT DAWN' }
];

export const PRESET_TEMPLATES = [
  {
    id: 'preset-dawn-rise',
    nameEn: 'Dawn Rise',
    nameAr: 'طالع نور',
    caseTypeId: 'gold-ring',
    layers: [
      { id: 'l1', type: 'sticker', stickerId: 'disc', x: 50, y: 35, scale: 1.3, rotation: 0 },
      { id: 'l2', type: 'sticker', stickerId: 'pill-tale3-noor', x: 50, y: 65, scale: 1.1, rotation: 0 }
    ]
  },
  {
    id: 'preset-night-crossing',
    nameEn: 'Night Crossing',
    nameAr: 'عدّي الليل',
    caseTypeId: 'matte-black',
    layers: [
      { id: 'l1', type: 'sticker', stickerId: 'crescent', x: 50, y: 38, scale: 1.3, rotation: 0 },
      { id: 'l2', type: 'sticker', stickerId: 'pill-3addi-lel', x: 50, y: 68, scale: 1.1, rotation: 0 }
    ]
  },
  {
    id: 'preset-born-dawn',
    nameEn: 'Born at Dawn',
    nameAr: 'مولود الفجر',
    caseTypeId: 'magsafe',
    layers: [
      { id: 'l1', type: 'sticker', stickerId: 'star-4', x: 50, y: 40, scale: 1.2, rotation: 0 },
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
    author: 'Youssef K.',
    city: 'Alexandria',
    cityAr: 'الإسكندرية',
    rating: 5,
    textEn: 'The 3D epoxy dome sticker feels insane in hand. Real techwear aesthetic, not touristy. Fast 3-day shipping in Alex.',
    textAr: 'ملصق الإيبوكسي المجسم خرافة في الإيد. ستايل تكوير حقيقي ومش طابع سياحي تقليدي. التوصيل في إسكندرية وصل في ٣ أيام.'
  },
  {
    id: 'rev-2',
    author: 'Nour El-Din M.',
    city: 'Cairo',
    cityAr: 'القاهرة',
    rating: 5,
    textEn: 'Built a custom MagSafe case with dawn text. Quality exceeds expectations. 10/10 craftsmanship.',
    textAr: 'صممت جراب ماج سيف مخصص مع كتابة ذهبية. الجودة تتفوق على توقعاتي وبسعر ممتاز. إتقان ١٠/١٠.'
  }
];

export const FAQS = [
  {
    id: 'faq-1',
    qEn: 'How long does custom case production & shipping take?',
    qAr: 'كم يستغرق تصنيع الجراب المخصص وشحنه؟',
    aEn: 'Every custom case is made to order in our Egypt forge within 2–3 business days. Delivery takes 1 day for Alexandria & Cairo, and 2–3 days for other governorates.',
    aAr: 'كل جراب مخصص بيتم تصنيعه حسب الطلب في مصنعنا بمصر خلال ٢-٣ أيام عمل. التوصيل بياخد يوم واحد للإسكندرية والقاهرة، و٢-٣ أيام لباقي المحافظات.'
  },
  {
    id: 'faq-2',
    qEn: 'Are 3D epoxy dome stickers durable & waterproof?',
    qAr: 'هل ملصقات الإيبوكسي المجسمة متينة ومقاومة للماء؟',
    aEn: 'Yes. We use self-healing optical resin with industrial 3M adhesive. They resist scratches, water, and daily pocket friction without peeling.',
    aAr: 'نعم. بنستخدم راتينج بولي يوريثان ذاتي التثبيت مع لاصق 3M صناعي. بيقاوم الخدوش، المية، واحتكاك الجيب اليومي بدون ما يقشر.'
  },
  {
    id: 'faq-3',
    qEn: 'What is your warranty and returns policy?',
    qAr: 'ما هي سياسة الضمان والاستبدال؟',
    aEn: 'All products come with a 1-year replacement warranty against manufacturing defects. If anything arrives damaged, we replace it instantly via WhatsApp support.',
    aAr: 'جميع المنتجات معاها ضمان استبدال لمدة سنة ضد عيوب التصنيع. لو وصلك أي شيء فيه عيب، بنستبدله فوراً عبر خدمة عملاء الواتساب.'
  }
];
