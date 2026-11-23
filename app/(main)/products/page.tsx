import { ProductsPage } from "@/components/products/productsPage"

type ProductsRouteProps = {
  searchParams: Promise<{ category?: string | string[] }>
}

export default async function Page({ searchParams }: ProductsRouteProps) {
  const params = await searchParams
  const categoryId = Array.isArray(params.category)
    ? (params.category[0] ?? "")
    : (params.category ?? "")

  return <ProductsPage initialCategoryId={categoryId} />
}
