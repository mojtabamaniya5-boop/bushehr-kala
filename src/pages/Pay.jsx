import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { fetchOrderById, markOrderPaidClaimed } from '../utils/orders'
import { requestZibalPayment } from '../utils/payment'
import { SHOP_INFO } from '../data/products'
import { formatPrice, formatDate } from '../utils/storage'
import { toast } from '../components/Toast'
import { Copy, Check, CreditCard, AlertCircle, Send, Loader2, CheckCircle2, Zap, ArrowLeft } from 'lucide-react'

export default function Pay() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [method, setMethod] = useState(null) // 'card' | 'online'
  const [copied, setCopied] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    if (!orderId) { navigate('/my-orders'); return }
    fetchOrderById(orderId).then(o => {
      setOrder(o)
      setLoading(false)
      if (o?.paymentClaimed) setClaimed(true)
    })
  }, [orderId, navigate])

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(SHOP_INFO.card.number)
      setCopied(true)
      toast.success('شماره کارت کپی شد')
      setTimeout(() => setCopied(false), 2000)
    } catch { toast.error('کپی نشد') }
  }

  const copyOrderCode = async () => {
    if (!order) return
    try {
      await navigator.clipboard.writeText(order.id)
      toast.success('کد سفارش کپی شد')
    } catch {}
  }

  const handleClaimed = () => {
    if (!order) return
    markOrderPaidClaimed(order.id)
    setClaimed(true)
    toast.success('عالی! حالا رسید رو در بله بفرست')
  }

  const handleOnlinePayment = async () => {
    if (!order) return
    setPaying(true)

    try {
      const callbackUrl = `${window.location.origin}${window.location.pathname}#/verify?orderId=${order.id}`

      const res = await requestZibalPayment({
        orderId: order.id,
        amount: order.total * 10, // به ریال
        callbackUrl,
        phone: order.customer?.phone || '',
      })

      if (res.ok && res.paymentUrl) {
        // ذخیره trackId برای verify
        sessionStorage.setItem('zibal_track_' + order.id, String(res.trackId))
        // هدایت به زیبال
        window.location.href = res.paymentUrl
      } else {
        setPaying(false)
        toast.error(res.error || 'خطا در ایجاد پرداخت')
      }
    } catch (e) {
      setPaying(false)
      toast.error('خطای شبکه: ' + e.message)
    }
  }

  if (loading) {
    return (<><Header title="پرداخت" back /><div className="flex justify-center pt-32"><Loader2 className="animate-spin text-brand" size={32} /></div></>)
  }

  if (!order) {
    return (
      <>
        <Header title="پرداخت" back />
        <div className="text-center pt-24">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-bold mb-4">سفارش پیدا نشد</p>
          <Link to="/my-orders" className="text-brand font-bold text-xs">بازگشت به سفارش‌ها</Link>
        </div>
      </>
    )
  }

  if (order.status !== 'pending') {
    return (
      <>
        <Header title="پرداخت" back />
        <div className="max-w-lg mx-auto px-4 pt-10 text-center fade-up">
          <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-brand" />
          </div>
          <p className="font-extrabold text-ink mb-1">این سفارش پرداخت شده</p>
          <p className="text-xs text-muted mb-6">وضعیت: {order.status === 'paid' ? 'پرداخت شده' : order.status === 'sent' ? 'ارسال شده' : 'تحویل شده'}</p>
          <Link to={`/track/${order.id}`} className="inline-block bg-brand text-white font-bold text-xs px-6 py-3 rounded-full">
            مشاهده وضعیت
          </Link>
        </div>
      </>
    )
  }

  // ═══ صفحه اصلی انتخاب روش پرداخت ═══
  return (
    <>
      <Header title="پرداخت سفارش" back />
      <main className="max-w-lg mx-auto px-4 pb-40 pt-4 fade-up space-y-4">

        {/* خلاصه سفارش */}
        <div className="bg-white rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] text-muted">کد سفارش</div>
              <button onClick={copyOrderCode} className="font-mono text-sm font-extrabold text-brand tracking-wider active:scale-95">
                #{String(order.id).slice(-8)}
              </button>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-muted">تاریخ</div>
              <div className="text-xs font-bold">{formatDate(order.date)}</div>
            </div>
          </div>
          <div className="pt-3 border-t border-border flex justify-between items-center">
            <span className="text-xs text-muted">مبلغ قابل پرداخت</span>
            <span className="text-base font-extrabold text-brand">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* انتخاب روش پرداخت */}
        {!method && (
          <>
            <h3 className="font-extrabold text-sm text-ink text-center">روش پرداخت را انتخاب کن</h3>

            <button onClick={() => setMethod('online')}
              className="w-full bg-white rounded-3xl p-5 border-2 border-brand active:scale-[0.98] transition relative overflow-hidden"
              style={{ boxShadow: '0 6px 20px rgba(46,125,50,0.15)' }}>
              <div className="absolute top-2 left-2 bg-accent text-ink text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                پیشنهاد
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #185C28 100%)' }}>
                  <Zap size={26} className="text-white" />
                </div>
                <div className="flex-1 text-right">
                  <div className="font-extrabold text-base text-ink mb-1">پرداخت آنلاین</div>
                  <div className="text-[11px] text-muted">سریع، امن، بدون نیاز به کارت‌به‌کارت</div>
                </div>
                <ArrowLeft size={20} className="text-brand" />
              </div>
            </button>

            <button onClick={() => setMethod('card')}
              className="w-full bg-white rounded-3xl p-5 border-2 border-border active:scale-[0.98] transition">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-light flex items-center justify-center">
                  <CreditCard size={26} className="text-brand" />
                </div>
                <div className="flex-1 text-right">
                  <div className="font-extrabold text-base text-ink mb-1">کارت به کارت</div>
                  <div className="text-[11px] text-muted">واریز به کارت + ارسال رسید در بله</div>
                </div>
                <ArrowLeft size={20} className="text-muted" />
              </div>
            </button>
          </>
        )}

        {/* ═══ پرداخت آنلاین ═══ */}
        {method === 'online' && (
          <div className="space-y-4">
            <button onClick={() => setMethod(null)}
              className="text-xs text-muted font-bold flex items-center gap-1.5">
              <ArrowLeft size={14} /> تغییر روش پرداخت
            </button>

            <div className="rounded-3xl p-6 text-white text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #185C28 100%)' }}>
              <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/10"></div>
              <div className="absolute -bottom-8 right-4 w-24 h-24 rounded-full bg-accent/20"></div>

              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                  <Zap size={40} />
                </div>
                <h3 className="font-extrabold text-lg mb-2">پرداخت آنلاین</h3>
                <p className="text-[11px] opacity-90 mb-1 leading-6">
                  به درگاه امن زیبال منتقل می‌شی
                </p>
                <p className="text-2xl font-extrabold mb-1">{formatPrice(order.total)}</p>
                <p className="text-[10px] opacity-75">درگاه پرداخت زیبال</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-border">
              <h4 className="font-extrabold text-xs text-ink mb-3">🔒 چرا پرداخت آنلاین؟</h4>
              <ul className="space-y-2">
                {[
                  'تأیید خودکار — نیازی به انتظار نیست',
                  'سفارش بلافاصله وارد مرحله آماده‌سازی میشه',
                  'امنیت کامل توسط درگاه بانکی',
                  'پشتیبانی از تمام کارت‌های شتاب',
                ].map((t, i) => (
                  <li key={i} className="flex gap-2 text-[11px] text-ink">
                    <Check size={14} className="text-brand flex-shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={handleOnlinePayment} disabled={paying}
              className="w-full bg-brand text-white font-extrabold py-4 rounded-2xl active:scale-[0.98] transition shadow-[0_8px_24px_rgba(46,125,50,0.35)] flex items-center justify-center gap-2 disabled:opacity-60">
              {paying ? (
                <><Loader2 className="animate-spin" size={18} /> در حال انتقال به درگاه...</>
              ) : (
                <><Zap size={18} /> پرداخت {formatPrice(order.total)}</>
              )}
            </button>
          </div>
        )}

        {/* ═══ کارت به کارت ═══ */}
        {method === 'card' && (
          <div className="space-y-4">
            <button onClick={() => setMethod(null)}
              className="text-xs text-muted font-bold flex items-center gap-1.5">
              <ArrowLeft size={14} /> تغییر روش پرداخت
            </button>

            <div className="rounded-3xl p-5 text-white relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #185C28 100%)' }}>
              <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/10"></div>
              <div className="absolute -bottom-8 right-4 w-24 h-24 rounded-full bg-accent/20"></div>

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} />
                    <span className="text-xs font-bold">شماره کارت</span>
                  </div>
                  <div className="w-10 h-7 rounded-md bg-accent"></div>
                </div>

                <div className="font-mono text-xl font-extrabold tracking-widest mb-2 text-center"
                  style={{ direction: 'ltr' }}>
                  {SHOP_INFO.card.number.replace(/(\d{4})/g, '$1 ').trim()}
                </div>

                <button onClick={copyCard}
                  className="mx-auto flex items-center gap-1.5 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-xs font-bold active:scale-95 transition mb-4">
                  {copied ? <><Check size={14} /> کپی شد</> : <><Copy size={14} /> کپی شماره کارت</>}
                </button>

                <div className="flex items-end justify-between pt-4 border-t border-white/20">
                  <div>
                    <div className="text-[9px] opacity-70 mb-0.5">صاحب حساب</div>
                    <div className="text-xs font-bold">{SHOP_INFO.card.holder}</div>
                  </div>
                  <div className="text-[10px] opacity-80">{SHOP_INFO.card.bank}</div>
                </div>
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/30 rounded-2xl p-4">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle size={16} className="text-ink flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-ink leading-6 font-medium">
                  مبلغ <b className="text-brand">{formatPrice(order.total)}</b> را به کارت بالا واریز کن، سپس رسید را در بله بفرست.
                </p>
              </div>

              <div className="space-y-1.5 mr-6">
                {[
                  'مبلغ را دقیقاً واریز کن',
                  'در توضیحات تراکنش کد سفارش را وارد کن',
                  'عکس رسید را در بله به ما بفرست',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] text-ink">
                    <span className="w-4 h-4 rounded-full bg-accent text-ink text-[9px] font-extrabold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {claimed ? (
              <div className="bg-brand-light rounded-2xl p-4 border border-brand/30 text-center fade-up">
                <CheckCircle2 size={32} className="text-brand mx-auto mb-2" />
                <p className="font-extrabold text-sm text-brand mb-1">عالی!</p>
                <p className="text-[11px] text-muted leading-5 mb-4">
                  حالا عکس رسید را در بله بفرست تا سفارشت تأیید بشه
                </p>
                <a href={`https://ble.ir/${SHOP_INFO.telegram}`} target="_blank" rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white font-extrabold py-3.5 rounded-2xl active:scale-[0.98]">
                  <Send size={16} />
                  ارسال رسید در بله
                </a>
              </div>
            ) : (
              <button onClick={handleClaimed}
                className="w-full bg-brand text-white font-extrabold py-4 rounded-2xl active:scale-[0.98] transition shadow-[0_8px_24px_rgba(46,125,50,0.35)] flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                پرداخت کردم
              </button>
            )}
          </div>
        )}

        <button onClick={() => navigate('/my-orders')}
          className="w-full bg-white border border-border text-muted font-bold py-3 rounded-2xl text-xs active:scale-[0.98]">
          بازگشت به سفارش‌ها
        </button>
      </main>
    </>
  )
}
