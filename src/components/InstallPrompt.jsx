import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import { storage } from '../utils/storage'

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (storage.get('install-dismissed')) return

    const handler = (e) => {
      e.preventDefault()
      setDeferred(e)
      setTimeout(() => setShow(true), 8000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!deferred) return
    deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') setShow(false)
    setDeferred(null)
  }

  const dismiss = () => {
    setShow(false)
    storage.set('install-dismissed', true)
  }

  if (!show || !deferred) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-lg mx-auto fade-up">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 shadow-xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white font-bold flex-shrink-0">
          ب
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold mb-0.5">نصب کافه ترشی</p>
          <p className="text-[10px] text-slate-500">دسترسی سریع از صفحه اصلی گوشی</p>
        </div>
        <button
          onClick={install}
          className="bg-brand text-white text-xs font-bold px-3 py-2 rounded-lg active:scale-95 flex items-center gap-1"
        >
          <Download size={14} /> نصب
        </button>
        <button onClick={dismiss} className="text-slate-400 p-1">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
