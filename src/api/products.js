import { supabase } from '../utils/supabase'
import { PRODUCTS as STATIC_PRODUCTS, CATEGORIES as STATIC_CATEGORIES } from '../data/products'

const CACHE_KEY = 'bk-products-cache'
const CACHE_TTL = 60 * 60 * 1000

function getCache(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (Date.now() - data.ts > CACHE_TTL) return null
    return data.items
  } catch { return null }
}

function setCache(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), items }))
  } catch {}
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
    reviews: p.reviews || 0,
    image: p.image || '',
    description: p.description,
    features: p.features || [],
    specs: p.specs || {},
    weight: p.weight || '۵۰۰ گرم',
    bestSeller: p.best_seller,
    active: p.active !== false,
  }
}

export async function getProducts({ forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = getCache(CACHE_KEY)
    if (cached && cached.length > 0) return cached
  }

  try {
    const { data, error } = await Promise.race([
      supabase.from('products').select('*').eq('active', true),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
    ])

    if (!error && data && data.length > 0) {
      const items = data.map(normalizeProduct)
      setCache(CACHE_KEY, items)
      return items
    }
  } catch (e) {
    console.warn('getProducts failed, using static:', e.message)
  }

  return STATIC_PRODUCTS
}

export async function getProductById(id) {
  if (!id) return null

  const cached = getCache(CACHE_KEY) || []
  const found = cached.find(p => p.id === id)
  if (found) return found

  try {
    const { data, error } = await Promise.race([
      supabase.from('products').select('*').eq('id', id).maybeSingle(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
    ])

    if (!error && data) return normalizeProduct(data)
  } catch (e) {
    console.warn('getProductById failed:', e.message)
  }

  return STATIC_PRODUCTS.find(p => p.id === id) || null
}

export async function getCategories() {
  try {
    const { data, error } = await Promise.race([
      supabase.from('categories').select('*').order('sort_order'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
    ])
    if (!error && data && data.length > 0) return data
  } catch (e) {
    console.warn('getCategories failed:', e.message)
  }
  return STATIC_CATEGORIES
}

export function clearProductsCache() {
  try { localStorage.removeItem(CACHE_KEY) } catch {}
}
