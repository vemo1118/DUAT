// Phone sticker artwork: preserve source proportions inside the selected frame.
export function imageLayout(width, height, shape = 'auto') {
  const ratio = Math.min(1000, Math.max(0.001, Number(width) / Number(height) || 1));
  const frameRatio = shape === 'auto' ? ratio : shape === 'oval' ? 1.5 : 1;
  const widthMm = frameRatio >= 1 ? 25 : 25 * frameRatio;
  const heightMm = frameRatio >= 1 ? 25 / frameRatio : 25;
  return { widthMm: +widthMm.toFixed(2), heightMm: +heightMm.toFixed(2), ratio: frameRatio };
}

export async function renderImageSticker(source, { shape, background, border, scale }) {
  const image = new Image();
  image.src = source;
  await image.decode();
  const layout = imageLayout(image.naturalWidth, image.naturalHeight, shape);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(layout.widthMm * 40));
  canvas.height = Math.max(1, Math.round(layout.heightMm * 40));
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const rounded = shape === 'circle' || shape === 'oval';
  ctx.beginPath();
  if (rounded) ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  else ctx.roundRect(0, 0, w, h, Math.min(w, h) * 0.05);
  ctx.clip();
  ctx.fillStyle = { ivory: '#efeae0', obsidian: '#121214', clear: 'rgba(0,0,0,0)', 'gold-foil': '#e0a93b', amber: '#e6b36a' }[background] || '#efeae0';
  ctx.fillRect(0, 0, w, h);
  // An inscribed box keeps every corner of the photo inside an oval/circle.
  const padding = rounded ? 0.67 : 0.92;
  const fit = Math.min(w / image.naturalWidth, h / image.naturalHeight) * padding * Math.min(100, Math.max(50, scale)) / 100;
  const iw = image.naturalWidth * fit, ih = image.naturalHeight * fit;
  ctx.drawImage(image, (w - iw) / 2, (h - ih) / 2, iw, ih);
  if (border !== 'none') {
    ctx.strokeStyle = { gold: '#e0a93b', white: '#ffffff', black: '#121214' }[border] || '#ffffff';
    ctx.lineWidth = Math.min(w, h) * 0.04;
    ctx.stroke();
  }
  return canvas.toDataURL('image/png');
}
