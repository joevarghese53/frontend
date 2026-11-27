import { apiSlice } from "./apiSlice"
import { CONTACT_URL } from "../constants"

export type ContactMessageInput = {
  firstName: string
  lastName: string
  email: string
  topic: "order" | "custom" | "returns" | "other"
  message: string
}

type ContactMessageResponse = {
  success: boolean
  message: string
  id: string
}

export type ContactMessageTopic = ContactMessageInput["topic"]

export type ContactMessage = {
  _id: string
  firstName: string
  lastName: string
  email: string
  topic: ContactMessageTopic
  message: string
  isCompleted: boolean
  completedAt: string | null
  notificationSent: boolean
  createdAt: string
  updatedAt: string
}

export const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitContactMessage: builder.mutation<
      ContactMessageResponse,
      ContactMessageInput
    >({
      query: (body) => ({
        url: CONTACT_URL,
        method: "POST",
        body,
      }),
    }),
    getContactMessages: builder.query<ContactMessage[], void>({
      query: () => `${CONTACT_URL}/admin`,
      providesTags: ["ContactMessage"],
    }),
    updateContactMessageStatus: builder.mutation<
      ContactMessage,
      { id: string; isCompleted: boolean }
    >({
      query: ({ id, isCompleted }) => ({
        url: `${CONTACT_URL}/admin/${id}`,
        method: "PATCH",
        body: { isCompleted },
      }),
      invalidatesTags: ["ContactMessage"],
    }),
  }),
})

export const {
  useGetContactMessagesQuery,
  useSubmitContactMessageMutation,
  useUpdateContactMessageStatusMutation,
} = contactApiSlice
