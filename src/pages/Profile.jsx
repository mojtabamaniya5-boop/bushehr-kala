import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { storage, formatPrice } from '../utils/storage'
import { getFavorites } from '../utils/cart'
import { getCurrentUser, logoutUser } from '../utils/auth'
import { PRODUCTS, SHOP_INFO } from '../data/products'
import ProductImage from '../components/ProductImage'
import { Heart, Phone, Send, MapPin, Trash2, ShoppingBag, User, LogOut, LogIn, Package } from 'lucide-react'
import { toast } from '../components/Toast'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getCurrentUser())
  const [favCount, setFavCount] = useState(getFavorites().length)
  const [ordersCount, setOrdersCount] = useState(0)

  useEffect(() => {
    const update = () => {
      setFavCount(getFavorites().length)
      setUser(getCurrentUser())
    }
    window.addEventListener('fav-updated', update)
    window.addEventListener('auth-changed', update)

    // شمارش سفارش‌های کاربر
    if (user) {
      const localOrders = JSON.parse(localStorage.getItem('bk-orders') || '[]')
        .filter(o => o.customer?.phone === user.phone)
      setOrdersCount(localOrders.length)
    }

    return () => {
      window.removeEventListener('fav-updated', update)
      window.removeEventListener('auth-changed', update)
    }
  }, [user])

  const handleLogout = () => {
    if (confirm('از حساب خارج می‌شوی؟')) {
      logoutUser()
      toast.success('خارج شدی')
      navigate('/', { replace: true })
    }
  }

  const favProducts = PRODUCTS.filter(p => getFavorites().includes(p.id))
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '؟'

  return (
    <>
      <Header title="پروفایل" />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-3 fade-up">

        {/* کارت پروفایل */}
        {user ? (
          <div className="rounded-3xl p-5 mb-4 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #185C28 100%)' }}>
            <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/10"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full bg-accent/20"></div>

            <div className="relative flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur flex items-center justify-center text-2xl font-extrabold border-2 border-white/40">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-extrabold truncate">{user.name}</div>
                <div className="text-xs opacity-90 mt-0.5" style={{ direction: 'ltr', textAlign: 'right' }}>
                  {user.phone}
                </div>
              </div>
            </div>
            <p className="relative text-[10px] text-white/80">🫙 خوش آمدی به کافه ترشی</p>
          </div>
        ) : (
          <Link to="/login"
            className="block rounded-3xl p-5 mb-4 text-white relative overflow-hidden active:scale-[0.98] transition"
            style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #185C28 100%)' }}>
            <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/10"></div>
            <div className="relative flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/25 flex items-center justify-center border-2 border-white/40">
                <LogIn size={24} />
              </div>
              <div className="flex-1">
                <div className="text-base font-extrabold mb-0.5">ورود به حساب کاربری</div>
                <div className="text-[11px] opacity-90">با شماره موبایل وارد شو</div>
              </div>
              <span className="text-2xl">←</span>
            </div>
          </Link>
        )}

        {/* آمار */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link to={user ? '/my-orders' : '/login'}
            className="bg-white rounded-2xl p-4 border border-border flex items-center gap-3 active:scale-[0.98] transition">
            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
              <Package className="text-brand" size={20} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-ink">{ordersCount}</div>
              <div className="text-[10px] text-muted">سفارش</div>
            </div>
          </Link>
          <Link to="/favorites"
            className="bg-white rounded-2xl p-4 border border-border flex items-center gap-3 active:scale-[0.98] transition">
            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
              <Heart className="text-brand" size={20} />
            </div>
            <div>
              <div className="text-xl font-extrabold text-ink">{favCount}</div>
              <div className="text-[10px] text-muted">علاقه‌مندی</div>
            </div>
          </Link>
        </div>

        {/* علاقه‌مندی‌ها */}
        {favProducts.length > 0 && (
          <>
            <h3 className="font-extrabold text-sm mb-3 text-ink flex items-center gap-1.5">
              ❤️ علاقه‌مندی‌های من
            </h3>
            <div className="space-y-2 mb-5">
              {favProducts.slice(0, 3).map(p => (
                <Link key={p.id} to={`/product/${p.id}`}
                  className="flex items-center gap-3 bg-white rounded-2xl p-2.5 border border-border active:scale-[0.98] transition">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                    <ProductImage product={p} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-ink truncate mb-1">{p.title}</div>
                    <div className="text-[11px] font-extrabold text-brand">{formatPrice(p.price)}</div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center">
                    <Heart size={12} className="text-brand fill-brand" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* ارتباط با ما */}
        <h3 className="font-extrabold text-sm mb-3 text-ink flex items-center gap-1.5">
          📞 ارتباط با ما
        </h3>
        <div className="space-y-2 mb-5">
          <a href={`tel:${SHOP_INFO.phone}`}
            className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-border active:scale-[0.98] transition">
            <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center">
              <Phone size={16} className="text-brand" />
            </div>
            <span className="text-xs font-bold flex-1 text-ink">تماس تلفنی</span>
            <span className="text-[10px] text-muted" style={{ direction: 'ltr' }}>{SHOP_INFO.phone}</span>
          </a>
          <a href={`https://ble.ir/${SHOP_INFO.telegram}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-border active:scale-[0.98] transition">
            <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center">
              <Send size={16} className="text-brand" />
            </div>
            <span className="text-xs font-bold flex-1 text-ink">پیام‌رسان بله</span>
            <span className="text-[10px] text-muted">@{SHOP_INFO.telegram}</span>
          </a>
          <Link to="/contact"
            className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-border active:scale-[0.98] transition">
            <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center">
              <MapPin size={16} className="text-brand" />
            </div>
            <span className="text-xs font-bold flex-1 text-ink">تماس و آدرس کامل</span>
          </Link>
        </div>

        {/* اطلاعات پرداخت */}
        <h3 className="font-extrabold text-sm mb-3 text-ink flex items-center gap-1.5">
          💳 اطلاعات پرداخت
        </h3>
        <div className="rounded-3xl p-5 mb-5 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #185C28 0%, #2E7D32 60%, #4CAF50 100%)' }}>
          <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/10"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-accent/20"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] opacity-80">شماره کارت</span>
              <div className="w-10 h-7 rounded-md bg-accent/80"></div>
            </div>
            <div className="font-mono text-base font-extrabold tracking-widest mb-3"
              style={{ direction: 'ltr', textAlign: 'right' }}>
              {SHOP_INFO.card.number.replace(/(\d{4})/g, '$1 ').trim()}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[9px] opacity-70 mb-0.5">صاحب حساب</div>
                <div className="text-xs font-bold">{SHOP_INFO.card.holder}</div>
              </div>
              <div className="text-[10px] opacity-80">{SHOP_INFO.card.bank}</div>
            </div>
          </div>
        </div>

        {/* خروج */}
        {user && (
          <button onClick={handleLogout}
            className="w-full bg-white border border-border text-danger font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition mb-3">
            <LogOut size={16} />
            خروج از حساب
          </button>
        )}

        <p className="text-center text-[10px] text-muted mt-4 pb-2">
          کافه ترشی — نسخه ۱.۰
        </p>
      </main>
    </>
  )
}
