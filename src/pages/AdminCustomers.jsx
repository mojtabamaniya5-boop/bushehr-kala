import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { formatPrice, formatDate } from '../utils/storage'
import { fetchAllCustomers } from '../utils/customers'
import { Loader2, Users, Phone, MapPin, X, Search, TrendingUp, Crown, User } from 'lucide-react'

export default function AdminCustomers({ onClose }) {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchAllCustomers().then(data => {
      setCustomers(data)
      setLoading(false)
    })
  }, [])

  const filtered = search.trim()
    ? customers.filter(c =>
        c.phone.includes(search.replace(/\D/g, '')) ||
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : customers

  const stats = {
    total: customers.length,
    vip: customers.filter(c => c.paidTotal >= 1000000).length,
    newThisMonth: customers.filter(c => {
      const d = new Date(c.firstOrderDate)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length,
    totalRevenue: customers.reduce((s, c) => s + c.paidTotal, 0),
  }

  return (
    <div className="fixed inset-0 z-[150] bg-cream overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-border p-3 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white">
              <Users size={18} />
            </div>
            <div>
              <div className="font-extrabold text-sm">لیست مشتریان</div>
              <div className="text-[10px] text-muted">CRM سبک</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-cream active:scale-95">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-3 pb-20">
        {/* آمار */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-white rounded-2xl p-3 border border-border text-center">
            <div className="text-lg font-extrabold text-brand">{stats.total}</div>
            <div className="text-[10px] text-muted mt-0.5">مشتری</div>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-border text-center">
            <div className="text-lg font-extrabold text-accent">{stats.vip}</div>
            <div className="text-[10px] text-muted mt-0.5">VIP</div>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-border text-center">
            <div className="text-lg font-extrabold">{stats.newThisMonth}</div>
            <div className="text-[10px] text-muted mt-0.5">جدید</div>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-border text-center">
            <div className="text-[10px] font-extrabold text-brand">{formatPrice(stats.totalRevenue).replace(' تومان', '')}</div>
            <div className="text-[10px] text-muted mt-0.5">درآمد</div>
          </div>
        </div>

        {/* جستجو */}
        <div className="relative mb-3">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="جستجو با نام یا شماره موبایل..."
            className="w-full bg-white border border-border rounded-2xl py-3 pr-10 pl-4 text-sm outline-none focus:border-brand transition"
          />
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-brand" size={28} />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <User size={48} className="text-muted mx-auto mb-3" />
            <p className="text-sm font-bold text-muted">مشتری‌ای پیدا نشد</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-2">
            {filtered.map(c => {
              const isVip = c.paidTotal >= 1000000
              return (
                <button key={c.phone}
                  onClick={() => setSelected(c)}
                  className="w-full bg-white rounded-2xl p-4 border border-border flex items-center gap-3 active:scale-[0.99] transition text-right">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${isVip ? 'bg-accent/20' : 'bg-brand-light'}`}>
                    {isVip ? <Crown size={20} className="text-accent" /> : <User size={20} className="text-brand" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold truncate">{c.name}</span>
                      {isVip && <span className="text-[8px] bg-accent text-white px-1.5 py-0.5 rounded-full font-bold">VIP</span>}
                    </div>
                    <div className="text-[10px] text-muted font-mono mt-0.5" style={{ direction: 'ltr', textAlign: 'right' }}>
                      {c.phone}
                    </div>
                  </div>
                  <div className="text-left flex-shrink-0">
                    <div className="text-[10px] font-extrabold text-brand">{formatPrice(c.paidTotal)}</div>
                    <div className="text-[10px] text-muted mt-0.5">{c.ordersCount} سفارش</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* جزئیات مشتری */}
      {selected && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 p-4 flex items-center justify-between border-b border-border bg-white"
              style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #185C28 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/40">
                  <User size={22} className="text-white" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-sm">{selected.name}</div>
                  <div className="text-[10px] text-white/80 font-mono" style={{ direction: 'ltr', textAlign: 'right' }}>
                    {selected.phone}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center active:scale-90">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* آمار مشتری */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-cream rounded-2xl p-3 text-center">
                  <div className="text-base font-extrabold text-brand">{selected.ordersCount}</div>
                  <div className="text-[10px] text-muted">سفارش</div>
                </div>
                <div className="bg-cream rounded-2xl p-3 text-center">
                  <div className="text-[10px] font-extrabold text-brand">
                    {formatPrice(selected.ordersTotal).replace(' تومان', '')}
                  </div>
                  <div className="text-[10px] text-muted">کل خرید</div>
                </div>
                <div className="bg-cream rounded-2xl p-3 text-center">
                  <div className="text-[10px] font-extrabold text-green-600">
                    {formatPrice(selected.paidTotal).replace(' تومان', '')}
                  </div>
                  <div className="text-[10px] text-muted">پرداخت شده</div>
                </div>
              </div>

              {/* تماس */}
              <div className="bg-white border border-border rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-muted">
                  <Phone size={12} className="text-brand" />
                  راه‌های تماس
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${selected.phone}`}
                    className="flex-1 bg-brand text-white font-bold py-2.5 rounded-xl text-center text-xs active:scale-95">
                    📞 تماس
                  </a>
                  <a href={`sms:${selected.phone}`}
                    className="flex-1 bg-brand-light text-brand font-bold py-2.5 rounded-xl text-center text-xs active:scale-95">
                    💬 پیامک
                  </a>
                  <a href={`https://wa.me/98${selected.phone.replace(/^0/, '')}`} target="_blank" rel="noreferrer"
                    className="flex-1 bg-green-500 text-white font-bold py-2.5 rounded-xl text-center text-xs active:scale-95">
                    واتساپ
                  </a>
                </div>
              </div>

              {/* آدرس */}
              {selected.address && (
                <div className="bg-white border border-border rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-muted">
                    <MapPin size={12} className="text-brand" />
                    آخرین آدرس
                  </div>
                  <p className="text-xs leading-6">{selected.address}</p>
                </div>
              )}

              {/* تاریخ‌ها */}
              <div className="bg-white border border-border rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">اولین خرید</span>
                  <span className="font-bold">{formatDate(selected.firstOrderDate)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">آخرین خرید</span>
                  <span className="font-bold">{formatDate(selected.lastOrderDate)}</span>
                </div>
              </div>

              <button onClick={() => setSelected(null)}
                className="w-full bg-cream border border-border text-ink font-bold py-3 rounded-2xl active:scale-[0.98] text-xs">
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
