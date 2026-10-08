import JarIllustration from './JarIllustration'

export default function CategoryIcon({ category, size = 64, active = false }) {
  return (
    <div className="rounded-full flex items-center justify-center transition active:scale-95"
      style={{
        width: size, height: size,
        background: '#E8F5E9',
        border: active ? '2px solid #2E7D32' : '1px solid #E9E5D8',
        boxShadow: active ? '0 4px 12px rgba(46,125,50,0.25)' : '0 2px 6px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}>
      <div style={{ transform: 'scale(0.9)' }}>
        <JarIllustration category={category.id} size={size * 0.85} />
      </div>
    </div>
  )
}
