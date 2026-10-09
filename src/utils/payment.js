const SUPABASE_URL = 'https://slckuoggdkyljvwgtczf.supabase.co'
const FUNCTIONS_BASE = `${SUPABASE_URL}/functions/v1`

// ⚠️ نام‌ها رو Supabase خودش داد
const ZIBAL_REQUEST = `${FUNCTIONS_BASE}/rapid-function`
const ZIBAL_VERIFY = `${FUNCTIONS_BASE}/smart-function`

export async function requestZibalPayment({ orderId, amount, callbackUrl, phone }) {
  const res = await fetch(ZIBAL_REQUEST, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, amount, callbackUrl, phone }),
  })
  return await res.json()
}

export async function verifyZibalPayment({ orderId, trackId }) {
  const res = await fetch(ZIBAL_VERIFY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, trackId }),
  })
  return await res.json()
}
