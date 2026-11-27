"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronDown, Plus, SlidersHorizontal } from "lucide-react"
import { ErrorCard } from "@/components/errorCard/errorCard"
import ProductCard from "@/components/productCard/productCard"
import { ProductCardSkeleton } from "@/components/productCard/productCardSkeleton/productCardSkeleton"
import { BackNavigation } from "@/components/navigation/backNavigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGetCProductsQuery } from "@/redux/api/cProductApiSlice"

type SortOrder = "newest" | "oldest" | "name"

function getErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null) {
    return "Please try again in a moment."
  }

  if (
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message
  }

  return "Please try again in a moment."
}

export default function CreationsPage() {
  const { data: creations, isLoading, error, refetch } =
    useGetCProductsQuery()
  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")

  const filteredCreations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const matches = (creations ?? []).filter((creation) =>
      `${creation.name} ${creation.category.name} ${creation.description}`
        .toLowerCase()
        .includes(normalizedSearch)
    )

    return [...matches].sort((first, second) => {
      if (sortOrder === "name") {
        return first.name.localeCompare(second.name)
      }

      const firstTime = new Date(first.createdAt).getTime()
      const secondTime = new Date(second.createdAt).getTime()
      if (sortOrder === "oldest") {
        return firstTime - secondTime
      }
      return secondTime - firstTime
    })
  }, [creations, search, sortOrder])

  return (
    <div className="mx-auto mt-24 min-h-svh max-w-7xl px-3 pt-8 pb-20 sm:mt-30 sm:px-8 sm:pt-12 lg:px-12">
      <BackNavigation fallbackHref="/customs" />

      <header className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            My Creations
          </h1>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            View and shop the custom products you have created.
          </p>
        </div>

        <Button asChild className="w-full rounded-xl sm:w-auto">
          <Link href="/customs">
            <Plus size={17} aria-hidden="true" />
            Create another
          </Link>
        </Button>
      </header>

      <details className="group mb-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal size={17} aria-hidden="true" />
            Filters
          </span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className="transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="grid gap-4 border-t border-zinc-200 p-4 sm:grid-cols-2 dark:border-zinc-800">
          <div className="space-y-2">
            <label htmlFor="creation-search" className="text-sm font-medium">
              Search
            </label>
            <Input
              id="creation-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search creations"
              className="h-10 rounded-xl px-3"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="creation-sort" className="text-sm font-medium">
              Sort by
            </label>
            <select
              id="creation-sort"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as SortOrder)
              }
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </details>

      {isLoading ? (
        <div
          className="grid grid-cols-2 justify-items-center gap-x-2 gap-y-8 sm:flex sm:flex-wrap sm:justify-center sm:gap-8"
          role="status"
          aria-label="Loading creations"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <ErrorCard
          title="We couldn't load your creations"
          message={getErrorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : filteredCreations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center dark:border-zinc-700">
          {creations?.length ? (
            <p className="text-sm text-zinc-500">
              No creations match "{search}". Try another search.
            </p>
          ) : (
            <>
              <p className="text-sm font-medium">No creations yet</p>
              <p className="mt-1 text-sm text-zinc-500">
                Generate your first design and it will appear here.
              </p>
              <Button asChild className="mt-5 rounded-xl">
                <Link href="/customs">Create a product</Link>
              </Button>
            </>
          )}
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm text-zinc-500" aria-live="polite">
            {filteredCreations.length}{" "}
            {filteredCreations.length === 1 ? "creation" : "creations"}
          </p>
          <div className="grid grid-cols-2 justify-items-center gap-x-2 gap-y-8 sm:flex sm:flex-wrap sm:justify-center sm:gap-8">
            {filteredCreations.map((creation) => (
              <ProductCard key={creation._id} product={creation} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
