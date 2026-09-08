import { createFileRoute } from "@tanstack/react-router"

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"
import { requireGuestOrRecovery } from "@/features/auth/lib/auth-gate"

export const Route = createFileRoute("/forgot-password")({
  beforeLoad: requireGuestOrRecovery,
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
