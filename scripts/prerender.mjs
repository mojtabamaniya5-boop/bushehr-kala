import fs from 'fs'
import path from 'path'

const configStr = fs.readFileSync('./src/utils/supabase-config.js', 'utf-8')
const urlMatch = configStr.match(/SUPABASE_URL\s*=\s*['"]([^'"]+)['"]/)
const keyMatch = configStr.match(/SUPABASE_KEY\s*=\s*['"]([^'"]+)['"]/)

if (!urlMatch || !keyMatch) {
  console.error('❌ خطا: SUPABASE_URL یا SUPABASE_KEY در src/utils/supabase-config.js پیدا نشد.')
  process.exit(1)
}

const SUPABASE_URL = urlMatch[1]
const SUPABASE_KEY = keyMatch[1]
const docsDir = './docs'

// مقداردهی امن برای استفاده داخل ویژگی‌های HTML و تگ‌ها:
// اگر عنوان یا توضیح دارای " یا < باشد، بدون escape متا تگ‌ها خراب می‌شوند.
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function fetchFromSupabase(table) {
  // نکته مهم سئو: این تابع دیگر در صورت خطا null برنمی‌گرداند.
  // قبلاً خطای شبکه/سوپابیس باعث می‌شد پررندر با سایت‌مپ خالی و بدون
  // هیچ صفحه مقاله‌ای «موفق» تمام شود و rsync با --delete همه صفحات
  // مقاله را از روی سرور پاک کند. حالا هر خطایی بیلد را متوقف می‌کند.
  let res
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    })
  } catch (e) {
    throw new Error(`دریافت جدول ${table} از Supabase ناموفق بود (خطای شبکه): ${e.message}`)
  }
  if (!res.ok) {
    throw new Error(`دریافت جدول ${table} از Supabase ناموفق بود (HTTP ${res.status})`)
  }
  return await res.json()
}

