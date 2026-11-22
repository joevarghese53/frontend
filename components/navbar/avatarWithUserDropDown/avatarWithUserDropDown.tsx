"use client"

import {
  HeartIcon,
  LogOutIcon,
  ShoppingCartIcon,
  BarcodeIcon,
  UserIcon,
} from "lucide-react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Button } from "../../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { useLogoutMutation } from "@/redux/api/usersApiSlice"
import { apiSlice } from "@/redux/api/apiSlice"
import { logout as clearAuth } from "@/redux/state/auth/authSlice"

const AvatarWithUserDropDown = () => {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: RootState) => state.auth.userInfo)
  const [logout] = useLogoutMutation()

  const handleSignOut = async () => {
    try {
      await logout().unwrap()
    } catch (error) {
      console.error("Server sign-out failed:", error)
    }

    dispatch(clearAuth())
    dispatch(apiSlice.util.resetApiState())
  }

  const name =
    userInfo && typeof userInfo.name === "string" ? userInfo.name : "Account"
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/myAccount">
              <UserIcon />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/myOrders">
              <BarcodeIcon />
              Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/cart">
              <ShoppingCartIcon />
              Cart
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/wishlist">
              <HeartIcon />
              Wishlist
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/contactUs">
              <UserIcon />
              Contact Us
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarWithUserDropDown
