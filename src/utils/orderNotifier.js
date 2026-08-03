// Instant Mobile Notification & Logistics Utilities for DUAT E-Commerce

export const TELEGRAM_TOKEN_KEY = 'duat_telegram_bot_token';
export const TELEGRAM_CHAT_ID_KEY = 'duat_telegram_chat_id';
export const ADMIN_WHATSAPP_NUMBER_KEY = 'duat_admin_whatsapp_number';

export const DEFAULT_ADMIN_WHATSAPP = '201000000000'; // Default phone number for WhatsApp orders

/**
 * Sends an instant push notification with sound to the store owner's Telegram app when an order is placed.
 */
export async function sendTelegramOrderNotification(order) {
  try {
    const token = localStorage.getItem(TELEGRAM_TOKEN_KEY);
    const chatId = localStorage.getItem(TELEGRAM_CHAT_ID_KEY);

    if (!token || !chatId) {
      console.log('Telegram Bot Token or Chat ID not configured in Admin Settings.');
      return false;
    }

    const itemsList = Array.isArray(order.items)
      ? order.items
          .map(
            (item, i) =>
              `${i + 1}. <b>${item.nameAr || item.nameEn}</b> x${item.quantity || 1} — ${
                item.price * (item.quantity || 1)
              } EGP`
          )
          .join('\n')
      : 'لا توجد تفاصيل للمنتجات';

    const messageText = `
🚨 <b>طلب جديد في متجر DUAT!</b>
━━━━━━━━━━━━━━━━━━
🆔 <b>رقم الطلب:</b> <code>${order.id}</code>
👤 <b>اسم العميل:</b> ${order.customerName || 'غير محدد'}
📞 <b>رقم الهاتف:</b> <code>${order.customerPhone || 'غير محدد'}</code>
📍 <b>المحافظة/العنوان:</b> ${order.customerGovernorate || ''} — ${order.customerAddress || 'غير محدد'}

🛒 <b>تفاصيل المنتجات:</b>
${itemsList}

====================
💰 <b>إجمالي المبلغ المستحق (COD):</b> <b>${order.totalPrice || order.total} EGP</b>
📅 <b>التاريخ:</b> ${new Date().toLocaleString('ar-EG')}
━━━━━━━━━━━━━━━━━━
`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML'
      })
    });

    const resData = await response.json();
    return resData.ok;
  } catch (err) {
    console.error('Failed to send Telegram mobile order notification:', err);
    return false;
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
          (item, i) =>
            `• ${item.nameAr || item.nameEn} (الكمية: ${item.quantity || 1}) - ${
              item.price * (item.quantity || 1)
            } ج.م`
        )
        .join('\n')
    : '';

  const text = `مرحباً DUAT! 👋
أرغب في تأكيد الطلب التالي عبر الموقع:

🆔 رقم الطلب: ${order.id || 'طلب جديد'}
👤 العميل: ${order.customerName || ''}
📞 الموبايل: ${order.customerPhone || ''}
📍 العنوان: ${order.customerGovernorate || ''} - ${order.customerAddress || ''}

📦 تفاصيل المنتجات:
${itemsText}

💵 الإجمالي المطلوب: ${order.totalPrice || order.total} ج.م`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Exports orders list to a downloadable CSV spreadsheet formatted for Egyptian Shipping Companies (Bosta, Aramex, Mylerz).
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
    'Total COD Amount (EGP)',
    'Order Status',
    'Date'
  ];

  const rows = orders.map((order) => {
    const itemsSummary = Array.isArray(order.items)
      ? order.items.map((i) => `${i.nameAr || i.nameEn} (x${i.quantity || 1})`).join(' + ')
      : '';
    const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-EG') : '';

    return [
      `"${order.id}"`,
      `"${(order.customerName || '').replace(/"/g, '""')}"`,
      `"${(order.customerPhone || '').replace(/"/g, '""')}"`,
      `"${(order.customerGovernorate || '').replace(/"/g, '""')}"`,
      `"${(order.customerAddress || '').replace(/"/g, '""')}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      order.totalPrice || order.total || 0,
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
