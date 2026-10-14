# 🏭 سند مادر کافه ترشی — نسخه ۳.۱
> آخرین به‌روزرسانی: ۱۴۰۵/۰۷/۱۸
> وضعیت: فروشگاه فعال + اپ + دامنه + پنل امن + CRM

## 🎯 اطلاعات پروژه
| مورد | مقدار |
|---|---|
| نام | کافه ترشی |
| دامنه | cafetorshi.ir |
| مخزن | github.com/mojtabamaniya5-boop/bushehr-kala |
| Supabase | [SUPABASE_PROJECT_REDACTED] |
| صاحب | مجتبی خسروانی |
| موبایل | [PHONE_REDACTED] |
| کد مالیاتی | [TAX_REDACTED] |
| کارت | [CARD_REDACTED] — مسکن |
| بانک | مجتبی خسروانی |
| ادمین Email | [ADMIN_EMAIL_REDACTED] |
| ربات بله | @cafetorshi / Chat ID: [BALE_CHAT_ID_REDACTED] |
| Zibal Merchant | [ZIBAL_MERCHANT_REDACTED] |

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
- Merchant: [ZIBAL_MERCHANT_REDACTED]
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
- Supabase: supabase.com/dashboard/project/[SUPABASE_PROJECT_REDACTED]
- ادمین: [ADMIN_EMAIL_REDACTED] / [پسورد در یادداشت امن]
- گیتهاب: mojtabamaniya5-boop / [توکن با repo + workflow]
- دامنه: my.irnic.ir
- DNS: panel.arvancloud.ir
- Zibal: panel.zibal.ir
- کاوه‌نگار: kavenegar.com (در حال ثبت‌نام)

## 📞 لینک‌های سریع
- سایت: cafetorshi.ir
- ادمین: cafetorshi.ir/#/admin
- Actions: github.com/mojtabamaniya5-boop/bushehr-kala/actions
- SQL: supabase.com/dashboard/project/[SUPABASE_PROJECT_REDACTED]/sql/new
- Auth: supabase.com/dashboard/project/[SUPABASE_PROJECT_REDACTED]/auth/users
- Functions: supabase.com/dashboard/project/[SUPABASE_PROJECT_REDACTED]/functions
- Storage: supabase.com/dashboard/project/[SUPABASE_PROJECT_REDACTED]/storage/buckets

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


---

## 🔄 آپدیت v3.3 — تصحیح تحلیل SMS (۱۴۰۵/۰۷/۱۹)

### 🎯 مشورت با دوست فنی — تصحیح‌ها

#### ۱) تحلیل فنی خطا
- ❌ **قبلاً نوشته بودیم:** «IP whitelist فعاله»
- ✅ **تصحیح:** `Connection timed out` در سطح TCP = **فیلتر جغرافیایی یا بلاک IP خارجی**
  - whitelist کلید API معمولاً خطای **HTTP 403** می‌ده، نه timeout
  - نتیجه یکی است، ولی گزینه «الف» در تحلیل قبلی دقیق نبود

- ❌ **قبلاً نوشته بودیم:** «کد Edge Function درست کار می‌کنه»
- ✅ **تصحیح:** این هنوز **اثبات نشده** — چون درخواست هرگز به sms.ir نرسید

#### ۲) گزینه‌های رد شده
- ❌ Vercel / Railway / Fly.io → IP خارجی → همون مشکل
- ❌ Supabase Auth OTP → به Twilio/Vonage وصله → با شماره ایرانی مشکل داره
- ❌ Send SMS Hook → باز endpoint ایرانی می‌خواد
- ❌ فراخوانی مستقیم sms.ir از مرورگر → کلید لو می‌ره، اعتبار می‌سوزه
- ❌ Cloudflare Worker → ممنوع (تو همین سند)

#### ۳) راه‌حل تأیید شده
- ✅ **relay Node.js کوچیک روی هاست ایرانی**
  - فقط چند خط کد (Express + fetch)
  - ضعیف‌ترین پلن Liara/Arvan/Hamravesh کافیه
  - ۴۰۰K/ماه **زیاده** برای این کار
