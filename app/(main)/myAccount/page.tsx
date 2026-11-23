"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Boxes,
  Heart,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Tags,
  UserRound,
  Users,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorCard } from "@/components/errorCard/errorCard"
import { isAdminUser } from "@/components/admin/adminUtils"
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/api/usersApiSlice"
import { setCredentials } from "@/redux/state/auth/authSlice"
import type { AppDispatch, RootState } from "@/redux/store"

type AccountProfile = {
  name?: string
  email?: string
  isAdmin?: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function readProfile(value: unknown): AccountProfile {
  let candidate = value
  if (isRecord(candidate)) {
    candidate = candidate.user ?? candidate.profile ?? candidate
  }

  if (!isRecord(candidate)) return {}

  return {
    ...(typeof candidate.username === "string"
      ? { name: candidate.username }
      : typeof candidate.name === "string"
        ? { name: candidate.name }
        : {}),
    ...(typeof candidate.email === "string" ? { email: candidate.email } : {}),
    ...(typeof candidate.isAdmin === "boolean"
      ? { isAdmin: candidate.isAdmin }
      : {}),
  }
}

function getErrorMessage(error: unknown): string {
  if (!isRecord(error)) return "Please try again in a moment."

  if (isRecord(error.data) && typeof error.data.message === "string") {
    return error.data.message
  }
  if (typeof error.message === "string") return error.message
  if (typeof error.error === "string") return error.error
  return "Please try again in a moment."
}

const accountLinks = [
  {
    title: "My orders",
    description: "Track deliveries and review past purchases.",
    href: "/myOrders",
    icon: Package,
  },
  {
    title: "Saved addresses",
    description: "Manage the addresses used for your deliveries.",
    href: "/address",
    icon: MapPin,
  },
  {
    title: "My wishlist",
    description: "Pick up where you left off with saved pieces.",
    href: "/wishlist",
    icon: Heart,
  },
  {
    title: "My cart",
    description: "Review items you’re thinking about.",
    href: "/cart",
    icon: ShoppingBag,
  },
]

const adminLinks = [
  {
    title: "Manage users",
    description: "Review registered users and manage accounts.",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Manage orders",
    description: "Review orders and update fulfillment progress.",
    href: "/admin/orders",
    icon: Package,
  },
  {
    title: "Manage products",
    description: "Review, edit, and remove products from the catalog.",
    href: "/admin/products",
    icon: Boxes,
  },
  {
    title: "Manage categories",
    description: "Create, edit, and remove product categories.",
    href: "/admin/categories",
    icon: Tags,
  },
]

function AdminDashboard({ name }: { name: string }) {
  return (
    <div className="mx-auto min-h-svh max-w-375 px-5 pt-32 pb-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-9">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.25em] text-zinc-500">
            <ShieldCheck size={16} aria-hidden="true" />
            ADMINISTRATION
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Admin dashboard
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            Welcome{name ? `, ${name}` : ""}. Choose an area to manage.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {adminLinks.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-3xl border border-zinc-200 p-6 transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="flex items-center justify-between gap-3">
                <span className="text-lg font-semibold">{title}</span>
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1"
                />
              </span>
              <span className="mt-2 block text-sm leading-6 text-zinc-500">
                {description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProfileForm({
  name,
  email,
  userInfo,
}: {
  name: string
  email: string
  userInfo: NonNullable<RootState["auth"]["userInfo"]>
}) {
  const dispatch = useDispatch<AppDispatch>()
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation()
  const [form, setForm] = useState({ name })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const updatedName = form.name.trim()

    try {
      const response: unknown = await updateProfile({
        username: updatedName,
      }).unwrap()
      const updatedProfile = readProfile(response)
      dispatch(
        setCredentials({
          ...userInfo,
          ...updatedProfile,
          name: updatedProfile.name ?? updatedName,
          username: updatedName,
        })
      )
      toast.success("Your name has been updated.")
    } catch (saveError) {
      toast.error(
        `Could not update your details: ${getErrorMessage(saveError)}`
      )
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="account-name" className="text-sm font-medium">
          Full name
        </label>
        <Input
          id="account-name"
          autoComplete="name"
          required
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          className="h-11 rounded-xl px-3"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="account-email" className="text-sm font-medium">
          Email address
        </label>
        <Input
          id="account-email"
          type="email"
          autoComplete="email"
          value={email}
          readOnly
          aria-describedby="account-email-note"
          className="h-11 rounded-xl px-3 read-only:cursor-not-allowed read-only:bg-muted/50"
        />
        <p id="account-email-note" className="text-xs text-zinc-500">
          Email addresses can&apos;t be changed.
        </p>
      </div>
      <Button
        type="submit"
        disabled={isSaving || form.name.trim() === name}
        className="rounded-xl px-5"
      >
        {isSaving ? "Saving…" : "Save changes"}
      </Button>
    </form>
  )
}

export default function MyAccountPage() {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo)
  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useGetProfileQuery(undefined, { skip: !userInfo })
  const savedProfile = readProfile(userInfo)
  const fetchedProfile = readProfile(profileData)
  const name = fetchedProfile.name ?? savedProfile.name ?? ""
  const email = fetchedProfile.email ?? savedProfile.email ?? ""
  const isAdmin =
    fetchedProfile.isAdmin === true ||
    savedProfile.isAdmin === true ||
    isAdminUser(userInfo)

  if (!userInfo) {
    return (
      <div className="mx-auto flex min-h-[70svh] max-w-375 items-center justify-center px-5 pt-28 pb-16">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
            <UserRound size={26} aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold">
            Your account, all in one place
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Sign in to manage your details, orders, and saved items.
          </p>
          <Button asChild className="mt-6 rounded-xl">
            <Link href="/login">
              Sign in
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isAdmin) {
    return <AdminDashboard name={name} />
  }

  if (isLoading) {
    return (
      <div className="mx-auto min-h-svh max-w-375 px-5 pt-32 pb-20 sm:px-8 lg:px-12">
        <div
          className="mx-auto max-w-6xl space-y-5"
          role="status"
          aria-label="Loading account"
        >
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-svh max-w-375 px-5 pt-32 pb-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-9">
          <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-zinc-500">
            YOUR ACCOUNT
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            My account
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            Manage your personal details and keep everything in one place.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
          <section
            aria-labelledby="account-details-heading"
            className="rounded-3xl border border-zinc-200 p-5 sm:p-8 dark:border-zinc-800"
          >
            <div className="mb-6">
              <h2
                id="account-details-heading"
                className="text-xl font-semibold"
              >
                Personal details
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Keep your contact information up to date.
              </p>
            </div>

            {isLoading ? (
              <div
                className="space-y-5"
                role="status"
                aria-label="Loading profile"
              >
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
            ) : error ? (
              <ErrorCard
                title="We couldn't load your profile"
                message={getErrorMessage(error)}
                onRetry={() => {
                  void refetch()
                }}
              />
            ) : (
              <ProfileForm
                key={`${name}\u0000${email}`}
                name={name}
                email={email}
                userInfo={userInfo}
              />
            )}
          </section>

          <section aria-labelledby="account-shortcuts-heading">
            <h2
              id="account-shortcuts-heading"
              className="mb-4 text-xl font-semibold"
            >
              Account shortcuts
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {accountLinks.map(({ title, description, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-4 rounded-2xl border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-ring dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{title}</span>
                    <span className="mt-1 block text-sm leading-5 text-zinc-500">
                      {description}
                    </span>
                  </span>
                  <ArrowRight
                    size={17}
                    aria-hidden="true"
                    className="shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
