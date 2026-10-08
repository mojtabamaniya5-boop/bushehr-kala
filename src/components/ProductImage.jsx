const DATA = {
  cucumber:   { emoji: '🥒', bg: '#C8E6C9' },
  mixed:      { emoji: '🥕', bg: '#FFE0B2' },
  olive:      { emoji: '🫒', bg: '#D7CCC8' },
  garlic:     { emoji: '🧄', bg: '#FFF9C4' },
  vegetables: { emoji: '🥬', bg: '#DCEDC8' },
  salads:     { emoji: '🥗', bg: '#C5E1A5' },
  special:    { emoji: '🌶️', bg: '#FFCCBC' },
  fresh:      { emoji: '🌿', bg: '#B2DFDB' },
}

export default function ProductImage({ product, className = '' }) {
  const d = DATA[product.category] || DATA.cucumber

  // اگه عکس واقعی داشت
  if (product.image && product.image.startsWith('http')) {
    return (
      <img
        src={product.image}
        alt={product.title}
        loading="lazy"
        className={'w-full h-full object-cover ' + className}
        onError={e => { e.target.style.display = 'none'; e.target.parentNode.classList.add('use-fallback') }}
      />
    )
  }

  // پیش‌فرض: شیشه ترشی با ایموجی
  return (
    <div
      className={'w-full h-full flex items-center justify-center relative overflow-hidden ' + className}
      style={{ background: 'linear-gradient(135deg, ' + d.bg + ' 0%, #FFF8E8 100%)' }}
    >
      {/* شیشه */}
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-32 rounded-[18px] bg-white/70 backdrop-blur-sm border-2 border-white shadow-lg flex items-center justify-center">
          <span className="text-[64px] leading-none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
            {d.emoji}
          </span>
        </div>
        {/* درپوش */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[88px] h-3.5 rounded-full" style={{ background: '#F8C02D' }} />
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-[76px] h-1 rounded-full bg-white/40" />
      </div>
      {/* دکور */}
      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/40" />
      <div className="absolute bottom-3 left-3 w-6 h-6 rounded-full bg-white/30" />
    </div>
  )
}
