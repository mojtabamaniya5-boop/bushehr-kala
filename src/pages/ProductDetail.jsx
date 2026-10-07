import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { formatPrice } from '../utils/storage'
import { addToCart, isFavorite, toggleFavorite, cartCount } from '../utils/cart'
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
  const [cartBadge, setCartBadge] = useState(cartCount())
  const [dbg, setDbg] = useState({ clicks: 0, status: 'wait' })

  useEffect(() => {
    let mounted = true
    supabase.from('products').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (mounted) {
          if (data) {
            setProduct({
              id: data.id, title: data.title, category: data.category,
              brand: data.brand, price: data.price, oldPrice: data.old_price,
              stock: data.stock, rating: Number(data.rating), image: data.image,
              description: data.description, features: data.features || [],
              bestSeller: data.best_seller,
            })
            setDbg({ clicks: 0, status: 'loaded: ' + data.id })
          }
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [id])

  useEffect(() => {
    if (product) setFav(isFavorite(product.id))
  }, [product])

  const handleAdd = () => {
    const before = cartCount()
    addToCart(product, qty)
    const after = cartCount()
    setCartBadge(after)
    setDbg({ clicks: dbg.clicks + 1, status: 'before=' + before + ' after=' + after })
    toast.success('سبد: ' + before + ' → ' + after)
  }

  if (loading) return (<><Header title="محصول" back /><div className="flex items-center justify-center pt-32"><Loader2 className="animate-spin text-brand" size={32} /></div></>)
  if (!product) return (<><Header title="محصول" back /><div className="text-center pt-24 text-slate-400">محصول یافت نشد</div></>)

  return (
    <>
      <Header title={product.brand} back search />
      <main className="max-w-lg mx-auto pb-24 fade-up">
        <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        </div>

        <div className="px-4 pt-4">
          <h1 className="font-bold text-base leading-6 mb-2">{product.title}</h1>
          <div className="text-xl font-bold text-brand mb-4">{formatPrice(product.price)}</div>

          {/* کادر debug کوچیک */}
          <div className="bg-red-600 text-white text-[10px] p-2 rounded-lg mb-4 font-mono leading-4">
            clicks: {dbg.clicks} | {dbg.status}
          </div>

          {/* تعداد */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
            <span className="text-sm font-medium">تعداد</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <Minus size={14} />
              </button>
              <span className="font-bold w-6 text-center">{qty}</span>
              <button type="button" onClick={() => setQty(q => Math.min((product.stock || 99), q + 1))} className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center">
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 mb-4">
            در سبد شما: <b className="text-brand">{cartBadge}</b> کالا
          </div>

          {/* دکمه افزودن — داخل محتوا (نه fixed) */}
          <button
            type="button"
            onClick={handleAdd}
            className="w-full bg-brand text-white font-bold py-4 rounded-xl active:scale-[0.98] transition flex items-center justify-center gap-2 mb-3"
          >
            <ShoppingCart size={18} />
            افزودن به سبد خرید
          </button>

          <button
            type="button"
            onClick={() => { addToCart(product, qty); navigate('/cart') }}
            className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl active:scale-[0.98] transition"
          >
            خرید سریع
          </button>
        </div>
      </main>
    </>
  )
}
