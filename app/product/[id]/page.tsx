"use client"
import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner"
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetProductDetailsQuery } from "@/redux/api/productApiSlice"
import { useAddToCartMutation } from "@/redux/api/cartApiSlice"
import { useCheckItemInWishlistQuery } from "@/redux/api/wishlistApiSlice"
import { ProductCardSkeleton } from "@/components/productCard/productCardSkeleton/productCardSkeleton";
import { ErrorCard } from "@/components/errorCard/errorCard";
import { Rating } from "@/components/ui/rating";
import { SizeSelector } from "@/components/ui/sizeSelector/SizeSelector";
import "./page.css"

const ProductPage = () => {
    const { id } = useParams()
    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(id)
    const { data: itemExistCheck } = useCheckItemInWishlistQuery(id)
    const [addToCart] = useAddToCartMutation();
    const { userInfo } = useSelector((state: RootState) => state.auth);
    console.log(product)

    const [qty, setQty] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const displayImage = selectedImage ?? product?.frontImage

    const handleAddToCart = async () => {
        if (!userInfo) {
            toast("Please login to continue.")
            return;
        }
        if (!selectedSize) {
            toast("Please select a size before adding to cart.")
            return;
        }
        if (!product || !product._id) {
            toast("Product information is not loaded yet.")
            return;
        }
        try {
            const cartData = { productId: product._id, quantity: qty, productType: 'Product', size: selectedSize };
            await addToCart(cartData).unwrap();
            toast(`${qty} ${product.name} added to the cart.`);
        } catch (error) {
            toast(`Error: ${error}`);
        }
    };

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
            <div className='image-container-desktop'>
                <div className='big-image-container'>
                    <Image
                        src={displayImage}
                        alt={product?.name}
                        className="product-detail-image"
                        width={300}
                        height={300}
                    />
                </div>
                <div className="small-images-container">
                    <Image
                        src={product?.frontImage}
                        alt={product?.name}
                        className="small-image"
                        onClick={() => setSelectedImage(product?.frontImage)}
                        width={300}
                        height={300}
                    />
                    <Image
                        src={product?.backImage}
                        alt={product?.name}
                        className="small-image"
                        onClick={() => setSelectedImage(product?.backImage)}
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
                {isLoading ? (
                    <p id="category">Loading...</p>
                ) : error ? (
                    <p id="category">Error loading category</p>
                ) : (
                    <p id="category">{product?.category?.name}</p>
                )}
                <div className="product-detail-review">
                    <Rating rate={product.rating} className="" showScore description={`from ${product.numReviews} reviews`} />
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
                        <button type="button" className="add-to-wishlist" onClick={handleRemoveFromWishlist}>
                            <GoHeartFill style={{ marginRight: '10px' }} />
                            Added to Wishlist
                        </button>
                    ) : (
                        <button type="button" className="add-to-wishlist" onClick={handleAddToWishlist}>
                            <GoHeart style={{ marginRight: '10px' }} />
                            Add to Wishlist
                        </button>
                    )}

                </div>
                <div className="product-detail-desc-buttons-mobile">
                    {itemExistCheck && itemExistCheck.exists ? (
                        <button type="button" className="add-to-wishlist" onClick={handleRemoveFromWishlist}>
                            <GoHeartFill style={{ marginRight: '10px' }} />
                            Wishlist
                        </button>
                    ) : (
                        <button type="button" className="add-to-wishlist" onClick={handleAddToWishlist}>
                            <GoHeart style={{ marginRight: '10px' }} />
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

export default ProductPage