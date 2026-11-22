"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { FiMail, FiMapPin, FiPhone, FiUser } from "react-icons/fi"
import CheckoutSteps from "@/components/checkoutSteps/checkoutSteps"
import { ErrorCard } from "@/components/errorCard/errorCard"
import {
  useGetOrderDetailsQuery,
  usePayForOrderMutation,
} from "@/redux/api/orderApiSlice"
import { useCheckPaymentStatusMutation } from "@/redux/api/paymentApiSlice"
import CartItems from "@/components/cartItems/page"
import "./page.css"

declare global {
  interface Window {
    PhonePeCheckout?: {
      transact: (options: {
        tokenUrl: string
        type: "IFRAME"
        callback: (result: "CONCLUDED" | "USER_CANCEL" | string) => void
      }) => void
    }
  }
}

const MAX_ATTEMPTS = 12
const POLL_INTERVAL = 5000

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

const PaymentPage = () => {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [isPolling, setIsPolling] = useState(false)
  const [pollStatus, setPollStatus] = useState("INITIATED")
  const [pollAttempts, setPollAttempts] = useState(0)
  const [isPaying, setIsPaying] = useState(false)
  const pollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollingActiveRef = useRef(false)

  const [initiatePayment] = usePayForOrderMutation()
  const [checkPaymentStatus] = useCheckPaymentStatusMutation()
  const {
    data: orderDetails,
    isLoading,
    error,
    refetch: refetchOrder,
  } = useGetOrderDetailsQuery(orderId ?? "", {
    skip: !orderId,
  })

  const stopPolling = () => {
    pollingActiveRef.current = false
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current)
      pollingTimeoutRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      pollingActiveRef.current = false
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current)
      }
    }
  }, [])

  const pollPaymentStatus = (merchantOrderId: string) => {
    stopPolling()
    pollingActiveRef.current = true
    setIsPolling(true)
    setPollStatus("INITIATED")
    setPollAttempts(0)
    let attempts = 0

    const poll = async () => {
      if (!pollingActiveRef.current) return
      attempts += 1
      setPollAttempts(attempts)

      try {
        const response = await checkPaymentStatus(merchantOrderId).unwrap()
        const status = (response.status ?? "").toUpperCase()
        setPollStatus(status)

        if (
          response.isPaid ||
          ["SUCCESS", "COMPLETED", "PAID", "PAYMENT_SUCCESS"].includes(status)
        ) {
          stopPolling()
          setIsPolling(false)
          await refetchOrder()
          toast.success("Payment successful")
          return
        }

        if (
          ["FAILED", "FAILURE", "CANCELLED", "CANCELED"].includes(status)
        ) {
          stopPolling()
          setIsPolling(false)
          toast.error("Payment failed. Please try again.")
          return
        }
      } catch (pollError) {
        console.error("Payment status check failed:", pollError)
      }

      if (attempts >= MAX_ATTEMPTS) {
        stopPolling()
        setPollStatus("PROCESSING")
        return
      }

      pollingTimeoutRef.current = setTimeout(() => void poll(), POLL_INTERVAL)
    }

    void poll()
  }

  const handlePayment = async () => {
    if (!orderDetails || isPaying || orderDetails.isPaid) return
    const phonePeCheckout = window.PhonePeCheckout
    if (!phonePeCheckout) {
      toast.error("Payment system is still loading. Please try again.")
      return
    }

    setIsPaying(true)
    try {
      const initRes = await initiatePayment({
        orderId: orderDetails._id,
      }).unwrap()

      if (
        !initRes?.success ||
        !initRes.redirectUrl ||
        !initRes.merchantOrderId
      ) {
        throw new Error("Payment initiation returned an incomplete response.")
      }

      phonePeCheckout.transact({
        tokenUrl: initRes.redirectUrl,
        type: "IFRAME",
        callback: (result) => {
          if (result === "USER_CANCEL") {
            toast.info("Payment cancelled")
            return
          }
          if (result === "CONCLUDED") {
            pollPaymentStatus(initRes.merchantOrderId)
          }
        },
      })
    } catch (paymentError) {
      console.error("Payment initiation failed:", paymentError)
      toast.error(getErrorMessage(paymentError))
    } finally {
      setIsPaying(false)
    }
  }

  if (!orderId) {
    return (
      <div className="payment-page-main-container">
        <ErrorCard
          title="Missing order"
          message="No order was specified for payment."
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="payment-loading-container" role="status" aria-live="polite">
        <div className="payment-loading-spinner" />
        <p>Loading payment page…</p>
      </div>
    )
  }

  if (error || !orderDetails) {
    return (
      <div className="payment-page-main-container">
        <ErrorCard
          title="Could not load payment details"
          message={error ? getErrorMessage(error) : "This order is unavailable."}
          onRetry={() => void refetchOrder()}
        />
      </div>
    )
  }

  return (
    <div className="payment-page-main-container">
      <Script
        src="https://mercury.phonepe.com/web/bundle/checkout.js"
        strategy="afterInteractive"
        onError={() => toast.error("Could not load the payment system.")}
      />
      <CheckoutSteps currentStep="payment" />

      {orderDetails.isPaid && (
        <div className="payment-paid-banner" role="status">
          This order has already been paid.
        </div>
      )}

      <div className="payment-page-bottom-container">
        {orderDetails.orderItems.length === 0 ? (
          <div className="payment-items-empty">This order has no items.</div>
        ) : (
          <CartItems variant="payment" items={orderDetails.orderItems} />
        )}

        <aside className="payment-page-right-container" aria-label="Payment summary">
          <div className="payment-page-summary">
            <div className="shipping-summary">
              <div className="shipping-summary-header">
                <FiMapPin className="shipping-summary-icon" aria-hidden="true" />
                <span>Shipping Details</span>
              </div>
              <div className="shipping-summary-rows">
                <div className="shipping-summary-row">
                  <div className="shipping-summary-left">
                    <FiUser aria-hidden="true" /> <span>Name:</span>
                  </div>
                  <div className="shipping-summary-value">
                    {orderDetails.user.username}
                  </div>
                </div>
                <div className="shipping-summary-row">
                  <div className="shipping-summary-left">
                    <FiMail aria-hidden="true" /> <span>Email:</span>
                  </div>
                  <div className="shipping-summary-value">
                    {orderDetails.user.email}
                  </div>
                </div>
                <div className="shipping-summary-row">
                  <div className="shipping-summary-left">
                    <FiMapPin aria-hidden="true" /> <span>Address:</span>
                  </div>
                  <div className="shipping-summary-value">
                    {orderDetails.shippingAddress.fullName}, <br />
                    {orderDetails.shippingAddress.addressLine1}, <br />
                    {orderDetails.shippingAddress.addressLine2 && (
                      <>
                        {orderDetails.shippingAddress.addressLine2}, <br />
                      </>
                    )}
                    {orderDetails.shippingAddress.landmark && (
                      <>
                        {orderDetails.shippingAddress.landmark}, <br />
                      </>
                    )}
                    {orderDetails.shippingAddress.city} -{" "}
                    {orderDetails.shippingAddress.postalCode},{" "}
                    {orderDetails.shippingAddress.state},{" "}
                    {orderDetails.shippingAddress.country}
                  </div>
                </div>
                <div className="shipping-summary-row">
                  <div className="shipping-summary-left">
                    <FiPhone aria-hidden="true" /> <span>Contact:</span>
                  </div>
                  <div className="shipping-summary-value">
                    {orderDetails.shippingAddress.phoneNumber}
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-summary-card">
              <div className="payment-summary-header">Order Summary</div>
              <div className="summary-table">
                <div className="summary-row">
                  <span className="summary-label">Cart Total (Excl. of all taxes)</span>
                  <span className="summary-value">₹{orderDetails.itemsPrice}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">GST</span>
                  <span className="summary-value">₹{orderDetails.taxPrice}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Shipping Charges</span>
                  <span className="summary-value">
                    {Number(orderDetails.shippingPrice) > 0
                      ? `₹${orderDetails.shippingPrice}`
                      : "Free"}
                  </span>
                </div>
                <div className="summary-row total">
                  <span className="summary-label">Total Amount</span>
                  <span className="summary-value">₹{orderDetails.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="pay-now-button-desktop"
            onClick={() => void handlePayment()}
            disabled={isPaying || orderDetails.isPaid}
          >
            {orderDetails.isPaid
              ? "Paid"
              : isPaying
                ? "Opening payment…"
                : "Pay Now"}
          </button>
        </aside>
      </div>

      <div className="payment-mobile-bottom">
        <button
          type="button"
          className="payment-mobile-checkout"
          onClick={() => void handlePayment()}
          disabled={isPaying || orderDetails.isPaid}
        >
          {orderDetails.isPaid
            ? "Paid"
            : isPaying
              ? "Opening…"
              : "Pay Now"}
        </button>
      </div>

      {isPolling && (
        <div
          className="payment-loading-screen-overlay"
          role="dialog"
          aria-modal="true"
          aria-live="polite"
        >
          <div className="payment-loading-box">
            {pollStatus !== "PROCESSING" && (
              <div className="payment-status-spinner" />
            )}
            <h2>
              {pollStatus === "PROCESSING"
                ? "Payment confirmation is taking longer"
                : "Confirming payment…"}
            </h2>
            <p>
              This may take a few seconds. Do not close or refresh this page.
            </p>
            {pollAttempts >= 6 && (
              <p className="payment-loading-hint">Taking longer than usual.</p>
            )}
            {(pollStatus === "PROCESSING" ||
              pollAttempts >= MAX_ATTEMPTS) && (
              <button type="button" onClick={() => setIsPolling(false)}>
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentPage
