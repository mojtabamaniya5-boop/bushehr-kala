import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, ArrowRight, MapPin } from 'lucide-react'
import { SHOP_INFO } from '../data/products'
import { cartCount } from '../utils/cart'
import { useEffect, useState } from 'react'

export default function Header({ title, back = false, search = false, simple = false }) {
  const navigate = useNavigate()
  const [count, setCount] = useState(cartCount())

  useEffect(() => {
    const update = () => setCount(cartCount())
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  return (
    <header className="sticky top-0 z-30 bg-cream border-b border-border">
      <div className="flex items-center gap-3 px-4 h-16 max-w-lg mx-auto">
        {back ? (
          <button onClick={() => navigate(-1)} className="p-1 -mr-1 active:scale-95 text-ink">
            <ArrowRight size={22} />
          </button>
        ) : (
          <button className="flex items-center gap-1 text-ink">
            <MapPin size={16} className="text-brand" />
            <span className="text-[10px] font-bold">بوشهر</span>
          </button>
        )}

        {title ? (
          <h1 className="flex-1 font-bold text-base truncate text-ink text-center">{title}</h1>
        ) : (
          <Link to="/" className="flex-1 flex flex-col items-center">
            <span className="font-extrabold text-lg text-brand leading-tight">کافه ترشی</span>
            <span className="text-[9px] text-muted">{SHOP_INFO.tagline}</span>
          </Link>
        )}

        {search && (
          <button onClick={() => navigate('/search')} className="p-2 active:scale-95 text-ink">
            <Search size={20} />
          </button>
        )}

        <Link to="/cart" className="p-2 relative active:scale-95 text-ink">
          <ShoppingBag size={20} />
          {count > 0 && (
            <span className="absolute top-0.5 left-0.5 bg-brand text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
