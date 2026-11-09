// IndexedDB keeps uploaded artwork out of the small localStorage quota.
const database = () => new Promise((resolve, reject) => {
  const request = window.indexedDB.open('duat-cart', 1);
  request.onupgradeneeded = () => request.result.createObjectStore('cart');
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});
export async function readCart() {
  const db = await database();
  try { return await new Promise((resolve, reject) => {
    const request = db.transaction('cart').objectStore('cart').get('current');
    request.onsuccess = () => resolve(Array.isArray(request.result?.items) && Date.now() - request.result.savedAt < 24 * 60 * 60 * 1000 ? request.result.items : []);
    request.onerror = () => reject(request.error);
  }); } finally { db.close(); }
}
export async function writeCart(items) {
  const db = await database();
  try { await new Promise((resolve, reject) => {
    const tx = db.transaction('cart', 'readwrite');
    tx.objectStore('cart').put({ items, savedAt: Date.now() }, 'current');
    tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
  }); } finally { db.close(); }
}
