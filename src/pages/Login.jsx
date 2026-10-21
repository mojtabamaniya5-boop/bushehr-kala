import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { isValidPhone, loginUser } from '../utils/auth'
import { toast } from '../components/Toast'
import { Phone, ArrowRight, Check, RefreshCw, ShieldCheck } from 'lucide-react'

const RELAY_URL = 'https://relay.cafetorshi.ir'

const invokeRelay = async (path, body, timeoutMs = 20000) => {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(`${RELAY_URL}${path}`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || `خطا (${res.status})`)
    return data
  } finally {
    clearTimeout(t)
  }
}

export default function Login() {
  const navigate = useNavigate()
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [loading, setLoading] = useState(false)
  const sending = useRef(false)

  const sendOTP = async () => {
    if (sending.current) return
    const clean = phone.replace(/\D/g, '')
    if (!isValidPhone(clean)) {
      toast.error('شماره موبایل معتبر وارد کنید')
      return
    }
    sending.current = true
    setPhone(clean)
    setLoading(true)
    try {
      const data = await invokeRelay('/api/send-otp', { mobile: clean })
      if (!data?.ok) throw new Error(data?.error || 'خطا در ارسال')
      setStep('otp')
      setOtpInput('')
      toast.success('کد تأیید پیامک شد')
    } catch (err) {
      const msg = err.name === 'AbortError' ? 'سرور پاسخ نداد' : err.message
      alert('خطای دقیق: ' + err.name + ' | ' + err.message + ' | وضعیت: ' + (err.status || 'نامشخص'))
      toast.error(msg)
    } finally {
      sending.current = false
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (otpInput.length !== 6) {
      toast.error('کد ۶ رقمی را وارد کنید')
      return
    }
    setLoading(true)
    try {
      const data = await invokeRelay('/api/verify-otp', { mobile: phone, code: otpInput })
      if (!data?.ok) throw new Error(data?.error || 'کد اشتباه است')
      loginUser(phone, name, data.token)
      toast.success('خوش آمدید 🌿')
      navigate('/profile', { replace: true })
    } catch (err) {
      const msg = err.name === 'AbortError'
        ? 'سرور پاسخ نداد'
        : err.name === 'TypeError'
        ? 'اتصال برقرار نشد'
        : (err.message || 'کد اشتباه است')
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = async () => {
    setOtpInput('')
    await sendOTP()
  }

  return (
    <>
      <Header title="ورود / ثبت‌نام" back />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-5 fade-up">
        <div className="text-center mb-7">
          <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-4 border-2 border-brand/20">
            <Phone size={36} className="text-brand" />
          </div>
          <h1 className="font-extrabold text-lg text-ink mb-1">
            {step === 'phone' ? 'ورود به کافه ترشی' : 'کد تأیید را وارد کن'}
          </h1>
          <p className="text-xs text-muted">
            {step === 'phone' ? 'شماره موبایلت را وارد کن' : 'کد ۶ رقمی ارسال شده به ' + phone}
          </p>
        </div>

        {step === 'phone' && (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-muted block mb-1.5 mr-1">نام شما (اختیاری)</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="مثلاً: مجتبی"
                className="w-full bg-white border border-border rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-brand transition"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted block mb-1.5 mr-1">شماره موبایل</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendOTP()}
                placeholder="09123456789"
                inputMode="tel"
                autoFocus
                className="w-full bg-white border border-border rounded-2xl px-4 py-3.5 text-base font-bold tracking-wider outline-none focus:border-brand transition text-center"
                style={{ direction: 'ltr' }}
              />
            </div>
            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full bg-brand text-white font-extrabold py-4 rounded-2xl active:scale-[0.98] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'در حال ارسال...' : (<><span>دریافت کد تأیید</span><ArrowRight size={18} /></>)}
            </button>
            <p className="text-center text-[10px] text-muted leading-5 pt-3">
              با ورود، <b className="text-brand">قوانین و مقررات</b> کافه ترشی را می‌پذیرید
            </p>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <div className="bg-accent/15 border-2 border-dashed border-accent/40 rounded-2xl p-5 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <ShieldCheck size={14} className="text-ink" />
                <span className="text-[10px] font-bold text-ink">کد پیامک شد</span>
              </div>
              <p className="text-[9px] text-muted mt-2">پیامک حاوی کد ۶ رقمی برای شما ارسال شد</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted block mb-1.5 text-center">کد ۶ رقمی پیامک شده</label>
              <input
                value={otpInput}
                onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={e => e.key === 'Enter' && verifyOTP()}
                placeholder="------"
                inputMode="numeric"
                autoFocus
                className="w-full bg-white border-2 border-border rounded-2xl px-4 py-4 text-3xl font-extrabold tracking-[0.5em] text-center outline-none focus:border-brand transition"
                style={{ direction: 'ltr' }}
              />
            </div>
            <button
              onClick={verifyOTP}
              disabled={otpInput.length !== 6 || loading}
              className="w-full bg-brand text-white font-extrabold py-4 rounded-2xl active:scale-[0.98] transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
            >
              {loading ? 'در حال بررسی...' : (<><Check size={18} /><span>تأیید و ورود</span></>)}
            </button>
            <div className="flex items-center justify-center gap-3 text-xs">
              <button onClick={resendOTP} disabled={loading} className="text-brand font-bold flex items-center gap-1.5 disabled:opacity-50">
                <RefreshCw size={14} /> ارسال مجدد کد
              </button>
              <span className="text-muted">|</span>
              <button onClick={() => { setStep('phone'); setOtpInput('') }} className="text-muted font-bold">تغییر شماره</button>
            </div>
          </div>
        )}

        <p className="text-center text-[10px] text-muted mt-8">🌿 کافه ترشی — تجربه خرید راحت‌تر</p>
      </main>
    </>
  )
}
