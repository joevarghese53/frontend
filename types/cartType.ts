export type CartItemProduct = {
  _id: string
  name: string
  frontImage: string
  backImage?: string
  frontDesign?: string | null
  backDesign?: string | null
  frontUpload?: string | null
  backUpload?: string | null
  price: number
  category: string
}

export type CartItem = {
  _id: string
  productId: CartItemProduct
  productType: string
  quantity: number
  size: string
}

export type CartResponse = {
  _id: string
  userId: string
  items: CartItem[]
  __v: number
  updatedAt: string
}

export type RemoveCartItemArgs = {
  productId: string
  size: string
}
