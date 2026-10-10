// لینک پیگیری بر اساس شرکت حمل
export function getTrackingUrl(code, method) {
  if (!code) return null

  if (method === 'tipax') {
    return `https://tipaxco.com/tracking`
    // تیپاکس کاربر باید کد رو دستی وارد کنه (API عمومی نداره)
  }
  // پست پیش‌فرض
  return `https://tracking.post.ir/?id=${code}`
}

export function getTrackingLabel(method) {
  if (method === 'tipax') return 'پیگیری در سایت تیپاکس'
  return 'پیگیری در سایت پست'
}

export function getShippingName(method) {
  if (method === 'tipax') return 'ارسال با تیپاکس'
  return 'ارسال با پست'
}
