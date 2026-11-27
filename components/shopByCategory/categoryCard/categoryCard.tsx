"use client"

import Image from "next/image"
import Link from "next/link"

export default function CategoryCard({
  categoryId,
  title,
  image,
}: {
  categoryId: string
  title: string
  image: string
}) {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(categoryId)}`}
      className="group relative block h-[70vw] max-h-105 min-h-64 w-full shrink-0 overflow-hidden rounded-2xl sm:h-105 sm:rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      {/* Image */}
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition duration-700 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      {/* Text */}
      <div className="absolute right-4 bottom-5 left-4 sm:right-6 sm:bottom-8 sm:left-6">
        <h2 className="mb-1 truncate text-lg font-semibold text-white sm:mb-2 sm:text-2xl">
          {title}
        </h2>

        <span className="text-xs text-white/80 sm:text-sm">Shop Now →</span>
      </div>
    </Link>
  )
}
