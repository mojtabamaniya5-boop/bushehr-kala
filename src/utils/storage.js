const PREFIX = 'bk-'

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      return raw ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch (e) {
      console.error('storage set error', e)
    }
  },
  remove(key) {
    localStorage.removeItem(PREFIX + key)
  },
  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k))
  },
}

// فرمت قیمت
export const formatPrice = (n) => { if (n === null || n === undefined || isNaN(n)) return '۰ تومان';
  return new Intl.NumberFormat('fa-IR').format(n) + ' تومان'; }

// تاریخ شمسی ساده
export const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('fa-IR')
  } catch {
    return iso
  }
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
