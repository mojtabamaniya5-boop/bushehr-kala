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

---

## 🔄 v3.13 — RPCهای فعال relay (۱۴۰۵/۰۷/۲۳)

### RPCهای مورد نیاز relay
- `my_orders(p_phone)` → برای /api/my-orders
- `delete_my_order(p_code, p_phone)` → برای /api/delete-order
- `track_order(p_code, p_phone)` → برای Track.jsx
- `get_order_by_code(p_code)` → برای Pay.jsx

### قوانین
- RPCهای حساس: فقط GRANT EXECUTE به service_role
- اگه RPC جدیدی حذف شد → grep در /root/relay/server.js
- relay = مصرف‌کننده اصلی RPCها

---

## 🔄 v3.14 — APK Release + callbackUrl fix (۱۴۰۵/۰۷/۲۳)

### keystore
- فایل: `cafetorshi-release.keystore` (2752 bytes)
- Alias: cafetorshi
- Validity: 10000 days (~27 سال)
- SHA1: 6C:0F:10:98:3C:5B:03:59:9B:62:A7:17:38:06:98:94:EB:2B:70:7B
- ⚠️ پسورد در ایمیل + یادداشت امن (نه در اسناد)

### GitHub Secrets (۴ عدد)
- KEYSTORE_BASE64 — محتوای base64 keystore
- KEYSTORE_PASSWORD — پسورد keystore
- KEY_ALIAS — cafetorshi
- KEY_PASSWORD — پسورد key

### Workflow Release
- `pnpm exec cap add android`
- `./gradlew assembleRelease`
- Output: `app-release.apk` (7.16 MB)
- Artifact: `cafetorshi-release-apk`

### باگ callbackUrl
- فایل: `src/pages/Pay.jsx` خط ۵۸
- قبل: `${window.location.origin}${window.location.pathname}#/verify?orderId=...`
- بعد: `https://cafetorshi.ir/#/verify?orderId=...`
- علت: Capacitor آدرس `localhost` می‌ده، زیبال نمی‌تونه برگرده


---

## 🔄 v3.15 — fix پنل ادمین محصولات (۱۴۰۵/۰۷/۲۳)

### GRANT products
- authenticated: SELECT + INSERT + UPDATE + DELETE
- SQL: GRANT SELECT, INSERT, UPDATE, DELETE ON products TO authenticated;

### TTL products
- src/api/products.js خط ۵: 60*60*1000 → 2*60*1000


---

## 🔄 v3.16-v3.18 — تنظیمات فروشگاه از DB (۱۴۰۵/۰۷/۲۴)

### جدول shop_settings (تک‌ردیفه)
```sql
CREATE TABLE shop_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name text, tagline text, phone text, telegram text, address text,
  card_number text, card_holder text, card_bank text,
  shipping_fast int, shipping_normal int, free_shipping_from int,
  free_shipping_cities text[], same_day_cities text[],
  free_postal_prefixes text[],
  updated_at timestamptz DEFAULT now()
);
GRANT SELECT ON shop_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON shop_settings TO authenticated;
```

فایل‌های جدید

· src/api/shop.js — getShopSettings() + clearShopCache() (cache 2min)
· src/pages/AdminSettings.jsx — فرم تنظیمات
· src/ErrorBoundary.jsx — گرفتن خطاها

فایل‌های آپدیت

· src/data/products.js — calculateShipping(…, settings)
· src/pages/Checkout.jsx — از DB می‌خونه
· src/pages/Cart.jsx — از DB می‌خونه
· src/pages/Profile.jsx — از DB می‌خونه
· src/pages/Admin.jsx — تب تنظیمات
· src/main.jsx — ErrorBoundary wrap
· index.html — SEO

الگوی State hierarchy (درس مهم)

هر state باید در parent کامپوننتی تعریف شه که همه children ببینن.
مثال: shopSettings در Dashboard تعریف شد (نه Admin) چون همه تب‌ها اونجان.

## v3.16-v3.18 — تنظیمات فروشگاه از DB
- جدول: shop_settings (id=1، تک‌ردیفه)
- فایل‌ها: api/shop.js، pages/AdminSettings.jsx، ErrorBoundary.jsx
- GRANT authenticated: SELECT/INSERT/UPDATE/DELETE
- cache 2min در frontend، fallback به SHOP_INFO

## v3.20
- utils/supabase.js: fetch با { cache: 'no-store' }
- Home.jsx: لود دیتا فقط هنگام visible بودن تب

