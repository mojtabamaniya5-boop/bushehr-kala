import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://slckuoggdkyljvwgtczf.supabase.co'
const SUPABASE_KEY = 'sb_publishable_2s_ZDiqMfUADQVBp6k8kuA_6oCG06ry'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const docsDir = './docs'

async function prerender() {
  try {
    const baseHtml = fs.readFileSync(path.join(docsDir, 'index.html'), 'utf-8')
    let sitemapUrls = []

    // ================= ۱. رندر محصولات =================
    const { data: products } = await supabase.from('products').select('*')
    if (products) {
      for (const p of products) {
        const dir = path.join(docsDir, 'product', p.id)
        fs.mkdirSync(dir, { recursive: true })
        
        let html = baseHtml
        html = html.replace(/<title>.*?<\/title>/, `<title>${p.title} | کافه ترشی</title>`)
        
        // JSON-LD برای محصول
        const jsonLd = {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": p.title,
          "image": p.image || 'https://cafetorshi.ir/icon.png',
          "description": p.description || 'خرید آنلاین ترشی خانگی',
          "offers": {
            "@type": "Offer",
            "priceCurrency": "IRR",
            "price": p.price * 10,
            "availability": p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        }
        html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`)
        
        fs.writeFileSync(path.join(dir, 'index.html'), html)
        sitemapUrls.push(`https://cafetorshi.ir/product/${p.id}`)
      }
    }

    // ================= ۲. رندر مقالات (اگر جدولش وجود داشته باشه) =================
    try {
      const { data: articles } = await supabase.from('articles').select('*')
      if (articles) {
        for (const a of articles) {
          const dir = path.join(docsDir, 'blog', a.slug)
          fs.mkdirSync(dir, { recursive: true })
          
          let html = baseHtml
          html = html.replace(/<title>.*?<\/title>/, `<title>${a.title} | وبلاگ کافه ترشی</title>`)
          
          const jsonLd = {
            "@context": "https://schema.org/",
            "@type": "Article",
            "headline": a.title,
            "author": { "@type": "Person", "name": "مجتبی خسروانی" },
            "publisher": { "@type": "Organization", "name": "کافه ترشی" }
          }
          html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`)
          
          fs.writeFileSync(path.join(dir, 'index.html'), html)
          sitemapUrls.push(`https://cafetorshi.ir/blog/${a.slug}`)
        }
      }
    } catch (e) {
      console.log('جدول مقالات هنوز ساخته نشده (این طبیعی است).')
    }

    // ================= ۳. ساخت Sitemap =================
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    sitemap += `  <url><loc>https://cafetorshi.ir/</loc><priority>1.0</priority></url>\n`
    for (const url of sitemapUrls) {
      sitemap += `  <url><loc>${url}</loc><priority>0.8</priority></url>\n`
    }
    sitemap += `</urlset>`
    fs.writeFileSync(path.join(docsDir, 'sitemap.xml'), sitemap)

    console.log('✅ رندر با موفقیت انجام شد.')
  } catch (err) {
    console.error('❌ خطا در رندر:', err.message)
    process.exit(1)
  }
}

prerender()
