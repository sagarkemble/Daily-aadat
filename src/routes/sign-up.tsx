import { createFileRoute } from "@tanstack/react-router"

import { SignupForm } from "@/features/auth/components/sign-up-form"
import { requireGuest } from "@/features/auth/lib/auth-gate"

export const Route = createFileRoute("/sign-up")({
  beforeLoad: requireGuest,
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  )
}
