import { supabase } from '../lib/supabase';

import { NOTIFICATION_SETTINGS_KEY, normalizeWhatsApp } from '../domain/notificationSettings';

export async function saveNotificationSettingsToSupabase(_token, _chatId, whatsapp) {
  const value = { whatsapp: normalizeWhatsApp(whatsapp) };
  const { data, error } = await supabase.from('store_settings').upsert({ key: NOTIFICATION_SETTINGS_KEY, value, updated_at: new Date().toISOString() }, { onConflict: 'key' }).select('value').single();
  if (error || !data?.value) throw new Error('تعذر حفظ رقم الواتساب على السيرفر. حاول مرة أخرى.');
  return data.value;
}

/**
 * Generates a pre-filled WhatsApp click-to-chat URL with full order breakdown.
 */
export function generateWhatsAppOrderLink(order, phone = null) {
  const cleanPhone = normalizeWhatsApp(phone);

  const itemsText = Array.isArray(order.items)
    ? order.items
        .map(
          (item) =>
            `• ${item.nameAr || item.nameEn || item.name} (الكمية: ${item.quantity || 1}) - ${
              (item.price || 0) * (item.quantity || 1)
            } ج.م`
        )
        .join('\n')
    : '';

  const text = `مرحباً DUAT! 👋
أرغب في تأكيد الطلب التالي عبر الموقع:

🆔 رقم الطلب: ${order.ref || order.id || 'طلب جديد'}
👤 العميل: ${order.customer?.fullName || order.customerName || ''}
📞 الموبايل: ${order.customer?.phone || order.customerPhone || ''}
📍 العنوان: ${order.customer?.governorate?.nameAr || order.customerGovernorate || ''} - ${order.customer?.address || order.customerAddress || ''}

📦 تفاصيل المنتجات:
${itemsText}

💵 الإجمالي المطلوب: ${order.total || order.totalPrice || 0} ج.م`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Exports orders list to a downloadable CSV spreadsheet formatted for Egyptian Shipping Companies.
 */
function csvCell(value) {
  const raw = String(value ?? '');
  return `"${(/^[-=+@]/.test(raw) ? "'" + raw : raw).replace(/"/g, '""')}"`;
}

export function exportOrdersToCSV(orders = []) {
  if (!Array.isArray(orders) || orders.length === 0) {
    alert('لا توجد طلبات لتصديرها حالياً!');
    return;
  }

  const headers = [
    'Order ID',
    'Customer Name',
    'Customer Phone',
    'Governorate/City',
    'Full Address',
    'Items Summary',
    'Subtotal (EGP)',
    'Coupon Code',
    'Discount (EGP)',
    'Shipping (EGP)',
    'Shipping Collection',
    'Total Amount (EGP)',
    'Email',
    'Order Notes',
    'Payment Method',
    'Order Status',
    'Date'
  ];

  const rows = orders.map((order) => {
    const cust = order.customer || {};
    const itemsSummary = Array.isArray(order.items)
      ? order.items.map((i) => `${i.nameAr || i.nameEn || i.name} (x${i.quantity || 1})`).join(' + ')
      : '';
    const dateStr = order.createdAt || order.created_at ? new Date(order.createdAt || order.created_at).toLocaleDateString('ar-EG') : '';

    return [
      order.ref || order.id,
      cust.fullName || cust.name || order.customerName || '',
      cust.phone || order.customerPhone || '',
      typeof cust.governorate === 'object' ? (cust.governorate?.nameAr || '') : (cust.governorate || order.customerGovernorate || ''),
      cust.address || order.customerAddress || '',
      itemsSummary,
      order.subtotal ?? '',
      order.couponCode || order.coupon_code || '',
      order.discount ?? 0,
      order.shippingFee ?? order.shipping_fee ?? '',
      cust.shippingMode === 'later' ? 'Separate before dispatch' : 'Included in total',
      order.total ?? order.totalPrice ?? 0,
      cust.email || '',
      cust.notes || '',
      cust.payment?.titleAr || order.payment_method || order.paymentMethod || 'cod',
      order.status || 'placed',
      dateStr
    ].map(csvCell);
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `DUAT_Shipping_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
