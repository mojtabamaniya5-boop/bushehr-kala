import { storage } from './storage'

const USER_KEY = 'user-auth'

export const getCurrentUser = () => storage.get(USER_KEY, null)
export const isLoggedIn = () => !!getCurrentUser()

export const loginUser = (phone, name = '') => {
  const user = {
    phone,
    name: name || 'کاربر کافه ترشی',
    loggedAt: new Date().toISOString(),
  }
  storage.set(USER_KEY, user)
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
