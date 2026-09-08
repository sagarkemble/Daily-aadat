import { createFileRoute } from "@tanstack/react-router"

import { SigninForm } from "@/features/auth/components/sign-in-form"
import { requireGuest } from "@/features/auth/lib/auth-gate"

export const Route = createFileRoute("/sign-in")({
  beforeLoad: requireGuest,
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SigninForm />
      </div>
    </div>
  )
}
