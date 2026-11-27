
"use client"

import Image from "next/image"
import Link from "next/link"
import { FiTrash2 } from "react-icons/fi"
import type { CartItem } from "@/types/cartType"
import type { OrderItemResponse } from "@/types/orderType"
import "./page.css"

type CartItemsProps =
  | {
      variant?: "cart"
      items: CartItem[]
      onRemove: (item: CartItem) => void
      isRemoving: boolean
    }
  | {
      variant: "payment"
      items: OrderItemResponse[]
      onRemove?: never
      isRemoving?: never
    }

type DisplayItem = {
  key: string
  productId: string
  productType: string
  name: string
  category: string
  frontImage: string
  size: string
  quantity: number
  price: number
  original: CartItem | null
}

const CartItems = (props: CartItemsProps) => {
  const { variant = "cart", items } = props
  const onRemove = "onRemove" in props ? props.onRemove : undefined
  const isRemoving = "isRemoving" in props ? props.isRemoving : false
  const displayItems: DisplayItem[] = variant === "payment"
    ? (items as OrderItemResponse[]).map((item) => ({
        key: item._id,
        productId: item._id,
        productType: item.productType,
        name: item.name,
        category: item.category,
        frontImage: item.frontImage,
        size: item.size,
        quantity: item.qty,
        price: item.price,
        original: null,
      }))
    : (items as CartItem[]).map((item) => ({
        key: item._id,
        productId: item.productId._id,
        productType: item.productType,
        name: item.productId.name,
        category: item.productId.category,
        frontImage: item.productId.frontImage,
        size: item.size,
        quantity: item.quantity,
        price: item.productId.price,
        original: item,
      }))

  const itemCount = displayItems.reduce(
    (total, item) => total + item.quantity,
    0,
  )

  return (
    <section
      className="cart-items-section"
      aria-labelledby="cart-items-heading"
    >
      {variant === "cart" && (
        <div className="cart-items-header">
        <h3 id="cart-items-heading">ITEMS</h3>

        <span className="cart-items-count">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        </div>
      )}

      <div className="cart-items-list">
        {displayItems.map((item) => (
          <article
            className="cart-item-card"
            key={item.key}
          >
            <div className="cart-item-image">
              <Link
                href={
                  item.productType === "CProduct"
                    ? `/cproduct/${item.productId}`
                    : `/product/${item.productId}`
                }
                aria-label={`View ${item.name}`}
              >
                <Image
                  src={item.frontImage}
                  alt={item.name}
                  width={130}
                  height={170}
                  sizes="130px"
                />
              </Link>
            </div>

            <div className="cart-item-details">
              <div className="cart-item-info">
                <div>
                  <h4 className="cart-item-name">
                    <Link
                      href={
                        item.productType === "CProduct"
                          ? `/cproduct/${item.productId}`
                          : `/product/${item.productId}`
                      }
                    >
                      {item.name}
                    </Link>
                  </h4>

                  <p className="cart-item-category">
                    {item.category}
                  </p>
                </div>

                <div className="cart-item-meta">
                  <span className="cart-item-size">
                    Size: {item.size}
                  </span>

                  <span className="cart-item-quantity">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>

              <div className="cart-item-price">
                <div className="cart-item-price-details">
                  <span className="cart-item-price-amount">
                    ₹{item.price.toFixed(2)}
                  </span>

                  <span className="cart-item-price-note">
                    MRP inclusive of all taxes
                  </span>
                </div>

                {variant === "cart" && item.original && (
                  <button
                    type="button"
                    className="cart-item-remove"
                    onClick={() => {
                      if (onRemove && item.original) {
                        onRemove(item.original)
                      }
                    }}
                    disabled={isRemoving}
                    aria-label={`Remove ${item.name} from cart`}
                    title="Remove item"
                  >
                    <FiTrash2 aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CartItems
