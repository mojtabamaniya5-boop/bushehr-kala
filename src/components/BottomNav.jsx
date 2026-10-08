import { NavLink } from 'react-router-dom'
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cartCount } from '../utils/cart'

const items = [
  { path: '/',            label: 'خانه',       icon: Home },
  { path: '/search',      label: 'جستجو',      icon: Search },
  { path: '/cart',        label: 'سبد خرید',   icon: ShoppingCart, badge: true },
  { path: '/favorites',   label: 'علاقه‌مندی',  icon: Heart },
  { path: '/profile',     label: 'پروفایل',    icon: User },
]

export default function BottomNav() {
  const [count, setCount] = useState(cartCount())

  useEffect(() => {
    const update = () => setCount(cartCount())
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {items.map(({ path, label, icon: Icon, badge }) => (
          <NavLink key={path} to={path} end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative transition ${isActive ? 'text-brand' : 'text-muted'}`
            }>
            <div className="relative">
              <Icon size={22} />
              {badge && count > 0 && (
                <span className="absolute -top-1.5 -left-2 bg-brand text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {count}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
