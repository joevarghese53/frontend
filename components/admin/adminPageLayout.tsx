import Link from "next/link"
import { ArrowLeft, Boxes, Package, Users } from "lucide-react"

const adminSections = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/products", label: "Products", icon: Boxes },
]

export function AdminPageLayout({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto min-h-svh max-w-375 px-5 pt-32 pb-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/myAccount"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Admin dashboard
        </Link>

        <header className="mb-7">
          <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-zinc-500">
            ADMINISTRATION
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-zinc-500">{description}</p>
        </header>

        <nav
          aria-label="Admin sections"
          className="mb-7 flex flex-wrap gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800"
        >
          {adminSections.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </div>
  )
}
