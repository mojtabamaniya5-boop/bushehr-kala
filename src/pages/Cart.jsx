import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getCart, updateQty, removeFromCart, cartTotal } from '../utils/cart'
import { formatPrice } from '../utils/storage'
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'
import { SHOP_INFO } from '../data/products'

export default function Cart() {
  const [items, setItems] = useState(getCart())
  const navigate = useNavigate()

  useEffect(() => {
    const update = () => setItems(getCart())
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  const total = cartTotal()
  const shipping = total >= SHOP_INFO.freeShippingFrom ? 0 : (items.length ? SHOP_INFO.shippingFast : 0)

  if (items.length === 0) {
    return (
      <>
        <Header title="سبد خرید" />
        <main className="max-w-lg mx-auto px-4 pt-24 text-center fade-up">
          <ShoppingBag size={64} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="font-medium mb-1">سبد خرید خالیه</p>
          <p className="text-xs text-slate-500 mb-6">یه سر به محصولات بزن</p>
          <Link to="/" className="inline-block bg-brand text-white text-sm font-bold px-6 py-2.5 rounded-full">
            مشاهده محصولات
          </Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Header title="سبد خرید" />
      <main className="max-w-lg mx-auto px-4 pb-40 pt-3 fade-up">
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl p-3 flex gap-3 border border-slate-200 dark:border-slate-700">
              <img src={item.image} alt={item.title} className="w-20 h-20 rounded-xl object-cover bg-slate-100" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-medium line-clamp-2 mb-1.5">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-brand">{formatPrice(item.price)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="p-1 text-slate-400 active:scale-90">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center active:scale-90"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-7 h-7 rounded-lg bg-brand text-white flex items-center justify-center active:scale-90"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* جمع کل */}
      <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">جمع کالاها</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-500">هزینه ارسال</span>
            <span className={shipping === 0 ? 'text-green-500' : ''}>
              {shipping === 0 ? 'رایگان' : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex justify-between font-bold text-sm mb-3 pt-2 border-t border-dashed border-slate-300 dark:border-slate-700">
            <span>قابل پرداخت</span>
            <span className="text-brand">{formatPrice(total + shipping)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-brand text-white font-bold py-3 rounded-xl active:scale-[0.98] transition"
          >
            ادامه و پرداخت
          </button>
        </div>
      </div>
    </>
  )
}
