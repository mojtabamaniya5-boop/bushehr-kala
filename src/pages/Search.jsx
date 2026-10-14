import { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { CATEGORIES } from '../data/products'
import { getProducts } from '../api/products'
import { Search as SearchIcon, X, Loader2 } from 'lucide-react'

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
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts().then(items => {
      setAllProducts(items)
      setLoading(false)
    })
  }, [])

  const base = useMemo(() => {
    if (!q.trim()) return allProducts
    const s = q.trim().toLowerCase()
    return allProducts.filter(p =>
      p.title.toLowerCase().includes(s) ||
      (p.brand || '').toLowerCase().includes(s) ||
      (p.description || '').toLowerCase().includes(s)
    )
  }, [q, allProducts])

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
      <main className="max-w-lg mx-auto px-4 pb-32 pt-3 fade-up">
        <div className="relative mb-3">
          <SearchIcon size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="اسم محصول، برند..."
            className="w-full bg-white border border-border rounded-full py-3 pr-11 pl-11 text-sm outline-none focus:border-brand transition"
          />
          {q && (
            <button onClick={() => setQ('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-3 -mx-4 px-4">
          <button onClick={() => setCat('all')}
            className={'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition ' +
              (cat === 'all' ? 'bg-brand text-white border-brand' : 'bg-white border-border text-ink')}>
            همه
          </button>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1 ' +
                (cat === c.id ? 'bg-brand text-white border-brand' : 'bg-white border-border text-ink')}>
              <span>{c.icon}</span><span>{c.name}</span>
            </button>
          ))}
        </div>

        {!loading && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted">{results.length} نتیجه</span>
            <div className="flex gap-1">
              {SORTS.map(s => (
                <button key={s.id} onClick={() => setSort(s.id)}
                  className={'text-[10px] px-2.5 py-1 rounded-full font-bold transition ' +
                    (sort === s.id ? 'bg-brand text-white' : 'bg-white border border-border text-muted')}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-brand" size={32} />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-4">
              <SearchIcon size={32} className="text-brand" />
            </div>
            <p className="font-extrabold text-ink mb-1">چیزی پیدا نشد</p>
            <p className="text-xs text-muted">یه کلمه دیگه امتحان کن</p>
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
