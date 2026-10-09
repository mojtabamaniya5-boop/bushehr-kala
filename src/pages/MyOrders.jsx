import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import TrackStepper from '../components/TrackStepper'
import { formatPrice, formatDate } from '../utils/storage'
import { getCurrentUser } from '../utils/auth'
import { fetchUserOrders } from '../utils/orders'
import { Package, Loader2, ChevronLeft, CreditCard, Copy, Check } from 'lucide-react'
import { toast } from '../components/Toast'
import { SHOP_INFO } from '../data/products'

const STATUS_LABEL = {
  pending: { label: 'در انتظار پرداخت', color: 'bg-accent/20 text-ink' },
  paid: { label: 'پرداخت شده', color: 'bg-brand/15 text-brand' },
  sent: { label: 'ارسال شده', color: 'bg-blue-500/15 text-blue-600' },
  done: { label: 'تحویل داده شده', color: 'bg-muted/20 text-muted' },
  canceled: { label: 'لغو شده', color: 'bg-danger/15 text-danger' },
}

export default function MyOrders() {
  const user = getCurrentUser()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [copiedCard, setCopiedCard] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return }
    load()
  }, [user, navigate])

  const load = async () => {
    setLoading(true)
    const arr = await fetchUserOrders(user.phone)
    setOrders(arr)
    setLoading(false)
  }

  const copyCard = async (orderId) => {
    try {
      await navigator.clipboard.writeText(SHOP_INFO.card.number)
      setCopiedCard(orderId)
      toast.success('شماره کارت کپی شد')
      setTimeout(() => setCopiedCard(null), 1500)
    } catch {}
  }

  if (!user) return null

  if (loading) {
    return (<><Header title="سفارش‌های من" back /><div className="flex justify-center pt-32"><Loader2 className="animate-spin text-brand" size={32} /></div></>)
  }

  if (orders.length === 0) {
    return (
      <>
        <Header title="سفارش‌های من" back />
        <main className="max-w-lg mx-auto px-4 pt-20 text-center fade-up">
          <div className="w-24 h-24 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-5">
            <Package size={40} className="text-brand" />
          </div>
          <p className="font-extrabold text-base text-ink mb-1">هنوز سفارشی نداری</p>
          <p className="text-xs text-muted mb-6">اولین سفارشت رو ثبت کن</p>
          <Link to="/" className="inline-block bg-brand text-white text-sm font-extrabold px-6 py-3 rounded-full shadow-md active:scale-95 transition">
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
            <b className="text-brand text-base">{orders.length}</b> سفارش
          </span>
          <button onClick={load} className="text-[10px] text-brand font-bold">🔄 بروزرسانی</button>
        </div>

        {orders.map(o => {
          const st = STATUS_LABEL[o.status] || STATUS_LABEL.pending
          const isOpen = expanded === o.id
          const isPending = o.status === 'pending'

          return (
            <div key={o.id} className="bg-white rounded-2xl border border-border overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : o.id)}
                className="w-full p-4 text-right active:bg-cream/50 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-extrabold text-brand">#{String(o.id).slice(-6)}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${st.color}`}>
                    {st.label}
                  </span>
                </div>

                <TrackStepper status={o.status} compact />

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-border">
                  <span className="text-[10px] text-muted">{formatDate(o.date)}</span>
                  <span className="text-sm font-extrabold text-brand">{formatPrice(o.total)}</span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border p-4 bg-cream/30 space-y-3">

                  {/* اقلام */}
                  <div>
                    <h4 className="text-[11px] font-extrabold text-ink mb-2">📦 اقلام سفارش</h4>
                    <div className="space-y-1.5">
                      {o.items.map((it, i) => (
                        <div key={i} className="flex justify-between text-[11px]">
                          <span className="text-ink truncate ml-2">{it.title} × {it.qty}</span>
                          <span className="text-muted flex-shrink-0">{formatPrice(it.price * it.qty)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* پرداخت برای pending */}
                  {isPending && (
                    <div className="rounded-2xl p-4 text-white relative overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #185C28 100%)' }}>
                      <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-white/10"></div>
                      <div className="relative">
                        <div className="text-[10px] opacity-80 mb-1">شماره کارت برای واریز</div>
                        <div className="font-mono text-sm font-extrabold tracking-wider mb-2 text-center"
                          style={{ direction: 'ltr' }}>
                          {SHOP_INFO.card.number.replace(/(\d{4})/g, '$1 ').trim()}
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] opacity-90">به نام {SHOP_INFO.card.holder}</span>
                          <button onClick={(e) => { e.stopPropagation(); copyCard(o.id) }}
                            className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full active:scale-95 flex items-center gap-1">
                            {copiedCard === o.id ? <><Check size={10} /> کپی شد</> : <><Copy size={10} /> کپی</>}
                          </button>
                        </div>

                        <Link to={`/pay/${o.id}`} onClick={e => e.stopPropagation()}
                          className="w-full bg-white text-brand font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs active:scale-[0.98] transition">
                          <CreditCard size={14} />
                          ادامه پرداخت
                        </Link>
                      </div>
                    </div>
                  )}

                  <Link to={`/track/${o.id}`} onClick={e => e.stopPropagation()}
                    className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-brand py-2.5 rounded-xl bg-brand-light/50 active:scale-[0.98] transition">
                    مشاهده جزئیات کامل
                    <ChevronLeft size={14} />
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </main>
    </>
  )
}
