# 📜 تاریخچه تغییرات — کافه ترشی

> هر تغییر مهمی که انجام می‌دیم اینجا ثبت می‌شه.
> آخرین به‌روزرسانی: ۱۴۰۵/۰۷/۲۱

---

## 🚨 اولویت‌های باقی‌مانده (یادت نره!)

### 🔴 فوری — امنیت
- [ ] **Rotate کلیدها** (چون تو چت پابلیک شدن):
      SUPABASE_SERVICE_KEY, SMSIR_API_KEY, RELAY_SECRET, ZIBAL_MERCHANT
- [ ] **JWT برای login** — جایگزین localStorage
      - relay /verify-otp → JWT امضاشده
      - RPCها JWT بخوان
- [ ] **انتقال INSERT orders به relay** (ضد spam)

### 🟠 متوسط — UX
- [ ] فیلتر پنل ادمین (تب pending/paid/sent کار نمی‌کنه)
- [ ] ساعت در کارت سفارش پنل ادمین
- [ ] trust proxy = 1 در server.js (پاک کردن warning)

### 🟡 پایین
- [ ] APK Release + keystore
- [ ] Config متمرکز (shop.js) برای پکیج فروش
- [ ] README کامل برای فروش
- [ ] نمونه‌کار دوم
- [ ] سایت Lianapp
- [ ] اینستاگرام + اولین مشتری

---

## ۱۴۰۵/۰۷/۲۱ — v3.6 (RLS Security)

### امنیت
- ساخت ۴ تابع RPC در Supabase:
  - `track_order(p_code, p_phone)` — رهگیری امن
  - `my_orders(p_phone)` — سفارش‌های من (موقت)
  - `delete_my_order(p_code, p_phone)` — حذف امن
  - `get_order_by_code(p_code)` — Pay.jsx
- حذف policy `orders_read_all` (حفره پابلیک)
- اضافه policy `orders_admin_read` برای authenticated

### فرانت
- `Track.jsx`: supabase.from() → rpc('track_order')
- `MyOrders.jsx`: delete مستقیم → rpc('delete_my_order')
- `orders.js`: fetchUserOrders → rpc('my_orders')
- `orders.js`: fetchOrderById → rpc('get_order_by_code')
- `orders.js`: fix data[0] برای آرایه
- `Verify.jsx`: حذف alert DEBUG
- `Verify.jsx`: حذف import + call updateOrderPaid (relay خودش paid می‌کنه)

### Commit
- `b75e100` security: RLS orders
- `7e3cdea` chore: حذف .bak

---

## ۱۴۰۵/۰۷/۲۱ — v3.5 (Supabase 403 + IPv6)

### حل شد
- GRANT ALL + ALTER DEFAULT PRIVILEGES → service_role
  (خطای 42501 permission denied)
- `dns.setDefaultResultOrder('ipv4first')` در server.js
  (حل ConnectTimeoutError به Supabase)

### تأیید شد
- sms.ir از ArvanCloud مستقیم OK
- apikey + Bearer هر دو با هم OK
- relay /api/send-otp → پیامک واقعی
- relay /zibal/request → trackId + URL
- relay /zibal/verify → 200

### نکات مهم
- تشخیص قبلی (Bearer مشکل داره) **غلط بود**
- مشکل واقعی: GRANT + IPv6

---

## ۱۴۰۵/۰۷/۱۸ — v3.4 (SMS + Toast bug)

### حل شد
- import اشتباه toast:
  - غلط: `import toast from '../components/Toast'`
  - درست: `import { toast } from '../components/Toast'`

---

## ۱۴۰۵/۰۷/۱۸ — v3.3 (تصمیم MVP)

### استراتژی
- تا مشتری نیومده، هزینه ماهانه سرور نبند
- MVP: ثبت‌نام با موبایل بدون OTP
- پرداخت: کارت‌به‌کارت یا لینک پرداخت
- بعد از ۱۰+ مشتری: relay + SMS + Zibal

---

## قبل از v3.3
- سایت روی cafetorshi.ir + HTTPS
- محصولات از Supabase
- سبد خرید + علاقه‌مندی
- تسویه + کارت‌به‌کارت
- اطلاع بله با pg_net
- پنل ادمین + CRM
- Track امن + Rate Limit
- کد رهگیری پستی
- PWA + APK debug
- اینماد

