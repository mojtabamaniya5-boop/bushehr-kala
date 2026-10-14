# 📋 کارهای مانده — کافه ترشی

> آخرین به‌روزرسانی: ۱۴۰۵/۰۷/۲۱
> وضعیت: زیرساخت کامل کار می‌کند ✅

---

## ✅ حل‌شده (v3.5)
- Supabase REST 403 (GRANT service_role + IPv6 fix)
- Login OTP (relay /api/send-otp)
- پرداخت Zibal (relay /zibal/request + /zibal/verify)
- Relay روی ArvanCloud + PM2
- DNS Shecan روی سرور
- Zibal IP Whitelist
- sms.ir تأخیر حل شد

---

## 🔴 فوری — امنیت

### ۱) Rotate کلیدها
کلیدهای زیر در چت پابلیک شدند → باید عوض شوند:

| کلید | محل | اقدام |
|---|---|---|
| sb_secret_ | Supabase → Settings → API | Revoke + Generate |
| service_role legacy | Supabase → Settings → API | چک و Revoke |
| RELAY_SECRET | /root/relay/.env | openssl rand -hex 32 |
| SMSIR_API_KEY | app.sms.ir | Regenerate |
| ZIBAL_MERCHANT | panel.zibal.ir | Rotate |
| SUPABASE_ACCESS_TOKEN | dashboard/account/tokens | Revoke |

بعد از هر Rotate روی سرور:
  ssh -i ~/.ssh/arvan.pem root@[SERVER_IP_REDACTED]
  nano /root/relay/.env
  pm2 restart cafetorshi-relay --update-env

### ۲) JWT برای امنیت لاگین
حفره: الآن login فقط localStorage است → هر کسی با DevTools مرورگر
می‌تواند خودش را مشتری هر شماره‌ای کند و سفارش‌های بقیه را ببیند.

راه‌حل:
- verify-otp در relay → توکن JWT امضاشده برگرداند
  (jsonwebtoken، HS256، secret از env: JWT_SECRET)
- payload: { mobile, iat, exp } — عمر ~۳۰ روز
- fetchUserOrders → Authorization: Bearer <JWT> بفرستد
- relay /api/my-orders → JWT را verify کند و فقط سفارش‌های
  همان موبایل را برگرداند
- localStorage: فقط JWT ذخیره شود (نه mobile)
- Track هم اگر مستقیم از Supabase می‌خواند → به relay منتقل شود

### ۳) RLS روی جدول orders
حفره: با publishable key پابلیک، هر کسی می‌تواند
  SELECT * FROM orders
بزند و نام + آدرس + شماره همه مشتری‌ها را ببیند.

راه‌حل:
- چک: SELECT * FROM pg_policies WHERE tablename = 'orders';
- حذف policy SELECT پابلیک برای anon
- فقط INSERT برای ثبت سفارش باقی بماند
- خواندن سفارش‌ها → فقط از طریق relay با service_role

---

## 🟠 متوسط — UX

### ۴) پنل ادمین — فیلتر تب‌ها
علامت: تب‌های «در انتظار / پرداخت شده / ارسال شده» کار نمی‌کنند.
علت محتمل: در Admin.jsx مقایسه status فارسی با انگلیسی DB.
  غلط:  orders.filter(o => o.status === 'در انتظار')
  درست: orders.filter(o => o.status === 'pending')
راه‌حل: در DB فقط status انگلیسی (pending, paid, shipped,
delivered, cancelled) — در UI با map به فارسی ترجمه شود.

### ۵) پنل ادمین — ساعت
کارت سفارش فقط تاریخ نشان می‌دهد → ساعت هم اضافه شود:
  new Date(o.created_at).toLocaleString('fa-IR',
    { dateStyle: 'short', timeStyle: 'short' })

### ۶) تست کامل بعد از حل Supabase
- یک سفارش واقعی از سایت → پرداخت → پنل ادمین → تب «پرداخت شده»
- وضعیت Supabase: status = 'paid'
- سفارش‌های قدیمی MV503MSR35E0N و MV4WP4EIL1A3E دستی paid شوند
  (UPDATE orders SET status = 'paid' WHERE code IN (...))

