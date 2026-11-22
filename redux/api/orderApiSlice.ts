import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderDetailsResponse,
  PaymentInitiationRequest,
  PaymentInitiationResponse,
} from "@/types/orderType";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
      invalidatesTags: ['Order'],
    }),

    getOrderDetails: builder.query<OrderDetailsResponse, string>({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      providesTags: ['Order'],
    }),

    getMyOrders: builder.query<CreateOrderResponse[], void>({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Order'],
    }),

    getAllOrders: builder.query<CreateOrderResponse[], void>({
      query: () => ({
        url: `${ORDERS_URL}/admin/all`,
      }),
      providesTags: ['Order'],
    }),

    deleteOrder: builder.mutation<unknown, string>({
      query: (orderId) => ({
        url: `${ORDERS_URL}/admin/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Order'],
    }),

    payForOrder: builder.mutation<
      PaymentInitiationResponse,
      PaymentInitiationRequest
    >({
      query: (data) => ({
        url: `${ORDERS_URL}/initiate-payment`,
        method: "POST",
        body: data,
      }),
    }),

    deliveredOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/delivered`,
        method: "PUT",
      }),
      invalidatesTags: ['Order'],
    }),

    confirmOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/confirm`,
        method: "PUT",
      }),
      invalidatesTags: ['Order'],
    }),

    shippedOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/shipped`,
        method: "PUT",
      }),
      invalidatesTags: ['Order'],
    }),

    outForDeliveryOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/out-for-delivery`,
        method: "PUT",
      }),
      invalidatesTags: ['Order'],
    }),

    getTotalOrdersByDate: builder.query({
      query: () => `${ORDERS_URL}/total-orders`,
      providesTags: ['Order'],
    }),

    getTotalSales: builder.query({
      query: () => `${ORDERS_URL}/total-sales`,
      providesTags: ['Order'],
    }),
    getTotalProductsSold: builder.query({
      query: () => `${ORDERS_URL}/total-products-sold`,
      providesTags: ['Order'],
    }),
    getTotalSalesByDate: builder.query({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useGetTotalOrdersByDateQuery,
  useGetTotalSalesQuery,
  useGetTotalProductsSoldQuery,
  useGetTotalSalesByDateQuery,
  // ------------------
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetMyOrdersQuery,
  useDeliveredOrderMutation,
  useConfirmOrderMutation,
  useShippedOrderMutation,
  useOutForDeliveryOrderMutation,
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
  usePayForOrderMutation,
} = orderApiSlice;
