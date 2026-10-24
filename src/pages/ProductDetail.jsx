import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { formatPrice } from '../utils/storage'
import { addToCart, isFavorite, toggleFavorite, cartCount } from '../utils/cart'
import { getProductById } from '../api/products'
import { Heart, ShoppingCart, Star, Check, Minus, Plus, Loader2, Grid3x3, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react'
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
  const [showFullDesc, setShowFullDesc] = useState(false)
  const isOutOfStock = !product || (product.stock ?? 0) <= 0

  useEffect(() => {
    window.scrollTo(0, 0) // فیکس باگ حفظ موقعیت اسکرول مرورگر
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

  const todayJalali = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'long' }).format(new Date());

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <>
      <Header title={product.brand || 'محصول'} back search />
      <main className="max-w-lg mx-auto pb-48 pt-2 fade-up">
        <div className="relative w-full h-[300px] bg-gradient-to-br from-cream to-brand-light">
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

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {product.stock > 0 ? (
              <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-2 rounded-xl border border-green-200 text-xs font-bold shadow-sm">
                <CheckCircle2 size={16} className="text-green-600" />
                موجود در انبار ({product.stock} عدد)
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-2 rounded-xl border border-red-200 text-xs font-bold shadow-sm">
                <XCircle size={16} className="text-red-600" />
                ناموجود
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-brand-light/40 text-brand px-3 py-2 rounded-xl border border-brand/20 text-[11px] font-bold">
              <ShieldCheck size={15} />
              قیمت و موجودی به‌روز شده در {todayJalali}
            </div>
          </div>

          {product.description && (
            <div className="bg-white rounded-2xl p-4 mb-3 border border-border shadow-sm">
              <h3 className="font-extrabold text-sm mb-3 text-ink">توضیحات محصول</h3>
              <div className="relative">
                <div className={`text-[12px] text-ink/80 transition-all duration-300 whitespace-pre-line ${!showFullDesc ? 'line-clamp-2 leading-6' : 'leading-7'}`}>
                  {product.description}
                </div>
                {!showFullDesc && product.description.length > 100 && (
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent"></div>
                )}
              </div>
              {product.description.length > 100 && (
                <button type="button" onClick={() => setShowFullDesc(!showFullDesc)} className="mt-3 w-full flex items-center justify-center gap-1 py-2.5 text-xs font-bold text-brand bg-brand-light/40 rounded-xl active:scale-95 transition">
                  {showFullDesc ? 'بستن توضیحات' : 'مشاهده کامل توضیحات'}
                </button>
              )}
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

          {product.category && (
            <Link to={`/category/${product.category}`} className="flex items-center justify-center gap-2 w-full bg-white border border-border rounded-2xl p-4 mb-3 text-brand font-extrabold text-sm active:scale-[0.98] transition shadow-sm hover:bg-cream">
              <Grid3x3 size={18} />
              مشاهده سایر محصولات در این دسته
            </Link>
          )}

          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-border">
            <span className="text-sm font-bold text-ink">تعداد</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={isOutOfStock ? undefined : () => setQty(q => Math.max(1, q - 1))}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${isOutOfStock ? 'bg-muted text-white cursor-not-allowed' : 'bg-brand-light text-brand active:scale-90'}`}>
                <Minus size={16} strokeWidth={3} />
              </button>
              <span className="font-extrabold w-8 text-center text-lg text-ink">{qty}</span>
              <button type="button" onClick={isOutOfStock ? undefined : () => setQty(q => Math.min((product.stock ?? 99), q + 1))}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${isOutOfStock ? 'bg-muted text-white cursor-not-allowed' : 'bg-brand text-white active:scale-90'}`}>
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
          <button type="button" onClick={isOutOfStock ? undefined : handleAdd}
            className={'flex-1 font-extrabold py-3 rounded-2xl transition flex items-center justify-center gap-2 text-sm ' +
              (isOutOfStock ? 'bg-muted text-white cursor-not-allowed' : justAdded ? 'bg-brand text-white' : 'bg-brand-light text-brand')}>
            {isOutOfStock ? 'ناموجود' : justAdded ? <><Check size={18} /> اضافه شد</> : <><ShoppingCart size={18} /> افزودن</>}
          </button>
          <button type="button" onClick={isOutOfStock ? undefined : handleBuyNow}
            className={`flex-1 font-extrabold py-3 rounded-2xl transition text-sm ${isOutOfStock ? 'bg-muted text-white cursor-not-allowed' : 'bg-brand text-white active:scale-[0.98]'}`}>
            {isOutOfStock ? 'ناموجود' : 'خرید سریع'}
          </button>
        </div>
      </div>
    </>
  )
}
