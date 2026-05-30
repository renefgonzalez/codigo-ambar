import { PackageSearch } from 'lucide-react'
import type { Product } from '../types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onSelectProduct?: (product: Product) => void
  onAddedToQuote?: (product: Product) => void
}

export default function ProductGrid({ products, onSelectProduct, onAddedToQuote }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <PackageSearch className="h-10 w-10 text-slate-300" />
        <p className="mt-3 font-semibold text-slate-700">Sin resultados</p>
        <p className="mt-1 text-sm text-slate-500">
          Prueba con otra categoría o término de búsqueda.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onSelect={onSelectProduct} 
          onAddedToQuote={onAddedToQuote}
        />
      ))}
    </div>
  )
}
