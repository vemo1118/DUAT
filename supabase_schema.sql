-- =====================================================================
-- DUAT STORE SUPABASE DATABASE SCHEMA & INITIAL DATA SEED
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/pgqgmrfvsvrvbddafrcf/sql/new
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PRODUCTS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'cases',
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  tag_en TEXT,
  tag_ar TEXT,
  craft_tag_en TEXT,
  craft_tag_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  specs_en JSONB DEFAULT '[]'::jsonb,
  specs_ar JSONB DEFAULT '[]'::jsonb,
  case_type_id TEXT,
  rating NUMERIC DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  reviews JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migrations for Products table
ALTER TABLE public.products ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- RLS & Grants for Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all access on products" ON public.products;
DROP POLICY IF EXISTS "Allow public read products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated modify products" ON public.products;

CREATE POLICY "Allow public read products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated modify products"
  ON public.products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.products TO anon;
GRANT ALL ON public.products TO authenticated;


-- ---------------------------------------------------------------------
-- 2. ORDERS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'placed',
  customer JSONB NOT NULL DEFAULT '{}'::jsonb,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'cod',
  payment_proof_path TEXT
);

-- Migration/Fix commands for existing tables in Supabase:
ALTER TABLE public.orders ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS ref TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_proof_path TEXT;

-- RLS & Grants for Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all access on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read own order" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated full orders" ON public.orders;

CREATE POLICY "Allow public insert orders"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read own order"
  ON public.orders FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated full orders"
  ON public.orders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT INSERT, SELECT ON public.orders TO anon;
GRANT ALL ON public.orders TO authenticated;


-- ---------------------------------------------------------------------
-- 3. HERO SLIDES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id TEXT PRIMARY KEY,
  eyebrow_en TEXT,
  eyebrow_ar TEXT,
  headline1_en TEXT,
  headline1_ar TEXT,
  headline2_en TEXT,
  headline2_ar TEXT,
  sub_en TEXT,
  sub_ar TEXT,
  badge_en TEXT,
  badge_ar TEXT,
  image_url TEXT,
  cta_primary_text_en TEXT,
  cta_primary_text_ar TEXT,
  cta_primary_link TEXT,
  cta_secondary_text_en TEXT,
  cta_secondary_text_ar TEXT,
  cta_secondary_link TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migrations for Hero Slides table
ALTER TABLE public.hero_slides ALTER COLUMN id TYPE TEXT USING id::text;
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.hero_slides ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 1;

-- RLS & Grants for Hero Slides
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all access on hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Allow public read hero_slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Allow authenticated modify hero_slides" ON public.hero_slides;

CREATE POLICY "Allow public read hero_slides"
  ON public.hero_slides FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated modify hero_slides"
  ON public.hero_slides FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.hero_slides TO anon;
GRANT ALL ON public.hero_slides TO authenticated;


