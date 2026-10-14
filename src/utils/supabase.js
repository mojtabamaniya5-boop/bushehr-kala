import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_KEY } from './supabase-config'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('fetchProducts error:', error)
    return []
  }
  return data.map(normalizeProduct)
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  if (error) return []
  return data
}

export async function fetchProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return normalizeProduct(data)
}

export async function searchProductsInDB(q) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .or(`title.ilike.%${q}%,brand.ilike.%${q}%,description.ilike.%${q}%`)

  if (error) return []
  return data.map(normalizeProduct)
}

export async function saveOrderToDB(order) {
  const { error } = await supabase
    .from('orders')
    .insert({
      id: order.id,
      code: order.id,
      customer_name: order.customer.name,
      customer_phone: order.customer.phone,
      customer_address: order.customer.address,
      customer_note: order.customer.note || null,
      items: order.items,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      payment_method: order.payment,
      status: 'pending',
    })

  if (error) {
    console.error('saveOrderToDB error:', error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

function normalizeProduct(p) {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    brand: p.brand,
    price: p.price,
    oldPrice: p.old_price,
    stock: p.stock,
    rating: Number(p.rating),
    image: p.image,
    description: p.description,
    features: p.features || [],
    bestSeller: p.best_seller,
  }
}
