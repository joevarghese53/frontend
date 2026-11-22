"use client"

import { useId, useState } from "react"
import {
  FiChevronDown,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi"
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
  const [isExpanded, setIsExpanded] = useState(false)
  const detailsId = useId()

  return (
    <section
      className="shipping-summary"
      aria-labelledby="shipping-summary-heading"
    >
      <button
        type="button"
        className="shipping-summary-toggle"
        aria-expanded={isExpanded}
        aria-controls={detailsId}
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        <span className="shipping-summary-header-icon" aria-hidden="true">
          <FiMapPin />
        </span>
        <span className="shipping-summary-heading">
          <span className="shipping-summary-eyebrow">Delivery</span>
          <span
            id="shipping-summary-heading"
            className="shipping-summary-title"
            role="heading"
            aria-level={2}
          >
            Shipping Details
          </span>
        </span>
        {!isExpanded && (
          <span className="shipping-summary-preview">
            <strong>{shippingAddress.fullName}</strong>
            <span>
              {shippingAddress.addressLine1}, {shippingAddress.city} -{" "}
              {shippingAddress.postalCode}
            </span>
          </span>
        )}
        <FiChevronDown
          className={`shipping-summary-chevron${isExpanded ? " is-expanded" : ""}`}
          aria-hidden="true"
        />
      </button>
      <dl
        id={detailsId}
        className="shipping-summary-rows"
        hidden={!isExpanded}
      >
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
