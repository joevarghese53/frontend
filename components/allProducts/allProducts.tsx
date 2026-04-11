"use client"
import { useAllProductsQuery } from "../../redux/api/productApiSlice"
import ErrorCard from "../errorCard/errorCard"
import ProductCard from "../productCard/productCard"
import { ProductCardSkeleton } from "../productCard/productCardSkeleton/productCardSkeleton"
import "./allProducts.css"

const AllProducts = () => {
  const { data, isLoading, error, refetch } = useAllProductsQuery()

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
          onRetry={refetch}
        />
      </div>
    )
  }
  return (
    <div className="all-products">
      {data?.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  )
}

export default AllProducts
