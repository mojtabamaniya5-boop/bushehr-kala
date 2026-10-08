import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { storage, formatPrice, formatDate } from '../utils/storage'
import { Package, ShoppingBag } from 'lucide-react'

const STATUS = {
  pending:   { label: 'در انتظار پرداخت', color: 'bg-accent/20 text-ink' },
  paid:      { label: 'پرداخت شده',       color: 'bg-brand/15 text-brand' },
  sent:      { label: 'ارسال شده',         color: 'bg-blue-500/15 text-blue-600' },
  done:      { label: 'تحویل داده شده',   color: 'bg-muted/20 text-muted' },
  canceled:  { label: 'لغو شده',          color: 'bg-danger/15 text-danger' },
}

export default function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    setOrders(storage.get('orders', []).reverse())
  }, [])

  if (orders.length === 0) {
    return (
      <>
        <Header title="سفارش‌ها" />
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
      <Header title="سفارش‌ها" />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-3 fade-up space-y-3">
        {orders.map(o => {
          const st = STATUS[o.status] || STATUS.pending
          return (
            <div key={o.id} className="bg-white rounded-2xl p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-extrabold text-brand">#{o.id.slice(-6)}</span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${st.color}`}>
                  {st.label}
                </span>
              </div>

              <div className="text-[10px] text-muted mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                {formatDate(o.date)}
              </div>

              <div className="space-y-1.5 mb-3">
                {o.items.slice(0, 2).map((it, i) => (
                  <div key={i} className="text-xs text-ink truncate">• {it.title} × {it.qty}</div>
                ))}
                {o.items.length > 2 && (
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
