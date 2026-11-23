import Link from "next/link"
import { ArrowRight, BriefcaseBusiness } from "lucide-react"

export default function HiringPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-375 items-center px-5 pt-32 pb-20 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-zinc-200 p-7 sm:p-10 dark:border-zinc-800">
        <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.25em] text-zinc-500">
          <BriefcaseBusiness size={16} aria-hidden="true" />
          CAREERS AT FLOW STATE
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Help us make something different.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Interested in working with Flow State? Tell us a little about
          yourself, the kind of work you’re interested in, and share a link to
          your portfolio or profile. We’ll be glad to hear from you.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
          In the contact form, choose “Something else” and mention “Hiring” in
          your message.
        </p>
        <Link
          href="/contactUs"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-80 dark:bg-white dark:text-black"
        >
          Get in touch
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
