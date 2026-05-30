import { useMemo, useState } from 'react'
import { Heart } from 'lucide-react'
import Navbar from './components/Navbar'
import CategoryFilter from './components/CategoryFilter'
import ProductGrid from './components/ProductGrid'
import QuoteModal from './components/QuoteModal'
import ProductDetail from './components/ProductDetail'
import Toast from './components/Toast'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import { PRODUCTS } from './data/products'
import { useQuote } from './context/QuoteContext'
import type { Product, CategorySlug } from './types'

export default function App() {
  const { favorites } = useQuote()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategorySlug | 'all'>('all')
  const [showFavorites, setShowFavorites] = useState(false)
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [quoteOpen, setQuoteOpen] = useState(false)

  const [addedProduct, setAddedProduct] = useState<Product | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleQueryChange = (q: string) => {
    setQuery(q)
    if (selectedProduct) setSelectedProduct(null)
  }

  const handleOpenFavorites = () => {
    setShowFavorites((v) => !v)
    if (selectedProduct) setSelectedProduct(null)
  }

  const handleCategoryChange = (c: CategorySlug | 'all') => {
    setCategory(c)
    if (selectedProduct) setSelectedProduct(null)
  }

  const handleProductAdd = (product: Product) => {
    setAddedProduct(product)
    setShowAddModal(true)
  }

  const handleViewQuote = () => {
    setShowAddModal(false)
    setQuoteOpen(true)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PRODUCTS.filter((p) => {
      if (showFavorites && !favorites.includes(p.id)) return false
      if (category !== 'all' && p.category !== category) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.specs.some((s) => s.toLowerCase().includes(q))
      )
    })
  }, [query, category, showFavorites, favorites])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <Navbar
        query={query}
        onQueryChange={handleQueryChange}
        onOpenQuote={() => setQuoteOpen(true)}
        onOpenFavorites={handleOpenFavorites}
      />

      {selectedProduct ? (
        <main className="mx-auto max-w-6xl px-4 py-8 pb-32">
          <ProductDetail 
            product={selectedProduct} 
            onBack={() => setSelectedProduct(null)}
            onAddedToQuote={() => handleProductAdd(selectedProduct)}
          />
        </main>
      ) : (
        <>
          {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-6 sm:pt-10">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-ambar-500/10 blur-3xl" />
          
          <div className="grid lg:grid-cols-2">
            <div className="relative z-10 flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-14">
              <div>
                <span className="inline-flex items-center rounded-full bg-ambar-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ambar-400">
                  Catálogo Corporativo 2026
                </span>
              </div>
              <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
                Iluminación táctica y accesorios de{' '}
                <span className="text-ambar-500">alto rendimiento</span>
              </h1>
              <p className="mt-4 max-w-lg text-sm text-slate-400 sm:text-base leading-relaxed">
                Equipa autos, camiones de servicio y patrullas. Arma tu lista y
                recibe una cotización personalizada de un asesor experto.
              </p>
            </div>
            
            {/* Imagen en Desktop */}
            <div className="relative hidden lg:block h-full min-h-[360px]">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10" />
              <img 
                src="/hero-jeep.png" 
                alt="Jeep off-road con iluminación táctica" 
                className="absolute inset-0 h-full w-full object-cover object-center opacity-90 mix-blend-lighten"
              />
            </div>

            {/* Imagen en Mobile */}
            <div className="relative h-56 w-full lg:hidden border-t border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
              <img 
                src="/hero-jeep.png" 
                alt="Jeep off-road con iluminación táctica" 
                className="absolute inset-0 h-full w-full object-cover object-center opacity-80 mix-blend-lighten"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filtros + título de sección */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-white">
            {showFavorites ? 'Mis Favoritos' : 'Productos'}
          </h2>
          {showFavorites && (
            <button
              type="button"
              onClick={() => setShowFavorites(false)}
              className="flex items-center gap-1 text-sm font-semibold text-ambar-600 hover:text-ambar-700"
            >
              <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
              Ver todo
            </button>
          )}
        </div>

          {!showFavorites && (
            <CategoryFilter active={category} onChange={handleCategoryChange} />
          )}
        </section>

        {/* Grid */}
        <main className="mx-auto max-w-6xl px-4 pb-32 pt-4">
          <ProductGrid 
            products={filtered} 
            onSelectProduct={setSelectedProduct} 
            onAddedToQuote={handleProductAdd}
          />
        </main>
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm font-bold text-white">
            Código <span className="text-ambar-500">Ámbar</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Catálogo digital · Precios bajo cotización con asesor
          </p>
        </div>
      </footer>

      {/* Modal de cotización + checkout */}
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />

      {/* Toast Notification */}
      <Toast
        open={showAddModal}
        product={addedProduct}
        onClose={() => setShowAddModal(false)}
      />

      {/* Botón flotante de WhatsApp */}
      <FloatingWhatsApp isHidden={quoteOpen} />
    </div>
  )
}
