import type { CartItem } from "@/types/cartType"

export type CartTotals = {
  itemsPrice: string
  shippingPrice: string
  taxPrice: string
  totalPrice: string
}

export function calculateCartTotals(items: CartItem[]): CartTotals {
  const itemsPriceWithTax = items.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0
  )
  const taxPrice = items.reduce((total, item) => {
    const gstRate = item.productId.price > 1000 ? 0.12 : 0.05
    const itemTax = item.productId.price - item.productId.price / (1 + gstRate)
    return total + itemTax * item.quantity
  }, 0)
  const shippingPrice = itemsPriceWithTax > 1000 ? 0 : 150

  return {
    itemsPrice: (itemsPriceWithTax - taxPrice).toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: (itemsPriceWithTax + shippingPrice).toFixed(2),
  }
}
