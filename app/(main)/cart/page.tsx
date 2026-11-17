"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { AiOutlineShopping } from "react-icons/ai"
import { FiArrowRight, FiShoppingBag, FiTrash2 } from "react-icons/fi"
import ErrorCard from "@/components/errorCard/errorCard"
import { calculateCartTotals } from "@/lib/cartPricing"
import { useGetCartQuery, useRemoveFromCartMutation } from "@/redux/api/cartApiSlice"
import type { RootState } from "@/redux/store"
import type { CartItem } from "@/types/cartType"
import CheckoutSteps from "@/components/checkoutSteps/checkoutSteps"
import "./page.css"

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
  const billingRef = useRef<HTMLDivElement>(null)

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
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="cart-page-container">
      <CheckoutSteps currentStep="cart" />

      <div className="cart-content-wrapper">
        <section className="cart-items-section" aria-labelledby="cart-items-heading">
          <div className="cart-items-header">
            <h3 id="cart-items-heading">CART ITEMS</h3>
            <span className="cart-items-count">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="cart-items-list">
            {items.map((item) => {
              return (
                <article
                  className="cart-item-card"
                  key={item._id}
                >
                  <div className="cart-item-image">
                    <Image
                      src={item.productId.frontImage}
                      alt={item.productId.name}
                      width={130}
                      height={170}
                      sizes="130px"
                    />
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-info">
                      <div>
                        <h4 className="cart-item-name">{item.productId.name}</h4>
                        <p className="cart-item-category">
                          {item.productId.category}
                        </p>
                      </div>
                      <div className="cart-item-meta">
                        <span className="cart-item-size">Size: {item.size}</span>
                        <span className="cart-item-quantity">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="cart-item-price">
                      <div className="cart-item-price-details">
                        <span className="cart-item-price-amount">
                          ₹{item.productId.price.toFixed(2)}
                        </span>
                        <span className="cart-item-price-note">
                          MRP inclusive of all taxes
                        </span>
                      </div>
                      <button
                        type="button"
                        className="cart-item-remove"
                        onClick={() => void handleRemoveFromCart(item)}
                        disabled={isRemoving}
                        aria-label={`Remove ${item.productId.name} from cart`}
                        title="Remove item"
                      >
                        <FiTrash2 aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section
          className="cart-summary-section"
          ref={billingRef}
          aria-labelledby="cart-summary-heading"
        >
          <div className="cart-summary-card">
            <h3 className="cart-summary-title" id="cart-summary-heading">
              ORDER SUMMARY
            </h3>

            <div className="cart-summary-details">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>₹{itemsPrice}</span>
              </div>
              <div className="cart-summary-row">
                <span>GST</span>
                <span>₹{taxPrice}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span>
                  {Number(shippingPrice) > 0 ? `₹${shippingPrice}` : "Free"}
                </span>
              </div>

              <div className="cart-summary-divider" />

              <div className="cart-summary-row cart-summary-total">
                <span>Total Amount</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <Link href="/address" className="cart-checkout-button">
              Proceed to Checkout
              <FiArrowRight aria-hidden="true" />
            </Link>

            <div className="cart-summary-note">
              <p>Free shipping on orders above ₹1000</p>
            </div>
          </div>
        </section>
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
