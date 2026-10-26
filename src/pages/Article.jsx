import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import Header from '../components/Header'
import { Loader2, ArrowRight, User, CheckCircle2 } from 'lucide-react'

export default function Article() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    supabase.from('articles').select('*').eq('slug', slug).eq('published', true).single()
      .then(({ data }) => {
        setArticle(data)
        setLoading(false)
      })
  }, [slug])

  if (loading) return (<><Header title="مقاله" back /><div className="flex justify-center pt-20"><Loader2 className="animate-spin text-brand" size={32} /></div></>)
  
  if (!article) return (
    <><Header title="یافت نشد" back />
    <div className="text-center pt-20">
      <p className="text-4xl mb-3">📄</p>
      <p className="font-bold mb-4">مقاله پیدا نشد</p>
      <Link to="/blog" className="text-brand font-bold text-sm">بازگشت به لیست مقالات</Link>
    </div></>
  )

  return (
    <>
      <Header title="مطالعه مقاله" back />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-4 fade-up">
        {article.image && (
          <img src={article.image} alt={article.title} className="w-full h-56 object-cover rounded-3xl mb-5 shadow-sm" />
        )}
        
        <h1 className="font-extrabold text-xl leading-8 text-ink mb-4">{article.title}</h1>
        
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand"><User size={16} /></div>
            <div>
              <div className="text-xs font-bold text-ink">{article.author_name}</div>
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

        <Link to="/blog" className="mt-8 flex items-center justify-center gap-2 text-brand font-bold text-sm bg-brand-light/30 py-3 rounded-2xl active:scale-95 transition">
          <ArrowRight size={16} /> بازگشت به لیست مقالات
        </Link>
      </main>
    </>
  )
}