---

## 📌 قوانین ثبت تغییرات

هر تغییر مهم → اینجا با تاریخ ثبت شه.
هر چت جدید باز شد → این فایل رو با CHANGELOG + HANDOFF + MASTER بفرست.

### قالب:

---

## ۱۴۰۵/۰۷/۲۲ — v3.7 (Rotate کلیدها + trust proxy)

### امنیت — Rotate
- ✅ SMSIR_API_KEY (sms.ir)
- ✅ SUPABASE_SERVICE_KEY (Supabase → کلید جدید sb_secret_2s_...)
- ✅ RELAY_SECRET (openssl معادل: python secrets.token_hex)
- ⏸️ ZIBAL_MERCHANT (عقب افتاد — IP whitelist)

### سرور
- trust proxy: true → 1
  - رفع ERR_ERL_PERMISSIVE_TRUST_PROXY
  - Rate limit دیگر قابل دور زدن نیست

### کشف جدید امنیتی
- 🔴 /api/send-otp و /api/verify-otp هدر x-relay-secret را چک نمی‌کنند
- فرانت Login.jsx هم این هدر را نمی‌فرستد (invokeRelay بدون هدر)
- راه‌حل: JWT در نسخه بعدی

### Commit
- (منتظر push)

---

## ۱۴۰۵/۰۷/۲۳ — v3.8 (JWT Login + امنیت)

### امنیت — JWT
- relay: jsonwebtoken نصب، JWT_SECRET در .env
- server.js: signToken + requireAuth middleware
- verify-otp → توکن JWT (30 روز) برمی‌گردونه
- endpoint جدید: /api/my-orders (JWT protected)
- endpoint جدید: /api/delete-order (JWT protected)
- حذف RPC پابلیک my_orders و delete_my_order
- حفظ track_order و get_order_by_code (کد تصادفی)

### فرانت
- auth.js: getToken/setToken/clearToken + loginUser(token)
- Login.jsx: ذخیره JWT بعد از verify
- orders.js: fetchUserOrders → relay /api/my-orders
- orders.js: deleteOrder جدید → relay /api/delete-order
- MyOrders.jsx: استفاده از deleteOrder

### Commit
- 3fbd39a feat: JWT login

---

## ۱۴۰۵/۰۷/۲۳ — v3.9 (دیباگ پنل ادمین — تغییر status)

### حل شد
- باگ در `handleStatusChange` (`src/pages/Admin.jsx`):
  - قبلاً: کوئری روی `.eq('code', q)` + فقط چک `error` → silent fail
  - الان: کوئری روی `.eq('id', orderId)` + `.select()` برای تشخیص آپدیت واقعی
  - اگه `data.length === 0` → توست «آپدیت نشد — لاگین نیستی یا policy»

### GRANT (Supabase)
- افزودن: `GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO authenticated`
- خطای قبلی: `permission denied for table orders` (42501)
- علت: نقش `authenticated` فقط SELECT/INSERT/DELETE داشت، UPDATE نداشت

### Commit
- `60a3dce` fix(admin): status update via id + silent-fail detect

### نکته امنیتی
- policy بدون GRANT کار نمی‌کنه
- RLS ≠ GRANT — هر دو لازمه

---

## ۱۴۰۵/۰۷/۲۳ — v3.10 (ساعت کارت سفارش + پاک‌سازی)

### افزوده شد
- ساعت + تاریخ در کارت سفارش پنل ادمین (`src/pages/Admin.jsx`)
- فرمت: `toLocaleString('fa-IR', { dateStyle: 'short', timeStyle: 'short' })`

### پاک‌سازی
- حذف `.bak2`های باقی‌مانده از مخزن:
  - `src/pages/Login.jsx.bak2`
  - `src/pages/MyOrders.jsx.bak2`
  - `src/utils/orders.js.bak2`
- `.gitignore`: `*.bak*` اضافه شد

### Commit
- `5e347f1` feat(admin): اضافه شدن ساعت به کارت سفارش
- `a5476b2` chore: حذف .bak2 های باقی‌مونده

---

## ۱۴۰۵/۰۷/۲۳ — v3.11 (پاک‌سازی Zibal + Edge Functions)

