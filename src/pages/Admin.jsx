import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { formatPrice } from '../utils/storage'
import { toast } from '../components/Toast'
import AdminCustomers from './AdminCustomers'
import { checkAdminSession, updateSessionTimestamp, clearSession, sendPasswordReset, changePassword, isRecoveryMode } from '../utils/admin-auth'
import { ArrowRight, Plus, Edit2, Trash2, LogOut, ShoppingBag, Package, BarChart3, X, Check, Loader2, Upload, Image as ImageIcon, Truck, Hash, ShieldCheck, Users, Mail, KeyRound } from 'lucide-react'

export default function Admin() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState('products')
  const [showCustomers, setShowCustomers] = useState(false)
  const [recovery, setRecovery] = useState(false)

  useEffect(() => {
    if (isRecoveryMode()) setRecovery(true)

    checkAdminSession().then(s => {
      setSession(s)
      setChecking(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s)
      if (s) updateSessionTimestamp()
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
    })

    // هر ۵ دقیقه timestamp رو آپدیت کن
    const t = setInterval(() => {
      if (session) updateSessionTimestamp()
    }, 5 * 60 * 1000)

    return () => {
      listener.subscription.unsubscribe()
      clearInterval(t)
    }
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    )
  }

  if (recovery) return <RecoveryPassword onDone={() => setRecovery(false)} />

  if (!session) return <Login onLogin={() => {}} />

  if (showCustomers) return <AdminCustomers onClose={() => setShowCustomers(false)} />

  return (
    <Dashboard
      user={session.user}
      tab={tab}
      setTab={setTab}
      onShowCustomers={() => setShowCustomers(true)}
      onLogout={async () => {
        clearSession()
        await supabase.auth.signOut()
      }}
    />
  )
}

