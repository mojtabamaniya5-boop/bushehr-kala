import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import TrackStepper from '../components/TrackStepper'
import { supabase } from '../utils/supabase'
import { formatPrice, formatDate } from '../utils/storage'
import { getCurrentUser } from '../utils/auth'
import { canSearch, recordAttempt, isValidOrderCode, isValidPhone, clearAttempts } from '../utils/track-security'
import { Package, Search, Loader2, Copy, Check, CreditCard, ShoppingBag, Phone, RotateCcw, Truck, Lock, AlertTriangle } from 'lucide-react'
import { toast } from '../components/Toast'
import { SHOP_INFO } from '../data/products'

const STATUS_LABEL = {
  pending: 'در انتظار پرداخت',
  paid: 'پرداخت شده',
  sent: 'ارسال شده',
  done: 'تحویل داده شده',
  canceled: 'لغو شده',
}

export default function Track() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const loggedUser = getCurrentUser()

  const [code, setCode] = useState(orderId || '')
  const [phone, setPhone] = useState(loggedUser?.phone || '')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedTracking, setCopiedTracking] = useState(false)
  const [blockInfo, setBlockInfo] = useState(null)

  // اگه لاگین نیست، فیلد موبایل قابل ویرایش
  const phoneEditable = !loggedUser

  useEffect(() => {
    if (orderId && loggedUser?.phone) search()
  }, [])

  const search = async (searchCode) => {
    const q = (searchCode || code).trim().toUpperCase().replace('#', '')
    const ph = phone.replace(/\D/g, '')

    if (!isValidOrderCode(q)) {
      toast.error('کد سفارش معتبر وارد کن')
      return
    }
    if (!isValidPhone(ph)) {
      toast.error('شماره موبایل معتبر وارد کن (۰۹...)')
      return
    }

    // چک rate limit
    const limit = canSearch()
    if (!limit.allowed) {
      setBlockInfo(limit.remainingMin)
      toast.error('تعداد تلاش زیاد. ' + limit.remainingMin + ' دقیقه دیگه امتحان کن')
      return
    }

    setLoading(true)
    setSearched(true)
    setBlockInfo(null)

    try {
      const { data, error } = await supabase
        .from('orders').select('*')
        .eq('code', q)
        .eq('customer_phone', ph)
        .limit(1).maybeSingle()

      if (!error && data) {
        setOrder({
          id: data.code || data.id,
          date: data.created_at,
          status: data.status,
          total: data.total,
          subtotal: data.subtotal,
          shipping: data.shipping,
          items: data.items || [],
          name: data.customer_name,
          address: data.customer_address,
          phone: data.customer_phone,
          trackingCode: data.tracking_code,
          shippingMethod: data.shipping_method,
        })
        clearAttempts()  // موفق → پاک کن
        setLoading(false)
        return
      }
    } catch (e) { console.warn(e) }

    // اگه توی DB نبود، localStorage رو چک کن
    const lsOrders = JSON.parse(localStorage.getItem('bk-orders') || '[]')
    const found = lsOrders.find(o =>
      (o.id === q || o.id?.toUpperCase() === q) &&
      o.customer?.phone === ph
    )

    if (found) {
      setOrder({
        id: found.id,
        date: found.date,
        status: found.status,
        total: found.total,
        subtotal: found.subtotal,
        shipping: found.shipping,
        items: found.items || [],
        name: found.customer?.name,
        address: found.customer?.address,
        phone: found.customer?.phone,
        trackingCode: found.trackingCode,
        shippingMethod: found.shippingMethod,
      })
      clearAttempts()
    } else {
      setOrder(null)
      recordAttempt()
      const after = canSearch()
      if (!after.allowed) setBlockInfo(after.remainingMin)
    }
    setLoading(false)
  }

  const copyId = async () => {
    if (!order) return
    try {
      await navigator.clipboard.writeText(order.id)
      setCopied(true)
      toast.success('کد سفارش کپی شد')
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  const copyTracking = async () => {
    if (!order?.trackingCode) return
    try {
      await navigator.clipboard.writeText(order.trackingCode)
      setCopiedTracking(true)
      toast.success('کد رهگیری کپی شد')
      setTimeout(() => setCopiedTracking(false), 1500)
    } catch {}
  }

  const isPending = order?.status === 'pending'
  const isSent = order?.status === 'sent' || order?.status === 'done'

  return (
    <>
      <Header title="رهگیری سفارش" back />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-5 fade-up">

        <div className="bg-white rounded-2xl p-4 border border-border mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center">
              <Lock size={14} className="text-brand" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-brand">رهگیری امن سفارش</h2>
              <p className="text-[10px] text-muted">برای امنیت، کد سفارش + شماره موبایل</p>
            </div>
          </div>

          {/* کد سفارش */}
          <div className="mb-3">
            <label className="text-[10px] font-bold text-muted block mb-1.5">کد سفارش</label>
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="مثلاً ABC123"
              className="w-full bg-cream border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand transition font-mono tracking-wider"
              style={{ direction: 'ltr', textAlign: 'center' }}
            />
          </div>

          {/* شماره موبایل */}
          <div className="mb-4">
            <label className="text-[10px] font-bold text-muted block mb-1.5">
              شماره موبایل {phoneEditable ? '(همونی که موقع سفارش دادی)' : '(از حساب شما)'}
            </label>
            <input
              value={phone}
              onChange={e => phoneEditable && setPhone(e.target.value)}
              disabled={!phoneEditable}
              placeholder="09123456789"
              inputMode="tel"
              className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none transition font-mono ${
                phoneEditable
                  ? 'bg-cream border-border focus:border-brand'
                  : 'bg-brand-light/40 border-brand/20 text-muted cursor-not-allowed'
              }`}
              style={{ direction: 'ltr', textAlign: 'center' }}
            />
          </div>

          <button onClick={() => search()} disabled={loading || !!blockInfo}
            className="w-full bg-brand text-white font-extrabold py-3.5 rounded-2xl active:scale-[0.98] transition disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={16} /> جستجو...</> : <><Search size={16} /> پیگیری سفارش</>}
          </button>

          {blockInfo && (
            <div className="mt-3 bg-danger/10 border border-danger/30 rounded-2xl p-3 flex items-start gap-2">
              <AlertTriangle size={14} className="text-danger flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-danger leading-5">
                تعداد تلاش‌ها زیاد شده. لطفاً <b>{blockInfo} دقیقه</b> دیگه امتحان کن.
              </p>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-brand" size={28} />
          </div>
        )}

        {!loading && searched && !order && !blockInfo && (
          <div className="text-center py-10">
            <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-danger" />
            </div>
            <p className="font-extrabold text-ink mb-1">سفارشی پیدا نشد</p>
            <p className="text-xs text-muted mb-5">
              کد سفارش و شماره موبایل رو دقیق چک کن
            </p>
            <Link to="/contact" className="text-xs text-brand font-bold">
              با پشتیبانی تماس بگیر
            </Link>
          </div>
        )}

        {!loading && order && (
          <div className="space-y-4">

            <div className="bg-white rounded-2xl p-4 border border-border text-center">
              <p className="text-[10px] text-muted mb-1">کد پیگیری</p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono font-extrabold text-brand text-lg tracking-widest">
                  #{String(order.id).slice(-6)}
                </span>
                <button onClick={copyId} className="p-1.5 rounded-lg bg-brand-light text-brand active:scale-90">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-[10px] text-muted mt-2">{formatDate(order.date)}</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-border">
              <h3 className="font-extrabold text-sm text-ink mb-4 text-center">وضعیت سفارش</h3>
              <TrackStepper status={order.status} />
              <p className="text-center text-[11px] font-bold mt-4 text-brand">
                {STATUS_LABEL[order.status] || 'در حال بررسی'}
              </p>
            </div>

            {isSent && order.trackingCode && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-3xl p-5 fade-up">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center">
                    <Truck size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-extrabold text-blue-600">
                      {order.shippingMethod === 'tipax' ? 'ارسال با تیپاکس' : 'ارسال با پست'}
                    </p>
                    <p className="text-[10px] text-muted">کد رهگیری مرسوله شما</p>
                  </div>
                </div>

                <div className="text-[10px] text-muted mb-1.5">کد رهگیری پستی</div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 bg-white rounded-xl px-3 py-3 font-mono text-sm font-extrabold text-ink tracking-wider"
                    style={{ direction: 'ltr', textAlign: 'center' }}>
                    {order.trackingCode}
                  </div>
                  <button onClick={copyTracking}
                    className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center active:scale-90 transition">
                    {copiedTracking ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>

                <a href="https://tracking.post.ir/" target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-white border border-blue-500/30 text-blue-600 font-extrabold py-3 rounded-2xl active:scale-[0.98] text-xs">
                  <Truck size={14} />
                  پیگیری در سایت پست
                </a>
              </div>
            )}

            {isPending && (
              <div className="rounded-3xl p-5 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #185C28 100%)' }}>
                <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/10"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <CreditCard size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold mb-0.5">پرداخت این سفارش</p>
                      <p className="text-[10px] opacity-80">هنوز تکمیل نشده</p>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/pay/${order.id}`)}
                    className="w-full bg-white text-brand font-extrabold py-3 rounded-2xl active:scale-[0.98] transition text-sm">
                    ادامه پرداخت
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-4 border border-border">
              <h3 className="font-extrabold text-sm text-ink mb-3">📦 اقلام سفارش</h3>
              <div className="space-y-2">
                {order.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-xs py-1.5 border-b border-dashed border-border last:border-0">
                    <span className="text-ink truncate ml-2">{it.title}</span>
                    <span className="text-muted flex-shrink-0">{it.qty} × {formatPrice(it.price)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 mt-3 border-t border-border space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">جمع کالاها</span>
                  <span className="text-ink">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">ارسال</span>
                  <span className={order.shipping === 0 ? 'text-brand font-bold' : 'text-ink'}>
                    {order.shipping === 0 ? 'رایگان' : formatPrice(order.shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-extrabold text-sm pt-2 border-t border-border">
                  <span>قابل پرداخت</span>
                  <span className="text-brand">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-border">
              <h3 className="font-extrabold text-sm text-ink mb-2">📍 آدرس تحویل</h3>
              <p className="text-xs text-muted leading-6">{order.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link to="/"
                className="flex items-center justify-center gap-1.5 bg-white border border-border text-ink font-bold py-3 rounded-2xl active:scale-[0.98] text-xs">
                <ShoppingBag size={14} />
                خرید بیشتر
              </Link>
              <Link to="/contact"
                className="flex items-center justify-center gap-1.5 bg-brand text-white font-bold py-3 rounded-2xl active:scale-[0.98] text-xs">
                <Phone size={14} />
                تماس با ما
              </Link>
            </div>

            <button onClick={() => { setOrder(null); setSearched(false) }}
              className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-muted py-3">
              <RotateCcw size={12} />
              جستجوی سفارش دیگر
            </button>
          </div>
        )}
      </main>
    </>
  )
}
