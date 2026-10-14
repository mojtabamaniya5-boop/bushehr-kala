import Header from '../components/Header'
import { SHOP_INFO } from '../data/products'
import { Phone, Send, MapPin, Clock, MessageSquare } from 'lucide-react'

export default function Contact() {
  const items = [
    {
      icon: Phone,
      title: 'تماس تلفنی',
      value: SHOP_INFO.phone,
      href: `tel:${SHOP_INFO.phone}`,
      color: '#2196F3',
      ltr: true,
    },
    {
      icon: Send,
      title: 'پیام‌رسان بله',
      value: '@' + SHOP_INFO.telegram,
      href: `https://ble.ir/${SHOP_INFO.telegram}`,
      color: '#0088cc',
      ltr: true,
    },
    {
      icon: MapPin,
      title: 'آدرس فروشگاه',
      value: SHOP_INFO.address,
      href: null,
      color: '#E91E63',
      ltr: false,
    },
    {
      icon: Clock,
      title: 'ساعت پاسخگویی',
      value: 'شنبه تا پنجشنبه — ۹ صبح تا ۹ شب',
      href: null,
      color: '#F8C02D',
      ltr: false,
    },
  ]

  return (
    <>
      <Header title="تماس با ما" back />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-5 fade-up">

        {/* هدر */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-3 border-2 border-brand/20">
            <MessageSquare size={36} className="text-brand" />
          </div>
          <h1 className="font-extrabold text-lg text-ink mb-1">در خدمتیم 🙌</h1>
          <p className="text-xs text-muted">هر سؤالی داری، خوشحال می‌شیم کمکت کنیم</p>
        </div>

        {/* راه‌های ارتباطی */}
        <div className="space-y-3 mb-6">
          {items.map(({ icon: Icon, title, value, href, color, ltr }, i) => {
            const content = (
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: color + '20' }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-muted mb-0.5">{title}</div>
                  <div
                    className="text-xs font-extrabold text-ink truncate"
                    style={ltr ? { direction: 'ltr', textAlign: 'right' } : {}}
                  >
                    {value}
                  </div>
                </div>
              </div>
            )

            return href ? (
              <a key={i} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                className="block bg-white rounded-2xl p-4 border border-border active:scale-[0.98] transition">
                {content}
              </a>
            ) : (
              <div key={i} className="bg-white rounded-2xl p-4 border border-border">
                {content}
              </div>
            )
          })}
        </div>

        {/* کارت پشتیبانی */}
        <div className="rounded-3xl p-5 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #185C28 100%)' }}>
          <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-6 right-4 w-20 h-20 rounded-full bg-accent/20"></div>
          <div className="relative">
            <h3 className="font-extrabold text-sm mb-1">پشتیبانی سریع 🫙</h3>
            <p className="text-[11px] opacity-90 leading-5 mb-3">
              برای پاسخ سریع‌تر، توی پیام‌رسان بله پیام بده — معمولاً در کمتر از ۱۰ دقیقه جواب می‌دیم.
            </p>
            <a href={`https://ble.ir/${SHOP_INFO.telegram}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white text-brand text-xs font-extrabold px-4 py-2.5 rounded-full active:scale-95 transition">
              <Send size={14} />
              ارسال پیام در بله
            </a>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted mt-6">
          🫙 کافه ترشی — همیشه کنارتیم
        </p>
      </main>
    </>
  )
}
