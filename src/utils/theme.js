export const THEMES = {
  forest: {
    id: 'forest', name: 'جنگل نیمه‌شب',
    brand: '8 116 67', dark: '6 95 53', light: '184 243 206',
    accent: '255 157 36', accentDark: '204 72 8',
    cream: '6 46 37', ink: '242 255 246', muted: '179 212 193'
  },
  orange: {
    id: 'orange', name: 'موج نارنجی',
    brand: '255 90 10', dark: '204 72 8', light: '255 157 36',
    accent: '255 157 36', accentDark: '204 72 8',
    cream: '255 244 229', ink: '87 34 13', muted: '155 116 95'
  },
  ocean: {
    id: 'ocean', name: 'اقیانوس آرام',
    brand: '8 123 234', dark: '6 98 187', light: '101 214 255',
    accent: '101 214 255', accentDark: '8 123 234',
    cream: '234 247 255', ink: '16 55 102', muted: '100 132 164'
  }
}

export function applyTheme(themeId) {
  if (themeId === 'green') themeId = 'forest';
  if (themeId === 'blue') themeId = 'ocean';
  if (themeId === 'sunset') themeId = 'orange';
  
  const theme = THEMES[themeId] || THEMES.forest;
  const root = document.documentElement;
  
  root.style.setProperty('--color-brand', theme.brand);
  root.style.setProperty('--color-brand-dark', theme.dark);
  root.style.setProperty('--color-brand-light', theme.light);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-accent-dark', theme.accentDark);
  root.style.setProperty('--color-cream', theme.cream);
  root.style.setProperty('--color-ink', theme.ink);
  root.style.setProperty('--color-muted', theme.muted);
  
  localStorage.setItem('shop-theme-id', themeId);
}

export function loadSavedTheme() {
  const savedTheme = localStorage.getItem('shop-theme-id') || 'forest';
  applyTheme(savedTheme);
}
