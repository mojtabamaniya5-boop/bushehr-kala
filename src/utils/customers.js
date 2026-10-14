import { supabase } from './supabase'

const TIMEOUT = 8000

function withTimeout(promise, ms = TIMEOUT) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ])
}

/**
 * لیست همه مشتریان از روی سفارش‌ها (aggregate)
 * هر مشتری یه رکورد یکتا با شمارش سفارش و مجموع خرید
 */
export async function fetchAllCustomers() {
  try {
    const { data, error } = await withTimeout(
      supabase.from('orders').select('customer_name, customer_phone, customer_address, total, status, created_at, items')
    )

    if (error || !data) return []

    const customers = new Map()

    data.forEach(o => {
      const phone = o.customer_phone
      if (!phone) return

      if (!customers.has(phone)) {
        customers.set(phone, {
          phone,
          name: o.customer_name || 'بدون نام',
          address: o.customer_address || '',
          ordersCount: 0,
          ordersTotal: 0,
          paidTotal: 0,
          lastOrderDate: o.created_at,
          firstOrderDate: o.created_at,
          statuses: [],
          items: [],
        })
      }

      const c = customers.get(phone)
      c.ordersCount++
      c.ordersTotal += o.total || 0
      if (o.status !== 'canceled' && o.status !== 'pending') {
        c.paidTotal += o.total || 0
      }
      if (new Date(o.created_at) > new Date(c.lastOrderDate)) {
        c.lastOrderDate = o.created_at
      }
      if (new Date(o.created_at) < new Date(c.firstOrderDate)) {
        c.firstOrderDate = o.created_at
      }
      c.statuses.push(o.status)
      if (o.items) c.items.push(...o.items)
    })

    return Array.from(customers.values()).sort(
      (a, b) => new Date(b.lastOrderDate) - new Date(a.lastOrderDate)
    )
  } catch (e) {
    console.warn('fetchAllCustomers:', e.message)
    return []
  }
}
