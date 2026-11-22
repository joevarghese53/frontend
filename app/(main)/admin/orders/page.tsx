"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AdminPageLayout } from "@/components/admin/adminPageLayout"
import { getAdminErrorMessage, isRecord } from "@/components/admin/adminUtils"
import { ErrorCard } from "@/components/errorCard/errorCard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useConfirmOrderMutation,
  useDeleteOrderMutation,
  useDeliveredOrderMutation,
  useGetAllOrdersQuery,
  useOutForDeliveryOrderMutation,
  useShippedOrderMutation,
} from "@/redux/api/orderApiSlice"
import type { CreateOrderResponse } from "@/types/orderType"

type OrderStatusFilter =
  | "all"
  | "awaitingPayment"
  | "paymentReceived"
  | "confirmed"
  | "shipped"
  | "outForDelivery"
  | "delivered"

const orderStatusFilters: {
  value: OrderStatusFilter
  label: string
}[] = [
  { value: "all", label: "All orders" },
  { value: "awaitingPayment", label: "Awaiting payment" },
  { value: "paymentReceived", label: "Payment received" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "outForDelivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
]

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

function getOrderStatusFilter(
  order: CreateOrderResponse
): Exclude<OrderStatusFilter, "all"> {
  if (order.isDelivered || order.status === "delivered") return "delivered"
  if (order.isOutForDelivery || order.status === "outForDelivery") {
    return "outForDelivery"
  }
  if (order.isShipped || order.status === "shipped") return "shipped"
  if (order.isConfirmed || order.status === "confirmed") return "confirmed"
  if (order.isPaid) return "paymentReceived"
  return "awaitingPayment"
}

function getOrderStatus(order: CreateOrderResponse): string {
  const status = getOrderStatusFilter(order)
  return (
    orderStatusFilters.find((filter) => filter.value === status)?.label ??
    status
  )
}

function getCustomerLabel(user: unknown): string {
  if (typeof user === "string") return user
  if (!isRecord(user)) return "Unknown customer"

  const username = typeof user.username === "string" ? user.username : undefined
  const email = typeof user.email === "string" ? user.email : undefined
  const id = typeof user._id === "string" ? user._id : undefined

  if (username && email) return `${username} (${email})`
  return username ?? email ?? id ?? "Unknown customer"
}

function getNextAction(order: CreateOrderResponse) {
  if (!order.isPaid) return null
  if (!order.isConfirmed && order.status !== "confirmed") {
    return { label: "Confirm order", action: "confirm" as const }
  }
  if (!order.isShipped && order.status !== "shipped") {
    return { label: "Mark as shipped", action: "ship" as const }
  }
  if (!order.isOutForDelivery && order.status !== "outForDelivery") {
    return { label: "Out for delivery", action: "outForDelivery" as const }
  }
  if (!order.isDelivered && order.status !== "delivered") {
    return { label: "Mark as delivered", action: "deliver" as const }
  }
  return null
}

export default function AdminOrdersPage() {
  const { data: orders, isLoading, error, refetch } = useGetAllOrdersQuery()
  console.log("orders", orders)
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmOrder] = useConfirmOrderMutation()
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation()
  const [shippedOrder] = useShippedOrderMutation()
  const [outForDeliveryOrder] = useOutForDeliveryOrderMutation()
  const [deliveredOrder] = useDeliveredOrderMutation()
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const filteredOrders = (orders ?? []).filter(
    (order) =>
      statusFilter === "all" || getOrderStatusFilter(order) === statusFilter
  )
  const statusCounts = orderStatusFilters.map((filter) => ({
    ...filter,
    count:
      filter.value === "all"
        ? (orders?.length ?? 0)
        : (orders ?? []).filter(
            (order) => getOrderStatusFilter(order) === filter.value
          ).length,
  }))

  const advanceOrder = async (
    order: CreateOrderResponse,
    action: "confirm" | "ship" | "outForDelivery" | "deliver"
  ) => {
    setUpdatingId(order._id)
    try {
      if (action === "confirm") await confirmOrder(order._id).unwrap()
      if (action === "ship") await shippedOrder(order._id).unwrap()
      if (action === "outForDelivery") {
        await outForDeliveryOrder(order._id).unwrap()
      }
      if (action === "deliver") await deliveredOrder(order._id).unwrap()
      toast.success("Order status updated.")
    } catch (updateError) {
      toast.error(
        `Could not update order: ${getAdminErrorMessage(updateError)}`
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteOrder = async (order: CreateOrderResponse) => {
    const orderNumber = order._id.slice(-8).toUpperCase()
    if (
      !window.confirm(
        `Delete order #${orderNumber}? This action cannot be undone.`
      )
    ) {
      return
    }

    setDeletingId(order._id)
    try {
      await deleteOrder(order._id).unwrap()
      toast.success(`Order #${orderNumber} deleted.`)
    } catch (deleteError) {
      toast.error(
        `Could not delete order: ${getAdminErrorMessage(deleteError)}`
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminPageLayout
      title="Manage orders"
      description="Review customer orders and move paid orders through fulfillment."
    >
      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Loading orders">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorCard
          title="We couldn't load orders"
          message={getAdminErrorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : !orders ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
          No orders are available.
        </p>
      ) : orders.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700">
          There are no orders to display.
        </p>
      ) : (
        <>
          <div
            className="mb-5 flex gap-2 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800"
            role="group"
            aria-label="Filter orders by status"
          >
            {statusCounts.map(({ value, label, count }) => (
              <button
                key={value}
                type="button"
                aria-pressed={statusFilter === value}
                onClick={() => setStatusFilter(value)}
                className={`-mb-px shrink-0 border-b-2 px-3 py-3 text-sm transition-colors ${
                  statusFilter === value
                    ? "border-foreground font-semibold text-foreground"
                    : "border-transparent text-zinc-500 hover:text-foreground"
                }`}
              >
                {label} <span className="ml-1 text-xs">({count})</span>
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <p className="rounded-2xl bg-zinc-50 px-5 py-10 text-center text-sm text-zinc-500 dark:bg-zinc-900">
              No orders with this status.
            </p>
          ) : (
            <ul className="space-y-3">
              {filteredOrders.map((order) => {
                const nextAction = getNextAction(order)
                const itemCount = order.orderItems.reduce(
                  (total, item) => total + item.qty,
                  0
                )

                return (
                  <li
                    key={order._id}
                    className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {dateFormatter.format(new Date(order.createdAt))} ·{" "}
                        {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
                        {getOrderStatus(order)}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        Customer {getCustomerLabel(order.user)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                      <span className="font-semibold">
                        {currencyFormatter.format(order.totalPrice)}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {nextAction ? (
                          <Button
                            type="button"
                            className="rounded-xl"
                            disabled={updatingId !== null || isDeleting}
                            onClick={() =>
                              void advanceOrder(order, nextAction.action)
                            }
                          >
                            {updatingId === order._id
                              ? "Updating…"
                              : nextAction.label}
                          </Button>
                        ) : (
                          <span className="self-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium dark:bg-zinc-900">
                            {order.isDelivered || order.status === "delivered"
                              ? "Complete"
                              : "Waiting for payment"}
                          </span>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          className="rounded-xl"
                          disabled={updatingId !== null || isDeleting}
                          onClick={() => void handleDeleteOrder(order)}
                        >
                          {deletingId === order._id
                            ? "Deleting…"
                            : "Delete order"}
                        </Button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </AdminPageLayout>
  )
}
