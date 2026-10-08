import { Link } from 'react-router-dom'
import { X, Home, Grid3x3, Heart, ShoppingCart, Package, User, Phone, Leaf, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SHOP_INFO } from '../data/products'

const mainMenu = [
  { path: '/',          label: 'خانه',           icon: Home,      emoji: '🏠' },
  { path: '/category',  label: 'دسته‌بندی‌ها',    icon: Grid3x3,   emoji: '🫙' },
  { path: '/favorites', label: 'علاقه‌مندی‌ها',   icon: Heart,     emoji: '❤️' },
  { path: '/cart',      label: 'سبد خرید',        icon: ShoppingCart, emoji: '🛒' },
  { path: '/orders',    label: 'پیگیری سفارشات', icon: Package,   emoji: '📦' },
  { path: '/profile',   label: 'پروفایل من',      icon: User,      emoji: '👤' },
]

// ایده‌ها / تسک‌های بعدی سایت
const roadmap = [
  { emoji: '💳', label: 'پرداخت آنلاین (زرین‌پال)' },
  { emoji: '👥', label: 'پنل مشتری با ورود موبایل' },
  { emoji: '🚚', label: 'رهگیری زنده سفارش' },
  { emoji: '🏷️', label: 'کد تخفیف و کمپین' },
  { emoji: '⭐', label: 'نظرات و امتیاز مشتریان' },
  { emoji: '🎁', label: 'باشگاه مشتریان وفادار' },
]

export default function Drawer({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100]" />

          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="fixed top-0 bottom-0 right-0 w-[72%] max-w-[280px] bg-cream z-[101] flex flex-col shadow-2xl">

            {/* هدر */}
            <div className="bg-white border-b border-border p-3.5">
              <div className="flex items-center justify-between mb-2.5">
                <img
                  src={`${import.meta.env.BASE_URL}assets/categories/mixed.png`}
                  alt="کافه ترشی"
                  className="w-11 h-11 object-contain"
                />
                <button onClick={onClose}
                  className="w-8 h-8 rounded-full bg-brand-light text-brand flex items-center justify-center active:scale-90 transition">
                  <X size={16} />
                </button>
              </div>
              <h2 className="font-extrabold text-base text-brand leading-none">کافه ترشی</h2>
              <p className="text-[9px] text-muted mt-1 flex items-center gap-1">
                <Leaf size={10} className="text-brand" />
                {SHOP_INFO.tagline}
              </p>
            </div>

            {/* منو */}
            <nav className="flex-1 overflow-y-auto p-2.5">
              <p className="text-[9px] font-extrabold text-muted px-2 mb-1.5 tracking-wide">منوی اصلی</p>
              {mainMenu.map(({ path, label, icon: Icon, emoji }) => (
                <Link key={path} to={path} onClick={onClose}
                  className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-ink active:scale-[0.98] transition mb-0.5 hover:bg-white">
                  <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-brand" />
                  </div>
                  <span className="text-[13px] font-bold flex-1">{label}</span>
                  <span className="text-sm opacity-70">{emoji}</span>
                </Link>
              ))}

              <div className="my-2.5 border-t border-border"></div>

              {/* ارتباط */}
              <p className="text-[9px] font-extrabold text-muted px-2 mb-1.5 tracking-wide">ارتباط با ما</p>
              <a href={`tel:${SHOP_INFO.phone}`}
                className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-ink active:scale-[0.98] transition mb-0.5">
                <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0">
                  <Phone size={15} className="text-ink" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[12px] font-bold">تماس تلفنی</span>
                  <span className="text-[9px] text-muted" style={{ direction: 'ltr', textAlign: 'right' }}>
                    {SHOP_INFO.phone}
                  </span>
                </div>
                <span className="text-sm">📞</span>
              </a>

              <a href={`https://t.me/${SHOP_INFO.telegram}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-ink active:scale-[0.98] transition mb-0.5">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13"/>
                    <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </div>
                <span className="text-[12px] font-bold flex-1">تلگرام</span>
                <span className="text-sm">✈️</span>
              </a>

              <div className="my-2.5 border-t border-border"></div>

              {/* نقشه راه — درباره اسکلت سایت */}
              <div className="flex items-center gap-1.5 px-2 mb-2">
                <Sparkles size={11} className="text-accent" />
                <p className="text-[9px] font-extrabold text-muted tracking-wide">
                  در راهه (به‌زودی)
                </p>
              </div>

              <div className="bg-white/60 rounded-2xl p-2.5 border border-border">
                {roadmap.map((item, i) => (
                  <div key={i}
                    className="flex items-center gap-2 py-1.5 px-1 last:border-0"
                    style={{ borderBottom: i < roadmap.length - 1 ? '1px dashed #E9E5D8' : 'none' }}>
                    <span className="text-sm w-5 text-center">{item.emoji}</span>
                    <span className="text-[11px] text-ink/80">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 px-2">
                <p className="text-[8px] text-muted leading-5 text-center">
                  💡 این‌ها قابلیت‌هایی هستن که به‌زودی اضافه میشن
                </p>
              </div>
            </nav>

            <div className="p-3 border-t border-border text-center bg-white/40">
              <p className="text-[9px] text-muted">نسخه ۱.۰ — ساخته‌شده با ❤️ در بوشهر</p>
              <p className="text-[8px] text-muted/70 mt-0.5">🫙 کافه ترشی</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
