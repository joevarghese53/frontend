"use client"

import { AdminRouteGuard } from "@/components/admin/adminRouteGuard"

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminRouteGuard>{children}</AdminRouteGuard>
}
