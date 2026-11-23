"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ErrorCard } from "@/components/errorCard/errorCard"
import ProductCard from "@/components/productCard/productCard"
import { ProductCardSkeleton } from "@/components/productCard/productCardSkeleton/productCardSkeleton"
import { Input } from "@/components/ui/input"
import { useFetchCategoriesQuery } from "@/redux/api/categoryApiSlice"
import { useAllProductsQuery } from "@/redux/api/productApiSlice"
import type { ProductType } from "@/types/productType"

type SortOrder = "featured" | "price-low" | "price-high" | "rating"

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

function matchesSearch(product: ProductType, search: string) {
  const searchableText =
    `${product.name} ${product.description} ${product.category.name}`.toLowerCase()
  return searchableText.includes(search.toLowerCase())
}

export function ProductsPage({
  initialCategoryId,
}: {
  initialCategoryId: string
}) {
  const router = useRouter()
  const { data: products, isLoading, error, refetch } = useAllProductsQuery()
  const { data: categories } = useFetchCategoriesQuery()
  const [categoryId, setCategoryId] = useState(initialCategoryId)
  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured")

  const updateCategory = (nextCategoryId: string) => {
    setCategoryId(nextCategoryId)
    const url = new URL(window.location.href)
    if (nextCategoryId) {
      url.searchParams.set("category", nextCategoryId)
    } else {
      url.searchParams.delete("category")
    }
    router.replace(`${url.pathname}${url.search}`, { scroll: false })
  }

  const filteredProducts = (products ?? [])
    .filter(
      (product) =>
        (!categoryId || product.category._id === categoryId) &&
        matchesSearch(product, search.trim())
    )
    .sort((first, second) => {
      if (sortOrder === "price-low") return first.price - second.price
      if (sortOrder === "price-high") return second.price - first.price
      if (sortOrder === "rating") return second.rating - first.rating
      return 0
    })

  const selectedCategoryName =
    categories?.find((category) => category._id === categoryId)?.name ??
    products?.find((product) => product.category._id === categoryId)?.category
      .name

  return (
    <div className="mx-auto mt-[120px] min-h-svh max-w-7xl px-5 pt-12 pb-20 sm:px-8 lg:px-12">

      <section
        aria-label="Product filters"
        className="mb-8 grid gap-4 rounded-2xl border border-zinc-200 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_minmax(180px,0.7fr)_minmax(170px,0.6fr)] dark:border-zinc-800"
      >
        <div className="space-y-2">
          <label htmlFor="product-search" className="text-sm font-medium">
            Search
          </label>
          <Input
            id="product-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="h-10 rounded-xl px-3"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="product-category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="product-category"
            value={categoryId}
            onChange={(event) => updateCategory(event.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">All categories</option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="product-sort" className="text-sm font-medium">
            Sort by
          </label>
          <select
            id="product-sort"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </section>

      {isLoading ? (
        <div
          className="flex flex-wrap justify-center gap-8"
          role="status"
          aria-label="Loading products"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <ErrorCard
          title="We couldn't load products"
          message={getErrorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : filteredProducts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
          No products match these filters. Try changing your search or category.
        </p>
      ) : (
        <>
          <p className="mb-5 text-sm text-zinc-500" aria-live="polite">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
