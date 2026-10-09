import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { CATEGORIES } from '../data/products'
import { getProducts } from '../api/products'
import { Loader2 } from 'lucide-react'

export default function Categories() {
  const { catId } = useParams()
  const active = catId || null
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

  const list = active ? products.filter(p => p.category === active) : products
  const catObj = active ? CATEGORIES.find(c => c.id === active) : null
  const catName = catObj ? catObj.name : 'همه محصولات'

  return (
    <>
      <Header title={catName} back={!!active} search />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-3 fade-up">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-3 -mx-4 px-4">
          <Link to="/category"
            className={'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition ' +
              (!active ? 'bg-brand text-white border-brand' : 'bg-white border-border text-ink')}>
            همه
          </Link>
          {CATEGORIES.map(c => (
            <Link key={c.id} to={`/category/${c.id}`}
              className={'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1 ' +
                (active === c.id ? 'bg-brand text-white border-brand' : 'bg-white border-border text-ink')}>
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-brand" size={32} />
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🫙</span>
            </div>
            <p className="font-extrabold text-ink mb-1">محصولی نیست</p>
            <p className="text-xs text-muted">به‌زودی اضافه میشه</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted">
                <span className="font-extrabold text-brand text-base">{list.length}</span> محصول
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {list.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </main>
    </>
  )
}
