import fs from 'fs'
import path from 'path'

const configStr = fs.readFileSync('./src/utils/supabase-config.js', 'utf-8')
const urlMatch = configStr.match(/SUPABASE_URL\s*=\s*['"]([^'"]+)['"]/)
const keyMatch = configStr.match(/SUPABASE_KEY\s*=\s*['"]([^'"]+)['"]/)

if (!urlMatch || !keyMatch) { process.exit(1) }

const SUPABASE_URL = urlMatch[1]
const SUPABASE_KEY = keyMatch[1]
const docsDir = './docs'

async function fetchFromSupabase(table) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    })
    if (!res.ok) return null
    return await res.json()
  } catch (e) { return null }
}

async function prerender() {
  try {
    const baseHtml = fs.readFileSync(path.join(docsDir, 'index.html'), 'utf-8')
    let sitemapUrls = []

    // ۱. ساخت صفحات محصولات
    const products = await fetchFromSupabase('products')
    if (products) {
      for (const p of products) {
        const dir = path.join(docsDir, 'product', p.id)
        fs.mkdirSync(dir, { recursive: true })
        let html = baseHtml.replace(/<title>.*?<\/title>/, `<title>${p.title} | کافه ترشی</title>`)
        const jsonLd = {
          "@context": "https://schema.org/", "@type": "Product",
          "name": p.title, "image": p.image || '', "description": p.description || '',
          "offers": { "@type": "Offer", "priceCurrency": "IRR", "price": p.price * 10 }
        }
        html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`)
        fs.writeFileSync(path.join(dir, 'index.html'), html)
        sitemapUrls.push(`https://cafetorshi.ir/product/${p.id}`)
      }
    }

    // ۲. ساخت صفحات مقالات
    const articlesRaw = await fetchFromSupabase('articles')
    const articles = articlesRaw ? articlesRaw.filter(a => a.published) : null
    const blogDir = path.join(docsDir, 'blog')
    fs.mkdirSync(blogDir, { recursive: true })

    if (articles) {
      for (const a of articles) {
        if (!a.slug) continue;
        const dir = path.join(blogDir, a.slug)
        fs.mkdirSync(dir, { recursive: true })
        
        let html = baseHtml.replace(/<title>.*?<\/title>/, `<title>${a.meta_title || a.title} | کافه ترشی</title>`)
        
        const metaTags = `
    <meta name="description" content="${a.meta_description || ''}">
    <meta property="og:title" content="${a.meta_title || a.title}">
    <meta property="og:description" content="${a.meta_description || ''}">
    <meta property="og:image" content="${a.image || ''}">
    <meta property="og:url" content="https://cafetorshi.ir/blog/${a.slug}">
    <meta property="og:type" content="article">
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
        sitemapUrls.push(`https://cafetorshi.ir/blog/${a.slug}`)
      }
    }

    // ۳. ساخت صفحه اصلی بلاگ (باید همیشه آخر باشد تا با مقالات تداخل نکند)
    const blogIndexHtml = baseHtml.replace(/<title>.*?<\/title>/, `<title>مجله کافه ترشی | مقالات و دستور پخت</title>`)
    const blogIndexWithMeta = blogIndexHtml.replace('</head>', `<meta name="description" content="جدیدترین مقالات، دستور پخت‌ها و نکات تغذیه‌ای در مجله کافه ترشی">\n</head>`)
    fs.writeFileSync(path.join(blogDir, 'index.html'), blogIndexWithMeta)
    sitemapUrls.push('https://cafetorshi.ir/blog')

    // ۴. ساخت سایت‌مپ
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    sitemap += `  <url><loc>https://cafetorshi.ir/</loc><priority>1.0</priority></url>\n`
    for (const url of sitemapUrls) sitemap += `  <url><loc>${url}</loc><priority>0.8</priority></url>\n`
    sitemap += `</urlset>`
    fs.writeFileSync(path.join(docsDir, 'sitemap.xml'), sitemap)

    // ۵. ساخت فید ترب
    let torobXml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n<channel>\n<title>کافه ترشی</title>\n<link>https://cafetorshi.ir</link>\n<description>فروشگاه ترشیجات خانگی</description>\n`
    if (products) {
      for (const p of products) {
        if (p.active !== false) {
          torobXml += `<item>\n`
          torobXml += `<title>${p.title}</title>\n`
          torobXml += `<link>https://cafetorshi.ir/product/${p.id}?utm_source=torob</link>\n`
          torobXml += `<description>${p.description || ''}</description>\n`
          torobXml += `<g:id>${p.id}</g:id>\n`
          torobXml += `<g:price>${p.price} تومان</g:price>\n`
          torobXml += `<g:availability>${p.stock > 0 ? 'in stock' : 'out of stock'}</g:availability>\n`
          torobXml += `<g:image_link>${p.image || 'https://cafetorshi.ir/icon.png'}</g:image_link>\n`
          torobXml += `<g:condition>new</g:condition>\n`
          torobXml += `</item>\n`
        }
      }
    }
    torobXml += `</channel>\n</rss>`
    fs.writeFileSync(path.join(docsDir, 'torob.xml'), torobXml)
    console.log('✅ torob.xml ساخته شد.')

    console.log('✅ رندر با موفقیت انجام شد.')
  } catch (err) { 
    console.error(err);
    process.exit(1) 
  }
}
prerender()
