import React, { useState } from 'react';

function GalleryImage({ src, active, alt, isAr }) {
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const retry = () => { setStatus('loading'); setAttempt(value => value + 1); };
  const retrySrc = attempt ? `${src}${src.includes('?') ? '&' : '?'}duat_retry=${attempt}` : src;
  return <div className={`absolute inset-0 ${active ? '' : 'invisible'}`} aria-hidden={!active}>
    <img key={retrySrc} src={retrySrc} alt={active ? alt : ''}
      onLoad={() => setStatus('loaded')} onError={() => setStatus('error')}
      className={`h-full w-full object-contain drop-shadow-2xl ${status === 'loaded' ? '' : 'invisible'}`} />
    {active && status === 'loading' && <div role="status" className="absolute inset-0 flex items-center justify-center text-xs text-ash">
      {isAr ? 'جاري تحميل الصورة…' : 'Loading image…'}
    </div>}
    {active && status === 'error' && <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center text-sm text-ash">
      <span>{isAr ? 'تعذّر تحميل الصورة.' : 'Could not load this image.'}</span>
      <button type="button" onClick={retry} className="min-h-11 border border-grave px-4 text-gold">
        {isAr ? 'إعادة المحاولة' : 'Try again'}
      </button>
    </div>}
  </div>;
}

// Keep visited images mounted: returning to 01 must not cancel/restart its load.
// The parent keys this gallery by cloud image URLs so a saved change starts at 01.
export function PreorderHeroGallery({ images, labels, alt, isAr }) {
  const [selected, setSelected] = useState(images[0]?.index);
  const [visited, setVisited] = useState(() => new Set([images[0]?.index]));
  const choose = index => { setSelected(index); setVisited(current => new Set([...current, index])); };
  return <>
    <div className="relative mx-auto aspect-square w-full max-w-sm" data-preorder-gallery-image>
      {images.filter(image => visited.has(image.index)).map(image => <GalleryImage
        key={`${image.index}:${image.src}`} src={image.src} active={selected === image.index} alt={alt} isAr={isAr} />)}
    </div>
    <div className="mt-5 grid grid-cols-4 gap-2" aria-label={isAr ? 'معاينات الاستيكرات' : 'Sticker previews'}>
      {images.map(({ index }) => <button type="button" key={index} aria-pressed={selected === index}
        onClick={() => choose(index)}
        className={`min-h-11 border py-3 text-center font-mono text-xs ${selected === index ? 'border-gold bg-gold text-ink' : 'border-grave bg-coal text-gold hover:border-gold'}`}>
        {labels?.[index] || String(index + 1).padStart(2, '0')}
      </button>)}
    </div>
  </>;
}
