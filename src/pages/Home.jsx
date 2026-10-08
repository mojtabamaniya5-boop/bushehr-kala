import { Link } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/Header'
import BannerSlider from '../components/BannerSlider'
import ProductCard from '../components/ProductCard'
import CategoryChip from '../components/CategoryChip'
import { CATEGORIES, PRODUCTS } from '../data/products'
import { Leaf, ShieldCheck, Truck } from 'lucide-react'

export default function Home() {
  const [products] = useState(PRODUCTS)
  const bestSellers = products.filter(p => p.bestSeller)
  const newArrivals = products.slice(0, 4)

  return (
    <>
      <Header />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-1 fade-up">
        <BannerSlider />

        {/* دسته‌بندی‌ها */}
        <div className="flex items-center justify-between mb-3 mt-1">
          <h3 className="font-extrabold text-sm text-ink">دسته‌بندی‌ها</h3>
          <Link to="/category" className="text-[11px] text-brand font-bold">مشاهده همه</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-3 mb-3 -mx-4 px-4">
          {CATEGORIES.map(c => <CategoryChip key={c.id} category={c} />)}
        </div>

        {/* خط زرد منحنی */}
        <div className="flex justify-center mb-5">
          <svg viewBox="0 0 200 8" width="180" height="8">
            <path d="M 5 5 Q 50 1 100 4 Q 150 7 195 3" stroke="#F8C02D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {/* پرفروش‌ترین‌ها */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm text-ink flex items-center gap-1">
            پرفروش‌ترین‌ها <span className="text-base">🔥</span>
          </h3>
          <Link to="/category" className="text-[11px] text-brand font-bold">همه</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {bestSellers.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {/* تخفیف ویژه */}
        <div className="rounded-3xl p-4 mb-6 flex items-center justify-between overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FFF3E0 0%, #FFF8E8 100%)' }}>
          <div>
            <p className="text-[10px] text-accent font-bold mb-0.5">پیشنهاد ویژه</p>
            <h3 className="font-extrabold text-base text-ink mb-2">تا ۲۰٪ تخفیف</h3>
            <Link to="/category"
              className="text-[10px] bg-brand text-white font-bold px-3 py-1.5 rounded-full inline-block shadow-sm">
              مشاهده محصولات
            </Link>
          </div>
          <div className="text-5xl">🫙</div>
        </div>

        {/* تازه‌رسیده‌ها */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm text-ink">تازه‌رسیده‌ها</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {/* مزیت‌ها */}
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
      </main>
    </>
  )
}