- ✅ **Edge Function به‌جای sms.ir، relay رو صدا می‌زنه**
  - با هدر `x-relay-secret`
  - کلید sms.ir فقط روی relay می‌مونه
- ⚠️ **rate limit روی relay اجباریه**
  - که کسی با درخواست الکی اعتبار نسوزونه
- ⚠️ **قبل از پرداخت، تست اتصال**
  - بعضی هاست‌های ایرانی ترافیک خارجی رو فیلتر می‌کنن
  - باید مطمئن شیم مسیر برگشت (Edge Function → relay) بازه

### 🎓 تصمیم استراتژیک (v3.3)

**طبق پیشنهاد دوست فنی:**

> تا مشتری نیومده، هزینه ماهانه سرور نبند.
> MVP: ثبت‌نام با موبایل **بدون OTP**.
> برای پرداخت: **لینک پرداخت** (زرین‌لینک) — نیازی به API و IP ثابت نداره.
> وقتی سفارش‌ها شروع شد، relay رو اضافه کن.

### 📋 پلن جدید

#### مرحله ۱ — MVP (الآن)
- ورود مشتری با **شماره موبایل بدون OTP**
- تأیید دستی ادمین (از پنل)
- کارت‌به‌کارت یا لینک پرداخت
- اینستاگرام + اولین مشتری
- **هزینه: صفر**

#### مرحله ۲ — بعد از ۱۰+ مشتری
- relay Node.js روی Liara (~ارزان‌ترین پلن)
- فعال‌سازی SMS OTP
- انتقال Zibal به relay
- **هزینه: پلن ضعیف Liara**

### 💾 کد relay (برای مرحله ۲ — نگه دار)

```js
import express from "express";
const app = express();
app.use(express.json());

app.post("/sms/verify", async (req, res) => {
  if (req.get("x-relay-secret") !== process.env.RELAY_SECRET)
    return res.sendStatus(401);
  const { mobile, code } = req.body;
  const r = await fetch("https://api.sms.ir/v1/send/verify", {
    method: "POST",
    headers: {
      "x-api-key": process.env.SMSIR_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mobile,
      templateId: 204518,
      parameters: [{ name: "CODE", value: String(code) }],
    }),
  });
  res.status(r.status).json(await r.json());
});
app.listen(process.env.PORT || 3000);

و این برای قرارداد:

```bash
cd ~/bushehr-kala && cat >> AI-CONTRACT.md << 'EOF'

---

## 🆕 قوانین v3.3 — تصمیم MVP

### ۱) سرویس‌های ایرانی — تحلیل دقیق
- ❌ Vercel / Railway / Fly.io → IP خارجی → بلاک جغرافیایی
- ❌ Supabase Auth OTP → Twilio/Vonage → مشکل با شماره ایرانی
- ❌ فراخوانی مستقیم از مرورگر → کلید لو می‌ره
- ✅ relay Node.js روی هاست ایرانی (فقط چند خط)
- ✅ rate limit روی relay اجباری
- ✅ قبل از پرداخت، تست اتصال برگشت

### ۲) استراتژی کلی
**تا مشتری نیومده، هزینه ماهانه سرور نبند.**

- MVP: ثبت‌نام با موبایل بدون OTP
- پرداخت: کارت‌به‌کارت یا لینک پرداخت (زرین‌لینک)
- بعد از ۱۰+ مشتری: relay + SMS + Zibal

### ۳) ممنوعیت‌های جدید
- ❌ پرداخت ماهانه برای سرور بدون مشتری
- ❌ فراخوانی مستقیم سرویس ایرانی از frontend
- ❌ relay بدون rate limit
- ❌ نصب relay روی هاست بدون تست اتصال


---

## 🔄 آپدیت v3.3 — تصحیح تحلیل SMS

### مشورت با دوست فنی — تصحیح‌ها

**۱) تحلیل فنی خطا:**
- قبلاً: IP whitelist فعاله
- تصحیح: Connection timed out در TCP = فیلتر جغرافیایی/بلاک IP خارجی
- whitelist API معمولاً 403 می‌ده، نه timeout

