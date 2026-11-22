
"use client"

import Link from "next/link"
import type { Ref } from "react"
import { FiArrowRight } from "react-icons/fi"
import "./page.css"

interface OrderSummaryProps {
  itemsPrice: number | string
  taxPrice: number | string
  shippingPrice: number | string
  totalPrice: number | string
  checkoutUrl?: string
  checkoutLabel?: string
  summaryRef?: Ref<HTMLElement>
}

const OrderSummary = ({
  itemsPrice,
  taxPrice,
  shippingPrice,
  totalPrice,
  checkoutUrl = "/address",
  checkoutLabel = "Proceed to Checkout",
  summaryRef,
}: OrderSummaryProps) => {
  return (
    <section
      className="order-summary-section"
      aria-labelledby="order-summary-heading"
      ref={summaryRef}
    >
      <div className="order-summary-card">
        <h3 className="order-summary-title" id="order-summary-heading">
          ORDER SUMMARY
        </h3>

        <div className="order-summary-details">
          <div className="order-summary-row">
            <span>Subtotal</span>
            <span>₹{itemsPrice}</span>
          </div>

          <div className="order-summary-row">
            <span>GST</span>
            <span>₹{taxPrice}</span>
          </div>

          <div className="order-summary-row">
            <span>Shipping</span>
            <span>
              {Number(shippingPrice) > 0
                ? `₹${shippingPrice}`
                : "Free"}
            </span>
          </div>

          <div className="order-summary-divider" />

          <div className="order-summary-row order-summary-total">
            <span>Total Amount</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        <Link href={checkoutUrl} className="order-summary-checkout-button">
          {checkoutLabel}
          <FiArrowRight aria-hidden="true" />
        </Link>

        <div className="order-summary-note">
          <p>Free shipping on orders above ₹1000</p>
        </div>
      </div>
    </section>
  )
}

export default OrderSummary
