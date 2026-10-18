import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { loadSavedTheme } from './utils/theme'
import ErrorBoundary from './ErrorBoundary.jsx'
import { setupRealtime } from './utils/realtime'
import './index.css'

// ── چک اول: اگه از Zibal برگشتیم ──
const zibalParams = new URLSearchParams(window.location.search)
if (zibalParams.has('trackId') || zibalParams.has('success')) {
  // پارامترها رو ذخیره کن
  sessionStorage.setItem('zibal_return', zibalParams.toString())
  // redirect به صفحه verify
  const base = window.location.origin + window.location.pathname
  window.location.replace(base + '#/verify')
} else {
  // اگه چیز خاصی نبود، اپ عادی رو اجرا کن
  // تیره‌کردن خودکار حذف شده
  localStorage.removeItem('bk-theme')
  document.documentElement.classList.remove('dark')
  document.documentElement.setAttribute('data-theme', 'light')

  setupRealtime() // فعال‌سازی Realtime

  loadSavedTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HashRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </HashRouter>
    </React.StrictMode>,
  )
}
