
import { createClient } from '@supabase/supabase-js';

// Tenta pegar as variáveis de ambiente
// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL ou Key não encontrados. O banco de dados não funcionará corretamente.');
}

// Cria a instância do cliente Supabase
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
