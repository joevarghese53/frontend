"use client"

import { useEffect, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { isAdminUser, isRecord } from "@/components/admin/adminUtils"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetProfileQuery } from "@/redux/api/usersApiSlice"
import { setCredentials } from "@/redux/state/auth/authSlice"
import type { AppDispatch, RootState } from "@/redux/store"

const subscribe = () => () => {}

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const userInfo = useSelector((state: RootState) => state.auth.userInfo)
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false)
  const {
    currentData: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetProfileQuery(undefined, {
    skip: !isHydrated || !userInfo,
  })
  const isAuthenticated = profile !== undefined && !profileError
  const isAuthorized =
    isAuthenticated && (isAdminUser(profile) || isAdminUser(userInfo))

  useEffect(() => {
    if (!isHydrated) return

    if (!userInfo) {
      try {
        const storedUserInfo = window.localStorage.getItem("userInfo")
        if (storedUserInfo) {
          const parsedUserInfo: unknown = JSON.parse(storedUserInfo)
          if (isRecord(parsedUserInfo)) {
            dispatch(setCredentials(parsedUserInfo))
            return
          }
          window.localStorage.removeItem("userInfo")
        }
      } catch (error) {
        console.error("Could not restore admin authentication state:", error)
      }

      router.replace("/login")
      return
    }

    if (isProfileLoading) return
    if (profileError) {
      router.replace("/login")
    } else if (!isAuthorized) {
      router.replace("/myAccount")
    }
  }, [
    dispatch,
    isAuthorized,
    isHydrated,
    isProfileLoading,
    profileError,
    router,
    userInfo,
  ])

  if (isAuthorized) return children

  return (
    <div className="mx-auto flex min-h-[70svh] max-w-375 items-center px-5 pt-28 pb-16">
      <div className="mx-auto w-full max-w-6xl space-y-4" role="status">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-28 w-full rounded-3xl" />
      </div>
    </div>
  )
}
