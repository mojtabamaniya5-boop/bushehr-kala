import { Link } from 'react-router-dom'
import { X, Home, Grid3x3, Heart, ShoppingCart, Package, User, Phone, Info, FileText, Send, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SHOP_INFO } from '../data/products'

const mainMenu = [
  { path: '/',          label: 'خانه',            icon: Home,         emoji: '🏠' },
  { path: '/category',  label: 'دسته‌بندی‌ها',     icon: Grid3x3,      emoji: '🫙' },
  { path: '/favorites', label: 'علاقه‌مندی‌ها',    icon: Heart,        emoji: '❤️' },
  { path: '/cart',      label: 'سبد خرید',         icon: ShoppingCart, emoji: '🛒' },
  { path: '/orders',    label: 'پیگیری سفارشات',  icon: Package,      emoji: '📦' },
  { path: '/profile',   label: 'پروفایل من',       icon: User,         emoji: '👤' },
]

const pagesMenu = [
  { path: '/track',   label: 'رهگیری سفارش',   icon: Package,  emoji: '🔍' },
  { path: '/about',   label: 'درباره ما',        icon: Info,     emoji: '🫙' },
  { path: '/terms',   label: 'قوانین و مقررات',  icon: FileText, emoji: '📜' },
  { path: '/contact', label: 'تماس با ما',       icon: Phone,    emoji: '📞' },
]

const roadmap = [
  { emoji: '💳', label: 'پرداخت آنلاین (زیبال)',    color: '#2E7D32' },
  { emoji: '👥', label: 'پنل مشتری با ورود موبایل', color: '#185C28' },
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
            className="fixed top-0 bottom-0 right-0 w-[78%] max-w-[300px] bg-cream z-[101] flex flex-col shadow-2xl">

            {/* هدر با گرادیان سبز */}
            <div className="relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #185C28 100%)' }}>
              <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/10"></div>
              <div className="absolute -bottom-8 -right-4 w-24 h-24 rounded-full bg-accent/20"></div>

              <div className="relative p-4 pt-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/30">
                    <img
                      src={`${import.meta.env.BASE_URL}assets/categories/mixed.png`}
                      alt="کافه ترشی"
                      className="w-11 h-11 object-contain"
                    />
                  </div>
                  <button onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center active:scale-90 transition">
                    <X size={16} />
                  </button>
                </div>
                <h2 className="font-extrabold text-lg text-white leading-none">کافه ترشی</h2>
                <p className="text-[10px] text-white/80 mt-1.5">🫙 {SHOP_INFO.tagline}</p>
              </div>
            </div>

            {/* منو */}
            <nav className="flex-1 overflow-y-auto p-3">
              {/* منوی اصلی */}
              <p className="text-[9px] font-extrabold text-muted px-2 mb-2 tracking-wider">منوی اصلی</p>
              <div className="space-y-0.5 mb-4">
                {mainMenu.map(({ path, label, icon: Icon, emoji }) => (
                  <Link key={path} to={path} onClick={onClose}
                    className="flex items-center gap-3 px-2.5 py-2.5 rounded-2xl text-ink active:scale-[0.98] transition hover:bg-white">
                    <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-brand" />
                    </div>
                    <span className="text-[13px] font-bold flex-1">{label}</span>
                    <span className="text-base opacity-80">{emoji}</span>
                  </Link>
                ))}
              </div>

              {/* صفحات */}
              <p className="text-[9px] font-extrabold text-muted px-2 mb-2 tracking-wider">اطلاعات</p>
              <div className="space-y-0.5 mb-4">
                {pagesMenu.map(({ path, label, icon: Icon, emoji }) => (
                  <Link key={path} to={path} onClick={onClose}
                    className="flex items-center gap-3 px-2.5 py-2.5 rounded-2xl text-ink active:scale-[0.98] transition hover:bg-white">
                    <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-brand" />
                    </div>
                    <span className="text-[13px] font-bold flex-1">{label}</span>
                    <span className="text-base opacity-80">{emoji}</span>
                  </Link>
                ))}
              </div>

              {/* تماس سریع */}
              <p className="text-[9px] font-extrabold text-muted px-2 mb-2 tracking-wider">ارتباط سریع</p>
              <div className="space-y-0.5 mb-4">
                <a href={`tel:${SHOP_INFO.phone}`}
                  className="flex items-center gap-3 px-2.5 py-2.5 rounded-2xl text-ink active:scale-[0.98] transition hover:bg-white">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#F8C02D30' }}>
                    <Phone size={16} style={{ color: '#B8860B' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold">تماس تلفنی</div>
                    <div className="text-[10px] text-muted" style={{ direction: 'ltr', textAlign: 'right' }}>{SHOP_INFO.phone}</div>
                  </div>
                  <span className="text-base">📞</span>
                </a>

                <a href={`https://ble.ir/${SHOP_INFO.telegram}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 px-2.5 py-2.5 rounded-2xl text-ink active:scale-[0.98] transition hover:bg-white">
                  <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
                    <Send size={16} className="text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold">پیام‌رسان بله</div>
                    <div className="text-[10px] text-muted">پاسخ سریع در ۱۰ دقیقه</div>
                  </div>
                  <span className="text-base">✈️</span>
                </a>
              </div>

              {/* در راهه */}
              <div className="flex items-center gap-1.5 px-2 mb-2">
                <Sparkles size={11} className="text-accent" />
                <p className="text-[9px] font-extrabold text-muted tracking-wider">به‌زودی</p>
              </div>

              <div className="space-y-2">
                {roadmap.map((item, i) => (
                  <div key={i}
                    className="bg-white rounded-2xl p-3 border border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: item.color + '15' }}>
                      {item.emoji}
                    </div>
                    <span className="text-[12px] font-bold text-ink flex-1 leading-5">{item.label}</span>
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                  </div>
                ))}
              </div>
            </nav>

            {/* فوتر */}
            <div className="p-3 border-t border-border bg-white/60">
              <p className="text-[9px] text-muted text-center">
                نسخه ۱.۰ — ساخته‌شده با ❤️ در بوشهر
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
