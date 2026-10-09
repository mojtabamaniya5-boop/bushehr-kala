// استپر مراحل سفارش
const STEPS = [
  { id: 'pending', label: 'ثبت سفارش',  icon: '📝' },
  { id: 'paid',    label: 'پرداخت',      icon: '💳' },
  { id: 'sent',    label: 'ارسال',       icon: '🚚' },
  { id: 'done',    label: 'تحویل',       icon: '🏠' },
]

const STATUS_INDEX = {
  pending: 0,
  paid: 1,
  sent: 2,
  done: 3,
  canceled: -1,
}

export default function TrackStepper({ status = 'pending', compact = false }) {
  const idx = STATUS_INDEX[status] ?? 0
  const canceled = status === 'canceled'

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* خط پشت */}
        <div className="absolute top-5 right-[10%] left-[10%] h-1 bg-border rounded-full" />
        {/* خط پیشرفت سبز */}
        {!canceled && idx > 0 && (
          <div
            className="absolute top-5 right-[10%] h-1 bg-brand rounded-full transition-all duration-500"
            style={{ width: `calc(${(idx / (STEPS.length - 1)) * 80}%)` }}
          />
        )}
        {canceled && (
          <div className="absolute top-5 right-[10%] left-[10%] h-1 bg-danger rounded-full" />
        )}

        {/* استپ‌ها */}
        {STEPS.map((s, i) => {
          const done = !canceled && i <= idx
          const active = i === idx && !canceled
          return (
            <div key={s.id} className="flex flex-col items-center z-10" style={{ width: '20%' }}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                  ${canceled ? 'bg-white border-danger' : done ? 'bg-brand border-brand' : 'bg-white border-border'}`}
                style={active ? { boxShadow: '0 0 0 4px rgba(46,125,50,0.15)' } : {}}>
                {canceled && i > 0 ? (
                  <span className="text-danger text-lg">✕</span>
                ) : (
                  <span className="text-base">{s.icon}</span>
                )}
              </div>
              {!compact && (
                <span className={`text-[9px] font-bold mt-1.5 text-center leading-tight
                  ${canceled ? 'text-danger' : done ? 'text-brand' : 'text-muted'}`}>
                  {s.label}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {canceled && (
        <p className="text-center text-[10px] font-bold text-danger mt-3">
          این سفارش لغو شده است
        </p>
      )}
    </div>
  )
}
