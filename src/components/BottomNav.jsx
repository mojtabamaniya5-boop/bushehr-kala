import { NavLink } from 'react-router-dom'
import { Home, Grid3x3, ShoppingCart, Receipt, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cartCount } from '../utils/cart'

const items = [
  { path: '/',         label: 'خانه',     icon: Home },
  { path: '/category', label: 'دسته‌ها',  icon: Grid3x3 },
  { path: '/cart',     label: 'سبد',      icon: ShoppingCart, badge: true },
  { path: '/orders',   label: 'سفارش‌ها', icon: Receipt },
  { path: '/profile',  label: 'پروفایل',  icon: User },
]

export default function BottomNav() {
  const [count, setCount] = useState(cartCount())

  useEffect(() => {
    const update = () => setCount(cartCount())
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {items.map(({ path, label, icon: Icon, badge }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative transition ${
                isActive
                  ? 'text-brand'
                  : 'text-slate-500 dark:text-slate-400'
              }`
            }
          >
            <div className="relative">
              <Icon size={22} />
              {badge && count > 0 && (
                <span className="absolute -top-1.5 -left-2 bg-brand text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {count}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
