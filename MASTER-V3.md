# 🏭 سند مادر کافه ترشی — نسخه ۳.۱
> آخرین به‌روزرسانی: ۱۴۰۵/۰۷/۱۸
> وضعیت: فروشگاه فعال + اپ + دامنه + پنل امن + CRM

## 🎯 اطلاعات پروژه
| مورد | مقدار |
|---|---|
| نام | کافه ترشی |
| دامنه | cafetorshi.ir |
| مخزن | github.com/mojtabamaniya5-boop/bushehr-kala |
| Supabase | slckuoggdkyljvwgtczf |
| صاحب | مجتبی خسروانی |
| موبایل | 09016191338 |
| کد مالیاتی | ۴۲۳۶۴۴۲۳۴ |
| کارت | 5859831086263828 — مسکن |
| بانک | مجتبی خسروانی |
| ادمین Email | mojtabamaniya5@gmail.com |
| ربات بله | @cafetorshi / Chat ID: 1827687804 |
| Zibal Merchant | 6ac89a26229d129c185c896e |

## 🏗️ معماری
Frontend (React) → Supabase (DB+Auth+Storage) → pg_net → بله
                                ↓
                        Edge Functions → زیبال (IP محدود)

## 🛠️ تکنولوژی (پین شده)
- Vite 5.4.11 (نه 6+)
- React 18.3.1
- Tailwind 3.4.14
- React Router 6.28.0
- Capacitor 6.2.0
- Supabase latest
- pnpm 9
- Hosting: GitHub Pages
- DNS: آروان
- Email: ImprovMX (info@cafetorshi.ir → lianapp.info@gmail.com)

## ⛔ ممنوع‌های مطلق
- TypeScript، Next.js، Vite 6+، React 19، Capacitor 7+
- yarn/npm، Firebase/FCM، App Store، Cloudflare Worker
- پسورد سخت‌کد شده در کد

## 📁 ساختار فایل‌ها
src/
├── api/products.js (محصولات از Supabase + cache)
├── components/ (۲۱ کامپوننت)
├── pages/ (۲۰ صفحه: Admin, AdminCustomers, Home, Cart, Checkout, Pay, Verify, Track, MyOrders, Profile, Login, ...)
├── utils/ (auth, cart, orders, payment, storage, supabase, admin-auth, customers, track-security, tracking-url)
├── data/products.js (fallback)
└── App.jsx

## 💾 دیتابیس Supabase
### جداول
- products (id, title, category, brand, price, old_price, stock, rating, reviews, weight, image, description, features, specs, best_seller, active)
- categories
- orders (id, code, customer_name, customer_phone, customer_address, customer_note, items, subtotal, shipping, total, payment_method, payment_ref, status, tracking_code, shipping_method, created_at)
- customers

### RLS + GRANT
- products: خواندن برای همه، نوشتن فقط authenticated
- orders: خواندن همه، درج همه، ویرایش/حذف فقط authenticated
- storage product-images: خواندن همه، آپلود/حذف authenticated
- حتماً GRANT DELETE روی orders

## 🔥 اطلاع‌رسانی بله (pg_net)
- Vault: bale_bot_token + bale_chat_id
- Trigger روی INSERT جدول orders
- تابع notify_bale_on_order() با net.http_post
- ⚠️ جای E'\n' از chr(10) استفاده کن
- بدون CORS، بدون Cloudflare، بدون IP

## 💳 زیبال (وضعیت)
- درگاه تأیید شده
- Merchant: 6ac89a26229d129c185c896e
- Secret در Supabase: ZIBAL_MERCHANT
- Edge Functions:
  - rapid-function (request)
  - smart-function (verify)
- ⚠️ IP Restriction فعاله — تیکت زدیم
- زیبال گفت: «سرور با IP ثابت بیارید»
- گزینه‌ها: VPS ایرانی (۱M/ماه) یا PaaS (۴۰۰K/ماه) یا کارت‌به‌کارت

## 🔐 امنیت
- پنل ادمین: Supabase Auth (نه پسورد سخت‌کد)
- Session ادمین: TTL ۲۴ ساعت
- فراموشی پسورد: با ایمیل
- Recovery Mode: صفحه تغییر پسورد
- Track: کد سفارش + شماره موبایل
- Rate Limiting: ۵ تلاش در ۵ دقیقه
- CRM مشتریان: فقط ادمین