### پاک‌سازی شد
- Supabase Edge Functions زائد حذف شد:
  - `smart-function` (نمایشی: zibal-verify)
  - `rapid-function` (نمایشی: zibal-request)
  - دلیل: کد مرده (0 invocation)، IP آمازون → رد توسط زیبال (خطای ۱۱۵)
- IPهای ناشناس از whitelist زیبال حذف شد:
  - `3.75.226.17` (AWS)
  - `18.184.220.124` (AWS)
- فقط `[SERVER_IP_REDACTED]` (سرور آروان) در whitelist موند

### تیکت زده شد
- درخواست Rotate برای `ZIBAL_MERCHANT` به پشتیبانی زیبال
- منتظر کلید جدید

### تأیید شد
- فرانت فقط از relay (`https://relay.cafetorshi.ir`) استفاده می‌کنه
- مسیر پرداخت: Frontend → relay (Arvan) → Zibal
- Supabase Edge Functions نقشی در پرداخت ندارن

---

## ۱۴۰۵/۰۷/۲۳ — v3.11 (پاک‌سازی Zibal + Edge Functions)

### پاک‌سازی شد
- Supabase Edge Functions زائد حذف شد:
  - `smart-function` (نمایشی: zibal-verify)
  - `rapid-function` (نمایشی: zibal-request)
  - دلیل: کد مرده (0 invocation)، IP آمازون → رد توسط زیبال (خطای ۱۱۵)
- IPهای ناشناس از whitelist زیبال حذف شد:
  - `3.75.226.17` (AWS)
  - `18.184.220.124` (AWS)
- فقط `[SERVER_IP_REDACTED]` (سرور آروان) در whitelist موند

### تیکت زده شد
- درخواست Rotate برای `ZIBAL_MERCHANT` به پشتیبانی زیبال
- منتظر کلید جدید

### تأیید شد
- فرانت فقط از relay (`https://relay.cafetorshi.ir`) استفاده می‌کنه
- مسیر پرداخت: Frontend → relay (Arvan) → Zibal
- Supabase Edge Functions نقشی در پرداخت ندارن

---

## ۱۴۰۵/۰۷/۲۳ — v3.13 (برگشت RPCهای my_orders)

### باگ
- پس از حذف RPC `my_orders` و `delete_my_order` در v3.8،
  relay همچنان `rpc/my_orders` را صدا می‌زد → 404 → پنل کاربر خالی
- علامت: پنل ادمین سفارش‌ها را نشان می‌داد ولی «سفارش‌های من» خالی بود

### راه‌حل
- برگرداندن دو تابع RPC با GRANT فقط به service_role:
  - `my_orders(p_phone text)` → RETURNS SETOF orders
  - `delete_my_order(p_code text, p_phone text)` → RETURNS boolean
- REVOKE از PUBLIC/anon/authenticated
- GRANT EXECUTE فقط به service_role

### درس طلایی
- وقتی RPC/endpoint پاک می‌شود، حتماً grep کن که مصرف‌کننده باقی نمانده
- relay باید همراه تغییرات Supabase آپدیت شود

---

## ۱۴۰۵/۰۷/۲۳ — v3.14 (APK Release + callbackUrl fix)

### حل شد
- ✅ ساخت keystore (cafetorshi-release.keystore, 2752 bytes)
- ✅ ۴ سکرت GitHub: KEYSTORE_BASE64/PASSWORD + KEY_ALIAS/PASSWORD
- ✅ workflow آپدیت شد: `assembleRelease` + امضا
- ✅ APK Release ساخته شد (7.16 MB)
- ✅ آیکون درست نصب شد
- ✅ callbackUrl هارد‌کد شد به `https://cafetorshi.ir/#/verify?orderId=...`

### باگ اصلی — callback در اپ
- ❌ قبل: `${window.location.origin}${window.location.pathname}#/verify?...`
- در Capacitor می‌شد `https://localhost/#/verify` → خطا
- ✅ بعد: هارد‌کد `https://cafetorshi.ir/#/verify?orderId=...`
- فایل: `src/pages/Pay.jsx:58`
- Commit: `2c2c9ad`

### تست موفق
- خرید از اپ → زیبال → cafetorshi.ir → پرداخت موفق ✅
- سفارش QFE81N auto paid شد

