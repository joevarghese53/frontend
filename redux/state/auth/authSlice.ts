import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userInfo: null as null | Record<string, unknown>,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(action.payload))
      }
    },
    logout: (state) => {
      state.userInfo = null
      if (typeof window !== "undefined") {
        localStorage.removeItem("userInfo")
      }
    },
    setAccessToken: (state, action) => {
      if (!state.userInfo) return
      ;(state.userInfo as Record<string, unknown>).accessToken = action.payload
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(state.userInfo))
      }
    },
  },
})

export const { setCredentials, logout, setAccessToken } = authSlice.actions
export default authSlice.reducer
