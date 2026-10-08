import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const BANNERS = [
  { image: 'banner-1.jpg', title: 'ترشی‌های اصیل', subtitle: 'خوشمزه و خانگی', cta: 'مشاهده محصولات', link: '/category/mixed' },
  { image: 'banner-2.jpg', title: 'خیارشور خانگی', subtitle: 'با طعم اصیل و تازه', cta: 'خرید کنید', link: '/category/cucumber' },
  { image: 'banner-3.jpg', title: 'زیتون پرورده', subtitle: 'دست‌ساز از شمال', cta: 'همین حالا', link: '/category/olive' },
  { image: 'banner-4.jpg', title: 'ترشی ویژه', subtitle: 'پرفروش‌ترین ترشی فصل', cta: 'مشاهده', link: '/category/special' },
]

export default function BannerSlider() {
  const [idx, setIdx] = useState(0)
  const [imgErr, setImgErr] = useState({})
  const base = import.meta.env.BASE_URL

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % BANNERS.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative rounded-3xl overflow-hidden mb-5 h-52"
      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>

      {/* همه بنرها همزمان رندر میشن، با opacity سوییچ میکنن — بدون فریم خالی */}
      {BANNERS.map((b, i) => {
        const active = i === idx
        const imgSrc = `${base}assets/banners/${b.image}`
        return (
          <div key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: active ? 1 : 0, zIndex: active ? 2 : 1 }}>

            {!imgErr[i] ? (
              <img src={imgSrc} alt={b.title}
                onError={() => setImgErr(e => ({ ...e, [i]: true }))}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-light to-cream" />
            )}

            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, transparent 75%)' }} />

            <div className="absolute inset-0 p-5 flex flex-col justify-center items-end text-right text-white">
              <p className="text-[11px] font-bold opacity-90 mb-1 drop-shadow">{b.subtitle}</p>
              <h2 className="text-2xl font-extrabold mb-3 leading-tight drop-shadow-md">{b.title}</h2>
              <Link to={b.link}
                className="inline-block bg-accent text-ink text-xs font-extrabold px-4 py-2.5 rounded-full shadow-lg active:scale-95 transition">
                {b.cta}
              </Link>
            </div>
          </div>
        )
      })}

      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {BANNERS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={'h-1.5 rounded-full transition-all ' + (i === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50')} />
        ))}
      </div>
    </div>
  )
}
