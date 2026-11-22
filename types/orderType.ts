import type { ShippingAddressInput } from "@/types/shippingAddressType"

export type OrderItemInput = {
  _id: string
  name: string
  qty: number
  frontImage: string
  backImage?: string
  frontDesign?: string | null
  backDesign?: string | null
  frontUpload?: string | null
  backUpload?: string | null
  size: string
  category: string
  productType: string
}

export type OrderShippingAddress = Omit<ShippingAddressInput, "label">

export type CreateOrderRequest = {
  orderItems: OrderItemInput[]
  shippingAddress: OrderShippingAddress
}

export type OrderItemResponse = {
  _id: string
  product: string
  name: string
  category: string
  qty: number
  size: string
  price: number
  frontImage: string
  backImage: string
  frontDesign: string | null
  backDesign: string | null
  productType: string
}

export type OrderUserSummary = {
  _id: string
  username: string
  email: string
}

export type CreateOrderResponse = {
  _id: string
  user: string | OrderUserSummary
  orderItems: OrderItemResponse[]
  shippingAddress: OrderShippingAddress
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  status: string
  isPaid: boolean
  isConfirmed: boolean
  isShipped: boolean
  isOutForDelivery: boolean
  isDelivered: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export type PaymentInitiationRequest = {
  orderId: string
}

export type PaymentInitiationResponse = {
  success: boolean
  redirectUrl: string
  merchantOrderId: string
}

export type OrderDetailsResponse = Omit<
  CreateOrderResponse,
  "user" | "shippingAddress"
> & {
  user: {
    _id?: string
    username: string
    email: string
  }
  shippingAddress: OrderShippingAddress
}
