export const CATEGORIES = [
  { id: 'all', key: 'all' },
  { id: 'cases', key: 'cases', num: '01' },
  { id: 'stickers', key: 'stickers', num: '02' },
  { id: 'charms', key: 'charms', num: '03' },
  { id: 'accessories', key: 'accessories', num: '04' }
];

export const PRODUCTS = [
  // 8 DISTINCT CASE FINISHES
  {
    id: 'case-solar',
    category: 'cases',
    nameEn: 'Clear Solar Case',
    nameAr: 'جراب الشمسي الشفاف',
    price: 720,
    tagEn: 'Clear + 3D Domes',
    tagAr: 'شفاف + ملصقات إيبوكسي',
    craftTagEn: 'Ships in 3–5 Days • Egypt Craft',
    craftTagAr: 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
    descriptionEn: 'Crystal clear optical acrylic canvas featuring three raised 3D epoxy dome stickers (sun-disc, amber crescent, solid gold).',
    descriptionAr: 'أكريليك شفاف نقي مزين بثلاث ملصقات إيبوكسي مجسمة (قرص الشمس، هلال الجمبر، وقرص ذهبي).',
    specsEn: ['Material: Optical Grade Acrylic + TPU', 'Finish: Anti-Yellowing Clear', 'Weight: 42g', 'Domes: 3D Polyurethane Epoxy'],
    specsAr: ['المادة: أكريليك بصري + TPU', 'النهاية: شفاف مقاوم للاصفرار', 'الوزن: ٤٢ جرام', 'الملصقات: إيبوكسي مجسم ثلاثي الأبعاد'],
    caseTypeId: 'clear',
    rating: 4.9,
    reviewCount: 34,
    reviews: [
      { name: 'Kareem A.', rating: 5, date: '2026-07-20', commentEn: 'The 3D epoxy domes feel incredible in hand. Real craftsmanship.', commentAr: 'ملصقات الإيبوكسي المجسمة ملمسها رائع جداً ومتقنة.' },
      { name: 'Youssef M.', rating: 5, date: '2026-07-15', commentEn: 'Cleanest clear case in Egypt. No yellowing after weeks.', commentAr: 'أنظف جراب شفاف في مصر، لم يتغير لونه أبداً.' }
    ]
  },
  {
    id: 'case-gold-ring',
    category: 'cases',
    nameEn: 'Gold Ring Armor Case',
    nameAr: 'جراب حلقة الذهب التكتيكي',
    price: 780,
    tagEn: '18k Gold Bezel + MagSafe',
    tagAr: 'إطار ذهب ١٨ + ماج سيف',
    craftTagEn: 'Hand-finished in Egypt',
    craftTagAr: 'تشطيب يدوي في مصر',
    descriptionEn: 'High-density stealth black armor with an 18k anodized dawn-gold camera ring and MagSafe alignment ring.',
    descriptionAr: 'درع أسود عالي الكثافة مع حلقة كاميرا مؤكسدة بذهب الفجر عيار ١٨ وحلقة ماج سيف.',
    specsEn: ['Material: High-Density Polycarbonate', 'Bezel: 18k Gold Anodized Alloy', 'Weight: 44g', 'Magnets: N52 Neodymium Array'],
    specsAr: ['المادة: بوليكاربونات عالي الكثافة', 'الإطار: سبيكة مؤكسدة بذهب ١٨', 'الوزن: ٤٤ جرام', 'المغناطيس: مصفوفة نيويميوم N52'],
    caseTypeId: 'gold-ring',
    rating: 4.9,
    reviewCount: 42,
    reviews: [
      { name: 'Nour E.', rating: 5, date: '2026-07-22', commentEn: 'The gold ring alignment magnet is super strong with my MagSafe charger.', commentAr: 'حلقة المغناطيس الذهبية قوية جداً وثابتة مع شاحن ماج سيف.' },
      { name: 'Ahmed S.', rating: 5, date: '2026-07-18', commentEn: 'Premium luxury finish. Worth every EGP.', commentAr: 'فخامة غير طبيعية في الملمس والتقفيل.' }
    ]
  },
  {
    id: 'case-ember',
    category: 'cases',
    nameEn: 'Ember Crimson Case',
    nameAr: 'جراب الجمر النبيذي',
    price: 690,
    tagEn: 'Frosted Crimson Ruby',
    tagAr: 'جمر نبيذي ضبابي',
    craftTagEn: 'Made to Order in Egypt',
    craftTagAr: 'صُنع حسب الطلب في مصر',
    descriptionEn: 'Semi-translucent dark crimson ruby tint with soft-touch frosted surface.',
    descriptionAr: 'درجة نبيذي داكنة شبه شفافة بملمس ناعم وضبابي.',
    specsEn: ['Material: Matte Translucent Composite', 'Finish: Soft-Touch Frosted', 'Weight: 40g', 'Drop Protection: 3 Meters'],
    specsAr: ['المادة: مركب مطفي شبه شفاف', 'النهاية: ملمس ناعم ضبابي', 'الوزن: ٤٠ جرام', 'حماية السقوط: ٣ أمتار'],
    caseTypeId: 'frosted-ember',
    rating: 4.9,
    reviewCount: 28,
    reviews: [
      { name: 'Salma K.', rating: 5, date: '2026-07-21', commentEn: 'The deep burgundy shade in sunlight is unbelievable.', commentAr: 'اللون النبيذي الدافئ في الشمس في غاية الروعة.' }
    ]
  },
  {
    id: 'case-void',
    category: 'cases',
    nameEn: 'Void Stealth Case',
    nameAr: 'جراب الفراغ المطفي',
    price: 650,
    tagEn: 'Ultra-Matte Stealth Black',
    tagAr: 'أسود مطفي نقي',
    craftTagEn: 'Ships in 2–4 Days • Standard Edition',
    craftTagAr: 'يُشحن خلال ٢-٤ أيام • الإصدار القياسي',
    descriptionEn: 'Ultra-matte dark techwear shell with reinforced camera housing and grave-edge structure.',
    descriptionAr: 'لمسة داكنة مطفية للغاية مع حماية معززة للكاميرا وحواف صلبة.',
    specsEn: ['Material: High-Density Polycarbonate', 'Finish: Ultra-Matte Shockproof', 'Weight: 38g', 'Warranty: 1 Year Replacement'],
    specsAr: ['المادة: بوليكاربونات عالي الكثافة', 'النهاية: مطفي مضاد للصدمات', 'الوزن: ٣٨ جرام', 'الضمان: سنة استبدال كامل'],
    caseTypeId: 'matte-black',
    rating: 4.9,
    reviewCount: 56,
    reviews: [
      { name: 'Omar F.', rating: 5, date: '2026-07-25', commentEn: 'Minimal, sleek, no fingerprints. Best stealth case.', commentAr: 'بسيط وأنيق ولا يترك أي بصمات.' }
    ]
  },
  {
    id: 'case-frost',
    category: 'cases',
    nameEn: 'Frost Iced Case',
    nameAr: 'جراب الصقيع الثلجي',
    price: 690,
    tagEn: 'Frosted Translucent Iced',
    tagAr: 'أبيض ثلجي ضبابي',
    craftTagEn: 'Hand-finished in Egypt',
    craftTagAr: 'تشطيب يدوي في مصر',
    descriptionEn: 'Iced translucent frosted white backplate reflecting subtle dawn light.',
    descriptionAr: 'لوحة خلفية بيضاء ثلجية شبه شفافة تعكس أضواء الفجر الخافتة.',
    specsEn: ['Material: Frosted Polycarbonate + TPU', 'Finish: Satin Touch Frosted', 'Weight: 39g', 'Protection: Air-Cushion Corners'],
    specsAr: ['المادة: بوليكاربونات ضبابي + TPU', 'النهاية: ملمس حريري ضبابي', 'الوزن: ٣٩ جرام', 'الحماية: حواف وسائد هوائية'],
    caseTypeId: 'frost',
    rating: 4.8,
    reviewCount: 22,
    reviews: [
      { name: 'Haya T.', rating: 5, date: '2026-07-19', commentEn: 'Looks so clean on a white iPhone.', commentAr: 'شيك جداً ومميز على الموبايل.' }
    ]
  },
  {
    id: 'case-tide',
    category: 'cases',
    nameEn: 'Tide Ocean Case',
    nameAr: 'جراب المد البحري',
    price: 740,
    tagEn: 'Deep Maritime Navy',
    tagAr: 'أزرق بحري عميق',
    craftTagEn: 'Made to Order in Egypt',
    craftTagAr: 'صُنع حسب الطلب في مصر',
    descriptionEn: 'Deep maritime ocean blue shell inspired by Egypt’s midnight coast.',
    descriptionAr: 'درجة أزرق بحري عميق مستوحاة من الساحل المصري في منتصف الليل.',
    specsEn: ['Material: High-Density Composite', 'Finish: Midnight Maritime Matte', 'Weight: 41g', 'Drop Rating: 3 Meters'],
    specsAr: ['المادة: مركب عالي الكثافة', 'النهاية: أزرق مطفي داكن', 'الوزن: ٤١ جرام', 'حماية السقوط: ٣ أمتار'],
    caseTypeId: 'tide',
    rating: 4.9,
    reviewCount: 17,
    reviews: [
      { name: 'Tarek B.', rating: 5, date: '2026-07-23', commentEn: 'Deep navy color is stunning. Quality feels top notch.', commentAr: 'درجة الأزرق خرافية والخامة ممتازة.' }
    ]
  },
  {
    id: 'case-sage',
    category: 'cases',
    nameEn: 'Sage Muted Green Case',
    nameAr: 'جراب الميرمية المورق',
    price: 740,
    tagEn: 'Egyptian Sage Green',
    tagAr: 'أخضر مرامي مطفي',
    craftTagEn: 'Egypt Craft Edition',
    craftTagAr: 'إصدار مصر الخاص',
    descriptionEn: 'Muted Egyptian sage green finish with micro-etched grip textures.',
    descriptionAr: 'لون أخضر مرامي هادئ وملمس مريح للغاية غير قابل للانزلاق.',
    specsEn: ['Material: Soft-Touch Polymer', 'Finish: Egyptian Sage Satin', 'Weight: 40g', 'Drop Protection: 3 Meters'],
    specsAr: ['المادة: بوليمر ناعم الملمس', 'النهاية: أخضر مرامي حريري', 'الوزن: ٤٠ جرام', 'حماية السقوط: ٣ أمتار'],
    caseTypeId: 'sage',
    rating: 4.9,
    reviewCount: 25,
    reviews: [
      { name: 'Dina H.', rating: 5, date: '2026-07-24', commentEn: 'The muted sage color is so elegant. Highly recommend!', commentAr: 'درجة الأخضر راقية وجذابة جداً.' }
    ]
  },
  {
    id: 'case-bone',
    category: 'cases',
    nameEn: 'Bone Alabaster Case',
    nameAr: 'جراب العاج الألباستر',
    price: 750,
    tagEn: 'Warm Alabaster Cream',
    tagAr: 'عاجي ألباستر دافئ',
    craftTagEn: 'Hand-finished in Egypt',
    craftTagAr: 'تشطيب يدوي في مصر',
    descriptionEn: 'Warm Egyptian alabaster cream finish with soft metallic gold accents.',
    descriptionAr: 'درجة عاجي ألباستر دافئة مزينة بلمسات ذهبية خافتة.',
    specsEn: ['Material: Dense Polymer Composite', 'Finish: Warm Cream Satin', 'Weight: 42g', 'Screen Lip: 1.5mm Protection'],
    specsAr: ['المادة: مركب بوليمر كثيف', 'النهاية: عاجي حريري دافئ', 'الوزن: ٤٢ جرام', 'بروز الشاشة: ١٫٥ مم للحماية'],
    caseTypeId: 'bone',
    rating: 4.9,
    reviewCount: 31,
    reviews: [
      { name: 'Mostafa Z.', rating: 5, date: '2026-07-26', commentEn: 'Refined warm cream color. Looks like an art piece.', commentAr: 'لون العاج مع التفاصيل الذهبية تحفة فنية.' }
    ]
  },
  {
    id: 'case-carbon',
    category: 'cases',
    nameEn: 'Carbon Techwear Case',
    nameAr: 'جراب كربون تكتيكي',
    price: 820,
    tagEn: 'Carbon Weave + Titanium',
    tagAr: 'ألياف كربون + تيتانيوم',
    craftTagEn: 'Ships in 3–5 Days • Techwear Series',
    craftTagAr: 'يُشحن خلال ٣-٥ أيام • سلسلة التك وير',
    descriptionEn: 'Textured carbon fiber weave back panel with industrial titanium camera housing and drop protection corners.',
    descriptionAr: 'لوحة خلفية منسوجة من ألياف الكربون مع حماية كاميرا من التيتانيوم الصناعي.',
    specsEn: ['Material: Real Carbon Fiber Weave', 'Finish: Matte Textured Weave', 'Weight: 36g', 'Drop Rating: 3.5 Meters'],
    specsAr: ['المادة: ألياف كربون حقيقية', 'النهاية: نسيج مطفي ملموس', 'الوزن: ٣٦ جرام', 'حماية السقوط: ٣٫٥ أمتار'],
    caseTypeId: 'carbon',
    rating: 4.8,
    reviewCount: 19,
    reviews: [
      { name: 'Ziad N.', rating: 5, date: '2026-07-22', commentEn: 'Lightweight carbon weave, handles drops like a shield.', commentAr: 'خفيف وجاهز للصدمات كأنه درع.' }
    ]
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
    craftTagEn: 'Epoxy Crafted in Egypt',
    craftTagAr: 'صناعة إيبوكسي في مصر',
    descriptionEn: 'High-gloss raised 3D epoxy sticker featuring a minimal solid disc motif.',
    descriptionAr: 'ملصق إيبوكسي ثلاثي الأبعاد بارز بحجم ناعم.',
    stickerType: 'disc',
    rating: 4.9,
    reviewCount: 18
  },
  {
    id: 'sticker-tale3-noor',
    category: 'stickers',
    nameEn: 'Tale3 Noor Dome Pill',
    nameAr: 'ملصق مجسم — طالع نور',
    price: 120,
    tagEn: '3D Epoxy Slogan',
    tagAr: 'إيبوكسي مجسم',
    craftTagEn: '3D Epoxy Slogan • Egypt',
    craftTagAr: 'إيبوكسي مجسم • مصر',
    descriptionEn: 'High-gloss raised 3D epoxy slogan pill: "طالع نور".',
    descriptionAr: 'ملصق بيضاوي مجسم ثلاثي الأبعاد بارز بعبارة "طالع نور".',
    stickerType: 'pill-tale3-noor',
    rating: 4.9,
    reviewCount: 45
  },
  {
    id: 'sticker-3addi-lel',
    category: 'stickers',
    nameEn: '3addi El-Lel Dome Pill',
    nameAr: 'ملصق مجسم — عدّي الليل',
    price: 120,
    tagEn: '3D Epoxy Slogan',
    tagAr: 'إيبوكسي مجسم',
    craftTagEn: '3D Epoxy Slogan • Egypt',
    craftTagAr: 'إيبوكسي مجسم • مصر',
    descriptionEn: 'High-gloss raised 3D epoxy slogan pill: "عدّي الليل".',
    descriptionAr: 'ملصق بيضاوي مجسم ثلاثي الأبعاد بارز بعبارة "عدّي الليل".',
    stickerType: 'pill-3addi-lel',
    rating: 4.9,
    reviewCount: 39
  },
  {
    id: 'sticker-born-dawn',
    category: 'stickers',
    nameEn: 'Born At Dawn Dome Pill',
    nameAr: 'ملصق مجسم — BORN AT DAWN',
    price: 120,
    tagEn: '3D Epoxy Slogan',
    tagAr: 'إيبوكسي مجسم',
    craftTagEn: '3D Epoxy Slogan • Egypt',
    craftTagAr: 'إيبوكسي مجسم • مصر',
    descriptionEn: 'High-gloss raised 3D epoxy slogan pill: "BORN AT DAWN".',
    descriptionAr: 'ملصق مجسم ثلاثي الأبعاد بارز بعبارة "BORN AT DAWN".',
    stickerType: 'pill-born-dawn',
    rating: 4.9,
    reviewCount: 27
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
    craftTagEn: '18k Plated Brass',
    craftTagAr: 'نحاس مطل بذهب عيار ١٨',
    descriptionEn: 'Heavyweight solid brass ring charm plated in 18k dawn gold.',
    descriptionAr: 'تعليقة حلقة من النحاس الصلب المطلية بذهب الفجر عيار ١٨.',
    charmType: 'gold-ring',
    rating: 4.9,
    reviewCount: 14
  },
  {
    id: 'charm-ember-bead',
    category: 'charms',
    nameEn: 'Ember Bead',
    nameAr: 'خرزة الجمر',
    price: 150,
    tagEn: 'Hand-blown Glass',
    tagAr: 'زجاج منفوخ يدويًا',
    craftTagEn: 'Handmade Egyptian Glass',
    craftTagAr: 'زجاج مصري مصنوع يدويًا',
    descriptionEn: 'Deep crimson ruby hand-blown glass bead charm with woven cord.',
    descriptionAr: 'خرزة زجاجية حمراء منفوخة يدوياً مع حبل منسوج أنيق.',
    charmType: 'ember-bead',
    rating: 4.8,
    reviewCount: 12
  }
];

