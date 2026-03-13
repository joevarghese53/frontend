import { RootState } from "@/redux/store"
import { createSlice } from "@reduxjs/toolkit"

const initialState =
  typeof window !== "undefined" && localStorage.getItem("selectedAddress")
    ? { selectedAddress: JSON.parse(localStorage.getItem("selectedAddress")!) }
    : { selectedAddress: null }

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: initialState,
  reducers: {
    selectShippingAddress: (state, action) => {
      state.selectedAddress = action.payload
      // Save to localStorage
      if (typeof window !== "undefined") {
        try {
          const serializedState = JSON.stringify(state.selectedAddress)
          localStorage.setItem("selectedAddress", serializedState)
        } catch (e) {
          console.warn("Could not save state to localStorage", e)
        }
      }
    },
  },
})

export const { selectShippingAddress } = checkoutSlice.actions
export const selectSelectedAddress = (state: RootState) => state.checkout.selectedAddress
export default checkoutSlice.reducer
