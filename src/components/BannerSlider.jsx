import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const BANNERS = [
  {
    title: 'خیارشورهای خانم',
    subtitle: 'با طعم اصیل و تازه',
    cta: 'مشاهده محصولات',
    link: '/category/cucumber',
    bg: 'from-brand to-brand-dark',
  },
  {
    title: 'ترشی‌های خونگی',
    subtitle: 'بدون مواد نگهدارنده',
    cta: 'خرید کنید',
    link: '/category/mixed',
    bg: 'from-accent to-brand',
  },
  {
    title: 'زیتون پرورده اصل',
    subtitle: 'دست‌ساز از شمال',
    cta: 'همین حالا',
    link: '/category/olive',
    bg: 'from-brown to-ink',
  },
]

export default function BannerSlider() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % BANNERS.length), 5000)
    return () => clearInterval(t)
  }, [])

  const b = BANNERS[idx]

  return (
    <div className="relative rounded-2xl overflow-hidden mb-5 h-44">
      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className={`absolute inset-0 bg-gradient-to-l ${b.bg} text-white p-5 flex flex-col justify-center`}>
          <p className="text-xs opacity-90 mb-1">{b.subtitle}</p>
          <h2 className="text-xl font-extrabold mb-3">{b.title}</h2>
          <Link to={b.link} className="inline-block bg-white text-brand text-xs font-bold px-4 py-2 rounded-full self-start">
            {b.cta}
          </Link>
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white/10"></div>
          <div className="absolute -left-2 -top-8 w-20 h-20 rounded-full bg-white/10"></div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {BANNERS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`} />
        ))}
      </div>
    </div>
  )
}
