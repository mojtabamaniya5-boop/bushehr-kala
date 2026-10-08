import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// کافه ترشی — فقط تم روشن
localStorage.removeItem('bk-theme')
document.documentElement.classList.remove('dark')
document.documentElement.setAttribute('data-theme', 'light')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
