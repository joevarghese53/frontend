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
  }),
})

export const { useSubmitContactMessageMutation } = contactApiSlice
