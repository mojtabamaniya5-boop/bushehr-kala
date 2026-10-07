import { Link } from 'react-router-dom'
import { Heart, Plus } from 'lucide-react'
import { formatPrice } from '../utils/storage'
import { addToCart, isFavorite, toggleFavorite } from '../utils/cart'
import { useState } from 'react'
import { toast } from './Toast'

export default function ProductCard({ product }) {
  const [fav, setFav] = useState(isFavorite(product.id))
  const [added, setAdded] = useState(false)

  const handleFav = (e) => {
    e.preventDefault()
    const now = toggleFavorite(product.id)
    setFav(now)
    toast.success(now ? 'به علاقه‌مندی‌ها اضافه شد' : 'از علاقه‌مندی‌ها حذف شد')
  }

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart(product, 1)
    setAdded(true)
    toast.success('به سبد خرید اضافه شد')
    setTimeout(() => setAdded(false), 1200)
  }

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition">
        <div className="relative aspect-square bg-slate-100 dark:bg-slate-700">
          <img src={product.image} alt={product.title} loading="lazy" className="w-full h-full object-cover" />
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {discount}٪ تخفیف
            </span>
          )}
          <button
            onClick={handleFav}
            className="absolute top-2 left-2 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur active:scale-90"
          >
            <Heart size={16} className={fav ? 'fill-brand text-brand' : 'text-slate-600 dark:text-slate-300'} />
          </button>
        </div>
        <div className="p-2.5">
          <h3 className="text-xs font-medium line-clamp-2 leading-5 h-10 mb-1.5">{product.title}</h3>
          <div className="flex items-end justify-between gap-1">
            <div className="flex flex-col">
              {product.oldPrice && (
                <span className="text-[10px] text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>
              )}
              <span className="text-sm font-bold text-brand">{formatPrice(product.price)}</span>
            </div>
            <button
              onClick={handleAdd}
              className={`p-1.5 rounded-lg text-white active:scale-90 transition ${
                added ? 'bg-green-500' : 'bg-brand'
              }`}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
