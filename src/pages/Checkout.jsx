import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getCart, cartTotal, clearCart } from '../utils/cart'
import { storage, formatPrice, uid } from '../utils/storage'
import { SHOP_INFO } from '../data/products'
import { saveOrderToDB } from '../utils/supabase'
import { User, Phone, MapPin, CreditCard, Wallet, AlertCircle, Check } from 'lucide-react'
import { toast } from '../components/Toast'

export default function Checkout() {
  const navigate = useNavigate()
  const items = getCart()
  const subtotal = cartTotal()
  const shipping = subtotal >= SHOP_INFO.freeShippingFrom ? 0 : SHOP_INFO.shippingCost
  const total = subtotal + shipping

  const savedUser = storage.get('user', {})
  const [form, setForm] = useState({
    name: savedUser.name || '',
    phone: savedUser.phone || '',
    address: storage.get('last-address', ''),
    note: '',
  })
  const [payment, setPayment] = useState('card')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (items.length === 0) navigate('/cart', { replace: true })
  }, [items.length, navigate])

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim() || form.name.trim().length < 3) e.name = 'نام را کامل وارد کن'
    if (!/^09\d{9}$/.test(form.phone.trim())) e.phone = 'شماره موبایل معتبر وارد کن (09...)'
    if (!form.address.trim() || form.address.trim().length < 10) e.address = 'آدرس را کامل وارد کن'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(SHOP_INFO.card.number)
      setCopied(true)
      toast.success('شماره کارت کپی شد')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('کپی نشد، دستی یادداشت کن')
    }
  }

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('لطفاً خطاهای فرم را برطرف کن')
      return
    }
    setSubmitting(true)

    const order = {
      id: uid().toUpperCase(),
      date: new Date().toISOString(),
      customer: { ...form },
      items: items.map(i => ({ id: i.id, title: i.title, price: i.price, qty: i.qty })),
      subtotal, shipping, total,
      payment,
      status: 'pending',
    }

    // ذخیره در localStorage (نسخه محلی)
    const orders = storage.get('orders', [])
    orders.push(order)
    storage.set('orders', orders)
    storage.set('user', { name: form.name, phone: form.phone })
    storage.set('last-address', form.address)

    // ذخیره در Supabase (تیگر DB، خودش به بله پیام می‌ده)
    try {
      const result = await saveOrderToDB(order)
      if (result.ok) {
        toast.success('سفارش ثبت شد ✅')
      } else {
        console.warn('DB error:', result.error)
        toast.info('سفارش ذخیره شد، در حال ارسال...')
      }
    } catch (e) {
      console.error('saveOrderToDB:', e)
    }

    clearCart()
    setTimeout(() => {
      navigate(`/success/${order.id}`, { replace: true })
    }, 500)
  }

  return (
    <>
      <Header title="تسویه حساب" back />
      <main className="max-w-lg mx-auto px-4 pb-44 pt-3 fade-up space-y-3">

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <User size={16} className="text-brand" /> اطلاعات گیرنده
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">نام و نام خانوادگی</label>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="مثلاً: علی رضایی"
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-3 py-2.5 text-sm outline-none transition ${
                  errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-brand'
                }`}
              />
              {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">شماره موبایل</label>
              <input
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="09123456789"
                inputMode="tel"
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-3 py-2.5 text-sm outline-none transition ${
                  errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-brand'
                }`}
                style={{ direction: 'ltr', textAlign: 'right' }}
              />
              {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">آدرس پستی کامل</label>
              <textarea
                value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد"
                rows={3}
                className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-3 py-2.5 text-sm outline-none transition resize-none ${
                  errors.address ? 'border-red-500' : 'border-slate-200 dark:border-slate-700 focus:border-brand'
                }`}
              />
              {errors.address && <p className="text-[10px] text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">یادداشت (اختیاری)</label>
              <input
                value={form.note}
                onChange={e => set('note', e.target.value)}
                placeholder="مثلاً: سریع بفرستید"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand transition"
              />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Wallet size={16} className="text-brand" /> روش پرداخت
          </h3>

          <button
            onClick={() => setPayment('card')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition text-right ${
              payment === 'card'
                ? 'border-brand bg-brand/5'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <CreditCard size={18} className={payment === 'card' ? 'text-brand' : ''} />
            <div className="flex-1">
              <div className="text-sm font-medium">کارت به کارت</div>
              <div className="text-[10px] text-slate-500">پرداخت به شماره کارت فروشگاه</div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              payment === 'card' ? 'border-brand' : 'border-slate-300 dark:border-slate-600'
            }`}>
              {payment === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-brand"></div>}
            </div>
          </button>

          {payment === 'card' && (
            <div className="mt-3 bg-gradient-to-l from-brand to-brand-dark text-white rounded-2xl p-4">
              <div className="text-[10px] opacity-80 mb-2">شماره کارت</div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-base font-bold tracking-wider" style={{ direction: 'ltr' }}>
                  {SHOP_INFO.card.number.replace(/(\d{4})/g, '$1 ').trim()}
                </span>
                <button
                  onClick={copyCard}
                  className="text-[10px] bg-white/20 px-2 py-1 rounded-full active:scale-95 flex items-center gap-1"
                >
                  {copied ? <><Check size={10} /> کپی شد</> : 'کپی'}
                </button>
              </div>
              <div className="text-[11px] opacity-90">به نام {SHOP_INFO.card.holder}</div>
              <div className="text-[11px] opacity-90">{SHOP_INFO.card.bank}</div>
              <div className="mt-3 pt-3 border-t border-white/20 flex items-start gap-2">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <p className="text-[10px] leading-5 opacity-90">
                  پس از پرداخت، رسید را به پشتیبانی تلگرام <b>@{SHOP_INFO.telegram}</b> ارسال کنید.
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-sm mb-3">خلاصه سفارش</h3>
          <div className="space-y-2 text-xs mb-3">
            {items.map(it => (
              <div key={it.id} className="flex justify-between">
                <span className="truncate ml-2">{it.title} × {it.qty}</span>
                <span className="flex-shrink-0">{formatPrice(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-dashed border-slate-300 dark:border-slate-700 space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">جمع کالاها</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between">
              <span className="text-slate-500">ارسال</span>
              <span className={shipping === 0 ? 'text-green-500' : ''}>{shipping === 0 ? 'رایگان' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
              <span>قابل پرداخت</span>
              <span className="text-brand">{formatPrice(total)}</span>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 z-40">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-brand text-white font-bold py-3 rounded-xl active:scale-[0.98] transition disabled:opacity-60"
          >
            {submitting ? 'در حال ثبت...' : `ثبت سفارش — ${formatPrice(total)}`}
          </button>
        </div>
      </div>
    </>
  )
}
