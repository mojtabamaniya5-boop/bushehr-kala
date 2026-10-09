import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import ToastHost from './components/Toast'
import Onboarding from './components/Onboarding'
import Drawer from './components/Drawer'
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
import Favorites from './pages/Favorites'
import About from './pages/About'
import Terms from './pages/Terms'
import Contact from './pages/Contact'
import Login from './pages/Login'
import MyOrders from './pages/MyOrders'

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [ready, setReady] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setShowOnboarding(!storage.get('onboarded'))
    setReady(true)
    const openHandler = () => setDrawerOpen(true)
    window.addEventListener('open-drawer', openHandler)
    return () => window.removeEventListener('open-drawer', openHandler)
  }, [])

  if (!ready) return null

  const isAdmin = window.location.hash.startsWith('#/admin')

  return (
    <div className="min-h-screen bg-cream text-ink">
      {showOnboarding && !isAdmin && <Onboarding onDone={() => setShowOnboarding(false)} />}
      <ToastHost />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

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
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>

      {!isAdmin && <BottomNav />}
    </div>
  )
}
