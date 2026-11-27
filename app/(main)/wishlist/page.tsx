"use client"

import Link from "next/link"
import { useSelector } from "react-redux"
import { Heart, ShoppingBag } from "lucide-react"
import { BackNavigation } from "@/components/navigation/backNavigation"
import ErrorCard from "@/components/errorCard/errorCard"
import {
  useGetWishlistQuery,
} from "@/redux/api/wishlistApiSlice"
import type { RootState } from "@/redux/store"
import "./page.css"
import ProductCard from "@/components/productCard/productCard"

function getErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null) {
    return "An unexpected error occurred."
  }
  if ("data" in error) {
    const data = error.data
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message
    }
  }
  if ("message" in error && typeof error.message === "string") {
    return error.message
  }
  if ("error" in error && typeof error.error === "string") {
    return error.error
  }
  return "An unexpected error occurred."
}

export default function WishlistPage() {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo)
  const {
    data: wishlist,
    isLoading,
    error,
    refetch,
  } = useGetWishlistQuery(undefined, { skip: !userInfo })
  if (!userInfo) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-state-card">
          <Heart className="wishlist-state-icon" aria-hidden="true" />
          <h1>Sign in to view your wishlist</h1>
          <p>Save your favorite pieces and find them here anytime.</p>
          <Link href="/login" className="wishlist-primary-link">
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-loading" role="status" aria-live="polite">
          <span className="wishlist-spinner" />
          <p>Loading your wishlist…</p>
        </div>
      </div>
    )
  }

  if (error || !wishlist) {
    return (
      <div className="wishlist-page">
        <ErrorCard
          title="Could not load your wishlist"
          message={error ? getErrorMessage(error) : "Wishlist data is unavailable."}
          onRetry={() => void refetch()}
        />
      </div>
    )
  }

  if (wishlist.items.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-state-card">
          <div className="wishlist-empty-icon" aria-hidden="true">
            <ShoppingBag />
            <Heart />
          </div>
          <h1>Your wishlist is waiting</h1>
          <p>Save items you love and they’ll be ready when you are.</p>
          <Link href="/" className="wishlist-primary-link">
            Explore products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <BackNavigation fallbackHref="/" />
      <header className="wishlist-header">
        <div>
          <p className="wishlist-eyebrow">Saved for later</p>
          <h1>My Wishlist</h1>
          <p className="wishlist-count">
            {wishlist.items.length}{" "}
            {wishlist.items.length === 1 ? "item" : "items"}
          </p>
        </div>
      </header>

      <div className="wishlist-product-grid">
        {wishlist.items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
