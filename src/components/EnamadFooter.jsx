export default function EnamadFooter() {
  // کد رسمی اینماد برای کافه ترشی
  const enamadCode = "YCJdEAaj1dxDgqClJ7NmMK4Lfd8FMNV0";
  const enamadId = "8106941";
  
  return (
    <div className="flex flex-col items-center justify-center py-6 mt-4 border-t border-border">
      <a 
        referrerPolicy="origin" 
        target="_blank" 
        href={`https://trustseal.enamad.ir/?id=${enamadId}&Code=${enamadCode}`}
        className="block"
      >
        <img 
          referrerPolicy="origin" 
          src={`https://trustseal.enamad.ir/logo.aspx?id=${enamadId}&Code=${enamadCode}`} 
          alt="نماد اعتماد الکترونیکی" 
          style={{ cursor: 'pointer', width: '100px', height: 'auto' }} 
        />
      </a>
      <span className="text-[10px] text-muted mt-2">نماد اعتماد الکترونیکی</span>
    </div>
  )
}
