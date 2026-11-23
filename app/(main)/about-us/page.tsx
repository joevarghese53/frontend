import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export default function AboutUsPage() {
  return (
    <div className="mx-auto min-h-svh max-w-375 px-5 pt-32 pb-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.25em] text-zinc-500">
            <Sparkles size={16} aria-hidden="true" />
            ABOUT FLOW STATE
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Wear your point of view.
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Flow State is an India-based apparel brand for people who want what
            they wear to feel like their own. We bring ready-to-shop styles and
            custom design tools together in one place.
          </p>
        </header>

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">Made for your style</h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              Explore our apparel collections or use the custom design
              experience to bring your own idea to life. Our products are made
              to order.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">A little more personal</h2>
            <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
              We believe clothing can be more than something you put on. It can
              be a way to show what you care about, what inspires you, and what
              makes you, you.
            </p>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-80 dark:bg-white dark:text-black"
          >
            Explore products
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/customs"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            Create a custom design
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}
