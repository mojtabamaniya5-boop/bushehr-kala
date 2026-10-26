import re

with open('src/pages/AdminBlog.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

start_marker = '{/* بخش سئو */}'
end_marker = '{/* سایر تنظیمات */}'

new_block = '''{/* بخش سئو */}
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
            <input placeholder="test-tarikhi" dir="ltr" value={editing.slug || ''} onChange={e => setEditing({...editing, slug: e.target.value.replace(/\\s+/g, '-').toLowerCase()})} className="w-full bg-white border border-blue-200 rounded-lg p-2.5 text-xs outline-none text-left" />
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

        '''

pattern = re.compile(re.escape(start_marker) + r'.*?(?=' + re.escape(end_marker) + ')', re.DOTALL)
c = pattern.sub(lambda _: new_block, c)

with open('src/pages/AdminBlog.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("✅ کدها با موفقیت آپدیت شدند!")
