"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  MapPin,
  Package,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ErrorCard } from "@/components/errorCard/errorCard"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetMyOrdersQuery } from "@/redux/api/orderApiSlice"
import type { CreateOrderResponse } from "@/types/orderType"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

type OrderFilter = "all" | "inProgress" | "delivered"

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

function getErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return "Please try again in a moment."
  }

  const data = error.data
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message
  }

  return "Please try again in a moment."
}

function isOrderDelivered(order: CreateOrderResponse): boolean {
  return order.isDelivered || order.status === "delivered"
}

function getOrderStatus(order: CreateOrderResponse): string {
  if (isOrderDelivered(order)) return "Delivered"
  if (order.isOutForDelivery || order.status === "outForDelivery") {
    return "Out for delivery"
  }
  if (order.isShipped || order.status === "shipped") return "Shipped"
  if (order.isConfirmed || order.status === "confirmed") return "Confirmed"
  return "Payment received"
}

function OrderCard({ order }: { order: CreateOrderResponse }) {
  const status = getOrderStatus(order)
  const isDelivered = isOrderDelivered(order)
  const itemCount = order.orderItems.reduce((count, item) => count + item.qty, 0)
  const stages = [
    { label: "Paid", complete: order.isPaid },
    { label: "Confirmed", complete: order.isConfirmed },
    { label: "Shipped", complete: order.isShipped },
    { label: "Delivered", complete: isDelivered },
  ]

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 @apply shadow-[0_4px_20px_3px_#0000005c]">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-7 [&::-webkit-details-marker]:hidden">
          <span className="block min-w-0 space-y-2">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">
                Order #{order._id.slice(-8).toUpperCase()}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  isDelivered
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                }`}
              >
                {isDelivered ? (
                  <PackageCheck size={14} aria-hidden="true" />
                ) : (
                  <Truck size={14} aria-hidden="true" />
                )}
                {status}
              </span>
            </span>
            <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={15} aria-hidden="true" />
                {dateFormatter.format(new Date(order.createdAt))}
              </span>
              <span>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-3">
            <span className="text-right">
              <span className="block text-xs text-zinc-500">Total</span>
              <span className="font-semibold">
                {currencyFormatter.format(order.totalPrice)}
              </span>
            </span>
            <ChevronDown
              size={18}
              aria-hidden="true"
              className="text-zinc-500 transition-transform group-open:rotate-180"
            />
          </span>
        </summary>

        <div className="border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-5 sm:px-7">
            <p className="mb-5 text-sm font-medium text-zinc-500">
              Order progress
            </p>
            <ol
              aria-label={`Order progress: ${status}`}
              className="mb-7 grid grid-cols-4"
            >
              {stages.map((stage, index) => (
                <li
                  key={stage.label}
                  className="relative flex flex-col items-center text-center"
                >
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className={`absolute top-2.5 right-1/2 left-[-50%] h-0.5 ${
                        stage.complete
                          ? "bg-zinc-900 dark:bg-white"
                          : "bg-zinc-200 dark:bg-zinc-700"
                      }`}
                    />
                  )}
                  <span
                    className={`z-10 size-5 rounded-full border-4 border-white dark:border-zinc-950 ${
                      stage.complete
                        ? "bg-zinc-900 dark:bg-white"
                        : "bg-zinc-200 dark:bg-zinc-700"
                    }`}
                  />
                  <span
                    className={`mt-2 text-[10px] sm:text-xs ${
                      stage.complete
                        ? "font-medium text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-400"
                    }`}
                  >
                    {stage.label}
                  </span>
                </li>
              ))}
            </ol>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {order.orderItems.map((item, index) => (
                <div
                  key={`${item._id}-${item.size}-${index}`}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
                    {item.frontImage ? (
                      <Image
                        src={item.frontImage}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <Package
                        className="absolute inset-0 m-auto text-zinc-400"
                        size={24}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-medium">{item.name}</h3>
                      <p className="mt-1 text-sm text-zinc-500">
                        {item.category} <span aria-hidden="true">·</span> Size:{" "}
                        {item.size} <span aria-hidden="true">·</span> Qty:{" "}
                        {item.qty}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-medium">
                      {currencyFormatter.format(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 border-t border-zinc-100 bg-zinc-50 px-5 py-5 sm:grid-cols-2 sm:px-7 dark:border-zinc-800 dark:bg-zinc-900/40">
            <section aria-labelledby={`shipping-${order._id}`}>
              <h3
                id={`shipping-${order._id}`}
                className="mb-3 inline-flex items-center gap-2 text-sm font-semibold"
              >
                <MapPin size={16} aria-hidden="true" />
                Shipping address
              </h3>
              <address className="space-y-1 text-sm not-italic leading-5 text-zinc-500">
                <p className="font-medium text-foreground">
                  {order.shippingAddress.fullName}
                </p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                {order.shippingAddress.landmark && (
                  <p>{order.shippingAddress.landmark}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p>{order.shippingAddress.phoneNumber}</p>
              </address>
            </section>

            <section aria-label="Payment summary" className="sm:justify-self-end">
              <h3 className="mb-3 text-sm font-semibold">Payment summary</h3>
              <dl className="min-w-52 space-y-2 text-sm">
                <div className="flex justify-between gap-5 text-zinc-500">
                  <dt>Items</dt>
                  <dd>{currencyFormatter.format(order.itemsPrice)}</dd>
                </div>
                <div className="flex justify-between gap-5 text-zinc-500">
                  <dt>Tax</dt>
                  <dd>{currencyFormatter.format(order.taxPrice)}</dd>
                </div>
                <div className="flex justify-between gap-5 text-zinc-500">
                  <dt>Shipping</dt>
                  <dd>{currencyFormatter.format(order.shippingPrice)}</dd>
                </div>
                <div className="flex justify-between gap-5 border-t border-zinc-200 pt-2 font-semibold dark:border-zinc-700">
                  <dt>Total paid</dt>
                  <dd>{currencyFormatter.format(order.totalPrice)}</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </details>
      <div className="flex justify-end border-t border-zinc-100 px-5 py-3 dark:border-zinc-800">
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link href="/contactUs">
            <CircleHelp size={16} aria-hidden="true" />
            Get help with this order
          </Link>
        </Button>
      </div>
    </article>
  )
}

export default function MyOrdersPage() {
  const [filter, setFilter] = useState<OrderFilter>("all")
  const userInfo = useSelector((state: RootState) => state.auth.userInfo)
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMyOrdersQuery(undefined, { skip: !userInfo })

  if (!userInfo) {
    return (
      <div className="mx-auto flex min-h-[70svh] max-w-375 items-center justify-center px-5 pt-28 pb-16">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
            <ShoppingBag size={26} aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold">Your orders, all in one place</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Sign in to view your purchases and delivery progress.
          </p>
          <Button asChild className="mt-6 rounded-xl">
            <Link href="/login">
              Sign in
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === "delivered") return isOrderDelivered(order)
    if (filter === "inProgress") return !isOrderDelivered(order)
    return true
  })

  return (
    <div className="mx-auto min-h-svh max-w-375 px-5 pt-32 pb-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-zinc-500">
              YOUR ACCOUNT
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              My orders
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              View your purchases and follow their delivery progress.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-xl">
            <Link href="/">
              Continue shopping
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-5" aria-label="Loading orders" role="status">
            {Array.from({ length: 2 }, (_, index) => (
              <Skeleton key={index} className="h-64 rounded-3xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorCard
            title="We couldn't load your orders"
            message={getErrorMessage(error)}
            onRetry={() => {
              void refetch()
            }}
          />
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-700">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
              <ShoppingBag size={24} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold">No orders yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
              Once you place an order, you&apos;ll find its details and delivery
              updates here.
            </p>
            <Button asChild className="mt-6 rounded-xl">
              <Link href="/">
                Explore the collection
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div
              className="mb-5 flex gap-2 border-b border-zinc-200 dark:border-zinc-800"
              role="group"
              aria-label="Filter orders"
            >
              {(
                [
                  ["all", "All orders", orders.length],
                  [
                    "inProgress",
                    "In progress",
                    orders.filter((order) => !isOrderDelivered(order)).length,
                  ],
                  [
                    "delivered",
                    "Delivered",
                    orders.filter(isOrderDelivered).length,
                  ],
                ] as const
              ).map(([value, label, count]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                  className={`-mb-px border-b-2 px-3 py-3 text-sm transition-colors ${
                    filter === value
                      ? "border-foreground font-semibold text-foreground"
                      : "border-transparent text-zinc-500 hover:text-foreground"
                  }`}
                >
                  {label} <span className="ml-1 text-xs">({count})</span>
                </button>
              ))}
            </div>

            {filteredOrders.length > 0 ? (
              <div className="space-y-5">
                {filteredOrders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl bg-zinc-50 px-5 py-10 text-center text-sm text-zinc-500 dark:bg-zinc-900">
                No orders in this section.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
