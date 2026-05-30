import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import type { Product } from '../types'

interface ToastProps {
  product: Product | null
  open: boolean
  onClose: () => void
}

export default function Toast({ product, open, onClose }: ToastProps) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose()
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [open, onClose])

  if (!open || !product) return null

  return (
    <div className="fixed bottom-6 left-6 z-50 flex max-w-sm items-center gap-4 rounded-2xl bg-slate-800 p-4 shadow-2xl ring-1 ring-slate-700 animate-toast">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ambar-500/20 text-ambar-400">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <div className="flex flex-col pr-6">
        <p className="text-sm font-bold text-white">Añadido a la cotización</p>
        <p className="truncate text-xs text-slate-400">{product.title}</p>
      </div>
      <button
        onClick={onClose}
        className="absolute right-3 top-3 rounded-full p-1 text-slate-400 transition hover:bg-slate-700 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
