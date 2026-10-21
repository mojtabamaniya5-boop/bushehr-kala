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
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    sitemap += `  <url><loc>https://cafetorshi.ir/</loc><priority>1.0</priority></url>\n`
    for (const url of sitemapUrls) sitemap += `  <url><loc>${url}</loc><priority>0.8</priority></url>\n`
    sitemap += `</urlset>`
    fs.writeFileSync(path.join(docsDir, 'sitemap.xml'), sitemap)
    console.log('✅ رندر با موفقیت انجام شد.')
  } catch (err) { process.exit(1) }
}
prerender()
