"use client"

import { useRef } from "react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { AiOutlineShopping } from "react-icons/ai"
import { FiArrowRight, FiShoppingBag } from "react-icons/fi"
import ErrorCard from "@/components/errorCard/errorCard"
import { calculateCartTotals } from "@/lib/cartPricing"
import { useGetCartQuery, useRemoveFromCartMutation } from "@/redux/api/cartApiSlice"
import type { RootState } from "@/redux/store"
import type { CartItem } from "@/types/cartType"
import CheckoutSteps from "@/components/checkoutSteps/checkoutSteps"
import "./page.css"
import CartItems from "@/components/cartItems/page"
import OrderSummary from "@/components/orderSummary/page"

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

const Cart = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo)
  const { data, isLoading, error, refetch } = useGetCartQuery(undefined, {
    skip: !userInfo,
  })
  const [removeCartItem, { isLoading: isRemoving }] = useRemoveFromCartMutation()
  const billingRef = useRef<HTMLElement>(null)

  const scrollToBilling = () => {
    billingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleRemoveFromCart = async (item: CartItem) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this item from your cart?"
    )
    if (!confirmed) return

    try {
      await removeCartItem({
        productId: item.productId._id,
        size: item.size,
      }).unwrap()
      toast.success("Item removed from cart.")
    } catch (removeError) {
      toast.error(`Failed to remove item: ${getErrorMessage(removeError)}`)
      console.error("Error removing item from cart:", removeError)
    }
  }

  if (!userInfo) {
    return (
      <div className="cart-page-container">
        <div className="cart-login-redirect">
          <div className="cart-login-card">
            <AiOutlineShopping className="cart-login-icon" />
            <h2>Sign in to view your cart</h2>
            <p>Your cart is linked to your account. Sign in to see your saved items.</p>
            <Link href="/login" className="cart-login-button">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="cart-page-container">
        <div className="cart-loading-state" role="status" aria-live="polite">
          <div className="cart-loading-spinner" />
          <p>Loading your cart…</p>
        </div>
      </div>
    )
  }

  const cartNotFound = error && getErrorMessage(error) === "Cart not found"
  if (error && !cartNotFound) {
    return (
      <div className="cart-page-container">
        <ErrorCard
          title="Failed to load your cart"
          message={getErrorMessage(error)}
          onRetry={() => {
            void refetch()
          }}
        />
      </div>
    )
  }

  if (!data && !cartNotFound) {
    return (
      <div className="cart-page-container">
        <ErrorCard
          title="Cart data is unavailable"
          message="Please try loading your cart again."
          onRetry={() => {
            void refetch()
          }}
        />
      </div>
    )
  }

  const items = data?.items ?? []

  if (items.length === 0) {
    return (
      <div className="cart-page-container">
        <div className="cart-empty-state">
          <div className="cart-empty-card">
            <FiShoppingBag className="cart-empty-icon" />
            <h2>Your shopping cart is empty</h2>
            <p>
              Looks like you haven&apos;t added any items to your cart yet. Start
              shopping to see your items here.
            </p>
            <Link href="/" className="cart-continue-shopping">
              <FiArrowRight className="cart-arrow-icon" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
    calculateCartTotals(items)
  return (
    <div className="cart-page-container">
      <CheckoutSteps currentStep="cart" />

      <div className="cart-content-wrapper">
        <CartItems
          items={items}
          onRemove={handleRemoveFromCart}
          isRemoving={isRemoving}
        />

        <OrderSummary
          itemsPrice={itemsPrice}
          taxPrice={taxPrice}
          shippingPrice={shippingPrice}
          totalPrice={totalPrice}
          summaryRef={billingRef}
        />
      </div>

      <div className="cart-mobile-bottom">
        <div className="cart-mobile-price">
          <span className="cart-mobile-total">₹{totalPrice}</span>
          <button
            type="button"
            onClick={scrollToBilling}
            className="cart-mobile-details"
          >
            View Details
          </button>
        </div>
        <Link href="/address" className="cart-mobile-checkout">
          Checkout
        </Link>
      </div>
    </div>
  )
}

export default Cart
