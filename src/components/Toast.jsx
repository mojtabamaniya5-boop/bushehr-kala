import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

let toastId = 0
const listeners = new Set()

export const toast = {
  success: (msg) => emit({ type: 'success', msg }),
  error: (msg) => emit({ type: 'error', msg }),
  info: (msg) => emit({ type: 'info', msg }),
}

function emit(t) {
  const id = ++toastId
  listeners.forEach(fn => fn({ ...t, id }))
}

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}
const COLORS = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-slate-700',
}

export default function ToastHost() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const handler = (t) => {
      setItems(prev => [...prev, t])
      setTimeout(() => {
        setItems(prev => prev.filter(i => i.id !== t.id))
      }, 2500)
    }
    listeners.add(handler)
    return () => listeners.delete(handler)
  }, [])

  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id))

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-[92%] max-w-sm">
      {items.map(t => {
        const Icon = ICONS[t.type]
        return (
          <div
            key={t.id}
            className={`${COLORS[t.type]} text-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg pointer-events-auto animate-[fadeUp_0.3s_ease-out]`}
            onClick={() => remove(t.id)}
          >
            <Icon size={18} className="flex-shrink-0" />
            <span className="text-xs font-medium flex-1">{t.msg}</span>
            <button onClick={() => remove(t.id)} className="opacity-70">
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
