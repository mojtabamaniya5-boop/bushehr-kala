// پالت‌های رنگی استاندارد (بر اساس تحقیقات UX و ترندهای ۲۰۲۶)
// هر تم شامل ۸ توکن رنگی است تا کل UI هماهنگ بماند.
export const THEMES = {
  green: {
    id: 'green',
    name: 'کافه ترشی (سبز طبیعی)',
    brand: '46 125 50',        // #2E7D32
    brandDark: '24 92 40',     // #185C28
    brandLight: '232 245 233', // #E8F5E9
    accent: '248 192 45',      // #F8C02D
    accentDark: '203 150 10',  // #CB960A
    cream: '255 248 232',      // #FFF8E8
    ink: '36 48 36',           // #243024
    muted: '119 119 119',      // #777777
  },
  blue: {
    id: 'blue',
    name: 'اقیانوس آرام (آبی مدرن)',
    brand: '30 58 138',        // #1E3A8A
    brandDark: '23 37 84',     // #172554
    brandLight: '219 234 254', // #DBEAFE
    accent: '6 182 212',       // #06B6D4
    accentDark: '8 145 178',   // #0891B2
    cream: '240 249 255',      // #F0F9FF
    ink: '15 23 42',           // #0F172A
    muted: '100 116 139',      // #64748B
  },
  sunset: {
    id: 'sunset',
    name: 'غروب آفتاب (نارنجی پرانرژی)',
    brand: '234 88 12',        // #EA580C
    brandDark: '194 65 12',    // #C2410C
    brandLight: '255 237 213', // #FFEDD5
    accent: '220 38 38',       // #DC2626
    accentDark: '185 28 28',   // #B91C1C
    cream: '255 247 237',      // #FFF7ED
    ink: '67 20 7',            // #431407
    muted: '120 113 108',      // #78716C
  },
  midnight: {
    id: 'midnight',
    name: 'شب آرام (دارک پریمیوم)',
    brand: '124 58 237',       // #7C3AED
    brandDark: '109 40 217',   // #6D28D9
    brandLight: '243 232 255', // #F3E8FF
    accent: '236 72 153',      // #EC4899
    accentDark: '219 39 119',  // #DB2777
    cream: '15 23 42',         // #0F172A
    ink: '248 250 252',        // #F8FAFC
    muted: '148 163 184',      // #94A3B8
  }
}

export function applyTheme(themeId) {
  const theme = THEMES[themeId] || THEMES.green;
  const root = document.documentElement;
  
  // ست کردن تمام ۸ توکن رنگی به صورت هماهنگ
  root.style.setProperty('--color-brand', theme.brand);
  root.style.setProperty('--color-brand-dark', theme.brandDark);
  root.style.setProperty('--color-brand-light', theme.brandLight);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-accent-dark', theme.accentDark);
  root.style.setProperty('--color-cream', theme.cream);
  root.style.setProperty('--color-ink', theme.ink);
  root.style.setProperty('--color-muted', theme.muted);
  
  // ذخیره برای لود سریع دفعه بعد
  localStorage.setItem('shop-theme-id', themeId);
}

export function loadSavedTheme() {
  const savedTheme = localStorage.getItem('shop-theme-id');
  if (savedTheme) applyTheme(savedTheme);
}
