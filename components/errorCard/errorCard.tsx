"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

type ErrorCardProps = {
  title?: string
  message?: string
  onRetry?: () => void
}

export default function ErrorCard({
  title = "Something went wrong",
  message = "We couldn't load the data. Please try again.",
  onRetry,
}: ErrorCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <AlertTriangle className="h-10 w-10 text-red-500" />

      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>

      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  )
}