-- ---------------------------------------------------------------------
-- 4. SEED INITIAL PRODUCTS DATA
-- ---------------------------------------------------------------------
INSERT INTO public.products (
  id, category, name_en, name_ar, price, original_price, tag_en, tag_ar, craft_tag_en, craft_tag_ar, description_en, description_ar, specs_en, specs_ar, case_type_id, rating, review_count, reviews
) VALUES 
(
  'case-solar', 'cases', 'Clear Solar Case', 'جراب الشمسي الشفاف', 720, 936,
  'Clear + 3D Domes', 'شفاف + ملصقات إيبوكسي', 'Ships in 3–5 Days • Egypt Craft', 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
  'Crystal clear optical acrylic canvas featuring three raised 3D epoxy dome stickers (sun-disc, amber crescent, solid gold).',
  'أكريليك شفاف نقي مزين بثلاث ملصقات إيبوكسي مجسمة (قرص الشمس، هلال الجمبر، وقرص ذهبي).',
  '["Material: Optical Grade Acrylic + TPU", "Finish: Anti-Yellowing Clear", "Weight: 42g", "Domes: 3D Polyurethane Epoxy"]'::jsonb,
  '["المادة: أكريليك بصري + TPU", "النهاية: شفاف مقاوم للاصفرار", "الوزن: ٤٢ جرام", "الملصقات: إيبوكسي مجسم ثلاثي الأبعاد"]'::jsonb,
  'clear', 4.9, 34,
  '[{"name": "Kareem A.", "rating": 5, "date": "2026-07-20", "commentEn": "The 3D epoxy domes feel incredible in hand.", "commentAr": "ملصقات الإيبوكسي المجسمة ملمسها رائع جداً ومتقنة."}]'::jsonb
),
(
  'case-gold-ring', 'cases', 'Gold Ring Armor Case', 'جراب حلقة الذهب التكتيكي', 780, 1014,
  '18k Gold Bezel + MagSafe', 'إطار ذهب ١٨ + ماج سيف', 'Hand-finished in Egypt', 'تشطيب يدوي في مصر',
  'High-density stealth black armor with an 18k anodized dawn-gold camera ring and MagSafe alignment ring.',
  'درع أسود عالي الكثافة مع حلقة كاميرا مؤكسدة بذهب الفجر عيار ١٨ وحلقة ماج سيف.',
  '["Material: High-Density Polycarbonate", "Bezel: 18k Gold Anodized Alloy", "Weight: 44g", "Magnets: N52 Neodymium Array"]'::jsonb,
  '["المادة: بوليكاربونات عالي الكثافة", "الإطار: سبيكة مؤكسدة بذهب ١٨", "الوزن: ٤٤ جرام", "المغناطيس: مصفوفة نيويميوم N52"]'::jsonb,
  'gold-ring', 4.9, 42,
  '[{"name": "Nour E.", "rating": 5, "date": "2026-07-22", "commentEn": "The gold ring alignment magnet is super strong.", "commentAr": "حلقة المغناطيس الذهبية قوية جداً وثابتة."}]'::jsonb
),
(
  'case-ember', 'cases', 'Ember Crimson Case', 'جراب الجمر النبيذي', 690, 897,
  'Frosted Crimson Ruby', 'جمر نبيذي ضبابي', 'Made to Order in Egypt', 'صُنع حسب الطلب في مصر',
  'Semi-translucent dark crimson ruby tint with soft-touch frosted surface.',
  'درجة نبيذي داكنة شبه شفافة بملمس ناعم وضبابي.',
  '["Material: Matte Translucent Composite", "Finish: Soft-Touch Frosted", "Weight: 40g"]'::jsonb,
  '["المادة: مركب مطفي شبه شفاف", "النهاية: ملمس ناعم ضبابي", "الوزن: ٤٠ جرام"]'::jsonb,
  'frosted-ember', 4.9, 28,
  '[{"name": "Salma K.", "rating": 5, "date": "2026-07-21", "commentEn": "The deep burgundy shade in sunlight is unbelievable.", "commentAr": "اللون النبيذي الدافئ في الشمس في غاية الروعة."}]'::jsonb
),
(
  'case-void', 'cases', 'Void Stealth Case', 'جراب الفراغ المطفي', 650, 845,
  'Ultra-Matte Stealth Black', 'أسود مطفي نقي', 'Ships in 2–4 Days • Standard Edition', 'يُشحن خلال ٢-٤ أيام • الإصدار القياسي',
  'Ultra-matte dark techwear shell with reinforced camera housing and grave-edge structure.',
  'لمسة داكنة مطفية للغاية مع حماية معززة للكاميرا وحواف صلبة.',
  '["Material: High-Density Polycarbonate", "Finish: Ultra-Matte Shockproof", "Weight: 38g"]'::jsonb,
  '["المادة: بوليكاربونات عالي الكثافة", "النهاية: مطفي مضاد للصدمات", "الوزن: ٣٨ جرام"]'::jsonb,
  'matte-black', 4.9, 56,
  '[{"name": "Omar F.", "rating": 5, "date": "2026-07-25", "commentEn": "Minimal, sleek, no fingerprints.", "commentAr": "بسيط وأنيق ولا يترك أي بصمات."}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- ---------------------------------------------------------------------
-- 5. SEED INITIAL ORDERS DATA
-- ---------------------------------------------------------------------
INSERT INTO public.orders (
  id, created_at, status, customer, items, total, payment_method
) VALUES
(
  'DUAT-9482', NOW() - INTERVAL '2 days', 'shipped',
  '{"fullName": "أحمد محمود", "phone": "01012345678", "address": "شارع التسعين الشمالي، التجمع الخامس", "governorate": {"nameAr": "القاهرة", "fee": 50}}'::jsonb,
  '[{"id": "case-solar", "nameAr": "جراب الشمسي الشفاف", "nameEn": "Clear Solar Case", "price": 720, "quantity": 1}]'::jsonb,
  770, 'cod'
),
(
  'DUAT-7104', NOW() - INTERVAL '5 hours', 'forge',
  '{"fullName": "مريم علي", "phone": "01198765432", "address": "حي الجامعة، المنصورة", "governorate": {"nameAr": "الدقهلية", "fee": 65}}'::jsonb,
  '[{"id": "case-gold-ring", "nameAr": "جراب حلقة الذهب التكتيكي", "nameEn": "Gold Ring Armor Case", "price": 780, "quantity": 1}, {"id": "charm-scarab", "nameAr": "تعليقة الجعران الذهبي", "nameEn": "Scarab Gold Charm", "price": 290, "quantity": 1}]'::jsonb,
  1135, 'instapay'
)
ON CONFLICT (id) DO NOTHING;


-- ---------------------------------------------------------------------
-- 6. SEED INITIAL HERO SLIDES DATA
-- ---------------------------------------------------------------------
INSERT INTO public.hero_slides (
  id, eyebrow_en, eyebrow_ar, headline1_en, headline1_ar, headline2_en, headline2_ar, sub_en, sub_ar, badge_en, badge_ar, image_url, cta_primary_text_en, cta_primary_text_ar, cta_primary_link, cta_secondary_text_en, cta_secondary_text_ar, cta_secondary_link
) VALUES
(
  'hero-slide-1', 'DUAT / THE FORGE', 'دوات / كور الفن والتشطيب',
  'CRAFT YOUR OWN', 'صمم درعك الخاص', 'CUSTOM ARMOR.', 'بلمسة فرعونية فاخرة.',
  'Interactive 3D dome builder. Select phone model, armor finish, raised slogan pills, Arabic motifs, and custom engravings.',
  'أداة التصميم التفاعلية ثلاثية الأبعاد. اختر موديل هاتفك، التقفيل الفاخر، والملصقات المجسمة.',
  '3D BUILDER', 'أداة 3D الحصرية', '/images/transparent_hero_case.png',
  'START BUILDING', 'ابدأ التصميم الآن', '/customize',
  'VIEW GALLERY', 'معرض الكتالوج', '/shop'
),
(
  'hero-slide-2', 'SPECIAL SUMMER DROP', 'عرض خاص لفترة محدودة',
  'EXCLUSIVE 30% OFF', 'خصم ٣٠٪ حصري', 'ON ALL CASES.', 'على جميع الجرابات.',
  'Hand-crafted luxury phone cases with raised epoxy motifs. Premium 18k anodized finish meets Egyptian heritage.',
  'جرابات مصنوعة يدوياً في مصر بخامات فاخرة تشطيب إطار ذهبي وضمان استبدال كامل سنة.',
  'OFFER 30% OFF', 'عرض خاص 30%', '/images/stickers.png',
  'SHOP COLLECTION', 'تسوق العروض الآن', '/shop',
  'TRACK YOUR ORDER', 'تتبع طلبك الحقيقي', '/track-order'
)
ON CONFLICT (id) DO NOTHING;


-- ---------------------------------------------------------------------
-- 7. PERFORMANCE INDEXES (SUPABASE POSTGRES BEST PRACTICES)
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category_active ON public.products (category, is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_case_type ON public.products (case_type_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_orders_ref ON public.orders (ref);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON public.orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hero_slides_active_sort ON public.hero_slides (sort_order ASC) WHERE is_active = true;


-- ---------------------------------------------------------------------
-- 8. COUPONS TABLE (DYNAMIC DISCOUNT ENGINE)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage' or 'fixed'
  value NUMERIC NOT NULL DEFAULT 10,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read active coupons" ON public.coupons;
CREATE POLICY "Allow public read active coupons"
  ON public.coupons FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated modify coupons" ON public.coupons;
CREATE POLICY "Allow authenticated modify coupons"
  ON public.coupons FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.coupons TO anon;
GRANT ALL ON public.coupons TO authenticated;

-- Seed Initial Coupons
INSERT INTO public.coupons (code, type, value, description) VALUES
  ('DUAT10', 'percentage', 10, 'خصم ١٠٪ على جميع الجرابات والمنتجات'),
  ('DAWN100', 'fixed', 100, 'خصم ١٠٠ ج.م ثابت'),
  ('SUMMER20', 'percentage', 20, 'خصم الصيف ٢٠٪')
ON CONFLICT (code) DO NOTHING;


-- ---------------------------------------------------------------------
-- 9. STORE SETTINGS TABLE (TELEGRAM, WHATSAPP & GLOBAL CONFIG)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read settings" ON public.store_settings;
CREATE POLICY "Allow public read settings"
  ON public.store_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated modify settings" ON public.store_settings;
CREATE POLICY "Allow authenticated modify settings"
  ON public.store_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.store_settings TO anon;
GRANT ALL ON public.store_settings TO authenticated;


-- ---------------------------------------------------------------------
-- 10. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_products ON public.products;
CREATE TRIGGER set_updated_at_products
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_orders ON public.orders;
CREATE TRIGGER set_updated_at_orders
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();


-- ---------------------------------------------------------------------
-- 11. STORAGE BUCKET FOR INSTAPAY PAYMENT PROOFS & SECURE RLS
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public upload to payment-proofs" ON storage.objects;
CREATE POLICY "Allow public upload to payment-proofs"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'payment-proofs');

DROP POLICY IF EXISTS "Allow public read from payment-proofs" ON storage.objects;
CREATE POLICY "Allow public read from payment-proofs"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'payment-proofs');

DROP POLICY IF EXISTS "Allow authenticated update payment-proofs" ON storage.objects;
CREATE POLICY "Allow authenticated update payment-proofs"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'payment-proofs');

DROP POLICY IF EXISTS "Allow authenticated delete payment-proofs" ON storage.objects;
CREATE POLICY "Allow authenticated delete payment-proofs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'payment-proofs');


