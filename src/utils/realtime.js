import { supabase } from './supabase'
import { clearShopCache } from '../api/shop'

let channel = null
let retryTimeout = null

export function setupRealtime() {
  // جلوگیری از اتصال دوباره اگه قبلاً وصل بود
  if (channel) return

  console.log('🔄 Realtime: در حال اتصال...')

  channel = supabase.channel('shop-realtime')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'products' }, 
      (payload) => {
        console.log('📦 Realtime: محصول تغییر کرد', payload.eventType)
        try { localStorage.removeItem('bk-products-cache') } catch {}
        window.dispatchEvent(new CustomEvent('shop-data-updated', { detail: { table: 'products' } }))
      }
    )
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'shop_settings' }, 
      (payload) => {
        console.log('⚙️ Realtime: تنظیمات تغییر کرد', payload.eventType)
        clearShopCache() // پاک کردن کش تنظیمات
        window.dispatchEvent(new CustomEvent('shop-data-updated', { detail: { table: 'shop_settings' } }))
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Realtime: متصل شد')
        window.alert('✅ Realtime وصل شد!')
        if (retryTimeout) { clearTimeout(retryTimeout); retryTimeout = null }
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        console.warn('⚠️ Realtime: قطع شد، تلاش دوباره در ۵ ثانیه...')
        channel = null
        if (retryTimeout) clearTimeout(retryTimeout)
        retryTimeout = setTimeout(setupRealtime, 5000)
      }
    })
}
