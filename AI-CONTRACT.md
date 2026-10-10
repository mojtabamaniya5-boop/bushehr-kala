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

