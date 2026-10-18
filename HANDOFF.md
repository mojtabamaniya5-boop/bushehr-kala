# 🤝 سند تحویل — کافه ترشی

## وضعیت فعلی
فروشگاه آنلاین React + Supabase + Relay Node.js روی ArvanCloud.
- SMS OTP: ✅ کار می‌کنه
- پرداخت Zibal: ✅ کار می‌کنه (کاربر پول می‌ده)
- آپدیت وضعیت سفارش در Supabase: ❌ گیر کرده

## مشکل فعلی
Supabase REST با کلید sb_secret_ → 403 Forbidden.
تشخیص Claude: کلید sb_secret_ نباید تو Authorization: Bearer بره، فقط apikey کافیه.

## معماری
کاربر → cafetorshi.ir → relay.cafetorshi.ir (ایران) → sms.ir + Supabase + Zibal

## اطلاعات مهم
- سرور: [SERVER_IP_REDACTED] (SSH: [SSH_KEY_REDACTED])
- Supabase Project: [SUPABASE_PROJECT_REDACTED]
- کلید service_role: <SERVICE_KEY_در_سرور>
- Zibal Merchant: <ZIBAL_MERCHANT>
- sms.ir Template: 204518
- RELAY_SECRET: <RELAY_SECRET_در_سرور>

## قدم بعدی
1. تست: curl -i "https://[SUPABASE_PROJECT_REDACTED].supabase.co/rest/v1/" (بدون کلید)
2. تست: curl -i ".../rest/v1/orders?limit=1" -H "apikey: KEY" (فقط apikey)
3. اگه 200 داد → حذف Authorization از کد relay
4. آپدیت Verify.jsx (حذف updateOrderPaid)

## مسیرهای مهم
- Frontend: ~/bushehr-kala/
- Relay روی سرور: /root/relay/server.js
- دستورات: ssh -i [SSH_KEY_REDACTED] root@[SERVER_IP_REDACTED]
- PM2: pm2 restart cafetorshi-relay --update-env

## فایل‌های مهم فرانت
- src/pages/Login.jsx (کار می‌کنه)
- src/pages/Pay.jsx (کار می‌کنه)
- src/pages/Verify.jsx (نیاز به اصلاح)
- src/utils/payment.js (relay)
- src/utils/orders.js (updateOrderPaid اضافه شده)

## هشدار امنیتی
بعد از حل مشکل: Rotate کلید sb_secret_ + RELAY_SECRET + sms.ir API Key

---

## 🔄 آپدیت v3.5 (۱۴۰۵/۰۷/۲۱)

### حل شد
- ✅ GRANT روی orders → Supabase REST 200
- ✅ IPv6 ترجیحی در Node → fix شد
- ✅ relay /api/send-otp → 200 + پیامک واقعی
- ✅ relay /zibal/verify → validation درست

### قدم بعدی
1. تست full flow از Verify.jsx
2. Rotate کلیدها (چون در چت پابلیک شدند)
3. تست پرداخت Zibal واقعی


---

## 🔄 آپدیت v3.5 (۱۴۰۵/۰۷/۲۱) — همه چی کار می‌کنه ✅

### حل شد
- ✅ GRANT orders → Supabase REST 200
- ✅ IPv6 → ipv4first در server.js
- ✅ relay /api/send-otp → 200 + پیامک
- ✅ relay /zibal/request → trackId + URL
- ✅ relay /zibal/verify → 200

### قدم بعدی
1. 🔴 Rotate کلیدها (پابلیک شدند)
2. تست full flow از frontend (یک سفارش واقعی)
3. trust proxy = 1 در server.js


---

## 📋 اشاره
کارهای مانده: REMAINING.md
وضعیت v3.5: زیرساخت کامل کار می‌کند.
اولویت: Rotate کلیدها → JWT → RLS orders.

---

## 🔄 آپدیت v3.6 (۱۴۰۵/۰۷/۲۱)

### حل شد
- ✅ RLS orders — حذف policy پابلیک + ساخت ۴ RPC امن
- ✅ فرانت پچ شد (Track/MyOrders/orders.js/Verify.jsx)
- ✅ حذف alert DEBUG + updateOrderPaid از Verify
- ✅ .bak فایل‌ها حذف + .gitignore

