import { supabase } from './supabase';
import { PRODUCTS } from '../data/products';

export async function seedProductsToSupabase() {
  try {
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
      console.error('Failed to seed products into Supabase:', error);
      return { success: false, error };
    }

    console.log('Successfully seeded products into Supabase:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Error during product seeding:', err);
    return { success: false, error: err };
  }
}
