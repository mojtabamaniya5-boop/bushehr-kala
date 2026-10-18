// ابزار تغییر رنگ پویا (Dynamic Theme)
export function applyTheme(hexColor) {
  if (!hexColor) return;
  
  // تبدیل دقیق HEX به RGB (کد پیشنهادی مشاور)
  const toRgb = h => { 
    const n = parseInt(h.slice(1), 16); 
    return `${n>>16&255} ${n>>8&255} ${n&255}`; 
  };
  
  const rgbString = toRgb(hexColor);
  const rgbArray = rgbString.split(' ').map(Number);
  
  // روشن/تیره کردن
  const adjustColor = (rgb, amount) => rgb.map(c => Math.max(0, Math.min(255, Math.round(c + (amount / 100) * 255))));
  const darkRgb = adjustColor(rgbArray, -20).join(' ');
  const lightRgb = adjustColor(rgbArray, 80).join(' ');

  const root = document.documentElement;
  root.style.setProperty('--color-brand', rgbString);
  root.style.setProperty('--color-brand-dark', darkRgb);
  root.style.setProperty('--color-brand-light', lightRgb);
  
  // ذخیره برای لود سریع در دفه بعد
  localStorage.setItem('shop-theme-color', hexColor);
}

export function loadSavedTheme() {
  const savedColor = localStorage.getItem('shop-theme-color');
  if (savedColor) applyTheme(savedColor);
}
