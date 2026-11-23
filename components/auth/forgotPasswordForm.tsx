"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Mail } from "lucide-react"
import { toast } from "sonner"
import { useResetPasswordLinkMutation } from "@/redux/api/usersApiSlice"

function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [requestReset, { isLoading }] = useResetPasswordLinkMutation()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await requestReset({ email: email.trim() }).unwrap()
      toast.success(
        "If an account exists for that email, a password reset link will be sent."
      )
    } catch {
      toast.error("Could not request a password reset. Please try again.")
    }
  }

  return (
    <div className="flex items-center justify-center px-8 py-12 lg:px-16">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold tracking-tight">Reset your password</h1>
        <p className="mt-3 text-neutral-500">
          Enter your account email and we&apos;ll send a reset link if it exists.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="reset-email"
              className="mb-2 block text-sm font-medium"
            >
              Email address
            </label>
            <div className="flex items-center rounded-2xl border px-4 py-3.5">
              <Mail
                aria-hidden="true"
                className="mr-3 h-5 w-5 shrink-0 text-neutral-400"
              />
              <input
                id="reset-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-black py-4 text-lg font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
          >
            {isLoading ? "Sending…" : "Send reset link"}
          </button>

          <p className="text-center text-sm text-neutral-500">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-black dark:text-white"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export { ForgotPasswordForm }
