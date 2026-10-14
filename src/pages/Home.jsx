import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import BannerSlider from '../components/BannerSlider'
import ProductCard from '../components/ProductCard'
import CategoryChip from '../components/CategoryChip'
import EnamadFooter from '../components/EnamadFooter'
import { CATEGORIES } from '../data/products'
import { getProducts } from '../api/products'
import { Leaf, ShieldCheck, Truck, Loader2 } from 'lucide-react'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getProducts().then(items => {
      if (mounted) {
        setProducts(items)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [])

  const bestSellers = products.filter(p => p.bestSeller)
  const newArrivals = products.slice(0, 4)

  return (
    <>
      <Header />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-1 fade-up">
        <BannerSlider />

        <div className="flex items-center justify-between mb-3 mt-1">
          <h3 className="font-extrabold text-sm text-ink">دسته‌بندی‌ها</h3>
          <Link to="/category" className="text-[11px] text-brand font-bold">مشاهده همه</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-3 mb-3 -mx-4 px-4">
          {CATEGORIES.map(c => <CategoryChip key={c.id} category={c} />)}
        </div>

        <div className="flex justify-center mb-5">
          <svg viewBox="0 0 200 8" width="180" height="8">
            <path d="M 5 5 Q 50 1 100 4 Q 150 7 195 3" stroke="#F8C02D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-brand" size={32} />
          </div>
        )}

        {!loading && (
          <>
            {bestSellers.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-extrabold text-sm text-ink flex items-center gap-1">
                    پرفروش‌ترین‌ها <span className="text-base">🔥</span>
                  </h3>
                  <Link to="/category" className="text-[11px] text-brand font-bold">همه</Link>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {bestSellers.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </>
            )}

            <div className="rounded-3xl p-5 mb-6 overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #FFF8E8 0%, #E8F5E9 60%, #C8E6C9 100%)',
                boxShadow: '0 6px 22px rgba(46,125,50,0.10)', border: '1px solid rgba(46,125,50,0.10)' }}>
              <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-accent/25"></div>
              <div className="absolute -bottom-12 right-1/3 w-24 h-24 rounded-full bg-brand/10"></div>

              <div className="relative flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-full px-2.5 py-1 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    <span className="text-[10px] font-extrabold text-ink">پیشنهاد ویژه هفته</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-brand-dark leading-tight mb-1">
                    تا <span className="text-2xl text-accent">۲۰٪</span> تخفیف
                  </h3>
                  <p className="text-[10px] text-muted mb-3">روی ترشی‌ها و خیارشورهای منتخب</p>
                  <Link to="/category"
                    className="inline-flex items-center gap-1.5 bg-brand text-white text-[11px] font-extrabold px-4 py-2.5 rounded-full shadow-md active:scale-95 transition">
                    <span>مشاهده محصولات</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleX(-1)' }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>
                <div className="flex-shrink-0 relative">
                  <div className="w-24 h-24 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-white/70">
                    <img src={`${import.meta.env.BASE_URL}assets/categories/mixed.png`} alt="تخفیف" className="w-20 h-20 object-contain" />
                  </div>
                  <div className="absolute -top-1 -right-1 bg-danger text-white text-[10px] font-extrabold rounded-full px-2 py-1 shadow-md border-2 border-white">
                    ۲۰٪
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-sm text-ink">تازه‌رسیده‌ها</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: Leaf, t: 'مواد تازه', s: 'کیفیت تضمینی' },
            { icon: ShieldCheck, t: 'پرداخت امن', s: 'درگاه معتبر' },
            { icon: Truck, t: 'ارسال سریع', s: 'به سراسر کشور' },
          ].map(({ icon: Icon, t, s }, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1.5 border border-border">
              <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
                <Icon size={18} className="text-brand" />
              </div>
              <span className="text-[10px] font-bold text-ink text-center">{t}</span>
              <span className="text-[8px] text-muted text-center">{s}</span>
            </div>
          ))}
        </div>

        <EnamadFooter />
      </main>
    </>
  )
}
