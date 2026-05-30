// ─────────────────────────────────────────────────────────────
// Tipos de dominio — Código Ámbar
// Estos tipos están alineados con el esquema previsto en Supabase
// (tabla "products" y "categories"), para una migración sin fricción.
// ─────────────────────────────────────────────────────────────

export type CategorySlug =
  | 'torretas'
  | 'mini-torretas'
  | 'barras-leds'
  | 'burbujas'
  | 'luces-visera'
  | 'luces-parrilla'
  | 'estrobos'
  | 'sirenas'
  | 'bocinas'
  | 'emergencia'
  | 'alarmas-reversa'
  | 'controladores'
  | 'radios'
  | 'accesorios'

export interface Category {
  slug: CategorySlug
  label: string
}

export interface Product {
  id: string
  title: string
  model: string
  category: CategorySlug
  /** Color/uso (Rojo/Azul, Ámbar, Rojo, Moto) — vacío si no aplica */
  color?: string
  /** Marca/fabricante (EPCOM, ECCO, MegaLux…) — opcional */
  brand?: string
  description: string
  /** Especificaciones técnicas cortas para mostrar como chips */
  specs: string[]
  imageUrl: string
  hoverImageUrl?: string
  featured?: boolean
}

/** Línea dentro de la lista de cotización (producto + cantidad) */
export interface QuoteItem {
  product: Product
  quantity: number
}

/** Datos del cliente capturados en el checkout */
export interface CustomerInfo {
  fullName: string
  whatsapp: string
  city: string
  company?: string
  notes?: string
}
