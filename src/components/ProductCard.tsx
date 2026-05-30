import { Plus, Check, Heart } from 'lucide-react'
import type { Product } from '../types'
import { useQuote } from '../context/QuoteContext'

interface ProductCardProps {
  product: Product
  onSelect?: (product: Product) => void
  onAddedToQuote?: (product: Product) => void
}

export default function ProductCard({ product, onSelect, onAddedToQuote }: ProductCardProps) {
  const { addItem, isInQuote, toggleFavorite, isFavorite } = useQuote()
  const inQuote = isInQuote(product.id)
  const favorite = isFavorite(product.id)

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-slate-900 shadow ring-1 ring-slate-800 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ambar-500/10 hover:ring-slate-700 animate-fade-in-up">
      {/* Imagen */}
      <div 
        className="relative aspect-[4/3] overflow-hidden bg-slate-950 cursor-pointer"
        onClick={() => onSelect?.(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.hoverImageUrl && (
          <img
            src={product.hoverImageUrl}
            alt={`${product.title} encendido`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}

        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-ambar-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
            Destacado
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          aria-label="Agregar a favoritos"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-slate-400 shadow-sm backdrop-blur transition hover:bg-slate-800 hover:text-white active:scale-90"
        >
          <Heart
            className={`h-4.5 w-4.5 transition ${
              favorite ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ambar-500">
          {product.model}
        </p>
        <h3 
          className="mt-1 text-base font-bold leading-snug text-white cursor-pointer hover:underline"
          onClick={() => onSelect?.(product)}
        >
          {product.title}
        </h3>

        {/* Chips de especificaciones */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.specs.map((spec) => (
            <span
              key={spec}
              className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Botón agregar a cotización */}
        <button
          type="button"
          onClick={() => {
            if (!inQuote) {
              addItem(product)
              onAddedToQuote?.(product)
            }
          }}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition active:scale-[0.98] ${
            inQuote
              ? 'bg-slate-800 text-slate-300'
              : 'bg-ambar-500 text-white hover:bg-ambar-600'
          }`}
        >
          {inQuote ? (
            <>
              <Check className="h-4 w-4" strokeWidth={3} />
              Agregado a Cotización
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" strokeWidth={3} />
              Agregar a Cotización
            </>
          )}
        </button>
      </div>
    </div>
  )
}
