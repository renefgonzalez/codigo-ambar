import { useState } from 'react'
import { Plus, Minus, ArrowLeft, Heart, Check } from 'lucide-react'
import type { Product } from '../types'
import { useQuote } from '../context/QuoteContext'

interface ProductDetailProps {
  product: Product
  onBack: () => void
  onAddedToQuote?: () => void
}

export default function ProductDetail({ product, onBack, onAddedToQuote }: ProductDetailProps) {
  const { addItem, isInQuote, toggleFavorite, isFavorite, setQuantity, items } = useQuote()
  
  const inQuote = isInQuote(product.id)
  const favorite = isFavorite(product.id)
  
  // Si ya está en cotización, mostramos la cantidad actual, sino empezamos en 1
  const existingItem = items.find(it => it.product.id === product.id)
  const initialQuantity = existingItem ? existingItem.quantity : 1
  
  const [localQuantity, setLocalQuantity] = useState(initialQuantity)

  const handleDecrease = () => {
    if (localQuantity > 1) {
      setLocalQuantity(localQuantity - 1)
      if (inQuote) {
        setQuantity(product.id, localQuantity - 1)
      }
    }
  }

  const handleIncrease = () => {
    setLocalQuantity(localQuantity + 1)
    if (inQuote) {
      setQuantity(product.id, localQuantity + 1)
    }
  }

  const handleAdd = () => {
    if (!inQuote) {
      // Agrega 1 por defecto (QuoteContext lo hace) y luego ajustamos la cantidad
      addItem(product)
      setQuantity(product.id, localQuantity)
      onAddedToQuote?.()
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        type="button"
        onClick={onBack}
        className="group mb-6 flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
        Volver al catálogo
      </button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
        {/* Columna Izquierda: Galería */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-4 shadow-xl ring-1 ring-slate-800 sm:p-8">
          <div className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-950">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
            {product.featured && (
              <span className="absolute left-4 top-4 rounded-full bg-ambar-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow">
                Destacado
              </span>
            )}
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              aria-label="Agregar a favoritos"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-slate-400 shadow backdrop-blur transition hover:bg-slate-800 hover:text-white hover:scale-105 active:scale-95"
            >
              <Heart
                className={`h-5 w-5 transition ${
                  favorite ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Columna Derecha: Información y Control */}
        <div className="flex flex-col py-2 sm:py-6">
          <p className="text-sm font-bold uppercase tracking-widest text-ambar-500">
            {product.model}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {product.title}
          </h1>

          {/* Chips de especificaciones */}
          <div className="mt-6 flex flex-wrap gap-2">
            {product.specs.map((spec) => (
              <span
                key={spec}
                className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300"
              >
                {spec}
              </span>
            ))}
          </div>

          <div className="mt-8 flex-1">
            <h3 className="font-semibold text-white">Descripción detallada</h3>
            <p className="mt-3 leading-relaxed text-slate-400">
              {product.description}
            </p>
          </div>

          {/* Controles de Cotización */}
          <div className="mt-10 border-t border-slate-800 pt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              {/* Selector de cantidad */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold text-white">Cantidad</span>
                <div className="flex h-12 items-center rounded-xl border border-slate-800 bg-slate-900 p-1">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={localQuantity <= 1}
                    className="flex h-full w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" strokeWidth={3} />
                  </button>
                  <span className="flex w-12 items-center justify-center font-bold text-white">
                    {localQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrease}
                    className="flex h-full w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  >
                    <Plus className="h-4 w-4" strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* Botón Acción Principal */}
              <button
                type="button"
                onClick={handleAdd}
                className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-8 text-base font-bold transition active:scale-[0.98] sm:ml-auto ${
                  inQuote
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-ambar-500 text-white shadow-lg shadow-ambar-500/20 hover:bg-ambar-600 hover:shadow-ambar-500/30'
                }`}
              >
                {inQuote ? (
                  <>
                    <Check className="h-5 w-5" strokeWidth={3} />
                    Agregado a Cotización ({localQuantity})
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" strokeWidth={3} />
                    Agregar a Lista de Cotización
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