export const CASE_TYPES = [
  { id: 'clear', nameEn: 'Clear Solar Canvas', nameAr: 'قماش الشمسي الشفاف', color: '#FFFFFF' },
  { id: 'gold-ring', nameEn: 'Gold Ring Armor (MagSafe)', nameAr: 'درع الحلقة الذهبية (ماج سيف)', color: '#E0A93B' },
  { id: 'frosted-ember', nameEn: 'Frosted Crimson Ruby', nameAr: 'جمر نبيذي ضبابي', color: '#D9432E' },
  { id: 'matte-black', nameEn: 'Void Stealth Black', nameAr: 'أسود مطفي نقي', color: '#0A0A0B' },
  { id: 'frost', nameEn: 'Frost Iced White', nameAr: 'أبيض ثلجي ضبابي', color: '#F0F4F8' },
  { id: 'tide', nameEn: 'Tide Deep Blue', nameAr: 'أزرق بحري عميق', color: '#0F2035' },
  { id: 'sage', nameEn: 'Sage Muted Green', nameAr: 'أخضر مرامي مطفي', color: '#1C2A22' },
  { id: 'bone', nameEn: 'Bone Alabaster Cream', nameAr: 'عاجي ألباستر دافئ', color: '#EFEAE0' },
  { id: 'carbon', nameEn: 'Carbon Techwear', nameAr: 'كربون تكتيكي', color: '#1A1A1A' }
];