---

## 🟡 پایین

### ۷) SMS جایگزین (اگر sms.ir تأخیر برگشت)
کاوه‌نگار به‌عنوان پشتیبان — همان ساختار relay، فقط endpoint.

### ۸) APK Release
- keystore: keytool -genkey -v -keystore cafetorshi.keystore ...
- capacitor build android --release
- Signed APK → GitHub Releases
- ⚠️ keystore را گم نکن — برای آپدیت‌های بعدی لازم است

### ۹) Config متمرکز (shop.js)
src/config/shop.js با نام فروشگاه، رنگ، شماره، آدرس →
برای فروش پکیج به مشتری بعدی.

### ۱۰) نمونه‌کار دوم (ابزار آلات)
همان استک، رنگ و دسته‌بندی متفاوت → نشان دادن به مشتری بعدی.

### ۱۱) سایت Lianapp
سایت شرکت مادر — با همین استک، ساده‌تر.

### ۱۲) اینستاگرام + اولین مشتری
- ساخت پیج، ۹ پست اول
- اولین سفارش واقعی + لاگ همه مراحل

---

## 📝 قوانین آپدیت
هر تغییر → آپدیت HANDOFF + REMAINING + MASTER + CONTRACT → git push

---

## 🎯 ترتیب پیشنهادی
۱. Rotate کلیدها (الآن — امنیت)
۲. تست کامل یک سفارش واقعی
۳. JWT + RLS orders (بستن حفره‌های امنیتی)
۴. فیلتر + ساعت پنل ادمین (UX)
۵. APK Release
۶. اینستاگرام + اولین مشتری
۷. Config متمرکز + نمونه‌کار دوم
۸. Lianapp

---

## 🆕 آپدیت v3.8 (۱۴۰۵/۰۷/۲۳)

### ✅ حل‌شده در این سری
- RLS orders + ۴ RPC امن
- Rotate: SMSIR + SUPABASE_SERVICE + RELAY_SECRET
- trust proxy = 1
- JWT کامل (سرور + فرانت + تست موفق)
- حذف RPCهای ناامن my_orders و delete_my_order

### 🔴 باقی‌مانده اولویت‌دار

#### ۱) پنل ادمین — دیباگ دکمه‌های تغییر status
- تابع handleStatusChange در Admin.jsx باید دیباگ شه
- تست: کلیک روی دکمه status → آیا وضعیت تو DB عوض می‌شه؟
- احتمال خطا: RLS (UPDATE فقط برای authenticated) یا session ادمین
- فایل: src/pages/Admin.jsx — خطوط ~۴۴۰ و ~۳۲۰

#### ۲) ZIBAL_MERCHANT Rotate
- به IP [SERVER_IP_REDACTED] بسته
- باید با پشتیبانی زیبال هماهنگ کنی
- ⚠️ الآن کلید قدیمی هنوز فعاله

#### ۳) ساعت در کارت سفارش پنل ادمین
- الآن فقط تاریخ نشون می‌ده
- اضافه: ساعت با toLocaleString('fa-IR', {dateStyle:'short', timeStyle:'short'})

### 🟠 متوسط
- فیلتر تب‌های پنل ادمین (اگه لازمه)
- Config متمرکز (shop.js)
- APK Release

### 🟡 پایین
- نمونه‌کار دوم
- سایت Lianapp
- اینستاگرام + اولین مشتری

### 📝 نکات مهم برای ادامه
- JWT تو localStorage با key `auth-token`
- relay endpoints جدید: /api/my-orders + /api/delete-order
- RPCهای باقی: track_order, get_order_by_code
- server.js پچ شده با signToken + requireAuth

---

## 🆕 آپدیت v3.9 (۱۴۰۵/۰۷/۲۳)

