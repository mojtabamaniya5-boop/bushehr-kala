import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Send, Home, ShoppingBag } from 'lucide-react'
import { SHOP_INFO } from '../data/products'

export default function Success() {
  const { id } = useParams()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-cream fade-up">
      <div className="w-full max-w-sm text-center">

        {/* آیکون موفق */}
        <div className="relative mx-auto mb-6 w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-brand/20 animate-ping"></div>
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #185C28 100%)', boxShadow: '0 8px 24px rgba(46,125,50,0.35)' }}>
            <CheckCircle2 size={48} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="font-extrabold text-xl text-ink mb-2">سفارش ثبت شد!</h1>
        <p className="text-xs text-muted mb-6">ممنون که از کافه ترشی خرید کردی 🫙</p>

        {/* کد پیگیری */}
        <div className="bg-white rounded-2xl p-4 border border-border mb-5">
          <p className="text-[10px] text-muted mb-1">کد پیگیری سفارش</p>
          <p className="font-mono font-extrabold text-brand text-lg tracking-wider">#{id}</p>
        </div>

        {/* پیام پرداخت */}
        <div className="rounded-2xl p-4 mb-6 text-right"
          style={{ background: 'linear-gradient(135deg, #FFF8E8 0%, #FFF3E0 100%)', border: '1px solid #F8C02D40' }}>
          <p className="text-[11px] text-ink leading-6 mb-3">
            ⚠️ برای تکمیل سفارش، مبلغ را به کارت زیر واریز کن و <b>رسید را در تلگرام</b> بفرست.
          </p>
          <div className="bg-white/80 rounded-xl p-3">
            <div className="text-[9px] text-muted mb-1">شماره کارت</div>
            <div className="font-mono text-sm font-extrabold text-ink" style={{ direction: 'ltr', textAlign: 'right' }}>
              {SHOP_INFO.card.number.replace(/(\d{4})/g, '$1 ').trim()}
            </div>
            <div className="text-[10px] text-muted mt-1">به نام {SHOP_INFO.card.holder}</div>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="space-y-2">
          <a href={`https://t.me/${SHOP_INFO.telegram}`} target="_blank" rel="noreferrer"
            className="w-full bg-brand text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] shadow-md">
            <Send size={16} /> ارسال رسید در تلگرام
          </a>
          <Link to="/orders"
            className="w-full bg-white border border-border text-ink font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98]">
            <ShoppingBag size={16} /> پیگیری سفارش‌ها
          </Link>
          <Link to="/"
            className="w-full bg-cream text-muted font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98]">
            <Home size={16} /> بازگشت به فروشگاه
          </Link>
        </div>

        <p className="text-[10px] text-muted mt-6">🫙 کافه ترشی — طعم اصیل، با ارسال سریع</p>
      </div>
    </main>
  )
}