**۲) کد Edge Function:**
- قبلاً: درست کار می‌کنه
- تصحیح: اثبات نشده — درخواست هرگز به sms.ir نرسید

**۳) گزینه‌های رد شده:**
- Vercel / Railway / Fly.io → IP خارجی → همون مشکل
- Supabase Auth OTP → Twilio/Vonage → مشکل با شماره ایرانی
- فراخوانی مستقیم از مرورگر → کلید لو می‌ره

**۴) راه‌حل تأیید شده:**
- relay Node.js کوچیک روی هاست ایرانی (فقط چند خط)
- ضعیف‌ترین پلن Liara/Arvan/Hamravesh کافیه
- ۴۰۰K/ماه زیاده
- rate limit اجباری
- قبل از پرداخت، تست اتصال

### تصمیم استراتژیک

- تا مشتری نیومده، هزینه ماهانه سرور نبند
- MVP: ثبت‌نام با موبایل بدون OTP
- پرداخت: کارت‌به‌کارت یا لینک پرداخت (زرین‌لینک)
- بعد از ۱۰+ مشتری: relay + SMS + Zibal

### کد relay (برای مرحله ۲)

- Express + fetch به sms.ir
- هدر x-relay-secret برای امنیت
- rate limit با express-rate-limit
- کلید sms.ir فقط روی relay
## v3.4 — تجربه‌های SMS

### باگ اصلی: import اشتباه toast
- اشتباه: import toast from '../components/Toast'
- درست: import { toast } from '../components/Toast'
- Toast.jsx هم default component داره هم named toast object

### چک‌های تشخیصی
grep -rn "import toast from" src/
grep -rn "export" src/components/Toast.jsx

### درس‌ها
1. catch نباید به toast وابسته باشه
2. اول imports رو چک کن، بعد معماری
3. curl کار کرد = مشکل کلاینته

---

## 🔄 v3.5 — حل مشکل Supabase 403 + IPv6 (۱۴۰۵/۰۷/۲۱)

### تشخیص درست (تصحیح v3.3)
- ❌ قبلاً گفته شده بود مشکل `Authorization: Bearer` است
- ✅ مشکل واقعی ۱: GRANT نداشتن `service_role` روی `orders`
  - خطا: `42501 permission denied for table orders`
  - راه‌حل: GRANT ALL + ALTER DEFAULT PRIVILEGES روی schema public
- ✅ مشکل واقعی ۲: Node.js در `server.js` IPv6 را ترجیح می‌داد
  - خطا: `ConnectTimeoutError ... supabase.co:443`
  - راه‌حل: `dns.setDefaultResultOrder('ipv4first')` در ابتدای server.js

### تأییدشده
- `apikey` + `Authorization: Bearer` هر دو با هم OK است — نیازی به حذف نیست
- sms.ir از سرور ArvanCloud ([SERVER_IP_REDACTED]) مستقیم کار می‌کند
- relay از سرور به Supabase و sms.ir وصل می‌شود

### SQL اجرا شده (یک‌بار برای همیشه)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;

### نکات باقی‌مانده
- ⚠️ `ERR_ERL_PERMISSIVE_TRUST_PROXY` در لاگ — بعداً `trust proxy = 1` شود
- ⚠️ کلیدهای Supabase/SMSIR/Relay/Zibal که در چت پابلیک شدند باید Rotate شوند


---

## 🔄 v3.5 — حل مشکل Supabase 403 + IPv6 (۱۴۰۵/۰۷/۲۱)

### تشخیص درست (تصحیح v3.3)
- ❌ قبلاً: مشکل `Authorization: Bearer` بود
- ✅ واقعی ۱: GRANT نداشتن `service_role` روی `orders` → خطای `42501`
- ✅ واقعی ۲: Node.js IPv6 را ترجیح می‌داد → `ConnectTimeoutError`

### راه‌حل‌ها
۱) GRANT ALL + ALTER DEFAULT PRIVILEGES روی schema public
۲) `dns.setDefaultResultOrder('ipv4first')` در ابتدای server.js

