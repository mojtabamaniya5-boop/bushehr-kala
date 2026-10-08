import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, Menu } from 'lucide-react'
import { cartCount } from '../utils/cart'
import { useEffect, useState } from 'react'
import Logo from './Logo'

export default function Header({ title, back = false, search = false, simple = false }) {
  const navigate = useNavigate()
  const [count, setCount] = useState(cartCount())

  useEffect(() => {
    const update = () => setCount(cartCount())
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  if (simple && title) {
    return (
      <header className="sticky top-0 z-30 bg-cream border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14 max-w-lg mx-auto">
          {back && (
            <button onClick={() => navigate(-1)} className="p-1 -mr-1 active:scale-95 text-ink">←</button>
          )}
          <h1 className="flex-1 font-bold text-base truncate text-ink text-center">{title}</h1>
          <div className="w-7"></div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-30 bg-cream">
      <div className="max-w-lg mx-auto px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          {/* دکمه منو */}
          <button className="p-2 -mr-2 active:scale-95 text-ink">
            <Menu size={24} />
          </button>

          {/* لوگو + عنوان */}
          <Link to="/" className="flex flex-col items-center">
            <Logo size={56} />
            <h1 className="font-extrabold text-xl text-brand leading-tight mt-1">کافه ترشی</h1>
            <p className="text-[10px] text-muted font-medium mt-0.5">طعم اصیل، با ارسال سریع</p>
            {/* خط زرد منحنی زیر tagline */}
            <svg viewBox="0 0 120 8" width="90" height="8" className="mt-0.5">
              <path d="M 4 5 Q 30 1 60 3 Q 90 5 116 2" stroke="#F8C02D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
          </Link>

          {/* سبد خرید */}
          <Link to="/cart" className="p-2 -ml-2 relative active:scale-95 text-ink">
            <ShoppingBag size={24} />
            {count > 0 && (
              <span className="absolute top-0 left-0 bg-brand text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {count}
              </span>
            )}
          </Link>
        </div>

        {/* نوار جستجو — pill shaped */}
        <Link to="/search"
          className="flex items-center gap-3 bg-white rounded-full px-4 py-3 mb-2 border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.99] transition">
          <Search size={18} className="text-muted flex-shrink-0" />
          <span className="text-xs text-muted flex-1">جستجوی ترشی، خیارشور، زیتون و ...</span>
        </Link>
      </div>
    </header>
  )
}