### Commit
- `b75e100` security: RLS orders
- `7e3cdea` chore: حذف .bak

### 🔴 اولویت بعدی
۱. Rotate کلیدها (پابلیک شدند)
۲. JWT برای login

### 📌 یادآوری
- Relay روی سرور Arvan — IP: [SERVER_IP_REDACTED]
- Policyهای فعلی orders:
  - orders_insert_all (public) — ثبت سفارش
  - orders_admin_read/update/delete (authenticated)
- RPCهای جدید: track_order, my_orders, delete_my_order, get_order_by_code

---

## 🔄 آپدیت v3.7 (۱۴۰۵/۰۷/۲۲)

### حل شد
- Rotate: SMSIR + SUPABASE_SERVICE + RELAY_SECRET
- trust proxy = 1 در server.js

### 🔴 اولویت بعدی
**JWT برای login** — تنها راه بستن حفره send-otp

### اقدامات پنل
- sms.ir: کلید قدیمی Revoke، کلید جدید فعال
- Supabase: کلید قدیمی jwZ... Revoke، کلید جدید 2s_... فعال
- relay: RELAY_SECRET جدید: 8b637caa...

### عقب افتاد
- ZIBAL_MERCHANT — به IP بسته، نیاز به هماهنگی با پشتیبانی زیبال

---

## 🔄 آپدیت v3.8 (۱۴۰۵/۰۷/۲۳)

### حل شد
- JWT کامل: سرور + فرانت + تست موفق
- RPCهای پابلیک ناامن حذف
- login امن (localStorage فقط برای UI)

### 🔴 کارهای بعدی
۱. ZIBAL_MERCHANT Rotate (با پشتیبانی زیبال)
۲. فیلتر پنل ادمین (تب‌ها)
۳. ساعت کارت سفارش پنل ادمین
۴. APK Release
۵. Config متمرکز (پکیج فروش)
۶. اینستاگرام + اولین مشتری

### نکات
- localStorage حالا JWT داره (auth-token)
- logout باید getToken رو هم پاک کنه (انجام شد)

---

## 🔚 پایان چت — ۱۴۰۵/۰۷/۲۳

### آخرین commit
- `e75baaa` docs: v3.8

### 🔴 اولین کار چت بعدی
**دیباگ پنل ادمین** — دکمه‌های تغییر status کار نمی‌کنن.
- grep handleStatusChange در Admin.jsx
- چک کن UPDATE به orders کار می‌کنه (با session ادمین)

### 📋 فایل‌های ضروری چت بعدی
- ۵ سند: START/MASTER/HANDOFF/CONTRACT/CHANGELOG/REMAINING
- اطلاعات سرور: ssh -i [SSH_KEY_REDACTED] root@[SERVER_IP_REDACTED]
- JWT_SECRET روی سرور هست (تو .env)

### ⚠️ هشدار
کلیدها پاک شدن (Rotate) ولی:
- ZIBAL_MERCHANT هنوز قدیمیه
- اعتبار sms.ir ممکنه کم باشه

### 🎯 استراتژی پیشنهادی بعدی
1. پنل ادمین (فوری — دیباگ)
2. اینستاگرام + اولین مشتری (استراتژیک)
3. Config متمرکز (پکیج فروش)

---

## 🔄 آپدیت v3.9 (۱۴۰۵/۰۷/۲۳) — پنل ادمین حل شد ✅

### حل شد
- ✅ باگ `handleStatusChange` در `Admin.jsx`:
  - کوئری روی `id` به‌جای `code`
  - `.select()` اضافه شد → silent-fail detection
- ✅ GRANT UPDATE روی `orders` برای `authenticated`
  - خطای قبلی: `permission denied for table orders`
  - SQL: `GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO authenticated;`
- ✅ تست موفق: سفارش `MV4WP4EIL1A` از pending → paid

### Commit
- `60a3dce` fix(admin): status update via id + silent-fail detect

### 🔴 کارهای بعدی
۱. ZIBAL_MERCHANT Rotate (با پشتیبانی زیبال)
۲. ساعت در کارت سفارش پنل ادمین
۳. APK Release
۴. Config متمرکز (پکیج فروش)
۵. اینستاگرام + اولین مشتری

