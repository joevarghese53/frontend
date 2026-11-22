"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { FaRegBuilding } from "react-icons/fa"
import {
  FiCheck,
  FiEdit3,
  FiHome,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiTag,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi"
import { toast } from "sonner"
import { ErrorCard } from "@/components/errorCard/errorCard"
import { calculateCartTotals } from "@/lib/cartPricing"
import { useGetCartQuery } from "@/redux/api/cartApiSlice"
import {
  useCreateShippingAddressMutation,
  useDeleteShippingAddressMutation,
  useGetUserShippingAddressesQuery,
  useSetDefaultShippingAddressMutation,
  useUpdateShippingAddressMutation,
} from "@/redux/api/shippingAddressApiSlice"
import { selectShippingAddress } from "@/redux/state/checkout/checkoutSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import type {
  ShippingAddress,
  ShippingAddressInput,
} from "@/types/shippingAddressType"
import CheckoutSteps from "@/components/checkoutSteps/checkoutSteps"
import "./page.css"
import OrderSummary from "@/components/orderSummary/page"

const createEmptyAddress = (): ShippingAddressInput => ({
  fullName: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
  phoneNumber: "",
  label: "Home",
  country: "India",
})

function getErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null) {
    return "An unexpected error occurred."
  }

  if ("data" in error) {
    const data = error.data
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message
    }
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message
  }

  if ("error" in error && typeof error.error === "string") {
    return error.error
  }

  return "An unexpected error occurred."
}

function getAddressId(value: unknown): string | null {
  if (
    typeof value === "object" &&
    value !== null &&
    "_id" in value &&
    typeof value._id === "string"
  ) {
    return value._id
  }

  return null
}

const AddressPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const userInfo = useSelector((state: RootState) => state.auth.userInfo)
  const selectedAddress = useSelector(
    (state: RootState) => state.checkout.selectedAddress
  )
  const {
    data: addresses,
    isLoading: isAddressLoading,
    error: addressError,
    refetch: refetchAddresses,
  } = useGetUserShippingAddressesQuery(undefined, { skip: !userInfo })
  const {
    data: cartData,
    isLoading: isCartLoading,
    error: cartError,
    refetch: refetchCart,
  } = useGetCartQuery(undefined, { skip: !userInfo })

  const [createShippingAddress, { isLoading: isCreating }] =
    useCreateShippingAddressMutation()
  const [updateShippingAddress, { isLoading: isUpdating }] =
    useUpdateShippingAddressMutation()
  const [deleteShippingAddress, { isLoading: isDeleting }] =
    useDeleteShippingAddressMutation()
  const [setDefaultShippingAddress, { isLoading: isSettingDefault }] =
    useSetDefaultShippingAddressMutation()

  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(
    null
  )
  const [showForm, setShowForm] = useState(false)
  const [newAddress, setNewAddress] =
    useState<ShippingAddressInput>(createEmptyAddress)
  const isSaving = isCreating || isUpdating

  useEffect(() => {
    if (!addresses) return

    const selectedIsAvailable =
      selectedAddress &&
      addresses.some((address) => address._id === selectedAddress._id)
    if (selectedIsAvailable) {
      try {
        localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress))
      } catch (error) {
        console.error("Could not persist the selected address:", error)
      }
      return
    }

    let storedAddressId: string | null = null
    try {
      const savedAddress = localStorage.getItem("selectedAddress")
      if (savedAddress) {
        storedAddressId = getAddressId(JSON.parse(savedAddress))
      }
    } catch (error) {
      console.error("Could not read the selected address:", error)
      localStorage.removeItem("selectedAddress")
    }

    const nextAddress =
      addresses.find((address) => address._id === storedAddressId) ??
      addresses.find((address) => address.isDefault) ??
      addresses[0] ??
      null

    dispatch(selectShippingAddress(nextAddress))
    if (!nextAddress) {
      try {
        localStorage.removeItem("selectedAddress")
      } catch (error) {
        console.error("Could not clear the selected address:", error)
      }
    }
  }, [addresses, dispatch, selectedAddress])

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.currentTarget
    setNewAddress((currentAddress) => {
      switch (name) {
        case "fullName":
          return { ...currentAddress, fullName: value }
        case "addressLine1":
          return { ...currentAddress, addressLine1: value }
        case "addressLine2":
          return { ...currentAddress, addressLine2: value }
        case "landmark":
          return { ...currentAddress, landmark: value }
        case "city":
          return { ...currentAddress, city: value }
        case "state":
          return { ...currentAddress, state: value }
        case "country":
          return { ...currentAddress, country: value }
        case "label":
          if (value === "Home" || value === "Office" || value === "Other") {
            return { ...currentAddress, label: value }
          }
          return currentAddress
        default:
          return currentAddress
      }
    })
  }

  const handleCancel = () => {
    setEditingAddress(null)
    setShowForm(false)
    setNewAddress(createEmptyAddress())
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      if (editingAddress) {
        await updateShippingAddress({
          id: editingAddress._id,
          updatedAddress: newAddress,
        }).unwrap()
        toast.success("Address updated.")
      } else {
        await createShippingAddress(newAddress).unwrap()
        toast.success("Address added.")
      }

      handleCancel()
    } catch (error) {
      toast.error(`Could not save address: ${getErrorMessage(error)}`)
    }
  }

  const handleEdit = (address: ShippingAddress) => {
    setEditingAddress(address)
    setNewAddress({
      fullName: address.fullName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 ?? "",
      landmark: address.landmark ?? "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      phoneNumber: address.phoneNumber,
      label: address.label,
      country: address.country ?? "India",
    })
    setShowForm(true)
  }

  const handleDelete = async (address: ShippingAddress) => {
    if (address.isDefault) {
      toast.error(
        "Set another address as default before deleting this address."
      )
      return
    }

    if (!window.confirm("Remove this address?")) return

    try {
      await deleteShippingAddress(address._id).unwrap()
      toast.success("Address removed.")
    } catch (error) {
      toast.error(`Could not remove address: ${getErrorMessage(error)}`)
    }
  }

  const handleSetAsDefault = async (address: ShippingAddress) => {
    try {
      await setDefaultShippingAddress(address._id).unwrap()
      dispatch(selectShippingAddress({ ...address, isDefault: true }))
      toast.success("Default address updated.")
    } catch (error) {
      toast.error(`Could not update default address: ${getErrorMessage(error)}`)
    }
  }

  const handleAddNew = () => {
    setEditingAddress(null)
    setNewAddress(createEmptyAddress())
    setShowForm(true)
  }

  if (!userInfo) {
    return (
      <div className="address-page-main-container">
        <div className="address-empty-state">
          <h2>Sign in to manage delivery addresses</h2>
          <Link href="/login" className="address-return-link">
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  if (isAddressLoading || isCartLoading) {
    return (
      <div className="address-page-main-container">
        <div className="address-loading-state" role="status" aria-live="polite">
          <div className="address-loading-spinner" />
          <p>Loading address and cart details…</p>
        </div>
      </div>
    )
  }

  const cartNotFound = cartError && getErrorMessage(cartError) === "Cart not found"
  if (addressError || (cartError && !cartNotFound)) {
    return (
      <div className="address-page-main-container">
        <ErrorCard
          title="Could not load checkout details"
          message={
            addressError
              ? getErrorMessage(addressError)
              : getErrorMessage(cartError)
          }
          onRetry={() => {
            void refetchAddresses()
            void refetchCart()
          }}
        />
      </div>
    )
  }

  if (!addresses || (!cartData && !cartNotFound)) {
    return (
      <div className="address-page-main-container">
        <ErrorCard
          title="Checkout details are unavailable"
          message="Please try loading your addresses and cart again."
          onRetry={() => {
            void refetchAddresses()
            void refetchCart()
          }}
        />
      </div>
    )
  }

  const cartItems = cartData?.items ?? []
  if (cartItems.length === 0) {
    return (
      <div className="address-page-main-container">
        <div className="address-empty-state">
          <h2>Your cart is empty</h2>
          <p>Add items to your cart before choosing a delivery address.</p>
          <Link href="/cart" className="address-return-link">
            Return to cart
          </Link>
        </div>
      </div>
    )
  }

  const addressList = addresses
  const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
    calculateCartTotals(cartItems)

  return (
    <div className="address-page-main-container">
      <CheckoutSteps currentStep="address" />

      <div className="cart-content-wrapper">

        <section className="addresses-section" aria-labelledby="deliver-to-heading">
          <div className="addresses-header">
            <h2 id="deliver-to-heading">Deliver To:</h2>
            <button
              type="button"
              className="add-address-button"
              onClick={handleAddNew}
            >
              <FiPlus aria-hidden="true" />
              Add New Address
            </button>
          </div>

          {addressList.length > 0 ? (
            <div className="addresses-container">
              {addressList.map((address) => {
                const isSelected = selectedAddress?._id === address._id

                return (
                  <article
                    key={address._id}
                    className={`address-select-container ${isSelected ? "selected" : ""}`}
                  >
                    <div className="address-card-header">
                      <div className="address-card-header-left">
                        <div className="address-icon" aria-hidden="true">
                          {address.label === "Home" && <FiHome />}
                          {address.label === "Office" && <FaRegBuilding />}
                          {address.label === "Other" && <FiMapPin />}
                        </div>
                        <div className="address-default-label">
                          {address.isDefault ? (
                            <span className="default-badge">
                              <FiCheck aria-hidden="true" /> DEFAULT
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="set-as-default-btn"
                              onClick={() => void handleSetAsDefault(address)}
                              disabled={isSettingDefault}
                            >
                              SET AS DEFAULT
                            </button>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <span className="address-selection-indicator" aria-label="Selected">
                          <FiCheck aria-hidden="true" />
                        </span>
                      )}
                    </div>

                    <div className="address-details">
                      <p className="address-text">
                        {address.fullName}
                        <br />
                        {address.addressLine1}
                        <br />
                        {address.addressLine2 && (
                          <>
                            {address.addressLine2}
                            <br />
                          </>
                        )}
                        {address.landmark && (
                          <>
                            {address.landmark}
                            <br />
                          </>
                        )}
                        {address.city} - {address.postalCode}, {address.state},{" "}
                        {address.country ?? "India"}
                        <br />
                        <span className="contact-info">
                          <FiPhone className="contact-icon" aria-hidden="true" />
                          {address.phoneNumber}
                        </span>
                      </p>
                    </div>

                    <div className="button-container">
                      <button
                        type="button"
                        className="address-page-button edit-button"
                        onClick={() => handleEdit(address)}
                      >
                        <FiEdit3 aria-hidden="true" />
                        Edit
                      </button>
                      <button
                        type="button"
                        className="address-page-button remove-button"
                        onClick={() => void handleDelete(address)}
                        disabled={isDeleting}
                      >
                        <FiTrash2 aria-hidden="true" />
                        Remove
                      </button>
                      <button
                        type="button"
                        className={`address-page-button select-button ${isSelected ? "selected" : ""}`}
                        onClick={() => dispatch(selectShippingAddress(address))}
                        aria-pressed={isSelected}
                      >
                        {isSelected ? (
                          <FiCheck aria-hidden="true" />
                        ) : (
                          <FiMapPin aria-hidden="true" />
                        )}
                        {isSelected ? "Selected" : "Select"}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="address-empty-state">
              <div className="address-empty-icon" aria-hidden="true">
                <FiMapPin />
              </div>
              <h3>No addresses found</h3>
              <p>Add your first delivery address to continue.</p>
              <button
                type="button"
                className="add-address-button primary"
                onClick={handleAddNew}
              >
                <FiPlus aria-hidden="true" />
                Add Address
              </button>
            </div>
          )}
        </section>
        <aside className="cart-sidebar">
          <OrderSummary
            itemsPrice={itemsPrice}
            taxPrice={taxPrice}
            shippingPrice={shippingPrice}
            totalPrice={totalPrice}
          />

          {selectedAddress ? (
            <Link href="/checkout" className="cart-checkout-button">
              Proceed to Checkout
            </Link>
          ) : (
            <button
              type="button"
              className="cart-checkout-button"
              disabled
            >
              Select Address to Continue
            </button>
          )}
        </aside>

      </div>

      <div className="cart-mobile-bottom">
        {selectedAddress ? (
          <Link href="/checkout" className="cart-mobile-checkout">
            Proceed to Checkout
          </Link>
        ) : (
          <button type="button" className="cart-mobile-checkout" disabled>
            Select Address
          </button>
        )}
      </div>

      {showForm && (
        <div className="address-modal-overlay">
          <section
            className="address-modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="address-form-heading"
          >
            <form onSubmit={handleSubmit} className="address-form">
              <div className="form-header">
                <h2 id="address-form-heading">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  type="button"
                  className="form-close-button"
                  onClick={handleCancel}
                  aria-label="Close address form"
                >
                  <FiX aria-hidden="true" />
                </button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">
                    <FiUser className="input-icon" aria-hidden="true" />
                    Full Name
                  </label>
                  <input
                    autoFocus
                    type="text"
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={newAddress.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="addressLine1">
                    <FiHome className="input-icon" aria-hidden="true" />
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    autoComplete="address-line1"
                    placeholder="House number and street"
                    value={newAddress.addressLine1}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="addressLine2">
                    <FiHome className="input-icon" aria-hidden="true" />
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    autoComplete="address-line2"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={newAddress.addressLine2}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="landmark">
                    <FaRegBuilding className="input-icon" aria-hidden="true" />
                    Landmark
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    placeholder="Landmark (optional)"
                    value={newAddress.landmark}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">
                    <FiMapPin className="input-icon" aria-hidden="true" />
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    placeholder="Enter your city"
                    value={newAddress.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">
                    <FiMapPin className="input-icon" aria-hidden="true" />
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    autoComplete="address-level1"
                    placeholder="Enter your state"
                    value={newAddress.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">
                    <FiMapPin className="input-icon" aria-hidden="true" />
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="6-digit postal code"
                    value={newAddress.postalCode}
                    onChange={(event) =>
                      setNewAddress((currentAddress) => ({
                        ...currentAddress,
                        postalCode: event.currentTarget.value
                          .replace(/\D/g, "")
                          .slice(0, 6),
                      }))
                    }
                    pattern="[0-9]{6}"
                    title="Enter a 6-digit postal code."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">
                    <FiMapPin className="input-icon" aria-hidden="true" />
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    value={newAddress.country ?? ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    <FiPhone className="input-icon" aria-hidden="true" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    autoComplete="tel-national"
                    inputMode="numeric"
                    placeholder="10-digit contact number"
                    value={newAddress.phoneNumber}
                    onChange={(event) =>
                      setNewAddress((currentAddress) => ({
                        ...currentAddress,
                        phoneNumber: event.currentTarget.value
                          .replace(/\D/g, "")
                          .slice(0, 10),
                      }))
                    }
                    pattern="[6-9][0-9]{9}"
                    title="Enter a valid 10-digit Indian phone number."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="label">
                    <FiTag className="input-icon" aria-hidden="true" />
                    Label
                  </label>
                  <select
                    id="label"
                    name="label"
                    value={newAddress.label}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="form-cancel-button"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  className="address-form-submit"
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Saving…"
                    : editingAddress
                      ? "Update Address"
                      : "Add Address"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default AddressPage
