import { Link } from 'react-router-dom'
import { Heart, Plus, Star } from 'lucide-react'
import { formatPrice } from '../utils/storage'
import { addToCart, isFavorite, toggleFavorite } from '../utils/cart'
import { useState } from 'react'
import { toast } from './Toast'
import ProductImage from './ProductImage'

export default function ProductCard({ product }) {
  const [fav, setFav] = useState(isFavorite(product.id))
  const [added, setAdded] = useState(false)

  const handleFav = (e) => {
    e.preventDefault(); e.stopPropagation()
    const now = toggleFavorite(product.id)
    setFav(now)
    toast.success(now ? 'به علاقه‌مندی‌ها اضافه شد' : 'حذف شد')
  }

  const handleAdd = (e) => {
    e.preventDefault(); e.stopPropagation()
    addToCart(product, 1)
    setAdded(true)
    toast.success('به سبد اضافه شد')
    setTimeout(() => setAdded(false), 1200)
  }

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-[22px] overflow-hidden border border-border active:scale-[0.98] transition"
        style={{ boxShadow: '0 2px 14px rgba(0,0,0,0.05)' }}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-cream to-brand-light">
          <ProductImage product={product} />
          {discount > 0 && (
            <span className="absolute top-2.5 right-2.5 bg-accent text-ink text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
              {discount}٪
            </span>
          )}
          {product.bestSeller && discount === 0 && (
            <span className="absolute top-2.5 right-2.5 bg-brand text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
              پرفروش
            </span>
          )}
          <button onClick={handleFav}
            className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md active:scale-90">
            <Heart size={15} className={fav ? 'fill-brand text-brand' : 'text-muted'} />
          </button>
        </div>
        <div className="p-3">
          <h3 className="text-xs font-bold text-ink line-clamp-2 leading-5 h-10 mb-1.5">{product.title}</h3>
          <div className="flex items-center gap-1 mb-2.5">
            <Star size={11} className="fill-accent text-accent" />
            <span className="text-[10px] font-bold text-ink">{product.rating}</span>
            <span className="text-[10px] text-muted mr-auto">{product.weight}</span>
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col">
              {product.oldPrice && (
                <span className="text-[10px] text-muted line-through">{formatPrice(product.oldPrice)}</span>
              )}
              <span className="text-sm font-extrabold text-brand">{formatPrice(product.price)}</span>
            </div>
            <button onClick={handleAdd}
              className={`w-8 h-8 rounded-xl text-white flex items-center justify-center active:scale-90 transition ${added ? 'bg-accent' : 'bg-brand'}`}>
              <Plus size={15} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
