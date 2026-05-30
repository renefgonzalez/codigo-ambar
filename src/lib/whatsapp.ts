import type { CustomerInfo, QuoteItem } from '../types'

// Número del asesor tomado del .env (formato internacional sin "+").
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? ''

/**
 * Construye el enlace wa.me con el desglose de la cotización y los
 * datos del cliente, listo para abrir el chat de WhatsApp.
 */
export function buildWhatsAppLink(items: QuoteItem[], customer: CustomerInfo): string {
  const lines: string[] = []

  lines.push('*NUEVA SOLICITUD DE COTIZACIÓN · Código Ámbar*')
  lines.push('')
  lines.push('*Datos del cliente*')
  lines.push(`• Nombre: ${customer.fullName}`)
  lines.push(`• WhatsApp: ${customer.whatsapp}`)
  lines.push(`• Ciudad/Estado: ${customer.city}`)
  if (customer.company?.trim()) {
    lines.push(`• Empresa/Dependencia: ${customer.company}`)
  }
  lines.push('')
  lines.push('*Productos solicitados*')

  items.forEach((item, i) => {
    lines.push(
      `${i + 1}. ${item.product.title} (${item.product.model}) — Cant: ${item.quantity}`,
    )
  })

  const totalUnidades = items.reduce((sum, it) => sum + it.quantity, 0)
  lines.push('')
  lines.push(`*Total de artículos:* ${totalUnidades}`)

  if (customer.notes?.trim()) {
    lines.push('')
    lines.push('*Notas / dudas*')
    lines.push(customer.notes.trim())
  }

  const message = encodeURIComponent(lines.join('\n'))
  const phone = WHATSAPP_NUMBER.replace(/[^\d]/g, '')

  // Si no hay número configurado, wa.me abre el selector de contacto.
  return phone
    ? `https://wa.me/${phone}?text=${message}`
    : `https://wa.me/?text=${message}`
}

export const isWhatsAppConfigured = Boolean(
  WHATSAPP_NUMBER && !WHATSAPP_NUMBER.includes('X'),
)
