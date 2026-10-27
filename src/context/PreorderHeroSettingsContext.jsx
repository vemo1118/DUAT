import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { isInlineStoreImage, uploadStoreImageDataUrl } from '../services/storeAssetService';

export const DEFAULT_PREORDER_HERO_SETTINGS = {
  isActive: true,
  badgeOpenAr: 'الحجز مفتوح لمدة 7 أيام', badgeOpenEn: '7-DAY PRE-ORDER IS OPEN',
  badgeClosedAr: 'حجز الدفعة انتهى', badgeClosedEn: 'THIS CUSTOM DROP IS CLOSED',
  badgeUpcomingAr: 'دفعة الكستمايز الجاية', badgeUpcomingEn: 'NEXT CUSTOM DROP',
  titleAr: 'إنت تتخيلها.', titleEn: 'YOU IMAGINE IT.',
  accentTitleAr: 'إحنا نعملهالك.', accentTitleEn: 'WE MAKE IT.',
  closedTitleAr: 'دفعة الكستمايز خلصت.', closedTitleEn: 'THIS CUSTOM DROP IS DONE.',
  closedAccentTitleAr: 'الجاهز لسه متاح.', closedAccentTitleEn: 'READY-MADE IS STILL HERE.',
  descriptionAr: 'حوّل كلمة، صورة أو فكرة لاستيكر على مزاجك. صمّم كل قطعة لوحدها أو كرّر التصميم اللي بتحبه.',
  descriptionEn: 'Turn a word, image or idea into a sticker made your way. Create a different design for every piece or repeat your favourite.',
  priceLabelAr: 'سعر الحجز للقطعة', priceLabelEn: 'PRE-ORDER PRICE / PIECE',
  price: 45, currencyAr: 'جنيه', currencyEn: 'EGP', minimumQuantity: 4,
  beforeShippingAr: 'قبل مصاريف الشحن', beforeShippingEn: 'before shipping',
  featuresAr: ['كل قطعة بتصميم مختلف', 'ابدأ من 4 قطع بس', 'زوّد أي عدد يناسبك'],
  featuresEn: ['A different design on every piece', 'Start with only 4 pieces', 'Add as many as you need'],
  closedMessageAr: 'سعر الحجز السابق اتقفل مع الدفعة. تقدر تطلب من الاستيكرات الجاهزة دلوقتي.',
  closedMessageEn: 'The previous pre-order price closed with that drop. Ready-made stickers are available now.',
  upcomingMessageAr: 'تفاصيل وسعر الدفعة الجاية هيظهروا هنا وقت فتح الحجز.',
  upcomingMessageEn: 'The next drop price and details will appear here when booking opens.',
  primaryOpenTextAr: 'ابدأ صمّم قطعك', primaryOpenTextEn: 'DESIGN YOUR PIECES', primaryOpenLink: '/sticker-builder',
  primaryClosedTextAr: 'شوف الاستيكرات الجاهزة', primaryClosedTextEn: 'SHOP READY-MADE', primaryClosedLink: '/stickers',
  showSecondaryButton: true, secondaryTextAr: 'شوف الاستيكرات الجاهزة', secondaryTextEn: 'SHOP READY-MADE', secondaryLink: '/stickers',
  footerOpenAr: 'الحجز 7 أيام، وبعد قفله من 3 إلى 5 أيام للتصنيع والشحن.',
  footerOpenEn: 'Book during the 7-day window. Production and shipping take 3–5 days after booking closes.',
  footerClosedAr: 'تابعنا لموعد دفعة الكستمايز الجاية.', footerClosedEn: 'Follow us for the next custom drop.',
  footerUpcomingAr: 'هنعلن وقت فتح الحجز قبل استقبال أي مدفوعات.', footerUpcomingEn: 'We will announce the booking window before accepting payments.',
  cardEyebrow: 'DUAT / CUSTOM', rangeStart: '01', rangeEnd: '04',
  imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786036786/born_at_dawn_k5gb1v.png',
  imageAltAr: 'معاينة استيكر دوات كستمايز', imageAltEn: 'DUAT custom sticker preview',
  pieceLabels: ['01', '02', '03', '04'],
  cardCaptionAr: 'كل رقم ممكن يكون تصميم مختلف', cardCaptionEn: 'Every number can be a different design'
};

const Context = createContext(null);
const SETTINGS_KEY = 'preorder_hero_settings';

export function PreorderHeroSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_PREORDER_HERO_SETTINGS);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('store_settings').select('value').eq('key', SETTINGS_KEY).maybeSingle();
    if (!error && data?.value) setSettings({ ...DEFAULT_PREORDER_HERO_SETTINGS, ...data.value });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const channel = supabase.channel('duat-preorder-hero-settings').on('postgres_changes', {
      event: '*', schema: 'public', table: 'store_settings', filter: `key=eq.${SETTINGS_KEY}`
    }, load).subscribe();
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => { supabase.removeChannel(channel); window.removeEventListener('focus', onFocus); };
  }, [load]);

  const saveSettings = useCallback(async (next) => {
    const payload = { ...DEFAULT_PREORDER_HERO_SETTINGS, ...next };
    if (isInlineStoreImage(payload.imageUrl)) {
      const uploaded = await uploadStoreImageDataUrl(payload.imageUrl, { folder: 'preorder-hero', assetId: 'main' });
      payload.imageUrl = uploaded.publicUrl;
    }
    const { data, error } = await supabase.from('store_settings').upsert({ key: SETTINGS_KEY, value: payload }, { onConflict: 'key' }).select('value').single();
    if (error) throw error;
    const saved = { ...DEFAULT_PREORDER_HERO_SETTINGS, ...(data?.value || payload) };
    setSettings(saved);
    return saved;
  }, []);

  const value = useMemo(() => ({ settings, loading, saveSettings, resetSettings: () => saveSettings(DEFAULT_PREORDER_HERO_SETTINGS) }), [settings, loading, saveSettings]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePreorderHeroSettings() {
  const value = useContext(Context);
  if (!value) throw new Error('usePreorderHeroSettings must be used inside PreorderHeroSettingsProvider');
  return value;
}
