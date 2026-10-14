import { Link } from 'react-router-dom'

export default function EmptyState({ emoji = '📦', title, desc, actionText, actionTo }) {
  return (
    <div className="text-center py-20 px-6 fade-up">
      <div className="text-6xl mb-4">{emoji}</div>
      <p className="font-bold mb-1">{title}</p>
      {desc && <p className="text-xs text-slate-500 mb-6">{desc}</p>}
      {actionText && actionTo && (
        <Link
          to={actionTo}
          className="inline-block bg-brand text-white text-sm font-bold px-6 py-2.5 rounded-full active:scale-95 transition"
        >
          {actionText}
        </Link>
      )}
    </div>
  )
}
