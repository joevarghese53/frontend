"use client"

import Image from "next/image"
import { Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ProductType } from "@/types/productType"
import { CustomProductType } from "@/types/cProductType"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useCheckItemInWishlistQuery
} from "@/redux/api/wishlistApiSlice"


export default function ProductCard({
  product,
}: {
  product: ProductType | CustomProductType;
}) {

  const router = useRouter()
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const productId = "userId" in product ? product._id : product._id;
  const isCustomProduct = "userId" in product;
  const [addToWishlist] = useAddToWishlistMutation()
  const [removeFromWishlist] = useRemoveFromWishlistMutation()
  const { data: itemExistCheck } = useCheckItemInWishlistQuery(productId, {
    skip: !userInfo || !productId,
  })
  const isInWishlist = Boolean(itemExistCheck?.exists)


  const image =
    product.frontImage ||
    product.backImage ||
    "/placeholder-product.png";

  const productUrl = isCustomProduct
    ? `/cproduct/${product._id}`
    : `/product/${product._id}`;

  const handleWishlistToggle = async () => {
    if (!userInfo) {
      toast.info("Please login to continue.")
      router.push("/login")
      return
    }

    if (!productId) {
      return
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(productId).unwrap()
        toast.success("Removed from wishlist.")
      } else {
        await addToWishlist({ productId }).unwrap()
        toast.success("Added to wishlist.")
      }
    } catch (error) {
      toast.error(`Error: ${error}`)
    }
  }

  return (
    <Card className="w-70 border-none">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative w-full overflow-hidden rounded-xl bg-muted cursor-pointer">

          <Link href={productUrl}>
            <Image
              src={image}
              alt={product.name}
              width={300}
              height={300}
              className="h-auto w-full object-cover"
            />
          </Link>

          {/* Wishlist */}
          
          <button
            type="button"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isInWishlist}
            className="absolute top-3 right-3 cursor-pointer rounded-full bg-white p-2 shadow-sm transition hover:scale-110"
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? "fill-black text-black" : ""}`} />
          </button>
        </div>
        {/* Product Info */}
        <div className="mt-3 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold">{product.name}</h3>
            <p className="text-xs text-muted-foreground">
              {product.category.name}
            </p>
          </div>

          <span className="font-semibold">Rs.{product.price.toFixed(0)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
