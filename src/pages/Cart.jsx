import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getCart, updateQty, removeFromCart, cartTotal, clearCart } from '../utils/cart'
import { formatPrice, storage } from '../utils/storage'
import { SHOP_INFO, calculateShipping } from '../data/products'
import { Trash2, Minus, Plus, ShoppingBag, Zap } from 'lucide-react'
import { toast } from '../components/Toast'

export default function Cart() {
  const [items, setItems] = useState(getCart())
  const navigate = useNavigate()

  useEffect(() => {
    const update = () => setItems(getCart())
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  const total = cartTotal()
  const lastAddr = storage.get('last-address', '')
  const lastPostal = storage.get('last-postal', '')
  const shipInfo = calculateShipping(lastPostal, lastAddr, total, 'fast')
  const shipping = items.length ? shipInfo.cost : 0
  const isBushehr = shipInfo.sameDay

  const handleClearAll = () => {
    if (confirm('مطمئنی میخوای کل سبد خرید رو خالی کنی؟')) {
      clearCart()
      toast.success('سبد خرید خالی شد')
    }
  }

  const handleRemoveOne = (item) => {
    if (confirm(`«${item.title}» از سبد حذف بشه؟`)) {
      removeFromCart(item.id)
      toast.success('حذف شد')
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Header title="سبد خرید" />
        <main className="max-w-lg mx-auto px-4 pt-20 text-center fade-up">
          <div className="w-24 h-24 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={40} className="text-brand" />
          </div>
          <p className="font-extrabold text-base text-ink mb-1">سبد خرید خالیه</p>
          <p className="text-xs text-muted mb-6">یه سر به محصولات بزن</p>
          <Link to="/" className="inline-block bg-brand text-white text-sm font-extrabold px-6 py-3 rounded-full shadow-md active:scale-95 transition">
            مشاهده محصولات
          </Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Header title="سبد خرید" />
      <main className="max-w-lg mx-auto px-4 pb-44 pt-3 fade-up">

        {/* بنر بوشهر */}
        {isBushehr && (
          <div className="bg-accent/15 border border-accent/40 rounded-2xl p-3 mb-3 flex items-center gap-2 fade-up">
            <Zap size={18} className="text-ink flex-shrink-0" />
            <p className="text-[11px] text-ink leading-5">
              <b>ارسال رایگان</b> + تحویل <b>حداکثر ۱ ساعت</b> برای بوشهر 🎉
            </p>
          </div>
        )}

        {/* هدر سبد با دکمه حذف همه */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted">
            <span className="font-extrabold text-brand text-sm">{items.length}</span> محصول در سبد
          </span>
          <button onClick={handleClearAll}
            className="flex items-center gap-1.5 text-[11px] font-bold text-danger bg-danger/10 px-3 py-1.5 rounded-full active:scale-95 transition">
            <Trash2 size={13} />
            خالی کردن سبد
          </button>
        </div>

        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-3 flex gap-3 border border-border">
              <img src={item.image} alt={item.title} className="w-20 h-20 rounded-xl object-cover bg-cream" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-medium line-clamp-2 mb-1.5">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-brand">{formatPrice(item.price)}</span>
                  <button onClick={() => handleRemoveOne(item)}
                    className="p-1.5 rounded-lg text-danger bg-danger/10 active:scale-90 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-7 h-7 rounded-lg bg-brand-light flex items-center justify-center active:scale-90 text-brand">
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-7 h-7 rounded-lg bg-brand text-white flex items-center justify-center active:scale-90">
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-border p-4 z-40">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted">جمع کالاها</span>
            <span className="text-ink">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-xs mb-2.5">
            <span className="text-muted">هزینه ارسال</span>
            <span className={shipping === 0 ? 'text-brand font-bold' : 'text-ink'}>
              {shipping === 0 ? '🎉 رایگان' : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex justify-between font-extrabold text-sm mb-3 pt-2.5 border-t border-dashed border-border">
            <span>قابل پرداخت</span>
            <span className="text-brand">{formatPrice(total + shipping)}</span>
          </div>
          <button onClick={() => navigate('/checkout')}
            className="w-full bg-brand text-white font-extrabold py-3.5 rounded-2xl active:scale-[0.98] shadow-md">
            ادامه و پرداخت
          </button>
        </div>
      </div>
    </>
  )
}
