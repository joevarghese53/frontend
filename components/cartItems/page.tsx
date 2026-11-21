
"use client"

import Image from "next/image"
import { FiTrash2 } from "react-icons/fi"
import type { CartItem } from "@/types/cartType"
import "./page.css"

interface CartItemsProps {
  items: CartItem[]
  onRemove: (item: CartItem) => void
  isRemoving: boolean
}

const CartItems = ({
  items,
  onRemove,
  isRemoving,
}: CartItemsProps) => {
  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  )

  return (
    <section
      className="cart-items-section"
      aria-labelledby="cart-items-heading"
    >
      <div className="cart-items-header">
        <h3 id="cart-items-heading">ITEMS</h3>

        <span className="cart-items-count">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="cart-items-list">
        {items.map((item) => (
          <article
            className="cart-item-card"
            key={item._id}
          >
            <div className="cart-item-image">
              <Image
                src={item.productId.frontImage}
                alt={item.productId.name}
                width={130}
                height={170}
                sizes="130px"
              />
            </div>

            <div className="cart-item-details">
              <div className="cart-item-info">
                <div>
                  <h4 className="cart-item-name">
                    {item.productId.name}
                  </h4>

                  <p className="cart-item-category">
                    {item.productId.category}
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
                    ₹{item.productId.price.toFixed(2)}
                  </span>

                  <span className="cart-item-price-note">
                    MRP inclusive of all taxes
                  </span>
                </div>

                <button
                  type="button"
                  className="cart-item-remove"
                  onClick={() => onRemove(item)}
                  disabled={isRemoving}
                  aria-label={`Remove ${item.productId.name} from cart`}
                  title="Remove item"
                >
                  <FiTrash2 aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CartItems
