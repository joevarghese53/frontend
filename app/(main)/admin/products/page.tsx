"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { AdminPageLayout } from "@/components/admin/adminPageLayout"
import { getAdminErrorMessage } from "@/components/admin/adminUtils"
import { ErrorCard } from "@/components/errorCard/errorCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useFetchCategoriesQuery } from "@/redux/api/categoryApiSlice"
import {
  useAllProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "@/redux/api/productApiSlice"
import type { ProductType } from "@/types/productType"

type ProductForm = {
  id: string
  name: string
  price: string
  category: string
  description: string
  offers: string
  returnpolicy: string
  images: string[]
}

type NewProductForm = Omit<ProductForm, "id" | "images">

type ProductImageField =
  | "frontImage"
  | "backImage"
  | "frontDesign"
  | "backDesign"

const PRODUCT_IMAGE_FIELDS: ProductImageField[] = [
  "frontImage",
  "backImage",
  "frontDesign",
  "backDesign",
]

const EMPTY_NEW_PRODUCT: NewProductForm = {
  name: "",
  price: "",
  category: "",
  description: "",
  offers: "",
  returnpolicy: "",
}

const toProductForm = (product: ProductType): ProductForm => ({
  id: product._id,
  name: product.name,
  price: String(product.price),
  category: product.category._id,
  description: product.description ?? "",
  offers: product.offers ?? "",
  returnpolicy: product.returnPolicy ?? product.returnpolicy ?? "",
  images: product.images ?? [],
})

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
})

