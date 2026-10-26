import { useEffect, useState, useRef } from 'react'
import { supabase } from '../utils/supabase'
import { toast } from '../components/Toast'
import { Edit2, Trash2, Plus, Loader2, Save, X, Wand2, Upload, Image as ImageIcon } from 'lucide-react'


const compressImage = (file, maxWidth = 1200, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }, 'image/jpeg', quality);
      };
    };
  });
};

export default function AdminBlog() {
  const [articles, setArticles] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingContent, setUploadingContent] = useState(false)
  const textareaRef = useRef(null)

  const fetchArticles = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
    if (error) toast.error('خطا در خواندن مقالات')
    else setArticles(data || [])
    setLoading(false)
  }

  useEffect(() => { 
    fetchArticles() 
    supabase.from('products').select('id, title, image').eq('active', true).then(({data}) => {
      if(data) setProducts(data)
    })
  }, [])

  const handleSave = async () => {
    if (!editing.title || !editing.slug || !editing.content) return toast.error('عنوان، اسلاگ و متن الزامی است')
    const isNew = !editing.id
    
    // پاکسازی آرایه سوالات
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
    else if (data.length === 0) toast.error('شما دسترسی حذف ندارید');
    else {
      toast.success('حذف شد');
      fetchArticles();
    }
  }

  // آپلود عکس شاخص (کاور)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    toast.info('در حال فشرده‌سازی و آپلود...')
    const compressedFile = await compressImage(file)
    const fileName = `blog-${Date.now()}.jpg`
    const { error } = await supabase.storage.from('product-images').upload(fileName, compressedFile)
    if (error) toast.error('خطا در آپلود: ' + error.message)
    else {
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      setEditing({ ...editing, image: data.publicUrl })
      toast.success('عکس شاخص آپلود شد')
    }
    setUploading(false)
  }

  // آپلود عکس داخل متن مقاله
  const handleContentImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingContent(true)
    toast.info('در حال فشرده‌سازی و آپلود...')
    const compressedFile = await compressImage(file)
    const fileName = `blog-content-${Date.now()}.jpg`
    
    const { error } = await supabase.storage.from('product-images').upload(fileName, compressedFile)
    if (error) {
      toast.error('خطا در آپلود عکس: ' + error.message)
    } else {
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      // تولید ALT خودکار از عنوان یا کلمه کلیدی
      const safeAlt = (editing.focus_keyword || editing.title || 'مقاله کافه ترشی').replace(/"/g, '')
      const imgTag = `\n<img src="${data.publicUrl}" alt="${safeAlt}" class="w-full rounded-2xl my-4 shadow-sm object-cover" />\n`
      const textarea = textareaRef.current
      
      if (textarea) {
        const startPos = textarea.selectionStart
        const endPos = textarea.selectionEnd
        const currentContent = editing.content || ''
        const newContent = currentContent.substring(0, startPos) + imgTag + currentContent.substring(endPos)
        setEditing({ ...editing, content: newContent })
        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(startPos + imgTag.length, startPos + imgTag.length)
        }, 100)
      }
      toast.success('عکس به متن اضافه شد')
    }
    setUploadingContent(false)
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


  const handleInsertProduct = (e) => {
    const productId = e.target.value;
    if (!productId) return;
    const product = products.find(p => p.id.toString() === productId.toString());
    if (!product) return;

    const utm = editing.slug ? `&utm_campaign=${editing.slug}` : '';
        // اسکیپ کردن دابل کوتیشن در عنوان برای جلوگیری از شکستن تگ
    const safeTitle = (product.title || '').replace(/"/g, '&quot;');
    const html = `<div style="display: flex !important; flex-direction: row !important; align-items: center !important; gap: 12px !important; background: #ffffff !important; border: 1px solid #e5e7eb !important; border-radius: 16px !important; padding: 12px !important; margin: 24px 0 !important; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05) !important; white-space: normal !important; direction: rtl !important;" dir="rtl"><img src="${product.image || 'https://cafetorshi.ir/icon.png'}" alt="${safeTitle}" style="width: 80px !important; height: 80px !important; min-width: 80px !important; object-fit: cover !important; border-radius: 12px !important; margin: 0 !important; padding: 0 !important; display: inline-block !important;" /><div style="flex: 1 !important; text-align: right !important; display: flex !important; flex-direction: column !important; align-items: flex-start !important; white-space: normal !important;"><h3 style="margin: 0 0 4px 0 !important; font-size: 14px !important; font-weight: bold !important; color: #1f2937 !important; line-height: 1.4 !important;">${product.title}</h3><p style="margin: 0 0 8px 0 !important; font-size: 11px !important; color: #6b7280 !important; line-height: 1.6 !important; white-space: normal !important;">طعم اصیل و خانگی. همین حالا سفارش دهید!</p><a href="https://cafetorshi.ir/product/${product.id}?utm_source=blog&utm_medium=article${utm}" target="_blank" style="display: inline-block !important; background-color: #2E7D32 !important; color: #ffffff !important; font-size: 12px !important; font-weight: bold !important; padding: 6px 16px !important; border-radius: 8px !important; text-decoration: none !important; margin: 0 !important;">🛒 خرید محصول</a></div></div>`;

    const textarea = textareaRef.current;
    if (textarea) {
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;
      const currentContent = editing.content || '';
      const newContent = currentContent.substring(0, startPos) + '\n' + html + '\n' + currentContent.substring(endPos);
      setEditing({ ...editing, content: newContent });
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(startPos + html.length + 2, startPos + html.length + 2);
      }, 100);
    }
    e.target.value = '';
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
        
        {/* متن مقاله و آپلود عکس داخل متن */}
        <textarea 
          ref={textareaRef}
          placeholder="محتوای اصلی مقاله (برای درج عکس، نشانگر را در متن قرار دهید و روی دکمه زیر بزنید)" 
          rows={10} 
          value={editing.content || ''} 
          onChange={e => setEditing({...editing, content: e.target.value})} 
          className="w-full bg-cream border border-border rounded-xl p-3 text-xs outline-none leading-6" 
        />
        <label className={`flex justify-center items-center gap-2 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition mt-1 mb-3 ${uploadingContent ? 'bg-gray-300' : 'bg-brand-light/50 text-brand border border-brand/20 active:scale-95'}`}>
          {uploadingContent ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          {uploadingContent ? 'در حال آپلود عکس...' : 'افزودن عکس به این قسمت از متن'}
          <input type="file" accept="image/*" className="hidden" onChange={handleContentImageUpload} disabled={uploadingContent} />
        </label>

        <select onChange={handleInsertProduct} className="w-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold rounded-xl p-3 mb-3 outline-none cursor-pointer active:scale-[0.99] transition">
          <option value="">🛒 درج باکس محصول در این قسمت از متن...</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>

        
        {/* آپلود عکس شاخص */}
        <div className="bg-cream/50 border border-border rounded-xl p-3">
          <label className="text-[10px] font-bold text-muted block mb-2">تصویر شاخص مقاله (کاور بالای صفحه)</label>
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
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-3 mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-extrabold text-blue-800">تنظیمات سئو (برای گوگل)</span>
            <button onClick={autoGenerateSEO} className="flex items-center gap-1 text-[10px] bg-blue-600 text-white px-2 py-1 rounded-md active:scale-95">
              <Wand2 size={12} /> تولید خودکار
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-blue-900">اسلاگ (آدرس اینترنتی):</label>
            <span className="text-[10px] text-gray-500">فقط حروف انگلیسی و خط تیره (مثلاً: test-tarikhi)</span>
            <input placeholder="test-tarikhi" dir="ltr" value={editing.slug || ''} onChange={e => setEditing({...editing, slug: e.target.value.replace(/\s+/g, '-').toLowerCase()})} className="w-full bg-white border border-blue-200 rounded-lg p-2.5 text-xs outline-none text-left" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-blue-900">عنوان سئو (Meta Title):</label>
            <span className="text-[10px] text-gray-500">عنوانی که در گوگل نمایش داده می‌شود (حداکثر ۶۰ کاراکتر)</span>
            <input placeholder="عنوان جذاب برای گوگل" value={editing.meta_title || ''} onChange={e => setEditing({...editing, meta_title: e.target.value})} className="w-full bg-white border border-blue-200 rounded-lg p-2.5 text-xs outline-none" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-blue-900">توضیحات سئو (Meta Description):</label>
            <span className="text-[10px] text-gray-500">توضیح کوتاه زیر لینک در گوگل (حداکثر ۱۶۰ کاراکتر)</span>
            <textarea placeholder="توضیح کوتاه و دعوت‌کننده..." rows={2} value={editing.meta_description || ''} onChange={e => setEditing({...editing, meta_description: e.target.value})} className="w-full bg-white border border-blue-200 rounded-lg p-2.5 text-xs outline-none" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-blue-900">کلمه کلیدی اصلی (Focus Keyword):</label>
            <span className="text-[10px] text-gray-500">کلمه‌ای که می‌خواهی در گوگل رتبه بگیری (مثلاً: ترشی خانگی)</span>
            <input placeholder="ترشی خانگی" value={editing.focus_keyword || ''} onChange={e => setEditing({...editing, focus_keyword: e.target.value})} className="w-full bg-white border border-blue-200 rounded-lg p-2.5 text-xs outline-none" />
          </div>
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
