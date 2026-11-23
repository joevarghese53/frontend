import Link from "next/link"
import { AlertTriangle, ArrowRight } from "lucide-react"

export default function TermsAndConditionsPage() {
  return (
    <div className="mx-auto min-h-svh max-w-375 px-5 pt-32 pb-20 sm:px-8 lg:px-12">
      <article className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-zinc-500">
            FLOW STATE · INDIA
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Terms and Conditions
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            These terms describe the basic conditions for using the Flow State
            website and placing an order.
          </p>
        </header>

        <div
          role="note"
          className="mb-8 flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm leading-6"
        >
          <AlertTriangle
            className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-400"
            aria-hidden="true"
          />
          <p>
            <strong>Draft for review.</strong> The minimum account age, detailed
            custom-design license, and final dispute/jurisdiction wording have
            not been confirmed. Review these terms with qualified counsel before
            treating them as final.
          </p>
        </div>

        <div className="space-y-5">
          <section className="rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">Using the website</h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              Please provide accurate information when creating an account or
              placing an order, and keep your account credentials secure. You
              are responsible for activity carried out through your account.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">Orders and payments</h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              Review your product and order details before submitting an order.
              Cash on delivery is currently unavailable; use a payment method
              shown at checkout. Products are made to order, and orders cannot
              be cancelled once placed.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">
              Returns, damage claims, and delivery
            </h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              Returns are not available for made-to-order products. If a product
              arrives damaged, contact us within 24 hours of delivery with
              proof; all claims require proof and are reviewed case by case.
              Delivery times vary by product and location.
            </p>
            <Link
              href="/policies"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
            >
              Read our customer policies
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>

          <section className="rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">
              Custom designs and intellectual property
            </h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              Only submit prompts, images, and designs that you created or are
              authorized to use. Do not request or provide content that
              infringes another person&apos;s copyright, trademark, or other
              rights. The detailed permissions needed to process and produce
              customer-submitted designs are still being finalized. This draft
              does not promise that automated checks will identify every
              potentially infringing design.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">Eligibility</h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              The minimum age for creating an account or placing an order has
              not yet been set and must be confirmed before these terms are
              finalized.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">Governing law and contact</h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              Flow State is based in India. These terms are intended to be read
              consistently with applicable laws in India; detailed governing law
              and dispute-resolution wording remains subject to review. For
              questions, please{" "}
              <Link
                href="/contactUs"
                className="font-medium text-foreground underline underline-offset-4"
              >
                contact us
              </Link>
              .
            </p>
            <Link
              href="/privacy-policy"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
            >
              Read our Privacy Policy
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </article>
    </div>
  )
}
