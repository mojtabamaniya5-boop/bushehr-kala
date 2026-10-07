import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { storage, formatPrice } from '../utils/storage'
import { getFavorites } from '../utils/cart'
import { PRODUCTS, SHOP_INFO } from '../data/products'
import { Heart, Phone, Send, MapPin, MessageCircle, Trash2, ShoppingBag } from 'lucide-react'

export default function Profile() {
  const [user, setUser] = useState(storage.get('user', { name: '', phone: '' }))
  const [favCount, setFavCount] = useState(getFavorites().length)
  const [ordersCount, setOrdersCount] = useState(storage.get('orders', []).length)

  useEffect(() => {
    const update = () => setFavCount(getFavorites().length)
    window.addEventListener('fav-updated', update)
    return () => window.removeEventListener('fav-updated', update)
  }, [])

  const saveUser = (field, val) => {
    const u = { ...user, [field]: val }
    setUser(u)
    storage.set('user', u)
  }

  const clearAll = () => {
    if (confirm('همه اطلاعات (سبد، سفارش‌ها، علاقه‌مندی‌ها) پاک شود؟')) {
      storage.clear()
      location.reload()
    }
  }

  const favProducts = PRODUCTS.filter(p => getFavorites().includes(p.id))

  return (
    <>
      <Header title="پروفایل" />
      <main className="max-w-lg mx-auto px-4 pb-24 pt-3 fade-up">
        {/* کارت کاربر */}
        <div className="bg-gradient-to-l from-brand to-brand-dark text-white rounded-2xl p-5 mb-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-3">
            {user.name ? user.name[0] : '👤'}
          </div>
          <input
            value={user.name}
            onChange={e => saveUser('name', e.target.value)}
            placeholder="نام شما"
            className="bg-transparent text-lg font-bold placeholder-white/60 outline-none w-full mb-1"
          />
          <input
            value={user.phone}
            onChange={e => saveUser('phone', e.target.value)}
            placeholder="شماره موبایل"
            inputMode="tel"
            className="bg-transparent text-xs placeholder-white/60 outline-none w-full"
          />
        </div>

        {/* آمار */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link to="/orders" className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <ShoppingBag className="text-brand" size={22} />
            <div>
              <div className="text-lg font-bold">{ordersCount}</div>
              <div className="text-[10px] text-slate-500">سفارش</div>
            </div>
          </Link>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <Heart className="text-brand" size={22} />
            <div>
              <div className="text-lg font-bold">{favCount}</div>
              <div className="text-[10px] text-slate-500">علاقه‌مندی</div>
            </div>
          </div>
        </div>

        {/* علاقه‌مندی‌ها */}
        {favProducts.length > 0 && (
          <>
            <h3 className="font-bold text-sm mb-3">❤️ علاقه‌مندی‌ها</h3>
            <div className="space-y-2 mb-4">
              {favProducts.slice(0, 3).map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-2 border border-slate-200 dark:border-slate-700">
                  <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs truncate mb-0.5">{p.title}</div>
                    <div className="text-xs font-bold text-brand">{formatPrice(p.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* راه‌های تماس */}
        <h3 className="font-bold text-sm mb-3">📞 ارتباط با ما</h3>
        <div className="space-y-2 mb-4">
          <a href={`tel:${SHOP_INFO.phone}`} className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
            <Phone size={18} className="text-brand" />
            <span className="text-xs flex-1">تماس تلفنی</span>
            <span className="text-xs text-slate-500">{SHOP_INFO.phone}</span>
          </a>
          <a href={`https://t.me/${SHOP_INFO.telegram}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
            <Send size={18} className="text-brand" />
            <span className="text-xs flex-1">تلگرام</span>
            <span className="text-xs text-slate-500">@{SHOP_INFO.telegram}</span>
          </a>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
            <MapPin size={18} className="text-brand" />
            <span className="text-xs flex-1">{SHOP_INFO.address}</span>
          </div>
        </div>

        {/* کارت */}
        <h3 className="font-bold text-sm mb-3">💳 اطلاعات پرداخت</h3>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
          <div className="text-xs text-slate-500 mb-1">شماره کارت</div>
          <div className="font-mono text-sm font-bold tracking-wider mb-2" style={{ direction: 'ltr', textAlign: 'right' }}>
            {SHOP_INFO.card.number.replace(/(\d{4})/g, '$1 ').trim()}
          </div>
          <div className="text-xs text-slate-500">به نام {SHOP_INFO.card.holder}</div>
        </div>

        <button
          onClick={clearAll}
          className="w-full bg-red-500/10 text-red-500 font-medium text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Trash2 size={16} />
          پاک کردن همه اطلاعات
        </button>

        <p className="text-center text-[10px] text-slate-400 mt-6">
          بوشهر کالا — نسخه ۱.۰
        </p>
      </main>
    </>
  )
}
