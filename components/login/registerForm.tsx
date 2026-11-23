"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  UserRound,
} from "lucide-react"
import {
  useInitiateRegistrationMutation,
  useRegisterMutation,
} from "@/redux/api/usersApiSlice"
import {
  useReSendOtpEmailMutation,
  useVerifyEmailOtpMutation,
} from "@/redux/api/emailOtpSlice"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

function getErrorMessage(error: unknown, fallback: string) {
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

  return fallback
}

function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"details" | "otp">("details")
  const [emailVerified, setEmailVerified] = useState(false)
  const [initiateRegistration, { isLoading: isInitiating }] =
    useInitiateRegistrationMutation()
  const [verifyEmailOtp, { isLoading: isVerifying }] =
    useVerifyEmailOtpMutation()
  const [resendOtp, { isLoading: isResending }] = useReSendOtpEmailMutation()
  const [register, { isLoading: isRegistering }] = useRegisterMutation()
  const router = useRouter()
  const isLoading = isInitiating || isVerifying || isRegistering
  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ]
  const passwordStrength = passwordRequirements.filter(
    (requirement) => requirement.met
  ).length
  const isPasswordStrong = passwordStrength === passwordRequirements.length

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      if (step === "details") {
        if (!isPasswordStrong) {
          toast.error("Please meet all password requirements.")
          return
        }

        if (password !== confirmPassword) {
          toast.error("Passwords do not match")
          return
        }

        await initiateRegistration({
          username: name.trim(),
          email: email.trim(),
          password,
        }).unwrap()
        setOtp("")
        setEmailVerified(false)
        setStep("otp")
        toast.success("Verification code sent to your email.")
        return
      }

      if (!emailVerified) {
        await verifyEmailOtp({ email: email.trim(), otp }).unwrap()
        setEmailVerified(true)
      }

      await register({
        username: name.trim(),
        email: email.trim(),
        password,
      }).unwrap()
      toast.success("Account created. You can now log in.")
      router.push("/login")
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Registration failed. Please try again.")
      )
    }
  }

  const handleResendOtp = async () => {
    try {
      await resendOtp({ email: email.trim() }).unwrap()
      setOtp("")
      setEmailVerified(false)
      toast.success("A new verification code has been sent.")
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Could not resend the code. Please try again.")
      )
    }
  }

  return (
    <div className="flex items-center justify-center px-8 py-12 lg:px-16">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold tracking-tight">
          {step === "details" ? "Create your account" : "Verify your email"}
        </h1>
        <p className="mt-3 text-neutral-500">
          {step === "details"
            ? "Join Flow State and start designing your own style."
            : `Enter the verification code sent to ${email.trim()}.`}
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {step === "otp" ? (
            <>
              <div>
                <label
                  htmlFor="register-otp"
                  className="mb-2 block text-sm font-medium"
                >
                  Verification code
                </label>
                <input
                  id="register-otp"
                  type="text"
                  name="otp"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="Enter your code"
                  required
                  className="w-full rounded-2xl border bg-transparent px-4 py-3.5 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !otp.trim()}
                className="w-full rounded-2xl bg-black py-4 text-lg font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 dark:bg-white dark:text-black"
              >
                {isVerifying
                  ? "Verifying..."
                  : isRegistering
                    ? "Creating account..."
                    : "Verify and create account"}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="inline-flex items-center gap-1 text-neutral-500 hover:text-black dark:hover:text-white"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading || isResending}
                  className="font-semibold text-black disabled:opacity-60 dark:text-white"
                >
                  {isResending ? "Sending..." : "Resend code"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-2 block text-sm font-medium"
                >
                  Full name
                </label>
                <div className="flex items-center rounded-2xl border px-4 py-3.5">
                  <UserRound
                    aria-hidden="true"
                    className="mr-3 h-5 w-5 shrink-0 text-neutral-400"
                  />
                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="register-email"
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
                    id="register-email"
                    type="email"
                    name="email"
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
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>
                <div className="flex items-center rounded-2xl border px-4 py-3.5">
                  <Lock
                    aria-hidden="true"
                    className="mr-3 h-5 w-5 shrink-0 text-neutral-400"
                  />
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    minLength={8}
                    required
                    className="w-full bg-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="text-neutral-400"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" className="h-5 w-5" />
                    ) : (
                      <Eye aria-hidden="true" className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div
                    className="mt-3"
                    role="status"
                    aria-live="polite"
                    aria-label={`Password strength: ${
                      passwordStrength === 5
                        ? "strong"
                        : passwordStrength >= 3
                          ? "medium"
                          : passwordStrength > 0
                            ? "weak"
                            : "not set"
                    }`}
                >
                    <div className="mb-2 flex gap-1.5" aria-hidden="true">
                      {passwordRequirements.map((requirement, index) => (
                        <span
                          key={requirement.label}
                          className={`h-1.5 flex-1 rounded-full ${
                            index < passwordStrength
                              ? passwordStrength === 5
                                ? "bg-green-600"
                                : passwordStrength >= 3
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                              : "bg-neutral-200 dark:bg-neutral-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mb-2 text-xs text-neutral-500">
                      {passwordStrength === 5
                        ? "Strong password"
                        : passwordStrength >= 3
                          ? "Medium password"
                          : passwordStrength > 0
                            ? "Weak password"
                            : "Use a strong password"}
                    </p>
                    <ul className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
                      {passwordRequirements.map((requirement) => (
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
              </div>

              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirm password
                </label>
                <div className="flex items-center rounded-2xl border px-4 py-3.5">
                  <Lock
                    aria-hidden="true"
                    className="mr-3 h-5 w-5 shrink-0 text-neutral-400"
                  />
                  <input
                    id="register-confirm-password"
                    type="password"
                    name="confirm-password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter your password"
                    minLength={8}
                    required
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-black py-4 text-lg font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 dark:bg-white dark:text-black"
              >
                {isInitiating ? "Sending verification code..." : "Continue"}
              </button>

              <p className="text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-black dark:text-white"
                >
                  Log in
                </Link>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export { RegisterForm }
