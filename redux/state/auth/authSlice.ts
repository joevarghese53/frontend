import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type UserInfo = Record<string, unknown> & {
  accessToken?: string
}

type AuthState = {
  userInfo: UserInfo | null
  isHydrated: boolean
}

const initialState: AuthState = {
  userInfo: null,
  isHydrated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload
    },
    setAuthHydrated: (state) => {
      state.isHydrated = true
    },
    logout: (state) => {
      state.userInfo = null
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      if (!state.userInfo) return
      state.userInfo.accessToken = action.payload
    },
  },
})

export const {
  setCredentials,
  setAuthHydrated,
  logout,
  setAccessToken,
} = authSlice.actions
export default authSlice.reducer
