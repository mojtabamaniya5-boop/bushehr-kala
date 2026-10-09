import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { formatPrice } from '../utils/storage'
import { addToCart, isFavorite, toggleFavorite, cartCount } from '../utils/cart'
import { getProductById } from '../api/products'
import { Heart, ShoppingCart, Star, Check, Minus, Plus, Loader2 } from 'lucide-react'
import { toast } from '../components/Toast'
import ProductImage from '../components/ProductImage'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [fav, setFav] = useState(false)
  const [cartBadge, setCartBadge] = useState(cartCount())
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    let mounted = true
    getProductById(id).then(p => {
      if (mounted) {
        setProduct(p)
        setLoading(false)
        if (p) setFav(isFavorite(p.id))
      }
    })
    return () => { mounted = false }
  }, [id])

  const handleAdd = () => {
    if (!product) return
    addToCart(product, qty)
    setCartBadge(cartCount())
    setJustAdded(true)
    toast.success(qty + ' عدد به سبد اضافه شد')
    setTimeout(() => setJustAdded(false), 1500)
  }

  const handleBuyNow = () => {
    if (!product) return
    addToCart(product, qty)
    navigate('/cart')
  }

  if (loading) {
    return (<><Header title="محصول" back /><div className="flex items-center justify-center pt-32"><Loader2 className="animate-spin text-brand" size={32} /></div></>)
  }

  if (!product) {
    return (
      <>
        <Header title="محصول" back />
        <div className="text-center pt-24 text-muted">
          <p className="text-4xl mb-3">🫙</p>
          <p className="font-bold mb-2">محصول یافت نشد</p>
          <button onClick={() => navigate('/')} className="text-brand font-bold text-xs">بازگشت به خانه</button>
        </div>
      </>
    )
  }

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <>
      <Header title={product.brand || 'محصول'} back search />
      <main className="max-w-lg mx-auto pb-48 fade-up">
        <div className="relative aspect-square bg-gradient-to-br from-cream to-brand-light">
          <ProductImage product={product} />
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-accent text-ink text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
              {discount}٪ تخفیف
            </span>
          )}
          <button type="button" onClick={() => setFav(toggleFavorite(product.id))}
            className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center active:scale-90">
            <Heart size={20} className={fav ? 'fill-brand text-brand' : 'text-muted'} />
          </button>
        </div>

        <div className="px-4 pt-4">
          <h1 className="font-extrabold text-base leading-6 mb-2 text-ink">{product.title}</h1>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={13}
                  className={i <= Math.round(product.rating) ? 'fill-accent text-accent' : 'text-border'} />
              ))}
            </div>
            <span className="text-[11px] font-bold text-ink">{product.rating}</span>
            <span className="text-[10px] text-muted">({product.reviews || 0} نظر)</span>
            <span className="text-[10px] text-muted mr-auto">{product.weight}</span>
          </div>

          <div className="flex items-center gap-3 mb-4 bg-brand-light/50 rounded-2xl p-3">
            <span className="text-xl font-extrabold text-brand">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-muted line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs mb-4">
            <span className={'w-2 h-2 rounded-full ' + (product.stock > 0 ? 'bg-brand' : 'bg-danger')}></span>
            <span className="text-ink font-medium">
              {product.stock > 0 ? 'موجود در انبار (' + product.stock + ' شیشه)' : 'ناموجود'}
            </span>
          </div>

          {product.description && (
            <div className="bg-white rounded-2xl p-4 mb-3 border border-border">
              <h3 className="font-extrabold text-sm mb-2 text-ink">توضیحات</h3>
              <p className="text-xs leading-6 text-muted">{product.description}</p>
            </div>
          )}

          {product.features && product.features.length > 0 && (
            <div className="bg-white rounded-2xl p-4 mb-3 border border-border">
              <h3 className="font-extrabold text-sm mb-3 text-ink">ویژگی‌ها</h3>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-ink">
                    <div className="w-5 h-5 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-brand" strokeWidth={3} />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-border">
            <span className="text-sm font-bold text-ink">تعداد</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center active:scale-90 text-brand">
                <Minus size={16} strokeWidth={3} />
              </button>
              <span className="font-extrabold w-8 text-center text-lg text-ink">{qty}</span>
              <button type="button" onClick={() => setQty(q => Math.min((product.stock || 99), q + 1))}
                className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center active:scale-90">
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-muted mt-4">
            در سبد شما: <b className="text-brand">{cartBadge}</b> کالا
          </div>
        </div>
      </main>

      <div className="fixed bottom-20 left-0 right-0 z-50 px-4">
        <div className="max-w-lg mx-auto flex gap-2 bg-white rounded-3xl p-2 shadow-[0_8px_28px_rgba(0,0,0,0.15)]">
          <button type="button" onClick={handleAdd}
            className={'flex-1 font-extrabold py-3 rounded-2xl active:scale-[0.98] transition flex items-center justify-center gap-2 text-sm ' +
              (justAdded ? 'bg-brand text-white' : 'bg-brand-light text-brand')}>
            {justAdded ? <><Check size={18} /> اضافه شد</> : <><ShoppingCart size={18} /> افزودن</>}
          </button>
          <button type="button" onClick={handleBuyNow}
            className="flex-1 bg-brand text-white font-extrabold py-3 rounded-2xl active:scale-[0.98] transition text-sm">
            خرید سریع
          </button>
        </div>
      </div>
    </>
  )
}