export const PHONE_MODELS = [
  { id: 'ip16pro-max', name: 'iPhone 16 Pro Max', category: 'Apple' },
  { id: 'ip16pro', name: 'iPhone 16 Pro', category: 'Apple' },
  { id: 'ip16', name: 'iPhone 16', category: 'Apple' },
  { id: 'ip15pro-max', name: 'iPhone 15 Pro Max', category: 'Apple' },
  { id: 'ip15pro', name: 'iPhone 15 Pro', category: 'Apple' },
  { id: 'ip15', name: 'iPhone 15', category: 'Apple' },
  { id: 'ip14pro-max', name: 'iPhone 14 Pro Max', category: 'Apple' },
  { id: 'ip14pro', name: 'iPhone 14 Pro', category: 'Apple' },
  { id: 's24ultra', name: 'Samsung Galaxy S24 Ultra', category: 'Samsung' },
  { id: 's24plus', name: 'Samsung Galaxy S24+', category: 'Samsung' },
  { id: 's23ultra', name: 'Samsung Galaxy S23 Ultra', category: 'Samsung' },
  { id: 'pixel8pro', name: 'Google Pixel 8 Pro', category: 'Google' }
];

export const STICKER_PRESETS = [
  { id: 'disc', nameEn: 'Solid Disc Dome', nameAr: 'قرص الشمس' },
  { id: 'pill-tale3-noor', nameEn: 'Tale3 Noor Pill', nameAr: 'طالع نور' },
  { id: 'pill-3addi-lel', nameEn: '3addi El-Lel Pill', nameAr: 'عدّي الليل' },
  { id: 'pill-born-dawn', nameEn: 'Born At Dawn Pill', nameAr: 'BORN AT DAWN' }
];