## v3.21 — محاسبه قیمت سمت سرور
- Relay (server.js): تابع /zibal/request حالا خودش قیمت سفارش را از دیتابیس می‌خواند.
- فرانت‌اند (Pay.jsx): دیگر قیمت را ارسال نمی‌کند.

---

## 🔄 v3.22 — Config مرکزی قالب (۱۴۰۵/۰۷/۲۶)

### فایل جدید
- `src/config/shop.js` — تک‌منبع حقیقت برند/تم/SEO/تماس/کارت/ارسال/فیچرها
- export: `SHOP_CONFIG` (named) + `default`

### ساختار SHOP_CONFIG
| بخش | فیلدها |
|---|---|
| برند | name, tagline, logo, favicon, domain |
| تم | primary, accent, cream, font |
| SEO | title, description, ogImage, keywords |
| تماس | phone, telegram, instagram, whatsapp, address, workHours |
| پرداخت | card.{number, holder, bank} |
| ارسال | shippingFast, shippingNormal, freeShippingFrom, freeShippingCities, sameDayCities, freePostalPrefixes |
| فیچرها | smsOtp, zibalPayment, baleNotification, cardToCard, crm, apk |
| سرویس‌ها | relayUrl (بدون کلید حساس) |

### تغییر
- `src/api/shop.js`: `SHOP_INFO` → `SHOP_CONFIG` (import + fallback)
- `data/products.js` **دست‌نخورده** (طبق CONTRACT — فایل محافظت‌شده)

### Commit
- `fec3d99` feat(config): مرکزی‌سازی تنظیمات قالب

### نکته باقی‌مانده
- ۱۰ مصرف‌کننده مستقیم `SHOP_INFO` (Drawer, Success, About, Contact, Terms, MyOrders, Pay, Cart, Checkout, Profile) هنوز state اولیه رو از SHOP_INFO می‌گیرن — کار بعدی: مهاجرت به SHOP_CONFIG

---

## 🔄 v3.23 — تغییر معماری به SaaS (چند مستأجری / Multi-tenant)
### (بر اساس مشورت با مشاور فنی — ۱۴۰۵/۰۷/۲۶)

### ۱) مدل کسب‌وکار
- ❌ **ممنوعیت فروش سورس‌کد:** ریپو پرایوت می‌ماند. تحویل فقط شامل دامنه، اپ و پنل است.
- ✅ **فروش سرویس:** هزینه اولیه راه‌اندازی + هزینه سالانه نگهداری (Relay، پیامک، بکاپ، آپدیت).

### ۲) زیرساخت مشترک (Multi-tenant)
- **Relay:** یک سرور مرکزی برای همه. کانفیگ‌ها (Zibal, SMS) در DB با `shop_id` ذخیره می‌شوند.
- **پرداخت:** پول هر مشتری مستقیم به حساب زیبال خودش می‌رود (جلوگیری از واسطه‌گری).
- **Supabase:** یک پروژه‌ی پولی مشترک (نه رایگان، به دلیل محدودیت ۲ پروژه و اسلیپ شدن). تمام جداول (products, orders, shop_settings) ستون `shop_id` می‌گیرند.
- **امنیت Supabase:** جدول `shop_admins(user_id, shop_id)` ساخته می‌شود و RLS بر اساس این جدول تصمیم می‌گیرد (نه بر اساس ورودی کلاینت).

### ۳) فرانت‌اند و بیلد اپ
- **تم پویا:** رنگ‌ها و لوگو بر اساس دامنه یا `shop_id` از DB خوانده می‌شوند.
- **بیلدر اپ:** یک ریپوی پرایوت جدا برای بیلد. هر مشتری یک پوشه `customers/<slug>/config.json` دارد. GitHub Actions با گرفتن slug، اپ را با appId و keystore مخصوص خودش بیلد می‌کند.

### ۴) نکات قرارداد
- بکاپ اختصاصی برای هر مشتری از طریق دکمه خروجی JSON در پنل.
- تغییرات بصری (محصول، رنگ، متن) از پنل رایگان است. بیلد جدید اپ (آیکون، نسخه) سهمیه سالانه دارد.

---

## 🔄 v3.23 — تغییر معماری به SaaS (چند مستأجری / Multi-tenant)
### (بر اساس مشورت با مشاور فنی — ۱۴۰۵/۰۷/۲۶)