### باقی‌مانده
- Deep Link (برگشت از مرورگر به اپ) — بعد از اولین مشتری
- APK Release در GitHub Releases (اگه بخوای)


---

## ۱۴۰۵/۰۷/۲۳ — v3.15 (fix پنل ادمین + GRANT + TTL)

### حل شد
- GRANT روی products: authenticated مجوز UPDATE/INSERT/DELETE گرفت
- Admin.jsx: `.select()` + چک `data.length` در save/delete
- TTL محصولات: ۱ ساعت → ۲ دقیقه

### Commit
- see1543 fix(products): TTL ۲ دقیقه
- 51edf4f fix(admin): select + data check در save/delete محصولات


---

## ۱۴۰۵/۰۷/۲۴ — v3.16 (تنظیمات فروشگاه از Supabase)

### افزوده
- جدول `shop_settings` (تک‌ردیفه) در Supabase
- `src/api/shop.js`: getShopSettings() + cache 2min + fallback
- GRANT SELECT/INSERT/UPDATE/DELETE ON shop_settings TO authenticated
- RLS: read for all, write for authenticated

### تغییر
- `calculateShipping` پارامتر `settings` گرفت
- Checkout.jsx و Cart.jsx از DB می‌خونن (نه SHOP_INFO)

### Commit
- `c9082f7` feat: تنظیمات فروشگاه از Supabase

---

## ۱۴۰۵/۰۷/۲۴ — v3.17 (تب تنظیمات پنل ادمین)

### افزوده
- `src/pages/AdminSettings.jsx` (فرم کامل)
- `src/ErrorBoundary.jsx` (برای دیباگ موبایل)
- تب «تنظیمات» در پنل ادمین

### حل باگ مهم
- 🐛 **ReferenceError: shopSettings is not defined**
  - علت: state در `Admin` تعریف شده بود ولی `Dashboard` می‌خواستش
  - Fix: انتقال state به `Dashboard`
- 🐛 **TabBtn 4th ناپدید**
  - Fix: `flex-wrap` روی ردیف تب‌ها

### Commit
- `43da1e3` feat(admin): تب تنظیمات
- `9f6ac3b` fix(admin): flex-wrap
- `927f9ff` debug: ErrorBoundary

---

## ۱۴۰۵/۰۷/۲۴ — v3.18 (Profile از DB + SEO)

### تغییر
- Profile.jsx از `shopSettings` می‌خونه (نه SHOP_INFO)
- index.html: عنوان «کافه ترشی | فروشگاه آنلاین ترشی خانگی بوشهر»
- description SEO آپدیت

### Commit
- `dadad48` fix: Profile از تنظیمات DB + SEO

---

## 🎓 درس‌های طلایی جدید (v3.16-v3.18)

9. **State hierarchy در React** — state باید در parent تعریف شه که همه children ببینن
10. **ErrorBoundary** — سریع‌ترین راه دیباگ روی موبایل بدون DevTools
11. **GitHub Pages از `docs/`** می‌خونه — `pnpm build` + `git add .` با هم
12. **CallbackUrl در Capacitor** — هارد‌کد به دامنه (نه window.location)
13. **Cache PWA** — بعد هر build، باید در مرورگر clear شه

## ۱۴۰۵/۰۷/۲۴ — v3.16-v3.18
- جدول shop_settings در Supabase
- تب تنظیمات پنل ادمین (AdminSettings.jsx)
- ErrorBoundary برای دیباگ موبایل
- Profile.jsx از DB (نه SHOP_INFO)
- SEO عنوان + توضیحات

## v3.20 (۱۴۰۵/۰۷/۲۵)
- غیرفعال‌سازی کش HTTP مرورگر برای Supabase (cache: no-store).
- بهینه‌سازی Polling با focus و visibilitychange.
- تصمیم: مشکل Polling و آپدیت لحظه‌ای برای آینده (بعد از ۱۰ مشتری) به تعویق افتاد.

## v3.21 (۱۴۰۵/۰۷/۲۶)
- امنیت پرداخت: حذف پارامتر amount از فرانت‌اند (Pay.jsx).
- امنیت سرور: محاسبه قیمت نهایی در Relay (Node.js) با خواندن مستقیم از Supabase.

---

## ۱۴۰۵/۰۷/۲۶ — v3.22 (Config مرکزی قالب)

