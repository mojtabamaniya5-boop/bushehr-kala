import { NavLink, useLocation } from 'react-router-dom'
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cartCount } from '../utils/cart'

const items = [
  { path: '/profile',   label: 'پروفایل',    icon: User },
  { path: '/favorites', label: 'علاقه‌مندی',  icon: Heart },
  { path: '/cart',      label: 'سبد خرید',   icon: ShoppingCart, badge: true },
  { path: '/search',    label: 'جستجو',      icon: Search },
  { path: '/',          label: 'خانه',        icon: Home, end: true },
]

export default function BottomNav() {
  const [count, setCount] = useState(cartCount())
  const location = useLocation()

  useEffect(() => {
    const update = () => setCount(cartCount())
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  const isActive = (path, end) => {
    if (end) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  // پیدا کردن ایندکس تب فعال برای انیمیشن دایره
  const activeIndex = items.findIndex(it => isActive(it.path, it.end))

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border">
      <div className="relative max-w-lg mx-auto h-20">
        {/* دایره سبز متحرک — پشت آیکون‌ها */}
        {activeIndex >= 0 && (
          <div
            className="absolute top-2 transition-all duration-300 ease-out pointer-events-none"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: '#2E7D32',
              boxShadow: '0 6px 16px rgba(46,125,50,0.35)',
              right: `calc(${activeIndex * 20}% + 10% - 26px)`,
            }}
          />
        )}

        <div className="relative flex justify-around items-center h-full">
          {items.map(({ path, label, icon: Icon, badge, end }, idx) => {
            const active = isActive(path, end)
            return (
              <NavLink key={path} to={path} end={end}
                className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative z-10">
                <div className="relative flex items-center justify-center" style={{ width: '52px', height: '52px' }}>
                  <Icon
                    size={22}
                    className={`transition-colors duration-300 ${active ? 'text-white' : 'text-muted'}`}
                    strokeWidth={2.2}
                  />
                  {badge && count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 border-2 border-white z-20">
                      {count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold transition-colors duration-300 ${active ? 'text-brand' : 'text-muted'}`}>
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
