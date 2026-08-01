import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = match[2] ? match[2].trim() : '';
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log(`Seeding ${PRODUCTS.length} products into Supabase...`);
  const productsToUpsert = PRODUCTS.map((product) => ({
    id: product.id,
    category: product.category || 'cases',
    price: Number(product.price) || 0,
    is_active: true,
    data: product
  }));

  const { data, error } = await supabase
    .from('products')
    .upsert(productsToUpsert, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('Seeding error (Note: writes require authenticated admin if RLS is enforced):', error.message);
  } else {
    console.log('Seeding success! Products inserted/updated:', data?.length);
  }
}

seed();
