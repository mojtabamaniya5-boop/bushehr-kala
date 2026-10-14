import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { getFavorites } from '../utils/cart'
import { PRODUCTS } from '../data/products'
import { Heart } from 'lucide-react'

export default function Favorites() {
  const [ids, setIds] = useState(getFavorites())

  useEffect(() => {
    const update = () => setIds(getFavorites())
    window.addEventListener('fav-updated', update)
    return () => window.removeEventListener('fav-updated', update)
  }, [])

  const products = PRODUCTS.filter(p => ids.includes(p.id))

  return (
    <>
      <Header title="علاقه‌مندی‌ها" />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-4 fade-up">

        {products.length === 0 ? (
          <div className="text-center pt-24">
            <div className="w-24 h-24 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-5">
              <Heart size={44} className="text-brand" />
            </div>
            <p className="font-extrabold text-base text-ink mb-2">هنوز چیزی علاقه‌مند نکردی</p>
            <p className="text-xs text-muted mb-6">
              با زدن قلب روی محصولات، اینجا ذخیره میشن
            </p>
            <Link to="/"
              className="inline-block bg-brand text-white text-sm font-extrabold px-6 py-3 rounded-full shadow-md active:scale-95 transition">
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-muted">
                <span className="font-extrabold text-brand text-base">{products.length}</span> محصول ذخیره شده
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </main>
    </>
  )
}
