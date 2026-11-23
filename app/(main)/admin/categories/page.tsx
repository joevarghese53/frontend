"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { AdminPageLayout } from "@/components/admin/adminPageLayout"
import { getAdminErrorMessage } from "@/components/admin/adminUtils"
import { ErrorCard } from "@/components/errorCard/errorCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/redux/api/categoryApiSlice"
import type { CategoryType } from "@/types/categoryType"

type CategoryForm = {
  id: string
  name: string
  slug: string
}

export default function AdminCategoriesPage() {
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useFetchCategoriesQuery()
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation()
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" })
  const [editingCategory, setEditingCategory] = useState<CategoryForm | null>(
    null
  )
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await createCategory({
        name: newCategory.name.trim(),
        slug: newCategory.slug.trim(),
      }).unwrap()
      setNewCategory({ name: "", slug: "" })
      toast.success("Category created.")
    } catch (createError) {
      toast.error(
        `Could not create category: ${getAdminErrorMessage(createError)}`
      )
    }
  }

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingCategory) return

    try {
      await updateCategory({
        categoryId: editingCategory.id,
        updatedCategory: {
          name: editingCategory.name.trim(),
          slug: editingCategory.slug.trim(),
        },
      }).unwrap()
      setEditingCategory(null)
      toast.success("Category updated.")
    } catch (updateError) {
      toast.error(
        `Could not update category: ${getAdminErrorMessage(updateError)}`
      )
    }
  }

  const handleDelete = async (category: CategoryType) => {
    if (!window.confirm(`Delete "${category.name}"? This cannot be undone.`)) {
      return
    }

    setDeletingId(category._id)
    try {
      await deleteCategory(category._id).unwrap()
      toast.success("Category deleted.")
    } catch (deleteError) {
      toast.error(
        `Could not delete category: ${getAdminErrorMessage(deleteError)}`
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminPageLayout
      title="Manage categories"
      description="Create, edit, and remove the categories used to organize products."
    >
      <form
        onSubmit={handleCreate}
        className="mb-8 grid gap-4 rounded-2xl border border-zinc-200 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end dark:border-zinc-800"
      >
        <div className="space-y-2">
          <label htmlFor="new-category-name" className="text-sm font-medium">
            Category name
          </label>
          <Input
            id="new-category-name"
            required
            value={newCategory.name}
            onChange={(event) =>
              setNewCategory((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            placeholder="e.g. Oversized T-Shirts"
            className="h-10 rounded-xl px-3"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="new-category-slug" className="text-sm font-medium">
            Slug
          </label>
          <Input
            id="new-category-slug"
            required
            value={newCategory.slug}
            onChange={(event) =>
              setNewCategory((current) => ({
                ...current,
                slug: event.target.value,
              }))
            }
            placeholder="e.g. oversized-tshirts"
            className="h-10 rounded-xl px-3"
          />
        </div>
        <Button type="submit" className="rounded-xl" disabled={isCreating}>
          {isCreating ? "Creating…" : "Add category"}
        </Button>
      </form>

      {isLoading ? (
        <div
          className="space-y-3"
          role="status"
          aria-label="Loading categories"
        >
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorCard
          title="We couldn't load categories"
          message={getAdminErrorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : !categories ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
          No categories are available.
        </p>
      ) : categories.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
          There are no categories to display.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {categories.map((category) => (
              <li key={category._id} className="p-4 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{category.name}</p>
                    <p className="mt-1 truncate text-sm text-zinc-500">
                      Slug: {category.slug}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() =>
                        setEditingCategory(
                          editingCategory?.id === category._id
                            ? null
                            : {
                                id: category._id,
                                name: category.name,
                                slug: category.slug,
                              }
                        )
                      }
                    >
                      {editingCategory?.id === category._id ? "Cancel" : "Edit"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className="rounded-xl"
                      disabled={isDeleting}
                      onClick={() => void handleDelete(category)}
                    >
                      {isDeleting && deletingId === category._id
                        ? "Deleting…"
                        : "Delete"}
                    </Button>
                  </div>
                </div>

                {editingCategory?.id === category._id && (
                  <form
                    className="mt-5 grid gap-4 rounded-2xl bg-zinc-50 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end dark:bg-zinc-900/50"
                    onSubmit={handleUpdate}
                  >
                    <div className="space-y-2">
                      <label
                        htmlFor={`category-name-${category._id}`}
                        className="text-sm font-medium"
                      >
                        Category name
                      </label>
                      <Input
                        id={`category-name-${category._id}`}
                        required
                        value={editingCategory.name}
                        onChange={(event) =>
                          setEditingCategory((current) =>
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
                        htmlFor={`category-slug-${category._id}`}
                        className="text-sm font-medium"
                      >
                        Slug
                      </label>
                      <Input
                        id={`category-slug-${category._id}`}
                        required
                        value={editingCategory.slug}
                        onChange={(event) =>
                          setEditingCategory((current) =>
                            current
                              ? { ...current, slug: event.target.value }
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
