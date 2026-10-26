import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { toast } from '../components/Toast'
import { Edit2, Trash2, Plus, Loader2, Save, X, Wand2, Upload, Image as ImageIcon } from 'lucide-react'

export default function AdminBlog() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [uploading, setUploading] = useState(false)

  const fetchArticles = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
    if (error) toast.error('خطا در خواندن مقالات')
    else setArticles(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchArticles() }, [])

  const handleSave = async () => {
    if (!editing.title || !editing.slug || !editing.content) return toast.error('عنوان، اسلاگ و متن الزامی است')
    const isNew = !editing.id
    
    // پاکسازی آرایه سوالات (اگر کاربر به اشتباه دوبار براکت زده بود)
    let cleanFaq = editing.faq || []
    if (cleanFaq.length === 1 && Array.isArray(cleanFaq[0])) {
      cleanFaq = cleanFaq[0]
    }

    const payload = { ...editing, faq: cleanFaq, updated_at: new Date().toISOString() }
    if (isNew) delete payload.id

    const { error } = isNew 
      ? await supabase.from('articles').insert([payload])
      : await supabase.from('articles').update(payload).eq('id', editing.id)

    if (error) toast.error(error.message)
    else {
      toast.success('ذخیره شد')
      setEditing(null)
      fetchArticles()
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این مقاله مطمئن هستید؟')) return;
    const { data, error } = await supabase.from('articles').delete().eq('id', id).select();
    if (error) toast.error('خطا در حذف: ' + error.message);
    else if (data.length === 0) toast.error('شما دسترسی حذف ندارید یا مقاله پیدا نشد');
    else {
      toast.success('مقاله با موفقیت حذف شد');
      fetchArticles();
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fileName = `blog-${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('product-images').upload(fileName, file)
    if (error) toast.error('خطا در آپلود: ' + error.message)
    else {
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      setEditing({ ...editing, image: data.publicUrl })
      toast.success('عکس آپلود شد')
    }
    setUploading(false)
  }

  const autoGenerateSEO = () => {
    if (!editing.title) return toast.error('اول عنوان را بنویسید')
    const generatedSlug = editing.title.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\u0600-\u06FF-]/g, '')
    const generatedTitle = editing.title.length > 60 ? editing.title.substring(0, 57) + '...' : editing.title
    const cleanContent = (editing.content || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ')
    const generatedDesc = cleanContent.length > 150 ? cleanContent.substring(0, 147) + '...' : cleanContent
    const generatedKeyword = editing.title.split(' ').slice(0, 2).join(' ')
    setEditing({ ...editing, slug: generatedSlug, meta_title: generatedTitle, meta_description: generatedDesc, focus_keyword: generatedKeyword })
    toast.success('فیلدهای سئو پر شد!')
  }

  const addFaq = () => setEditing({ ...editing, faq: [...(editing.faq || []), { q: '', a: '' }] })
  const updateFaq = (index, field, value) => {
    const newFaq = [...(editing.faq || [])]
    newFaq[index][field] = value
    setEditing({ ...editing, faq: newFaq })
  }
  const removeFaq = (index) => {
    const newFaq = [...(editing.faq || [])]
    newFaq.splice(index, 1)
    setEditing({ ...editing, faq: newFaq })
  }

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand" /></div>

  if (editing) {
    return (
      <div className="space-y-3 fade-up bg-white p-4 rounded-2xl border border-border pb-20">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-extrabold text-sm">{editing.id ? 'ویرایش مقاله' : 'مقاله جدید'}</h3>
          <button onClick={() => setEditing(null)} className="p-1 bg-cream rounded-lg"><X size={16} /></button>
        </div>
        
        <input placeholder="عنوان اصلی (H1)" value={editing.title || ''} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full bg-cream border border-border rounded-xl p-3 text-xs outline-none" />
        <textarea placeholder="محتوای اصلی مقاله" rows={8} value={editing.content || ''} onChange={e => setEditing({...editing, content: e.target.value})} className="w-full bg-cream border border-border rounded-xl p-3 text-xs outline-none" />
        
        {/* آپلود عکس */}
        <div className="bg-cream/50 border border-border rounded-xl p-3">
          <label className="text-[10px] font-bold text-muted block mb-2">تصویر شاخص مقاله</label>
          <div className="flex items-center gap-3">
            {editing.image ? (
              <img src={editing.image} alt="عکس" className="w-16 h-16 rounded-xl object-cover border border-border" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-border flex items-center justify-center"><ImageIcon className="text-muted" /></div>
            )}
            <label className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition ${uploading ? 'bg-gray-300' : 'bg-brand text-white active:scale-95'}`}>
              {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
              {uploading ? 'در حال آپلود...' : 'انتخاب عکس از گوشی'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        {/* بخش سئو */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-2 mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-extrabold text-blue-800">تنظیمات سئو (برای گوگل)</span>
            <button onClick={autoGenerateSEO} className="flex items-center gap-1 text-[10px] bg-blue-600 text-white px-2 py-1 rounded-md active:scale-95">
              <Wand2 size={12} /> تولید خودکار
            </button>
          </div>
          <input placeholder="اسلاگ (آدرس صفحه)" dir="ltr" value={editing.slug || ''} onChange={e => setEditing({...editing, slug: e.target.value.replace(/\s+/g, '-').toLowerCase()})} className="w-full bg-white border border-blue-200 rounded-lg p-2.5 text-xs outline-none text-left" />
          <input placeholder="عنوان سئو (Meta Title)" value={editing.meta_title || ''} onChange={e => setEditing({...editing, meta_title: e.target.value})} className="w-full bg-white border border-blue-200 rounded-lg p-2.5 text-xs outline-none" />
          <textarea placeholder="توضیحات متا (Meta Description)" rows={2} value={editing.meta_description || ''} onChange={e => setEditing({...editing, meta_description: e.target.value})} className="w-full bg-white border border-blue-200 rounded-lg p-2.5 text-xs outline-none" />
          <input placeholder="کلمه کلیدی اصلی" value={editing.focus_keyword || ''} onChange={e => setEditing({...editing, focus_keyword: e.target.value})} className="w-full bg-white border border-blue-200 rounded-lg p-2.5 text-xs outline-none" />
        </div>

        {/* سایر تنظیمات */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <input placeholder="نام نویسنده" value={editing.author_name || ''} onChange={e => setEditing({...editing, author_name: e.target.value})} className="w-full bg-cream border border-border rounded-xl p-3 text-xs outline-none" />
          <input placeholder="بازبین (اختیاری)" value={editing.reviewed_by || ''} onChange={e => setEditing({...editing, reviewed_by: e.target.value})} className="w-full bg-cream border border-border rounded-xl p-3 text-xs outline-none" />
        </div>

        {/* بخش سوالات متداول */}
        <div className="bg-cream/50 border border-border rounded-xl p-3 space-y-2">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold text-muted">سوالات متداول</label>
            <button onClick={addFaq} className="flex items-center gap-1 text-[10px] bg-brand text-white px-2 py-1 rounded-md active:scale-95">
              <Plus size={12} /> افزودن سوال
            </button>
          </div>
          {(editing.faq || []).map((item, idx) => (
            <div key={idx} className="bg-white border border-border rounded-lg p-2 flex flex-col gap-2 relative">
              <button onClick={() => removeFaq(idx)} className="absolute top-2 left-2 text-danger bg-danger/10 p-1 rounded-md active:scale-90">
                <X size={14} />
              </button>
              <input placeholder="سوال" value={item.q || ''} onChange={(e) => updateFaq(idx, 'q', e.target.value)} className="w-full bg-cream border border-border rounded p-2 text-xs outline-none pr-8" />
              <textarea placeholder="جواب" rows={2} value={item.a || ''} onChange={(e) => updateFaq(idx, 'a', e.target.value)} className="w-full bg-cream border border-border rounded p-2 text-xs outline-none" />
            </div>
          ))}
          {(editing.faq || []).length === 0 && (
            <p className="text-[10px] text-muted text-center py-2">هنوز سوالی اضافه نکرده‌اید.</p>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs py-2">
          <label><input type="checkbox" checked={editing.published ?? true} onChange={e => setEditing({...editing, published: e.target.checked})} /> انتشار عمومی</label>
          <label className="mr-4"><input type="checkbox" checked={editing.no_index ?? false} onChange={e => setEditing({...editing, no_index: e.target.checked})} /> مخفی از گوگل (No-Index)</label>
        </div>

        <button onClick={handleSave} className="w-full bg-brand text-white font-bold py-3 rounded-xl flex justify-center gap-2 active:scale-95"><Save size={16} /> ذخیره مقاله</button>
      </div>
    )
  }

  return (
    <div className="space-y-3 fade-up">
      <button onClick={() => setEditing({ published: true, article_type: 'Article', faq: [] })} className="w-full bg-brand text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-md">
        <Plus size={18} /> مقاله جدید
      </button>
      
      {articles.map(a => (
        <div key={a.id} className="bg-white rounded-2xl p-3 flex items-center gap-3 border border-border">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold truncate">{a.title}</div>
            <div className="text-[10px] text-muted mt-0.5" dir="ltr">{a.slug} • {a.published ? 'منتشر شده' : 'پیش‌نویس'}</div>
          </div>
          <button onClick={() => setEditing(a)} className="p-2 bg-cream rounded-xl active:scale-95"><Edit2 size={14} /></button>
          <button onClick={() => handleDelete(a.id)} className="p-2 bg-danger/10 text-danger rounded-xl active:scale-95"><Trash2 size={14} /></button>
        </div>
      ))}
    </div>
  )
}
