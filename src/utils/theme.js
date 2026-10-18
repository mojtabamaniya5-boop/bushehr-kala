export const THEMES = {
  green: {
    id: 'green',
    name: 'کافه ترشی (سبز کلاسیک)',
    brand: '46 125 50',        // #2E7D32 - هدر سبز تیره
    brandDark: '24 92 40',     // #185C28
    brandLight: '232 245 233', // #E8F5E9
    accent: '248 192 45',      // #F8C02D - دکمه زرد طلایی
    accentDark: '203 150 10',  
    cream: '255 248 232',      // #FFF8E8 - پس‌زمینه کرم
    ink: '36 48 36',           // #243024 - متن تیره
    muted: '119 119 119',      
  },
  orange: {
    id: 'orange',
    name: 'غروب آفتاب (نارنجی مدرن)',
    brand: '234 88 12',        // #EA580C - هدر نارنجی
    brandDark: '194 65 12',    // #C2410C
    brandLight: '255 237 213', // #FFEDD5
    accent: '220 38 38',       // #DC2626 - دکمه قرمز/نارنجی
    accentDark: '185 28 28',   // #B91C1C
    cream: '255 247 237',      // #FFF7ED - پس‌زمینه هلویی
    ink: '67 20 7',            // #431407
    muted: '120 113 108',      
  },
  blue: {
    id: 'blue',
    name: 'اقیانوس آرام (آبی اقیانوسی)',
    brand: '37 99 235',        // #2563EB - هدر آبی
    brandDark: '29 78 216',    // #1D4ED8
    brandLight: '219 234 254', // #DBEAFE
    accent: '59 130 246',      // #3B82F6 - دکمه آبی روشن
    accentDark: '37 99 235',   // #2563EB
    cream: '239 246 255',      // #EFF6FF - پس‌زمینه آبی ملایم
    ink: '15 23 42',           // #0F172A
    muted: '100 116 139',      
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
