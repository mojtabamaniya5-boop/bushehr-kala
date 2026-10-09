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
  window.dispatchEvent(new Event('auth-changed'))
  return user
}

export const logoutUser = () => {
  storage.remove(USER_KEY)
  window.dispatchEvent(new Event('auth-changed'))
}

// تولید کد ۴ رقمی (برای MVP — بعداً SMS)
export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// اعتبارسنجی شماره موبایل ایران
export const isValidPhone = (phone) => /^09\d{9}$/.test(phone.replace(/\D/g, ''))
