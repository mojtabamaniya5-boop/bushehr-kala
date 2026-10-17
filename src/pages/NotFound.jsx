import { Link } from 'react-router-dom'
import { Home, SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
      <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center mb-6">
        <SearchX size={48} className="text-brand" />
      </div>
      <h1 className="text-2xl font-extrabold text-ink mb-2">صفحه پیدا نشد!</h1>
      <p className="text-sm text-muted mb-8 leading-6">
        آدرسی که دنبالش بودی وجود نداره یا حذف شده.<br/>بیا برگردیم به خونه.
      </p>
      <Link to="/" className="bg-brand text-white font-extrabold px-8 py-3.5 rounded-2xl flex items-center gap-2 active:scale-95 transition">
        <Home size={18} /> بازگشت به خانه
      </Link>
    </div>
  )
}
