import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { Loader2, TrendingUp, ShoppingBag, Clock, Package } from 'lucide-react'

export default function AdminStats({ orders, products }) {
  const [loading, setLoading] = useState(false)

  if (!orders || !products) return <div className="text-center p-8">در حال دریافت اطلاعات...</div>

  // محاسبات
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const totalRevenue = orders.filter(o => o.status === 'paid' || o.status === 'delivered').reduce((sum, o) => sum + (o.total || 0), 0)
  const activeProducts = products.filter(p => p.active !== false).length

  // پیدا کردن پرفروش‌ترین محصولات
  const productSales = {}
  orders.forEach(o => {
    if (o.status === 'paid' || o.status === 'delivered') {
      let items = o.items || []
      if (typeof items === 'string') try { items = JSON.parse(items) } catch(e) {}
      if (Array.isArray(items)) {
        items.forEach(item => {
          const id = item.id || item.product_id
          if (id) {
            if (!productSales[id]) productSales[id] = { count: 0, title: item.title || item.name, image: item.image || item.image_url }
            productSales[id].count += (item.qty || item.quantity || 1)
          }
        })
      }
    }
  })

  const topProducts = Object.values(productSales).sort((a, b) => b.count - a.count).slice(0, 5)

  return (
    <div className="space-y-4 fade-up">
      {/* کارت‌های آماری */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center">
          <ShoppingBag className="text-blue-500 mb-2" size={24} />
          <span className="text-2xl font-extrabold text-gray-800">{totalOrders}</span>
          <span className="text-[11px] text-gray-500 mt-1">کل سفارش‌ها</span>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center">
          <Clock className="text-orange-500 mb-2" size={24} />
          <span className="text-2xl font-extrabold text-gray-800">{pendingOrders}</span>
          <span className="text-[11px] text-gray-500 mt-1">در انتظار</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center">
          <TrendingUp className="text-green-500 mb-2" size={24} />
          <span className="text-lg font-extrabold text-gray-800">{new Intl.NumberFormat('fa-IR').format(totalRevenue)}</span>
          <span className="text-[11px] text-gray-500 mt-1">درآمد (تومان)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center">
          <Package className="text-purple-500 mb-2" size={24} />
          <span className="text-2xl font-extrabold text-gray-800">{activeProducts}</span>
          <span className="text-[11px] text-gray-500 mt-1">محصولات فعال</span>
        </div>
      </div>

      {/* پرفروش‌ترین‌ها */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-sm mt-4">
        <h3 className="font-extrabold text-sm mb-4">۵ محصول پرفروش</h3>
        {topProducts.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">هنوز فروشی ثبت نشده است.</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                  {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-800 line-clamp-1">{p.title}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{p.count} عدد فروش</div>
                </div>
                <div className="text-xs font-bold text-brand">{i + 1}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
