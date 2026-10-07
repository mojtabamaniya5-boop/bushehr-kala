import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { storage, formatPrice, formatDate } from '../utils/storage'
import { Receipt } from 'lucide-react'

const STATUS = {
  pending:   { label: 'در انتظار پرداخت', color: 'text-amber-500 bg-amber-500/10' },
  paid:      { label: 'پرداخت شده',       color: 'text-green-500 bg-green-500/10' },
  sent:      { label: 'ارسال شده',         color: 'text-blue-500 bg-blue-500/10' },
  done:      { label: 'تحویل داده شده',   color: 'text-slate-500 bg-slate-500/10' },
  canceled:  { label: 'لغو شده',          color: 'text-red-500 bg-red-500/10' },
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
        <main className="max-w-lg mx-auto px-4 pt-24 text-center fade-up">
          <Receipt size={64} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="font-medium mb-1">هنوز سفارشی نداری</p>
          <p className="text-xs text-slate-500 mb-6">اولین سفارشت رو ثبت کن</p>
          <Link to="/" className="inline-block bg-brand text-white text-sm font-bold px-6 py-2.5 rounded-full">
            شروع خرید
          </Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Header title="سفارش‌ها" />
      <main className="max-w-lg mx-auto px-4 pb-24 pt-3 fade-up space-y-3">
        {orders.map(o => {
          const st = STATUS[o.status] || STATUS.pending
          return (
            <div key={o.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold">#{o.id.slice(-6)}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.color}`}>
                  {st.label}
                </span>
              </div>
              <div className="text-xs text-slate-500 mb-2">{formatDate(o.date)}</div>
              <div className="space-y-1 mb-3">
                {o.items.slice(0, 2).map((it, i) => (
                  <div key={i} className="text-xs truncate">• {it.title} × {it.qty}</div>
                ))}
                {o.items.length > 2 && (
                  <div className="text-xs text-slate-400">و {o.items.length - 2} کالای دیگر...</div>
                )}
              </div>
              <div className="flex justify-between pt-2 border-t border-dashed border-slate-300 dark:border-slate-700">
                <span className="text-xs text-slate-500">مبلغ کل</span>
                <span className="text-sm font-bold text-brand">{formatPrice(o.total)}</span>
              </div>
            </div>
          )
        })}
      </main>
    </>
  )
}