---

## 🔄 آپدیت v3.10 (۱۴۰۵/۰۷/۲۳) — ساعت + پاک‌سازی ✅

### حل شد
- ✅ ساعت + تاریخ در کارت سفارش پنل ادمین
- ✅ حذف `.bak2`ها از مخزن
- ✅ `.gitignore` آپدیت شد (`*.bak*`)

### 🔴 کارهای بعدی
۱. ZIBAL_MERCHANT Rotate (با پشتیبانی زیبال)
۲. APK Release + keystore
۳. Config متمرکز (پکیج فروش)
۴. اینستاگرام + اولین مشتری

---

## 🔄 آپدیت v3.11 (۱۴۰۵/۰۷/۲۳) — پاک‌سازی Zibal

### حل شد
- ✅ حذف Edge Functions زائد (`zibal-verify` و `zibal-request`)
- ✅ حذف IPهای ناشناس AWS از Zibal whitelist
- ✅ تأیید: فرانت فقط از relay استفاده می‌کنه

### 🔴 منتظر
- 🔴 کلید جدید ZIBAL_MERCHANT (تیکت زده شد به پشتیبانی)

### 🔴 کارهای بعدی
۱. بعد از کلید جدید: `nano /root/relay/.env` + `pm2 restart cafetorshi-relay --update-env`
۲. APK Release
۳. Config متمرکز (shop.js)
۴. اینستاگرام + اولین مشتری

---

## 🔄 آپدیت v3.11 (۱۴۰۵/۰۷/۲۳) — پاک‌سازی Zibal

### حل شد
- ✅ حذف Edge Functions زائد (`zibal-verify` و `zibal-request`)
- ✅ حذف IPهای ناشناس AWS از Zibal whitelist
- ✅ تأیید: فرانت فقط از relay استفاده می‌کنه

### 🔴 منتظر
- 🔴 کلید جدید ZIBAL_MERCHANT (تیکت زده شد به پشتیبانی)

### 🔴 کارهای بعدی
۱. بعد از کلید جدید: `nano /root/relay/.env` + `pm2 restart cafetorshi-relay --update-env`
۲. APK Release
۳. Config متمرکز (shop.js)
۴. اینستاگرام + اولین مشتری

---

## 🔄 آپدیت v3.12 (۱۴۰۵/۰۷/۲۳) — پاسخ تیکت Zibal

### پاسخ پشتیبانی زیبال
- کد مرچنت rotate نمی‌شه (مگه با غیرفعال کردن درگاه + شاپرک)
- **ولی:** کد domain-locked به cafetorshi.ir هست
  → اگه پابلیک شه، از دامنه دیگر کار نمی‌کنه

### تصمیم نهایی
- ✅ نگه داشتن درگاه فعلی
- ❌ غیرفعال کردن (چون ضرر زمانیه)

### فایل‌های جدید
- `docs/zibal-support-reply.txt` — متن پاسخ پشتیبانی زیبال

### 🔴 کار بعدی فوری (امنیتی)
- تغییر رمز پنل زیبال + فعال‌سازی 2FA

### 🟠 کارهای بعدی
۱. APK Release (keystore + build)
۲. Config متمرکز (shop.js) برای فروش پکیج
۳. UI tweaks (اگه نیاز داری)
۴. اینستاگرام + اولین مشتری

---

## 🔄 آپدیت v3.13 (۱۴۰۵/۰۷/۲۳) — برگشت my_orders

### حل شد
- ✅ RPCهای `my_orders` و `delete_my_order` برگشتند (فقط برای service_role)
- ✅ پنل کاربر «سفارش‌های من» حالا سفارش‌ها را نشان می‌دهد
- ✅ علت: حذف RPC در v3.8 بدون آپدیت relay

### 🔴 کارهای بعدی
۱. APK Release + keystore
۲. Config متمرکز (shop.js)
۳. UI tweaks
۴. اینستاگرام + اولین مشتری

---

## 🔄 آپدیت v3.14 (۱۴۰۵/۰۷/۲۳) — APK Release + callbackUrl

