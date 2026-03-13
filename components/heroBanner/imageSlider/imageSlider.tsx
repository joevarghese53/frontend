"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { MediaItem } from "../heroBanner"
import Image from "next/image"
import "./imageSlider.css"

type Props = {
  media: MediaItem[]
}

export default function ImageSlider({ media }: Props) {
  const [mediaIndex, setMediaIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()

  const showNextMedia = useCallback(() => {
    setMediaIndex((index) => (index === media.length - 1 ? 0 : index + 1))
  }, [media.length])

  const showPrevMedia = useCallback(() => {
    setMediaIndex((index) => (index === 0 ? media.length - 1 : index - 1))
  }, [media.length])

  function handleImageClick(page: string) {
    router.push(page)
  }

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(showNextMedia, 3500)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, showNextMedia])

  const sliderTrackStyle = {
    display: "flex",
    transition: "transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)",
    transform: `translateX(${-100 * mediaIndex}%)`,
    width: `${media.length * 100}%`,
    height: "100%",
  }

  const slideStyle = {
    minWidth: "100%",
    cursor: "pointer",
    position: "relative" as const,
    height: "100%",
  }

  return (
    <section
      aria-label="Image Slider"
      className="image-slider-main-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div style={{ display: "flex", overflow: "hidden", height: "100%" }}>
        <div style={sliderTrackStyle}>
          {media.map(({ type, url, page }, index) => (
            <div key={index} style={slideStyle}>
              {type === "image" ? (
                <Image
                  src={url}
                  alt="slides"
                  fill
                  sizes="100vw"
                  onClick={() => handleImageClick(page)}
                  aria-hidden={mediaIndex !== index}
                  className="img-slider-img"
                  priority={index === 0}
                />
              ) : (
                <video
                  src=""
                  onClick={() => handleImageClick(page)}
                  aria-hidden={mediaIndex !== index}
                  className="img-slider-video"
                  autoPlay
                  muted
                  loop
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={showPrevMedia}
        className="img-slider-btn"
        aria-label="View Previous Media"
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={showNextMedia}
        className="img-slider-btn"
        style={{ right: 0 }}
        aria-label="View Next Media"
      >
        <FaChevronRight />
      </button>
    </section>
  )
}
