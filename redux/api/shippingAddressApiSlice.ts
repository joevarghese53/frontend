// redux/api/shippingAdressApiSlice.js
import { apiSlice } from './apiSlice';
import { SHIPPING_ADDRESS_URL } from "../constants";
import type {
  ShippingAddress,
  ShippingAddressInput,
} from "@/types/shippingAddressType";

export const shippingAddressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserShippingAddresses: builder.query<ShippingAddress[], void>({
      query: () => ({
        url: SHIPPING_ADDRESS_URL,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['ShippingAddress'],
    }),
    createShippingAddress: builder.mutation<unknown, ShippingAddressInput>({
      query: (newAddress) => ({
        url: SHIPPING_ADDRESS_URL,
        method: 'POST',
        body: newAddress,
        credentials: 'include',
      }),
      invalidatesTags: ['ShippingAddress'],
    }),
    updateShippingAddress: builder.mutation<
      unknown,
      { id: string; updatedAddress: ShippingAddressInput }
    >({
      query: ({ id, updatedAddress }) => ({
        url: `${SHIPPING_ADDRESS_URL}/${id}`,
        method: 'PUT',
        body: updatedAddress,
        credentials: 'include',
      }),
      invalidatesTags: ['ShippingAddress'],
    }),
    deleteShippingAddress: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `${SHIPPING_ADDRESS_URL}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['ShippingAddress'],
    }),
    setDefaultShippingAddress: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `${SHIPPING_ADDRESS_URL}/${id}/default`,
        method: 'PATCH',
        credentials: 'include',
      }),
      invalidatesTags: ['ShippingAddress'],
    }),
  }),
});

export const {
  useGetUserShippingAddressesQuery,
  useCreateShippingAddressMutation,
  useUpdateShippingAddressMutation,
  useDeleteShippingAddressMutation,
  useSetDefaultShippingAddressMutation,
} = shippingAddressApiSlice;
