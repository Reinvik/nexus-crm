import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/[^\x20-\x7E]/g, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim().replace(/[^\x20-\x7E]/g, '');

export let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('🔌 Supabase Client inicializado en el ecosistema.');
  } catch (err) {
    console.error('❌ Error al crear cliente Supabase:', err);
  }
}
