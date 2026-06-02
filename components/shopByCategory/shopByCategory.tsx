"use client"
import { useFetchCategoriesQuery } from "@/redux/api/categoryApiSlice"
import { ErrorCard } from "../errorCard/errorCard"
import { ProductCardSkeleton } from "../productCard/productCardSkeleton/productCardSkeleton"
import CategoryCard from "./categoryCard/categoryCard"
import { CategoryType } from "@/types/categoryType"

const ShopByCategory = () => {
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useFetchCategoriesQuery()

  const imageMap: Record<string, string> = {
    "Regular T-Shirts": "/images/categories/regular-tshirts.jpg",
    "Oversized T-Shirts": "/images/categories/oversized-tshirts.jpg",
    "Oversized Hoodies": "/images/categories/oversized-hoodies.jpg",
  }

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 md:grid-cols-3 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <ErrorCard
            title="Failed to load!"
            message="Please check again later."
            onRetry={refetch}
          />
        </div>
      </section>
    )
  }

  return (
    <div className="mt-10 mb-20">
      <h2 className="text-center text-2xl font-medium text-black/60">
        Shop By Category
      </h2>

      <div className="m-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category: CategoryType) => (
          <CategoryCard
            key={category._id}
            title={category.name}
            image={imageMap[category.name]}
          />
        ))}
      </div>
    </div>
  )
}

export default ShopByCategory
