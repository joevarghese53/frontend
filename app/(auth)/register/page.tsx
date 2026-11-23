import { BrandPanel } from "@/components/auth/brandPanel"
import { RegisterForm } from "@/components/auth/registerForm"

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-6 py-10 dark:bg-black">
      <div className="w-full max-w-6xl overflow-hidden rounded-[40px] bg-white shadow-2xl dark:bg-neutral-900">
        <div className="grid min-h-180 lg:grid-cols-2">
          <BrandPanel />
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
