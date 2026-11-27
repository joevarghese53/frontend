"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function BackNavigation({
  fallbackHref = "/",
  className,
}: {
  fallbackHref?: string
  className?: string
}) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        "mb-4 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden",
        className
      )}
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Back
    </button>
  )
}
