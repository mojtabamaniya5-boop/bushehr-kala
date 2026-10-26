import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import Header from '../components/Header'
import { Loader2, FileText, Calendar, ArrowRight } from 'lucide-react'

export default function Blog() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    supabase.from('articles').select('title, slug, image, meta_description, created_at').eq('published', true).order('created_at', { ascending: false })
      .then(({ data }) => {
        setArticles(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <>
      <Header title="مقالات و دستور پخت" back />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-4 fade-up">
        <div className="bg-brand-light/30 rounded-3xl p-5 mb-6 text-center border border-brand/20">
          <h1 className="font-extrabold text-lg text-brand mb-2">مجله کافه ترشی 🫙</h1>
          <p className="text-xs text-muted leading-6">جدیدترین مقالات، دستور پخت‌ها و نکات تغذیه‌ای را اینجا بخوانید.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand" size={28} /></div>
        ) : articles.length === 0 ? (
          <div className="text-center py-10">
            <FileText size={48} className="text-muted mx-auto mb-3 opacity-50" />
            <p className="text-sm font-bold text-muted">هنوز مقاله‌ای منتشر نشده است</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map(a => (
              <Link to={`/blog/${a.slug}`} key={a.slug} className="block bg-white rounded-3xl p-3 border border-border shadow-sm active:scale-[0.98] transition">
                <div className="flex gap-3 items-center">
                  {a.image ? (
                    <img src={a.image} alt={a.title} className="w-20 h-20 rounded-2xl object-cover bg-cream flex-shrink-0" loading="lazy" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-cream flex items-center justify-center flex-shrink-0"><FileText className="text-muted" /></div>
                  )}
                  <div className="flex-1 min-w-0 py-1">
                    <h2 className="font-extrabold text-sm text-ink leading-6 line-clamp-2">{a.title}</h2>
                    <p className="text-[11px] text-muted line-clamp-2 mt-1 leading-5">{a.meta_description}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-brand font-bold mt-2">
                      <Calendar size={12} />
                      {new Date(a.created_at).toLocaleDateString('fa-IR')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
