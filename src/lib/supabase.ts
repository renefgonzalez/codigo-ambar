import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Product } from '../types'
import { PRODUCTS } from '../data/products'

// ─────────────────────────────────────────────────────────────
// Capa de datos — preparada para Supabase
//
// Hoy la app usa MOCK DATA (src/data/products.ts). Cuando se
// configuren las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
// en el archivo .env, esta capa se conecta automáticamente a la
// tabla "products" sin tocar los componentes.
// ─────────────────────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

/**
 * Obtiene los productos del catálogo.
 * - Si Supabase está configurado → consulta la tabla "products".
 * - Si no → devuelve los datos mock locales.
 */
export async function getProducts(): Promise<Product[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('featured', { ascending: false })

    if (error) {
      console.error('[Supabase] Error al cargar productos:', error.message)
      return PRODUCTS
    }
    return (data as Product[]) ?? PRODUCTS
  }

  // Fallback: datos de prueba locales
  return PRODUCTS
}
