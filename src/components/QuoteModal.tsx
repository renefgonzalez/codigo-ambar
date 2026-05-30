import { useState } from 'react'
import {
  X,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react'
import { useQuote } from '../context/QuoteContext'
import { buildWhatsAppLink } from '../lib/whatsapp'
import type { CustomerInfo } from '../types'

interface QuoteModalProps {
  open: boolean
  onClose: () => void
}

type FormErrors = Partial<Record<keyof CustomerInfo, string>>

const EMPTY_CUSTOMER: CustomerInfo = {
  fullName: '',
  whatsapp: '',
  city: '',
  company: '',
  notes: '',
}

export default function QuoteModal({ open, onClose }: QuoteModalProps) {
  const { items, totalItems, setQuantity, removeItem, clearQuote } = useQuote()
  const [customer, setCustomer] = useState<CustomerInfo>(EMPTY_CUSTOMER)
  const [errors, setErrors] = useState<FormErrors>({})

  if (!open) return null

  const update = (field: keyof CustomerInfo, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (!customer.fullName.trim()) next.fullName = 'Ingresa tu nombre completo.'
    if (!customer.whatsapp.trim()) {
      next.whatsapp = 'Ingresa tu número de WhatsApp.'
    } else if (customer.whatsapp.replace(/[^\d]/g, '').length < 10) {
      next.whatsapp = 'El número parece incompleto.'
    }
    if (!customer.city.trim()) next.city = 'Indica tu ciudad o estado.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSend = () => {
    if (items.length === 0) return
    if (!validate()) return
    const link = buildWhatsAppLink(items, customer)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const isEmpty = items.length === 0

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel (Drawer) */}
      <div className="animate-slide-left relative flex h-full w-full flex-col overflow-hidden bg-slate-900 shadow-2xl border-l border-slate-800 sm:max-w-[420px]">
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold text-white">Mi Cotización</h2>
            <p className="text-xs text-slate-400">
              {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'} en la lista
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cuerpo desplazable */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-10 w-10 text-slate-600" />
              <p className="mt-3 font-semibold text-white">
                Tu cotización está vacía
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Agrega productos del catálogo para solicitar precios.
              </p>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.product.id}
                    className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-3"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-slate-800"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="truncate text-sm font-bold text-white">
                        {item.product.title}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {item.product.model}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        {/* Stepper de cantidad */}
                        <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900">
                          <button
                            type="button"
                            aria-label="Disminuir"
                            onClick={() =>
                              setQuantity(item.product.id, item.quantity - 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-90"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Aumentar"
                            onClick={() =>
                              setQuantity(item.product.id, item.quantity + 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-90"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label="Eliminar"
                          onClick={() => removeItem(item.product.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-500 active:scale-90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={clearQuote}
                className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-rose-500 hover:underline"
              >
                Vaciar cotización
              </button>

              {/* Formulario de datos del cliente */}
              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <h3 className="text-sm font-extrabold text-white">
                  Tus datos de contacto
                </h3>

                <Field
                  label="Nombre completo"
                  required
                  value={customer.fullName}
                  onChange={(v) => update('fullName', v)}
                  placeholder="Ej. Juan Pérez"
                  error={errors.fullName}
                />
                <Field
                  label="Teléfono WhatsApp"
                  required
                  type="tel"
                  value={customer.whatsapp}
                  onChange={(v) => update('whatsapp', v)}
                  placeholder="Ej. 55 1234 5678"
                  error={errors.whatsapp}
                />
                <Field
                  label="Ciudad / Estado"
                  required
                  value={customer.city}
                  onChange={(v) => update('city', v)}
                  placeholder="Ej. Monterrey, N.L."
                  error={errors.city}
                />
                <Field
                  label="Empresa o Dependencia"
                  value={customer.company ?? ''}
                  onChange={(v) => update('company', v)}
                  placeholder="Opcional"
                />

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">
                    Notas adicionales o dudas
                  </label>
                  <textarea
                    value={customer.notes}
                    onChange={(e) => update('notes', e.target.value)}
                    rows={3}
                    placeholder="Opcional — colores, cantidades especiales, dudas técnicas…"
                    className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-ambar-500 focus:bg-slate-950 focus:ring-2 focus:ring-ambar-500/20"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pie con CTA de WhatsApp */}
        {!isEmpty && (
          <div className="border-t border-slate-800 bg-slate-900 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={handleSend}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 text-base font-extrabold text-white shadow-lg shadow-[#25D366]/20 transition hover:bg-[#20bd5a] active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" />
              Enviar Cotización a un Asesor
            </button>
            <p className="mt-2 text-center text-[11px] text-slate-500">
              Se abrirá WhatsApp con el resumen listo para enviar. No se muestran
              precios públicos.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface FieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  error?: string
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  error,
}: FieldProps) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-400">
        {label}
        {required && <span className="ml-0.5 text-ambar-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:bg-slate-950 focus:ring-2 ${
          error
            ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-800 focus:border-ambar-500 focus:ring-ambar-500/20'
        }`}
      />
      {error && <p className="mt-1 text-[11px] font-medium text-rose-500">{error}</p>}
    </div>
  )
}
