"use client"
import { useRefetchHome } from "@/redux/hooks/useRefetchHome"
import { useAllProductsQuery } from "../../redux/api/productApiSlice"
import { ErrorCard } from "../errorCard/errorCard"
import ProductCard from "../productCard/productCard"
import { ProductCardSkeleton } from "../productCard/productCardSkeleton/productCardSkeleton"
import "./allProducts.css"

const AllProducts = () => {
  const { data, isLoading, error } = useAllProductsQuery()
  const refetchHome = useRefetchHome()

  if (isLoading) {
    return (
      <div className="all-products">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="all-products">
        <ErrorCard
          title="Failed to load!"
          message="Please check again later."
          onRetry={refetchHome}
        />
      </div>
    )
  }
  return (
    <div className="all-products">
      {data?.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

export default AllProducts
