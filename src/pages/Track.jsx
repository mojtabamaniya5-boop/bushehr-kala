import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import TrackStepper from '../components/TrackStepper'
import { supabase } from '../utils/supabase'
import { formatPrice, formatDate } from '../utils/storage'
import { Package, Search, Loader2, Copy, Check } from 'lucide-react'
import { toast } from '../components/Toast'

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
  const [code, setCode] = useState(orderId || '')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (orderId) search(orderId)
  }, [orderId])

  const search = async (searchCode) => {
    const q = (searchCode || code).trim().toUpperCase().replace('#', '')
    if (!q) {
      toast.error('کد سفارش را وارد کن')
      return
    }
    setLoading(true)
    setSearched(true)

    // ۱) Supabase
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`code.eq.${q},id.eq.${q}`)
        .limit(1)
        .maybeSingle()

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
        })
        setLoading(false)
        return
      }
    } catch (e) {
      console.warn('DB track error:', e)
    }

    // ۲) localStorage
    const lsOrders = JSON.parse(localStorage.getItem('bk-orders') || '[]')
    const found = lsOrders.find(o =>
      o.id === q || o.id?.toUpperCase() === q ||
      (o.id || '').slice(-6).toUpperCase() === q
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
      })
    } else {
      setOrder(null)
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

  return (
    <>
      <Header title="رهگیری سفارش" back />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-5 fade-up">

        {/* فرم جستجو */}
        <div className="bg-white rounded-2xl p-4 border border-border mb-5">
          <h2 className="font-extrabold text-sm text-brand mb-3 flex items-center gap-2">
            <Search size={16} />
            کد سفارش خود را وارد کنید
          </h2>

          <div className="flex gap-2">
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="مثلاً ABC123"
              className="flex-1 bg-cream border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-brand transition font-mono tracking-wider"
              style={{ direction: 'ltr', textAlign: 'center' }}
            />
            <button onClick={() => search()}
              className="px-5 bg-brand text-white rounded-2xl font-bold text-sm active:scale-95 transition">
              پیدا کن
            </button>
          </div>

          <p className="text-[10px] text-muted mt-3 text-center">
            کد سفارش در پیام تأیید و صفحه پروفایل شما موجوده
          </p>
        </div>

        {/* لودینگ */}
        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-brand" size={28} />
          </div>
        )}

        {/* نتیجه */}
        {!loading && searched && !order && (
          <div className="text-center py-10">
            <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-danger" />
            </div>
            <p className="font-extrabold text-ink mb-1">سفارشی پیدا نشد</p>
            <p className="text-xs text-muted mb-5">کد رو دوباره چک کن</p>
            <Link to="/contact" className="text-xs text-brand font-bold">
              با پشتیبانی تماس بگیر
            </Link>
          </div>
        )}

        {!loading && order && (
          <div className="space-y-4">

            {/* کد سفارش */}
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

            {/* استپر */}
            <div className="bg-white rounded-2xl p-5 border border-border">
              <h3 className="font-extrabold text-sm text-ink mb-4 text-center">وضعیت سفارش</h3>
              <TrackStepper status={order.status} />
              <p className="text-center text-[11px] font-bold mt-4 text-brand">
                {STATUS_LABEL[order.status] || 'در حال بررسی'}
              </p>
            </div>

            {/* اقلام */}
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

            {/* آدرس */}
            <div className="bg-white rounded-2xl p-4 border border-border">
              <h3 className="font-extrabold text-sm text-ink mb-2">📍 آدرس تحویل</h3>
              <p className="text-xs text-muted leading-6">{order.address}</p>
            </div>

            {/* تماس */}
            <Link to="/contact"
              className="block w-full bg-brand text-white font-extrabold py-3.5 rounded-2xl text-center active:scale-[0.98] transition">
              سؤال داری؟ با ما تماس بگیر
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
