import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Zap, ShieldCheck, ChevronLeft } from 'lucide-react'
import { storage } from '../utils/storage'

const SLIDES = [
  {
    icon: ShoppingBag,
    title: 'به کافه ترشی خوش آمدی',
    desc: 'فروشگاه تخصصی لوازم جانبی دیجیتال — اصل، گارانتی‌دار، با ارسال سریع',
    color: 'from-brand to-brand-dark',
  },
  {
    icon: Zap,
    title: 'سریع و آسان',
    desc: 'محصولات را جستجو کن، به سبد اضافه کن و در چند ثانیه سفارش بده',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: ShieldCheck,
    title: 'خرید مطمئن',
    desc: 'پشتیبانی تلگرام، ضمانت اصالت کالا و امکان پرداخت کارت به کارت',
    color: 'from-green-500 to-emerald-600',
  },
]

export default function Onboarding({ onDone }) {
  const [idx, setIdx] = useState(0)
  const slide = SLIDES[idx]
  const Icon = slide.icon
  const isLast = idx === SLIDES.length - 1

  const next = () => {
    if (isLast) {
      storage.set('onboarded', true)
      onDone()
    } else {
      setIdx(i => i + 1)
    }
  }

  const skip = () => {
    storage.set('onboarded', true)
    onDone()
  }

  return (
    <div className="fixed inset-0 z-[200] bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* skip */}
      <div className="flex justify-end p-4">
        {!isLast && (
          <button onClick={skip} className="text-xs text-slate-500 font-medium">
            رد کردن
          </button>
        )}
      </div>

      {/* content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${slide.color} flex items-center justify-center mb-8 shadow-xl shadow-brand/20`}>
              <Icon size={56} className="text-white" />
            </div>
            <h2 className="text-xl font-bold mb-3">{slide.title}</h2>
            <p className="text-sm text-slate-500 leading-7 max-w-xs">{slide.desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* bottom */}
      <div className="p-6 pb-10">
        {/* dots */}
        <div className="flex justify-center gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? 'w-6 bg-brand' : 'w-1.5 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full bg-brand text-white font-bold py-3.5 rounded-xl active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          {isLast ? 'شروع خرید' : 'بعدی'}
          {!isLast && <ChevronLeft size={18} />}
        </button>
      </div>
    </div>
  )
}
