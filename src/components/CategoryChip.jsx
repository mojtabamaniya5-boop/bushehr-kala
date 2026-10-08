import { Link } from 'react-router-dom'

export default function CategoryChip({ category, active = false }) {
  return (
    <Link to={`/category/${category.id}`}
      className="flex-shrink-0 w-[72px] flex flex-col items-center gap-2">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition active:scale-95
        ${active ? 'bg-brand ring-2 ring-brand ring-offset-2 ring-offset-cream' : 'bg-brand-light'}`}>
        <span>{category.icon}</span>
      </div>
      <span className={`text-[10px] text-center font-bold leading-tight ${active ? 'text-brand' : 'text-ink'}`}>
        {category.name}
      </span>
    </Link>
  )
}
