import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { formatPrice } from '../utils/storage'
import { toast } from '../components/Toast'
import { ArrowRight, Plus, Edit2, Trash2, LogOut, ShoppingBag, Package, BarChart3, X, Check, Loader2, Upload, Image as ImageIcon } from 'lucide-react'

const ADMIN_PASSWORD = 'bushehr1405'

export default function Admin() {
  const [authed, setAuthed] = useState(localStorage.getItem('bk-admin') === '1')
  if (!authed) return <Login onLogin={() => setAuthed(true)} />
  return <Dashboard onLogout={() => { localStorage.removeItem('bk-admin'); setAuthed(false) }} />
}

function Login({ onLogin }) {
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const submit = () => {
    if (pass === ADMIN_PASSWORD) {
      localStorage.setItem('bk-admin', '1')
      onLogin()
    } else setErr('رمز اشتباه است')
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 text-slate-400 text-xs mb-6">
          <ArrowRight size={16} /> بازگشت به سایت
        </Link>
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h1 className="font-bold text-white text-lg mb-1">پنل مدیریت</h1>
          <p className="text-xs text-slate-400 mb-5">رمز عبور را وارد کن</p>
          <input type="password" value={pass}
            onChange={e => { setPass(e.target.value); setErr('') }}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="رمز عبور" autoFocus
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-white text-sm outline-none focus:border-brand mb-2" />
          {err && <p className="text-[10px] text-red-400 mb-3">{err}</p>}
          <button onClick={submit} className="w-full bg-brand text-white font-bold py-3 rounded-xl active:scale-[0.98]">ورود</button>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  const load = async () => {
    setLoading(true)
    const [{ data: p }, { data: o }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(100),
    ])
    setProducts(p || [])
    setOrders(o || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('محصول حذف شود؟')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { toast.error('خطا: ' + error.message); return }
    toast.success('حذف شد')
    load()
  }

  const handleStatusChange = async (orderId, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    if (error) { toast.error('خطا: ' + error.message); return }
    toast.success('وضعیت تغییر کرد')
    load()
  }

  const stats = {
    products: products.length,
    orders: orders.length,
    revenue: orders.filter(o => o.status !== 'canceled').reduce((s, o) => s + (o.total || 0), 0),
    pending: orders.filter(o => o.status === 'pending').length,
  }

  const STATUS_MAP = {
    pending: { label: 'در انتظار', color: 'bg-amber-500' },
    paid: { label: 'پرداخت شده', color: 'bg-green-500' },
    sent: { label: 'ارسال شده', color: 'bg-blue-500' },
    done: { label: 'تحویل شده', color: 'bg-slate-500' },
    canceled: { label: 'لغو شده', color: 'bg-red-500' },
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-3 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-sm">ب</div>
            <div>
              <div className="font-bold text-sm">پنل مدیریت</div>
              <div className="text-[10px] text-slate-400">کافه ترشی</div>
            </div>
          </div>
          <button onClick={onLogout} className="p-2 rounded-lg bg-slate-700 text-slate-300 active:scale-95"><LogOut size={16} /></button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-3">
        <div className="grid grid-cols-4 gap-2 mb-4">
          <Stat label="محصول" value={stats.products} />
          <Stat label="سفارش" value={stats.orders} />
          <Stat label="در انتظار" value={stats.pending} />
          <Stat label="فروش" value={formatPrice(stats.revenue).replace(' تومان', '')} small />
        </div>

        <div className="flex gap-2 mb-4">
          <TabBtn active={tab === 'products'} onClick={() => setTab('products')} icon={Package} label="محصولات" />
          <TabBtn active={tab === 'orders'} onClick={() => setTab('orders')} icon={ShoppingBag} label="سفارش‌ها" />
          <TabBtn active={tab === 'stats'} onClick={() => setTab('stats')} icon={BarChart3} label="آمار" />
        </div>

        {loading && <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand" size={24} /></div>}

        {!loading && tab === 'products' && (
          <>
            <button onClick={() => setEditing({})} className="w-full bg-brand text-white font-bold py-3 rounded-xl mb-4 flex items-center justify-center gap-2 active:scale-[0.98]">
              <Plus size={18} /> افزودن محصول جدید
            </button>
            <div className="space-y-2">
              {products.map(p => (
                <div key={p.id} className="bg-slate-800 rounded-xl p-3 flex items-center gap-3 border border-slate-700">
                  <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-700" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{p.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{formatPrice(p.price)} • موجودی: {p.stock}</div>
                  </div>
                  <button onClick={() => setEditing(p)} className="p-2 rounded-lg bg-slate-700 active:scale-95"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 active:scale-95"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && tab === 'orders' && (
          <div className="space-y-2">
            {orders.length === 0 && <div className="text-center text-slate-500 py-10 text-sm">سفارشی نیست</div>}
            {orders.map(o => (
              <div key={o.id} className="bg-slate-800 rounded-xl p-3 border border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-xs font-bold">{o.customer_name}</div>
                    <div className="text-[10px] text-slate-400">{o.customer_phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-brand">{formatPrice(o.total)}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{o.code}</div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 mb-2 truncate">{o.customer_address}</div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(STATUS_MAP).map(([key, val]) => (
                    <button key={key} onClick={() => handleStatusChange(o.id, key)}
                      className={'text-[10px] px-2 py-1 rounded-full ' + (o.status === key ? val.color + ' text-white' : 'bg-slate-700 text-slate-300')}>
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'stats' && (
          <div className="space-y-3">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">مجموع فروش (بدون لغو)</div>
              <div className="text-2xl font-bold text-brand">{formatPrice(stats.revenue)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(STATUS_MAP).map(([key, val]) => {
                const count = orders.filter(o => o.status === key).length
                return (
                  <div key={key} className="bg-slate-800 rounded-xl p-3 border border-slate-700">
                    <div className={'w-2 h-2 rounded-full ' + val.color + ' mb-1'}></div>
                    <div className="text-lg font-bold">{count}</div>
                    <div className="text-[10px] text-slate-400">{val.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {editing && <ProductForm product={editing} onClose={() => { setEditing(null); load() }} />}
    </div>
  )
}

function Stat({ label, value, small }) {
  return (
    <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 text-center">
      <div className={'font-bold ' + (small ? 'text-xs' : 'text-lg')}>{value}</div>
      <div className="text-[10px] text-slate-400 mt-0.5">{label}</div>
    </div>
  )
}

function TabBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick}
      className={'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition ' + (active ? 'bg-brand text-white' : 'bg-slate-800 text-slate-400')}>
      <Icon size={14} /> {label}
    </button>
  )
}

function ProductForm({ product, onClose }) {
  const isNew = !product.id
  const fileRef = useRef(null)
  const [form, setForm] = useState({
    id: product.id || '',
    title: product.title || '',
    category: product.category || 'headphone',
    brand: product.brand || '',
    price: product.price || 0,
    old_price: product.old_price || '',
    stock: product.stock || 0,
    image: product.image || '',
    description: product.description || '',
    features: (product.features || []).join(', '),
    best_seller: product.best_seller || false,
    active: product.active !== false,
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم عکس باید کمتر از ۵ مگابایت باشد')
      return
    }
    setUploading(true)
    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `product-${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { contentType: file.type, upsert: false })
    if (error) {
      setUploading(false)
      toast.error('خطا در آپلود: ' + error.message)
      return
    }
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName)
    setForm(f => ({ ...f, image: urlData.publicUrl }))
    setUploading(false)
    toast.success('عکس آپلود شد')
  }

  const save = async () => {
    if (!form.title || !form.price) { toast.error('نام و قیمت الزامی است'); return }
    setSaving(true)
    const payload = {
      id: form.id || 'p' + Date.now(),
      title: form.title,
      category: form.category,
      brand: form.brand,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      stock: Number(form.stock) || 0,
      image: form.image || 'https://placehold.co/400x400/DC2626/ffffff?text=Product',
      description: form.description,
      features: form.features.split(',').map(s => s.trim()).filter(Boolean),
      best_seller: form.best_seller,
      active: form.active,
    }
    const { error } = isNew
      ? await supabase.from('products').insert(payload)
      : await supabase.from('products').update(payload).eq('id', form.id)
    setSaving(false)
    if (error) { toast.error('خطا: ' + error.message); return }
    toast.success(isNew ? 'محصول اضافه شد' : 'ذخیره شد')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-end sm:items-center justify-center p-3">
      <div className="bg-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-3 flex items-center justify-between z-10">
          <h3 className="font-bold text-sm">{isNew ? 'محصول جدید' : 'ویرایش محصول'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-700"><X size={16} /></button>
        </div>
        <div className="p-4 space-y-3">

          {/* عکس */}
          <div>
            <label className="text-[10px] text-slate-400 block mb-2">تصویر محصول</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                {form.image ? (
                  <img src={form.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} className="text-slate-600" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="w-full bg-slate-700 text-white text-xs font-medium py-2 rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploading ? 'در حال آپلود...' : 'آپلود عکس از گوشی'}
                </button>
                <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="یا لینک عکس را بچسبان"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none focus:border-brand" />
              </div>
            </div>
          </div>

          <Field label="نام محصول" value={form.title} onChange={v => setForm({ ...form, title: v })} />
          <Field label="برند" value={form.brand} onChange={v => setForm({ ...form, brand: v })} />
          <Field label="دسته" value={form.category} onChange={v => setForm({ ...form, category: v })} hint="headphone / charger / powerbank / cable / mouse / hub / case / holder" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="قیمت" value={form.price} onChange={v => setForm({ ...form, price: v })} type="number" />
            <Field label="قیمت قبل" value={form.old_price} onChange={v => setForm({ ...form, old_price: v })} type="number" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="موجودی" value={form.stock} onChange={v => setForm({ ...form, stock: v })} type="number" />
            <div className="flex items-end gap-3">
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={form.best_seller} onChange={e => setForm({ ...form, best_seller: e.target.checked })} /> پرفروش
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> فعال
              </label>
            </div>
          </div>
          <Field label="توضیحات" value={form.description} onChange={v => setForm({ ...form, description: v })} textarea />
          <Field label="ویژگی‌ها" value={form.features} onChange={v => setForm({ ...form, features: v })} hint="با کاما جدا کن" />
          <button onClick={save} disabled={saving} className="w-full bg-brand text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> ذخیره</>}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', textarea, hint }) {
  return (
    <div>
      <label className="text-[10px] text-slate-400 block mb-1">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-brand resize-none" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-brand" />
      )}
      {hint && <p className="text-[9px] text-slate-500 mt-1">{hint}</p>}
    </div>
  )
}
