"use client"

import Image from "next/image"
import { Heart, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductType } from "@/types/productType"
import { CustomProductType } from "@/types/cProductType"
import Link from "next/link"

export default function ProductCard({
  product,
}: {
  product: ProductType | CustomProductType;
}) {

  const isCustomProduct = "userId" in product;

  const image =
    product.frontImage ||
    product.backImage ||
    "/placeholder-product.png";

  const productUrl = isCustomProduct
    ? `/cproduct/${product._id}`
    : `/product/${product._id}`;

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
          <button className="absolute top-3 right-3 cursor-pointer rounded-full bg-white p-2 shadow-sm transition hover:scale-110">
            <Heart className="h-4 w-4" />
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

        {/* Add to Cart */}
        <Button
          variant="outline"
          className="mt-3 flex w-full cursor-pointer items-center gap-2"
        >
          <Plus size={16} />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}
