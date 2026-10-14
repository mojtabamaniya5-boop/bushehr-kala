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
export const isValidPhone = (phone) => /^09\d{9}$/.test(phone.replace(/\D/g, ''))
