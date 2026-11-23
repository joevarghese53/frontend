"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Check, Eye, EyeOff, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useResetPasswordMutation } from "@/redux/api/usersApiSlice"

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message
  }

  return "Could not reset your password. The link may have expired."
}

function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const router = useRouter()

  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ]
  const isPasswordStrong = requirements.every((requirement) => requirement.met)
  const passwordsMatch =
    password.length > 0 && password === confirmPassword

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!token) {
      toast.error("This password reset link is invalid.")
      return
    }

    if (!isPasswordStrong) {
      toast.error("Please meet all password requirements.")
      return
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match.")
      return
    }

    try {
      await resetPassword({ token, newPassword: password }).unwrap()
      toast.success("Your password has been reset. Please log in.")
      router.replace("/login")
    } catch (error: unknown) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="flex items-center justify-center px-8 py-12 lg:px-16">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold tracking-tight">
          Create a new password
        </h1>
        <p className="mt-3 text-neutral-500">
          Choose a strong password you haven&apos;t used before.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="reset-password"
              className="mb-2 block text-sm font-medium"
            >
              New password
            </label>
            <div className="flex items-center rounded-2xl border px-4 py-3.5">
              <Lock
                aria-hidden="true"
                className="mr-3 h-5 w-5 shrink-0 text-neutral-400"
              />
              <input
                id="reset-password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a strong password"
                minLength={8}
                required
                className="w-full bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff
                    aria-hidden="true"
                    className="h-5 w-5 text-neutral-400"
                  />
                ) : (
                  <Eye
                    aria-hidden="true"
                    className="h-5 w-5 text-neutral-400"
                  />
                )}
              </button>
            </div>
            <ul
              className="mt-3 grid grid-cols-1 gap-1 text-xs sm:grid-cols-2"
              aria-label="Password requirements"
            >
              {requirements.map((requirement) => (
                <li
                  key={requirement.label}
                  className={`flex items-center gap-1.5 ${
                    requirement.met
                      ? "text-green-700 dark:text-green-400"
                      : "text-neutral-500"
                  }`}
                >
                  <Check
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 ${
                      requirement.met ? "opacity-100" : "opacity-30"
                    }`}
                  />
                  {requirement.label}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label
              htmlFor="reset-confirm-password"
              className="mb-2 block text-sm font-medium"
            >
              Confirm new password
            </label>
            <div className="flex items-center rounded-2xl border px-4 py-3.5">
              <Lock
                aria-hidden="true"
                className="mr-3 h-5 w-5 shrink-0 text-neutral-400"
              />
              <input
                id="reset-confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                minLength={8}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="mt-2 text-xs text-destructive" role="alert">
                Passwords do not match.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isPasswordStrong || !passwordsMatch}
            className="w-full rounded-2xl bg-black py-4 text-lg font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
          >
            {isLoading ? "Resetting password…" : "Reset password"}
          </button>

          <p className="text-center text-sm text-neutral-500">
            Need another link?{" "}
            <Link
              href="/forgot-password"
              className="font-semibold text-black dark:text-white"
            >
              Request a new one
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export { ResetPasswordForm }
