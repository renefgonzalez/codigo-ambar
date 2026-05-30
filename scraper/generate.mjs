import { readFileSync, readdirSync, writeFileSync } from 'node:fs'

const BASE = 'https://www.codigoambar.com/'

const DIR_CAT = {
  torretas: { slug: 'torretas', label: 'Torretas' },
  mini_torretas: { slug: 'mini-torretas', label: 'Mini Torretas' },
  barras_leds: { slug: 'barras-leds', label: 'Barras de LEDs' },
  burbujas: { slug: 'burbujas', label: 'Burbujas' },
  luces_visera: { slug: 'luces-visera', label: 'Luces de Visera' },
  luces_parrilla: { slug: 'luces-parrilla', label: 'Luces de Parrilla' },
  sirenas: { slug: 'sirenas', label: 'Sirenas' },
  bocinas: { slug: 'bocinas', label: 'Bocinas' },
  radios: { slug: 'radios', label: 'Radios Móviles' },
  estrobos: { slug: 'estrobos', label: 'Estrobos' },
  controladores: { slug: 'controladores', label: 'Controladores' },
  emergencia: { slug: 'emergencia', label: 'Luces de Emergencia' },
  alarmas_reversa: { slug: 'alarmas-reversa', label: 'Alarmas de Reversa' },
  accesorios: { slug: 'accesorios', label: 'Accesorios' },
}

const CATEGORY_ORDER = [
  'torretas', 'mini-torretas', 'barras-leds', 'burbujas',
  'luces-visera', 'luces-parrilla', 'estrobos', 'sirenas',
  'bocinas', 'emergencia', 'alarmas-reversa', 'controladores',
  'radios', 'accesorios',
]

const ENT = {
  aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', ntilde: 'ñ',
  Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', Ntilde: 'Ñ',
  uuml: 'ü', Uuml: 'Ü', deg: '°', ordm: 'º', middot: '·', nbsp: ' ',
  quot: '"', amp: '&', mdash: '—', ndash: '–', hellip: '…', iquest: '¿',
}
const decode = (s) =>
  s.replace(/&([a-zA-Z]+);/g, (m, n) => (n in ENT ? ENT[n] : m))
   .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
// vocal acentuada en MAYÚSCULA a media palabra (artefacto del sitio: "tecnologÍa")
const fixCaps = (s) =>
  s.replace(/([a-záéíóúñ])([ÁÉÍÓÚ])/g, (_, a, b) =>
    a + 'ÁÉÍÓÚ'.indexOf(b) >= 0 ? a + 'áéíóú'['ÁÉÍÓÚ'.indexOf(b)] : a + b)
