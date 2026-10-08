// لوگوی کافه ترشی — تصویرسازی SVG
export default function Logo({ size = 72 }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      {/* برگ‌های تزئینی */}
      <path d="M 20 55 Q 8 45 18 35 Q 28 42 25 55 Z" fill="#7CB342" opacity="0.85"/>
      <path d="M 100 55 Q 112 45 102 35 Q 92 42 95 55 Z" fill="#7CB342" opacity="0.85"/>
      <path d="M 30 30 Q 25 20 35 15 Q 40 22 38 32 Z" fill="#8BC34A" opacity="0.7"/>

      {/* بدنه شیشه */}
      <rect x="35" y="38" width="50" height="62" rx="10" fill="#F5F1E8" stroke="#6B4E37" strokeWidth="2"/>

      {/* مایع سبز (آب نمک) */}
      <rect x="38" y="48" width="44" height="49" rx="7" fill="#C8E6C9" opacity="0.7"/>

      {/* خیارشورها داخل شیشه */}
      <g transform="translate(60, 75)">
        <ellipse cx="-8" cy="-8" rx="6" ry="10" fill="#66BB6A" transform="rotate(-25 -8 -8)"/>
        <ellipse cx="6" cy="-5" rx="6" ry="10" fill="#4CAF50" transform="rotate(20 6 -5)"/>
        <ellipse cx="-3" cy="8" rx="6" ry="10" fill="#43A047" transform="rotate(-10 -3 8)"/>
        <ellipse cx="10" cy="10" rx="5" ry="8" fill="#66BB6A" transform="rotate(30 10 10)"/>
        <ellipse cx="-12" cy="6" rx="5" ry="8" fill="#388E3C" transform="rotate(-15 -12 6)"/>
      </g>

      {/* درپوش پارچه‌ای */}
      <path d="M 32 38 Q 60 32 88 38 L 86 46 Q 60 42 34 46 Z" fill="#A1887F"/>
      <path d="M 32 38 Q 60 32 88 38 L 87 42 Q 60 36 33 42 Z" fill="#8D6E63" opacity="0.5"/>

      {/* گره و بندهای پارچه */}
      <circle cx="60" cy="34" r="4" fill="#6B4E37"/>
      <path d="M 48 42 Q 46 50 50 56" stroke="#8D6E63" strokeWidth="2" fill="none" opacity="0.8"/>
      <path d="M 72 42 Q 74 50 70 56" stroke="#8D6E63" strokeWidth="2" fill="none" opacity="0.8"/>

      {/* برق شیشه */}
      <path d="M 42 55 Q 42 50 46 48" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.7" strokeLinecap="round"/>
    </svg>
  )
}
