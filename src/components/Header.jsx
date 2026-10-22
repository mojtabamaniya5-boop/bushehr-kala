import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, Menu, ArrowRight } from 'lucide-react'
import { cartCount } from '../utils/cart'
import { useEffect, useState } from 'react'
import { getShopSettings } from '../api/shop'

export default function Header({ title, back }) {
  const [logoUrl, setLogoUrl] = useState(null)
  const [count, setCount] = useState(cartCount())
  const navigate = useNavigate()
  const base = import.meta.env.BASE_URL

  useEffect(() => {
    getShopSettings().then(s => s.logoUrl && setLogoUrl(s.logoUrl)).catch(()=>{})
    const update = () => setCount(cartCount())
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  const openDrawer = () => window.dispatchEvent(new Event('open-drawer'))

  if (title) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="flex items-center gap-3 px-4 h-14 max-w-lg mx-auto">
          {back ? (
            <button onClick={() => navigate(-1)} className="p-1 -mr-1 active:scale-95 text-on-page">
              <ArrowRight size={22} />
            </button>
          ) : <div className="w-7"></div>}
          <h1 className="flex-1 font-bold text-base truncate text-on-page text-center">{title}</h1>
          <Link to="/cart" className="p-1 relative active:scale-95 text-on-page">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-1 -left-1 bg-brand text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                {count}
              </span>
            )}
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-page/90 backdrop-blur-md">
      <div className="max-w-lg mx-auto px-4 pt-2 pb-3">
        <div className="flex items-start justify-between mb-2">
          <button onClick={openDrawer} className="p-1.5 mt-1 active:scale-95 text-on-page">
            <Menu size={22} />
          </button>

          <Link to="/" className="flex flex-col items-center">
            <img
              src={logoUrl || `${base}assets/categories/mixed.png`}
              alt="کافه ترشی"
              className="w-12 h-12 object-contain"
            />
            <h1 className="font-extrabold text-base text-brand leading-none mt-0.5">کافه ترشی</h1>
            <p className="text-[9px] text-on-page-muted font-medium mt-0.5">طعم اصیل، با ارسال سریع</p>
            <svg viewBox="0 0 100 6" width="66" height="6" className="mt-0.5">
              <path d="M 4 4 Q 25 1 50 3 Q 75 5 96 2" className="stroke-accent" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </Link>

          <Link to="/cart" className="p-1.5 mt-1 relative active:scale-95 text-on-page">
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -left-1 bg-brand text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                {count}
              </span>
            )}
          </Link>
        </div>

        <Link to="/search"
          className="flex items-center gap-2 bg-card rounded-full px-4 py-2.5 border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.99] transition">
          <Search size={16} className="text-on-page-muted flex-shrink-0" />
          <span className="text-[11px] text-on-page-muted flex-1">جستجوی ترشی، خیارشور، زیتون و ...</span>
        </Link>
      </div>
    </header>
  )
}
