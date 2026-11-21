"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { FiEdit2, FiMapPin, FiPhone, FiUser } from "react-icons/fi"
import { toast } from "sonner"
import { ErrorCard } from "@/components/errorCard/errorCard"
import { calculateCartTotals } from "@/lib/cartPricing"
import { useGetCartQuery } from "@/redux/api/cartApiSlice"
import { useCreateOrderMutation } from "@/redux/api/orderApiSlice"
import { useGetUserShippingAddressesQuery } from "@/redux/api/shippingAddressApiSlice"
import { selectShippingAddress } from "@/redux/state/checkout/checkoutSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import type { ShippingAddress } from "@/types/shippingAddressType"
import type { CreateOrderRequest } from "@/types/orderType"
import "./page.css"
import CheckoutSteps from "@/components/checkoutSteps/checkoutSteps"

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

function getAddressId(value: unknown): string | null {
  if (
    typeof value === "object" &&
    value !== null &&
    "_id" in value &&
    typeof value._id === "string"
  ) {
    return value._id
  }

  return null
}

const CheckoutPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const userInfo = useSelector((state: RootState) => state.auth.userInfo)
  const selectedAddress = useSelector(
    (state: RootState) => state.checkout.selectedAddress
  )
  const {
    data: addresses,
    isLoading: isAddressLoading,
    error: addressError,
    refetch: refetchAddresses,
  } = useGetUserShippingAddressesQuery(undefined, { skip: !userInfo })
  const {
    data: cartData,
    isLoading: isCartLoading,
    error: cartError,
    refetch: refetchCart,
  } = useGetCartQuery(undefined, { skip: !userInfo })
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation()

  useEffect(() => {
    if (!addresses) return

    const matchingAddress = addresses.find(
      (address) => address._id === selectedAddress?._id
    )
    if (matchingAddress) {
      if (matchingAddress !== selectedAddress) {
        dispatch(selectShippingAddress(matchingAddress))
      }
      try {
        localStorage.setItem(
          "selectedAddress",
          JSON.stringify(matchingAddress)
        )
      } catch (error) {
        console.error("Could not persist the selected address:", error)
      }
      return
    }

    let storedAddressId: string | null = null
    try {
      const savedAddress = localStorage.getItem("selectedAddress")
      if (savedAddress) {
        storedAddressId = getAddressId(JSON.parse(savedAddress))
      }
    } catch (error) {
      console.error("Could not read the selected address:", error)
      try {
        localStorage.removeItem("selectedAddress")
      } catch (storageError) {
        console.error("Could not clear the selected address:", storageError)
      }
    }

    const nextAddress =
      addresses.find((address) => address._id === storedAddressId) ??
      addresses.find((address) => address.isDefault) ??
      addresses[0] ??
      null

    dispatch(selectShippingAddress(nextAddress))
    try {
      if (nextAddress) {
        localStorage.setItem("selectedAddress", JSON.stringify(nextAddress))
      } else {
        localStorage.removeItem("selectedAddress")
      }
    } catch (error) {
      console.error("Could not persist the selected address:", error)
    }
  }, [addresses, dispatch, selectedAddress])

  const placeOrderHandler = async () => {
    const activeAddress = addresses?.find(
      (address) => address._id === selectedAddress?._id
    )

    if (!cartData?.items.length) {
      toast.error("Your cart is empty.")
      return
    }
    if (!activeAddress) {
      toast.info("Choose a delivery address before placing your order.")
      return
    }

    const orderData: CreateOrderRequest = {
      orderItems: cartData.items.map((item) => ({
        name: item.productId.name,
        qty: item.quantity,
        frontImage: item.productId.frontImage,
        backImage: item.productId.backImage,
        frontDesign: item.productId.frontDesign,
        backDesign: item.productId.backDesign,
        frontUpload: item.productId.frontUpload,
        backUpload: item.productId.backUpload,
        _id: item.productId._id,
        size: item.size,
        category: item.productId.category,
        productType: item.productType,
      })),
      shippingAddress: {
        fullName: activeAddress.fullName,
        addressLine1: activeAddress.addressLine1,
        addressLine2: activeAddress.addressLine2,
        landmark: activeAddress.landmark,
        city: activeAddress.city,
        state: activeAddress.state,
        postalCode: activeAddress.postalCode,
        phoneNumber: activeAddress.phoneNumber,
        country: activeAddress.country,
      },
    }

    try {
      const order = await createOrder(orderData).unwrap()
      console.log("Order created:", order)
      toast.success("Order placed. Continue to payment.")
      router.push(`/payment?orderId=${encodeURIComponent(order._id)}`)
    } catch (error) {
      toast.error(`Could not place order: ${getErrorMessage(error)}`)
    }
  }

  if (!userInfo) {
    return (
      <div className="checkout-page">
        <ErrorCard
          title="Sign in to continue"
          message="Please sign in before reviewing your order."
        />
        <Link href="/login" className="checkout-return-link">
          Sign in
        </Link>
      </div>
    )
  }

  if (isCartLoading || isAddressLoading) {
    return (
      <div className="checkout-loading-container" role="status" aria-live="polite">
        <div className="checkout-loading-spinner" />
        <p>Loading checkout…</p>
      </div>
    )
  }

  const cartNotFound = cartError && getErrorMessage(cartError) === "Cart not found"
  if (addressError || (cartError && !cartNotFound)) {
    return (
      <div className="checkout-page">
        <ErrorCard
          title="Could not load checkout details"
          message={
            addressError
              ? getErrorMessage(addressError)
              : getErrorMessage(cartError)
          }
          onRetry={() => {
            void refetchAddresses()
            void refetchCart()
          }}
        />
      </div>
    )
  }

  if (!addresses || (!cartData && !cartNotFound)) {
    return (
      <div className="checkout-page">
        <ErrorCard
          title="Checkout details are unavailable"
          message="Please try loading your cart and delivery address again."
          onRetry={() => {
            void refetchAddresses()
            void refetchCart()
          }}
        />
      </div>
    )
  }

  const cartItems = cartData?.items ?? []
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty-state">
          <h1>Your cart is empty</h1>
          <p>Add items to your cart before placing an order.</p>
          <Link href="/cart" className="checkout-return-link">
            Return to cart
          </Link>
        </div>
      </div>
    )
  }

  const addressList: ShippingAddress[] = addresses
  const activeAddress =
    addressList.find((address) => address._id === selectedAddress?._id) ?? null
  if (!activeAddress) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty-state">
          <h1>Choose a delivery address</h1>
          <p>Select or add an address before placing your order.</p>
          <Link href="/address" className="checkout-return-link">
            Choose address
          </Link>
        </div>
      </div>
    )
  }

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
    calculateCartTotals(cartItems)

  return (
    <div className="checkout-page">
      <CheckoutSteps currentStep="checkout" />

      <div className="checkout-content">
        <section className="checkout-address-card" aria-labelledby="checkout-address-heading">
          <div className="checkout-address-header">
            <h1 className="checkout-address-title" id="checkout-address-heading">
              <FiMapPin aria-hidden="true" /> ADDRESS DETAILS
            </h1>
            <Link href="/address" className="checkout-change-address-btn">
              <FiEdit2 aria-hidden="true" /> Change
            </Link>
          </div>
          <div className="checkout-address-user">
            <FiUser className="checkout-address-user-icon" aria-hidden="true" />
            <span>{activeAddress.fullName}</span>
          </div>
          <div className="checkout-address-info">
            <p>
              {activeAddress.addressLine1}
              {activeAddress.addressLine2 && (
                <>
                  <br />
                  {activeAddress.addressLine2}
                </>
              )}
              {activeAddress.landmark && (
                <>
                  <br />
                  {activeAddress.landmark}
                </>
              )}
              <br />
              {activeAddress.city} - {activeAddress.postalCode},{" "}
              {activeAddress.state}, {activeAddress.country}
              <br />
              <span className="contact-info">
                <FiPhone className="contact-icon" aria-hidden="true" />
                {activeAddress.phoneNumber}
              </span>
            </p>
          </div>
        </section>

        <section className="checkout-summary-card" aria-labelledby="checkout-summary-heading">
          <h2 className="checkout-summary-header" id="checkout-summary-heading">
            ORDER SUMMARY
          </h2>
          <div className="summary-table">
            <div className="summary-row">
              <span className="summary-label">Items (excl. tax)</span>
              <span className="summary-value">₹{itemsPrice}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">GST</span>
              <span className="summary-value">₹{taxPrice}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Shipping</span>
              <span className="summary-value">
                {Number(shippingPrice) > 0 ? `₹${shippingPrice}` : "Free"}
              </span>
            </div>
            <div className="summary-row total">
              <span className="summary-label">Total</span>
              <span className="summary-value">₹{totalPrice}</span>
            </div>
          </div>
        </section>
      </div>

      <button
        type="button"
        className="checkout-placeorder-btn"
        onClick={() => void placeOrderHandler()}
        disabled={isCreatingOrder}
      >
        {isCreatingOrder ? "Placing order…" : "Place Order"}
      </button>

      <div className="checkout-mobile-bottom">
        <button
          type="button"
          className="cart-mobile-checkout"
          onClick={() => void placeOrderHandler()}
          disabled={isCreatingOrder}
        >
          {isCreatingOrder ? "Placing order…" : "Place Order"}
        </button>
      </div>
    </div>
  )
}

export default CheckoutPage
