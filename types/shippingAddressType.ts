export type ShippingAddressLabel = "Home" | "Office" | "Other"

export type ShippingAddressInput = {
  fullName: string
  addressLine1: string
  addressLine2: string
  landmark: string
  city: string
  state: string
  postalCode: string
  phoneNumber: string
  label: ShippingAddressLabel
  country: string
}

export type ShippingAddress = ShippingAddressInput & {
  _id: string
  user: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
  __v: number
}
