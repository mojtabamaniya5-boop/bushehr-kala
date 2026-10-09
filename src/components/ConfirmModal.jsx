import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmModal({ open, title, message, confirmText = 'تأیید', cancelText = 'انصراف', danger = false, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-5">
          {/* پس‌زمینه */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* کارت */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* هدر رنگی */}
            <div className="relative h-24 flex items-center justify-center"
              style={{ background: danger
                ? 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)'
                : 'linear-gradient(135deg, #2E7D32 0%, #185C28 100%)' }}>
              <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-white/10"></div>
              <div className="absolute -bottom-8 right-4 w-20 h-20 rounded-full bg-white/10"></div>
              <div className="relative w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/40">
                <AlertTriangle size={28} className="text-white" />
              </div>
              <button onClick={onCancel}
                className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center active:scale-90">
                <X size={14} />
              </button>
            </div>

            {/* محتوا */}
            <div className="p-5 text-center">
              {title && <h3 className="font-extrabold text-base text-ink mb-2">{title}</h3>}
              {message && <p className="text-xs text-muted leading-6">{message}</p>}
            </div>

            {/* دکمه‌ها */}
            <div className="p-4 pt-0 flex gap-2">
              <button onClick={onCancel}
                className="flex-1 bg-cream border border-border text-ink font-bold py-3 rounded-2xl active:scale-[0.98] transition text-xs">
                {cancelText}
              </button>
              <button onClick={onConfirm}
                className={`flex-1 text-white font-extrabold py-3 rounded-2xl active:scale-[0.98] transition text-xs ${
                  danger ? 'bg-danger' : 'bg-brand'
                }`}
                style={{ boxShadow: danger ? '0 4px 14px rgba(220,38,38,0.3)' : '0 4px 14px rgba(46,125,50,0.3)' }}>
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
