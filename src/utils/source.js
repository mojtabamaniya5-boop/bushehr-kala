// تشخیص منبع ورودی (UTM + Referrer)
export const captureSource = () => {
  if (typeof window === 'undefined') return
  
  const params = new URLSearchParams(window.location.search)
  const utm = {
    source: params.get('utm_source') || null,
    medium: params.get('utm_medium') || null,
    campaign: params.get('utm_campaign') || null,
  }

  // اگه UTM داره، ذخیره کن
  if (utm.source) {
    localStorage.setItem('bk-source', JSON.stringify({ ...utm, detected: 'utm' }))
    return
  }

  // اگه قبلاً ذخیره شده بود، کاری نکن
  if (localStorage.getItem('bk-source')) return

  // تشخیص از Referrer
  let detected = 'direct'
  try {
    const ref = document.referrer || ''
    if (ref.includes('google.')) detected = 'google'
    else if (ref.includes('torob.')) detected = 'torob'
    else if (ref.includes('instagram.')) detected = 'instagram'
    else if (ref.includes('t.me') || ref.includes('telegram')) detected = 'telegram'
    else if (ref.includes('whatsapp.')) detected = 'whatsapp'
    else if (ref && !ref.includes(window.location.host)) detected = 'other'
  } catch {}
  
  localStorage.setItem('bk-source', JSON.stringify({ source: detected, detected: 'referrer' }))
}

export const getSource = () => {
  try {
    const raw = localStorage.getItem('bk-source')
    if (!raw) return { source: 'direct', medium: null, campaign: null }
    const parsed = JSON.parse(raw)
    return {
      source: parsed.source || 'direct',
      medium: parsed.medium || null,
      campaign: parsed.campaign || null,
    }
  } catch {
    return { source: 'direct', medium: null, campaign: null }
  }
}

export const clearSource = () => localStorage.removeItem('bk-source')
