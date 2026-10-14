const KEY = 'bk-track-attempts'
const MAX_ATTEMPTS = 5
const WINDOW_MS = 5 * 60 * 1000  // ۵ دقیقه

export function canSearch() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '[]')
    const now = Date.now()
    const recent = data.filter(t => now - t < WINDOW_MS)
    if (recent.length >= MAX_ATTEMPTS) {
      const remainingMs = WINDOW_MS - (now - recent[0])
      const remainingMin = Math.ceil(remainingMs / 60000)
      return { allowed: false, remainingMin }
    }
    return { allowed: true, remaining: MAX_ATTEMPTS - recent.length }
  } catch {
    return { allowed: true }
  }
}

export function recordAttempt() {
  try {
    const now = Date.now()
    const data = JSON.parse(localStorage.getItem(KEY) || '[]')
    const recent = data.filter(t => now - t < WINDOW_MS)
    recent.push(now)
    localStorage.setItem(KEY, JSON.stringify(recent))
  } catch {}
}

export function clearAttempts() {
  try { localStorage.removeItem(KEY) } catch {}
}

// اعتبارسنجی کد سفارش
export function isValidOrderCode(code) {
  return /^[A-Z0-9]{4,20}$/.test((code || '').toUpperCase().trim())
}

// اعتبارسنجی موبایل ایران
export function isValidPhone(phone) {
  return /^09\d{9}$/.test((phone || '').replace(/\D/g, ''))
}
