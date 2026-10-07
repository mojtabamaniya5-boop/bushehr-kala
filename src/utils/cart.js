import { storage } from './storage'

const CART_KEY = 'cart'
const FAV_KEY = 'favorites'

export const getCart = () => storage.get(CART_KEY, [])
export const saveCart = (items) => {
  storage.set(CART_KEY, items)
  window.dispatchEvent(new Event('cart-updated'))
}

export const addToCart = (product, qty = 1) => {
  const cart = getCart()
  const idx = cart.findIndex(i => i.id === product.id)
  if (idx > -1) {
    cart[idx].qty += qty
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty,
    })
  }
  saveCart(cart)
}

export const removeFromCart = (id) => {
  saveCart(getCart().filter(i => i.id !== id))
}

export const updateQty = (id, qty) => {
  const cart = getCart()
  const idx = cart.findIndex(i => i.id === id)
  if (idx > -1) {
    if (qty <= 0) cart.splice(idx, 1)
    else cart[idx].qty = qty
    saveCart(cart)
  }
}

export const clearCart = () => saveCart([])

export const cartCount = () => getCart().reduce((s, i) => s + i.qty, 0)

export const cartTotal = () => getCart().reduce((s, i) => s + i.price * i.qty, 0)

// علاقه‌مندی‌ها
export const getFavorites = () => storage.get(FAV_KEY, [])
export const toggleFavorite = (id) => {
  const favs = getFavorites()
  const idx = favs.indexOf(id)
  if (idx > -1) favs.splice(idx, 1)
  else favs.push(id)
  storage.set(FAV_KEY, favs)
  window.dispatchEvent(new Event('fav-updated'))
  return favs.includes(id)
}
export const isFavorite = (id) => getFavorites().includes(id)
