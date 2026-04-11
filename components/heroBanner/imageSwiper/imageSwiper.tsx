"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { MediaItem } from "../heroBanner"
import "./imageSwiper.css"

type Props = {
  media: MediaItem[]
}

const ImageSwiper = ({ media }: Props) => {
  const router = useRouter()

  const handleImageClick = (page: string) => {
    router.push(page)
  }

  return (
    <section aria-label="Image Slider" className="image-swiper-main-container">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="image-swiper"
      >
        {media.map(({ type, url, page }, index) => (
          <SwiperSlide key={index} className="image-swiper-slide">
            {type === "image" ? (
              <Image
                src={url}
                alt="slides"
                fill
                sizes="(max-width: 768px) 100vw, 1500px"
                className="img-swiper-img"
                onClick={() => handleImageClick(page)}
                priority={index === 0}
              />
            ) : (
              <video
                src={typeof url === "string" ? url : ""}
                className="img-swiper-img"
                onClick={() => handleImageClick(page)}
                autoPlay
                muted
                loop
                playsInline
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default ImageSwiper
