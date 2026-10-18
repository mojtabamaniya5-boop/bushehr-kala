# 🚨 قرارداد آهنین پروژه کافه ترشی

> این فایل، قانون اساسیه. هر AI که وارد پروژه میشه، اول این رو میخونه.
> اگه AI خلاف این قوانین عمل کرد، بهش تذکر بده و این فایل رو بفرست.

---

## 🛑 ممنوعیت‌های مطلق (هرگز، به هیچ قیمت)

### ۱) معماری
- ❌ تغییر معماری فعلی (React + Supabase + GitHub Pages)
- ❌ مهاجرت به Next.js / Remix / Astro / هر فریمورک دیگه
- ❌ مهاجرت به TypeScript
- ❌ اضافه کردن بک‌اند جداگانه (Node/Express/Laravel)
- ❌ Cloudflare Worker جایگزین pg_net
- ❌ Firebase/FCM

### ۲) نسخه‌ها
- ❌ آپدیت Vite (پین: 5.4.11)
- ❌ آپدیت React (پین: 18.3.1)
- ❌ آپدیت Tailwind (پین: 3.4.14)
- ❌ آپدیت Capacitor (پین: 6.2.0)
- ❌ `pnpm add X@latest` یا `pnpm update`

### ۳) استایل و طراحی
- ❌ تغییر پالت رنگی (سبز #2E7D32 + کرم #FFF8E8 + زرد #F8C02D)
- ❌ تغییر فونت (Vazirmatn)
- ❌ تغییر ساختار BottomNav (۵ تب با دایره شناور سبد)
- ❌ تغییر ساختار Drawer
- ❌ تغییر Header
- ❌ اضافه کردن Material UI / Bootstrap / Ant Design
- ❌ تغییر استایل مودال ConfirmModal
- ❌ تغییر Toast

### ۴) امنیت
- ❌ گذاشتن پسورد یا توکن توی کد
- ❌ حذف Supabase Auth از پنل ادمین
- ❌ حذف Rate Limiting از Track
- ❌ حذف RLS Policy
- ❌ باز کردن CORS روی همه چیز

### ۵) کد
- ❌ Rewrite کردن فایل‌های کارکرده از صفر بدون دلیل
- ❌ تغییر نام فایل‌ها یا پوشه‌ها
- ❌ اضافه کردن کامنت‌های اضافی یا تغییر زبان کامنت‌ها
- ❌ تغییر style کد (2 space vs 4 space، semi vs no-semi)
- ❌ تغییر structure کامپوننت‌ها

---

## ✅ کارهای درست (که AI باید بکنه)

### قبل از هر تغییر:
1. **سند MASTER-V3.md رو بخون**
2. **فایل مربوطه رو از Termux بگیر و ببین** (با `cat`)
3. **بفهم چی هست، بعد تغییر بده**
4. **تغییر رو توی MASTER-V3.md هم ثبت کن**
5. **commit + push با پیام واضح**

### سبک کد:
- ✅ تابع‌های arrow functions
- ✅ `export default function Name() {}` برای صفحات
- ✅ `export const name = () => {}` برای utils
- ✅ Tailwind classes به جای CSS
- ✅ `bg-brand` نه `bg-green-500`
- ✅ `text-muted` نه `text-gray-500`
- ✅ کامنت‌ها فارسی، کوتاه

### سبک فارسی:
- ✅ فاصله بین کلمات، نه `_`
- ✅ اعداد فارسی در UI، لاتین در کد
- ✅ `dir="rtl"` همه جا

---

## 🔒 فایل‌هایی که هرگز نباید تغییر کنن (مگه با اجازه صریح)

- `tailwind.config.js` (رنگ‌ها و توکن‌ها)
- `vite.config.js` (base: './', outDir: 'docs')
- `capacitor.config.json` (appId, appName)
- `src/utils/supabase-config.js` (URL, Key)
- `src/components/BottomNav.jsx` (ساختار)
- `src/components/Header.jsx` (ساختار)
- `src/components/ConfirmModal.jsx` (استایل)
- `src/components/Toast.jsx`
- `src/data/products.js` (SHOP_INFO, CATEGORIES)
- `.github/workflows/build-apk.yml`

---

## 📋 چک‌لیست قبل از هر تغییر

AI باید قبل از هر تغییری اینا رو چک کنه:

- [ ] MASTER-V3.md رو خوندم؟
- [ ] فایل فعلی رو دیدم؟
- [ ] فهمیدم چی هست؟
- [ ] تغییرم با معماری فعلی سازگاره؟
- [ ] تغییرم با پالت رنگی سازگاره؟
- [ ] تغییرم امنیت رو ضعیف نمی‌کنه؟
- [ ] توی MASTER-V3.md آپدیت کردم؟
- [ ] commit + push کردم؟

---

## 🚨 اگه AI خلاف کرد

**بهش این متن رو بده:**


---

## 🎯 خلاصه در یک جمله

**«این پروژه یه معماری مشخص، یه استایل مشخص، و یه سند مشخص داره. AI جدید فقط باید ادامه بده، نه بازسازی کنه.»**

---

آخرین به‌روزرسانی: ۱۴۰۵/۰۷/۱۸
نسخه: ۱.۰

## قوانین v3.4

### 1. import/export چک اجباری
grep "export" src/components/X.jsx
- export default → import X
- export const X → import { X }

### 2. catch ایمن
اول console.error بذار، بعد toast
اگه toast خراب باشه خطا گم نشه

### 3. ترتیب دیباگ درست
1. imports درست؟
2. console.log یا alert
3. git log --oneline -- file
4. curl از خارج
5. بعد معماری

### 4. ممنوعیت‌ها
- import از Toast بدون { toast }
- catch بدون console.error
- فرض SW/CORS قبل از چک imports

### 5. هشدار امنیت
login فقط localStorage = ناامن
بعدی: JWT token از verify-otp

---

## 🆕 قوانین v3.6

### ۱) RPC اجباری
- ❌ هرگز `supabase.from('orders').select('*')` مستقیم ننویس
- ✅ همیشه از RPC امن استفاده کن:
  - track_order, my_orders, delete_my_order, get_order_by_code

### ۲) policyها دست نزن
Policyهای موجود orders:
- orders_insert_all (public) ← فقط INSERT
- orders_admin_read/update/delete (authenticated)

حذف هر کدوم = شکستن RLS. **قبل از هر تغییر policy، سند MASTER رو بخون.**

### ۳) فایل .bak ممنوع
- تو مخزن **نباید** `.bak` باشه
- `.gitignore` شامل `*.bak` هست
- بکاپ‌ها فقط محلی، بعد از موفقیت حذف شن

### ۴) اسناد ۴گانه (اجباری)
هر تغییر مهم → آپدیت **هر ۴ سند**:
1. HANDOFF.md — وضعیت فعلی
2. MASTER-V3.md — معماری و فنی
3. AI-CONTRACT.md — قوانین (این فایل)
4. CHANGELOG.md — تاریخچه + اولویت‌ها

بعد → git push

### ۵) الگوی SECURITY DEFINER
هر RPC جدید که داده مشتری می‌ده:
- باید `SECURITY DEFINER SET search_path = public` باشه
- باید پارامتر تأیید (phone/code) داشته باشه
- نباید کار service_role رو به anon بده

---

## 🆕 قوانین v3.8

### ۱) JWT اجباری برای داده مشتری
- ❌ هرگز RPC پابلیک که با phone/code کار می‌کنه نساز
- ✅ همیشه JWT از relay (Authorization: Bearer)

### ۲) RPCهای مجاز فعلی
- track_order(p_code, p_phone) — رهگیری (کد+شماره)
- get_order_by_code(p_code) — فقط Pay (کد تصادفی)

### ۳) الگوی JWT
- امضا: HS256, 30d, {mobile}
- ذخیره: localStorage 'auth-token'
- چک: requireAuth در relay

### ۴) دستور کلی
- داده حساس مشتری → relay + JWT
- داده عمومی → RPC یا جدول عمومی

---

## 🆕 قوانین v3.14

### ۱) callbackUrl
- ❌ هرگز از `window.location.origin` برای callbackUrl استفاده نکن (در Capacitor می‌شه localhost)
- ✅ همیشه هارد‌کد به `https://cafetorshi.ir/#/verify?orderId=...`

### ۲) APK Release
- workflow: `.github/workflows/build-apk.yml`
- از `assembleRelease` استفاده کن (نه `assembleDebug`)
- signing از GitHub Secrets (۴ عدد)

### ۳) keystore
- ❌ هرگز keystore یا پسورد رو در مخزن git نگذار
- ✅ فقط در GitHub Secrets و ایمیل/یادداشت امن
- ⚠️ گم شدن keystore = عدم توانایی آپدیت اپ


---

## 🆕 قوانین v3.15

### ۱) Supabase write
- select() بعد از insert/update/delete اجباری
- چک data.length === 0

### ۲) GRANT
GRANT SELECT, INSERT, UPDATE, DELETE ON products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO authenticated;

### ۳) TTL
- محصولات: ۲ دقیقه


## v3.16-v3.18
- State hierarchy: state در parent که همه children ببینن
- ErrorBoundary همیشه App رو بپیچه
- بعد هر build، docs/ رو commit کن
- callbackUrl در Capacitor: هارد‌کد به دامنه
- shop_settings: id=1، cache 2min، fallback SHOP_INFO

## v3.20
- همیشه در createClient از fetch با cache: 'no-store' استفاده شود.
- هرگز قیمت ارسال شده از مرورگر در پرداخت را معتبر ندانید (باید سمت سرور چک شود).

## v3.21
- هرگز مبلغ نهایی (amount) را از کلاینت (مرورگر) به درگاه پرداخت یا Relay نفرستید. مبلغ باید همیشه سمت سرور از دیتابیس خوانده شود.

---

## 🆕 قوانین v3.22 — Config مرکزی

### ۱) تک‌منبع حقیقت
- ❌ هرگز مقدار برند/تماس/کارت/ارسال را مستقیم در کامپوننت هارد‌کد نکن
- ✅ همیشه از `SHOP_CONFIG` (config/shop.js) یا `getShopSettings()` استفاده کن

### ۲) اولویت منابع
1. `getShopSettings()` (DB، اولویت اول — cache ۲ دقیقه)
2. `SHOP_CONFIG` (fallback اولیه)
3. ❌ `SHOP_INFO` (فقط برای سازگاری گذشته — مصرف‌کننده جدید نساز)

### ۳) `src/config/shop.js` — فایل محافظت‌شده فروش
- برای هر مشتری جدید: **فقط** این فایل + ردیف `shop_settings` در DB + `tailwind.config.js` + `index.html`
- هیچ فایل دیگری نباید تغییر کند

### ۴) کلید حساس
- ❌ هرگز کلید (Supabase/SMSIR/Zibal/JWT) را در `config/shop.js` نگذار
- ✅ کلیدها فقط در `/root/relay/.env`

---

## 🆕 قوانین v3.23 — SaaS & Multi-tenant

### ۱) معماری داده (Multi-tenant)
- ❌ هرگز کوئری بدون فیلتر `shop_id` نزنید (مگر برای ادمین کل).
- ✅ جدول `shop_admins` مبنای RLS است. هر ادمین فقط داده‌های `shop_id` خودش را می‌بیند.
- ✅ مبلغ پرداخت حتماً باید در Relay از DB خوانده شود (هرگز از کلاینت).

### ۲) سورس‌کد و امنیت
- ❌ فروش سورس‌کد ممنوع. تحویل فقط به صورت سرویس (SaaS).
- ❌ عبور پول مشتری از درگاه (Zibal) ما ممنوع است.
- ✅ کلیدهای حساس (Service Role, Zibal, SMS) فقط در Relay و Edge Function.
- ✅ ریپوی اصلی باید Private باشد. هر کلیدی که در گیت‌هاب پابلیک لو رفته، باید Rotate شود.
