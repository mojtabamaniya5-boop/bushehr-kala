import { BOT_TOKEN, CHAT_ID } from './telegram-config'

export const isTelegramReady = () => Boolean(BOT_TOKEN && CHAT_ID)

export async function sendOrderToTelegram(order) {
  if (!isTelegramReady()) {
    console.warn('Telegram Bot تنظیم نشده')
    return { ok: false, reason: 'not-configured' }
  }

  const lines = []
  lines.push('🛒 *سفارش جدید از بوشهر کالا*')
  lines.push('')
  lines.push(`👤 نام: ${order.customer.name}`)
  lines.push(`📞 موبایل: \`${order.customer.phone}\``)
  lines.push(`📍 آدرس: ${order.customer.address}`)
  if (order.customer.note) lines.push(`📝 یادداشت: ${order.customer.note}`)
  lines.push('')
  lines.push('📦 *اقلام سفارش:*')
  order.items.forEach((it, i) => {
    lines.push(`${i + 1}. ${it.title}`)
    lines.push(`   ${it.qty} × ${it.price.toLocaleString('fa-IR')} تومان`)
  })
  lines.push('')
  lines.push(`💰 جمع کالاها: ${order.subtotal.toLocaleString('fa-IR')} تومان`)
  lines.push(`🚚 ارسال: ${order.shipping === 0 ? 'رایگان' : order.shipping.toLocaleString('fa-IR') + ' تومان'}`)
  lines.push(`✅ *قابل پرداخت: ${order.total.toLocaleString('fa-IR')} تومان*`)
  lines.push('')
  lines.push(`🆔 کد سفارش: \`${order.id}\``)

  const text = lines.join('\n')

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'Markdown',
      }),
    })
    const data = await res.json()
    return { ok: data.ok, data }
  } catch (e) {
    return { ok: false, reason: 'network', error: e.message }
  }
}

// تابع تست
export async function sendTestMessage() {
  if (!isTelegramReady()) {
    return { ok: false, reason: 'not-configured' }
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: '✅ اتصال بوشهر کالا به تلگرام برقرار شد!\n\nاز این پس، سفارش‌های مشتریان به این چت ارسال می‌شن.',
        parse_mode: 'Markdown',
      }),
    })
    return await res.json()
  } catch (e) {
    return { ok: false, error: e.message }
  }
}