function RecoveryPassword({ onDone }) {
  const [pass, setPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (pass.length < 8) { toast.error('رمز باید حداقل ۸ کاراکتر باشد'); return }
    if (pass !== confirm) { toast.error('رمزها یکسان نیستند'); return }
    setLoading(true)
    const res = await changePassword(pass)
    setLoading(false)
    if (!res.ok) { toast.error(res.error || 'خطا'); return }
    toast.success('رمز عبور تغییر کرد')
    window.location.hash = '#/admin'
    onDone()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl p-6 border border-border shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
          <div className="w-14 h-14 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-4">
            <KeyRound size={24} className="text-brand" />
          </div>
          <h1 className="font-extrabold text-ink text-lg mb-1 text-center">تعیین رمز جدید</h1>
          <p className="text-xs text-muted mb-5 text-center">رمز جدید رو وارد کن</p>

          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="رمز جدید (حداقل ۸ کاراکتر)"
            className="w-full bg-cream border border-border rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-brand transition text-center mb-2"
            style={{ direction: 'ltr' }}
          />
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="تکرار رمز"
            className="w-full bg-cream border border-border rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-brand transition text-center mb-3"
            style={{ direction: 'ltr' }}
          />

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-brand text-white font-extrabold py-3.5 rounded-2xl active:scale-[0.98] transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="animate-spin" size={16} /> در حال ذخیره...</> : 'ذخیره رمز جدید'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)

  const submit = async () => {
    if (!email.trim() || !pass.trim()) {
      setErr('ایمیل و رمز عبور را وارد کن')
      return
    }
    setLoading(true)
    setErr('')

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    })

    setLoading(false)
    if (error) {
      setErr('ایمیل یا رمز عبور اشتباه است')
      return
    }
    updateSessionTimestamp()
    onLogin()
  }

  const sendReset = async () => {
    if (!email.trim()) {
      setErr('اول ایمیل رو وارد کن')
      return
    }
    setLoading(true)
    const res = await sendPasswordReset(email.trim())
    setLoading(false)
    if (res.ok) {
      setForgotSent(true)
      setErr('')
    } else {
      setErr(res.error || 'خطا در ارسال ایمیل')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 text-muted text-xs mb-6">
          <ArrowRight size={16} /> بازگشت به سایت
        </Link>

        <div className="bg-white rounded-3xl p-6 border border-border shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
          <div className="w-14 h-14 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={24} className="text-brand" />
          </div>

          {!forgotMode ? (
            <>
              <h1 className="font-extrabold text-ink text-lg mb-1 text-center">ورود امن ادمین</h1>
              <p className="text-xs text-muted mb-5 text-center">با حساب Supabase خودت وارد شو</p>

              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErr('') }}
                placeholder="ایمیل"
                autoComplete="email"
                className="w-full bg-cream border border-border rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-brand transition text-center mb-2"
                style={{ direction: 'ltr' }}
              />

              <input
                type="password"
                value={pass}
                onChange={e => { setPass(e.target.value); setErr('') }}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="رمز عبور"
                autoComplete="current-password"
                className="w-full bg-cream border border-border rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-brand transition text-center mb-2"
                style={{ direction: 'ltr' }}
              />

              {err && <p className="text-[10px] text-danger mb-3 text-center">{err}</p>}

              <button
                onClick={submit}
                disabled={loading}
                className="w-full bg-brand text-white font-extrabold py-3.5 rounded-2xl active:scale-[0.98] transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="animate-spin" size={16} /> در حال ورود...</> : 'ورود امن'}
              </button>

              <button
                onClick={() => { setForgotMode(true); setErr('') }}
                className="w-full text-center text-[11px] text-muted font-bold mt-4 underline"
              >
                رمز عبور را فراموش کرده‌ام
              </button>
            </>
          ) : (
            <>
              <h1 className="font-extrabold text-ink text-lg mb-1 text-center">فراموشی رمز</h1>
              <p className="text-xs text-muted mb-5 text-center leading-6">
                ایمیل خودت رو وارد کن، لینک بازیابی برات ارسال میشه
              </p>

              {forgotSent ? (
                <div className="bg-brand-light/40 rounded-2xl p-4 border border-brand/20 mb-4 text-center">
                  <Mail size={32} className="text-brand mx-auto mb-2" />
                  <p className="text-xs text-ink font-bold mb-1">ایمیل ارسال شد!</p>
                  <p className="text-[10px] text-muted leading-5">
                    صندوق ایمیلت رو چک کن و روی لینک بازیابی بزن
                  </p>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErr('') }}
                    placeholder="ایمیل"
                    className="w-full bg-cream border border-border rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-brand transition text-center mb-2"
                    style={{ direction: 'ltr' }}
                  />
                  {err && <p className="text-[10px] text-danger mb-3 text-center">{err}</p>}
                  <button
                    onClick={sendReset}
                    disabled={loading}
                    className="w-full bg-brand text-white font-extrabold py-3.5 rounded-2xl active:scale-[0.98] transition disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? <><Loader2 className="animate-spin" size={16} /> در حال ارسال...</> : <><Mail size={16} /> ارسال لینک بازیابی</>}
                  </button>
                </>
              )}

              <button
                onClick={() => { setForgotMode(false); setForgotSent(false); setErr('') }}
                className="w-full text-center text-[11px] text-muted font-bold mt-4"
              >
                ← بازگشت به ورود
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Dashboard({ user, tab, setTab, onShowCustomers, onLogout }) {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [statusModal, setStatusModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

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

  const handleDelete = async () => {
    if (!deleteTarget) return
    const { error } = await supabase.from('products').delete().eq('id', deleteTarget)
    if (error) { toast.error('خطا: ' + error.message); return }
    toast.success('حذف شد')
    setDeleteTarget(null)
    load()
  }

  const handleStatusChange = async (orderId, newStatus, trackingCode = null, shippingMethod = null) => {
    const updates = { status: newStatus }

    if (newStatus === 'pending' || newStatus === 'paid' || newStatus === 'canceled') {
      updates.tracking_code = null
      updates.shipping_method = null
    } else {
      if (trackingCode !== null) updates.tracking_code = trackingCode
      if (shippingMethod !== null) updates.shipping_method = shippingMethod
    }

    const { error } = await supabase.from('orders').update(updates).eq('id', orderId)
    if (error) { toast.error('خطا: ' + error.message); return false }
    toast.success('وضعیت تغییر کرد')
    load()
    return true
  }

  const stats = {
    products: products.length,
    orders: orders.length,
    revenue: orders.filter(o => o.status !== 'canceled').reduce((s, o) => s + (o.total || 0), 0),
    pending: orders.filter(o => o.status === 'pending').length,
  }

  const STATUS_MAP = {
    pending: { label: 'در انتظار', color: 'bg-accent' },
    paid: { label: 'پرداخت شده', color: 'bg-brand' },
    sent: { label: 'ارسال شده', color: 'bg-blue-500' },
    done: { label: 'تحویل شده', color: 'bg-muted' },
    canceled: { label: 'لغو شده', color: 'bg-danger' },
  }

  return (
    <div className="min-h-screen bg-cream text-ink pb-20">
      <div className="sticky top-0 bg-white border-b border-border p-3 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white font-extrabold text-sm">ب</div>
            <div>
              <div className="font-extrabold text-sm">پنل مدیریت</div>
              <div className="text-[10px] text-muted truncate max-w-[140px]" style={{ direction: 'ltr', textAlign: 'right' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onShowCustomers}
              className="p-2 rounded-xl bg-brand-light text-brand active:scale-95" title="مشتریان">
              <Users size={16} />
            </button>
            <button onClick={onLogout} className="p-2 rounded-xl bg-cream text-muted active:scale-95">
              <LogOut size={16} />
            </button>
          </div>
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
            <button onClick={() => setEditing({})} className="w-full bg-brand text-white font-extrabold py-3.5 rounded-2xl mb-4 flex items-center justify-center gap-2 active:scale-[0.98] transition">
              <Plus size={18} /> افزودن محصول جدید
            </button>
            <div className="space-y-2">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-2xl p-3 flex items-center gap-3 border border-border">
                  <img src={p.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-cream" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">{p.title}</div>
                    <div className="text-[10px] text-muted mt-0.5">{formatPrice(p.price)} • موجودی: {p.stock}</div>
                  </div>
                  <button onClick={() => setEditing(p)} className="p-2 rounded-xl bg-cream active:scale-95">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(p.id)} className="p-2 rounded-xl bg-danger/10 text-danger active:scale-95">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && tab === 'orders' && (
          <div className="space-y-2">
            {orders.length === 0 && <div className="text-center text-muted py-10 text-sm">سفارشی نیست</div>}
            {orders.map(o => (
              <div key={o.id} className="bg-white rounded-2xl p-4 border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-xs font-extrabold">{o.customer_name}</div>
                    <div className="text-[10px] text-muted">{o.customer_phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-brand">{formatPrice(o.total)}</div>
                    <div className="text-[10px] text-muted font-mono">{o.code}</div>
                  </div>
                </div>
                <div className="text-[10px] text-muted mb-3 truncate">{o.customer_address}</div>

                {o.tracking_code && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-2 mb-3 flex items-center gap-2">
                    <Truck size={12} className="text-blue-600 flex-shrink-0" />
                    <span className="text-[10px] font-bold text-blue-600">کد رهگیری: {o.tracking_code}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {Object.entries(STATUS_MAP).map(([key, val]) => (
                    <button key={key}
                      onClick={() => {
                        if (key === 'sent') {
                          setStatusModal({ orderId: o.id, existingCode: o.tracking_code || '', existingMethod: o.shipping_method || 'post' })
                        } else {
                          handleStatusChange(o.id, key)
                        }
                      }}
                      className={'text-[10px] px-2.5 py-1.5 rounded-full font-bold transition ' +
                        (o.status === key ? val.color + ' text-white' : 'bg-cream text-muted')}>
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
            <div className="bg-white rounded-2xl p-4 border border-border">
              <div className="text-xs text-muted mb-1">مجموع فروش (بدون لغو)</div>
              <div className="text-2xl font-extrabold text-brand">{formatPrice(stats.revenue)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(STATUS_MAP).map(([key, val]) => {
                const count = orders.filter(o => o.status === key).length
                return (
                  <div key={key} className="bg-white rounded-2xl p-3 border border-border">
                    <div className={'w-2 h-2 rounded-full ' + val.color + ' mb-1.5'}></div>
                    <div className="text-lg font-extrabold">{count}</div>
                    <div className="text-[10px] text-muted">{val.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {editing && <ProductForm product={editing} onClose={() => { setEditing(null); load() }} />}
      {statusModal && (
        <TrackingModal
          data={statusModal}
          onClose={() => setStatusModal(null)}
          onSave={async (code, method) => {
            const ok = await handleStatusChange(statusModal.orderId, 'sent', code, method)
            if (ok) setStatusModal(null)
          }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

function DeleteModal({ onCancel, onConfirm }) {
  const [deleting, setDeleting] = useState(false)
  const handle = async () => {
    setDeleting(true)
    await onConfirm()
    setDeleting(false)
  }
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-5 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative h-24 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)' }}>
          <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-white/10"></div>
          <div className="relative w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/40">
            <Trash2 size={24} className="text-white" />
          </div>
        </div>
        <div className="p-5 text-center">
          <h3 className="font-extrabold text-base text-ink mb-2">حذف محصول</h3>
          <p className="text-xs text-muted leading-6">مطمئنی؟ این کار قابل بازگشت نیست.</p>
        </div>
        <div className="p-4 pt-0 flex gap-2">
          <button onClick={onCancel} className="flex-1 bg-cream border border-border text-ink font-bold py-3 rounded-2xl active:scale-[0.98] text-xs">
            انصراف
          </button>
          <button onClick={handle} disabled={deleting}
            className="flex-1 bg-danger text-white font-extrabold py-3 rounded-2xl active:scale-[0.98] text-xs disabled:opacity-60 flex items-center justify-center gap-1.5">
            {deleting ? <Loader2 className="animate-spin" size={14} /> : 'بله، حذف کن'}
          </button>
        </div>
      </div>
    </div>
  )
}

function TrackingModal({ data, onClose, onSave }) {
  const [code, setCode] = useState(data.existingCode)
  const [method, setMethod] = useState(data.existingMethod)
  const [saving, setSaving] = useState(false)

  const handle = async () => {
    const cleanCode = code.trim()
    if (!cleanCode) { toast.error('کد رهگیری پستی رو وارد کن'); return }
    if (cleanCode.length < 10 || !/^[A-Z0-9]+$/i.test(cleanCode)) {
      toast.error('کد رهگیری حداقل ۱۰ کاراکتر و شامل حروف و اعداد')
      return
    }
    setSaving(true)
    await onSave(cleanCode, method)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-5 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative h-20 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)' }}>
          <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-white/10"></div>
          <div className="relative w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/40">
            <Truck size={24} className="text-white" />
          </div>
          <button onClick={onClose}
            className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center active:scale-90">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <h3 className="font-extrabold text-base text-ink text-center mb-3">اطلاعات ارسال</h3>

          <div>
            <label className="text-[10px] font-bold text-muted block mb-1.5 flex items-center gap-1">
              <Hash size={11} className="text-blue-600" />
              کد رهگیری پستی
            </label>
            <input value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="حداقل ۱۰ کاراکتر"
              className="w-full bg-cream border border-border rounded-2xl px-3.5 py-3 text-sm outline-none focus:border-brand transition font-mono"
              style={{ direction: 'ltr', textAlign: 'center' }} />
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted block mb-1.5">روش ارسال</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setMethod('post')}
                className={'p-3 rounded-2xl border transition text-center ' +
                  (method === 'post' ? 'border-brand bg-brand-light/40' : 'border-border')}>
                <div className="text-xs font-bold">📮 پست</div>
              </button>
              <button onClick={() => setMethod('tipax')}
                className={'p-3 rounded-2xl border transition text-center ' +
                  (method === 'tipax' ? 'border-brand bg-brand-light/40' : 'border-border')}>
                <div className="text-xs font-bold">🚚 تیپاکس</div>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 pt-0 flex gap-2">
          <button onClick={onClose}
            className="flex-1 bg-cream border border-border text-ink font-bold py-3 rounded-2xl active:scale-[0.98] text-xs">
            انصراف
          </button>
          <button onClick={handle} disabled={saving}
            className="flex-1 bg-brand text-white font-extrabold py-3 rounded-2xl active:scale-[0.98] text-xs disabled:opacity-60 flex items-center justify-center gap-1.5">
            {saving ? <Loader2 className="animate-spin" size={14} /> : <><Check size={14} /> ثبت کد و ارسال</>}
          </button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, small }) {
  return (
    <div className="bg-white rounded-2xl p-3 border border-border text-center">
      <div className={'font-extrabold ' + (small ? 'text-[10px]' : 'text-lg')}>{value}</div>
      <div className="text-[10px] text-muted mt-0.5">{label}</div>
    </div>
  )
}

function TabBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick}
      className={'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold transition ' +
        (active ? 'bg-brand text-white shadow-md' : 'bg-white text-muted border border-border')}>
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
    category: product.category || 'cucumber',
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
    if (file.size > 5 * 1024 * 1024) { toast.error('حجم عکس باید کمتر از ۵ مگابایت باشد'); return }
    setUploading(true)
    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `product-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(fileName, file, { contentType: file.type, upsert: false })
    if (error) { setUploading(false); toast.error('خطا در آپلود: ' + error.message); return }
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
      title: form.title, category: form.category, brand: form.brand,
      price: Number(form.price), old_price: form.old_price ? Number(form.old_price) : null,
      stock: Number(form.stock) || 0, image: form.image || '',
      description: form.description,
      features: form.features.split(',').map(s => s.trim()).filter(Boolean),
      best_seller: form.best_seller, active: form.active,
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between z-10">
          <h3 className="font-extrabold text-sm">{isNew ? 'محصول جدید' : 'ویرایش محصول'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl bg-cream"><X size={16} /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-[10px] font-bold text-muted block mb-2">تصویر محصول</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-2xl bg-cream border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                {form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-muted" />}
              </div>
              <div className="flex-1 space-y-2">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="w-full bg-cream border border-border text-ink text-xs font-bold py-2.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploading ? 'در حال آپلود...' : 'آپلود عکس'}
                </button>
                <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="یا لینک عکس"
                  className="w-full bg-cream border border-border rounded-2xl px-3 py-2 text-[10px] outline-none focus:border-brand" />
              </div>
            </div>
          </div>

          <Field label="نام محصول" value={form.title} onChange={v => setForm({ ...form, title: v })} />
          <Field label="برند" value={form.brand} onChange={v => setForm({ ...form, brand: v })} />
          <Field label="دسته" value={form.category} onChange={v => setForm({ ...form, category: v })} hint="cucumber / mixed / olive / garlic / vegetables / salads / special / other" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="قیمت (تومان)" value={form.price} onChange={v => setForm({ ...form, price: v })} type="number" />
            <Field label="قیمت قبل" value={form.old_price} onChange={v => setForm({ ...form, old_price: v })} type="number" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="موجودی" value={form.stock} onChange={v => setForm({ ...form, stock: v })} type="number" />
            <div className="flex items-end gap-3 pb-2">
              <label className="flex items-center gap-1.5 text-xs">
                <input type="checkbox" checked={form.best_seller} onChange={e => setForm({ ...form, best_seller: e.target.checked })} />
                پرفروش
              </label>
              <label className="flex items-center gap-1.5 text-xs">
                <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
                فعال
              </label>
            </div>
          </div>
          <Field label="توضیحات" value={form.description} onChange={v => setForm({ ...form, description: v })} textarea />
          <Field label="ویژگی‌ها" value={form.features} onChange={v => setForm({ ...form, features: v })} hint="با کاما جدا کن" />
          <button onClick={save} disabled={saving}
            className="w-full bg-brand text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60">
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
      <label className="text-[10px] font-bold text-muted block mb-1.5">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
          className="w-full bg-cream border border-border rounded-2xl px-3.5 py-3 text-sm outline-none focus:border-brand resize-none transition" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          className="w-full bg-cream border border-border rounded-2xl px-3.5 py-3 text-sm outline-none focus:border-brand transition" />
      )}
      {hint && <p className="text-[9px] text-muted mt-1">{hint}</p>}
    </div>
  )
}
