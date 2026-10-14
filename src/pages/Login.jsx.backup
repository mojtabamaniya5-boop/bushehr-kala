import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import { isValidPhone, generateOTP, loginUser } from '../utils/auth'
import { toast } from '../components/Toast'
import { Phone, ArrowRight, Check, RefreshCw, ShieldCheck } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [step, setStep] = useState('phone') // phone | otp
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [expectedOtp, setExpectedOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const sendOTP = () => {
    const clean = phone.replace(/\D/g, '')
    if (!isValidPhone(clean)) {
      toast.error('شماره موبایل معتبر وارد کن (۰۹...)')
      return
    }
    setPhone(clean)
    const code = generateOTP()
    setExpectedOtp(code)
    setStep('otp')
    // نمایش کد روی صفحه (چون SMS نداریم)
    toast.success('کد تأیید ساخته شد')
  }

  const verifyOTP = () => {
    if (otpInput !== expectedOtp) {
      toast.error('کد وارد شده اشتباه است')
      return
    }
    setLoading(true)
    setTimeout(() => {
      loginUser(phone, name)
      toast.success('خوش آمدی! 🎉')
      navigate('/profile', { replace: true })
    }, 400)
  }

  const resendOTP = () => {
    const code = generateOTP()
    setExpectedOtp(code)
    setOtpInput('')
    toast.success('کد جدید ساخته شد')
  }

  return (
    <>
      <Header title="ورود / ثبت‌نام" back />
      <main className="max-w-lg mx-auto px-4 pb-32 pt-5 fade-up">

        {/* آیکون */}
        <div className="text-center mb-7">
          <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-4 border-2 border-brand/20">
            <Phone size={36} className="text-brand" />
          </div>
          <h1 className="font-extrabold text-lg text-ink mb-1">
            {step === 'phone' ? 'ورود به کافه ترشی' : 'کد تأیید را وارد کن'}
          </h1>
          <p className="text-xs text-muted">
            {step === 'phone' ? 'شماره موبایلت را وارد کن' : `کد ۴ رقمی به ${phone} فرستاده شد`}
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
                className="w-full bg-white border border-border rounded-2xl px-4 py-3.5 text-base font-bold tracking-wider outline-none focus:border-brand transition"
                style={{ direction: 'ltr', textAlign: 'center' }}
              />
            </div>

            <button onClick={sendOTP}
              className="w-full bg-brand text-white font-extrabold py-4 rounded-2xl active:scale-[0.98] transition shadow-md flex items-center justify-center gap-2">
              دریافت کد تأیید
              <ArrowRight size={18} />
            </button>

            <p className="text-center text-[10px] text-muted leading-5 pt-3">
              با ورود، <b className="text-brand">قوانین و مقررات</b> کافه ترشی را می‌پذیرید
            </p>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">

            {/* نمایش کد (به جای SMS) */}
            <div className="bg-accent/15 border-2 border-dashed border-accent/40 rounded-2xl p-5 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <ShieldCheck size={14} className="text-ink" />
                <span className="text-[10px] font-bold text-ink">کد تأیید شما</span>
              </div>
              <div className="text-4xl font-extrabold text-brand tracking-[0.5em] pl-2">
                {expectedOtp}
              </div>
              <p className="text-[9px] text-muted mt-2">
                (بعداً این کد به شماره‌ات پیامک میشه)
              </p>
            </div>

            {/* ورودی کد */}
            <div>
              <label className="text-[10px] font-bold text-muted block mb-1.5 text-center">کد ۴ رقمی را وارد کن</label>
              <input
                value={otpInput}
                onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onKeyDown={e => e.key === 'Enter' && verifyOTP()}
                placeholder="----"
                inputMode="numeric"
                autoFocus
                className="w-full bg-white border-2 border-border rounded-2xl px-4 py-4 text-3xl font-extrabold tracking-[0.5em] text-center outline-none focus:border-brand transition"
                style={{ direction: 'ltr' }}
              />
            </div>

            <button onClick={verifyOTP} disabled={otpInput.length !== 4 || loading}
              className="w-full bg-brand text-white font-extrabold py-4 rounded-2xl active:scale-[0.98] transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2">
              {loading ? 'در حال ورود...' : <><Check size={18} /> تأیید و ورود</>}
            </button>

            <div className="flex items-center justify-center gap-3 text-xs">
              <button onClick={resendOTP}
                className="text-brand font-bold flex items-center gap-1.5">
                <RefreshCw size={14} />
                ارسال مجدد کد
              </button>
              <span className="text-muted">|</span>
              <button onClick={() => { setStep('phone'); setOtpInput(''); }}
                className="text-muted font-bold">
                تغییر شماره
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-[10px] text-muted mt-8">
          🫙 کافه ترشی — تجربه خرید راحت‌تر
        </p>
      </main>
    </>
  )
}
