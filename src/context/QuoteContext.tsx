import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Product, QuoteItem } from '../types'

interface QuoteContextValue {
  // Cotización
  items: QuoteItem[]
  totalItems: number
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearQuote: () => void
  isInQuote: (productId: string) => boolean

  // Favoritos
  favorites: string[]
  totalFavorites: number
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
}

const QuoteContext = createContext<QuoteContextValue | undefined>(undefined)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([])
  
  // Inicializamos favorites desde localStorage de forma perezosa
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('codigo-ambar-favorites')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Guardamos en localStorage cada que cambia
  useEffect(() => {
    localStorage.setItem('codigo-ambar-favorites', JSON.stringify(favorites))
  }, [favorites])

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.product.id === product.id)
      if (existing) {
        return prev.map((it) =>
          it.product.id === product.id ? { ...it, quantity: it.quantity + 1 } : it,
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((it) => it.product.id !== productId))
  }

  const setQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((it) => (it.product.id === productId ? { ...it, quantity } : it)),
    )
  }

  const clearQuote = () => setItems([])

  const isInQuote = (productId: string) =>
    items.some((it) => it.product.id === productId)

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    )
  }

  const isFavorite = (productId: string) => favorites.includes(productId)

  const totalItems = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items],
  )

  const value: QuoteContextValue = {
    items,
    totalItems,
    addItem,
    removeItem,
    setQuantity,
    clearQuote,
    isInQuote,
    favorites,
    totalFavorites: favorites.length,
    toggleFavorite,
    isFavorite,
  }

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error('useQuote debe usarse dentro de <QuoteProvider>')
  return ctx
}
