import { Link } from 'react-router-dom'
import Header from '../components/Header'
import BannerSlider from '../components/BannerSlider'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, PRODUCTS, SHOP_INFO } from '../data/products'
import { Zap, Truck, ShieldCheck } from 'lucide-react'

export default function Home() {
  const bestSellers = PRODUCTS.filter(p => p.bestSeller)
  const newArrivals = [...PRODUCTS].slice(-4)

  return (
    <>
      <Header title={SHOP_INFO.name} search />
      <main className="max-w-lg mx-auto px-4 pb-24 pt-4 fade-up">
        <BannerSlider />

        {/* مزایا */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { icon: Truck, t: 'ارسال سریع' },
            { icon: ShieldCheck, t: 'ضمانت اصالت' },
            { icon: Zap, t: 'پرداخت آسان' },
          ].map(({ icon: Icon, t }, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-3 flex flex-col items-center gap-1 border border-slate-200 dark:border-slate-700">
              <Icon size={18} className="text-brand" />
              <span className="text-[10px] font-medium">{t}</span>
            </div>
          ))}
        </div>

        {/* دسته‌ها */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">دسته‌بندی‌ها</h3>
          <Link to="/category" className="text-xs text-brand font-medium">مشاهده همه</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 mb-5">
          {CATEGORIES.map(c => (
            <Link key={c.id} to={`/category/${c.id}`} className="flex-shrink-0 w-20 flex flex-col items-center gap-1.5">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl active:scale-95 transition">
                {c.icon}
              </div>
              <span className="text-[10px] text-center font-medium leading-tight">{c.name}</span>
            </Link>
          ))}
        </div>

        {/* پرفروش‌ها */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">🔥 پرفروش‌ها</h3>
          <Link to="/category" className="text-xs text-brand font-medium">همه</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {/* جدیدها */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">✨ جدیدها</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </main>
    </>
  )
}
