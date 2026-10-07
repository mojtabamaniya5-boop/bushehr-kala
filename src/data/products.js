// اطلاعات فروشگاه
export const SHOP_INFO = {
  name: 'بوشهر کالا',
  phone: '07700000000',
  telegram: 'bushehrkala',
  card: {
    number: '5859831086263828',
    holder: 'مهدی محمدی',
    bank: 'بانک مسکن',
  },
  address: 'بوشهر، خیابان ...',
  shippingCost: 50000,
  freeShippingFrom: 2000000,
}

// دسته‌بندی‌ها
export const CATEGORIES = [
  { id: 'headphone', name: 'هدفون و هندزفری', icon: '🎧' },
  { id: 'charger',   name: 'شارژر و آداپتور', icon: '🔌' },
  { id: 'powerbank', name: 'پاوربانک',        icon: '🔋' },
  { id: 'cable',     name: 'کابل و مبدل',     icon: '🔗' },
  { id: 'mouse',     name: 'ماوس و کیبورد',   icon: '🖱️' },
  { id: 'hub',       name: 'هاب و داک',       icon: '🧩' },
  { id: 'case',      name: 'کیف و قاب',       icon: '💼' },
  { id: 'holder',    name: 'هولدر و پایه',    icon: '📱' },
]

// تصویر پیش‌فرض با رنگ برند
const img = (text, color = 'DC2626') =>
  `https://placehold.co/400x400/${color}/ffffff?text=${encodeURIComponent(text)}`

