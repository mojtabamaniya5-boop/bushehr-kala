import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header({ title, back = false, search = false }) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 px-4 h-14 max-w-lg mx-auto">
        {back ? (
          <button onClick={() => navigate(-1)} className="p-1 -mr-1 active:scale-95">
            <ArrowRight size={22} />
          </button>
        ) : (
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-sm">
            ب
          </div>
        )}
        <h1 className="flex-1 font-bold text-base truncate">{title}</h1>
        {search && (
          <button onClick={() => navigate('/search')} className="p-2 active:scale-95">
            <Search size={20} />
          </button>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
