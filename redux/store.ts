import { configureStore, type Middleware } from "@reduxjs/toolkit"
import { apiSlice } from "./api/apiSlice"
import authReducer from "./state/auth/authSlice"
import { logout, setAccessToken, setCredentials } from "./state/auth/authSlice"
import type { UserInfo } from "./state/auth/authSlice"
import checkoutReducer from "./state/checkout/checkoutSlice"
import shopReducer from "./state/shop/shopSlice"

type AuthStoreState = {
  auth: { userInfo: UserInfo | null }
}

const authPersistenceMiddleware: Middleware<object, AuthStoreState> =
  (storeApi) => (next) => (action) => {
    const result = next(action)

    if (
      typeof window === "undefined" ||
      typeof action !== "object" ||
      action === null ||
      !("type" in action)
    ) {
      return result
    }

    try {
      if (logout.match(action)) {
        window.localStorage.removeItem("userInfo")
      } else if (setCredentials.match(action) || setAccessToken.match(action)) {
        const userInfo = storeApi.getState().auth.userInfo
        if (userInfo) {
          const persistedUserInfo = { ...userInfo }
          delete persistedUserInfo.accessToken
          window.localStorage.setItem(
            "userInfo",
            JSON.stringify(persistedUserInfo)
          )
        }
      }
    } catch (error) {
      console.error("Could not persist authentication state:", error)
    }

    return result
  }

export const makeStore = () =>
  configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authReducer,
      checkout: checkoutReducer,
      shop: shopReducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authPersistenceMiddleware,
        apiSlice.middleware
      ),
    devTools: process.env.NODE_ENV !== "production",
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
