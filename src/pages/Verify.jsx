import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { verifyZibalPayment } from '../utils/payment'
import { clearCart } from '../utils/cart'
import { formatPrice } from '../utils/storage'
import { CheckCircle2, XCircle, Loader2, Home, ShoppingBag, Receipt } from 'lucide-react'

export default function Verify() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [state, setState] = useState('loading')
  const [result, setResult] = useState(null)

  useEffect(() => {
    const orderId = params.get('orderId')
    const trackId = params.get('trackId')
    const success = params.get('success')

    if (!orderId || !trackId) {
      setState('error')
      setResult({ error: 'پارامترهای ناقص در آدرس' })
      return
    }

    if (success === '0') {
      setState('error')
      setResult({ error: 'پرداخت لغو شد یا ناموفق بود' })
      return
    }

    verifyZibalPayment({ orderId, trackId })
      .then(res => {
        if (res.ok) {
          clearCart()
          setState('success')
          setResult(res)
        } else {
          setState('error')
          setResult(res)
        }
      })
      .catch(e => {
        setState('error')
        setResult({ error: e.message })
      })
  }, [params])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-cream fade-up">

      {state === 'loading' && (
        <div className="text-center">
          <Loader2 className="animate-spin text-brand mx-auto mb-4" size={48} />
          <p className="font-bold text-ink mb-1">در حال تأیید پرداخت...</p>
          <p className="text-xs text-muted">چند ثانیه صبر کن</p>
        </div>
      )}

      {state === 'success' && (
        <div className="w-full max-w-sm text-center">
          <div className="relative mx-auto mb-6 w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-brand/20 animate-ping"></div>
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #185C28 100%)', boxShadow: '0 8px 24px rgba(46,125,50,0.35)' }}>
              <CheckCircle2 size={48} className="text-white" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="font-extrabold text-xl text-ink mb-2">پرداخت موفق! 🎉</h1>
          <p className="text-xs text-muted mb-6">سفارشت با موفقیت پرداخت شد</p>

          {result?.refNumber && (
            <div className="bg-white rounded-2xl p-4 border border-border mb-4">
              <p className="text-[10px] text-muted mb-1">شماره پیگیری تراکنش</p>
              <p className="font-mono font-extrabold text-brand text-lg tracking-wider" style={{ direction: 'ltr' }}>
                {result.refNumber}
              </p>
            </div>
          )}

          <div className="bg-brand-light/40 rounded-2xl p-4 border border-brand/20 mb-6">
            <p className="text-[11px] text-ink leading-6">
              ✅ سفارش شما وارد مرحله <b>آماده‌سازی</b> شد.
              <br/>
              به‌زودی با شما تماس می‌گیریم.
            </p>
          </div>

          <div className="space-y-2">
            <Link to="/my-orders"
              className="w-full bg-brand text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] shadow-md">
              <Receipt size={16} /> پیگیری سفارش‌ها
            </Link>
            <Link to="/"
              className="w-full bg-white border border-border text-ink font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98]">
              <Home size={16} /> بازگشت به فروشگاه
            </Link>
          </div>

          <p className="text-[10px] text-muted mt-6">🫙 کافه ترشی</p>
        </div>
      )}

      {state === 'error' && (
        <div className="w-full max-w-sm text-center">
          <div className="w-24 h-24 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-6">
            <XCircle size={48} className="text-danger" strokeWidth={2} />
          </div>

          <h1 className="font-extrabold text-xl text-ink mb-2">پرداخت ناموفق</h1>
          <p className="text-xs text-muted mb-2 leading-6">
            {result?.error || 'مشکلی در فرآیند پرداخت پیش اومد'}
          </p>

          {result?.code && (
            <p className="text-[10px] text-muted mb-6">کد خطا: {result.code}</p>
          )}

          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-4 mb-6 text-right">
            <p className="text-[11px] text-ink leading-6">
              💡 اگه مبلغ از حسابت کم شده، با پشتیبانی تماس بگیر. اگه کم نشده، میتونی دوباره تلاش کنی.
            </p>
          </div>

          <div className="space-y-2">
            <Link to="/my-orders"
              className="w-full bg-brand text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98]">
              <Receipt size={16} /> بازگشت به سفارش‌ها
            </Link>
            <Link to="/contact"
              className="w-full bg-white border border-border text-ink font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98]">
              تماس با پشتیبانی
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}
