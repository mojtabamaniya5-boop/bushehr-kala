// تصویرسازی SVG شیشه ترشی — بدون عکس خارجی، همیشه کار میکنه
// برای هر دسته، رنگ و محتوای شیشه متفاوت

export default function JarIllustration({ category = 'cucumber', size = 200, className = '' }) {
  const themes = {
    cucumber: {
      liquid: '#DCEDC8', items: ['#4CAF50', '#66BB6A', '#43A047'],
      capColor: '#8D6E63',
    },
    mixed: {
      liquid: '#FFF3E0', items: ['#F4511E', '#FB8C00', '#7CB342', '#E53935'],
      capColor: '#6B4E37',
    },
    olive: {
      liquid: '#EFEBE9', items: ['#558B2F', '#33691E', '#827717'],
      capColor: '#4E342E',
    },
    garlic: {
      liquid: '#FFFDE7', items: ['#FFF8E1', '#FFF3E0', '#F5F5DC'],
      capColor: '#8D6E63',
    },
    vegetables: {
      liquid: '#E8F5E9', items: ['#388E3C', '#4CAF50', '#81C784'],
      capColor: '#6B4E37',
    },
    salads: {
      liquid: '#F1F8E9', items: ['#7CB342', '#9CCC65', '#AED581', '#E53935'],
      capColor: '#8D6E63',
    },
    special: {
      liquid: '#FBE9E7', items: ['#D84315', '#F4511E', '#E53935', '#FBC02D'],
      capColor: '#4E342E',
    },
    fresh: {
      liquid: '#E0F2F1', items: ['#26A69A', '#4DB6AC', '#80CBC4'],
      capColor: '#6B4E37',
    },
  }
  const t = themes[category] || themes.cucumber

  // تعریف آیتم‌ها (حبه‌های داخل شیشه) به صورت تصادفی ولی ثابت
  const items = []
  const positions = [
    { x: 42, y: 130, r: 11, c: 0 }, { x: 62, y: 148, r: 12, c: 1 },
    { x: 85, y: 128, r: 13, c: 2 }, { x: 105, y: 150, r: 11, c: 0 },
    { x: 55, y: 170, r: 12, c: 2 }, { x: 78, y: 168, r: 13, c: 1 },
    { x: 100, y: 172, r: 12, c: 0 }, { x: 122, y: 155, r: 11, c: 1 },
    { x: 125, y: 130, r: 10, c: 2 }, { x: 90, y: 152, r: 14, c: 1 },
    { x: 68, y: 130, r: 11, c: 0 }, { x: 110, y: 138, r: 12, c: 2 },
    { x: 50, y: 152, r: 10, c: 1 }, { x: 95, y: 188, r: 10, c: 2 },
    { x: 130, y: 178, r: 11, c: 0 }, { x: 75, y: 188, r: 11, c: 1 },
  ]
  positions.forEach((p, i) => {
    items.push(
      <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={t.items[p.c]} opacity="0.95" />
    )
  })

  return (
    <svg viewBox="0 0 180 240" xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: size, height: size * (240/180), display: 'block' }}>
      <defs>
        {/* گرادیان شیشه */}
        <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.7" />
        </linearGradient>
        {/* گرادیان مایع */}
        <linearGradient id="liquid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={t.liquid} stopOpacity="0.9" />
          <stop offset="100%" stopColor={t.liquid} stopOpacity="1" />
        </linearGradient>
        {/* سایه */}
        <radialGradient id="shadow" cx="50%" cy="100%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* سایه زیر شیشه */}
      <ellipse cx="90" cy="228" rx="55" ry="8" fill="url(#shadow)" />

      {/* بدنه شیشه */}
      <path d="M 40 100 
               Q 40 90 50 88 
               L 50 70 
               Q 50 60 60 58 
               L 60 50 
               L 120 50 
               L 120 58 
               Q 130 60 130 70 
               L 130 88 
               Q 140 90 140 100 
               L 140 210 
               Q 140 222 128 222 
               L 52 222 
               Q 40 222 40 210 Z"
        fill="url(#liquid)"
        stroke="#E9E5D8" strokeWidth="1.5" />

      {/* محتویات (حبه‌ها) */}
      <g clipPath="none" style={{ clipPath: 'inset(0)' }}>
        {items}
      </g>

      {/* بازتاب شیشه */}
      <path d="M 42 100 
               Q 42 92 50 90 
               L 50 210 
               Q 50 220 42 218 Z"
        fill="url(#glass)" opacity="0.6" />

      {/* درپوش پارچه‌ای */}
      <path d="M 45 55 Q 90 45 135 55 L 132 65 Q 90 58 48 65 Z" fill={t.capColor} />
      {/* گره */}
      <circle cx="90" cy="52" r="5" fill={t.capColor} opacity="0.8" />
      {/* بندهای پارچه */}
      <path d="M 60 62 Q 58 70 62 78" stroke={t.capColor} strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M 120 62 Q 122 70 118 78" stroke={t.capColor} strokeWidth="2" fill="none" opacity="0.7" />

      {/* درپوش فلزی زیر پارچه */}
      <rect x="48" y="58" width="84" height="6" rx="2" fill="#E0E0E0" opacity="0.5" />

      {/* برچسب */}
      <rect x="55" y="140" width="70" height="50" rx="8" fill="#FFF8E8" stroke="#E9E5D8" strokeWidth="1" />
      <text x="90" y="160" textAnchor="middle" fontSize="10" fontWeight="700" fill="#2E7D32" fontFamily="Vazirmatn, sans-serif">کافه ترشی</text>
      <text x="90" y="175" textAnchor="middle" fontSize="8" fill="#777" fontFamily="Vazirmatn, sans-serif">خانگی</text>
    </svg>
  )
}