### افزوده
- `src/config/shop.js` — SHOP_CONFIG (تک‌منبع حقیقت)
- ساختار ۸ بخشی: برند، تم، SEO، تماس، پرداخت، ارسال، فیچرها، سرویس‌ها

### تغییر
- `api/shop.js`: fallback از SHOP_INFO → SHOP_CONFIG

### Commit
- `fec3d99` feat(config): مرکزی‌سازی تنظیمات قالب

### باقی‌مانده (فروش قالب)
- مهاجرت ۱۰ مصرف‌کننده SHOP_INFO → SHOP_CONFIG
- فیکس Checkout shipping price از DB
- README-CLIENT.md
- همگام‌سازی index.html + tailwind.config.js

---

## ۱۴۰۵/۰۷/۲۶ — v3.22.1 (فیکس هزینه ارسال Checkout)
- Checkout.jsx: قیمت ارسال سریع و عادی از دیتابیس (shopSettings) خوانده می‌شود.

---

## ۱۴۰۵/۰۷/۲۶ — v3.22.2 (مهاجرت کامل به SHOP_CONFIG)
- حذف ۱۱ ایمپورت مستقیم SHOP_INFO از کامپوننت‌ها و صفحات.
- هدایت تمام صفحات به SHOP_CONFIG در راستای فروش قالب.
- کامیت: 47c1aa9

---

## ۱۴۰۵/۰۷/۲۶ — بازگشت به عقب (Revert Theme System)
- سیستم تم پویا (Dynamic Theme) به دلیل به هم ریختن ساختار UI و کنتراست رنگ‌ها موقتاً غیرفعال شد.
- تمام صفحات (Profile, Home, BottomNav, App) به حالت اصلی (کرم و سبز) بازگشتند.
- منوی انتخاب تم از پنل ادمین حذف شد.
- درس طلایی: تغییر ساختار رنگ‌ها روی یک سایت زنده، بدون بازنویسی کامل کامپوننت‌ها و بررسی UI/UX، منجر به شکست می‌شود.
- کامیت: 7dfa4ed

---

## ۱۴۰۵/۰۷/۲۷ — v3.25 (پایان باگ‌های زیرساختی و پرداخت)
- حل کامل مشکل مسیرهای پیامک (send-otp و verify-otp) روی سرور Relay.
- حل مشکل CORS و Trust Proxy برای ارتباط سایت با سرور.
- حل مشکل پاسخ‌دهی زیبال و ترجمه خروجی برای فرانت‌اند.
- حل مشکل پارامترهای HashRouter در صفحه Verify.
- اضافه شدن مسیر /api/my-orders به سرور و پاکسازی کش محلی.
- تست نهایی: خرید -> پرداخت -> تایید -> پنل ادمین -> پنل کاربر (همه موفق).

---

## ۱۴۰۵/۰۷/۲۸ — v3.26 (مدیریت موجودی انبار)
- اضافه شدن سیستم کاهش خودکار موجودی در سرور (بعد از پرداخت موفق).
- جلوگیری از افزودن محصولات ناموجود به سبد خرید در ProductCard.
- جلوگیری از افزایش تعداد بیشتر از موجودی در Cart.
- تست موفق کاهش موجودی از ۸ به ۷ در دیتابیس.

## آپدیت v4.1 (۱۴۰۵/۰۷/۳۰)
- مهاجرت کامل به سرور آروان (IP: 85.198.55.141)
- اصلاح CORS برای سازگاری با Safari (iOS)
- اصلاح callbackUrl برای پرداخت با BrowserRouter
- رفع باگ React #300 در سبد خرید (جابجایی useEffect)

## آپدیت v4.2 (۱۴۰۵/۰۷/۳۰)
- اضافه شدن بنر تبلیغاتی و لوگوی داینامیک (از پنل ادمین).
- فیکس کامل منطق ارسال رایگان (آستانه، بوشهر، تیک ادمین).
- رفع باگ‌های React در سبد خرید و پنل ادمین (تداخل کلیدها).
- **امنیت:** تغییر کلیدهای JWT، SMS.ir و Supabase (Rotate کامل).

---

