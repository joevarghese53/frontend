
"use client"

import "./checkoutSteps.css"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface CheckoutStepsProps {
  currentStep: "cart" | "address" | "payment"
}

const steps = [
  { label: "MY CART", value: "cart" },
  { label: "ADDRESS", value: "address" },
  { label: "PAYMENT", value: "payment" },
] as const

const CheckoutSteps = ({ currentStep }: CheckoutStepsProps) => {
  const searchParams = useSearchParams()
  const paymentQuery = searchParams.toString()
  const currentIndex = steps.findIndex(
    (step) => step.value === currentStep
  )

  return (
    <div className="checkout-steps">
      {steps.map((step, index) => (
        <div
          key={step.value}
          className={`checkout-step ${
            index < currentIndex
              ? "completed"
              : index === currentIndex
                ? "active"
                : ""
          }`}
        >
          {index <= currentIndex ? (
            <Link
              href={
                step.value === "cart"
                  ? "/cart"
                  : step.value === "address"
                    ? "/address"
                    : `/payment${paymentQuery ? `?${paymentQuery}` : ""}`
              }
              className="checkout-step-label"
            >
              {step.label}
            </Link>
          ) : (
            <span className="checkout-step-label">{step.label}</span>
          )}

          {index !== steps.length - 1 && (
            <span className="checkout-step-divider">
              -------
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export default CheckoutSteps
