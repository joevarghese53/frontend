import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"

const policies = [
  { id: "returns", label: "Returns" },
  { id: "damage-claims", label: "Damaged items and claims" },
  { id: "cancellations", label: "Cancellations" },
  { id: "shipping", label: "Shipping and delivery" },
  { id: "payments", label: "Payments and COD" },
]

export default function PoliciesPage() {
  return (
    <div className="mx-auto min-h-svh max-w-375 px-5 pt-32 pb-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.25em] text-zinc-500">
            <ShieldCheck size={16} aria-hidden="true" />
            CUSTOMER POLICIES
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Policies
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Please review our order, delivery, and payment policies before
            placing an order.
          </p>
        </header>

        <nav
          aria-label="Policies on this page"
          className="mb-8 flex flex-wrap gap-2"
        >
          {policies.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="space-y-5">
          <section
            id="returns"
            className="scroll-mt-28 rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800"
          >
            <h2 className="text-xl font-semibold">Returns</h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              Our products are made to order, so returns are not available.
              Please review your order details carefully before completing your
              purchase. If your product arrives damaged, see our{" "}
              <a
                href="#damage-claims"
                className="font-medium text-foreground underline underline-offset-4"
              >
                damaged items and claims policy
              </a>
              .
            </p>
          </section>

          <section
            id="damage-claims"
            className="scroll-mt-28 rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800"
          >
            <h2 className="text-xl font-semibold">Damaged items and claims</h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              If your product arrives damaged, contact us within 24 hours of
              delivery and include your order details and proof of the damage.
              Proof is required for all claims. We review verified damage claims
              on a case-by-case basis.
            </p>
            <Link
              href="/contactUs"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
            >
              Contact us
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>

          <section
            id="cancellations"
            className="scroll-mt-28 rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800"
          >
            <h2 className="text-xl font-semibold">Cancellations</h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              Orders cannot be cancelled once they have been placed. Please
              check your product, size, and order details before confirming your
              purchase.
            </p>
          </section>

          <section
            id="shipping"
            className="scroll-mt-28 rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800"
          >
            <h2 className="text-xl font-semibold">Shipping and delivery</h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              Delivery times vary by product and location, so we do not publish
              a single delivery estimate here. Check your order details for any
              available updates, or{" "}
              <Link
                href="/contactUs"
                className="font-medium text-foreground underline underline-offset-4"
              >
                contact us
              </Link>{" "}
              if you need help with an order.
            </p>
          </section>

          <section
            id="payments"
            className="scroll-mt-28 rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800"
          >
            <h2 className="text-xl font-semibold">
              Payments and cash on delivery
            </h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              Cash on delivery (COD) is currently unavailable. Please use one of
              the payment methods shown during checkout.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
