import { BrandPanel } from "@/components/login/brandPanel"
import { LoginForm } from "@/components/login/loginForm"

export default function Page() {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-black flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl overflow-hidden rounded-[40px] bg-white shadow-2xl dark:bg-neutral-900">

        <div className="grid min-h-180 lg:grid-cols-2">

          <BrandPanel />

          <LoginForm />

        </div>

      </div>
    </div>
  )
}
