import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import Header from '../components/Header'
import { Loader2, ArrowRight, User, CheckCircle2, ShoppingCart } from 'lucide-react'

export default function Article() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    supabase.from('articles').select('*').eq('slug', slug).eq('published', true).single()
      .then(({ data }) => {
        setArticle(data)
        if (data) {
          if (data.product_id) {
            supabase.from('products').select('*').eq('id', data.product_id).single().then(({data: p}) => setProduct(p))
          }
          supabase.from('articles').select('*').eq('published', true).neq('id', data.id).limit(3).then(({data: r}) => setRelated(r || []))
        }
        setLoading(false)
      }).catch((err) => {
        console.error(err);
        setLoading(false);
      })
  }, [slug])

  if (loading) return (
    <>
      <Header title="مقاله" back />
      <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-brand" size={32} /></div>
    </>
  )

  if (!article) return (
    <>
      <Header title="یافت نشد" back />
      <div className="text-center pt-20">
        <p className="text-4xl mb-3">📄</p>
        <p className="font-bold mb-4">مقاله پیدا نشد</p>
        <Link to="/blog" className="text-brand font-bold text-sm">بازگشت به لیست مقالات</Link>
      </div>
    </>
  )

  return (
    <>
      <Header title="مطالعه مقاله" back />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-4 fade-up">
        {article.image && (
          <img src={article.image} alt={article.title} width="800" height="400" className="w-full h-56 object-cover rounded-3xl mb-5 shadow-sm" />
        )}

        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-3">
          <Link to="/" className="hover:text-brand">خانه</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-brand">مجله</Link>
          <span>/</span>
          <span className="text-brand font-bold">{article.title}</span>
        </div>

        <h1 className="font-extrabold text-xl leading-8 text-ink mb-4">{article.title}</h1>

        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand">
              <User size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-ink">{article.author_name || 'کافه ترشی'}</div>
              <div className="text-[10px] text-muted">نویسنده</div>
            </div>
          </div>
          {article.reviewed_by && (
            <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg">
              <CheckCircle2 size={12} /> تایید شده توسط {article.reviewed_by}
            </div>
          )}
        </div>

        {/* محتوای مقاله با پشتیبانی از خطوط جدید و HTML */}
        <div className="prose prose-sm max-w-none text-ink leading-8 text-justify text-[13px] whitespace-pre-wrap"
             dangerouslySetInnerHTML={{ __html: (article.content || '').replace(/\n/g, '<br/>') ? (article.content || '').replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : '' }} />

        {/* 🛒 کارت محصول مرتبط (معماری جدید و تمیز) */}
        {product && (
          <div className="mt-10 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-4" dir="rtl">
            <img src={product.image} alt={product.title} width="100" height="100" loading="lazy" className="w-24 h-24 object-cover rounded-xl border border-gray-100" />
            <div className="flex-1 text-center sm:text-right">
              <h3 className="text-sm font-bold text-gray-800 mb-1">{product.title}</h3>
              <p className="text-xs text-brand font-bold mb-3">{new Intl.NumberFormat('fa-IR').format(product.price)} تومان</p>
              <Link to={`/product/${product.id}?utm_source=blog&utm_medium=article&utm_campaign=${article.slug}`} className="inline-block bg-[#2E7D32] text-white text-sm font-bold py-2.5 px-6 rounded-xl shadow-md active:scale-95 transition">🛒 مشاهده و خرید محصول</Link>
            </div>
          </div>
        )}

        {/* سوالات متداول */}
        {article.faq && article.faq.length > 0 && (
          <div className="mt-8 bg-cream border border-border rounded-2xl p-4">
            <h3 className="font-extrabold text-sm text-ink mb-3">سوالات متداول</h3>
            <div className="space-y-3">
              {(Array.isArray(article.faq[0]) ? article.faq[0] : article.faq).filter(f => f.q?.trim() && f.a?.trim()).map((f, i) => (
                <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-border/50">
                  <div className="font-bold text-xs text-brand mb-1.5">{f.q}</div>
                  <div className="text-[11px] text-muted leading-6">{f.a}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        
        {related.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="font-extrabold text-sm mb-4">مقاله‌های مرتبط</h3>
            <div className="grid gap-3">
              {related.map(r => (
                <Link key={r.id} to={`/blog/${r.slug}`} className="block bg-white border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition">
                  <div className="text-xs font-bold text-ink">{r.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link to="/blog" className="mt-8 flex items-center justify-center gap-2 text-brand font-bold text-sm bg-brand-light/30 py-3 rounded-2xl active:scale-95 transition">
          <ArrowRight size={16} /> بازگشت به لیست مقالات
        </Link>
      </main>
    </>
  )
}
