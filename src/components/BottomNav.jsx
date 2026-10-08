import { NavLink } from 'react-router-dom'
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cartCount } from '../utils/cart'

const items = [
  { path: '/profile',   label: 'پروفایل',    icon: User },
  { path: '/favorites', label: 'علاقه‌مندی',  icon: Heart },
  { path: '/cart',      label: 'سبد خرید',   icon: ShoppingCart, badge: true, center: true },
  { path: '/search',    label: 'جستجو',      icon: Search },
  { path: '/',          label: 'خانه',        icon: Home, end: true },
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
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-2">
        {items.map(({ path, label, icon: Icon, badge, center, end }) => (
          <NavLink key={path} to={path} end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative transition`
            }>
            {({ isActive }) => (
              <>
                {center ? (
                  <div className="relative -mt-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition
                      ${isActive ? 'bg-brand shadow-brand/40' : 'bg-brand'}`}>
                      <Icon size={26} className="text-white" strokeWidth={2.5} />
                    </div>
                    {badge && count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 border-2 border-white">
                        {count}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition
                    ${isActive ? 'bg-brand' : 'bg-transparent'}`}>
                    <Icon size={22} className={isActive ? 'text-white' : 'text-muted'} strokeWidth={2.2} />
                  </div>
                )}
                <span className={`text-[10px] font-bold ${isActive ? 'text-brand' : 'text-muted'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
