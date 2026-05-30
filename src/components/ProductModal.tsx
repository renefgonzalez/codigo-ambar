import { useEffect, useState } from 'react'
import { X, Plus, Check, MessageCircle } from 'lucide-react'
import type { Product } from '../types'
import { useQuote } from '../context/QuoteContext'

interface ProductModalProps {
  product: Product | null
  onClose: () => void
  onGoToQuote: () => void
}

function secondView(url: string): string {
  return url.replace(/\.(jpg|jpeg|png)$/i, '_2.$1')
}

export default function ProductModal({ product, onClose, onGoToQuote }: ProductModalProps) {
  const { addItem, isInQuote } = useQuote()
  const [activeImg, setActiveImg] = useState(0)
  const [hasSecond, setHasSecond] = useState(true)

  // Reinicia la galería al cambiar de producto
  useEffect(() => {
    setActiveImg(0)
    setHasSecond(true)
  }, [product?.id])

  // Cerrar con Escape
  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [product, onClose])

  if (!product) return null

  const inQuote = isInQuote(product.id)
  const images = hasSecond
    ? [product.imageUrl, product.hoverImageUrl ?? secondView(product.imageUrl)]
    : [product.imageUrl]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="animate-slide-up relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-float sm:max-w-3xl sm:rounded-3xl">
        {/* Cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm backdrop-blur transition hover:bg-white active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-1 overflow-y-auto sm:flex sm:overflow-hidden">
          {/* Galería */}
          <div className="sm:flex sm:w-1/2 sm:flex-col sm:border-r sm:border-slate-100">
            <div className="aspect-square bg-white">
              <img
                src={images[activeImg]}
                alt={product.title}
                onError={() => {
                  setHasSecond(false)
                  setActiveImg(0)
                }}
                className="h-full w-full object-contain p-6"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 px-6 pb-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={`h-16 w-16 overflow-hidden rounded-xl border-2 bg-white transition ${
                      activeImg === i ? 'border-ambar-500' : 'border-slate-200'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalle */}
          <div className="flex flex-col p-6 sm:w-1/2 sm:overflow-y-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-ambar-600">
                {product.model.split(' · ')[0]}
              </span>
              {product.brand && (
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {product.brand}
                </span>
              )}
              {product.color && (
                <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {product.color}
                </span>
              )}
            </div>

            <h2 className="mt-2 text-xl font-extrabold leading-tight text-slate-900">
              {product.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>

            {product.specs.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Especificaciones
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.specs.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Precio bajo cotización. Agrégalo a tu lista y un asesor te atiende por
              WhatsApp.
            </p>

            <div className="mt-auto space-y-2 pt-5">
              <button
                type="button"
                onClick={() => addItem(product)}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition active:scale-[0.98] ${
                  inQuote ? 'bg-slate-900 text-white' : 'bg-ambar-500 text-white hover:bg-ambar-600'
                }`}
              >
                {inQuote ? (
                  <>
                    <Check className="h-4 w-4" strokeWidth={3} /> Agregar otra unidad
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" strokeWidth={3} /> Agregar a Cotización
                  </>
                )}
              </button>
              {inQuote && (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onGoToQuote()
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-600 active:scale-[0.98]"
                >
                  <MessageCircle className="h-4 w-4" /> Ir a mi cotización
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
