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
  const [justAdded, setJustAdded] = useState(false)
  const [dbg, setDbg] = useState({ clicks: 0, pid: '-', before: 0, after: 0, status: 'wait' })

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
            setDbg(d => ({ ...d, status: 'loaded: ' + data.id }))
          } else {
            setDbg(d => ({ ...d, status: 'no data: ' + (error?.message || '') }))
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
    if (!product) {
      setDbg(d => ({ ...d, clicks: d.clicks + 1, status: 'PRODUCT NULL' }))
      return
    }
    addToCart(product, qty)
    const after = cartCount()
    setCartBadge(after)
    setJustAdded(true)
    setDbg(d => ({
      ...d,
      clicks: d.clicks + 1,
      pid: String(product.id),
      before, after,
      status: after > before ? 'OK ✓' : 'FAIL ✗'
    }))
    toast.success('id=' + product.id + ' | ' + before + ' → ' + after)
    setTimeout(() => setJustAdded(false), 2000)
  }

  if (loading) {
    return (<><Header title="محصول" back /><div className="flex items-center justify-center pt-32"><Loader2 className="animate-spin text-brand" size={32} /></div></>)
  }
  if (!product) {
    return (<><Header title="محصول" back /><div className="text-center pt-24 text-slate-400">محصول یافت نشد</div></>)
  }

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0

  return (
    <>
      {/* کادر قرمز debug — بالای صفحه */}
      <div className="fixed top-14 left-2 right-2 bg-red-600 text-white text-[10px] p-2 rounded-lg z-[100] font-mono leading-4">
        <div>v99 | clicks: {dbg.clicks}</div>
        <div>pid: {dbg.pid}</div>
        <div>before: {dbg.before} → after: {dbg.after}</div>
        <div>status: {dbg.status}</div>
      </div>

      <Header title={product.brand} back search />
      <main className="max-w-lg mx-auto pb-48 fade-up pt-24">
        <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        </div>
        <div className="px-4 pt-4">
          <h1 className="font-bold text-base leading-6 mb-2">{product.title}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-bold text-brand">{formatPrice(product.price)}</span>
          </div>
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium">تعداد</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center"><Minus size={14} /></button>
              <span className="font-bold w-6 text-center">{qty}</span>
              <button type="button" onClick={() => setQty(q => Math.min((product.stock || 99), q + 1))} className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center"><Plus size={14} /></button>
            </div>
          </div>
          <div className="text-center text-xs text-slate-500 mt-4">در سبد شما: <b className="text-brand">{cartBadge}</b> کالا</div>
        </div>
      </main>

      <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-slate-900 border-t p-3 z-50">
        <div className="max-w-lg mx-auto flex gap-2">
          <button
            type="button"
            onPointerDown={() => setDbg(d => ({ ...d, clicks: d.clicks + 100, status: "pointer-down OK" }))} onClick={handleAdd}
            className={'flex-1 font-bold py-3 rounded-xl ' + (justAdded ? 'bg-green-500 text-white' : 'bg-slate-800 text-white')}
          >
            {justAdded ? '✓ اضافه شد' : 'افزودن به سبد'}
          </button>
        </div>
      </div>
    </>
  )
}
