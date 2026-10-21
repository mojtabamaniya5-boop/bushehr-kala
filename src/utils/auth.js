import { storage } from './storage'

const USER_KEY = 'user-auth'
const TOKEN_KEY = 'auth-token'

export const getCurrentUser = () => storage.get(USER_KEY, null)
export const isLoggedIn = () => !!getCurrentUser()
export const getToken = () => storage.get(TOKEN_KEY, null)
export const setToken = (t) => storage.set(TOKEN_KEY, t)
export const clearToken = () => storage.remove(TOKEN_KEY)

export const loginUser = (phone, name = '', token = null) => {
  const user = {
    phone,
    name: name || 'کاربر کافه ترشی',
    loggedAt: new Date().toISOString(),
  }
  storage.set(USER_KEY, user)
  if (token) setToken(token)
  // همگام‌سازی با bk-user برای autofill توی Checkout
  const existing = storage.get('user', {})
  storage.set('user', {
    name: user.name,
    phone: user.phone,
    address: existing.address || '',
  })
  window.dispatchEvent(new Event('auth-changed'))
  window.dispatchEvent(new Event('fav-updated'))
  return user
}

export const logoutUser = () => {
  storage.remove(USER_KEY)
  clearToken()
  window.dispatchEvent(new Event('auth-changed'))
  window.dispatchEvent(new Event('fav-updated'))
}

export const updateUserName = (name) => {
  const user = getCurrentUser()
  if (user) {
    const updated = { ...user, name }
    storage.set(USER_KEY, updated)
    window.dispatchEvent(new Event('auth-changed'))
  }
}

export const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString()
export const normalizeDigits = (s) => String(s || '')
  .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
  .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
  .replace(/[\u200c-\u200f\u202a-\u202e\u00a0\s-]/g, '')

export const normalizePhone = (s) => {
  let x = normalizeDigits(s).replace(/\D/g, '')
  if (x.length === 12 && x.startsWith('98')) x = '0' + x.slice(2)
  if (x.length === 10 && x.startsWith('9')) x = '0' + x
  return x
}

export const isValidPhone = (phone) => /^09\d{9}$/.test(normalizePhone(phone))
