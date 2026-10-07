import { useState, useMemo } from 'react'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { searchProducts, PRODUCTS, CATEGORIES } from '../data/products'
import { Search as SearchIcon, X } from 'lucide-react'

const SORTS = [
  { id: 'default',    label: 'پیش‌فرض' },
  { id: 'cheap',      label: 'ارزان‌ترین' },
  { id: 'expensive',  label: 'گران‌ترین' },
  { id: 'rating',     label: 'محبوب‌ترین' },
]

export default function Search() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [sort, setSort] = useState('default')

  const base = q.trim() ? searchProducts(q) : PRODUCTS

  const results = useMemo(() => {
    let list = cat === 'all' ? base : base.filter(p => p.category === cat)
    list = [...list]
    if (sort === 'cheap') list.sort((a, b) => a.price - b.price)
    else if (sort === 'expensive') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    return list
  }, [base, cat, sort])

  return (
    <>
      <Header title="جستجو" back />
      <main className="max-w-lg mx-auto px-4 pb-24 pt-3 fade-up">
        {/* نوار جستجو */}
        <div className="relative mb-3">
          <SearchIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="اسم محصول، برند..."
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pr-10 pl-10 text-sm outline-none focus:border-brand transition"
          />
          {q && (
            <button
              onClick={() => setQ('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* فیلتر دسته */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
          <button
            onClick={() => setCat('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              cat === 'all' ? 'bg-brand text-white border-brand' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            همه
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition flex items-center gap-1 ${
                cat === c.id ? 'bg-brand text-white border-brand' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>{c.icon}</span><span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* مرتب‌سازی */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-500">{results.length} نتیجه</span>
          <div className="flex gap-1">
            {SORTS.map(s => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`text-[10px] px-2 py-1 rounded-full transition ${
                  sort === s.id ? 'bg-brand text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* نتایج */}
        {results.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-sm">چیزی پیدا نشد</p>
            <p className="text-xs mt-1">یه کلمه دیگه امتحان کن</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {results.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
    </>
  )
}
