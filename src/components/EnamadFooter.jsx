export default function EnamadFooter() {
  const base = import.meta.env.BASE_URL
  return (
    <div className="flex flex-col items-center py-5 mt-5 border-t border-border">
      <a
        referrerPolicy="origin"
        target="_blank"
        rel="noreferrer"
        href="https://trustseal.enamad.ir/?id=8106941&Code=YCJdEAaj1dxDgqClJ7NmMK4Lfd8FMNV0"
        className="active:scale-95 transition"
      >
        <img
          src={`${base}enamad-logo.png`}
          alt="نماد اعتماد الکترونیکی"
          className="w-24 h-auto"
        />
      </a>
      <p className="text-[9px] text-muted mt-2">نماد اعتماد الکترونیکی</p>
    </div>
  )
}
