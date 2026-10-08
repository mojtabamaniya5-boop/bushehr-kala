export const CAT_EMOJI = {
  fresh:      { emoji: '🌿', bg: '#E8F5E9' },
  mixed:      { emoji: '🥕', bg: '#FFF3E0' },
  olive:      { emoji: '🫒', bg: '#EFEBE9' },
  cucumber:   { emoji: '🥒', bg: '#F1F8E9' },
  garlic:     { emoji: '🧄', bg: '#FFFDE7' },
  vegetables: { emoji: '🥬', bg: '#F1F8E9' },
  salads:     { emoji: '🥗', bg: '#F9FBE7' },
  special:    { emoji: '🌶️', bg: '#FBE9E7' },
}

export default function CategoryIcon({ category, size = 64, active = false }) {
  const d = CAT_EMOJI[category.id] || CAT_EMOJI.fresh
  const s = size
  return (
    <div
      className="rounded-full flex items-center justify-center transition active:scale-95"
      style={{
        width: s, height: s,
        background: d.bg,
        border: active ? '2px solid #2E7D32' : '1px solid #E9E5D8',
        boxShadow: active ? '0 4px 12px rgba(46,125,50,0.25)' : '0 2px 6px rgba(0,0,0,0.05)',
      }}
    >
      <span style={{ fontSize: s * 0.5, lineHeight: 1 }}>{d.emoji}</span>
    </div>
  )
}
