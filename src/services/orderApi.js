import { supabase } from '../lib/supabase';

async function apiRequest(path, body, options = {}) {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {})
    },
    body: JSON.stringify(body || {})
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success === false) throw new Error(result.error || 'Request failed');
  return result;
}

function cleanText(value, maxLength = 500) {
  return typeof value === 'string' ? value.slice(0, maxLength) : value;
}

export function compactCartItems(items) {
  return (Array.isArray(items) ? items : []).map((item) => {
    const customDetails = item.customDetails || {};
    return {
      id: cleanText(item.id, 100),
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
      design_image_path: cleanText(item.design_image_path || customDetails.design_image_path),
      design_upload_token: cleanText(item.design_upload_token || customDetails.design_upload_token, 80),
      customDetails: {
        mode: customDetails.mode,
        customText: cleanText(customDetails.customText, 120),
        selectedFont: cleanText(customDetails.selectedFont, 40),
        textColor: cleanText(customDetails.textColor, 20),
        bgFinish: cleanText(customDetails.bgFinish, 40),
        cutShape: cleanText(customDetails.cutShape, 40),
        designNotes: cleanText(customDetails.designNotes, 500),
        selectedItems: Array.isArray(customDetails.selectedItems)
          ? customDetails.selectedItems.slice(0, 12).map((selected) => ({
              id: cleanText(selected?.id, 80),
              nameAr: cleanText(selected?.nameAr, 120),
              nameEn: cleanText(selected?.nameEn, 120)
            }))
          : []
      }
    };
  });
}

export async function uploadOrderFile(file, purpose) {
  if (!(file instanceof Blob) || !file.type || !file.size) throw new Error('Invalid upload');
  const { upload } = await apiRequest('/api/create-upload', {
    purpose,
    contentType: file.type,
    byteSize: file.size
  });
  const { error } = await supabase.storage
    .from(upload.bucket)
    .uploadToSignedUrl(upload.path, upload.signedToken, file, { contentType: file.type });
  if (error) throw new Error('File upload failed');
  return { bucket: upload.bucket, path: upload.path, claimToken: upload.claimToken };
}

export async function uploadDesignDataUrl(dataUrl) {
  const response = await fetch(dataUrl);
  return uploadOrderFile(await response.blob(), 'order-design');
}

export async function quoteOrder({ items, couponCode, governorateId }) {
  const result = await apiRequest('/api/quote-order', {
    items: compactCartItems(items),
    couponCode,
    governorateId
  });
  return result.quote;
}

export async function createOrder(payload) {
  const result = await apiRequest('/api/create-order', {
    ...payload,
    items: compactCartItems(payload.items)
  });
  return result.order;
}

export async function trackOrder(reference) {
  const result = await apiRequest('/api/track-order', { reference });
  return result.order;
}

export async function testOrderNotification() {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error('Unauthorized');
  await apiRequest('/api/test-notification', {}, { accessToken });
}
