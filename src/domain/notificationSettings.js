import { normalizeEgyptianPhone } from './customerDetails';
export const NOTIFICATION_SETTINGS_KEY = 'notification_settings';
export const DEFAULT_NOTIFICATION_SETTINGS = { whatsapp: '' };
export function normalizeWhatsApp(value) {
  let phone = normalizeEgyptianPhone(value).replace(/^\+/, '').replace(/^00/, '');
  if (phone.startsWith('01')) phone = '20' + phone.slice(1);
  if (!/^201[0125]\d{8}$/.test(phone)) throw new Error('اكتب رقم واتساب مصري صحيح، مثل 01012345678 أو 201012345678.');
  return phone;
}
