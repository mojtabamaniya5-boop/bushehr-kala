import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import JarIllustration from './JarIllustration'

const BANNERS = [
  {
    title: 'ترشی‌های اصیل',
    subtitle: 'خوشمزه و خانگی',
    desc: 'بدون مواد نگهدارنده · ارسال سریع',
    cta: 'مشاهده محصولات',
    link: '/category/cucumber',
    bg: 'linear-gradient(135deg, #E0F2F1 0%, #FFF8E8 100%)',
    cat: 'cucumber',
    textColor: '#185C28',
  },
  {
    title: 'زیتون پرورده',
    subtitle: 'دست‌ساز شمال',
    desc: 'با گردو و رب انار اصیل',
    cta: 'خرید کنید',
    link: '/category/olive',
    bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFF8E8 100%)',
    cat: 'olive',
    textColor: '#4E342E',
  },
  {
    title: 'ترشی ویژه',
    subtitle: 'هفت‌بیجار ممتاز',
    desc: 'پرفروش‌ترین ترشی فصل',
    cta: 'همین حالا',
    link: '/category/special',
    bg: 'linear-gradient(135deg, #FBE9E7 0%, #FFF8E8 100%)',
    cat: 'special',
    textColor: '#D84315',
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
    <div className="relative rounded-3xl overflow-hidden mb-5 h-48"
      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 p-5 flex items-center justify-between"
          style={{ background: b.bg }}>
          <div className="flex-1 pl-2">
            <p className="text-[11px] font-bold mb-1" style={{ color: b.textColor, opacity: 0.7 }}>
              {b.subtitle}
            </p>
            <h2 className="text-2xl font-extrabold mb-2 leading-tight" style={{ color: b.textColor }}>
              {b.title}
            </h2>
            <p className="text-[10px] mb-3 text-muted">{b.desc}</p>
            <Link to={b.link}
              className="inline-block text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md active:scale-95 transition"
              style={{ background: '#2E7D32' }}>
              {b.cta}
            </Link>
          </div>
          <div className="flex-shrink-0 -ml-4">
            <JarIllustration category={b.cat} size={140} />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {BANNERS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={'h-1.5 rounded-full transition-all ' + (i === idx ? 'w-5 bg-brand' : 'w-1.5 bg-muted/40')} />
        ))}
      </div>
    </div>
  )
}
