"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useLoginMutation } from "@/redux/api/usersApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/state/auth/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const res = await login({
        email,
        password,
      }).unwrap();

      dispatch(setCredentials(res));

      localStorage.setItem(
        "userInfo",
        JSON.stringify(res)
      );

      toast.success("Logged in successfully");

      router.push("/");
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="flex items-center justify-center px-8 py-12 lg:px-16">
      <div className="w-full max-w-md">

        <h1 className="text-5xl font-bold tracking-tight">
          Welcome back 👋
        </h1>

        <p className="mt-3 text-neutral-500">
          Login to your Flow State account
        </p>

        <form 
        className="mt-10 space-y-6"
        onSubmit={handleSubmit}
        >

          {/* Email */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email address
            </label>

            <div className="flex items-center rounded-2xl border px-4 py-4">
              <Mail className="mr-3 h-5 w-5 text-neutral-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Password */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <div className="flex items-center rounded-2xl border px-4 py-4">
              <Lock className="mr-3 h-5 w-5 text-neutral-400" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-neutral-400" />
                ) : (
                  <Eye className="h-5 w-5 text-neutral-400" />
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
            className="w-full rounded-2xl bg-black py-4 text-lg font-semibold text-white transition hover:scale-[1.02]"
          >
            Log In
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-neutral-500 dark:bg-neutral-900">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center rounded-2xl border py-4 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Continue with Google
          </button>

          <button
            type="button"
            className="flex w-full items-center justify-center rounded-2xl border py-4 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Continue with Apple
          </button>

          <p className="text-center text-sm text-neutral-500">
            Don't have an account?{" "}
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
  );
}

export { LoginForm };