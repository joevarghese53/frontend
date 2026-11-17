import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ShippingAddress } from "@/types/shippingAddressType"
import type { RootState } from "@/redux/store"

type CheckoutState = {
  selectedAddress: ShippingAddress | null
}

const initialState: CheckoutState = {
  selectedAddress: null,
}

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    selectShippingAddress: (
      state,
      action: PayloadAction<ShippingAddress | null>
    ) => {
      state.selectedAddress = action.payload
    },
  },
})

export const { selectShippingAddress } = checkoutSlice.actions
export const selectSelectedAddress = (state: RootState) => state.checkout.selectedAddress
export default checkoutSlice.reducer
