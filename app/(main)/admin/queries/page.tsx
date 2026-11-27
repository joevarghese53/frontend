"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AdminPageLayout } from "@/components/admin/adminPageLayout"
import { getAdminErrorMessage } from "@/components/admin/adminUtils"
import { ErrorCard } from "@/components/errorCard/errorCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useGetContactMessagesQuery,
  useUpdateContactMessageStatusMutation,
  type ContactMessage,
} from "@/redux/api/contactApiSlice"

type QueryFilter = "all" | "open" | "completed"

const queryFilters: { value: QueryFilter; label: string }[] = [
  { value: "all", label: "All queries" },
  { value: "open", label: "Open" },
  { value: "completed", label: "Completed" },
]

const topicLabels: Record<ContactMessage["topic"], string> = {
  order: "Order support",
  custom: "Custom designs",
  returns: "Returns and cancellations",
  other: "Something else",
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
})

export default function AdminQueriesPage() {
  const {
    data: messages,
    isLoading,
    error,
    refetch,
  } = useGetContactMessagesQuery()
  const [updateStatus] = useUpdateContactMessageStatusMutation()
  const [filter, setFilter] = useState<QueryFilter>("open")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filteredMessages = (messages ?? []).filter((message) => {
    if (filter === "open") return !message.isCompleted
    if (filter === "completed") return message.isCompleted
    return true
  })

  const filterCounts = queryFilters.map(({ value, label }) => ({
    value,
    label,
    count:
      value === "all"
        ? (messages?.length ?? 0)
        : (messages ?? []).filter((message) =>
            value === "completed"
              ? message.isCompleted
              : !message.isCompleted
          ).length,
  }))

  const handleStatusChange = async (message: ContactMessage) => {
    const isCompleted = !message.isCompleted
    setUpdatingId(message._id)

    try {
      await updateStatus({ id: message._id, isCompleted }).unwrap()
      toast.success(isCompleted ? "Query marked complete." : "Query reopened.")
    } catch (updateError) {
      toast.error(
        `Could not update query: ${getAdminErrorMessage(updateError)}`
      )
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <AdminPageLayout
      title="Contact queries"
      description="Review messages submitted through the Contact Us page and track their resolution."
    >
      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Loading queries">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorCard
          title="We couldn't load contact queries"
          message={getAdminErrorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : !messages ? (
        <ErrorCard
          title="Unexpected query data"
          message="The contact query response was not in the expected format."
          onRetry={() => void refetch()}
        />
      ) : messages.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
          There are no contact queries yet.
        </p>
      ) : (
        <>
          <div
            className="mb-5 flex gap-2 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800"
            role="group"
            aria-label="Filter contact queries"
          >
            {filterCounts.map(({ value, label, count }) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={`-mb-px shrink-0 border-b-2 px-3 py-3 text-sm transition-colors ${
                  filter === value
                    ? "border-foreground font-semibold text-foreground"
                    : "border-transparent text-zinc-500 hover:text-foreground"
                }`}
              >
                {label} <span className="ml-1 text-xs">({count})</span>
              </button>
            ))}
          </div>

          {filteredMessages.length === 0 ? (
            <p className="rounded-2xl bg-zinc-50 px-5 py-10 text-center text-sm text-zinc-500 dark:bg-zinc-900">
              No {filter} queries.
            </p>
          ) : (
            <ul className="space-y-3">
              {filteredMessages.map((message) => (
                <li
                  key={message._id}
                  className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold">
                          {message.firstName} {message.lastName}
                        </h2>
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium dark:bg-zinc-900">
                          {topicLabels[message.topic]}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            message.isCompleted
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                          }`}
                        >
                          {message.isCompleted ? "Completed" : "Open"}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500">
                        <a
                          href={`mailto:${message.email}`}
                          className="break-all underline-offset-4 hover:text-foreground hover:underline"
                        >
                          {message.email}
                        </a>
                        <span>
                          {dateFormatter.format(new Date(message.createdAt))}
                        </span>
                      </div>

                      <p className="mt-4 whitespace-pre-wrap wrap-break-word text-sm leading-6">
                        {message.message}
                      </p>

                      <p className="mt-3 text-xs text-zinc-500">
                        {message.notificationSent
                          ? "Inbox notification sent"
                          : "Inbox notification was not sent"}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                      <Button
                        type="button"
                        variant={message.isCompleted ? "outline" : "default"}
                        className="rounded-xl"
                        disabled={updatingId !== null}
                        onClick={() => void handleStatusChange(message)}
                      >
                        {updatingId === message._id
                          ? "Updating…"
                          : message.isCompleted
                            ? "Reopen query"
                            : "Mark complete"}
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </AdminPageLayout>
  )
}
