import { NavLink, useLocation } from 'react-router-dom'
import { Home, ShoppingCart, Heart, User, Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cartCount } from '../utils/cart'

const items = [
  { path: '/',          label: 'خانه',           icon: Home, end: true },
  { path: '/favorites', label: 'علاقه‌مندی‌ها',    icon: Heart },
  { path: '/cart',      label: 'سبد خرید',        icon: ShoppingCart, badge: true, big: true },
  { path: '/my-orders', label: 'پیگیری سفارشات', icon: Package, requiresAuth: true },
  { path: '/profile',   label: 'پروفایل',         icon: User },
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
    <nav className="fixed bottom-3 left-0 right-0 z-40 flex justify-center px-6">
      <div className="relative w-full max-w-[420px]">
        <div className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.10)] px-2 relative"
          style={{ height: '52px' }}>
          <div className="flex justify-around items-center h-full">
            {items.map(({ path, label, icon: Icon, badge, big, end }) => {
              const active = isActive(path, end)

              if (big) {
                return (
                  <NavLink key={path} to={path}
                    className="relative flex-1 flex flex-col items-center justify-center h-full">
                    <div
                      className="absolute rounded-full bg-brand flex items-center justify-center"
                      style={{
                        width: '60px',
                        height: '60px',
                        bottom: '-4px',
                        boxShadow: '0 6px 18px rgba(46,125,50,0.40)',
                        zIndex: 5,
                      }}>
                      <ShoppingCart size={26} className="text-white" strokeWidth={2.5} />
                      {badge && count > 0 && (
                        <div
                          className="absolute bg-danger text-white font-bold rounded-full flex items-center justify-center border-2 border-white"
                          style={{
                            top: '-4px',
                            right: '-4px',
                            minWidth: '20px',
                            height: '20px',
                            fontSize: '10px',
                            lineHeight: '1',
                            padding: '0 4px',
                          }}>
                          {count}
                        </div>
                      )}
                    </div>
                  </NavLink>
                )
              }

              return (
                <NavLink key={path} to={path} end={end}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5">
                  <Icon
                    size={19}
                    className={active ? 'text-brand' : 'text-muted'}
                    strokeWidth={active ? 2.6 : 2.2}
                  />
                  <span className={`text-[9px] font-bold ${active ? 'text-brand' : 'text-muted'}`}>
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
