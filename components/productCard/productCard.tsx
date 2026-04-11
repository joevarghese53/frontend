"use client"

import Image from "next/image"
import { Heart, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductType } from "@/types/productType"

export default function ProductCard({ product, index }: { product: ProductType, index: number }) {
  return (
    <Card className="w-70 border-none">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={product.frontImage}
            alt={product.name}
            width={300}
            height={300}
            className="h-auto w-full object-cover"
          />

          {/* Wishlist */}
          <button className="absolute top-3 right-3 rounded-full bg-white p-2 shadow-sm transition hover:scale-110">
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
          className="mt-3 flex w-full items-center gap-2"
        >
          <Plus size={16} />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}
