export const THEMES = {
  green: {
    id: 'green', name: 'کافه ترشی (سبز کلاسیک)',
    brand: '46 125 50', brandDark: '24 92 40', brandLight: '232 245 233',
    accent: '248 192 45', accentDark: '203 150 10',
    cream: '255 248 232', ink: '36 48 36', muted: '119 119 119'
  },
  orange: {
    id: 'orange', name: 'غروب آفتاب (نارنجی مدرن)',
    brand: '234 88 12', brandDark: '194 65 12', brandLight: '255 237 213',
    accent: '220 38 38', accentDark: '185 28 28',
    cream: '255 247 237', ink: '67 20 7', muted: '120 113 108'
  },
  blue: {
    id: 'blue', name: 'اقیانوس آرام (آبی اقیانوسی)',
    brand: '37 99 235', brandDark: '29 78 216', brandLight: '219 234 254',
    accent: '59 130 246', accentDark: '37 99 235',
    cream: '239 246 255', ink: '15 23 42', muted: '100 116 139'
  }
}

export function applyTheme(themeId) {
  const theme = THEMES[themeId] || THEMES.green;
  const root = document.documentElement;
  root.style.setProperty('--color-brand', theme.brand);
  root.style.setProperty('--color-brand-dark', theme.brandDark);
  root.style.setProperty('--color-brand-light', theme.brandLight);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-accent-dark', theme.accentDark);
  root.style.setProperty('--color-cream', theme.cream);
  root.style.setProperty('--color-ink', theme.ink);
  root.style.setProperty('--color-muted', theme.muted);
  localStorage.setItem('shop-theme-id', themeId);
}

export function loadSavedTheme() {
  const savedTheme = localStorage.getItem('shop-theme-id');
  if (savedTheme) applyTheme(savedTheme);
}
