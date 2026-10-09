import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { formatPrice, formatDate } from '../utils/storage'
import { getCurrentUser } from '../utils/auth'
import { supabase } from '../utils/supabase'
import { Package, ShoppingBag, Loader2 } from 'lucide-react'

const STATUS = {
  pending:  { label: 'در انتظار پرداخت', color: 'bg-accent/20 text-ink' },
  paid:     { label: 'پرداخت شده',       color: 'bg-brand/15 text-brand' },
  sent:     { label: 'ارسال شده',         color: 'bg-blue-500/15 text-blue-600' },
  done:     { label: 'تحویل داده شده',   color: 'bg-muted/20 text-muted' },
  canceled: { label: 'لغو شده',          color: 'bg-danger/15 text-danger' },
}

export default function MyOrders() {
  const user = getCurrentUser()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [localOrders, setLocalOrders] = useState([])

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
      return
    }
    load()
  }, [user, navigate])

  const load = async () => {
    setLoading(true)

    // ۱) از Supabase
    let dbOrders = []
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_phone', user.phone)
        .order('created_at', { ascending: false })

      if (!error && data) {
        dbOrders = data.map(o => ({
          id: o.code || o.id,
          date: o.created_at,
          total: o.total,
          status: o.status,
          items: o.items || [],
          source: 'db',
        }))
      }
    } catch (e) {
      console.warn('DB orders error:', e)
    }

    // ۲) از localStorage
    const lsOrders = (JSON.parse(localStorage.getItem('bk-orders') || '[]'))
      .filter(o => o.customer?.phone === user.phone)
      .map(o => ({ ...o, source: 'local' }))

    setLocalOrders(lsOrders)
    setOrders(dbOrders)
    setLoading(false)
  }

  const allOrders = [
    ...orders,
    ...localOrders.filter(lo => !orders.find(o => o.id === lo.id)),
  ].sort((a, b) => new Date(b.date) - new Date(a.date))

  if (!user) return null

  if (loading) {
    return (
      <>
        <Header title="سفارش‌های من" back />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="animate-spin text-brand" size={32} />
        </div>
      </>
    )
  }

  if (allOrders.length === 0) {
    return (
      <>
        <Header title="سفارش‌های من" back />
        <main className="max-w-lg mx-auto px-4 pt-20 text-center fade-up">
          <div className="w-24 h-24 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-5">
            <Package size={40} className="text-brand" />
          </div>
          <p className="font-extrabold text-base text-ink mb-1">هنوز سفارشی نداری</p>
          <p className="text-xs text-muted mb-6">اولین سفارشت رو ثبت کن</p>
          <Link to="/"
            className="inline-block bg-brand text-white text-sm font-extrabold px-6 py-3 rounded-full shadow-md active:scale-95 transition">
            شروع خرید
          </Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Header title="سفارش‌های من" back />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-3 fade-up space-y-3">

        <div className="bg-brand-light/40 rounded-2xl p-3 border border-brand/20 mb-2 flex items-center justify-between">
          <span className="text-[11px] text-ink">
            <b className="text-brand text-base">{allOrders.length}</b> سفارش
          </span>
          <button onClick={load} className="text-[10px] text-brand font-bold">🔄 بروزرسانی</button>
        </div>

        {allOrders.map(o => {
          const st = STATUS[o.status] || STATUS.pending
          return (
            <div key={o.id} className="bg-white rounded-2xl p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-extrabold text-brand">#{String(o.id).slice(-6)}</span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${st.color}`}>
                  {st.label}
                </span>
              </div>

              <div className="text-[10px] text-muted mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                {formatDate(o.date)}
                {o.source === 'local' && <span className="text-[9px] text-muted">(محلی)</span>}
              </div>

              <div className="space-y-1.5 mb-3">
                {(o.items || []).slice(0, 2).map((it, i) => (
                  <div key={i} className="text-xs text-ink truncate">• {it.title} × {it.qty}</div>
                ))}
                {(o.items || []).length > 2 && (
                  <div className="text-xs text-muted">و {o.items.length - 2} کالای دیگر...</div>
                )}
              </div>

              <div className="flex justify-between pt-3 border-t border-dashed border-border">
                <span className="text-xs text-muted">مبلغ کل</span>
                <span className="text-sm font-extrabold text-brand">{formatPrice(o.total)}</span>
              </div>
            </div>
          )
        })}
      </main>
    </>
  )
}
