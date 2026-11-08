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
