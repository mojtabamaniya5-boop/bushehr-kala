import { Link } from 'react-router-dom'
import { Heart, Plus, Star } from 'lucide-react'
import { formatPrice } from '../utils/storage'
import { addToCart, isFavorite, toggleFavorite } from '../utils/cart'
import { useState } from 'react'
import { toast } from './Toast'

// رنگی بر اساس دسته
const CAT_COLOR = {
  cucumber: '#4CAF50',
  mixed: '#2E7D32',
  olive: '#6B4E37',
  garlic: '#F8C02D',
  vegetables: '#66BB6A',
  salads: '#81C784',
  special: '#8D6E63',
  fresh: '#AED581',
}

export default function ProductCard({ product }) {
  const [fav, setFav] = useState(isFavorite(product.id))
  const [added, setAdded] = useState(false)
  const [imgErr, setImgErr] = useState(false)

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

  const bg = CAT_COLOR[product.category] || '#2E7D32'

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border active:scale-[0.98] transition">
        <div className="relative aspect-square overflow-hidden" style={{ background: bg }}>
          {!imgErr ? (
            <img src={product.image} alt={product.title} loading="lazy"
              onError={() => setImgErr(true)}
              className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
              {product.title.charAt(0)}
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-white text-brand text-[10px] font-bold px-2 py-0.5 rounded-full">
              {discount}٪ تخفیف
            </span>
          )}
          {product.bestSeller && discount === 0 && (
            <span className="absolute top-2 right-2 bg-accent text-ink text-[10px] font-bold px-2 py-0.5 rounded-full">
              پرفروش
            </span>
          )}
          <button onClick={handleFav}
            className="absolute top-2 left-2 p-1.5 rounded-full bg-white shadow-sm active:scale-90">
            <Heart size={16} className={fav ? 'fill-brand text-brand' : 'text-muted'} />
          </button>
        </div>
        <div className="p-3">
          <h3 className="text-xs font-bold text-ink line-clamp-2 leading-5 h-10 mb-1.5">{product.title}</h3>
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="fill-accent text-accent" />
            <span className="text-[10px] font-bold text-ink">{product.rating}</span>
            <span className="text-[10px] text-muted">({product.reviews || 0})</span>
            <span className="text-[10px] text-muted mr-auto">{product.weight}</span>
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col">
              {product.oldPrice && (
                <span className="text-[10px] text-muted line-through">{formatPrice(product.oldPrice)}</span>
              )}
              <span className="text-sm font-bold text-brand">{formatPrice(product.price)}</span>
            </div>
            <button onClick={handleAdd}
              className={`p-2 rounded-xl text-white active:scale-90 transition ${added ? 'bg-accent' : 'bg-brand'}`}>
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
