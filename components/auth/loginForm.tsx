"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { setCredentials } from "@/redux/state/auth/authSlice"
import { useLoginMutation } from "@/redux/api/usersApiSlice"

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

  return "Login failed. Please check your details and try again."
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.")
      return
    }

    try {
      const user = await login({ email: email.trim(), password }).unwrap()
      dispatch(setCredentials(user))
      toast.success("Logged in successfully.")
      router.push("/")
    } catch (error: unknown) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="flex items-center justify-center px-8 py-12 lg:px-16">
      <div className="w-full max-w-md">
        <h1 className="text-5xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-3 text-neutral-500">
          Login to your Flow State account
        </p>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-medium"
            >
              Email address
            </label>
            <div className="flex items-center rounded-2xl border px-4 py-4">
              <Mail
                aria-hidden="true"
                className="mr-3 h-5 w-5 text-neutral-400"
              />
              <input
                id="login-email"
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

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>
            <div className="flex items-center rounded-2xl border px-4 py-4">
              <Lock
                aria-hidden="true"
                className="mr-3 h-5 w-5 text-neutral-400"
              />
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
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
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-neutral-500 hover:text-black dark:hover:text-white"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-black py-4 text-lg font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isLoading ? "Logging in…" : "Log In"}
          </button>

          <p className="text-center text-sm text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-black dark:text-white"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export { LoginForm }
