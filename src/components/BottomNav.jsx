import { NavLink, useLocation } from 'react-router-dom'
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cartCount } from '../utils/cart'

const items = [
  { path: '/profile',   label: 'پروفایل',    icon: User },
  { path: '/favorites', label: 'علاقه‌مندی‌ها', icon: Heart },
  { path: '/cart',      label: 'سبد خرید',   icon: ShoppingCart, badge: true, big: true },
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

  const isActive = (path, end) =>
    end ? location.pathname === path : location.pathname.startsWith(path)

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40">
      <div className="relative max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.10)] px-2"
          style={{ height: '66px' }}>
          <div className="flex justify-around items-center h-full">
            {items.map(({ path, label, icon: Icon, badge, big, end }) => {
              const active = isActive(path, end)

              if (big) {
                return (
                  <NavLink key={path} to={path}
                    className="relative flex-1 flex flex-col items-center justify-center h-full">
                    {/* دایره سبز — کمی بیرون از نوار */}
                    <div
                      className="absolute rounded-full bg-brand flex items-center justify-center"
                      style={{
                        width: '58px',
                        height: '58px',
                        bottom: '8px',
                        boxShadow: '0 6px 18px rgba(46,125,50,0.40)',
                        zIndex: 5,
                      }}>
                      <ShoppingCart size={26} className="text-white" strokeWidth={2.5} />
                      {badge && count > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-danger text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 border-2 border-white">
                          {count}
                        </span>
                      )}
                    </div>
                  </NavLink>
                )
              }

              return (
                <NavLink key={path} to={path} end={end}
                  className="flex-1 flex flex-col items-center justify-center gap-1">
                  <Icon
                    size={22}
                    className={active ? 'text-brand' : 'text-muted'}
                    strokeWidth={active ? 2.6 : 2.2}
                  />
                  <span className={`text-[10px] font-bold ${active ? 'text-brand' : 'text-muted'}`}>
                    {label}
                  </span>
                </NavLink>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
