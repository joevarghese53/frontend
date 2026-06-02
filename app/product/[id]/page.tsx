"use client"
import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { GoHeart, GoHeartFill } from "react-icons/go"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useGetProductDetailsQuery } from "@/redux/api/productApiSlice"
import {
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
} from "@/redux/api/wishlistApiSlice"
import { useAddToCartMutation } from "@/redux/api/cartApiSlice"
import { useCheckItemInWishlistQuery } from "@/redux/api/wishlistApiSlice"
import { useCreateReviewMutation } from "@/redux/api/productApiSlice"
import { ProductCardSkeleton } from "@/components/productCard/productCardSkeleton/productCardSkeleton"
import { ErrorCard } from "@/components/errorCard/errorCard"
import { Rating } from "@/components/ui/rating"
import { SizeSelector } from "@/components/ui/sizeSelector/sizeSelector"
import type { ProductType, ReviewType } from "@/types/productType"
import "./page.css"

const ProductPage = () => {
    const params = useParams()
    const productId = typeof params.id === "string" ? params.id : params.id?.[0] ?? ""
    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(
        productId,
        { skip: !productId }
    )
    const { data: itemExistCheck } = useCheckItemInWishlistQuery(productId, {
        skip: !productId,
    })
    const [addToCart] = useAddToCartMutation()
    const [addToWishlist] = useAddToWishlistMutation()
    const [removeFromWishlist] = useRemoveFromWishlistMutation()
    const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation()
    const { userInfo } = useSelector((state: RootState) => state.auth)

    const [qty, setQty] = useState(1)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const displayImage = selectedImage ?? product?.frontImage

    const handleAddToCart = async () => {
        if (!userInfo) {
            toast("Please login to continue.")
            return
        }

        if (!selectedSize) {
            toast("Please select a size before adding to cart.")
            return
        }

        if (!product || !product._id) {
            toast("Product information is not loaded yet.")
            return
        }

        try {
            const cartData = {
                productId: product._id,
                quantity: qty,
                productType: "Product",
                size: selectedSize,
            }

            await addToCart(cartData).unwrap()
            toast(`${qty} ${product.name} added to the cart.`)
        } catch (error) {
            toast(`Error: ${error}`)
        }
    }

    const handleAddToWishlist = async () => {
        if (!userInfo) {
            toast("Please login to continue.")
            return
        }

        if (!productId) {
            return
        }

        try {
            await addToWishlist({ productId }).unwrap()
            toast("Added to wishlist.")
        } catch (error) {
            toast(`Error: ${error}`)
        }
    }

    const handleRemoveFromWishlist = async () => {
        if (!userInfo) {
            toast("Please login to continue.")
            return
        }

        if (!productId) {
            return
        }

        try {
            await removeFromWishlist(productId).unwrap()
            toast("Removed from wishlist.")
        } catch (error) {
            toast(`Error: ${error}`)
        }
    }

    const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!userInfo) {
            toast("Please login to review the product.")
            return
        }

        if (!productId) {
            return
        }

        try {
            await createReview({ productId, rating, comment }).unwrap()
            toast("Review submitted successfully.")
            setComment("")
            setRating(5)
            await refetch()
        } catch (error) {
            toast(`Error: ${error}`)
        }
    }

    if (isLoading) {
        return (
            <div className="product-detail-container">
                {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="product-detail-container">
                <ErrorCard
                    title="Failed to load!"
                    message="Please check again later."
                    onRetry={refetch}
                />
            </div>
        )
    }


    return (
        <div className="product-detail-container">
            <div className="image-container-desktop">
                <div className="big-image-container">
                    <Image
                        src={displayImage ?? product.frontImage}
                        alt={product?.name}
                        className="product-detail-image"
                        width={300}
                        height={300}
                    />
                </div>
                <div className="small-images-container">
                    <Image
                        src={product.frontImage}
                        alt={product?.name}
                        className="small-image"
                        onClick={() => setSelectedImage(product.frontImage)}
                        width={300}
                        height={300}
                    />
                    <Image
                        src={product.backImage}
                        alt={product?.name}
                        className="small-image"
                        onClick={() => setSelectedImage(product.backImage)}
                        width={300}
                        height={300}
                    />
                    {product?.images?.map((item: string, i: number) => (
                        <Image
                            key={i}
                            src={item}
                            alt={product.name}
                            className="small-image"
                            onClick={() => setSelectedImage(item)}
                            width={300}
                            height={300}
                        />
                    ))}
                </div>
            </div>
            <div className="product-detail-desc">
                <h1>{product.name}</h1>
                <p id="category">{product?.category?.name}</p>
                <div className="product-detail-review">
                    {product.numReviews > 0 && (
                        <Rating
                            rate={product.rating}
                            className="mt-4"
                            showScore
                            // description={`from ${product.numReviews} reviews`}
                        />
                    )}
                </div>
                <p className="price">₹{product.price}</p>
                <p className="tax">Inclusive of all taxes</p>
                <div className="size-chart">
                    <SizeSelector onSizeSelect={setSelectedSize} category={product?.category?.name} />
                </div>
                <div className="quantity">
                    <span>Quantity:</span>
                    {product.countInStock > 0 && (
                        <div>
                            <select
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                                className="select-quantity"
                            >
                                {[...Array(product.countInStock).keys()].map((x) => (
                                    <option key={x + 1} value={x + 1}>
                                        {x + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <div className="product-detail-desc-buttons-desktop">
                    <button
                        type="button"
                        disabled={product.countInStock === 0}
                        className="add-to-cart"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                    {itemExistCheck && itemExistCheck.exists ? (
                        <button
                            type="button"
                            className="add-to-wishlist"
                            onClick={handleRemoveFromWishlist}
                        >
                            <GoHeartFill style={{ marginRight: "10px" }} />
                            Added to Wishlist
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="add-to-wishlist"
                            onClick={handleAddToWishlist}
                        >
                            <GoHeart style={{ marginRight: "10px" }} />
                            Add to Wishlist
                        </button>
                    )}
                </div>
                <div className="product-detail-desc-buttons-mobile">
                    {itemExistCheck && itemExistCheck.exists ? (
                        <button
                            type="button"
                            className="add-to-wishlist"
                            onClick={handleRemoveFromWishlist}
                        >
                            <GoHeartFill style={{ marginRight: "10px" }} />
                            Wishlist
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="add-to-wishlist"
                            onClick={handleAddToWishlist}
                        >
                            <GoHeart style={{ marginRight: "10px" }} />
                            Wishlist
                        </button>
                    )}
                    <button
                        type="button"
                        disabled={product.countInStock === 0}
                        className="add-to-cart"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                </div>
                <PinCodeCheck />
                <div className="product-details">
                    <ProductInfo title="Product Description" content={product.description} />
                    <ProductInfo title="Offers" content={product.offers} />
                    <ProductInfo title="Returns & Exchange" content={product.returnpolicy} />
                </div>
                <ReviewTabs
                    loadingProductReview={loadingProductReview}
                    userInfo={userInfo}
                    submitHandler={submitHandler}
                    rating={rating}
                    setRating={setRating}
                    comment={comment}
                    setComment={setComment}
                    product={product}
                />
            </div>
        </div>
    )
}

type ProductInfoProps = {
    title: string
    content?: string
}

function ProductInfo({ title, content }: ProductInfoProps) {
    return (
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-black/60">
                {title}
            </h2>
            <p className="text-sm leading-6 text-black/80">{content || "Not available."}</p>
        </section>
    )
}

function PinCodeCheck() {
    const [pinCode, setPinCode] = useState("")

    return (
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/60">
                Check Delivery
            </h2>
            <div className="flex gap-3">
                <input
                    value={pinCode}
                    onChange={(event) => setPinCode(event.target.value)}
                    placeholder="Enter pincode"
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                />
                <button type="button" className="rounded-xl bg-black px-4 py-3 text-sm text-white">
                    Check
                </button>
            </div>
        </section>
    )
}

type ReviewTabsProps = {
    loadingProductReview: boolean
    userInfo: RootState["auth"]["userInfo"]
    submitHandler: (event: FormEvent<HTMLFormElement>) => void
    rating: number
    setRating: Dispatch<SetStateAction<number>>
    comment: string
    setComment: Dispatch<SetStateAction<string>>
    product: ProductType
}

function ReviewTabs({
    loadingProductReview,
    userInfo,
    submitHandler,
    rating,
    setRating,
    comment,
    setComment,
    product,
}: ReviewTabsProps) {
    return (
        <section className="mt-8 space-y-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-black/60">
                    Reviews
                </h2>
                <div className="mt-4 space-y-4">
                    {product.reviews.length ? (
                        product.reviews.map((review: ReviewType) => (
                            <article key={review._id ?? `${review.user}-${review.createdAt}`} className="rounded-xl bg-white/60 p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <strong>{review.name}</strong>
                                    <span className="text-sm text-black/60">{review.rating.toFixed(1)}</span>
                                </div>
                                <p className="mt-2 text-sm text-black/75">{review.comment}</p>
                            </article>
                        ))
                    ) : (
                        <p className="text-sm text-black/60">No reviews yet.</p>
                    )}
                </div>
            </div>

            <form onSubmit={submitHandler} className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-black/60">
                    Write a Review
                </h3>
                <label className="block space-y-2 text-sm">
                    <span>Rating</span>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={rating}
                        onChange={(event) => setRating(Number(event.target.value))}
                        className="w-full"
                    />
                </label>
                <label className="block space-y-2 text-sm">
                    <span>Comment</span>
                    <textarea
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none"
                        placeholder={userInfo ? "Share your thoughts" : "Login to write a review"}
                        disabled={!userInfo}
                    />
                </label>
                <button
                    type="submit"
                    disabled={!userInfo || loadingProductReview}
                    className="rounded-xl bg-black px-5 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loadingProductReview ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        </section>
    )
}
export default ProductPage