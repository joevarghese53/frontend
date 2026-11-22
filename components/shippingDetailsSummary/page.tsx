"use client"

import { FiMail, FiMapPin, FiPhone, FiUser } from "react-icons/fi"
import type { OrderShippingAddress } from "@/types/orderType"
import "./page.css"

type ShippingDetailsSummaryProps = {
  user: {
    username: string
    email: string
  }
  shippingAddress: OrderShippingAddress
}

const ShippingDetailsSummary = ({
  user,
  shippingAddress,
}: ShippingDetailsSummaryProps) => {
  return (
    <section
      className="shipping-summary"
      aria-labelledby="shipping-summary-heading"
    >
      <div className="shipping-summary-header">
        <span className="shipping-summary-header-icon" aria-hidden="true">
          <FiMapPin />
        </span>
        <div>
          <span className="shipping-summary-eyebrow">Delivery</span>
          <h2 id="shipping-summary-heading">Shipping Details</h2>
        </div>
      </div>
      <dl className="shipping-summary-rows">
        <div className="shipping-summary-row">
          <dt className="shipping-summary-left">
            <span className="shipping-summary-row-icon" aria-hidden="true">
              <FiUser />
            </span>
            <span>Name</span>
          </dt>
          <dd className="shipping-summary-value">{user.username}</dd>
        </div>
        <div className="shipping-summary-row">
          <dt className="shipping-summary-left">
            <span className="shipping-summary-row-icon" aria-hidden="true">
              <FiMail />
            </span>
            <span>Email</span>
          </dt>
          <dd className="shipping-summary-value">{user.email}</dd>
        </div>
        <div className="shipping-summary-row shipping-summary-address-row">
          <dt className="shipping-summary-left">
            <span className="shipping-summary-row-icon" aria-hidden="true">
              <FiMapPin />
            </span>
            <span>Address</span>
          </dt>
          <dd className="shipping-summary-value">
            <strong>{shippingAddress.fullName}</strong>
            <span>{shippingAddress.addressLine1}</span>
            {shippingAddress.addressLine2 && (
              <span>{shippingAddress.addressLine2}</span>
            )}
            {shippingAddress.landmark && (
              <span>{shippingAddress.landmark}</span>
            )}
            <span>
              {shippingAddress.city} - {shippingAddress.postalCode},{" "}
              {shippingAddress.state}, {shippingAddress.country}
            </span>
          </dd>
        </div>
        <div className="shipping-summary-row">
          <dt className="shipping-summary-left">
            <span className="shipping-summary-row-icon" aria-hidden="true">
              <FiPhone />
            </span>
            <span>Contact</span>
          </dt>
          <dd className="shipping-summary-value">
            {shippingAddress.phoneNumber}
          </dd>
        </div>
      </dl>
    </section>
  )
}

export default ShippingDetailsSummary
