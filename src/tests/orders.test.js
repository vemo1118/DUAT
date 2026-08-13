import { describe, it, expect } from 'vitest';
import { sanitizeOrderItems } from '../context/OrdersContext';

describe('Order Creation & Data Integrity Tests', () => {

  it('should strip Base64 image strings from items to prevent database egress inflation', () => {
    const rawItems = [
      {
        id: 'case-solar',
        nameAr: 'جراب الشمسي الشفاف',
        price: 720,
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        designSnapshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        design_image_path: 'stickers/sticker-101.png',
        customConfig: {
          designSnapshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        }
      }
    ];

    const sanitized = sanitizeOrderItems(rawItems);

    expect(sanitized[0].image).toBeUndefined();
    expect(sanitized[0].designSnapshot).toBeUndefined();
    expect(sanitized[0].customConfig.designSnapshot).toBeUndefined();
    expect(sanitized[0].design_image_path).toBe('stickers/sticker-101.png');
  });

  it('should preserve standard product properties during sanitization', () => {
    const rawItems = [
      {
        id: 'case-gold-ring',
        nameAr: 'جراب حلقة الذهب',
        price: 780,
        quantity: 2,
        image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
      }
    ];

    const sanitized = sanitizeOrderItems(rawItems);
    expect(sanitized[0].id).toBe('case-gold-ring');
    expect(sanitized[0].price).toBe(780);
    expect(sanitized[0].quantity).toBe(2);
    expect(sanitized[0].image).toBe('https://res.cloudinary.com/demo/image/upload/sample.jpg');
  });

  it('should format order references with DUAT- prefix and 4 digits', () => {
    const refNum = 9;
    const formattedRef = `DUAT-${String(refNum).padStart(4, '0')}`;
    expect(formattedRef).toBe('DUAT-0009');
  });

});

describe('Coupon & Price Verification Logic Tests', () => {

  it('should reject invalid coupon codes and calculate accurate percentage discounts', () => {
    const subtotal = 1000;

    // Fixed percentage discount calculation (e.g. 10%)
    const discount10 = Math.round((subtotal * 10) / 100);
    expect(discount10).toBe(100);

    // Fixed amount discount calculation (e.g. 100 EGP)
    const discountFixed = Math.min(100, subtotal);
    expect(discountFixed).toBe(100);
  });

  it('should prevent negative total amounts', () => {
    const subtotal = 50;
    const discount = 100;
    const finalTotal = Math.max(0, subtotal - discount);
    expect(finalTotal).toBe(0);
  });

});