## آپدیت v4.3 (۱۴۰۵/۰۷/۳۰)
- رفع مشکل تایپ اعداد فارسی در لاگین (پشتیبانی از کیبورد آیفون).
- حذف هدر x-relay-secret از فرانت‌اند برای امنیت بیشتر.
- اضافه شدن نمایش خطای دقیق در صفحه لاگین.
- فیکس نهایی کدهای تکراری در پنل ادمین (banner_url).

---

## ۱۴۰۵/۰۷/۳۰ — v4.4 (رفع باگ iOS)

### حل شد
- iOS Safari «موبایل معتبر نیست» → حل
- فیکس دو لایه (فرانت + سرور)
- تست curl ۴ حالت (فارسی/عربی/+98/RLM) — همه ✅
- تست واقعی iPhone ✅

### فایل‌ها
- `src/utils/auth.js`
- `src/pages/Login.jsx`
- `/root/relay/server.js`

### Commit
`c301db2` fix(login): normalize persian/arabic digits for iOS Safari

### باگ باقی‌مانده v4.5
`send-otp` همیشه `{ok:true}` — باید `status` را چک کند

---

## ۱۴۰۵/۰۷/۳۰ — v4.4.1 (performance + deploy pipeline)

### حل شد
- Nginx cache: assets ۱ ساله immutable، index no-cache
- **gzip فعال:** JS 848KB → **239KB** (-۷۲٪)
- حذف recharts (dead code) + @types/react
- lockfile ساخته شد
- فیکس duplicate `banner_url` در Admin.jsx
- **deploy.sh** با rsync + chmod/chown + verify خودکار
- باگ 403 بعد از deploy: mode 0600 → fix
- open_file_cache برای nginx

### حادثه مشکوک
- بین ۱۸:۰۳ و ۱۸:۱۰ فایل‌ها به نسخه قدیمی برگشتند (علت نامشخص)
- با rsync دوباره fix شد
- deploy.sh حالا verify دارد

---

## ۱۴۰۵/۰۷/۳۰ — v4.4.2 (cron race condition)

### کشف
- /root/update-site.sh هر ۱۰ دقیقه از cron اجرا می‌شد
- git fetch از سرور ایران گاهی ۱۳۰s hang می‌کرد
- بدون set -e با کد قدیمی build می‌کرد → hash قدیمی → 403

### حل
- set -e + timeout 25 روی git fetch
- Fallback: اگر GitHub unreachable → perms fix only
- chown www-data + chmod همیشه
- pnpm install --frozen-lockfile

### نتیجه
- سایت بعد از ۳ دقیقه پایدار: 200 + hash یکسان

---

## ۱۴۰۵/۰۷/۳۰ — v4.5.0 (CRM + Source Tracking)

### افزوده شد
- **CRM کامل** در `AdminCustomers.jsx`:
  - فیلتر منابع ورودی (گوگل، ترب، اینستاگرام، تلگرام، واتساپ، مستقیم)
  - نمایش درصد هر منبع
  - جزئیات مشتری با اولین و آخرین منبع
- **منبع ورودی (Source Tracking)**:
  - `src/utils/source.js` — capture UTM + Referrer
  - ذخیره در `localStorage` هنگام ورود
  - ارسال به Supabase در `saveOrderToDB`

### فایل‌ها
- `src/utils/source.js` (جدید)
- `src/utils/customers.js` (aggregate source)
- `src/utils/supabase.js` (insert source)
- `src/pages/AdminCustomers.jsx` (UI جدید)
- `src/main.jsx` (captureSource)

### SQL
- `ALTER TABLE orders ADD source, utm_source, utm_medium, utm_campaign`

---

## ۱۴۰۵/۰۷/۳۰ — v4.5.1 (fix send-otp error handling)

### حل شد
- relay دیگر همیشه `{ok:true}` برنمی‌گرداند.
- پاسخ sms.ir چک می‌شود (`status === 1`).
- اگر پیامک ارسال نشود، کاربر خطای واقعی می‌بیند.

---

## ۱۴۰۵/۰۷/۳۰ — v4.6.0 (فیلتر و جستجوی سفارشات)

### افزوده شد
- فیلتر وضعیت در پنل ادمین (در انتظار، پرداخت شده، ارسال شده...)
- جستجو با نام، شماره موبایل یا کد سفارش
- نمایش گرافیکی بهتر برای حالت خالی بودن نتایج

### فایل‌ها
- `src/pages/Admin.jsx`