### تأییدشده نهایی
- `apikey` + `Authorization: Bearer` هر دو با هم OK
- sms.ir از سرور ArvanCloud مستقیم کار می‌کند
- relay /api/send-otp → پیامک واقعی ✅
- relay /zibal/request → trackId + paymentUrl ✅
- relay /zibal/verify → کار می‌کند ✅

### SQL یک‌بار برای همیشه
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;

### باقی‌مانده
- ⚠️ ERR_ERL_PERMISSIVE_TRUST_PROXY → بعداً trust proxy = 1
- 🔴 کلیدها Rotate شوند (پابلیک شدند)


---

## 🔄 v3.6 — RLS امن + RPC (۱۴۰۵/۰۷/۲۱)

### Policyهای نهایی orders
| Policy | cmd | roles |
|---|---|---|
| orders_insert_all | INSERT | public |
| orders_admin_read | SELECT | authenticated |
| orders_admin_update | UPDATE | authenticated |
| orders_admin_delete | DELETE | authenticated |

**حذف شد:** orders_read_all (حفره پابلیک)

### RPCهای امن (SECURITY DEFINER)
- `track_order(p_code, p_phone)` — رهگیری با کد + شماره
- `my_orders(p_phone)` — سفارش‌های مشتری (موقت، تا JWT بیاد)
- `delete_my_order(p_code, p_phone)` — حذف فقط pending/canceled
- `get_order_by_code(p_code)` — برای Pay.jsx

### الگوی فرانت (اجباری)
- ❌ ممنوع: `supabase.from('orders').select(...)` مستقیم
- ✅ درست: `supabase.rpc('...', {...})`

### نکات
- `get_order_by_code` و `my_orders` **آرایه** برمی‌گردونن → `data[0]` لازمه
- `updateOrderPaid` حذف شد — relay با service_role ست می‌کنه

---

## 🔄 v3.8 — JWT Auth (۱۴۰۵/۰۷/۲۳)

### الگوی Auth
- Login: SMS OTP → relay → JWT (HS256, 30d, {mobile})
- ذخیره: localStorage 'auth-token'
- ارسال: Authorization: Bearer <token>
- سرور: requireAuth middleware

### Endpoints جدید relay
- POST /api/my-orders (JWT) → سفارش‌های کاربر
- POST /api/delete-order (JWT) → حذف pending/canceled

### حذف شده از Supabase
- RPC my_orders
- RPC delete_my_order

### باقی‌مانده امنیتی (پایین)
- /api/send-otp هنوز کلید نمی‌خواد (rate limit)
- /api/verify-otp هنوز کلید نمی‌خواد
- get_order_by_code فقط با کد تصادفی

---

## 🔄 v3.9 — رفع باگ پنل ادمین (۱۴۰۵/۰۷/۲۳)

### باگ ۱ — ستون اشتباه در کوئری
- handleStatusChange روی .eq('code', ...) می‌زد ولی id می‌گرفت
- رفع: .eq('id', orderId)

### باگ ۲ — silent fail
- Supabase وقتی RLS/GRANT جلوش رو بگیره، error نمی‌ده
- رفع: .select('id, status') بعد از .update() + چک data.length

### باگ ۳ — GRANT ناقص روی orders
- نقش authenticated برای UPDATE مجوز نداشت
- خطا: 42501 permission denied for table orders
- رفع: GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO authenticated;

### درس طلایی
- RLS != GRANT — هر دو لازمه
- policy بدون GRANT بی‌اثره
- بعد از هر .update() حتماً .select() بزن

---

## 🔄 v3.12 — تصمیم Zibal (۱۴۰۵/۰۷/۲۳)

### چرا Zibal را عوض نمی‌کنیم
- rotate خودکار وجود ندارد
- غیرفعال کردن درگاه = چند روز/هفته توقف پرداخت

### چرا امنیت کافیه
- merchant domain-locked به cafetorshi.ir
- IP whitelist: فقط [SERVER_IP_REDACTED]
- فرانت فقط از relay استفاده می‌کنه
- Edge Functions زائد پاک شدن

### درس طلایی
- قبل از گرفتن درگاه، شرایط rotate رو بپرس
- درگاه ایرانی = سیاست سفت
