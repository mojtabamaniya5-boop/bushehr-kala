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