---

## ۱۴۰۵/۰۷/۳۰ — v4.6.1 (پاکسازی منوی همبرگری)

### تغییرات
- حذف بخش «پرداخت آنلاین (زیبال)» از منوی Roadmap
- حذف بخش «پنل مشتری با ورود موبایل» از منوی Roadmap
- حذف بلوک «تماس تلفنی» از منوی ارتباط سریع

### فایل‌ها
- `src/components/Drawer.jsx`

---

## ۱۴۰۵/۰۷/۳۰ — v4.6.2 (بهینه‌سازی صفحه محصول)

### تغییرات
- ارتفاع عکس محصول محدود به ۳۰۰ پیکسل شد (به جای مربع تمام‌صفحه).
- توضیحات محصول به صورت پیش‌فرض ۳ خط نمایش داده می‌شود و دکمه «مشاهده بیشتر» اضافه شد.

---

## ۱۴۰۵/۰۷/۳۰ — v4.6.3 (بازطراحی UI توضیحات محصول)

### تغییرات
- افزایش خوانایی متن با فونت ۱۳ و فاصله خطوط بیشتر.
- اضافه شدن افکت محو شدن (Gradient) پایین متن در حالت بسته.
- تبدیل دکمه «مشاهده بیشتر» به یک دکمه تمام‌عرض زیبا.

---

## ۱۴۰۵/۰۷/۳۰ — v4.6.4 (پالایش UI)

### تغییرات
- هدر سایت از حالت شیشه‌ای (Blur) به سفید یکدست تغییر کرد تا هنگام اسکرول، متن‌ها به زیبایی زیر آن پنهان شوند.
- اندازه فونت توضیحات محصول کوچک‌تر شد (12px) و به ۲ خط کاهش یافت تا خسته‌کننده نباشد.

---

## ۱۴۰۵/۰۷/۳۰ — v4.6.5 (فیکس قطعی هدر)

### تغییرات
- هدر از حالت شیشه‌ای به رنگ کرم یکدست تغییر کرد (z-index به 50 افزایش یافت).
- فاصله بالای صفحه محصول تنظیم شد تا با هدر تداخل نداشته باشد.

---

## ۱۴۰۵/۰۷/۳۰ — v4.6.6 (اصلاح رنگ هدر)

