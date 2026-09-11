// redux/hooks/useRefetchHome.ts

import { useDispatch } from "react-redux"
import { apiSlice } from "@/redux/api/apiSlice"

export const useRefetchHome = () => {
  const dispatch = useDispatch()

  return () => {
    dispatch(
      apiSlice.util.invalidateTags([
        "Products",
        "Category",
      ])
    )
  }
}