export const PRESET_TEMPLATES = [
  {
    id: 'preset-dawn',
    nameEn: 'Dawn Passage',
    nameAr: 'عبور الفجر',
    caseTypeId: 'clear',
    layers: [
      { id: 'p1', type: 'sticker', stickerId: 'disc', x: 50, y: 35, scale: 1.2, rotation: 0 },
      { id: 'p2', type: 'sticker', stickerId: 'pill-tale3-noor', x: 50, y: 65, scale: 1.1, rotation: 0 }
    ]
  },
  {
    id: 'preset-gold',
    nameEn: 'Gold Eclipse',
    nameAr: 'كسوف الذهب',
    caseTypeId: 'gold-ring',
    layers: [
      { id: 'p3', type: 'sticker', stickerId: 'pill-born-dawn', x: 50, y: 55, scale: 1.1, rotation: 0 }
    ]
  }
];

export const REVIEWS = [
  {
    id: 'r1',
    author: 'Karim E.',
    location: 'Cairo, Egypt',
    rating: 5,
    textEn: 'The 3D epoxy domes feel like real jewelry attached to my phone. Best quality case in Egypt.',
    textAr: 'ملصقات الإيبوكسي المجسمة تبدو كالمجوهرات تماماً على الموبايل. أفضل جراب صنعت في مصر.'
  },
  {
    id: 'r2',
    author: 'Nour M.',
    location: 'Cairo, Egypt',
    rating: 5,
    textEn: 'Fast shipping to my doorstep. The dusk-to-dawn aesthetic is top tier.',
    textAr: 'توصيل سريع جداً وتغليف فخم للغاية.'
  }
];

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
  { id: 'alex', nameEn: 'Alexandria', nameAr: 'الإسكندرية', fee: 40 },
  { id: 'cairo', nameEn: 'Cairo', nameAr: 'القاهرة', fee: 55 },
  { id: 'giza', nameEn: 'Giza', nameAr: 'الجيزة', fee: 55 },
  { id: 'dakahlia', nameEn: 'Dakahlia (Mansoura)', nameAr: 'الدقهلية (المنصورة)', fee: 65 },
  { id: 'sharqia', nameEn: 'Sharqia (Zagazig)', nameAr: 'الشرقية (الزقازيق)', fee: 65 },
  { id: 'gharbia', nameEn: 'Gharbia (Tanta)', nameAr: 'الغربية (طنطا)', fee: 65 },
  { id: 'monufia', nameEn: 'Monufia', nameAr: 'المنوفية', fee: 65 },
  { id: 'qalyubia', nameEn: 'Qalyubia', nameAr: 'القليوبية', fee: 60 },
  { id: 'beheira', nameEn: 'Beheira (Damanhour)', nameAr: 'البحيرة (دمنهور)', fee: 60 },
  { id: 'ismailia', nameEn: 'Ismailia', nameAr: 'الإسماعيلية', fee: 70 },
  { id: 'suez', nameEn: 'Suez', nameAr: 'السويس', fee: 70 },
  { id: 'port-said', nameEn: 'Port Said', nameAr: 'بورسعيد', fee: 70 },
  { id: 'red-sea', nameEn: 'Red Sea (Hurghada)', nameAr: 'البحر الأحمر (الغردقة)', fee: 85 },
  { id: 'south-sinai', nameEn: 'South Sinai (Sharm)', nameAr: 'جنوب سيناء (شرم الشيخ)', fee: 90 },
  { id: 'upper-egypt', nameEn: 'Upper Egypt (Luxor / Aswan)', nameAr: 'الصعيد (الأقصر / أسوان)', fee: 95 }
];
