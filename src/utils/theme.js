// ابزار تغییر رنگ پویا (Dynamic Theme)
// تبدیل HEX به آرایه RGB
function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [46, 125, 50]; // fallback به سبز
}

// روشن/تیره کردن رنگ (amount بین -100 تا 100)
function adjustColor(rgb, amount) {
  return rgb.map(c => {
    const adjusted = Math.round(c + (amount / 100) * 255);
    return Math.max(0, Math.min(255, adjusted));
  });
}

export function applyTheme(hexColor) {
  if (!hexColor) return;
  const rgb = hexToRgb(hexColor);
  const rgbString = rgb.join(' ');
  
  // ساخت طیف‌های روشن و تیره
  const darkRgb = adjustColor(rgb, -20).join(' ');
  const lightRgb = adjustColor(rgb, 80).join(' ');

  const root = document.documentElement;
  root.style.setProperty('--color-brand', rgbString);
  root.style.setProperty('--color-brand-dark', darkRgb);
  root.style.setProperty('--color-brand-light', lightRgb);
  
  // ذخیره برای لود سریع در دفه بعد
  localStorage.setItem('shop-theme-color', hexColor);
}

export function loadSavedTheme() {
  const savedColor = localStorage.getItem('shop-theme-color');
  if (savedColor) {
    applyTheme(savedColor);
  }
}
