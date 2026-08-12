function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendTrustedOrderNotification(order) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { delivered: false, reason: 'not_configured' };

  const customer = order.customer || {};
  const governorate = customer.governorate || {};
  const items = Array.isArray(order.items) ? order.items : [];
  const itemLines = items.map((item, index) => {
    const name = escapeHtml(item.nameAr || item.nameEn || 'منتج DUAT');
    const quantity = Number(item.quantity) || 1;
    const lineTotal = (Number(item.price) || 0) * quantity;
    return `${index + 1}. <b>${name}</b> ×${quantity} — ${lineTotal.toLocaleString('ar-EG')} EGP`;
  });

  const text = [
    '🚨 <b>طلب جديد في متجر DUAT</b>',
    '━━━━━━━━━━━━━━━━━━',
    `🆔 <b>رقم الطلب:</b> <code>${escapeHtml(order.ref)}</code>`,
    `👤 <b>العميل:</b> ${escapeHtml(customer.fullName || customer.name)}`,
    `📞 <b>الموبايل:</b> <code>${escapeHtml(customer.phone)}</code>`,
    `📍 <b>المحافظة:</b> ${escapeHtml(governorate.nameAr || governorate.nameEn)}`,
    `🏠 <b>العنوان:</b> ${escapeHtml(customer.address)}`,
    `💳 <b>الدفع:</b> ${escapeHtml(String(order.payment_method || 'cod').toUpperCase())}`,
    '',
    '<b>المنتجات:</b>',
    ...itemLines,
    '',
    `💰 <b>الإجمالي:</b> ${Number(order.total || 0).toLocaleString('ar-EG')} EGP`
  ].join('\n');

  let lastError = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
      });
      if (response.ok) return { delivered: true };
      lastError = `telegram_${response.status}`;
    } catch (error) {
      lastError = error?.message || 'telegram_network_error';
    }
  }

  return { delivered: false, reason: lastError };
}

export async function sendTestNotification() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error('SERVICE_NOT_CONFIGURED');

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: '✅ <b>DUAT</b> — إعدادات إشعارات الطلبات تعمل بأمان من السيرفر.',
      parse_mode: 'HTML'
    })
  });

  if (!response.ok) throw new Error('NOTIFICATION_FAILED');
}