### تغییرات
- رنگ هدر از سفید خالص به کرم اصلی تم سایت (#FFF8E8) تغییر کرد تا با بک‌گراند همخوانی داشته باشد.

---

## ۱۴۰۵/۰۷/۳۰ — v4.6.7 (فیکس اسکرول صفحه محصول)

### تغییرات
- حل باگ حفظ موقعیت اسکرول (Scroll Restoration) در صفحه محصول.
- حالا هر بار که کاربر روی یک محصول کلیک می‌کند، صفحه به طور خودکار به بالا (عکس محصول) اسکرول می‌شود.

---

## ۱۴۰۵/۰۷/۳۰ — v4.6.2 تا v4.6.7 (پالایش UI/UX صفحه محصول)

### تغییرات
- محدود کردن ارتفاع عکس محصول به ۳۰۰ پیکسل.
- اضافه شدن باکس توضیحات با قابلیت "مشاهده بیشتر" و خطوط محدود (line-clamp).
- اصلاح رنگ هدر به کرم اصلی سایت برای همخوانی با تم.
- فیکس باگ حفظ موقعیت اسکرول (Scroll Restoration) در صفحه محصول (استفاده از window.scrollTo در useEffect).

---

## ۱۴۰۵/۰۷/۳۰ — v4.6.8 (حفظ قالب‌بندی توضیحات محصول)

### تغییرات
- اضافه شدن کلاس whitespace-pre-line به متن توضیحات در صفحه محصول.
- حالا خطوط جدید (Enter) و قالب‌بندی‌هایی که ادمین در پنل وارد می‌کند، دقیقاً در سایت هم نمایش داده می‌شود.

---

## ۱۴۰۵/۰۷/۳۰ — v4.7.1 (فیکس باگ toEnDigits is not defined)

### تغییرات
- اضافه شدن صحیح ایمپورت `toEnDigits` به `Checkout.jsx` و `products.js`.

---

## ۱۴۰۵/۰۷/۳۰ — v4.7.2 (افزودن گزینه تیپاکس پس‌کرایه)

### تغییرات
- افزودن گزینه «تیپاکس (پس‌کرایه)» به روش‌های ارسال.
- اضافه شدن فیلد `postPaid` به خروجی `calculateShipping`.
- ساخت باکس آبی اختصاصی برای توضیح پس‌کرایه در Checkout.

---

## ۱۴۰۵/۰۷/۳۰ — v4.7.3 (بهبود UI روش‌های ارسال)

### تغییرات
- حذف گزینه «ارسال عادی» از صفحه پرداخت.
- تغییر نام «ارسال سریع» به «پست پیشتاز (پرداخت آنلاین)».
- حل باگ عدم امکان تغییر نظر: دکمه‌های انتخاب حالا همیشه قابل مشاهده هستند و کاربر می‌تواند بین پیشتاز و پس‌کرایه جابجا شود.
- باکس آبی راهنمای پس‌کرایه به زیر دکمه‌ها منتقل شد.

---

## ۱۴۰۵/۰۷/۳۰ — v4.7.5 (تکمیل فیلد شهر در فرم)

### تغییرات
- فیلد شهر با موفقیت به UI اضافه شد.
- ذخیره نام شهر در حافظه محلی برای خریدهای بعدی.

---

## ۱۴۰۵/۰۷/۳۰ — v4.7.7 (داینامیک کردن شهرهای رایگان)

### تغییرات
- حذف فیلد «ارسال عادی» از پنل ادمین (چون از سایت حذف شد).
- تغییر نام «ارسال سریع» به «هزینه پست پیشتاز».
- منطق `calculateShipping` حالا از آرایه `freeShippingCities` (شهرهای رایگان) در پنل ادمین می‌خواند (به همراه فال‌بک برای بوشهر).

---

## ۱۴۰۵/۰۷/۳۰ — v4.6.8 تا v4.7.7 (سیستم ارسال پیشرفته)

### تغییرات کلیدی
- **ارقام فارسی:** ساخت `digits.js` و استفاده از `toEnDigits` در کد پستی و موبایل.
- **پس‌کرایه تیپاکس:** اضافه شدن گزینه تیپاکس (پس‌کرایه) و فیلد `postPaid` به منطق ارسال.
- **UI ارسال:** حذف ارسال عادی، تغییر نام به «پست پیشتاز»، و رفع باگ عدم امکان تغییر نظر در Checkout.
- **فیلد شهر:** اضافه شدن فیلد «شهر» به فرم تسویه حساب.
- **شهرهای رایگان:** داینامیک شدن شهرهای رایگان (خواندن از `freeShippingCities` در دیتابیس) به جای هاردکد کردن «بوشهر».
- **پنل ادمین:** حذف فیلد ارسال عادی از تنظیمات و تغییر نام ارسال سریع به پست پیشتاز.
- **صفحه محصول:** حفظ قالب‌بندی متن (خطوط جدید) با `whitespace-pre-line`.

---

## ۱۴۰۵/۰۷/۳۰ — v4.7.8 (بهبود UX صفحه تسویه حساب)

### تغییرات
- اضافه شدن باکس بازشونده (Accordion) برای مشاهده اقلام سفارش در بالای فرم.
- جلوگیری از استرس مشتری با نمایش خلاصه سفارش قبل از پر کردن فرم.
- فیکس باگ شناور شدن دکمه ثبت سفارش روی فیلد آدرس و یادداشت با افزایش padding-bottom.

---

## ۱۴۰۵/۰۷/۳۰ — v4.7.8 (بهبود UX صفحه تسویه حساب)

### تغییرات
- اضافه شدن باکس بازشونده (Accordion) برای مشاهده اقلام سفارش در بالای فرم.
- فیکس باگ شناور شدن دکمه ثبت سفارش روی فیلد آدرس و یادداشت.

---

## ۱۴۰۵/۰۷/۳۰ — v4.7.9 (فیکس نهایی بیلد گیت‌هاب)

### تغییرات
- اضافه شدن فایل `digits.js` به مخزن گیت (که باعث خطای `Could not resolve` در بیلد APK شده بود).
- هر دو ورک‌فلو (سایت و اپلیکیشن اندروید) حالا با موفقیت (سبز) اجرا می‌شوند.
