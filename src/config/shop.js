// ═══ تنظیمات مرکزی قالب — فقط این فایل را برای مشتری جدید عوض کن ═══
// بعد از اولین لود، مقادیر جدول shop_settings در Supabase اولویت دارند.
// این فایل فقط fallback اولیه + برند + SEO + فیچرها است.

export const SHOP_CONFIG = {
  // ─── برند ───
  name: 'کافه ترشی',
  tagline: 'طعم اصیل، با ارسال سریع',
  logo: '/icon.svg',
  favicon: '/icon.png',
  domain: 'cafetorshi.ir',

  // ─── تم (برای هماهنگی با tailwind.config.js) ───
  theme: {
    primary: '#2E7D32',
    accent: '#F8C02D',
    cream: '#FFF8E8',
    font: 'Vazirmatn',
  },

  // ─── SEO (برای index.html هم باید هم‌راستا شود) ───
  seo: {
    title: 'کافه ترشی | فروشگاه آنلاین ترشی خانگی بوشهر',
    description: 'خرید آنلاین ترشی، خیارشور، زیتون و سیرترشی خانگی با ارسال سریع.',
    ogImage: '/icon.png',
    keywords: 'ترشی خانگی، خیارشور، زیتون، بوشهر',
  },

  // ─── تماس ───
  phone: '09016191338',
  telegram: 'cafetorshi',
  instagram: '',
  whatsapp: '',
  address: 'بوشهر، خیابان ساحلی، پلاک ۱۲۳',
  workHours: '۹ صبح تا ۹ شب',

  // ─── پرداخت (کارت‌به‌کارت) ───
  card: {
    number: '5859831086263828',
    holder: 'مجتبی خسروانی',
    bank: 'بانک مسکن',
  },

  // ─── ارسال ───
  shippingFast: 25000,
  shippingNormal: 15000,
  freeShippingFrom: 500000,
  freeShippingCities: ['بوشهر'],
  sameDayCities: ['بوشهر'],
  freePostalPrefixes: ['75'],

  // ─── فیچرها (برای خاموش/روشن کردن در فروش به مشتری) ───
  features: {
    smsOtp: true,
    zibalPayment: true,
    baleNotification: true,
    cardToCard: true,
    crm: true,
    apk: true,
  },

  // ─── سرویس‌ها (بدون کلید حساس — کلیدها فقط در relay .env) ───
  services: {
    relayUrl: 'https://relay.cafetorshi.ir',
    // supabaseUrl در src/utils/supabase-config.js است — اینجا تکرار نکن
  },
}

export default SHOP_CONFIG
