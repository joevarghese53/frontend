import AllProducts from "@/components/allProducts/allProducts"
import BestRated from "@/components/bestRated/bestRated"
import HeroBanner from "@/components/heroBanner/heroBanner"
import ShopByCategory from "@/components/shopByCategory/shopByCategory"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  return (
    <div className="mx-auto flex min-h-svh max-w-375 flex-col">
      <HeroBanner />
      <BestRated />
      <ShopByCategory />
      <Separator />
      <AllProducts />
    </div>
  )
}
