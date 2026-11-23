import Link from "next/link"
import { AlertTriangle, ArrowRight } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto min-h-svh max-w-375 px-5 pt-32 pb-20 sm:px-8 lg:px-12">
      <article className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-zinc-500">
            FLOW STATE · INDIA
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy policy
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            This notice explains what information you may provide when using
            Flow State and how it is used to support your account and orders.
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
            <strong>Draft for review.</strong> Cookie and analytics use, data
            retention periods, and some service-provider details have not yet
            been confirmed. Complete these details and obtain appropriate review
            before treating this notice as final.
          </p>
        </div>

        <div className="space-y-5">
          <section className="rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">
              Information you may provide
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-zinc-600 dark:text-zinc-400">
              <li>Account information, such as your name and email address.</li>
              <li>
                Order and delivery information, such as recipient, address, and
                contact details.
              </li>
              <li>
                Messages and contact details you submit when contacting customer
                support.
              </li>
              <li>
                Prompts or other information you choose to provide when using
                custom design features.
              </li>
            </ul>
          </section>

          <section className="rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">How information is used</h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              Information may be used to create and manage your account, process
              and deliver orders, support custom product requests, respond to
              questions, and maintain the operation and security of the service.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">
              Sharing with service providers
            </h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              To fulfill orders, relevant order and delivery information may be
              shared with print-on-demand production partners and delivery
              providers. The specific providers and any other processors used by
              the service should be confirmed and identified in this notice.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">
              Payments, cookies, and analytics
            </h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              Payment methods are shown during checkout. The payment
              processor(s), the information they receive, and whether the site
              uses analytics, advertising cookies, or other non-essential
              tracking have not yet been confirmed for this draft.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">
              Retention and your privacy requests
            </h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              Specific data retention periods and a process for privacy requests
              have not yet been confirmed. For now, you can contact us through
              our{" "}
              <Link
                href="/contactUs"
                className="font-medium text-foreground underline underline-offset-4"
              >
                contact page
              </Link>{" "}
              or at{" "}
              <a
                href="mailto:support@flowstate.com"
                className="font-medium text-foreground underline underline-offset-4"
              >
                support@flowstate.com
              </a>
              .
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              Flow State is based in India. For privacy questions, please{" "}
              <Link
                href="/contactUs"
                className="font-medium text-foreground underline underline-offset-4"
              >
                contact us
              </Link>
              .
            </p>
            <Link
              href="/terms-and-conditions"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
            >
              Read our Terms and Conditions
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </div>
      </article>
    </div>
  )
}
