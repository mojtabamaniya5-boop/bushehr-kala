// ═══════════════════════════════════
// کافه ترشی — داده‌های فروشگاه
// ═══════════════════════════════════

export const SHOP_INFO = {
  name: 'کافه ترشی',
  tagline: 'طعم اصیل، با ارسال سریع',
  phone: '07700000000',
  telegram: 'cafetorshi',
  card: {
    number: '5859831086263828',
    holder: 'مهدی محمدی',
    bank: 'بانک مسکن',
  },
  address: 'بوشهر، خیابان ساحلی، پلاک ۱۲۳',
  shippingFast: 25000,
  shippingNormal: 15000,
  freeShippingFrom: 500000,
}

export const CATEGORIES = [
  { id: 'cucumber',    name: 'خیارشور',        icon: '🥒' },
  { id: 'mixed',       name: 'ترشی مخلوط',     icon: '🥕' },
  { id: 'olive',       name: 'زیتون',          icon: '🫒' },
  { id: 'garlic',      name: 'سیرترشی',        icon: '🧄' },
  { id: 'vegetables',  name: 'سبزیجات',        icon: '🥬' },
  { id: 'salads',      name: 'سالادها',        icon: '🥗' },
  { id: 'special',     name: 'ترشی ویژه',      icon: '🌶️' },
  { id: 'other',       name: 'سایر ترشیجات',   icon: '🫙' },
]

export const WEIGHTS = [
  { id: '500g', label: '۵۰۰ گرم', multiplier: 1 },
  { id: '1kg',  label: '۱ کیلو',  multiplier: 1.8 },
  { id: '2kg',  label: '۲ کیلو',  multiplier: 3.4 },
]

