import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, PRODUCTS } from '../data/products'

export default function Categories() {
  const { catId } = useParams()
  const active = catId || null
  const list = active ? PRODUCTS.filter(p => p.category === active) : PRODUCTS
  const catName = active ? CATEGORIES.find(c => c.id === active)?.name : 'همه محصولات'

  return (
    <>
      <Header title={catName || 'دسته‌بندی'} back={!!active} search />
      <main className="max-w-lg mx-auto px-4 pb-24 pt-3 fade-up">
        {/* تب دسته‌ها */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-3">
          <Link
            to="/category"
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              !active
                ? 'bg-brand text-white border-brand'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}
          >
            همه
          </Link>
          {CATEGORIES.map(c => (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition flex items-center gap-1 ${
                active === c.id
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-2">📦</p>
            <p className="text-sm">محصولی در این دسته نیست</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {list.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
    </>
  )
}
