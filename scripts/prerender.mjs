import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// خواندن اطلاعات سوپابیس از فایل کانفیگ






const supabase = createClient('https://slckuoggdkyljvwgtczf.supabase.co', 'sb_publishable_qoww_ltCmUuxIMzCPyYCTQ_rOIoUcSN')
const docsDir = './docs'
const baseHtml = fs.readFileSync(path.join(docsDir, 'index.html'), 'utf-8')

async function prerender() {
  console.log('⏳ دریافت محصولات از دیتابیس...')
  const { data: products, error } = await supabase.from('products').select('*')
  if (error) {
    console.error('خطا در دریافت محصولات:', error)
    return
  }

  console.log(`✅ ${products.length} محصول یافت شد.`)

  // ۱. ساخت صفحات محصولات
  for (const p of products) {
    const productDir = path.join(docsDir, 'product', p.id)
    fs.mkdirSync(productDir, { recursive: true })
    
    // جایگزینی تگ‌ها در HTML پایه
    let html = baseHtml
    const title = `${p.title} | کافه ترشی`
    const desc = p.description || 'خرید آنلاین ترشی خانگی با ارسال سریع'
    const img = p.image || 'https://cafetorshi.ir/icon.png'
    
    // جایگزینی Title و Meta
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${desc}">`)
    html = html.replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${title}">`)
    html = html.replace(/<meta property="og:image" content=".*?">/, `<meta property="og:image" content="${img}">`)

    // تزریق JSON-LD (ساختار داده برای گوگل و ترب)
    const jsonLd = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": p.title,
      "image": img,
      "description": desc,
      "offers": {
        "@type": "Offer",
        "priceCurrency": "IRR",
        "price": p.price * 10, // تومان به ریال
        "availability": (p.stock > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "url": `https://cafetorshi.ir/product/${p.id}`
      }
    }
    
    html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`)
    
    fs.writeFileSync(path.join(productDir, 'index.html'), html)
  }

  // ۲. ساخت صفحات ثابت (ادمین، سبد خرید و...)
  const staticRoutes = ['admin', 'cart', 'checkout', 'profile', 'my-orders']
  for (const route of staticRoutes) {
    const routeDir = path.join(docsDir, route)
    fs.mkdirSync(routeDir, { recursive: true })
    fs.writeFileSync(path.join(routeDir, 'index.html'), baseHtml)
  }

  // ۳. ساخت sitemap.xml
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
  sitemap += `  <url><loc>https://cafetorshi.ir/</loc><priority>1.0</priority></url>\n`
  for (const p of products) {
    sitemap += `  <url><loc>https://cafetorshi.ir/product/${p.id}</loc><priority>0.8</priority></url>\n`
  }
  sitemap += `</urlset>`
  fs.writeFileSync(path.join(docsDir, 'sitemap.xml'), sitemap)

  console.log('✅ تمام صفحات و sitemap.xml ساخته شدند.')
}

prerender()
