import Header from '../components/Header'
import { SHOP_INFO } from '../data/products'
import Logo from '../components/Logo'
import { Heart, Leaf, Truck, Award } from 'lucide-react'

export default function About() {
  return (
    <>
      <Header title="درباره ما" back />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-5 fade-up">

        {/* لوگو + عنوان */}
        <div className="flex flex-col items-center text-center mb-7">
          <Logo size={80} />
          <h1 className="font-extrabold text-2xl text-brand mt-3 mb-1">کافه ترشی</h1>
          <p className="text-xs text-muted">{SHOP_INFO.tagline}</p>
          <svg viewBox="0 0 100 6" width="80" height="6" className="mt-2">
            <path d="M 4 4 Q 25 1 50 3 Q 75 5 96 2" stroke="#F8C02D" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {/* داستان */}
        <section className="bg-white rounded-2xl p-5 border border-border mb-4">
          <h2 className="font-extrabold text-sm text-brand mb-3 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center text-base">🫙</span>
            داستان ما
          </h2>
          <p className="text-xs text-ink leading-7 text-justify">
            کافه ترشی با عشق به طعم‌های اصیل ایرانی و خانگی متولد شد. ما باور داریم که ترشی و خیارشور فقط یه مخلفات ساده نیست، بلکه بخشی از هویت سفره‌های ایرانیه.
          </p>
          <p className="text-xs text-ink leading-7 text-justify mt-3">
            همه محصولات ما از مواد اولیه تازه و با دستورهای اصیل خانگی تهیه می‌شن. بدون مواد نگهدارنده، بدون طعم‌دهنده‌های مصنوعی — فقط طعم واقعی و خاطره‌انگیز.
          </p>
        </section>

        {/* مزیت‌ها */}
        <section className="mb-4">
          <h2 className="font-extrabold text-sm text-ink mb-3 text-center">چرا کافه ترشی؟</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Leaf,   title: 'مواد اولیه تازه', desc: 'از مزارع بومی', color: '#4CAF50' },
              { icon: Heart,  title: 'طعم خانگی',       desc: 'دستور اصیل',      color: '#E91E63' },
              { icon: Truck,  title: 'ارسال سریع',      desc: 'به سراسر کشور',   color: '#2196F3' },
              { icon: Award,  title: 'کیفیت تضمینی',    desc: 'بدون نگهدارنده',  color: '#F8C02D' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-border flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ background: color + '20' }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="font-extrabold text-xs text-ink mb-1">{title}</h3>
                <p className="text-[10px] text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* اطلاعات فروشگاه */}
        <section className="bg-white rounded-2xl p-5 border border-border mb-4">
          <h2 className="font-extrabold text-sm text-brand mb-3">اطلاعات فروشگاه</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <span className="text-muted">نام فروشگاه</span>
              <span className="font-bold text-ink">{SHOP_INFO.name}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-muted">نشانی</span>
              <span className="font-bold text-ink text-left" style={{ maxWidth: '60%' }}>{SHOP_INFO.address}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-muted">تلفن</span>
              <span className="font-bold text-ink" style={{ direction: 'ltr' }}>{SHOP_INFO.phone}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-muted">اینماد</span>
              <span className="font-bold text-brand">در حال دریافت</span>
            </div>
          </div>
        </section>

        <p className="text-center text-[10px] text-muted mt-6">
          🫙 کافه ترشی — ساخته‌شده با ❤️ در بوشهر
        </p>
      </main>
    </>
  )
}
