import type { ProductType } from "@/types/productType"

export type WishlistProduct = ProductType

export type WishlistResponse = {
  _id?: string
  userId: string
  items: WishlistProduct[]
}