## 🌐 دامنه + DNS + ایمیل
- دامنه از ایرنیک
- DNS آروان: A records + CNAME + MX + TXT
- MX: mx1.improvmx.com + mx2.improvmx.com
- SPF: v=spf1 include:spf.improvmx.com ~all
- HTTPS فعال (Let's Encrypt)

## 📱 فایل‌های مهم
- public/5536523.txt (تأیید اینماد)
- public/CNAME (cafetorshi.ir)
- public/icon.png + icon.svg
- public/assets/banners/ (۴ بنر فشرده ~۱۰۰KB)
- public/assets/categories/ (۱۲ آیکون)

## ✅ کارهای انجام‌شده
- سایت روی cafetorshi.ir + HTTPS
- محصولات از Supabase با cache
- سبد خرید + علاقه‌مندی
- تسویه + کارت‌به‌کارت
- ثبت سفارش → Supabase
- اطلاع بله با pg_net
- پنل ادمین با Supabase Auth
- CRM مشتریان (aggregate از orders)
- Track امن (کد + موبایل + rate limit)
- کد رهگیری پستی (پست/تیپاکس)
- Session timeout ۲۴س
- فراموشی پسورد
- رهگیری سفارش با استپر
- بنرها فشرده (۲۷×)
- صفحات قانونی
- PWA + APK (debug)
- ایمیل سازمانی
- اینماد (ثبت‌نام + فایل + متاتگ)
- زیبال (تأیید شده، منتظر IP)

## ❌ کارهای مونده
1. SMS واقعی (کاوه‌نگار) ← الآن همینیم
2. ورود مشتری با SMS
3. APK Release + keystore
4. Config متمرکز (پکیج فروش)
5. اینماد (تیکت)
6. زیبال (VPS/PaaS)
7. نمونه‌کار دوم
8. سایت لین‌اپ
9. اینستاگرام
10. اولین مشتری

## 🐛 خطاهای حل‌شده
- terser crash ARM64 → workbox.mode: development
- workbox-window → dependencies
- صفحه سفید APK → base: './'
- HashRouter نه BrowserRouter
- rsvg-convert جای convert
- CORS بله → pg_net
- permission denied → GRANT
- E'\n' → chr(10)
- placehold.co → SVG (JarIllustration)
- pnpm-workspace.yaml → .gitignore
- Vite 8 → pin 5.4.11
- invalid IP زیبال → VPS/PaaS
- SSH پسورد expire → SSH Key

## 🎓 درس‌های طلایی
1. RLS + GRANT با هم
2. pg_net + Vault جایگزین Cloudflare Worker
3. اول مشتری، بعد تکنولوژی
4. کارت‌به‌کارت برای MVP کافیه
5. درگاه آنلاین بعد از ۱۰+ مشتری
6. سند مادر = بلیط عبور
7. Confirmation Modal جای confirm()
8. Cache TTL + fallback
9. Session TTL
10. اول امنیت، بعد فیچر

## 🔑 دسترسی‌های اضطراری
- Supabase: supabase.com/dashboard/project/slckuoggdkyljvwgtczf
- ادمین: mojtabamaniya5@gmail.com / [پسورد در یادداشت امن]
- گیتهاب: mojtabamaniya5-boop / [توکن با repo + workflow]
- دامنه: my.irnic.ir
- DNS: panel.arvancloud.ir
- Zibal: panel.zibal.ir
- کاوه‌نگار: kavenegar.com (در حال ثبت‌نام)

## 📞 لینک‌های سریع
- سایت: cafetorshi.ir
- ادمین: cafetorshi.ir/#/admin
- Actions: github.com/mojtabamaniya5-boop/bushehr-kala/actions
- SQL: supabase.com/dashboard/project/slckuoggdkyljvwgtczf/sql/new
- Auth: supabase.com/dashboard/project/slckuoggdkyljvwgtczf/auth/users
- Functions: supabase.com/dashboard/project/slckuoggdkyljvwgtczf/functions
- Storage: supabase.com/dashboard/project/slckuoggdkyljvwgtczf/storage/buckets

## 🤖 پرامپت برای AI جدید
سلام، من صاحب فروشگاه اینترنتی کافه ترشی هستم.
React + Supabase روی GitHub Pages.
این سند MASTER-V3.md رو کامل بخون.

محدودیت‌ها:
- فقط با گوشی (Termux)
- JavaScript نه TypeScript
- نسخه‌های پین: Vite 5.4.11, React 18, Capacitor 6
- بدون VPN

قوانین:
- اول سند، بعد کد
- هر تغییر → commit + push
- Master رو آپدیت کن

وضعیت فعلی: [آپدیت کن]
مشکل فعلی: [بنویس]

ادامه بده.

## 🎯 ترتیب بعدی
1. کاوه‌نگار → API Key → Edge Function send-sms → Login.jsx
2. APK Release + keystore
3. Config متمرکز (shop.js)
4. نمونه‌کار دوم (ابزار آلات)
5. سایت لین‌اپ
6. اینستاگرام
7. اولین مشتری
8. زیبال با VPS

