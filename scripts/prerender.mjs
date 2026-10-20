import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// کلیدهای سوپابیس (public)
const SUPABASE_URL = 'https://slckuoggdkyljvwgtczf.supabase.co'
const SUPABASE_KEY = 'sb_publishable_2s_ZDiqMfUADQVBp6k8kuA_6oCG06ry' // از فایل config خودت

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const docsDir = './docs'

async function prerender() {
  try {
    if (!fs.existsSync(path.join(docsDir, 'index.html'))) {
      console.log('⚠️ فایل index.html پیدا نشد. Prerender رد شد.')
      return
    }

    const baseHtml = fs.readFileSync(path.join(docsDir, 'index.html'), 'utf-8')
    console.log('⏳ دریافت محصولات از دیتابیس...')
    
    const { data: products, error } = await supabase.from('products').select('*')
    if (error || !products) {
      console.error('❌ خطا در دریافت محصولات:', error)
      return // بیلد رو خراب نکن
    }

    console.log(`✅ ${products.length} محصول یافت شد.`)

    // ساخت صفحات محصولات
    for (const p of products) {
      const productDir = path.join(docsDir, 'product', p.id)
      fs.mkdirSync(productDir, { recursive: true })
      
      let html = baseHtml
      const title = `${p.title} | کافه ترشی`
      const desc = p.description || 'خرید آنلاین ترشی خانگی با ارسال سریع'
      
      html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${desc}">`)
      
      fs.writeFileSync(path.join(productDir, 'index.html'), html)
    }

    // ساخت صفحات ثابت
    const staticRoutes = ['admin', 'cart', 'checkout', 'profile', 'my-orders']
    for (const route of staticRoutes) {
      const routeDir = path.join(docsDir, route)
      fs.mkdirSync(routeDir, { recursive: true })
      fs.writeFileSync(path.join(routeDir, 'index.html'), baseHtml)
    }

    // ساخت sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    sitemap += `  <url><loc>https://cafetorshi.ir/</loc><priority>1.0</priority></url>\n`
    for (const p of products) {
      sitemap += `  <url><loc>https://cafetorshi.ir/product/${p.id}</loc><priority>0.8</priority></url>\n`
    }
    sitemap += `</urlset>`
    fs.writeFileSync(path.join(docsDir, 'sitemap.xml'), sitemap)

    console.log('✅ تمام صفحات و sitemap.xml ساخته شدند.')
  } catch (err) {
    console.error('⚠️ خطای غیرمنتظره در Prerender (بیلد ادامه می‌یابد):', err.message)
  }
}

prerender()
