import { createClient } from '@supabase/supabase-js';
import {
  PRODUCTS,
  ARABIC_LETTER_PRODUCTS,
  ENGLISH_LETTER_PRODUCTS,
  MONTH_STICKER_PRODUCTS,
  YEAR_STICKER_PRODUCTS
} from '../src/data/products.js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

if (!process.argv.includes('--apply')) {
  console.error('This script writes catalogue data. Re-run with --apply after reviewing the target project.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const catalogue = [
  ...PRODUCTS,
  ...ARABIC_LETTER_PRODUCTS,
  ...ENGLISH_LETTER_PRODUCTS,
  ...MONTH_STICKER_PRODUCTS,
  ...YEAR_STICKER_PRODUCTS
];

async function seed() {
  console.info(`Seeding ${catalogue.length} products into Supabase...`);
  const productsToUpsert = catalogue.map((product) => ({
    id: product.id,
    category: product.category || 'cases',
    price: Number(product.price) || 0,
    is_active: product.is_active !== false,
    case_type_id: product.caseTypeId || null,
    data: {
      ...product,
      nameEn: product.nameEn || '',
      nameAr: product.nameAr || '',
      imageUrl: product.imageUrl || product.image || ''
    }
  }));

  const { data, error } = await supabase
    .from('products')
    .upsert(productsToUpsert, { onConflict: 'id' })
    .select('id');

  if (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
    return;
  }
  console.info(`Seed complete: ${data?.length || 0} products upserted.`);
}

seed();
