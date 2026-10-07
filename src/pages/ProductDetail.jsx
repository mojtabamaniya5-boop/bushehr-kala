import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { formatPrice } from '../utils/storage'
import { addToCart, isFavorite, toggleFavorite } from '../utils/cart'
import { Heart, ShoppingCart, Star, Check, Minus, Plus, Loader2 } from 'lucide-react'
import { toast } from '../components/Toast'
import { supabase } from '../utils/supabase'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [fav, setFav] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (mounted) {
        if (error || !data) {
          setProduct(null)
        } else {
          setProduct({
            id: data.id,
            title: data.title,
            category: data.category,
            brand: data.brand,
            price: data.price,
            oldPrice: data.old_price,
            stock: data.stock,
            rating: Number(data.rating),
            image: data.image,
            description: data.description,
            features: data.features || [],
            bestSeller: data.best_seller,
          })
        }
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [id])

  useEffect(() => {
    if (product) setFav(isFavorite(product.id))
  }, [product])

  if (loading) {
    return (
      <>
        <Header title="محصول" back />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="animate-spin text-brand" size={32} />
        </div>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Header title="محصول" back />
        <div className="text-center pt-24 text-slate-400">محصول یافت نشد</div>
      </>
    )
  }

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  const handleAdd = () => {
    alert('دکمه کلیک شد! تعداد: ' + qty)
    try {
      addToCart(product, qty)
      setAdded(true)
      toast.success(qty + ' عدد به سبد اضافه شد')
      setTimeout(() => setAdded(false), 1800)
    } catch (e) {
      console.error('handleAdd error:', e)
      toast.error('خطا در افزودن به سبد')
    }
  }

  const handleBuyNow = () => {
    addToCart(product, qty)
    navigate('/cart')
  }

  return (
    <>
      <Header title={product.brand} back search />
      <main className="max-w-lg mx-auto pb-48 fade-up">
        <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">
              {discount}٪ تخفیف
            </span>
          )}
          <button
            type="button"
            onClick={() => setFav(toggleFavorite(product.id))}
            className="absolute top-3 left-3 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur"
          >
            <Heart size={20} className={fav ? 'fill-brand text-brand' : ''} />
          </button>
        </div>

        <div className="px-4 pt-4">
          <h1 className="font-bold text-base leading-6 mb-2">{product.title}</h1>

          <div className="flex items-center gap-1 mb-3">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold">{product.rating}</span>
            <span className="text-xs text-slate-500">امتیاز کاربران</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-bold text-brand">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs mb-4">
            <span className={'w-2 h-2 rounded-full ' + (product.stock > 0 ? 'bg-green-500' : 'bg-red-500')}></span>
            <span>{product.stock > 0 ? 'موجود در انبار (' + product.stock + ' عدد)' : 'ناموجود'}</span>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-sm mb-2">توضیحات</h3>
            <p className="text-xs leading-6 text-slate-600 dark:text-slate-300">{product.description}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-sm mb-3">ویژگی‌ها</h3>
            <ul className="space-y-2">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <Check size={14} className="text-green-500 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium">تعداد</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center active:scale-90"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold w-6 text-center">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center active:scale-90"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 z-50">
        <div className="max-w-lg mx-auto flex gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className={'flex-1 font-bold py-3 rounded-xl active:scale-[0.98] transition flex items-center justify-center gap-2 ' + (added ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white')}
          >
            {added ? (
              <><Check size={18} /> اضافه شد</>
            ) : (
              <><ShoppingCart size={18} /> افزودن به سبد</>
            )}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 bg-brand text-white font-bold py-3 rounded-xl active:scale-[0.98] transition"
          >
            خرید سریع
          </button>
        </div>
      </div>
    </>
  )
}
