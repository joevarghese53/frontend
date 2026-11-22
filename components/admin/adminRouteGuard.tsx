"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { isAdminUser, isRecord } from "@/components/admin/adminUtils"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetProfileQuery } from "@/redux/api/usersApiSlice"
import { setCredentials } from "@/redux/state/auth/authSlice"
import type { AppDispatch, RootState } from "@/redux/store"

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const userInfo = useSelector((state: RootState) => state.auth.userInfo)
  const isAdmin = isAdminUser(userInfo)
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery(
    undefined,
    { skip: !userInfo || isAdmin }
  )
  const isAuthorized = isAdmin || isAdminUser(profile)

  useEffect(() => {
    if (!userInfo) {
      const storedUserInfo = window.localStorage.getItem("userInfo")
      if (storedUserInfo) {
        try {
          const parsedUserInfo: unknown = JSON.parse(storedUserInfo)
          if (isRecord(parsedUserInfo)) {
            dispatch(setCredentials(parsedUserInfo))
            return
          }
        } catch {
          window.localStorage.removeItem("userInfo")
        }
      }

      router.replace("/login")
      return
    }

    if (!isAuthorized && !isProfileLoading) router.replace("/myAccount")
  }, [dispatch, isProfileLoading, isAuthorized, router, userInfo])

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
