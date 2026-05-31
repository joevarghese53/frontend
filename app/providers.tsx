"use client"

import { useEffect } from "react"
import { Provider } from "react-redux"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/redux/state/auth/authSlice"
import store from "../redux/store"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
    </Provider>
  )
}

function AuthHydrator() {
  const dispatch = useDispatch()

  useEffect(() => {
    const storedUserInfo = window.localStorage.getItem("userInfo")

    if (!storedUserInfo) {
      return
    }

    try {
      dispatch(setCredentials(JSON.parse(storedUserInfo)))
    } catch {
      window.localStorage.removeItem("userInfo")
    }
  }, [dispatch])

  return null
}
