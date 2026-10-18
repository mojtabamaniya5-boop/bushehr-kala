// API تنظیمات فروشگاه — از Supabase می‌خونه
import { supabase } from '../utils/supabase'
import { SHOP_CONFIG } from '../config/shop'

const CACHE_KEY = 'shop-settings-cache'
const CACHE_TTL = 2 * 60 * 1000 // ۲ دقیقه

let memoryCache = null
let memoryCacheTime = 0

export async function getShopSettings() {
  // ۱. حافظه
  if (memoryCache && Date.now() - memoryCacheTime < CACHE_TTL) {
    return memoryCache
  }
  // ۲. localStorage
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) {
      const { ts, data } = JSON.parse(raw)
      if (Date.now() - ts < CACHE_TTL) {
        memoryCache = data
        memoryCacheTime = ts
        return data
      }
    }
  } catch {}
  // ۳. از Supabase
  try {
    const { data, error } = await supabase
      .from('shop_settings')
      .select('*')
      .eq('id', 1)
      .single()
    if (error || !data) throw error
    const mapped = {
      name: data.name,
      tagline: data.tagline,
      phone: data.phone,
      telegram: data.telegram,
      address: data.address,
      card: {
        number: data.card_number,
        holder: data.card_holder,
        bank: data.card_bank,
      },
      shippingFast: data.shipping_fast,
      shippingNormal: data.shipping_normal,
      freeShippingFrom: data.free_shipping_from,
      freeShippingCities: data.free_shipping_cities || [],
      sameDayCities: data.same_day_cities || [],
      freePostalPrefixes: data.free_postal_prefixes || ['75'],
    }
    memoryCache = mapped
    memoryCacheTime = Date.now()
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: mapped }))
    } catch {}
    return mapped
  } catch (e) {
    console.error('getShopSettings خطا:', e)
    // fallback به SHOP_CONFIG (config/shop.js)
    return SHOP_CONFIG
  }
}

export function clearShopCache() {
  memoryCache = null
  memoryCacheTime = 0
  try { localStorage.removeItem(CACHE_KEY) } catch {}
}