export const PRODUCTS = [
  // ═══════ هدفون و هندزفری ═══════
  {
    id: 'p001',
    title: 'هدفون بلوتوثی انکر Soundcore P20i',
    category: 'headphone', brand: 'Anker',
    price: 1250000, oldPrice: 1450000, stock: 8, rating: 4.7,
    image: img('Soundcore P20i'),
    description: 'هدفون بی‌سیم با کیفیت صدای عالی، باتری ۳۰ ساعته و ضدآب IPX5. مناسب ورزش و استفاده روزمره.',
    features: ['بلوتوث ۵.۳', 'باتری ۳۰ ساعت', 'ضدآب IPX5', 'میکروفن دوگانه'],
    bestSeller: true,
  },
  {
    id: 'p002',
    title: 'هندزفری سیمی سامسونگ AKG اورجینال',
    category: 'headphone', brand: 'Samsung',
    price: 280000, oldPrice: null, stock: 30, rating: 4.3,
    image: img('AKG', '1E40AF'),
    description: 'هندزفری سیمی اورجینال سامسونگ با کیفیت صدای AKG و میکروفن内置.',
    features: ['صدای AKG', 'میکروفن', 'کنترل حجم', 'جک ۳.۵'],
    bestSeller: false,
  },
  {
    id: 'p003',
    title: 'هدفون JBL Tune 510BT بی‌سیم',
    category: 'headphone', brand: 'JBL',
    price: 1850000, oldPrice: 2100000, stock: 6, rating: 4.6,
    image: img('JBL 510BT', 'FF6600'),
    description: 'هدفون آنر ایر JBL با صدای Pure Bass، باتری ۴۰ ساعته و تاشو راحت.',
    features: ['باتری ۴۰ ساعت', 'Pure Bass', 'تاشو', 'شارژ سریع ۵ دقیقه'],
    bestSeller: true,
  },
  {
    id: 'p004',
    title: 'ایربادز شیائومی Redmi Buds 4',
    category: 'headphone', brand: 'Xiaomi',
    price: 890000, oldPrice: 1050000, stock: 12, rating: 4.5,
    image: img('Redmi Buds 4', 'FF6900'),
    description: 'ایربادز بی‌سیم با نویز کنسلینگ فعال و باتری ۳۰ ساعته همراه با کیس.',
    features: ['ANC', 'باتری ۳۰ ساعت', 'بلوتوث ۵.۲', 'IP54'],
    bestSeller: false,
  },
  {
    id: 'p005',
    title: 'ایرپاد پرو ۲ اپل AirPods Pro 2',
    category: 'headphone', brand: 'Apple',
    price: 8500000, oldPrice: 9200000, stock: 3, rating: 4.9,
    image: img('AirPods Pro 2', '1F2937'),
    description: 'ایرپاد پرو نسل دوم با تراشه H2، نویز کنسلینگ پیشرفته و صدای Spatial Audio.',
    features: ['تراشه H2', 'ANC پیشرفته', 'Spatial Audio', 'شارژ MagSafe'],
    bestSeller: true,
  },

  // ═══════ شارژر و آداپتور ═══════
  {
    id: 'p006',
    title: 'شارژر دیواری انکر ۳۳ وات PowerPort III',
    category: 'charger', brand: 'Anker',
    price: 680000, oldPrice: 780000, stock: 15, rating: 4.8,
    image: img('Charger 33W'),
    description: 'شارژر سریع ۳۳ وات با پورت USB-C، سازگار با تمامی گوشی‌ها و تبلت‌ها.',
    features: ['توان ۳۳ وات', 'USB-C', 'فست شارژ', 'گارانتی ۱۸ ماهه'],
    bestSeller: true,
  },
  {
    id: 'p007',
    title: 'شارژر ۲۰ وات اپل اورجینال',
    category: 'charger', brand: 'Apple',
    price: 850000, oldPrice: null, stock: 9, rating: 4.7,
    image: img('Apple 20W', '1F2937'),
    description: 'شارژر اصلی اپل ۲۰ وات USB-C مناسب آیفون و آیپد.',
    features: ['۲۰ وات', 'USB-C', 'اورجینال اپل', 'فست شارژ'],
    bestSeller: false,
  },
  {
    id: 'p008',
    title: 'شارژر ۶۵ وات GaN بیسوس GaN5 Pro',
    category: 'charger', brand: 'Baseus',
    price: 1450000, oldPrice: 1650000, stock: 7, rating: 4.8,
    image: img('GaN 65W', 'E11D48'),
    description: 'شارژر GaN سه پورت با توان ۶۵ وات، مناسب لپ‌تاپ، گوشی و تبلت همزمان.',
    features: ['۶۵ وات', '۳ پورت', 'تکنولوژی GaN', 'کوچک و سبک'],
    bestSeller: true,
  },
  {
    id: 'p009',
    title: 'شارژر ۲۵ وات سامسونگ سوپر فست',
    category: 'charger', brand: 'Samsung',
    price: 550000, oldPrice: 620000, stock: 20, rating: 4.5,
    image: img('Samsung 25W', '1E40AF'),
    description: 'شارژر اصلی سامسونگ ۲۵ وات با کابل Type-C و قابلیت Super Fast Charging.',
    features: ['۲۵ وات', 'Super Fast', 'Type-C', 'اورجینال'],
    bestSeller: false,
  },

  // ═══════ پاوربانک ═══════
  {
    id: 'p010',
    title: 'پاوربانک ۲۰۰۰۰ شیائومی نسل ۳',
    category: 'powerbank', brand: 'Xiaomi',
    price: 1580000, oldPrice: null, stock: 5, rating: 4.9,
    image: img('Mi 20000', 'FF6900'),
    description: 'پاوربانک ۲۰۰۰۰ میلی‌آمپری شیائومی با شارژ سریع ۲۲.۵ وات و نمایشگر دیجیتال.',
    features: ['۲۰۰۰۰ ماه', 'شارژ سریع ۲۲.۵W', 'نمایشگر', '۳ پورت'],
    bestSeller: true,
  },
  {
    id: 'p011',
    title: 'پاوربانک انکر ۱۰۰۰۰ PowerCore',
    category: 'powerbank', brand: 'Anker',
    price: 980000, oldPrice: 1150000, stock: 14, rating: 4.7,
    image: img('Anker 10000'),
    description: 'پاوربانک ۱۰۰۰۰ انکر با شارژ سریع و بدنه مقاوم، مناسب سفر.',
    features: ['۱۰۰۰۰ ماه', 'PowerIQ', 'دو پورت', 'سبک'],
    bestSeller: false,
  },
  {
    id: 'p012',
    title: 'پاوربانک مگ‌سیف بیسوس ۲۰۰۰۰',
    category: 'powerbank', brand: 'Baseus',
    price: 1750000, oldPrice: 1950000, stock: 4, rating: 4.6,
    image: img('Magsafe PB', 'E11D48'),
    description: 'پاوربانک بی‌سیم مگ‌سیف ۲۰۰۰۰ با شارژ بی‌سیم ۱۵ وات.',
    features: ['مگ‌سیف', '۱۵W بی‌سیم', '۲۰۰۰۰ ماه', 'پایه‌دار'],
    bestSeller: false,
  },

  // ═══════ کابل و مبدل ═══════
  {
    id: 'p013',
    title: 'کابل Type-C به Type-C انکر ۱۰۰ وات',
    category: 'cable', brand: 'Anker',
    price: 320000, oldPrice: 380000, stock: 25, rating: 4.6,
    image: img('USB-C Cable'),
    description: 'کابل ۱۰۰ وات Type-C با طول ۱.۸ متر و بدنه نایلونی مقاوم.',
    features: ['۱۰۰ وات', '۱.۸ متر', 'نایلون بافته', 'گارانتی مادام‌العمر'],
    bestSeller: true,
  },
  {
    id: 'p014',
    title: 'کابل لایتنینگ اپل ۱ متری',
    category: 'cable', brand: 'Apple',
    price: 480000, oldPrice: null, stock: 18, rating: 4.5,
    image: img('Lightning', '1F2937'),
    description: 'کابل لایتنینگ به USB اورجینال اپل، مناسب آیفون و آیپد.',
    features: ['لایتنینگ', '۱ متر', 'اورجینال', 'MFi'],
    bestSeller: false,
  },
  {
    id: 'p015',
    title: 'کابل سه‌کاره بیسوس ۳ آمپر',
    category: 'cable', brand: 'Baseus',
    price: 250000, oldPrice: 300000, stock: 30, rating: 4.4,
    image: img('3in1 Cable', 'E11D48'),
    description: 'کابل سه‌کاره با پورت‌های Type-C، لایتنینگ و Micro، طول ۱.۲ متر.',
    features: ['۳ کاره', '۳ آمپر', '۱.۲ متر', 'نایلون بافته'],
    bestSeller: false,
  },
  {
    id: 'p016',
    title: 'مبدل OTG Type-C به USB ۳.۰',
    category: 'cable', brand: 'Baseus',
    price: 120000, oldPrice: 150000, stock: 40, rating: 4.5,
    image: img('OTG Adapter', 'E11D48'),
    description: 'مبدل OTG برای اتصال فلش، ماوس و کیبورد به گوشی Type-C.',
    features: ['OTG', 'USB 3.0', 'آلومینیومی', 'سرعت بالا'],
    bestSeller: false,
  },

  // ═══════ ماوس و کیبورد ═══════
  {
    id: 'p017',
    title: 'ماوس گیمینگ لاجیتک G102 Lightsync',
    category: 'mouse', brand: 'Logitech',
    price: 890000, oldPrice: 1050000, stock: 12, rating: 4.8,
    image: img('Logitech G102', '1F2937'),
    description: 'ماوس گیمینگ با سنسور ۸۰۰۰ DPI و نورپردازی RGB.',
    features: ['DPI 8000', 'RGB', '۶ دکمه', 'USB'],
    bestSeller: true,
  },
  {
    id: 'p018',
    title: 'کیبورد مکانیکی ردراگون K552 RGB',
    category: 'mouse', brand: 'Redragon',
    price: 1450000, oldPrice: 1650000, stock: 8, rating: 4.7,
    image: img('Redragon K552', 'B91C1C'),
    description: 'کیبورد مکانیکی گیمینگ با سوییچ آبی و نورپردازی RGB.',
    features: ['مکانیکی', 'RGB', 'ضدآب', 'بدنه فلزی'],
    bestSeller: false,
  },
  {
    id: 'p019',
    title: 'ماوس بی‌سیم لاجیتک M185',
    category: 'mouse', brand: 'Logitech',
    price: 420000, oldPrice: null, stock: 22, rating: 4.5,
    image: img('Logitech M185', '1F2937'),
    description: 'ماوس بی‌سیم با باتری ۱۲ ماهه، مناسب کار اداری و خانگی.',
    features: ['بی‌سیم', 'باتری ۱۲ ماه', 'خاموشی خودکار', 'سبک'],
    bestSeller: false,
  },

  // ═══════ هاب و داک ═══════
  {
    id: 'p020',
    title: 'هاب ۷ کاره Type-C بیسوس Metal Gleam',
    category: 'hub', brand: 'Baseus',
    price: 1450000, oldPrice: null, stock: 6, rating: 4.5,
    image: img('Hub 7in1', 'E11D48'),
    description: 'هاب ۷ کاره با HDMI 4K، USB 3.0، کارت‌خوان و پورت شارژ PD 100W.',
    features: ['HDMI 4K', '۷ پورت', 'PD 100W', 'آلومینیومی'],
    bestSeller: false,
  },
  {
    id: 'p021',
    title: 'هاب ۴ کاره USB 3.0',
    category: 'hub', brand: 'Generic',
    price: 380000, oldPrice: 450000, stock: 15, rating: 4.3,
    image: img('USB Hub 4', '6B7280'),
    description: 'هاب ۴ پورت USB 3.0 با سرعت انتقال ۵ گیگابیت.',
    features: ['۴ پورت', 'USB 3.0', 'پلاگ اند پلی', 'کامپکت'],
    bestSeller: false,
  },

  // ═══════ کیف و قاب ═══════
  {
    id: 'p022',
    title: 'کیف محافظ لپ‌تاپ ۱۵.۶ اینچ ضدآب',
    category: 'case', brand: 'Generic',
    price: 420000, oldPrice: 520000, stock: 20, rating: 4.4,
    image: img('Laptop Bag', '6B7280'),
    description: 'کیف ضدآب با لایه فوم داخلی برای محافظت از لپ‌تاپ تا ۱۵.۶ اینچ.',
    features: ['ضدآب', 'فوم محافظ', 'جیب اضافه', 'بند شانه‌ای'],
    bestSeller: false,
  },
  {
    id: 'p023',
    title: 'کاور سیلیکونی ایرپاد پرو',
    category: 'case', brand: 'Generic',
    price: 85000, oldPrice: 120000, stock: 50, rating: 4.2,
    image: img('AirPods Case', '6B7280'),
    description: 'کاور سیلیکونی نرم برای ایرپاد پرو با قابلیت شارژ بی‌سیم.',
    features: ['سیلیکون نرم', 'شارژ بی‌سیم', 'کارابین', 'ضد ضربه'],
    bestSeller: false,
  },

  // ═══════ هولدر و پایه ═══════
  {
    id: 'p024',
    title: 'هولدر مگ‌سیف خودرو بیسوس',
    category: 'holder', brand: 'Baseus',
    price: 380000, oldPrice: 450000, stock: 18, rating: 4.7,
    image: img('Magsafe Car', 'E11D48'),
    description: 'هولدر مغناطیسی مگ‌سیف مناسب دریچه کولر خودرو با چرخش ۳۶۰ درجه.',
    features: ['مگ‌سیف', 'چرخش ۳۶۰', 'قفل محکم', 'نصب آسان'],
    bestSeller: true,
  },
  {
    id: 'p025',
    title: 'پایه موبایل رومیزی آلومینیومی',
    category: 'holder', brand: 'Generic',
    price: 180000, oldPrice: 220000, stock: 35, rating: 4.5,
    image: img('Desk Stand', '6B7280'),
    description: 'پایه رومیزی آلومینیومی با زاویه قابل تنظیم، مناسب موبایل و تبلت.',
    features: ['آلومینیومی', 'زاویه adjustable', 'ضد لغزش', 'جمع‌وجور'],
    bestSeller: false,
  },
]

export const findProduct = (id) => PRODUCTS.find(p => p.id === id)
export const findByCategory = (catId) => PRODUCTS.filter(p => p.category === catId)
export const searchProducts = (q) => {
  const s = q.trim().toLowerCase()
  if (!s) return []
  return PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(s) ||
    p.brand.toLowerCase().includes(s) ||
    p.description.toLowerCase().includes(s)
  )
}
