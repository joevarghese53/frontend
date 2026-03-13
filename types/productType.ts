export type ReviewType = {
  _id?: string
  name: string
  rating: number
  comment: string
  user: string
  createdAt?: string
  updatedAt?: string
}

export type CategoryType = {
  _id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export type ProductType = {
  _id: string

  name: string

  frontImage: string
  backImage: string
  frontDesign: string
  backDesign: string

  images?: string[]

  category: CategoryType

  description: string

  reviews: ReviewType[]

  rating: number
  numReviews: number

  price: number
  countInStock: number

  offers?: string
  returnpolicy?: string

  createdAt: string
  updatedAt: string
}
