"use client"
import { StaticImageData } from "next/image"
import ImageSlider from "./imageSlider/imageSlider"
import ImageSwiper from "./imageSwiper/imageSwiper"
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice"
import slide1 from "@/public/images/slides/desktop/slide-01.png"
import slide2 from "@/public/images/slides/desktop/slide-02.png"
import slide3 from "@/public/images/slides/desktop/slide-03.png"
import slide4 from "@/public/images/slides/desktop/slide-04.png"
import slide5 from "@/public/images/slides/desktop/slide-05.png"
import slide6 from "@/public/images/slides/desktop/slide-06.png"
import mslide1 from "@/public/images/slides/mobile/mslide-01.png"
import mslide2 from "@/public/images/slides/mobile/mslide-02.png"
import mslide3 from "@/public/images/slides/mobile/mslide-03.png"
import mslide4 from "@/public/images/slides/mobile/mslide-04.png"
import mslide5 from "@/public/images/slides/mobile/mslide-05.png"
import mslide6 from "@/public/images/slides/mobile/mslide-06.png"
import "./heroBanner.css"

export type MediaItem =
  | {
      type: "image"
      url: string | StaticImageData
      page: string
    }
  | {
      type: "video"
      url: string
      page: string
    }

const HeroBanner = () => {
  const { data: categories } = useFetchCategoriesQuery()
  const categoryPage = (index: number) => {
    const categoryId = categories?.[index]?._id
    return categoryId
      ? `/products?category=${encodeURIComponent(categoryId)}`
      : "/products"
  }

  const desktopMedia: MediaItem[] = [
    // { type: 'video', url: video1, alt: "video1" },
    { type: "image", url: slide1, page: "/customs" },
    {
      type: "image",
      url: slide2,
      page: categoryPage(0),
    },
    {
      type: "image",
      url: slide3,
      page: categoryPage(1),
    },
    {
      type: "image",
      url: slide4,
      page: categoryPage(2),
    },
    { type: "image", url: slide5, page: "/customs" },
    { type: "image", url: slide6, page: "/customs" },
  ]

  const mobileMedia: MediaItem[] = [
    { type: "image", url: mslide1, page: "/customs" },
    {
      type: "image",
      url: mslide2,
      page: categoryPage(0),
    },
    {
      type: "image",
      url: mslide3,
      page: categoryPage(1),
    },
    {
      type: "image",
      url: mslide4,
      page: categoryPage(2),
    },
    { type: "image", url: mslide5, page: "/customs" },
    { type: "image", url: mslide6, page: "/customs" },
  ]

  return (
    <>
      <div className="hero-banner-desktop-container">
        <ImageSlider media={desktopMedia} />
      </div>
      <div className="hero-banner-mobile-container">
        <ImageSwiper media={mobileMedia} />
      </div>
    </>
  )
}

export default HeroBanner
