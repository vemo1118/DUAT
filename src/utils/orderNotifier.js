import { supabase } from '../lib/supabase';

export const TELEGRAM_TOKEN_KEY = 'duat_telegram_bot_token';
export const TELEGRAM_CHAT_ID_KEY = 'duat_telegram_chat_id';
export const ADMIN_WHATSAPP_NUMBER_KEY = 'duat_admin_whatsapp_number';

export const DEFAULT_ADMIN_WHATSAPP = '201000000000'; // Default phone number for WhatsApp orders

let cachedCredentials = {
  token: typeof window !== 'undefined' ? localStorage.getItem(TELEGRAM_TOKEN_KEY) || '' : '',
  chatId: typeof window !== 'undefined' ? localStorage.getItem(TELEGRAM_CHAT_ID_KEY) || '' : ''
};

export function getTelegramCredentials() {
  let token = localStorage.getItem(TELEGRAM_TOKEN_KEY) || cachedCredentials.token;
  let chatId = localStorage.getItem(TELEGRAM_CHAT_ID_KEY) || cachedCredentials.chatId;

  return { token: token ? token.trim() : '', chatId: chatId ? chatId.trim() : '' };
}

export async function saveNotificationSettingsToSupabase(token, chatId, whatsapp) {
  const cleanToken = (token || '').trim();
  const cleanChatId = (chatId || '').trim();
  const cleanWa = (whatsapp || '').trim();

  if (cleanToken) localStorage.setItem(TELEGRAM_TOKEN_KEY, cleanToken);
  if (cleanChatId) localStorage.setItem(TELEGRAM_CHAT_ID_KEY, cleanChatId);
  if (cleanWa) localStorage.setItem(ADMIN_WHATSAPP_NUMBER_KEY, cleanWa);

  cachedCredentials = {
    token: cleanToken || cachedCredentials.token,
    chatId: cleanChatId || cachedCredentials.chatId
  };

  try {
    await supabase.from('builder_settings').upsert({
      id: 'global-builder-config',
      telegram_token: cleanToken,
      telegram_chat_id: cleanChatId,
      admin_whatsapp: cleanWa,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Failed saving telegram credentials to Supabase:', err);
  }
}

/**
 * Sends an instant push notification with sound to the store owner's Telegram app when an order is placed.
 */
export async function sendTelegramOrderNotification(order) {
  try {
    let { token, chatId } = getTelegramCredentials();

    if (!token || !chatId) {
      try {
        const { data } = await supabase.from('builder_settings').select('telegram_token, telegram_chat_id, admin_whatsapp').eq('id', 'global-builder-config').maybeSingle();
        if (data) {
          if (data.telegram_token) {
            token = data.telegram_token.trim();
            localStorage.setItem(TELEGRAM_TOKEN_KEY, token);
          }
          if (data.telegram_chat_id) {
            chatId = data.telegram_chat_id.trim();
            localStorage.setItem(TELEGRAM_CHAT_ID_KEY, chatId);
          }
          if (data.admin_whatsapp) {
            localStorage.setItem(ADMIN_WHATSAPP_NUMBER_KEY, data.admin_whatsapp.trim());
          }
          cachedCredentials = { token, chatId };
        }
      } catch (dbErr) {
        console.warn('Could not fetch Telegram settings from Supabase:', dbErr);
      }
    }

    if (!token || !chatId) {
      console.warn('Telegram Bot Token or Chat ID not configured in Admin Settings or Supabase DB.');
      return false;
    }

    const customerName = order.customerName || order.customer?.fullName || order.customer?.name || 'عميل DUAT';
    const customerPhone = order.customerPhone || order.customer?.phone || 'غير محدد';
    const govObj = order.customerGovernorate || order.customer?.governorate;
    const customerGov = typeof govObj === 'object' ? (govObj?.nameAr || govObj?.nameEn || '') : (govObj || '');
    const customerAddr = order.customerAddress || order.customer?.address || 'عنوان مباشر';
    const totalAmount = order.totalPrice || order.total || 0;
    const orderItems = order.items || order.cartItems || [];

    const itemsList = Array.isArray(orderItems) && orderItems.length > 0
      ? orderItems
          .map(
            (item, i) =>
              `${i + 1}. <b>${item.nameAr || item.nameEn}</b> x${item.quantity || 1} — ${
                (item.price || 0) * (item.quantity || 1)
              } EGP`
          )
          .join('\n')
      : '• منتج مخصص من المتجر';

    const messageText = `
🚨 <b>طلب جديد في متجر DUAT!</b>
━━━━━━━━━━━━━━━━━━
🆔 <b>رقم الطلب:</b> <code>${order.id || order.ref}</code>
👤 <b>اسم العميل:</b> ${customerName}
📞 <b>رقم الهاتف:</b> <code>${customerPhone}</code>
📍 <b>المحافظة/العنوان:</b> ${customerGov} — ${customerAddr}

🛒 <b>تفاصيل المنتجات:</b>
${itemsList}

====================
💰 <b>إجمالي المبلغ المستحق (COD):</b> <b>${totalAmount} EGP</b>
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

export async function sendTestTelegramNotification() {
  const testOrder = {
    id: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: 'عميل تجريبي (اختبار النظام)',
    customerPhone: '01012345678',
    customerGovernorate: 'القاهرة',
    customerAddress: 'شارع المعز - وسط البلد',
    totalPrice: 850,
    items: [
      { nameAr: 'جراب الحلقة الذهبية (ماج سيف)', quantity: 1, price: 850 }
    ]
  };
  return await sendTelegramOrderNotification(testOrder);
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

/**
 * Calculates the next sequential order ref (DUAT-0001, DUAT-0002, etc.).
 * Resets to DUAT-0001 if all orders are wiped.
 */
export async function generateSequentialOrderRef(currentOrders = []) {
  let activeOrders = currentOrders;

  try {
    const { data } = await supabase.from('orders').select('id, ref');
    if (Array.isArray(data)) {
      activeOrders = data;
    }
  } catch (err) {
    console.warn('Failed fetching active orders count for sequential ref:', err);
  }

  if (!Array.isArray(activeOrders) || activeOrders.length === 0) {
    return 'DUAT-0001';
  }

  let maxNum = 0;
  for (const ord of activeOrders) {
    const code = ord.id || ord.ref || '';
    const match = code.match(/DUAT-(\d+)/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }

  const nextNum = maxNum + 1;
  return `DUAT-${String(nextNum).padStart(4, '0')}`;
}

/**
 * Wipes all orders from Supabase database, local storage, and uploaded files.
 */
export async function wipeAllOrdersAndStorage() {
  localStorage.removeItem('duat_customer_orders');
  localStorage.removeItem('duat_latest_order_ref');

  try {
    const { data: sel } = await supabase.from('orders').select('id');
    if (sel && sel.length > 0) {
      const ids = sel.map((o) => o.id);
      await supabase.from('orders').delete().in('id', ids);
    }
    await supabase.from('orders').delete().neq('id', 'dummy_wipe_id');

    const { data: files } = await supabase.storage.from('payment-proofs').list();
    if (files && files.length > 0) {
      await supabase.storage.from('payment-proofs').remove(files.map((f) => f.name));
    }
    return true;
  } catch (err) {
    console.error('Wipe orders error:', err);
    return false;
  }
}
