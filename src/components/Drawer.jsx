import { Link } from 'react-router-dom'
import { X, Home, Grid3x3, Heart, ShoppingCart, Package, User, Info, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SHOP_INFO } from '../data/products'
import Logo from './Logo'

const menuItems = [
  { path: '/',          label: 'خانه',           icon: Home },
  { path: '/category',  label: 'دسته‌بندی‌ها',    icon: Grid3x3 },
  { path: '/favorites', label: 'علاقه‌مندی‌ها',   icon: Heart },
  { path: '/cart',      label: 'سبد خرید',        icon: ShoppingCart },
  { path: '/orders',    label: 'پیگیری سفارشات', icon: Package },
  { path: '/profile',   label: 'پروفایل من',      icon: User },
]

export default function Drawer({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* پس‌زمینه تیره */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100]"
          />

          {/* پنل منو — از راست میاد */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 bottom-0 right-0 w-[82%] max-w-[320px] bg-cream z-[101] flex flex-col shadow-2xl">

            {/* هدر */}
            <div className="bg-white border-b border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <Logo size={42} />
                <button onClick={onClose}
                  className="p-2 rounded-lg bg-brand-light text-brand active:scale-90">
                  <X size={20} />
                </button>
              </div>
              <h2 className="font-extrabold text-lg text-brand leading-none">کافه ترشی</h2>
              <p className="text-[10px] text-muted mt-1">{SHOP_INFO.tagline}</p>
            </div>

            {/* آیتم‌های منو */}
            <nav className="flex-1 overflow-y-auto p-3">
              {menuItems.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path} onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-ink active:scale-[0.98] transition mb-1 hover:bg-white">
                  <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center">
                    <Icon size={17} className="text-brand" />
                  </div>
                  <span className="text-sm font-bold">{label}</span>
                </Link>
              ))}

              <div className="my-3 border-t border-border"></div>

              <a href={`tel:${SHOP_INFO.phone}`}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-ink active:scale-[0.98] transition mb-1">
                <div className="w-9 h-9 rounded-full bg-accent/30 flex items-center justify-center">
                  <Phone size={17} className="text-ink" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">تماس با ما</span>
                  <span className="text-[10px] text-muted">{SHOP_INFO.phone}</span>
                </div>
              </a>

              <div className="flex items-center gap-3 px-3 py-3 rounded-xl text-ink">
                <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center">
                  <Info size={17} className="text-brand" />
                </div>
                <span className="text-sm font-bold">درباره کافه ترشی</span>
              </div>
            </nav>

            {/* پایین */}
            <div className="p-4 border-t border-border text-center">
              <p className="text-[10px] text-muted">نسخه ۱.۰ — ساخته‌شده با ❤️ در بوشهر</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
