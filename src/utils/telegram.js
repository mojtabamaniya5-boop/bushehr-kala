import { BALE_TOKEN, BALE_CHAT_ID } from './telegram-config'

const BALE_API = 'https://tapi.bale.ai'

export const isTelegramReady = () => Boolean(BALE_TOKEN && BALE_CHAT_ID)

async function baleRequest(method, payload) {
  if (!isTelegramReady()) {
    return { ok: false, reason: 'not-configured' }
  }
  try {
    const res = await fetch(`${BALE_API}/bot${BALE_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    return data
  } catch (e) {
    return { ok: false, reason: 'network', error: e.message }
  }
}

export async function sendOrderToTelegram(order) {
  if (!isTelegramReady()) return { ok: false, reason: 'not-configured' }

  const lines = []
  lines.push('🛒 سفارش جدید از بوشهر کالا')
  lines.push('')
  lines.push(`👤 نام: ${order.customer.name}`)
  lines.push(`📞 موبایل: ${order.customer.phone}`)
  lines.push(`📍 آدرس: ${order.customer.address}`)
  if (order.customer.note) lines.push(`📝 یادداشت: ${order.customer.note}`)
  lines.push('')
  lines.push('📦 اقلام سفارش:')
  order.items.forEach((it, i) => {
    lines.push(`${i + 1}. ${it.title}`)
    lines.push(`   ${it.qty} × ${it.price.toLocaleString('fa-IR')} تومان`)
  })
  lines.push('')
  lines.push(`💰 جمع کالاها: ${order.subtotal.toLocaleString('fa-IR')} تومان`)
  lines.push(`🚚 ارسال: ${order.shipping === 0 ? 'رایگان' : order.shipping.toLocaleString('fa-IR') + ' تومان'}`)
  lines.push(`✅ قابل پرداخت: ${order.total.toLocaleString('fa-IR')} تومان`)
  lines.push('')
  lines.push(`🆔 کد سفارش: ${order.id}`)

  return baleRequest('sendMessage', {
    chat_id: BALE_CHAT_ID,
    text: lines.join('\n'),
  })
}

export async function sendTestMessage() {
  return baleRequest('sendMessage', {
    chat_id: BALE_CHAT_ID,
    text: '✅ اتصال بوشهر کالا به بله برقرار شد!\n\nاز این پس، سفارش‌های مشتریان به این چت ارسال می‌شن.',
  })
}
