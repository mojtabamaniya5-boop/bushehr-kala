import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Send, Home } from 'lucide-react'
import { SHOP_INFO } from '../data/products'

export default function Success() {
  const { id } = useParams()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center fade-up">
      <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-5">
        <CheckCircle2 size={48} className="text-green-500" />
      </div>

      <h1 className="font-bold text-lg mb-2">سفارش شما ثبت شد ✅</h1>
      <p className="text-xs text-slate-500 mb-1">کد پیگیری</p>
      <p className="font-mono font-bold text-brand text-sm mb-5">#{id}</p>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 text-right max-w-sm">
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-6">
          ⚠️ برای تکمیل سفارش، مبلغ را به کارت زیر واریز کرده و <b>رسید را به تلگرام پشتیبانی</b> ارسال کنید.
        </p>
        <div className="mt-3 font-mono text-xs font-bold" style={{ direction: 'ltr', textAlign: 'right' }}>
          {SHOP_INFO.card.number.replace(/(\d{4})/g, '$1 ').trim()}
        </div>
        <div className="text-[10px] text-slate-500 mt-1">به نام {SHOP_INFO.card.holder}</div>
      </div>

      <div className="w-full max-w-sm space-y-2">
        <a
          href={`https://t.me/${SHOP_INFO.telegram}`}
          target="_blank"
          rel="noreferrer"
          className="w-full bg-brand text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Send size={16} /> ارسال رسید در تلگرام
        </a>
        <Link
          to="/"
          className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Home size={16} /> بازگشت به فروشگاه
        </Link>
      </div>
    </main>
  )
}