export const PRODUCTS = [
  { id: 't001', title: 'خیارشور ویژه خانگی', category: 'cucumber', price: 95000, oldPrice: 115000, stock: 25, rating: 4.8, reviews: 156, weight: '۵۰۰ گرم', image: '',
    description: 'خیارشور ویژه با طعم اصیل و تردی بی‌نظیر، تهیه شده از خیار تازه بوشهری و سرکه طبیعی.',
    features: ['تازه و خانگی', 'بدون مواد نگهدارنده', 'شیشه‌ای بهداشتی', 'طعم اصیل بوشهری'], bestSeller: true },
  { id: 't002', title: 'ترشی مخلوط خانگی', category: 'mixed', price: 85000, oldPrice: null, stock: 30, rating: 4.6, reviews: 98, weight: '۵۰۰ گرم', image: '',
    description: 'ترشی مخلوط از سبزیجات تازه فصل با سرکه طبیعی و ادویه‌های مخصوص.',
    features: ['سبزیجات تازه', 'سرکه طبیعی', 'ادویه مخصوص', 'خانگی'], bestSeller: true },
  { id: 't003', title: 'زیتون شور درجه یک', category: 'olive', price: 120000, oldPrice: 140000, stock: 18, rating: 4.7, reviews: 124, weight: '۵۰۰ گرم', image: '',
    description: 'زیتون شور درجه یک با اندازه درشت و طعم متعادل.',
    features: ['درجه یک', 'دانه‌درشت', 'طعم متعادل', 'مناسب رژیم مدیترانه'], bestSeller: true },
  { id: 't004', title: 'سیرترشی تازه', category: 'garlic', price: 75000, oldPrice: null, stock: 22, rating: 4.5, reviews: 67, weight: '۵۰۰ گرم', image: '',
    description: 'سیرترشی با سیر تازه همدانی و سرکه طبیعی.',
    features: ['سیر همدانی', 'سرکه طبیعی', 'خواص دارویی', 'طعم ملایم'], bestSeller: true },
  { id: 't005', title: 'ترشی سبزیجات معطر', category: 'vegetables', price: 60000, oldPrice: 75000, stock: 28, rating: 4.4, reviews: 45, weight: '۵۰۰ گرم', image: '',
    description: 'ترشی سبزیجات معطر با سبزی‌های تازه باغی.',
    features: ['سبزی تازه', 'معطر', 'خانگی', 'طعم سنتی'], bestSeller: false },
  { id: 't006', title: 'سالاد ترشی فصل', category: 'salads', price: 90000, oldPrice: null, stock: 15, rating: 4.6, reviews: 52, weight: '۵۰۰ گرم', image: '',
    description: 'سالاد ترشی از مخلوط سبزیجات تازه فصل با سس مخصوص خانگی.',
    features: ['سبزیجات فصل', 'سس مخصوص', 'خانگی', 'تازه'], bestSeller: false },
  { id: 't007', title: 'ترشی هفت‌بیجار ویژه', category: 'special', price: 145000, oldPrice: 165000, stock: 10, rating: 4.9, reviews: 203, weight: '۷۰۰ گرم', image: '',
    description: 'ترشی هفت‌بیجار ویژه با ۷ نوع سبزیجات مخصوص.',
    features: ['۷ نوع سبزی', 'دست‌ساز', 'طعم ویژه', 'بسته‌بندی شیک'], bestSeller: true },
  { id: 't008', title: 'ترشی بادمجان شکم‌پر', category: 'special', price: 130000, oldPrice: null, stock: 8, rating: 4.7, reviews: 89, weight: '۶۰۰ گرم', image: '',
    description: 'ترشی بادمجان شکم‌پر با سبزیجات معطر و سیر تازه.',
    features: ['بادمجان تازه', 'سبزی معطر', 'دست‌ساز', 'خانگی'], bestSeller: false },
  { id: 't009', title: 'خیارشور قلمی ممتاز', category: 'cucumber', price: 110000, oldPrice: 130000, stock: 20, rating: 4.8, reviews: 142, weight: '۶۰۰ گرم', image: '',
    description: 'خیارشور قلمی ممتاز با خیارهای ریز و ترد.',
    features: ['خیار قلمی', 'ترد و تازه', 'طعم ممتاز', 'دست‌چین'], bestSeller: true },
  { id: 't010', title: 'زیتون پرورده شمالی', category: 'olive', price: 155000, oldPrice: 175000, stock: 12, rating: 4.9, reviews: 178, weight: '۵۰۰ گرم', image: '',
    description: 'زیتون پرورده شمالی با گردو، رب انار و سبزیجات معطر.',
    features: ['گردو تازه', 'رب انار', 'سبزی معطر', 'اصیل شمالی'], bestSeller: true },
  { id: 't011', title: 'ترشی لیمو ترش', category: 'special', price: 95000, oldPrice: null, stock: 14, rating: 4.5, reviews: 61, weight: '۵۰۰ گرم', image: '',
    description: 'ترشی لیمو ترش خانگی با طعم تازه و ملس.',
    features: ['لیمو تازه', 'خانگی', 'طعم ملس', 'مناسب غذاهای دریایی'], bestSeller: false },
  { id: 't012', title: 'سیرترشی بالزامیک', category: 'garlic', price: 105000, oldPrice: 120000, stock: 16, rating: 4.7, reviews: 74, weight: '۵۰۰ گرم', image: '',
    description: 'سیرترشی با سرکه بالزامیک اصل و طعم خاص مدیترانه‌ای.',
    features: ['سرکه بالزامیک', 'سیر همدانی', 'طعم خاص', 'خانگی'], bestSeller: false },
  { id: 't013', title: 'ترشی مخلوط تند', category: 'mixed', price: 92000, oldPrice: null, stock: 24, rating: 4.6, reviews: 83, weight: '۵۰۰ گرم', image: '',
    description: 'ترشی مخلوط تند برای علاقه‌مندان به طعم‌های پرقدرت.',
    features: ['تند', 'فلفل قرمز', 'سبزیجات تازه', 'خانگی'], bestSeller: false },
  { id: 't014', title: 'ترشی گل کلم', category: 'vegetables', price: 70000, oldPrice: 85000, stock: 18, rating: 4.4, reviews: 38, weight: '۵۰۰ گرم', image: '',
    description: 'ترشی گل کلم با طعم ملایم و تردی عالی.',
    features: ['گل کلم تازه', 'ترد', 'طعم ملایم', 'خانگی'], bestSeller: false },
  { id: 't015', title: 'سالاد الویه ترشی', category: 'salads', price: 125000, oldPrice: null, stock: 9, rating: 4.8, reviews: 112, weight: '۶۰۰ گرم', image: '',
    description: 'سالاد الویه با ترشی مخصوص و سس خانگی.',
    features: ['گوشت مرغ', 'ترشی مخصوص', 'سس خانگی', 'تازه'], bestSeller: true },
  { id: 't016', title: 'ترشی انبه', category: 'special', price: 135000, oldPrice: 155000, stock: 7, rating: 4.6, reviews: 56, weight: '۵۰۰ گرم', image: '',
    description: 'ترشی انبه با طعم ملس و شیرین.',
    features: ['انبه تازه', 'طعم ملس', 'خانگی', 'بسته‌بندی شیک'], bestSeller: false },
  { id: 't017', title: 'زیتون سیاه شور', category: 'olive', price: 110000, oldPrice: null, stock: 15, rating: 4.5, reviews: 62, weight: '۵۰۰ گرم', image: '',
    description: 'زیتون سیاه شور با طعم غنی و ماندگار.',
    features: ['زیتون سیاه', 'طعم غنی', 'درجه یک', 'مناسب سالاد'], bestSeller: false },
  { id: 't018', title: 'خیارشور نعنا', category: 'cucumber', price: 100000, oldPrice: 120000, stock: 22, rating: 4.7, reviews: 91, weight: '۵۰۰ گرم', image: '',
    description: 'خیارشور با نعنا تازه، عطر بی‌نظیر.',
    features: ['نعنا تازه', 'عطر بی‌نظیر', 'خیار ترد', 'خانگی'], bestSeller: true },
  { id: 't019', title: 'ترشی کلم قرمز', category: 'vegetables', price: 80000, oldPrice: null, stock: 19, rating: 4.3, reviews: 33, weight: '۵۰۰ گرم', image: '',
    description: 'ترشی کلم قرمز با رنگ جذاب و طعم ملایم.',
    features: ['کلم قرمز', 'رنگ طبیعی', 'طعم ملایم', 'خانگی'], bestSeller: false },
  { id: 't020', title: 'ترشی فلفل شکم‌پر', category: 'mixed', price: 118000, oldPrice: 138000, stock: 11, rating: 4.7, reviews: 79, weight: '۶۰۰ گرم', image: '',
    description: 'ترشی فلفل شکم‌پر با سبزیجات معطر.',
    features: ['فلفل دلمه‌ای', 'سبزی معطر', 'سیر تازه', 'خانگی'], bestSeller: false },
  { id: 't021', title: 'ترشی هویج و گل کلم', category: 'vegetables', price: 85000, oldPrice: null, stock: 21, rating: 4.4, reviews: 41, weight: '۵۰۰ گرم', image: '',
    description: 'ترشی هویج و گل کلم با طعم متعادل.',
    features: ['هویج تازه', 'گل کلم', 'ترد', 'خانگی'], bestSeller: false },
  { id: 't022', title: 'زیتون شکسته پرورده', category: 'olive', price: 140000, oldPrice: 160000, stock: 13, rating: 4.8, reviews: 134, weight: '۵۰۰ گرم', image: '',
    description: 'زیتون شکسته پرورده با گردو و رب انار اصیل.',
    features: ['زیتون شکسته', 'گردو', 'رب انار', 'دست‌ساز'], bestSeller: true },
  { id: 't023', title: 'ترشی سیر و فلفل', category: 'garlic', price: 88000, oldPrice: null, stock: 17, rating: 4.5, reviews: 58, weight: '۵۰۰ گرم', image: '',
    description: 'ترشی سیر و فلفل با طعم تند و دلچسب.',
    features: ['سیر تازه', 'فلفل تند', 'طعم خاص', 'خانگی'], bestSeller: false },
  { id: 't024', title: 'ترشی گوجه سبز', category: 'special', price: 125000, oldPrice: null, stock: 6, rating: 4.6, reviews: 47, weight: '۵۰۰ گرم', image: '',
    description: 'ترشی گوجه سبز با طعم ملس و خاص.',
    features: ['گوجه سبز', 'طعم ملس', 'خانگی', 'دست‌ساز'], bestSeller: false },
  { id: 't025', title: 'خیارشور عسلی', category: 'cucumber', price: 98000, oldPrice: 115000, stock: 20, rating: 4.7, reviews: 106, weight: '۵۰۰ گرم', image: '',
    description: 'خیارشور عسلی با طعم ملایم و شیرین عسل طبیعی.',
    features: ['عسل طبیعی', 'خیار تازه', 'طعم ملایم', 'خانگی'], bestSeller: false },
]

export const findProduct = (id) => PRODUCTS.find(p => p.id === id)
export const findByCategory = (catId) => PRODUCTS.filter(p => p.category === catId)
export const searchProducts = (q) => {
  const s = q.trim().toLowerCase()
  if (!s) return []
  return PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(s) ||
    p.description.toLowerCase().includes(s)
  )
}
