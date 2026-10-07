import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// تم پیش‌فرض تاریک
if (!localStorage.getItem('bk-theme')) {
  localStorage.setItem('bk-theme', 'dark')
  document.documentElement.classList.add('dark')
} else if (localStorage.getItem('bk-theme') === 'dark') {
  document.documentElement.classList.add('dark')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
