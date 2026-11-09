export const BUILDER_COLORS = [
  ['ivory', '#EFEAE0', 'عاجي', 'Ivory'], ['white', '#FFFFFF', 'أبيض', 'White'],
  ['ink', '#171B2E', 'كحلي حبر', 'Ink navy'], ['black', '#171717', 'أسود', 'Black'],
  ['sand', '#D8BC90', 'رملي', 'Sand'], ['ochre', '#C58A32', 'أصفر دافئ', 'Ochre'],
  ['coffee', '#654436', 'بني قهوة', 'Coffee'], ['terracotta', '#B95C45', 'طوبي', 'Terracotta'],
  ['burgundy', '#772F43', 'نبيتي', 'Burgundy'], ['red', '#BC3543', 'أحمر', 'Red'],
  ['rose', '#D998AA', 'وردي', 'Rose'], ['blush', '#F0D5DC', 'وردي فاتح', 'Blush'],
  ['lavender', '#B8A9D1', 'لافندر', 'Lavender'], ['blue', '#426791', 'أزرق', 'Blue'],
  ['forest', '#2E5748', 'أخضر غامق', 'Forest'], ['sage', '#9EAF96', 'أخضر هادي', 'Sage']
].map(([id, color, nameAr, nameEn]) => ({ id, color, nameAr, nameEn }));
export const BUILDER_FONTS = [
  { id: 'cairo', family: 'Cairo', ar: 'كايرو — واضح', en: 'Cairo' },
  { id: 'camel', family: 'The Year of The Camel', ar: 'خط دوات', en: 'DUAT' },
  { id: 'amiri', family: 'Amiri', ar: 'أميري — كلاسيكي', en: 'Amiri' },
  { id: 'space', family: 'Space Grotesk', ar: 'Space — إنجليزي', en: 'Space Grotesk' }
];
export function contrastRatio(a, b) {
  const luminance = hex => {
    const rgb = hex.match(/[a-f\d]{2}/gi).map(n => parseInt(n, 16) / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
export function textLines(ctx, text, maxWidth) {
  const tokens = String(text).trim().split(/\s+/).filter(Boolean), lines = [];
  let line = '';
  for (const token of tokens) {
    const candidate = line ? `${line} ${token}` : token;
    if (ctx.measureText(candidate).width <= maxWidth) { line = candidate; continue; }
    if (line) { lines.push(line); line = ''; }
    for (const char of Array.from(token)) {
      if (line && ctx.measureText(line + char).width > maxWidth) { lines.push(line); line = ''; }
      line += char;
    }
  }
  if (line) lines.push(line);
  return lines;
}
export function textStickerLayout(ctx, { text, shape, fontFamily }) {
  const width = shape === 'circle' ? 640 : 800;
  let size = 180, lines;
  do {
    ctx.font = `700 ${size}px "${fontFamily}", "Cairo", sans-serif`;
    lines = textLines(ctx, text, width); size -= 4;
  } while ((lines.length > 3 || lines.length * (size + 4) * 1.65 > 620) && size > 40);
  size += 4;
  return { size, lines };
}
export function drawTextSticker(canvas, { text, shape, textColor, background, fontFamily, resolution = 1000 }) {
  canvas.width = canvas.height = resolution;
  const ctx = canvas.getContext('2d');
  ctx.save(); ctx.scale(resolution / 1000, resolution / 1000); ctx.beginPath();
  if (shape === 'circle') ctx.arc(500, 500, 500, 0, 2 * Math.PI);
  else ctx.roundRect(0, 0, 1000, 1000, 48);
  ctx.clip(); ctx.fillStyle = background; ctx.fillRect(0, 0, 1000, 1000);
  const { size, lines } = textStickerLayout(ctx, { text, shape, fontFamily });
  ctx.fillStyle = textColor; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.direction = /[\u0600-\u06ff]/.test(text) ? 'rtl' : 'ltr';
  lines.forEach((line, i) => ctx.fillText(line, 500, 500 + (i - (lines.length - 1) / 2) * size * 1.65));
  ctx.restore();
}
export function canvasBlob(canvas) {
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('ARTWORK_EXPORT_FAILED')), 'image/png'));
}
export function blobDataUrl(blob) {
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob); });
}
