export const THEMES = {
  green: {
    id: 'green', name: 'کافه ترشی (سبز)',
    brand: '46 125 50', brandDark: '24 92 40', light: '232 245 233',
    accent: '248 192 45', accentDark: '203 150 10',
    page: '255 248 232', card: '255 255 255', onPage: '36 48 36', onCard: '36 48 36',
  },
  orange: {
    id: 'orange', name: 'موج نارنجی',
    brand: '234 88 12', brandDark: '194 65 12', light: '255 237 213',
    accent: '220 38 38', accentDark: '185 28 28',
    page: '255 247 237', card: '255 255 255', onPage: '67 20 7', onCard: '67 20 7',
  },
  blue: {
    id: 'blue', name: 'اقیانوس آرام',
    brand: '37 99 235', brandDark: '29 78 216', light: '219 234 254',
    accent: '59 130 246', accentDark: '37 99 235',
    page: '239 246 255', card: '255 255 255', onPage: '15 23 42', onCard: '15 23 42',
  }
}

export function applyTheme(themeId) {
  const theme = THEMES[themeId] || THEMES.green;
  const root = document.documentElement;
  
  root.style.setProperty('--color-brand', theme.brand);
  root.style.setProperty('--color-brand-dark', theme.brandDark);
  root.style.setProperty('--color-brand-light', theme.light);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-accent-dark', theme.accentDark);
  root.style.setProperty('--color-page', theme.page);
  root.style.setProperty('--color-card', theme.card);
  root.style.setProperty('--color-on-page', theme.onPage);
  root.style.setProperty('--color-on-card', theme.onCard);
  
  localStorage.setItem('shop-theme-id', themeId);
}

export function loadSavedTheme() {
  const savedTheme = localStorage.getItem('shop-theme-id') || 'green';
  applyTheme(savedTheme);
}
loadSavedTheme();
