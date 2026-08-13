-- DUAT sticker-only launch: retire case products and legacy case-builder CTAs.

update public.products
set
  is_active = false,
  data = coalesce(data, '{}'::jsonb) || '{"is_active":false,"isActive":false}'::jsonb,
  updated_at = now()
where category = 'cases';

update public.hero_slides
set
  data = coalesce(data, '{}'::jsonb) || jsonb_build_object(
    'ctaSecondaryLink', '/sticker-builder',
    'ctaSecondaryTextEn', 'STICKER BUILDER',
    'ctaSecondaryTextAr', 'صمم استيكرك'
  ),
  updated_at = now()
where data->>'ctaSecondaryLink' in ('/customize', '/customizer');

update public.hero_slides
set
  data = coalesce(data, '{}'::jsonb) || jsonb_build_object(
    'subEn', 'Custom 3D epoxy dome stickers and ready-made collections. Made to order in Egypt.',
    'subAr', 'استيكرات إيبوكسي مجسّمة مخصصة وتشكيلات جاهزة، مصنوعة حسب الطلب في مصر.'
  ),
  updated_at = now()
where data->>'subEn' = 'Luxury Phone Cases + 3D Epoxy Dome Motifs. Made to order in Egypt.';

update public.hero_slides
set
  data = coalesce(data, '{}'::jsonb) || jsonb_build_object(
    'subAr', 'تشكيلة الاستيكرات الشبابية الأكثر جرأة وحيوية لتعبير فريد عن شخصيتك.'
  ),
  updated_at = now()
where data->>'subAr' = 'تشكيلة الجرابات والاستيكرات الشبابية الأكثر جرأة وحيوية لتعبير فريد عن شخصيتك.';

insert into public.store_settings (key, value, updated_at)
values (
  'forge_banner',
  jsonb_build_object(
    'eyebrowEn', 'DUAT / STICKER BUILDER',
    'eyebrowAr', 'دوات / مصمم الاستيكرات',
    'titleEn', 'BUILD A STICKER FOR YOURSELF.',
    'titleAr', 'صمّم استيكرك الخاص بنفسك.',
    'descEn', 'Write custom text or upload your design to turn it into a 3D epoxy dome sticker. Made to order.',
    'descAr', 'اختر نصك المخصص، خطك العربي، أو ارفع صورتك لتتحول إلى استيكر إيبوكسي مجسم ثلاثي الأبعاد 3D.',
    'buttonTextEn', 'OPEN STICKER BUILDER →',
    'buttonTextAr', 'افتح بيلدر الاستيكرز ←',
    'buttonLink', '/sticker-builder',
    'imageUrl', 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786036786/born_at_dawn_k5gb1v.png',
    'isActive', true
  ),
  now()
)
on conflict (key) do update
set value = excluded.value, updated_at = excluded.updated_at;