export default function AdminProductsPage() {
  const { data: products, isLoading, error, refetch } = useAllProductsQuery()
  const { data: categories } = useFetchCategoriesQuery()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [uploadProductImage, { isLoading: isUploadingImages }] =
    useUploadProductImageMutation()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<ProductForm | null>(null)
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [newProduct, setNewProduct] =
    useState<NewProductForm>(EMPTY_NEW_PRODUCT)
  const [newProductFiles, setNewProductFiles] = useState<
    Partial<Record<ProductImageField, File>>
  >({})
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([])
  const [newProductPreviewUrls, setNewProductPreviewUrls] = useState<
    Partial<Record<ProductImageField, string>>
  >({})
  const [imageFiles, setImageFiles] = useState<
    Partial<Record<ProductImageField, File>>
  >({})
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<
    Partial<Record<ProductImageField, string>>
  >({})

  useEffect(() => {
    return () => {
      Object.values(imagePreviewUrls).forEach((previewUrl) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
      })
    }
  }, [imagePreviewUrls])

  useEffect(() => {
    return () => {
      Object.values(newProductPreviewUrls).forEach((previewUrl) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
      })
    }
  }, [newProductPreviewUrls])

  const uploadProductImages = async (
    files: Partial<Record<ProductImageField, File>>,
    galleryFiles: File[] = []
  ): Promise<{
    imageUrls: Partial<Record<ProductImageField, string>>
    galleryUrls: string[]
  }> => {
    if (
      !PRODUCT_IMAGE_FIELDS.some((field) => files[field]) &&
      galleryFiles.length === 0
    ) {
      return { imageUrls: {}, galleryUrls: [] }
    }

    const uploadFormData = new FormData()
    PRODUCT_IMAGE_FIELDS.forEach((field) => {
      const file = files[field]
      if (file) uploadFormData.append(field, file)
    })
    galleryFiles.forEach((file) => uploadFormData.append("images", file))

    const uploadedImages = await uploadProductImage(uploadFormData).unwrap()
    const imageUrls: Partial<Record<ProductImageField, string>> = {}
    PRODUCT_IMAGE_FIELDS.forEach((field) => {
      if (!files[field]) return

      const imageUrl = uploadedImages.imageUrls[field]?.[0]
      if (!imageUrl) {
        throw new Error(`Image upload did not return a ${field} URL.`)
      }
      imageUrls[field] = imageUrl
    })
    const galleryUrls = uploadedImages.imageUrls.images ?? []
    if (galleryUrls.length !== galleryFiles.length) {
      throw new Error(
        "Image upload did not return URLs for all gallery images."
      )
    }
    return { imageUrls, galleryUrls }
  }

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData()
    formData.set("name", newProduct.name.trim())
    formData.set("price", newProduct.price)
    formData.set("category", newProduct.category)
    formData.set("description", newProduct.description.trim())
    formData.set("offers", newProduct.offers.trim())
    formData.set("returnPolicy", newProduct.returnpolicy.trim())

    try {
      const { imageUrls, galleryUrls } = await uploadProductImages(
        newProductFiles,
        newGalleryFiles
      )
      PRODUCT_IMAGE_FIELDS.forEach((field) => {
        const imageUrl = imageUrls[field]
        if (imageUrl) formData.set(field, imageUrl)
      })
      if (galleryUrls.length > 0) {
        formData.set("images", JSON.stringify(galleryUrls))
      }

      await createProduct(formData).unwrap()
      toast.success("Product created.")
      setIsCreateFormOpen(false)
      setNewProduct(EMPTY_NEW_PRODUCT)
      setNewProductFiles({})
      setNewGalleryFiles([])
      setNewProductPreviewUrls({})
    } catch (createError) {
      toast.error(
        `Could not create product: ${getAdminErrorMessage(createError)}`
      )
    }
  }

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
    formData.set("category", editingProduct.category)
    formData.set("description", editingProduct.description.trim())
    formData.set("offers", editingProduct.offers.trim())
    formData.set("returnPolicy", editingProduct.returnpolicy.trim())

    try {
      const { imageUrls, galleryUrls } = await uploadProductImages(
        imageFiles,
        galleryFiles
      )
      PRODUCT_IMAGE_FIELDS.forEach((field) => {
        const imageUrl = imageUrls[field]
        if (imageUrl) formData.set(field, imageUrl)
      })
      if (galleryUrls.length > 0) {
        formData.set(
          "images",
          JSON.stringify([...editingProduct.images, ...galleryUrls])
        )
      }

      await updateProduct({
        productId: editingProduct.id,
        formData,
      }).unwrap()
      toast.success("Product details updated.")
      setEditingProduct(null)
      setImageFiles({})
      setGalleryFiles([])
      setImagePreviewUrls({})
    } catch (updateError) {
      toast.error(
        `Could not update product: ${getAdminErrorMessage(updateError)}`
      )
    }
  }

  return (
    <AdminPageLayout
      title="Manage products"
      description="Review the product catalog, update product details, or remove products."
    >
      <>
        <div className="mb-5 flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-zinc-700"
            aria-expanded={isCreateFormOpen}
            aria-controls="new-product-form"
            disabled={isCreating || isUploadingImages}
            onClick={() => {
              if (isCreateFormOpen) {
                setNewProduct(EMPTY_NEW_PRODUCT)
                setNewProductFiles({})
                setNewGalleryFiles([])
                setNewProductPreviewUrls({})
              }
              setIsCreateFormOpen((isOpen) => !isOpen)
            }}
          >
            {isCreateFormOpen ? "Cancel" : "Add product"}
          </Button>
        </div>

        {isCreateFormOpen && (
          <form
            id="new-product-form"
            onSubmit={handleCreate}
            className="mb-8 grid gap-4 p-4 rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 @apply shadow-[0_4px_20px_3px_#0000005c]"
          >
            <div className="space-y-2">
              <label htmlFor="new-product-name" className="text-sm font-medium">
                Product name
              </label>
              <Input
                id="new-product-name"
                required
                value={newProduct.name}
                onChange={(event) =>
                  setNewProduct((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className="h-10 rounded-xl px-3 border border-black/50"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="new-product-price"
                className="text-sm font-medium"
              >
                Price (INR)
              </label>
              <Input
                id="new-product-price"
                type="number"
                min="0"
                step="0.01"
                required
                value={newProduct.price}
                onChange={(event) =>
                  setNewProduct((current) => ({
                    ...current,
                    price: event.target.value,
                  }))
                }
                className="h-10 rounded-xl px-3 border border-black/50"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="new-product-category"
                className="text-sm font-medium"
              >
                Category
              </label>
              <select
                id="new-product-category"
                required
                value={newProduct.category}
                onChange={(event) =>
                  setNewProduct((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-xl border border-black/50 bg-transparent px-3 text-sm"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="new-product-description"
                className="text-sm font-medium"
              >
                Description
              </label>
              <Textarea
                id="new-product-description"
                required
                value={newProduct.description}
                onChange={(event) =>
                  setNewProduct((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className="min-h-24 rounded-xl border border-black/50"
              />
            </div>
            {(
              [
                ["offers", "Offers"],
                ["returnpolicy", "Returns & exchange policy"],
              ] as const
            ).map(([field, label]) => (
              <div key={field} className="space-y-2">
                <label
                  htmlFor={`new-product-${field}`}
                  className="text-sm font-medium"
                >
                  {label}
                </label>
                <Input
                  id={`new-product-${field}`}
                  required
                  value={newProduct[field]}
                  onChange={(event) =>
                    setNewProduct((current) => ({
                      ...current,
                      [field]: event.target.value,
                    }))
                  }
                  className="h-10 rounded-xl px-3 border border-black/50"
                />
              </div>
            ))}
            {PRODUCT_IMAGE_FIELDS.map((field) => (
              <div key={field} className="space-y-2">
                <label
                  htmlFor={`new-product-${field}`}
                  className="text-sm font-medium"
                >
                  {field === "frontImage"
                    ? "Front image"
                    : field === "backImage"
                      ? "Back image"
                      : field === "frontDesign"
                        ? "Front design"
                        : "Back design"}
                </label>
                {newProductPreviewUrls[field] && (
                  <Image
                    src={newProductPreviewUrls[field]}
                    alt={`${field} preview`}
                    width={128}
                    height={128}
                    unoptimized
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                )}
                <Input
                  id={`new-product-${field}`}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    const previewUrl = file
                      ? URL.createObjectURL(file)
                      : undefined
                    setNewProductFiles((current) => {
                      const next = { ...current }
                      if (file) next[field] = file
                      else delete next[field]
                      return next
                    })
                    setNewProductPreviewUrls((current) => {
                      const next = { ...current }
                      if (previewUrl) next[field] = previewUrl
                      else delete next[field]
                      return next
                    })
                  }}
                  className="h-10 w-fit rounded-xl border border-black/50 px-3 py-1.5"
                />
                {newProductFiles[field] && (
                  <p className="text-xs text-zinc-500">
                    Selected: {newProductFiles[field].name}
                  </p>
                )}
              </div>
            ))}
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="new-product-images"
                className="text-sm font-medium"
              >
                Additional product images
              </label>
              <Input
                id="new-product-images"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? [])
                  if (files.length > 10) {
                    toast.error("Choose no more than 10 additional images.")
                    event.currentTarget.value = ""
                    return
                  }
                  setNewGalleryFiles(files)
                }}
                className="h-10 w-fit rounded-xl border border-black/50 px-3 py-1.5"
              />
              <p className="text-xs text-zinc-500">
                You can select up to 10 images.
              </p>
              {newGalleryFiles.length > 0 && (
                <ul className="list-inside list-disc text-xs text-zinc-500">
                  {newGalleryFiles.map((file, index) => (
                    <li key={`${file.name}-${index}`}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="sm:col-span-2">
              <Button
                type="submit"
                className="rounded-xl"
                disabled={isCreating || isUploadingImages}
              >
                {isUploadingImages
                  ? "Uploading images…"
                  : isCreating
                    ? "Creating…"
                    : "Create product"}
              </Button>
            </div>
          </form>
        )}

        {isLoading ? (
          <div
            className="space-y-3"
            role="status"
            aria-label="Loading products"
          >
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
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 flex flex-col gap-2">
              {products.map((product) => (
                <li key={product._id} className="overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 @apply shadow-[0_4px_20px_3px_#0000005c] p-4 m-2">
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
                        onClick={() => {
                          setEditingProduct(
                            editingProduct?.id === product._id
                              ? null
                              : toProductForm(product)
                          )
                          setImageFiles({})
                          setGalleryFiles([])
                          setImagePreviewUrls({})
                        }}
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
                      className="mt-5 grid gap-4 rounded-2xl bg-zinc-50 p-4 sm:grid-cols-2 dark:bg-zinc-900/50"
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
                          className="h-10 rounded-xl px-3 border border-black/50"
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
                          className="h-10 rounded-xl px-3 border border-black/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`product-category-${product._id}`}
                          className="text-sm font-medium"
                        >
                          Category
                        </label>
                        <select
                          id={`product-category-${product._id}`}
                          required
                          value={editingProduct.category}
                          onChange={(event) =>
                            setEditingProduct((current) =>
                              current
                                ? { ...current, category: event.target.value }
                                : current
                            )
                          }
                          className="h-10 w-full rounded-xl border border-black/50 bg-transparent px-3 text-sm"
                        >
                          <option value="" disabled>
                            Select a category
                          </option>
                          {categories?.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label
                          htmlFor={`product-description-${product._id}`}
                          className="text-sm font-medium"
                        >
                          Description
                        </label>
                        <Textarea
                          id={`product-description-${product._id}`}
                          value={editingProduct.description}
                          onChange={(event) =>
                            setEditingProduct((current) =>
                              current
                                ? {
                                    ...current,
                                    description: event.target.value,
                                  }
                                : current
                            )
                          }
                          className="min-h-24 rounded-xl *:border border-black/50"
                        />
                      </div>
                      {(
                        [
                          ["offers", "Offers"],
                          ["returnpolicy", "Returns & exchange policy"],
                        ] as const
                      ).map(([field, label]) => (
                        <div key={field} className="space-y-2">
                          <label
                            htmlFor={`product-${field}-${product._id}`}
                            className="text-sm font-medium"
                          >
                            {label}
                          </label>
                          <Input
                            id={`product-${field}-${product._id}`}
                            value={editingProduct[field]}
                            onChange={(event) =>
                              setEditingProduct((current) =>
                                current
                                  ? { ...current, [field]: event.target.value }
                                  : current
                              )
                            }
                            className="h-10 rounded-xl px-3 border border-black/50"
                          />
                        </div>
                      ))}
                      {(
                        [
                          ["frontImage", "Front image"],
                          ["backImage", "Back image"],
                          ["frontDesign", "Front design"],
                          ["backDesign", "Back design"],
                        ] as const
                      ).map(([field, label]) => (
                        <div key={field} className="space-y-2">
                          <label
                            htmlFor={`product-${field}-${product._id}`}
                            className="text-sm font-medium"
                          >
                            {label}
                          </label>
                          {(imagePreviewUrls[field] ?? product[field]) && (
                            <Image
                              src={imagePreviewUrls[field] ?? product[field]}
                              alt={`${label} preview`}
                              width={128}
                              height={128}
                              unoptimized
                              className="h-24 w-24 rounded-lg object-cover"
                            />
                          )}
                          <Input
                            id={`product-${field}-${product._id}`}
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            onChange={(event) => {
                              const file = event.target.files?.[0]
                              const previewUrl = file
                                ? URL.createObjectURL(file)
                                : undefined
                              setImageFiles((current) => {
                                const next = { ...current }
                                if (file) next[field] = file
                                else delete next[field]
                                return next
                              })
                              setImagePreviewUrls((current) => {
                                const next = { ...current }
                                if (previewUrl) next[field] = previewUrl
                                else delete next[field]
                                return next
                              })
                            }}
                            className="h-10 w-fit rounded-xl border border-black/50 px-3 py-1.5"
                          />
                          {imageFiles[field] && (
                            <p className="text-xs text-zinc-500">
                              Selected: {imageFiles[field].name}
                            </p>
                          )}
                        </div>
                      ))}
                      <div className="space-y-3 sm:col-span-2">
                        <p className="text-sm font-medium">
                          Additional product images
                        </p>
                        {editingProduct.images.length > 0 && (
                          <div className="flex flex-wrap gap-3">
                            {editingProduct.images.map((imageUrl, index) => (
                              <Image
                                key={`${imageUrl}-${index}`}
                                src={imageUrl}
                                alt={`Product gallery image ${index + 1}`}
                                width={128}
                                height={128}
                                unoptimized
                                className="h-24 w-24 rounded-lg object-cover"
                              />
                            ))}
                          </div>
                        )}
                        <label
                          htmlFor={`product-images-${product._id}`}
                          className="block text-sm"
                        >
                          Add images to gallery
                        </label>
                        <Input
                          id={`product-images-${product._id}`}
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                          onChange={(event) => {
                            const files = Array.from(event.target.files ?? [])
                            if (files.length > 10) {
                              toast.error(
                                "Choose no more than 10 additional images."
                              )
                              event.currentTarget.value = ""
                              return
                            }
                            setGalleryFiles(files)
                          }}
                          className="h-10 w-fit rounded-xl border border-black/50 px-3 py-1.5"
                        />
                        {galleryFiles.length > 0 && (
                          <ul className="list-inside list-disc text-xs text-zinc-500">
                            {galleryFiles.map((file, index) => (
                              <li key={`${file.name}-${index}`}>{file.name}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="rounded-xl"
                        disabled={isUpdating || isUploadingImages}
                      >
                        {isUploadingImages
                          ? "Uploading images…"
                          : isUpdating
                            ? "Saving…"
                            : "Save changes"}
                      </Button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    </AdminPageLayout>
  )
}