### حل شد
- ✅ keystore ساخته شد + بکاپ در ایمیل
- ✅ GitHub Secrets (۴ عدد)
- ✅ APK Release (7.16 MB) ساخته و تست شد
- ✅ callbackUrl در Pay.jsx هارد‌کد شد
- ✅ خرید از اپ → موفق (QFE81N auto paid)

### 🔴 کارهای بعدی
۱. Deep Link (برگشت از مرورگر به اپ) — اختیاری، بعد از مشتری
۲. Config متمرکز (shop.js)
۳. اینستاگرام + اولین مشتری
۴. نمونه‌کار دوم
۵. سایت Lianapp

### نکات مهم برای چت بعدی
- APK Release: workflow `Build Android APK` (branch main)
- دانلود: Actions → آخرین run → Artifacts
- keystore در ایمیل + یادداشت امن (پسورد نه در اسناد)
- سفارش‌های تست: QFE81N, D6B08Z, IQ9N7Z, 1L1A3E (همه paid)


---

## 🔄 آپدیت v3.15 (۱۴۰۵/۰۷/۲۳)

### حل شد
- GRANT products برای authenticated
- Admin.jsx: select + data check
- TTL محصولات ۲ دقیقه
- تست موفق: قیمت ۵۰۰ تومان در اپ

### کارهای بعدی
۱. Realtime
۲. APK در GitHub Releases
۳. Config متمرکز (shop.js)

### Commit آخر: 51edf4f


## آپدیت v3.16-v3.18 (۱۴۰۵/۰۷/۲۴)
### حل شد
- تنظیمات فروشگاه از DB
- تب تنظیمات ادمین + فرم کامل
- باگ ReferenceError shopSettings
- Profile.jsx از DB + SEO
### کار بعدی
- Realtime / APK Releases / اولین مشتری
### آخرین commit: dadad48

## v3.20
- بهینه‌سازی نهایی Polling و دور زدن کش HTTP.
- (هشدار برای آینده: محاسبه قیمت نهایی در پرداخت باید سمت سرور باشد).

## v3.21 (۱۴۰۵/۰۷/۲۶)
### حل شد
- حفره امنیتی دستکاری قیمت در درگاه پرداخت (Zibal).
- همگام‌سازی Relay با دیتابیس Supabase.

---

## 🔄 آپدیت v3.22 (۱۴۰۵/۰۷/۲۶) — Config مرکزی

### حل شد
- ✅ `src/config/shop.js` ساخته شد (SHOP_CONFIG)
- ✅ `api/shop.js` fallback به SHOP_CONFIG (نه SHOP_INFO)
- ✅ build موفق + push

### 🔴 کارهای بعدی
۱. مهاجرت ۱۰ مصرف‌کننده مستقیم `SHOP_INFO` → `SHOP_CONFIG`
۲. فیکس Checkout.jsx:216–217 (SHOP_INFO.shippingFast → shopSettings.shippingFast)
۳. README-CLIENT.md برای فروش قالب
۴. `index.html` + `tailwind.config.js` هم‌راستا با SHOP_CONFIG

---

## 🔄 آپدیت v3.22.1 (۱۴۰۵/۰۷/۲۶)
### حل شد
- فیکس باگ قیمت ارسال در Checkout.jsx (خطوط ۲۱۶-۲۱۷)
- استفاده از shopSettings به جای SHOP_INFO برای قیمت‌های پویا

---

## 🔄 آپدیت v3.22.2 (۱۴۰۵/۰۷/۲۶)
### حل شد
- مهاجرت کامل ۱۱ فایل از SHOP_INFO به SHOP_CONFIG
- پاکسازی فایل .bak2
- کار روی برنچ `shop-config` (منتظر مرج به main)

---

## 🔄 آپدیت v3.24 (بازگشت به عقب)
### وضعیت
- سایت کاملاً پایدار و به حالت اصلی برگشته است.
- تم‌های پویا غیرفعال شدند.
### کارهای بعدی
- تمرکز روی فروش قالب و اولین مشتری واقعی.
- پیاده‌سازی تم پویا فقط در صورت داشتن دیزاین سیستم کامل (Design System) و زمان کافی.
