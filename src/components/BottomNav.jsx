import { NavLink, useLocation } from 'react-router-dom'
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cartCount } from '../utils/cart'

const items = [
  { path: '/',          label: 'خانه',        icon: Home, end: true },
  { path: '/search',    label: 'جستجو',      icon: Search },
  { path: '/cart',      label: 'سبد خرید',   icon: ShoppingCart, badge: true },
  { path: '/favorites', label: 'علاقه‌مندی',  icon: Heart },
  { path: '/profile',   label: 'پروفایل',    icon: User },
]

export default function BottomNav() {
  const [count, setCount] = useState(cartCount())
  const location = useLocation()

  useEffect(() => {
    const update = () => setCount(cartCount())
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  const isActive = (path, end) => end ? location.pathname === path : location.pathname.startsWith(path)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border">
      <div className="relative max-w-lg mx-auto h-20">
        <div className="flex justify-around items-center h-full px-1">
          {items.map(({ path, label, icon: Icon, badge, end }) => {
            const active = isActive(path, end)
            return (
              <NavLink key={path} to={path} end={end}
                className="flex-1 flex flex-col items-center justify-center relative">
                {/* دایره سبز — فقط وقتی active، نصف داخل نصف بیرون */}
                {active && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-full bg-brand transition-all duration-300"
                    style={{
                      width: '52px',
                      height: '52px',
                      top: '-8px',
                      boxShadow: '0 6px 18px rgba(46,125,50,0.4)',
                      zIndex: 1,
                    }}
                  />
                )}

                {/* آیکون */}
                <div className="relative flex items-center justify-center" style={{ width: '44px', height: '44px', zIndex: 2 }}>
                  <Icon
                    size={22}
                    className={`transition-colors duration-200 ${active ? 'text-white' : 'text-muted'}`}
                    strokeWidth={2.3}
                  />
                  {badge && count > 0 && (
                    <span className="absolute -top-3 -right-1 bg-danger text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 border-2 border-white z-10">
                      {count}
                    </span>
                  )}
                </div>

                {/* لیبل */}
                <span className={`text-[10px] font-bold mt-1 transition-colors duration-200 ${active ? 'text-brand' : 'text-muted'}`}>
                  {label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
