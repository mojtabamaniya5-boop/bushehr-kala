import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('bk-theme') === 'dark')

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('bk-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 active:scale-95 transition"
      aria-label="تغییر تم"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