### ✅ حل‌شده در این سری
- دیباگ دکمه‌های تغییر status پنل ادمین
  - کوئری روی `id` به‌جای `code`
  - `.select()` برای تشخیص silent-fail
  - GRANT UPDATE برای `authenticated` روی `orders`

### 🔴 باقی‌مانده اولویت‌دار
#### ۱) ZIBAL_MERCHANT Rotate
- به IP [SERVER_IP_REDACTED] بسته
- باید با پشتیبانی زیبال هماهنگ کنی
- ⚠️ الآن کلید قدیمی هنوز فعاله

#### ۲) ساعت در کارت سفارش پنل ادمین
- الآن فقط تاریخ نشون می‌ده
- اضافه: ساعت با toLocaleString('fa-IR', {dateStyle:'short', timeStyle:'short'})

### 🟠 متوسط
- فیلتر تب‌های پنل ادمین
- Config متمرکز (shop.js)
- APK Release

### 🟡 پایین
- نمونه‌کار دوم
- سایت Lianapp
- اینستاگرام + اولین مشتری

---

## 🆕 آپدیت v3.10 (۱۴۰۵/۰۷/۲۳)

### ✅ حل‌شده
- ساعت + تاریخ در کارت سفارش پنل ادمین
- حذف `.bak2`ها
- `.gitignore` با `*.bak*`

### 🔴 باقی‌مانده اولویت‌دار
#### ۱) ZIBAL_MERCHANT Rotate
- تیکت به پشتیبانی زیبال
- کلید قدیمی هنوز فعاله

---

## 🆕 آپدیت v3.11 (۱۴۰۵/۰۷/۲۳)

### ✅ حل‌شده
- حذف Edge Functions زائد (zibal-verify + zibal-request)
- حذف IPهای AWS از whitelist زیبال
- تأیید: فقط relay فعّاله

### 🔴 در انتظار
- کلید جدید ZIBAL_MERCHANT (منتظر پاسخ تیکت)

### 🔴 بعد از دریافت کلید
ssh -i ~/.ssh/arvan.pem root@[SERVER_IP_REDACTED]
nano /root/relay/.env
# ZIBAL_MERCHANT=<کلید_جدید>
pm2 restart cafetorshi-relay --update-env

---

## 🆕 آپدیت v3.11 (۱۴۰۵/۰۷/۲۳)

### ✅ حل‌شده
- حذف Edge Functions زائد (zibal-verify + zibal-request)
- حذف IPهای AWS از whitelist زیبال
- تأیید: فقط relay فعّاله

### 🔴 در انتظار
- کلید جدید ZIBAL_MERCHANT (منتظر پاسخ تیکت)

### 🔴 بعد از دریافت کلید
ssh -i ~/.ssh/arvan.pem root@[SERVER_IP_REDACTED]
nano /root/relay/.env
# ZIBAL_MERCHANT=<کلید_جدید>
pm2 restart cafetorshi-relay --update-env

---

## 🆕 آپدیت v3.12 (۱۴۰۵/۰۷/۲۳)

### ✅ حل‌شده
- پاسخ تیکت Zibal: rotate خودکار ممکن نیست، ولی domain-lock کافیه
- تصمیم: نگه داشتن درگاه
- ذخیره پاسخ در `docs/zibal-support-reply.txt`

### 🔴 فوری — امنیت
- تغییر رمز پنل زیبال (panel.zibal.ir)
- فعال‌سازی 2FA اگه ممکنه

### 🟠 بعدی
- APK Release
- Config متمرکز (shop.js)
- UI tweaks
- اولین مشتری

---

## 🆕 آپدیت v3.13 (۱۴۰۵/۰۷/۲۳)

### ✅ حل‌شده
- برگشت RPC `my_orders` و `delete_my_order`
- پنل کاربر «سفارش‌های من» درست شد

### 🔴 باقی‌مانده
- APK Release
- Config متمرکز (shop.js)
- UI tweaks
- اولین مشتری

### ⚠️ نکته امنیتی
- RPCها فقط برای service_role قابل اجرا هستند
- اگه روزی relay را عوض کردی، این RPCها را یادت باشه
