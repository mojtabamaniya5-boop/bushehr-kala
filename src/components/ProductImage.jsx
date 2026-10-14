import { useState } from 'react'
import JarIllustration from './JarIllustration'

export default function ProductImage({ product, className = '' }) {
  const [useReal, setUseReal] = useState(
    product.image && product.image.startsWith('http') && !product.image.includes('placehold')
  )

  if (useReal) {
    return (
      <img src={product.image} alt={product.title} loading="lazy"
        onError={() => setUseReal(false)}
        className={'w-full h-full object-cover ' + className} />
    )
  }

  return (
    <div className={'w-full h-full flex items-center justify-center bg-gradient-to-br from-cream to-brand-light ' + className}>
      <JarIllustration category={product.category} size={140} />
    </div>
  )
}
