"use client"

import { useState, type FormEvent } from "react"
import { Clock3, Mail, MessageCircle, Send } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSubmitContactMessageMutation } from "@/redux/api/contactApiSlice"

export default function ContactUsPage() {
  const [submitContactMessage, { isLoading }] =
    useSubmitContactMessageMutation()
  const [submitError, setSubmitError] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const topic = String(formData.get("topic") ?? "")
    if (
      topic !== "order" &&
      topic !== "custom" &&
      topic !== "returns" &&
      topic !== "other"
    ) {
      setSubmitError("Please select a topic.")
      return
    }

    try {
      await submitContactMessage({
        firstName: String(formData.get("firstName") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
        email: String(formData.get("email") ?? ""),
        topic,
        message: String(formData.get("message") ?? ""),
      }).unwrap()

      form.reset()
      setSubmitError("")
      toast.success("Message sent", {
        description: "Thanks for reaching out. We’ll get back to you soon.",
      })
    } catch (error) {
      console.error("Could not submit contact message:", error)
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "We couldn't send your message. Please try again."
      setSubmitError(message)
      toast.error("Message not sent", { description: message })
    }
  }

  return (
    <div className="mx-auto min-h-svh max-w-375 px-5 pt-32 pb-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-zinc-500">
            CONTACT US
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Let&apos;s talk.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Have a question about an order, a custom design, or our products?
            Send us a message and our team will help.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                <Mail size={20} />
              </div>
              <h2 className="font-semibold">Email us</h2>
              <p className="mt-1 text-sm text-zinc-500">support@flowstate.com</p>
            </div>

            {/* <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                <MapPin size={20} />
              </div>
              <h2 className="font-semibold">Visit us</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-500">
                24, Creative Quarter
                <br />
                Kochi, Kerala 682001
              </p>
            </div> */}

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                <Clock3 size={20} />
              </div>
              <h2 className="font-semibold">Working hours</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Monday–Saturday, 10:00 AM–6:00 PM
              </p>
            </div>
          </aside>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-7 flex items-center gap-3">
              <MessageCircle className="text-zinc-400" size={22} />
              <h2 className="text-xl font-semibold">Send a message</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                First name
                <Input
                  name="firstName"
                  placeholder="Your first name"
                  autoComplete="given-name"
                  maxLength={80}
                  required
                  className="h-12 rounded-xl"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Last name
                <Input
                  name="lastName"
                  placeholder="Your last name"
                  autoComplete="family-name"
                  maxLength={80}
                  required
                  className="h-12 rounded-xl"
                />
              </label>
            </div>

            <label className="mt-5 grid gap-2 text-sm font-medium">
              Email address
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={254}
                required
                className="h-12 rounded-xl"
              />
            </label>

            <label className="mt-5 grid gap-2 text-sm font-medium">
              What can we help with?
              <select
                name="topic"
                defaultValue=""
                required
                className="h-12 w-full rounded-xl border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="" disabled>
                  Select a topic
                </option>
                <option value="order">Order support</option>
                <option value="custom">Custom designs</option>
                <option value="returns">Returns and cancellations</option>
                <option value="other">Something else</option>
              </select>
            </label>

            <label className="mt-5 grid gap-2 text-sm font-medium">
              Message
              <Textarea
                name="message"
                placeholder="Tell us how we can help..."
                maxLength={5000}
                required
                className="min-h-36 resize-none rounded-xl"
              />
            </label>

            {submitError && (
              <p className="mt-4 text-sm text-destructive" role="alert">
                {submitError}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="mt-6 h-12 w-full rounded-xl sm:w-auto"
            >
              {isLoading ? "Sending…" : "Send message"}
              {!isLoading && <Send size={16} />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
