const THEMES = {
  green:  { brand: '46 125 50', dark: '24 92 40', light: '232 245 233', accent: '248 192 45', accentDark: '203 150 10', cream: '255 248 232', ink: '36 48 36', muted: '119 119 119', page: '255 248 232', page2: '255 248 232', card: '255 255 255', onPage: '36 48 36', onPageMuted: '119 119 119', onCard: '36 48 36' },
  orange: { brand: '234 88 12', dark: '194 65 12', light: '255 237 213', accent: '220 38 38', accentDark: '185 28 28', cream: '255 247 237', ink: '67 20 7', muted: '120 113 108', page: '255 247 237', page2: '255 247 237', card: '255 255 255', onPage: '67 20 7', onPageMuted: '120 113 108', onCard: '67 20 7' },
  blue:   { brand: '37 99 235', dark: '29 78 216', light: '219 234 254', accent: '59 130 246', accentDark: '37 99 235', cream: '239 246 255', ink: '15 23 42', muted: '100 116 139', page: '239 246 255', page2: '239 246 255', card: '255 255 255', onPage: '15 23 42', onPageMuted: '100 116 139', onCard: '15 23 42' },
}
const ALIAS = { forest: 'green', ocean: 'blue' }

const VARS = {
  brand: '--color-brand', dark: '--color-brand-dark', light: '--color-brand-light',
  accent: '--color-accent', accentDark: '--color-accent-dark',
  cream: '--color-cream', ink: '--color-ink', muted: '--color-muted',
  page: '--color-page', page2: '--color-page2', card: '--color-card',
  onPage: '--color-on-page', onPageMuted: '--color-on-page-muted', onCard: '--color-on-card',
}

export function applyTheme(themeId) {
  let id = ALIAS[themeId] || themeId
  if (!THEMES[id]) id = 'green'
  const t = THEMES[id]
  const css = {}
  for (const k in VARS) css[VARS[k]] = t[k]
  const root = document.documentElement
  for (const v in css) root.style.setProperty(v, css[v])
  try {
    localStorage.setItem('shop-theme-id', id)
    localStorage.setItem('shop-theme-css', JSON.stringify(css))
  } catch {}
  return id
}

export function loadSavedTheme() {
  let id = null
  try { id = localStorage.getItem('shop-theme-id') } catch {}
  applyTheme(id)
}

loadSavedTheme()
