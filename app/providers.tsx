"use client"

import { useEffect, useState } from "react"
import { Provider } from "react-redux"
import { useDispatch } from "react-redux"
import { setupListeners } from "@reduxjs/toolkit/query"
import { makeStore, type AppStore } from "../redux/store"
import {
  setAuthHydrated,
  setCredentials,
} from "@/redux/state/auth/authSlice"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(() => makeStore())

  useEffect(() => setupListeners(store.dispatch), [store])

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
    try {
      const storedUserInfo = window.localStorage.getItem("userInfo")
      if (!storedUserInfo) return

      const parsedUserInfo: unknown = JSON.parse(storedUserInfo)
      if (!isRecord(parsedUserInfo)) {
        throw new Error("Stored user information is invalid.")
      }

      dispatch(setCredentials(parsedUserInfo))
    } catch (error) {
      console.error("Could not restore authentication state:", error)
      try {
        window.localStorage.removeItem("userInfo")
      } catch (storageError) {
        console.error("Could not clear invalid authentication state:", storageError)
      }
    } finally {
      dispatch(setAuthHydrated())
    }
  }, [dispatch])

  return null
}
