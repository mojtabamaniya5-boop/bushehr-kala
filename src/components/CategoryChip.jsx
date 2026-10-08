import { Link } from 'react-router-dom'
import CategoryIcon from './CategoryIcon'

export default function CategoryChip({ category, active = false }) {
  return (
    <Link to={`/category/${category.id}`} className="flex-shrink-0 w-[76px] flex flex-col items-center gap-2">
      <CategoryIcon category={category} size={64} active={active} />
      <span className={`text-[10px] text-center font-bold leading-tight ${active ? 'text-brand' : 'text-ink'}`}>
        {category.name}
      </span>
    </Link>
  )
}
