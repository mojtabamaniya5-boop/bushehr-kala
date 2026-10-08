export default function Logo({ size = 42 }) {
  const base = import.meta.env.BASE_URL
  return (
    <img
      src={`${base}assets/categories/mixed.png`}
      alt="کافه ترشی"
      width={size}
      height={size}
      className="object-contain"
    />
  )
}
