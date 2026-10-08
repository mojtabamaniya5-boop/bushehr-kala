import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const BANNERS = [
  {
    image: 'banner-1.jpg',
    title: 'ترشی‌های اصیل',
    subtitle: 'خوشمزه و خانگی',
    link: '/category/mixed',
  },
  {
    image: 'banner-2.jpg',
    title: 'خیارشور خانگی',
    subtitle: 'با طعم اصیل و تازه',
    link: '/category/cucumber',
  },
  {
    image: 'banner-3.jpg',
    title: 'زیتون پرورده',
    subtitle: 'دست‌ساز از شمال',
    link: '/category/olive',
  },
  {
    image: 'banner-4.jpg',
    title: 'ترشی ویژه',
    subtitle: 'پرفروش‌ترین ترشی فصل',
    link: '/category/special',
  },
]

export default function BannerSlider() {
  const [idx, setIdx] = useState(0)
  const [imgErr, setImgErr] = useState({})

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % BANNERS.length), 5000)
    return () => clearInterval(t)
  }, [])

  const b = BANNERS[idx]
  const base = import.meta.env.BASE_URL
  const imgSrc = `${base}assets/banners/${b.image}`

  return (
    <div className="relative rounded-3xl overflow-hidden mb-5 h-52"
      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0">

          {/* عکس بنر */}
          {!imgErr[idx] ? (
            <img src={imgSrc} alt={b.title}
              onError={() => setImgErr(e => ({ ...e, [idx]: true }))}
              className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-light to-cream" />
          )}

          {/* گرادیان تیره برای خوانایی متن */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/25 to-transparent" />

          {/* محتوا */}
          <div className="absolute inset-0 p-5 flex flex-col justify-center text-white">
            <p className="text-[11px] font-bold opacity-90 mb-1">{b.subtitle}</p>
            <h2 className="text-2xl font-extrabold mb-3 leading-tight drop-shadow-md">{b.title}</h2>
            <Link to={b.link}
              className="inline-block bg-accent text-ink text-xs font-extrabold px-4 py-2.5 rounded-full shadow-lg self-start active:scale-95 transition">
              مشاهده محصولات
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {BANNERS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={'h-1.5 rounded-full transition-all ' + (i === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50')} />
        ))}
      </div>
    </div>
  )
}
