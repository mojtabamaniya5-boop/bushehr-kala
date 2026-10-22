import { useState } from 'react'
import { Save, Loader2, Upload } from 'lucide-react'
import { supabase } from '../utils/supabase'
import { applyTheme } from '../utils/theme'

export default function AdminSettings({ settings, setSettings, onSave, saving }) {
  const [uploading, setUploading] = useState(false)
  const [bannerUploading, setBannerUploading] = useState(false)

  if (!settings) {
    return <div className="text-center text-muted py-10 text-sm">در حال بارگذاری تنظیمات...</div>
  }

  const upd = (key, val) => {
    setSettings({ ...settings, [key]: val })
    if (key === 'themeColor') applyTheme(val)
  }

  const updCard = (key, val) => setSettings({ ...settings, card: { ...(settings.card || {}), [key]: val } })
  const updArr = (key, val) => setSettings({ ...settings, [key]: val.split(',').map(s => s.trim()).filter(Boolean) })

  const handleImageUpload = async (file, type) => {
    const isBanner = type === 'banner'
    const setLoading = isBanner ? setBannerUploading : setUploading

    try {
      setLoading(true)
      const bitmap = await createImageBitmap(file)
      const canvas = document.createElement('canvas')
      
      if (isBanner) {
        canvas.width = 1200
        canvas.height = 400
      } else {
        canvas.width = 512
        canvas.height = 512
      }
      
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      
      const scale = Math.max(canvas.width / bitmap.width, canvas.height / bitmap.height)
      const x = (canvas.width / scale - bitmap.width) / 2
      const y = (canvas.height / scale - bitmap.height) / 2
      ctx.drawImage(bitmap, x, y, bitmap.width, bitmap.height, 0, 0, canvas.width, canvas.height)
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85))
      const fileName = `${type}-${Date.now()}.jpg`
      
      const { error: uploadError } = await supabase.storage
        .from('shop-assets')
        .upload(fileName, blob, { contentType: 'image/jpeg', upsert: true })
      
      if (uploadError) throw uploadError
      
      const { data: { publicUrl } } = supabase.storage.from('shop-assets').getPublicUrl(fileName)
      upd(isBanner ? 'bannerUrl' : 'logoUrl', publicUrl)
      
      alert(`${isBanner ? 'بنر' : 'لوگو'} با موفقیت آپلود شد. برای اعمال، دکمه ذخیره تنظیمات را بزنید.`)
    } catch (err) {
      alert('خطا در آپلود: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3 pb-6">
      {/* لوگوی سایت */}
      <div className="bg-white rounded-2xl p-4 border border-border mt-4">
        <div className="text-xs font-extrabold mb-3">لوگوی سایت</div>
        <div className="flex items-center gap-4">
          {settings.logoUrl && (
            <img src={settings.logoUrl} alt="لوگو" className="w-16 h-16 rounded-xl object-contain border border-border bg-cream" />
          )}
          <div className="flex-1">
            <label className="flex items-center justify-center gap-2 w-full bg-cream border border-border rounded-xl px-3 py-3 text-xs font-bold text-brand cursor-pointer active:scale-[0.98] transition">
              {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
              {uploading ? 'در حال آپلود...' : 'آپلود لوگو (مربع)'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'logo')} disabled={uploading} />
            </label>
          </div>
        </div>
      </div>

      {/* اطلاعات فروشگاه */}
      <div className="bg-white rounded-2xl p-4 border border-border">
        <div className="text-xs font-extrabold mb-3">اطلاعات فروشگاه</div>
        <Field label="نام فروشگاه" value={settings.name || ''} onChange={v => upd('name', v)} />
        <Field label="شعار" value={settings.tagline || ''} onChange={v => upd('tagline', v)} />
        <Field label="تلفن" value={settings.phone || ''} onChange={v => upd('phone', v)} />
        <Field label="تلگرام" value={settings.telegram || ''} onChange={v => upd('telegram', v)} />
        <Field label="آدرس" value={settings.address || ''} onChange={v => upd('address', v)} />
      </div>

      {/* کارت بانکی */}
      <div className="bg-white rounded-2xl p-4 border border-border">
        <div className="text-xs font-extrabold mb-3">کارت بانکی</div>
        <Field label="شماره کارت" value={settings.card?.number || ''} onChange={v => updCard('number', v)} />
        <Field label="صاحب کارت" value={settings.card?.holder || ''} onChange={v => updCard('holder', v)} />
        <Field label="بانک" value={settings.card?.bank || ''} onChange={v => updCard('bank', v)} />
      </div>

      {/* ارسال رایگان برای همه */}
      <div className="bg-white rounded-2xl p-4 border border-border mt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-extrabold">ارسال رایگان برای همه</div>
            <div className="text-[10px] text-muted mt-1">اگر روشن باشد، ارسال برای همه سفارش‌ها رایگان است.</div>
          </div>
          <input
            type="checkbox"
            checked={settings.forceFreeShipping || false}
            onChange={e => upd('forceFreeShipping', e.target.checked)}
            className="w-5 h-5 accent-brand"
          />
        </div>
      </div>

      {/* بنر تبلیغاتی */}
      <div className="bg-white rounded-2xl p-4 border border-border mt-4">
        <div className="text-xs font-extrabold mb-3">بنر تبلیغاتی (مناسبت‌ها)</div>
        <div className="flex flex-col gap-3">
          {settings.bannerUrl && (
            <img src={settings.bannerUrl} alt="بنر" className="w-full h-32 rounded-xl object-cover border border-border bg-cream" />
          )}
          <label className="flex items-center justify-center gap-2 w-full bg-cream border border-border rounded-xl px-3 py-3 text-xs font-bold text-brand cursor-pointer active:scale-[0.98] transition">
            {bannerUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
            {bannerUploading ? 'در حال آپلود...' : 'آپلود بنر جدید (سایز ۱۲۰۰×۴۰۰)'}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], 'banner')} disabled={bannerUploading} />
          </label>
        </div>
      </div>

      {/* هزینه ارسال */}
      <div className="bg-white rounded-2xl p-4 border border-border">
        <div className="text-xs font-extrabold mb-3">هزینه ارسال</div>
        <Field label="هزینه پست پیشتاز (تومان)" value={settings.shippingFast ?? 0} onChange={v => upd('shippingFast', v)} type="number" />
        <Field label="آستانه ارسال رایگان (۰=غیرفعال)" value={settings.freeShippingFrom ?? 0} onChange={v => upd('freeShippingFrom', v)} type="number" />
        <Field label="پیش‌شماره کدپستی رایگان (با کاما)" value={(settings.freePostalPrefixes || []).join(', ')} onChange={v => updArr('freePostalPrefixes', v)} />
        <Field label="شهرهای رایگان (با کاما)" value={(settings.freeShippingCities || []).join(', ')} onChange={v => updArr('freeShippingCities', v)} />
        <Field label="شهرهای تحویل همان روز" value={(settings.sameDayCities || []).join(', ')} onChange={v => updArr('sameDayCities', v)} />
      </div>

      {/* دکمه ذخیره */}
      <button
        onClick={onSave}
        disabled={saving}
        className="w-full bg-brand text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-50"
      >
        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
      </button>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div className="mb-3">
      <div className="text-[10px] font-bold text-muted mb-1">{label}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-cream border border-border rounded-xl px-3 py-2 text-xs focus:border-brand outline-none"
      />
    </div>
  )
}
