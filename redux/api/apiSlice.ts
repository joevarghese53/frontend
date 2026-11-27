// redux/api/apiSlice.ts
import {
  fetchBaseQuery,
  createApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"
import { BASE_URL, USERS_URL } from "../constants"
import { logout, setAccessToken } from "../state/auth/authSlice"
import { RootState } from "../store"

const refreshPromises = new WeakMap<object, Promise<string | null>>()

function readAccessToken(value: unknown): string | null {
  if (
    typeof value === "object" &&
    value !== null &&
    "accessToken" in value &&
    typeof value.accessToken === "string" &&
    value.accessToken
  ) {
    return value.accessToken
  }

  return null
}

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // Send refreshToken cookie
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.userInfo?.accessToken
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const accessTokenAtRequestStart = (api.getState() as RootState).auth.userInfo
    ?.accessToken
  let result = await baseQuery(args, api, extraOptions)

  // If access token expired (unauthorized)
  if (result?.error?.status === 401) {
    const requestedUrl = typeof args === "string" ? args : (args?.url ?? "")

    const isAuthEndpoint =
      requestedUrl.includes("/login") ||
      requestedUrl.includes("/refresh-token") ||
      requestedUrl.includes("/logout") ||
      requestedUrl.includes("/register") ||
      requestedUrl.includes("/initiate-registration") ||
      requestedUrl.includes("/resetPasswordLink") ||
      requestedUrl.includes("/resetPassword")

    if (isAuthEndpoint) {
      // Return the original result (401) so the caller can handle it (e.g. show "invalid creds")
      return result
    }

    const currentUserInfo = (api.getState() as RootState).auth.userInfo
    if (!currentUserInfo) return result

    const currentAccessToken = currentUserInfo.accessToken
    if (currentAccessToken !== accessTokenAtRequestStart) {
      if (currentAccessToken) {
        result = await baseQuery(args, api, extraOptions)
      }
      return result
    }

    let refreshPromise = refreshPromises.get(api.dispatch)
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshResult = await baseQuery(
          {
            url: `${USERS_URL}/refresh-token`,
            method: "POST",
          },
          api,
          extraOptions
        )
        const accessToken = readAccessToken(refreshResult.data)

        if (accessToken) {
          api.dispatch(setAccessToken(accessToken))
          return accessToken
        }

        if (refreshResult.error?.status === 401) {
          await baseQuery(
            {
              url: `${USERS_URL}/logout`,
              method: "POST",
            },
            api,
            extraOptions
          )
          api.dispatch(logout())
        } else {
          console.error(
            "Could not refresh access token:",
            refreshResult.error ?? "Refresh endpoint returned an invalid response."
          )
        }

        return null
      })()
      refreshPromises.set(api.dispatch, refreshPromise)
    }

    const activeRefreshPromise = refreshPromise
    try {
      const accessToken = await activeRefreshPromise
      if (accessToken) {
        result = await baseQuery(args, api, extraOptions)
      }
    } finally {
      if (refreshPromises.get(api.dispatch) === activeRefreshPromise) {
        refreshPromises.delete(api.dispatch)
      }
    }
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Products",
    "Order",
    "User",
    "Category",
    "Cart",
    "Wishlist",
    "CProduct",
    "ShippingAddress",
    "Tries",
    "ContactMessage",
  ],
  endpoints: () => ({}),
})
