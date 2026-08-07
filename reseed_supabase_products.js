import { createClient } from './node_modules/@supabase/supabase-js/dist/index.mjs';

const SUPABASE_URL = 'https://pgqgmrfvsvrvbddafrcf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_8yvV20JyWCM1qN_e5Bis5w_DvI_t1i7';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const NEW_PRODUCTS = [
  // 1. CASE BUNDLES (category "cases", prices 620 / 590 / 590 EGP)
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
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/v1785768478/B1_TB_w1zemr.jpg',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/v1785768478/B1_TB_w1zemr.jpg'],
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
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/v1785764123/B1_Whit_rkck3n.jpg',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/v1785764123/B1_Whit_rkck3n.jpg'],
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
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/v1785764123/B1_DarkNight_dzbmmn.jpg',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/v1785764123/B1_DarkNight_dzbmmn.jpg'],
    caseTypeId: 'tide',
    is_active: true,
    reviewCount: 0,
    reviews: []
  },

  // 2. BUNDLE PACK (category "stickers", price 500 EGP)
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
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png'],
    is_active: true,
    reviewCount: 0,
    reviews: []
  },

  // 3. STICKERS (category "stickers", price 100 EGP each)
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
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png'],
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
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png'],
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
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png'],
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
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png'],
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
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png'],
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
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png',
    images: ['https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png'],
    is_active: true,
    reviewCount: 0,
    reviews: []
  }
];

async function reseed() {
  console.log('1. Deleting ALL old rows from products table...');
  const { error: delError } = await supabase.from('products').delete().neq('id', 'non-existent-id-dummy-clean-all');
  if (delError) {
    console.error('Delete error:', delError);
  } else {
    console.log('Successfully cleared old products from table!');
  }

  console.log('2. Inserting new products into Supabase products table...');
  const rows = NEW_PRODUCTS.map((p) => ({
    id: p.id,
    category: p.category,
    price: p.price,
    is_active: true,
    data: p
  }));

  const { data, error: insertError } = await supabase.from('products').upsert(rows);
  if (insertError) {
    console.error('Insert error:', insertError);
  } else {
    console.log('Successfully inserted all 10 new products into Supabase!');
  }

  // Verify
  const { data: finalProducts } = await supabase.from('products').select('id, category, price');
  console.log('Final products in Supabase:', finalProducts);
}

reseed();
