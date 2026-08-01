import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://pgqgmrfvsvrvbddafrcf.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_8yvV20JyWCM1qN_e5Bis5w_DvI_t1i7';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables missing. Using fallback configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
