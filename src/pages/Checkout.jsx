import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import { getCart, cartTotal, clearCart } from '../utils/cart'
import { storage, formatPrice, uid } from '../utils/storage'
import { SHOP_INFO } from '../data/products'
import { saveOrderToDB } from '../utils/supabase'
import { getCurrentUser } from '../utils/auth'
import { User, Phone, MapPin, CreditCard, Wallet, AlertCircle, Check, Truck, Zap, LogIn } from 'lucide-react'
import { toast } from '../components/Toast'

export default function Checkout() {
  const navigate = useNavigate()
  const items = getCart()
  const subtotal = cartTotal()
  const loggedUser = getCurrentUser()
  const savedUser = loggedUser ? storage.get('user', {}) : {}

  const [shippingType, setShippingType] = useState('fast')
  const shipping = items.length === 0 ? 0
    : subtotal >= SHOP_INFO.freeShippingFrom ? 0
    : (shippingType === 'fast' ? SHOP_INFO.shippingFast : SHOP_INFO.shippingNormal)
  const total = subtotal + shipping

  const [form, setForm] = useState({
    name: loggedUser?.name || savedUser.name || '',
    phone: loggedUser?.phone || savedUser.phone || '',
    address: loggedUser ? storage.get('last-address', '') : '',
    note: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

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
    if (!/^09\d{9}$/.test(form.phone.trim())) e.phone = 'شماره موبایل معتبر وارد کن (۰۹...)'
    if (!form.address.trim() || form.address.trim().length < 10) e.address = 'آدرس را کامل وارد کن'
    setErrors(e)
    return Object.keys(e).length === 0
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
      customer: { ...form, shippingType },
      items: items.map(i => ({ id: i.id, title: i.title, price: i.price, qty: i.qty })),
      subtotal, shipping, total,
      payment: 'card',
      status: 'pending',
    }

    const orders = storage.get('orders', [])
    orders.push(order)
    storage.set('orders', orders)
    // ذخیره اطلاعات برای autofill بعدی
    storage.set('user', { name: form.name, phone: form.phone })
    storage.set('last-address', form.address)

    try {
      const result = await saveOrderToDB(order)
      if (result.ok) toast.success('سفارش ثبت شد')
    } catch (e) { console.warn(e) }

    clearCart()
    setTimeout(() => navigate(`/pay/${order.id}`, { replace: true }), 400)
  }

  return (
    <>
      <Header title="تسویه حساب" back />
      <main className="max-w-lg mx-auto px-4 pb-44 pt-3 fade-up space-y-3">

        {/* پیشنهاد ورود */}
        {!loggedUser && (
          <Link to="/login"
            className="flex items-center gap-3 bg-accent/10 border border-accent/30 rounded-2xl p-3.5 active:scale-[0.98] transition">
            <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0">
              <LogIn size={18} className="text-ink" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-extrabold text-ink mb-0.5">حساب داری؟</div>
              <div className="text-[10px] text-muted">با ورود، اطلاعاتت خودکار پر میشه</div>
            </div>
            <span className="text-muted">←</span>
          </Link>
        )}

        {/* اطلاعات گیرنده */}
        <section className="bg-white rounded-2xl p-4 border border-border">
          <h3 className="font-extrabold text-sm mb-4 flex items-center gap-2 text-ink">
            <div className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center">
              <User size={14} className="text-brand" />
            </div>
            اطلاعات گیرنده
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-muted block mb-1.5">نام و نام خانوادگی</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="مثلاً: علی رضایی"
                className={`w-full bg-cream border rounded-2xl px-3.5 py-3 text-sm outline-none transition ${
                  errors.name ? 'border-danger' : 'border-border focus:border-brand'
                }`} />
              {errors.name && <p className="text-[10px] text-danger mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-muted block mb-1.5">شماره موبایل</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="09123456789" inputMode="tel"
                className={`w-full bg-cream border rounded-2xl px-3.5 py-3 text-sm outline-none transition ${
                  errors.phone ? 'border-danger' : 'border-border focus:border-brand'
                }`}
                style={{ direction: 'ltr', textAlign: 'right' }} />
              {errors.phone && <p className="text-[10px] text-danger mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-muted block mb-1.5">آدرس پستی کامل</label>
              <textarea value={form.address} onChange={e => set('address', e.target.value)}
                placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد" rows={3}
                className={`w-full bg-cream border rounded-2xl px-3.5 py-3 text-sm outline-none transition resize-none ${
                  errors.address ? 'border-danger' : 'border-border focus:border-brand'
                }`} />
              {errors.address && <p className="text-[10px] text-danger mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="text-[10px] font-bold text-muted block mb-1.5">یادداشت (اختیاری)</label>
              <input value={form.note} onChange={e => set('note', e.target.value)}
                placeholder="مثلاً: سریع بفرستید"
                className="w-full bg-cream border border-border rounded-2xl px-3.5 py-3 text-sm outline-none focus:border-brand transition" />
            </div>
          </div>
        </section>

        {/* روش ارسال */}
        <section className="bg-white rounded-2xl p-4 border border-border">
          <h3 className="font-extrabold text-sm mb-3 flex items-center gap-2 text-ink">
            <div className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center">
              <Truck size={14} className="text-brand" />
            </div>
            روش ارسال
          </h3>

          <div className="space-y-2">
            {[
              { id: 'fast',   label: 'ارسال سریع',  time: '۲-۳ روز کاری', price: SHOP_INFO.shippingFast,   icon: Zap },
              { id: 'normal', label: 'ارسال عادی',  time: '۳-۵ روز کاری', price: SHOP_INFO.shippingNormal, icon: Truck },
            ].map(({ id, label, time, price, icon: Icon }) => (
              <button key={id} type="button" onClick={() => setShippingType(id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition text-right ${
                  shippingType === id ? 'border-brand bg-brand-light/40' : 'border-border'
                }`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  shippingType === id ? 'bg-brand text-white' : 'bg-cream text-muted'
                }`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-extrabold text-ink">{label} ({time})</div>
                  <div className="text-[10px] text-muted mt-0.5">{formatPrice(price)}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  shippingType === id ? 'border-brand' : 'border-border'
                }`}>
                  {shippingType === id && <div className="w-2.5 h-2.5 rounded-full bg-brand"></div>}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* روش پرداخت */}
        <section className="bg-white rounded-2xl p-4 border border-border">
          <h3 className="font-extrabold text-sm mb-3 flex items-center gap-2 text-ink">
            <div className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center">
              <Wallet size={14} className="text-brand" />
            </div>
            روش پرداخت
          </h3>

          <div className="rounded-2xl p-3 border border-brand bg-brand-light/30 flex items-center gap-3">
            <CreditCard size={18} className="text-brand" />
            <div className="flex-1">
              <div className="text-xs font-extrabold text-ink">کارت به کارت</div>
              <div className="text-[10px] text-muted mt-0.5">شماره کارت بعد از ثبت سفارش نمایش داده میشه</div>
            </div>
            <div className="w-5 h-5 rounded-full border-2 border-brand flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-brand"></div>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2 text-[10px] text-muted">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <p className="leading-5">پس از ثبت سفارش، به صفحه پرداخت هدایت میشی و شماره کارت رو می‌بینی.</p>
          </div>
        </section>

        {/* خلاصه سفارش */}
        <section className="bg-white rounded-2xl p-4 border border-border">
          <h3 className="font-extrabold text-sm mb-3 text-ink">📦 خلاصه سفارش</h3>
          <div className="space-y-2 text-xs mb-3">
            {items.map(it => (
              <div key={it.id} className="flex justify-between">
                <span className="truncate ml-2 text-ink">{it.title} × {it.qty}</span>
                <span className="flex-shrink-0 text-muted">{formatPrice(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-dashed border-border space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">جمع کالاها</span>
              <span className="text-ink font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">هزینه ارسال</span>
              <span className={shipping === 0 ? 'text-brand font-bold' : 'text-ink font-medium'}>
                {shipping === 0 ? '🎉 رایگان' : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between font-extrabold text-sm pt-3 border-t border-border">
              <span className="text-ink">قابل پرداخت</span>
              <span className="text-brand">{formatPrice(total)}</span>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-20 left-0 right-0 z-50 px-4">
        <div className="max-w-lg mx-auto">
          <button type="button" onClick={handleSubmit} disabled={submitting}
            className="w-full bg-brand text-white font-extrabold py-4 rounded-2xl active:scale-[0.98] transition disabled:opacity-60 shadow-[0_8px_24px_rgba(46,125,50,0.35)]">
            {submitting ? 'در حال ثبت...' : `ثبت سفارش — ${formatPrice(total)}`}
          </button>
        </div>
      </div>
    </>
  )
}
