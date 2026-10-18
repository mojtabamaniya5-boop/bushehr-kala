export function applyTheme(themeId) {
  // در حال حاضر تغییر تم با کلاس‌های CSS در App.jsx انجام می‌شود
  localStorage.setItem('shop-theme-id', themeId);
}
export function loadSavedTheme() {}
