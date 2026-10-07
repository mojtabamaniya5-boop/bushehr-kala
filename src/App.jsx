import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import ToastHost from './components/Toast'
import Onboarding from './components/Onboarding'
import InstallPrompt from './components/InstallPrompt'
import { storage } from './utils/storage'

import Home from './pages/Home'
import Categories from './pages/Categories'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import ProductDetail from './pages/ProductDetail'
import Search from './pages/Search'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import Admin from './pages/Admin'

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setShowOnboarding(!storage.get('onboarded'))
    setReady(true)
  }, [])

  if (!ready) return null

  const isAdmin = window.location.hash.startsWith('#/admin')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {showOnboarding && !isAdmin && <Onboarding onDone={() => setShowOnboarding(false)} />}
      <ToastHost />
      {!isAdmin && <InstallPrompt />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Categories />} />
        <Route path="/category/:catId" element={<Categories />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success/:id" element={<Success />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>

      {!isAdmin && <BottomNav />}
    </div>
  )
}
