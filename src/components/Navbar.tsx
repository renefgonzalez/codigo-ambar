import { Search, ShoppingBag, Heart, Zap, Mail } from 'lucide-react'
import { useQuote } from '../context/QuoteContext'

interface NavbarProps {
  query: string
  onQueryChange: (value: string) => void
  onOpenQuote: () => void
  onOpenFavorites: () => void
}

export default function Navbar({
  query,
  onQueryChange,
  onOpenQuote,
  onOpenFavorites,
}: NavbarProps) {
  const { totalItems, totalFavorites } = useQuote()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        {/* Logotipo */}
        <a href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
            <Zap className="h-5 w-5 text-ambar-500" strokeWidth={2.5} />
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight text-white sm:block">
            Código <span className="text-ambar-500">Ámbar</span>
          </span>
        </a>

        {/* Búsqueda discreta */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar torretas, faros, sirenas…"
            className="w-full rounded-full border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-ambar-500 focus:bg-slate-800 focus:ring-1 focus:ring-ambar-500"
          />
        </div>

        {/* Accesos rápidos */}
        <div className="flex shrink-0 items-center gap-1">
          <IconButton
            label="Contacto"
            count={0}
            onClick={() => window.location.href = 'mailto:contacto@codigoambar.com'}
            badgeClass="bg-blue-500"
          >
            <Mail className="h-5 w-5" />
          </IconButton>

          <IconButton
            label="Favoritos"
            count={totalFavorites}
            onClick={onOpenFavorites}
            badgeClass="bg-rose-500"
          >
            <Heart className="h-5 w-5" />
          </IconButton>

          <IconButton
            label="Cotización"
            count={totalItems}
            onClick={onOpenQuote}
            badgeClass="bg-ambar-500"
          >
            <ShoppingBag className="h-5 w-5" />
          </IconButton>
        </div>
      </div>
    </header>
  )
}

interface IconButtonProps {
  children: React.ReactNode
  label: string
  count: number
  badgeClass: string
  onClick: () => void
}

function IconButton({ children, label, count, badgeClass, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-95"
    >
      {children}
      {count > 0 && (
        <span
          className={`absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[11px] font-bold text-white ${badgeClass}`}
        >
          {count}
        </span>
      )}
    </button>
  )
}
