"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { AdminPageLayout } from "@/components/admin/adminPageLayout"
import { getAdminErrorMessage } from "@/components/admin/adminUtils"
import { ErrorCard } from "@/components/errorCard/errorCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useAllProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/redux/api/productApiSlice"

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
})

export default function AdminProductsPage() {
  const { data: products, isLoading, error, refetch } = useAllProductsQuery()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<{
    id: string
    name: string
    price: string
  } | null>(null)

  const handleDelete = async (productId: string, productName: string) => {
    if (!window.confirm(`Delete "${productName}"? This cannot be undone.`)) {
      return
    }

    setDeletingId(productId)
    try {
      await deleteProduct(productId).unwrap()
      toast.success("Product deleted.")
    } catch (deleteError) {
      toast.error(
        `Could not delete product: ${getAdminErrorMessage(deleteError)}`
      )
    } finally {
      setDeletingId(null)
    }
  }

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingProduct) return

    const formData = new FormData()
    formData.set("name", editingProduct.name.trim())
    formData.set("price", editingProduct.price)

    try {
      await updateProduct({
        productId: editingProduct.id,
        formData,
      }).unwrap()
      toast.success("Product details updated.")
      setEditingProduct(null)
    } catch (updateError) {
      toast.error(
        `Could not update product: ${getAdminErrorMessage(updateError)}`
      )
    }
  }

  return (
    <AdminPageLayout
      title="Manage products"
      description="Review the product catalog, edit names and prices, or remove products."
    >
      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Loading products">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorCard
          title="We couldn't load products"
          message={getAdminErrorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : !products ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
          No products are available.
        </p>
      ) : products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
          There are no products to display.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {products.map((product) => (
              <li key={product._id} className="p-4 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <Link
                      href={`/product/${product._id}`}
                      className="truncate font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm text-zinc-500">
                      {product.category.name} ·{" "}
                      {currencyFormatter.format(product.price)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() =>
                        setEditingProduct(
                          editingProduct?.id === product._id
                            ? null
                            : {
                                id: product._id,
                                name: product.name,
                                price: String(product.price),
                              }
                        )
                      }
                    >
                      {editingProduct?.id === product._id ? "Cancel" : "Edit"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className="rounded-xl"
                      disabled={isDeleting}
                      onClick={() =>
                        void handleDelete(product._id, product.name)
                      }
                    >
                      {isDeleting && deletingId === product._id
                        ? "Deleting…"
                        : "Delete product"}
                    </Button>
                  </div>
                </div>
                {editingProduct?.id === product._id && (
                  <form
                    className="mt-5 grid gap-4 rounded-2xl bg-zinc-50 p-4 sm:grid-cols-[1fr_180px_auto] sm:items-end dark:bg-zinc-900/50"
                    onSubmit={handleUpdate}
                  >
                    <div className="space-y-2">
                      <label
                        htmlFor={`product-name-${product._id}`}
                        className="text-sm font-medium"
                      >
                        Product name
                      </label>
                      <Input
                        id={`product-name-${product._id}`}
                        required
                        value={editingProduct.name}
                        onChange={(event) =>
                          setEditingProduct((current) =>
                            current
                              ? { ...current, name: event.target.value }
                              : current
                          )
                        }
                        className="h-10 rounded-xl px-3"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor={`product-price-${product._id}`}
                        className="text-sm font-medium"
                      >
                        Price (INR)
                      </label>
                      <Input
                        id={`product-price-${product._id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={editingProduct.price}
                        onChange={(event) =>
                          setEditingProduct((current) =>
                            current
                              ? { ...current, price: event.target.value }
                              : current
                          )
                        }
                        className="h-10 rounded-xl px-3"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="rounded-xl"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving…" : "Save"}
                    </Button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminPageLayout>
  )
}
