import { supabase } from '../lib/supabase';

export const ADMIN_WHATSAPP_NUMBER_KEY = 'duat_admin_whatsapp_number';
export const DEFAULT_ADMIN_WHATSAPP = '201000000000';

export async function saveNotificationSettingsToSupabase(_token, _chatId, whatsapp) {
  const cleanWa = (whatsapp || '').trim();
  if (cleanWa) localStorage.setItem(ADMIN_WHATSAPP_NUMBER_KEY, cleanWa);
  try {
    await supabase.from('builder_settings').upsert({
      id: 'global-builder-config',
      admin_whatsapp: cleanWa,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Failed saving whatsapp setting to Supabase:', err.message);
  }
}

/**
 * Generates a pre-filled WhatsApp click-to-chat URL with full order breakdown.
 */
export function generateWhatsAppOrderLink(order, phone = null) {
  const targetPhone = phone || localStorage.getItem(ADMIN_WHATSAPP_NUMBER_KEY) || DEFAULT_ADMIN_WHATSAPP;
  const cleanPhone = targetPhone.replace(/[^0-9]/g, '');

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
    'Total Amount (EGP)',
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
      `"${order.ref || order.id}"`,
      `"${(cust.fullName || cust.name || order.customerName || '').replace(/"/g, '""')}"`,
      `"${(cust.phone || order.customerPhone || '').replace(/"/g, '""')}"`,
      `"${(typeof cust.governorate === 'object' ? (cust.governorate.nameAr || '') : (cust.governorate || order.customerGovernorate || '')).replace(/"/g, '""')}"`,
      `"${(cust.address || order.customerAddress || '').replace(/"/g, '""')}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      order.total || order.totalPrice || 0,
      `"${(order.payment_method || order.paymentMethod || 'cod').toUpperCase()}"`,
      `"${order.status || 'معلق'}"`,
      `"${dateStr}"`
    ];
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
}
