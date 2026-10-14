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
