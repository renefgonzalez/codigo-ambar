import { useState } from 'react'
import { LayoutGrid, SlidersHorizontal, Check } from 'lucide-react'
import { CATEGORIES, PRODUCTS } from '../data/products'
import type { CategorySlug } from '../types'

interface CategoryFilterProps {
  active: CategorySlug | 'all'
  onChange: (value: CategorySlug | 'all') => void
}

// Conteo de productos por categoría (una sola vez al cargar el módulo)
const COUNTS: Record<string, number> = PRODUCTS.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1
  return acc
}, {} as Record<string, number>)

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const [expanded, setExpanded] = useState(false)

  const chips: { value: CategorySlug | 'all'; label: string; count: number }[] = [
    { value: 'all', label: 'Todos', count: PRODUCTS.length },
    ...CATEGORIES.map((c) => ({
      value: c.slug,
      label: c.label,
      count: COUNTS[c.slug] || 0,
    })),
  ]

  const activeLabel =
    active === 'all' ? 'Todas las categorías' : CATEGORIES.find((c) => c.slug === active)?.label

  return (
    <div>
      {/* Carrusel horizontal (móvil) + botón "Ver todas" */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label="Ver todas las categorías"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition active:scale-95 ${
            expanded
              ? 'border-ambar-500 bg-ambar-500/10 text-ambar-400'
              : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>

        <div className="no-scrollbar -mx-4 flex flex-1 gap-2 overflow-x-auto px-4 py-1">
          {chips.map((chip) => {
            const isActive = active === chip.value
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => onChange(chip.value)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                  isActive
                    ? 'border-ambar-500 bg-ambar-500/10 text-ambar-400 shadow-sm shadow-ambar-500/20'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                {chip.value === 'all' && <LayoutGrid className="h-3.5 w-3.5" />}
                {chip.label}
                <span
                  className={`text-[11px] font-bold ${
                    isActive ? 'text-white/60' : 'text-slate-400'
                  }`}
                >
                  {chip.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Panel expandible: TODAS las categorías visibles en cuadrícula */}
      {expanded && (
        <div className="animate-slide-up mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-3 sm:grid-cols-3 md:grid-cols-4">
          {chips.map((chip) => {
            const isActive = active === chip.value
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => {
                  onChange(chip.value)
                  setExpanded(false)
                }}
                className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition active:scale-95 ${
                  isActive
                    ? 'bg-ambar-500/10 text-ambar-400'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  {isActive && <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />}
                  <span className="truncate">{chip.label}</span>
                </span>
                <span
                  className={`shrink-0 text-[11px] font-bold ${
                    isActive ? 'text-white/60' : 'text-slate-400'
                  }`}
                >
                  {chip.count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Migaja de categoría activa */}
      {!expanded && active !== 'all' && (
        <p className="mt-2 text-xs text-slate-500">
          Mostrando: <span className="font-semibold text-white">{activeLabel}</span>
        </p>
      )}
    </div>
  )
}