async function prerender() {
  try {
    const baseHtml = fs.readFileSync(path.join(docsDir, 'index.html'), 'utf-8')
    let sitemapUrls = []

    // ۱. اول هر دو جدول را بگیر؛ اگر یکی هم خطا بدهد، قبل از نوشتن
    // هیچ فایلی بیلد متوقف می‌شود تا خروجی ناقص دیپلوی نشود.
    const products = await fetchFromSupabase('products')
    const articlesRaw = await fetchFromSupabase('articles')
    const articles = articlesRaw.filter(a => a.published)

    if (articles.length === 0) {
      throw new Error('هیچ مقاله منتشرشده‌ای از Supabase دریافت نشد؛ برای جلوگیری از خالی شدن سایت‌مپ و حذف صفحات مقاله از سرور، بیلد متوقف شد.')
    }

    // ۲. پاک کردن پوشه‌های قدیمی مقاله/محصول تا اسلاگ‌های حذف‌شده یا
    // تغییرکرده برای همیشه روی سرور و در ایندکس گوگل نمانند.
    // (index.html لیست بلاگ پایین‌تر دوباره ساخته می‌شود.)
    const blogDir = path.join(docsDir, 'blog')
    const productDir = path.join(docsDir, 'product')
    fs.rmSync(blogDir, { recursive: true, force: true })
    fs.rmSync(productDir, { recursive: true, force: true })
    fs.mkdirSync(blogDir, { recursive: true })
    fs.mkdirSync(productDir, { recursive: true })

    // ۳. محصولات
    for (const p of products) {
      const dir = path.join(docsDir, 'product', p.id)
      fs.mkdirSync(dir, { recursive: true })
      let html = baseHtml.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(p.title)} | کافه ترشی</title>`)
      const torobMeta = `
    <meta name="product_id" content="${p.id}">
    <meta name="product_name" content="${escapeHtml(p.title)}">
    <meta property="og:image" content="${p.image || 'https://cafetorshi.ir/icon.png'}">
    <meta property="og:image:width" content="800">
    <meta property="og:image:height" content="800">
    <meta property="og:image:type" content="image/png">
    <meta name="product_price" content="${p.price}">
    <meta name="availability" content="${p.stock > 0 ? 'instock' : 'outofstock'}">
    <meta name="guarantee" content="اصالت کالا">
    <meta property="og:title" content="${escapeHtml(p.title)} | کافه ترشی">
    <meta property="og:description" content="${escapeHtml(p.description || 'خرید ' + p.title + ' از کافه ترشی')}">
    <meta property="og:url" content="https://cafetorshi.ir/product/${p.id}">
    <meta property="og:type" content="product">
    <link rel="canonical" href="https://cafetorshi.ir/product/${p.id}">
    `
      const jsonLd = {
        "@context": "https://schema.org/", "@type": "Product",
        "name": p.title, "image": p.image || '', "description": p.description || '',
        "offers": { "@type": "Offer", "priceCurrency": "IRR", "price": p.price * 10 }
      }
      html = html.replace('</head>', torobMeta + `\n<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`)
      fs.writeFileSync(path.join(dir, 'index.html'), html)
      // lastmod واقعی محصول، نه زمان بیلد؛ وگرنه هر دیپلوی lastmod همه
      // محصولات عوض می‌شود و گوگل بی‌دلیل همه را دوباره می‌خزد.
      sitemapUrls.push({ url: `https://cafetorshi.ir/product/${p.id}`, lastmod: p.updated_at || p.created_at || null })
    }

    // ۴. مقالات
    for (const a of articles) {
      if (!a.slug) continue;
      const dir = path.join(blogDir, a.slug)
      fs.mkdirSync(dir, { recursive: true })

      const pageTitle = escapeHtml(a.meta_title || a.title)
      const pageDesc = escapeHtml(a.meta_description || '')
      const ogImage = a.image || 'https://cafetorshi.ir/icon.png'
      let html = baseHtml.replace(/<title>.*?<\/title>/, `<title>${pageTitle} | کافه ترشی</title>`)
      // inject-content: تزریق متن برای خزنده‌ها
      html = html.replace('<div id="root"></div>', `<div id="root"><h1>${escapeHtml(a.title)}</h1><div>${a.content || ''}</div></div>`)

      const metaTags = `
    <meta name="description" content="${pageDesc}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${pageDesc}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:url" content="https://cafetorshi.ir/blog/${a.slug}">
    <meta property="og:type" content="article">
    <link rel="canonical" href="https://cafetorshi.ir/blog/${a.slug}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageTitle}">
    <meta name="twitter:description" content="${pageDesc}">
    <meta name="twitter:image" content="${ogImage}">
    ${a.no_index ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow">'}
    `
      html = html.replace('</head>', metaTags + '\n</head>')

      let jsonLd = {
        "@context": "https://schema.org/",
        "@type": a.article_type || "Article",
        "headline": a.title,
        "image": a.image || '',
        "author": { "@type": "Person", "name": a.author_name || "کافه ترشی" },
        "publisher": { "@type": "Organization", "name": "کافه ترشی", "logo": { "@type": "ImageObject", "url": "https://cafetorshi.ir/icon.png" } },
        "datePublished": a.created_at,
        "dateModified": a.updated_at || a.created_at,
        "description": a.meta_description || ""
      };

      if (a.faq) {
        let faqList = Array.isArray(a.faq[0]) ? a.faq[0] : a.faq;
        const cleanFaq = faqList.filter(f => f.q && f.a);
        if (cleanFaq.length > 0) {
          jsonLd.mainEntity = cleanFaq.map(f => ({
            "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }));
          if (jsonLd["@type"] === "Article") jsonLd["@type"] = ["Article", "FAQPage"];
          else jsonLd["@type"] = "FAQPage";
        }
      }

      html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`)
      fs.writeFileSync(path.join(dir, 'index.html'), html)
      sitemapUrls.push({ url: `https://cafetorshi.ir/blog/${a.slug}`, lastmod: a.updated_at || a.created_at })
    }

    // ۵. صفحه اصلی (Home) و لیست بلاگ
    const homeHtml = baseHtml.replace(/<title>.*?<\/title>/, `<title>کافه ترشی | فروشگاه آنلاین ترشیجات خانگی</title>`)
    fs.writeFileSync(path.join(docsDir, 'index.html'), homeHtml)

    // ۵. صفحه اصلی بلاگ (بدون تداخل)
    const blogIndexHtml = baseHtml.replace(/<title>.*?<\/title>/, `<title>مجله کافه ترشی | مقالات و دستور پخت</title>`)
    const blogIndexWithMeta = blogIndexHtml.replace('</head>', `<meta name="description" content="جدیدترین مقالات، دستور پخت‌ها و نکات تغذیه‌ای در مجله کافه ترشی">\n</head>`)
    fs.writeFileSync(path.join(blogDir, 'index.html'), blogIndexWithMeta)
    sitemapUrls.push('https://cafetorshi.ir/blog')

    // ۶. سایت‌مپ و ترب
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    sitemap += `  <url><loc>https://cafetorshi.ir/</loc><priority>1.0</priority></url>\n`
    for (const item of sitemapUrls) { const u = item.url || item; const lm = item.lastmod ? `<lastmod>${new Date(item.lastmod).toISOString().split('T')[0]}</lastmod>` : ''; sitemap += `  <url><loc>${u}</loc>${lm}<priority>0.8</priority></url>\n` }
    sitemap += `</urlset>`
    fs.writeFileSync(path.join(docsDir, 'sitemap.xml'), sitemap)

    let torobXml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n<channel>\n<title>کافه ترشی</title>\n<link>https://cafetorshi.ir</link>\n<description>فروشگاه ترشیجات خانگی</description>\n`
    for (const p of products) {
      if (p.active !== false) {
        torobXml += `<item>\n<title>${escapeHtml(p.title)}</title>\n<link>https://cafetorshi.ir/product/${p.id}?utm_source=torob</link>\n<description>${escapeHtml(p.description || '')}</description>\n<g:id>${p.id}</g:id>\n<g:price>${p.price} تومان</g:price>\n<g:availability>${p.stock > 0 ? 'in stock' : 'out of stock'}</g:availability>\n<g:image_link>${p.image || 'https://cafetorshi.ir/icon.png'}</g:image_link>\n<g:condition>new</g:condition>\n</item>\n`
      }
    }
    torobXml += `</channel>\n</rss>`
    fs.writeFileSync(path.join(docsDir, 'torob.xml'), torobXml)
    console.log(`✅ پررندر کامل شد: ${products.length} محصول، ${articles.length} مقاله منتشرشده، ${sitemapUrls.length + 1} آدرس در سایت‌مپ.`)
    console.log('✅ torob.xml ساخته شد.')
    console.log('✅ رندر با موفقیت انجام شد.')
  } catch (err) {
    console.error(err);
    process.exit(1)
  }
}
prerender()
