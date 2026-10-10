import { supabase } from './supabase'

const SESSION_KEY = 'bk-admin-session'
const SESSION_TTL = 24 * 60 * 60 * 1000 // ۲۴ ساعت

export async function checkAdminSession() {
  // اول چک کن expiration
  try {
    const data = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    if (data && Date.now() - data.ts > SESSION_TTL) {
      // منقضی شده
      await supabase.auth.signOut()
      localStorage.removeItem(SESSION_KEY)
      return null
    }
  } catch {}

  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now() }))
  }
  return session
}

export async function updateSessionTimestamp() {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now() }))
  } catch {}
}

export function clearSession() {
  try { localStorage.removeItem(SESSION_KEY) } catch {}
}

// فراموشی پسورد
export async function sendPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${window.location.pathname}#/admin`,
  })
  return { ok: !error, error: error?.message }
}

// تغییر پسورد (وقتی کاربر بعد از کلیک روی ایمیل برگرده)
export async function changePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { ok: !error, error: error?.message }
}

// چک کن که آیا کاربر از لینک reset برگشته
export function isRecoveryMode() {
  return window.location.hash.includes('type=recovery')
}
