"use client"
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice"
import ErrorCard from "../errorCard/errorCard"
import ProductCard from "../productCard/productCard"
import { ProductCardSkeleton } from "../productCard/productCardSkeleton/productCardSkeleton"
import "./bestRated.css"

const BestRated = () => {
  const { data, isLoading, error, refetch } = useGetTopProductsQuery()

  if (isLoading) {
    return (
      <div className="best-rated">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="best-rated">
        <ErrorCard
          title="Failed to load!"
          message="Please check again later."
          onRetry={refetch}
        />
      </div>
    )
  }

  return (
    <div className="mt-15">
      <h1 className="text-center text-2xl font-medium text-black/60">
        Best Rated
      </h1>
      <div className="best-rated">
        {data?.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>
    </div>
  )
}

export default BestRated