const clean = (s) =>
  fixCaps(decode(s.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')))
    .replace(/\s+/g, ' ').trim()

const colorFromPath = (p) =>
  p.includes('rojo_azul') ? 'Rojo / Azul'
  : p.includes('rojas') ? 'Rojo'
  : p.includes('ambar') ? 'Ámbar'
  : p.includes('moto') ? 'Moto' : ''

// badge filename → spec chip (logos de marca → null, se usan aparte)
function badgeSpec(name) {
  if (name === 'sae2') return 'SAE Clase 2'
  if (name === 'ip67_logo') return 'IP67'
  if (name === 'made_in_usa') return 'Hecho en USA'
  const g = name.match(/^(\d)_garantia$/)
  if (g) return `${g[1]} años de garantía`
  return null
}
const BRAND = {
  epcom_logo: 'EPCOM', ecco_logo: 'ECCO', lt_logo: 'LT',
  logo_megalux: 'MegaLux',
}

function specsFrom(badges, desc) {
  const out = []
  const push = (s) => { if (s && !out.includes(s)) out.push(s) }
  const fm = desc.match(/(\d+)\s*(?:tipos de destellos|destellos|patrones)/i)
  if (fm) push(`${fm[1]} destellos`)
  for (const b of badges) push(badgeSpec(b))
  const rank = (s) =>
    /destellos/.test(s) ? 0 : /IP67/.test(s) ? 1 : /SAE/.test(s) ? 2
    : /garantía/.test(s) ? 3 : /USA/.test(s) ? 4 : 5
  return out.sort((a, b) => rank(a) - rank(b)).slice(0, 4)
}

const STOP = /(,?\s*(adquiera|adquiéralo|comprar|cómpre|no pierda|aproveche|llame|disponible para|recibe asesor|recibir asesor|venta e instalaci|gran oportunidad|excelente|ideal para))/i
function splitDesc(raw, fallbackTitle) {
  if (!raw) return { title: fallbackTitle, desc: '' }
  let title = raw.split(/[.,]/)[0].trim()
  if (title.length < 6) title = fallbackTitle
  if (title.length > 70) title = title.slice(0, 67).trim() + '…'
  let desc = raw
  const m = desc.match(STOP)
  if (m && m.index > 20) desc = desc.slice(0, m.index)
  desc = desc.replace(/\s+/g, ' ').replace(/[,;:.\s]+$/, '').trim()
  if (desc.length < 12) desc = ''
  else desc = desc.charAt(0).toUpperCase() + desc.slice(1) + '.'
  return { title, desc }
}

const slugify = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
   .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// recorrer páginas en orden alfabético estable; dedup por código
const files = readdirSync('pages').filter((f) => f.endsWith('.html')).sort()
const seen = new Set()
const ids = new Set()
const result = []
const perCat = {}

for (const file of files) {
  const html = readFileSync('pages/' + file, 'utf8')
  const pagePath = file.replace(/__/g, '/')
  const dirKey = pagePath.split('/')[1]
  const cat = DIR_CAT[dirKey]
  if (!cat) continue
  const dir = pagePath.replace(/[^/]*$/, '')
  const color = colorFromPath(pagePath)

  // Cada tarjeta empieza en 'product__labels' (badges) y contiene name + article-type.
  // Partimos por la imagen 280x280 como ancla estable de cada tarjeta.
  const cards = html.split(/(?=<div class="contenedor-img)/g)
  for (const card of cards) {
    const nameM = card.match(/class="product__name"[^>]*>([^<]+)</i)
    if (!nameM) continue
    const code = clean(nameM[1])
    if (!code) continue
    if (seen.has(code)) continue

    const imgM = card.match(/<img src="(280x280\/[^"]+\.jpg)"/i)
    if (!imgM) continue
    // el sitio a veces deja espacios en el nombre del archivo ("280x280/ X600.jpg")
    const imgRel = imgM[1].replace(/280x280\/\s+/, '280x280/').replace(/\s+\.jpg$/i, '.jpg').trim()
    const imageUrl = BASE + dir + encodeURI(imgRel)

    const descM = card.match(/class="product__article-type"[^>]*>([\s\S]*?)<\/div>/i)
    const rawDesc = descM ? clean(descM[1]) : ''

    const badges = [...card.matchAll(/<img src="images\/([a-z0-9_]+)\.(?:jpg|png)"/gi)]
      .map((m) => m[1].toLowerCase())
    const brand = badges.map((b) => BRAND[b]).find(Boolean)

    const { title, desc } = splitDesc(rawDesc, `${cat.label} ${code}`)
    const description =
      desc || `${cat.label} profesional de alta visibilidad para equipamiento vehicular${brand ? ` · ${brand}` : ''}.`
    const specs = specsFrom(badges, rawDesc)

    let id = slugify(code) || slugify(imgM[1])
    let b = id, n = 2
    while (ids.has(id)) id = `${b}-${n++}`
    ids.add(id)
    seen.add(code)

    result.push({
      id,
      title,
      model: color ? `${code} · ${color}` : code,
      category: cat.slug,
      ...(color ? { color } : {}),
      ...(brand ? { brand } : {}),
      description,
      specs,
      imageUrl,
    })
    perCat[cat.slug] = (perCat[cat.slug] || 0) + 1
  }
}

// destacados: premium (5 años + USA), máx 1 por categoría
const featDone = {}
for (const r of result) {
  if (!featDone[r.category] &&
      r.specs.includes('5 años de garantía') && r.specs.includes('Hecho en USA')) {
    r.featured = true
    featDone[r.category] = true
  }
}

const present = new Set(result.map((r) => r.category))
const categories = CATEGORY_ORDER.filter((s) => present.has(s))
  .map((s) => ({ slug: s, label: Object.values(DIR_CAT).find((c) => c.slug === s).label }))

const header = `import type { Category, Product } from '../types'

// ─────────────────────────────────────────────────────────────
// CATÁLOGO — Código Ámbar
// Generado desde el catálogo del cliente (codigoambar.com).
// ${result.length} productos · ${categories.length} categorías. Sin precios:
// las cotizaciones se cierran con un asesor por WhatsApp.
// Regenerar: descargar páginas y correr node scraper/generate.mjs.
// Migración a Supabase: src/lib/supabase.ts → getProducts().
// ─────────────────────────────────────────────────────────────

`
const ts = header +
  'export const CATEGORIES: Category[] = ' + JSON.stringify(categories, null, 2) +
  '\n\nexport const PRODUCTS: Product[] = ' + JSON.stringify(result, null, 2) + '\n'

writeFileSync(new URL('../src/data/products.ts', import.meta.url), ts)
writeFileSync('slug-union.txt', categories.map((c) => `  | '${c.slug}'`).join('\n'))

const summary = ['PRODUCTS=' + result.length, 'CATEGORIES=' + categories.length,
  'FEATURED=' + result.filter((r) => r.featured).length, '--- per cat ---',
  ...categories.map((c) => c.slug + '=' + (perCat[c.slug] || 0))]
writeFileSync('stats.txt', summary.join('\n'))
console.log(summary.join('  '))
