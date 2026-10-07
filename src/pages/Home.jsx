import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import BannerSlider from '../components/BannerSlider'
import ProductCard from '../components/ProductCard'
import { SHOP_INFO } from '../data/products'
import { supabase } from '../utils/supabase'
import { Zap, Truck, ShieldCheck } from 'lucide-react'

const CATEGORIES_STATIC = [
  { id: 'headphone', name: 'هدفون و هندزفری', icon: '🎧' },
  { id: 'charger',   name: 'شارژر و آداپتور', icon: '🔌' },
  { id: 'powerbank', name: 'پاوربانک',        icon: '🔋' },
  { id: 'cable',     name: 'کابل و مبدل',     icon: '🔗' },
  { id: 'mouse',     name: 'ماوس و کیبورد',   icon: '🖱️' },
  { id: 'hub',       name: 'هاب و داک',       icon: '🧩' },
  { id: 'case',      name: 'کیف و قاب',       icon: '💼' },
  { id: 'holder',    name: 'هولدر و پایه',    icon: '📱' },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        console.log('Fetching products from Supabase...')
        const { data, error: err } = await supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })

        console.log('Response:', { data, err })

        if (err) throw err

        if (mounted) {
          const normalized = (data || []).map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            brand: p.brand,
            price: p.price,
            oldPrice: p.old_price,
            stock: p.stock,
            rating: Number(p.rating),
            image: p.image,
            description: p.description,
            features: p.features || [],
            bestSeller: p.best_seller,
          }))
          setProducts(normalized)
          setLoading(false)
        }
      } catch (e) {
        console.error('Home fetch error:', e)
        if (mounted) {
          setError(e.message || 'خطای نامشخص')
          setLoading(false)
        }
      }
    })()
    return () => { mounted = false }
  }, [])

  const bestSellers = products.filter(p => p.bestSeller)
  const newArrivals = products.slice(0, 4)

  return (
    <>
      <Header title={SHOP_INFO.name} search />
      <main className="max-w-lg mx-auto px-4 pb-24 pt-4 fade-up">
        <BannerSlider />

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

        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">دسته‌بندی‌ها</h3>
          <Link to="/category" className="text-xs text-brand font-medium">مشاهده همه</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 mb-5">
          {CATEGORIES_STATIC.map(c => (
            <Link key={c.id} to={`/category/${c.id}`} className="flex-shrink-0 w-20 flex flex-col items-center gap-1.5">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl active:scale-95 transition">
                {c.icon}
              </div>
              <span className="text-[10px] text-center font-medium leading-tight">{c.name}</span>
            </Link>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-5">
            <p className="text-xs text-red-500 font-bold mb-1">خطا در خواندن محصولات:</p>
            <p className="text-[10px] text-red-400 font-mono break-all">{error}</p>
          </div>
        )}

        {loading && !error && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl h-56 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && !error && (
          <>
            {bestSellers.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">🔥 پرفروش‌ها</h3>
                  <Link to="/category" className="text-xs text-brand font-medium">همه</Link>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </>
            )}

            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">✨ جدیدها</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </main>
    </>
  )
}
