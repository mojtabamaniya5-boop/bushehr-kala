import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { loadSavedTheme } from './utils/theme'
import ErrorBoundary from './ErrorBoundary.jsx'
import { setupRealtime } from './utils/realtime'
import { captureSource } from './utils/source'
import './index.css'

// ── چک اول: اگه از Zibal برگشتیم ──
const zibalParams = new URLSearchParams(window.location.search)
if (zibalParams.has('trackId') || zibalParams.has('success')) {
  // پارامترها رو ذخیره کن
  sessionStorage.setItem('zibal_return', zibalParams.toString())
  // redirect به صفحه verify — پارامترها را نگه دار تا Verify بخواندشان
  const base = window.location.origin + window.location.pathname
  window.location.replace(base + '#/verify?' + zibalParams.toString())
} else {
  // اگه چیز خاصی نبود، اپ عادی رو اجرا کن
  // تیره‌کردن خودکار حذف شده
  localStorage.removeItem('bk-theme')
  document.documentElement.classList.remove('dark')
  document.documentElement.setAttribute('data-theme', 'light')

  try { setupRealtime() } catch (e) { console.warn('realtime setup failed', e) } // فعال‌سازی Realtime
  try { captureSource() } catch (e) { console.warn('source capture failed', e) } // ثبت منبع ورودی

  // ضربان حضور زنده: هر ۳۰ ثانیه به رله می‌گوید این بازدیدکننده هنوز تو سایت است
  // (بدون هیچ اطلاعات شخصی؛ فقط یک شناسه تصادفی در مرورگر خودش)
  try {
    const RELAY_PRESENCE = 'https://relay.cafetorshi.ir'
    const getVid = () => {
      try {
        let v = localStorage.getItem('bk-visitor')
        if (!v) {
          v = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ('v-' + Math.random().toString(36).slice(2) + Date.now().toString(36))
          localStorage.setItem('bk-visitor', v)
        }
        return v
      } catch { return null }
    }
    const beat = () => {
      try {
        if (document.visibilityState !== 'visible') return
        if (window.location.hash.startsWith('#/admin')) return // پنل ادمین شمرده نمی‌شود
        const vid = getVid()
        if (!vid) return
        fetch(RELAY_PRESENCE + '/api/presence/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vid }),
          keepalive: true,
        }).catch(() => {})
      } catch {}
    }
    beat()
    setInterval(beat, 30000)
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') beat() })
  } catch (e) { console.warn('presence heartbeat failed', e) }

  try { loadSavedTheme() } catch (e) { console.warn('theme load failed', e) }

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </React.StrictMode>,
  )
}
