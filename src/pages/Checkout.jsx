import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getCart, cartTotal, clearCart } from '../utils/cart'
import { storage, formatPrice, uid } from '../utils/storage'
import { SHOP_INFO } from '../data/products'
import { saveOrderToDB } from '../utils/supabase'
import { User, Phone, MapPin, CreditCard, Wallet, AlertCircle, Check, Truck, Zap } from 'lucide-react'
import { toast } from '../components/Toast'

export default function Checkout() {
  const navigate = useNavigate()
  const items = getCart()
  const subtotal = cartTotal()
  const [shippingType, setShippingType] = useState('fast')
  const shipping = items.length === 0 ? 0
    : subtotal >= SHOP_INFO.freeShippingFrom ? 0
    : (shippingType === 'fast' ? SHOP_INFO.shippingFast : SHOP_INFO.shippingNormal)
  const total = subtotal + shipping

  const savedUser = storage.get('user', {})
  const [form, setForm] = useState({
    name: savedUser.name || '',
    phone: savedUser.phone || '',
    address: storage.get('last-address', ''),
    note: '',
  })
  const [payment] = useState('card')
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
      customer: { ...form, shippingType },
      items: items.map(i => ({ id: i.id, title: i.title, price: i.price, qty: i.qty })),
      subtotal, shipping, total,
      payment,
      status: 'pending',
    }

    const orders = storage.get('orders', [])
    orders.push(order)
    storage.set('orders', orders)
    storage.set('user', { name: form.name, phone: form.phone })
    storage.set('last-address', form.address)

    try {
      const result = await saveOrderToDB(order)
      if (result.ok) toast.success('سفارش ثبت شد ✅')
      else toast.info('سفارش ذخیره شد')
    } catch (e) {
      console.error(e)
    }

    clearCart()
    setTimeout(() => navigate(`/success/${order.id}`, { replace: true }), 500)
  }

  return (
    <>
      <Header title="تسویه حساب" back />
      <main className="max-w-lg mx-auto px-4 pb-44 pt-3 fade-up space-y-3">

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
            <button type="button" onClick={() => setShippingType('fast')}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition text-right ${
                shippingType === 'fast' ? 'border-brand bg-brand-light/40' : 'border-border'
              }`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                shippingType === 'fast' ? 'bg-brand text-white' : 'bg-cream text-muted'
              }`}>
                <Zap size={16} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-extrabold text-ink">ارسال سریع (۲-۳ روز کاری)</div>
                <div className="text-[10px] text-muted mt-0.5">
                  {formatPrice(SHOP_INFO.shippingFast)}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                shippingType === 'fast' ? 'border-brand' : 'border-border'
              }`}>
                {shippingType === 'fast' && <div className="w-2.5 h-2.5 rounded-full bg-brand"></div>}
              </div>
            </button>

            <button type="button" onClick={() => setShippingType('normal')}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition text-right ${
                shippingType === 'normal' ? 'border-brand bg-brand-light/40' : 'border-border'
              }`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                shippingType === 'normal' ? 'bg-brand text-white' : 'bg-cream text-muted'
              }`}>
                <Truck size={16} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-extrabold text-ink">ارسال عادی (۳-۵ روز کاری)</div>
                <div className="text-[10px] text-muted mt-0.5">
                  {formatPrice(SHOP_INFO.shippingNormal)}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                shippingType === 'normal' ? 'border-brand' : 'border-border'
              }`}>
                {shippingType === 'normal' && <div className="w-2.5 h-2.5 rounded-full bg-brand"></div>}
              </div>
            </button>
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

          <div className="rounded-2xl p-4 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #185C28 100%)' }}>
            <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-white/10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span className="text-[11px] font-bold">کارت به کارت</span>
                </div>
                <div className="w-8 h-5 rounded bg-accent"></div>
              </div>

              <div className="text-[10px] opacity-80 mb-1">شماره کارت</div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-sm font-extrabold tracking-wider" style={{ direction: 'ltr' }}>
                  {SHOP_INFO.card.number.replace(/(\d{4})/g, '$1 ').trim()}
                </span>
                <button type="button" onClick={copyCard}
                  className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full active:scale-95 flex items-center gap-1">
                  {copied ? <><Check size={10} /> کپی شد</> : 'کپی'}
                </button>
              </div>
              <div className="text-[10px] opacity-90">به نام {SHOP_INFO.card.holder}</div>
              <div className="text-[10px] opacity-90">{SHOP_INFO.card.bank}</div>

              <div className="mt-3 pt-3 border-t border-white/20 flex items-start gap-2">
                <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                <p className="text-[10px] leading-5 opacity-95">
                  پس از ثبت سفارش، مبلغ را واریز کرده و رسید را در تلگرام <b>@{SHOP_INFO.telegram}</b> بفرستید.
                </p>
              </div>
            </div>
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
