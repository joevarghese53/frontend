import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <Card className="w-70 border-none">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative w-full overflow-hidden rounded-xl bg-muted">
          <Skeleton className="h-auto w-full object-cover" />
        </div>

        {/* Product Info */}
        <div className="mt-3 flex items-start justify-between">
          <div>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          <Skeleton className="h-4 w-1/3" />
        </div>

        {/* Add to Cart */}
        <Skeleton className="mt-3 h-10 w-full" />
      </CardContent>
    </Card>
  )
}
