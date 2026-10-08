import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
      <Header search />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-3 fade-up">
        {/* Search */}
        <Link to="/search" className="flex items-center gap-2 bg-white border border-border rounded-input px-4 py-3 mb-4">
          <span className="text-xs text-muted">جستجو در ترشی‌ها، خیارشور و ...</span>
        </Link>

        {/* Hero Banner */}
        <BannerSlider />

        {/* Categories */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm text-ink">دسته‌بندی‌ها</h3>
          <Link to="/category" className="text-[11px] text-brand font-bold">مشاهده همه</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-5 -mx-4 px-4">
          {CATEGORIES.map(c => <CategoryChip key={c.id} category={c} />)}
        </div>

        {/* پرفروش‌ها */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm text-ink">پرفروش‌ترین‌ها</h3>
          <Link to="/category" className="text-[11px] text-brand font-bold">همه</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {bestSellers.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {/* تخفیف ویژه */}
        <div className="bg-gradient-to-l from-accent to-brand-light rounded-2xl p-4 mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-brand-dark font-bold mb-0.5">پیشنهاد ویژه</p>
            <h3 className="font-extrabold text-sm text-ink mb-1">تا ۲۰٪ تخفیف</h3>
            <Link to="/category" className="text-[10px] bg-brand text-white font-bold px-3 py-1.5 rounded-full inline-block">
              مشاهده
            </Link>
          </div>
          <div className="text-4xl">🥒</div>
        </div>

        {/* تازه‌رسیده‌ها */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm text-ink">تازه‌رسیده‌ها</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {/* مزیت‌ها */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: Leaf, t: 'مواد تازه' },
            { icon: ShieldCheck, t: 'بسته مطمئن' },
            { icon: Truck, t: 'ارسال سریع' },
          ].map(({ icon: Icon, t }, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1.5 border border-border">
              <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
                <Icon size={18} className="text-brand" />
              </div>
              <span className="text-[10px] font-bold text-ink">{t}</span>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
