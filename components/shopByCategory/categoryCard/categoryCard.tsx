"use client"

import Image from "next/image"

export default function CategoryCard({
  title,
  image,
}: {
  title: string
  image: string
}) {
  return (
    <div className="group relative h-105 min-w-70 shrink-0 cursor-pointer overflow-hidden rounded-3xl">
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
      <div className="absolute right-6 bottom-8 left-6">
        <h2 className="mb-2 text-2xl font-semibold text-white">{title}</h2>

        <span className="text-sm text-white/80">Shop Now →</span>
      </div>
    </div>
  )
}
