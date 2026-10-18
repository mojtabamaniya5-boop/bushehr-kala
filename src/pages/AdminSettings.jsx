import { useState } from 'react'
import { Save, Loader2, Upload } from 'lucide-react'
import { supabase } from '../utils/supabase'
import { applyTheme } from '../utils/theme'

export default function AdminSettings({ settings, setSettings, onSave, saving }) {
  if (!settings) {
    return <div className="text-center text-muted py-10 text-sm">در حال بارگذاری تنظیمات...</div>
  }

  const upd = (key, val) => {
    setSettings({ ...settings, [key]: val })
    if (key === 'themeColor') applyTheme(val) // پیش‌نمایش زنده
  }
  
  const updCard = (key, val) => setSettings({ ...settings, card: { ...(settings.card || {}), [key]: val } })
  const updArr = (key, val) => setSettings({ ...settings, [key]: val.split(',').map(s => s.trim()).filter(Boolean) })

  return (
    <div className="space-y-3 pb-6">
      {/* تم سایت */}
      <div className="bg-white rounded-2xl p-4 border border-border">
        <div className="text-xs font-extrabold mb-3">پالت رنگی سایت (تم)</div>
        <select
          value={settings.themeColor || 'forest'}
          onChange={e => upd('themeColor', e.target.value)}
          className="w-full bg-cream border border-border rounded-xl px-3 py-3 text-sm font-bold focus:border-brand outline-none"
        >
          <option value="forest">جنگل نیمه‌شب (Midnight Forest)</option>
          <option value="orange">موج نارنجی (Orange Pulse)</option>
          <option value="ocean">اقیانوس آرام (Calm Ocean)</option>
        </select>
        <div className="text-[10px] text-muted mt-2">
          با انتخاب هر تم، تمام رنگ‌های سایت (دکمه‌ها، پس‌زمینه و متن) با هم هماهنگ می‌شوند.
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

      {/* هزینه ارسال */}
      <div className="bg-white rounded-2xl p-4 border border-border">
        <div className="text-xs font-extrabold mb-3">هزینه ارسال</div>
        <Field label="ارسال سریع (تومان)" value={settings.shippingFast ?? 0} onChange={v => upd('shippingFast', v)} type="number" />
        <Field label="ارسال عادی (تومان)" value={settings.shippingNormal ?? 0} onChange={v => upd('shippingNormal', v)} type="number" />
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
