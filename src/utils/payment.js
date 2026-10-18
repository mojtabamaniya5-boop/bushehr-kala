const RELAY_URL = 'https://relay.cafetorshi.ir'

const fetchWithTimeout = async (url, options, ms = 15000) => {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    return await fetch(url, { ...options, signal: ctrl.signal })
  } finally {
    clearTimeout(t)
  }
}

export async function requestZibalPayment({ orderId, callbackUrl, phone }) {
  const res = await fetchWithTimeout(`${RELAY_URL}/zibal/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, callbackUrl, phone }),
  })
  return await res.json()
}

export async function verifyZibalPayment({ orderId, trackId }) {
  const res = await fetchWithTimeout(`${RELAY_URL}/zibal/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, trackId }),
  })
  return await res.json()
}
