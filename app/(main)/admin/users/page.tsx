"use client"

import { toast } from "sonner"
import { useSelector } from "react-redux"
import { AdminPageLayout } from "@/components/admin/adminPageLayout"
import { getAdminErrorMessage, isRecord } from "@/components/admin/adminUtils"
import { ErrorCard } from "@/components/errorCard/errorCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/redux/api/usersApiSlice"
import type { RootState } from "@/redux/store"

type AdminUser = {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

function readUsers(value: unknown): AdminUser[] | null {
  const users = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.users)
      ? value.users
      : null

  if (!users) return null

  const parsedUsers: AdminUser[] = []
  for (const user of users) {
    if (!isRecord(user)) return null
    const id =
      typeof user._id === "string"
        ? user._id
        : typeof user.id === "string"
          ? user.id
          : null
    if (!id) return null

    parsedUsers.push({
      id,
      name: typeof user.name === "string" ? user.name : "Unnamed user",
      email: typeof user.email === "string" ? user.email : "No email",
      isAdmin: user.isAdmin === true,
    })
  }

  return parsedUsers
}

export default function AdminUsersPage() {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo)
  const currentUserId =
    userInfo && typeof userInfo._id === "string"
      ? userInfo._id
      : userInfo && typeof userInfo.id === "string"
        ? userInfo.id
        : null
  const { data, isLoading, error, refetch } = useGetUsersQuery(undefined)
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const users = readUsers(data)

  const handleDelete = async (user: AdminUser) => {
    if (
      !window.confirm(
        `Delete the account for ${user.name}? This cannot be undone.`
      )
    ) {
      return
    }

    try {
      await deleteUser(user.id).unwrap()
      toast.success("User account deleted.")
    } catch (deleteError) {
      toast.error(`Could not delete user: ${getAdminErrorMessage(deleteError)}`)
    }
  }

  const handleAdminRole = async (user: AdminUser) => {
    try {
      await updateUser({ userId: user.id, isAdmin: !user.isAdmin }).unwrap()
      toast.success(
        user.isAdmin ? "Admin access removed." : "Admin access granted."
      )
    } catch (updateError) {
      toast.error(`Could not update user: ${getAdminErrorMessage(updateError)}`)
    }
  }

  return (
    <AdminPageLayout
      title="Manage users"
      description="Review registered accounts and remove users when needed."
    >
      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Loading users">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorCard
          title="We couldn't load users"
          message={getAdminErrorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : users === null ? (
        <ErrorCard
          title="Unexpected user data"
          message="The user list response was not in the expected format."
          onRetry={() => void refetch()}
        />
      ) : users.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
          There are no users to display.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{user.name}</p>
                  <p className="mt-1 truncate text-sm text-zinc-500">
                    {user.email}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium dark:bg-zinc-900">
                    {user.id === currentUserId
                      ? "You · Admin"
                      : user.isAdmin
                        ? "Admin"
                        : "Customer"}
                  </span>
                  {user.id !== currentUserId && (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      disabled={isUpdating}
                      onClick={() => void handleAdminRole(user)}
                    >
                      {user.isAdmin ? "Remove admin" : "Make admin"}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    className="rounded-xl"
                    disabled={isDeleting || user.id === currentUserId}
                    onClick={() => void handleDelete(user)}
                  >
                    {user.id === currentUserId
                      ? "Current account"
                      : isDeleting
                        ? "Deleting…"
                        : "Delete"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminPageLayout>
  )
}