### ۱) مدل کسب‌وکار
- ❌ **ممنوعیت فروش سورس‌کد:** ریپو پرایوت می‌ماند. تحویل فقط شامل دامنه، اپ و پنل است.
- ✅ **فروش سرویس:** هزینه اولیه راه‌اندازی + هزینه سالانه نگهداری (Relay، پیامک، بکاپ، آپدیت).

### ۲) زیرساخت مشترک (Multi-tenant)
- **Relay:** یک سرور مرکزی برای همه. کانفیگ‌ها (Zibal, SMS) در DB با `shop_id` ذخیره می‌شوند.
- **پرداخت:** پول هر مشتری مستقیم به حساب زیبال خودش می‌رود (جلوگیری از واسطه‌گری).
- **Supabase:** یک پروژه‌ی پولی مشترک (نه رایگان، به دلیل محدودیت ۲ پروژه و اسلیپ شدن). تمام جداول (products, orders, shop_settings) ستون `shop_id` می‌گیرند.
- **امنیت Supabase:** جدول `shop_admins(user_id, shop_id)` ساخته می‌شود و RLS بر اساس این جدول تصمیم می‌گیرد (نه بر اساس ورودی کلاینت).

### ۳) فرانت‌اند و بیلد اپ
- **تم پویا:** رنگ‌ها و لوگو بر اساس دامنه یا `shop_id` از DB خوانده می‌شوند.
- **بیلدر اپ:** یک ریپوی پرایوت جدا برای بیلد. هر مشتری یک پوشه `customers/<slug>/config.json` دارد. GitHub Actions با گرفتن slug، اپ را با appId و keystore مخصوص خودش بیلد می‌کند.

### ۴) نکات قرارداد
- بکاپ اختصاصی برای هر مشتری از طریق دکمه خروجی JSON در پنل.
- تغییرات بصری (محصول، رنگ، متن) از پنل رایگان است. بیلد جدید اپ (آیکون، نسخه) سهمیه سالانه دارد.

## آپدیت v4.0 (مهاجرت به آروان)
- هاست: سرور آروان (IP: 85.198.55.141)
- مسیر پروژه: /var/www/cafetorshi
- سرور وب: Nginx + SSL (Certbot)
- روتر: BrowserRouter (بدون #)
- base در Vite: /

---

## 🔄 v4.4 — رفع باگ لاگین iOS (۱۴۰۵/۰۷/۳۰)

### علت
کیبورد فارسی iOS ارقام فارسی/عربی + RLM تزریق می‌کند. `\D` در JS فقط ASCII می‌پاکد → `'۰۹۱۲...'` خالی → validation رد.

### قوانین جدید (اجباری)
- هر ورودی موبایل از کاربر → اول `normalizeDigits` سپس `normalizePhone`
- regex لاتین `\d` روی ورودی فارسی کار نمی‌کند
- سرور **مستقل** validate کند (defense in depth)
- `onChange` input شماره: همیشه `normalizeDigits` قبل از `setPhone`

### فایل‌های دخیل
- `src/utils/auth.js` — `normalizeDigits`, `normalizePhone`
- `src/pages/Login.jsx` — input + sendOTP + verifyOTP
- `/root/relay/server.js` — helper + دو endpoint

---

## 🔄 v4.4.1 — Performance + Deploy

### Nginx
- `/assets/*` → ۱ سال immutable
- `/index.html` → no-cache
- `/sw.js`, `/registerSW.js` → no-store
- gzip comp_level 6
- open_file_cache فعال

### Deploy
- از این به بعد: `./deploy.sh`
- `--chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r --chown=www-data:www-data`
- verify بعد از deploy (hash match + HTTP 200)

---

## v4.4.2 — Deploy پایدار (۱۴۰۵/۰۷/۳۰)

### مشکل
- cron هر ۱۰ دقیقه: git fetch -> build -> reload
- شبکه ایران -> گاهی github.com:443 timeout 130s
- بدون set -e -> build با کد قدیمی -> hash قدیمی

### اسکریپت جدید update-site.sh
1. cd /var/www/cafetorshi || exit 1
2. timeout 25 git fetch origin و timeout 15 git reset --hard
3. اگر موفق: pnpm install --frozen-lockfile + pnpm build
4. اگر ناموفق: پیام github unreachable + skip build
5. همیشه: chown www-data + chmod 755/644 روی docs
6. systemctl reload nginx

### قوانین
- chown/chmod همیشه (حتی اگر git fail)
- timeout روی هر فرمان شبکه
- set -e یا fallback
