import { supabase } from './supabase'

const TIMEOUT = 8000

function withTimeout(promise, ms = TIMEOUT) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ])
}

export async function fetchUserOrders(phone) {
  if (!phone) return []

  let dbOrders = []
  try {
    const { data, error } = await withTimeout(
      supabase.from('orders').select('*')
        .eq('customer_phone', phone)
        .order('created_at', { ascending: false })
    )
    if (!error && data) {
      dbOrders = data.map(o => ({
        id: o.code || o.id,
        date: o.created_at,
        total: o.total, subtotal: o.subtotal, shipping: o.shipping,
        status: o.status, items: o.items || [],
        customer: { name: o.customer_name, phone: o.customer_phone, address: o.customer_address },
        paymentRef: o.payment_ref,
        source: 'db',
      }))
    }
  } catch (e) {
    console.warn('fetchUserOrders DB error:', e.message)
  }

  let lsOrders = []
  try {
    lsOrders = (JSON.parse(localStorage.getItem('bk-orders') || '[]'))
      .filter(o => o.customer?.phone === phone)
      .map(o => ({ ...o, source: 'local' }))
  } catch (e) { console.warn('LS parse error:', e) }

  const merged = [...dbOrders, ...lsOrders.filter(lo => !dbOrders.find(o => o.id === lo.id))]
  return merged.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export async function fetchOrderById(id) {
  if (!id) return null
  const q = id.toUpperCase().replace('#', '')

  try {
    const { data, error } = await withTimeout(
      supabase.from('orders').select('*')
        .or(`code.eq.${q},id.eq.${q}`)
        .limit(1).maybeSingle()
    )
    if (!error && data) {
      return {
        id: data.code || data.id,
        date: data.created_at,
        total: data.total, subtotal: data.subtotal, shipping: data.shipping,
        status: data.status, items: data.items || [],
        customer: { name: data.customer_name, phone: data.customer_phone, address: data.customer_address },
        source: 'db',
      }
    }
  } catch (e) { console.warn('fetchOrderById:', e.message) }

  const ls = JSON.parse(localStorage.getItem('bk-orders') || '[]')
  return ls.find(o => o.id === q || o.id?.toUpperCase() === q) || null
}

export function markOrderPaidClaimed(orderId) {
  const ls = JSON.parse(localStorage.getItem('bk-orders') || '[]')
  const idx = ls.findIndex(o => o.id === orderId)
  if (idx > -1) {
    ls[idx].paymentClaimed = true
    ls[idx].paymentClaimedAt = new Date().toISOString()
    localStorage.setItem('bk-orders', JSON.stringify(ls))
    return true
  }
  return false
}
