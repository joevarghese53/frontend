import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type UserInfo = Record<string, unknown> & {
  accessToken?: string
}

const initialState: { userInfo: UserInfo | null } = {
  userInfo: null as null | Record<string, unknown>,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload
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

export const { setCredentials, logout, setAccessToken } = authSlice.actions
export default authSlice.reducer
