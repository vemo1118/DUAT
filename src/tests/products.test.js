import { describe, expect, it } from 'vitest';
import { YEAR_STICKER_PRODUCTS } from '../data/products';

describe('Made In year sticker catalog', () => {
  it('includes every year from 2000 through 2026 with no gaps', () => {
    const yearIds = YEAR_STICKER_PRODUCTS
      .map((product) => product.id)
      .filter((id) => /^year-\d{4}$/.test(id));

    const expectedIds = Array.from(
      { length: 27 },
      (_, index) => `year-${2000 + index}`
    );

    expect(yearIds).toEqual(expectedIds);
    expect(new Set(yearIds).size).toBe(expectedIds.length);
  });

  it('keeps the separate 199X badge', () => {
    expect(YEAR_STICKER_PRODUCTS.some((product) => product.id === 'year-199x')).toBe(true);
  });
});
