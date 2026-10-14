import { supabase } from './supabase'

const TIMEOUT = 8000

function withTimeout(promise, ms = TIMEOUT) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ])
}

function normalizeOrder(o) {
  return {
    id: o.code || o.id,
    date: o.created_at,
    total: o.total, subtotal: o.subtotal, shipping: o.shipping,
    status: o.status,
    items: o.items || [],
    customer: { name: o.customer_name, phone: o.customer_phone, address: o.customer_address },
    paymentRef: o.payment_ref,
    trackingCode: o.tracking_code,
    shippingMethod: o.shipping_method,
    source: 'db',
  }
}

const RELAY_URL = 'https://relay.cafetorshi.ir'

export async function fetchUserOrders(phone) {
  if (!phone) return []

  let dbOrders = []
  try {
    const token = (await import('./auth')).getToken()
    if (token) {
      const r = await withTimeout(fetch(`${RELAY_URL}/api/my-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: '{}',
      }))
      const j = await r.json()
      if (j.ok && Array.isArray(j.orders)) {
        dbOrders = j.orders.map(normalizeOrder)
      }
    }
  } catch (e) {
    console.warn('fetchUserOrders relay error:', e.message)
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
      supabase.rpc('get_order_by_code', { p_code: q })
    )
    if (!error && data && data[0]) {
      return normalizeOrder(data[0])
    }
  } catch (e) { console.warn('fetchOrderById:', e.message) }

  const ls = JSON.parse(localStorage.getItem('bk-orders') || '[]')
  return ls.find(o => o.id === q || o.id?.toUpperCase() === q) || null
}

export async function deleteOrder(orderCode) {
  const token = (await import('./auth')).getToken()
  if (!token) return false
  try {
    const r = await fetch(`${RELAY_URL}/api/delete-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ code: orderCode }),
    })
    const j = await r.json()
    return j.ok && j.deleted === true
  } catch (e) {
    console.warn('deleteOrder:', e.message)
    return false
  }
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

export async function updateOrderPaid(orderId, { paymentRef, trackId } = {}) {
  const q = String(orderId).toUpperCase().replace('#', '')
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_ref: paymentRef || trackId || null,
      })
      .eq('code', q)
      .select()
    if (error) {
      console.warn('updateOrderPaid err:', error.message)
      return false
    }
    return Array.isArray(data) && data.length > 0
  } catch (e) {
    console.warn('updateOrderPaid ex:', e.message)
    return false
  }
}
