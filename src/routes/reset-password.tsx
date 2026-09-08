import { createFileRoute } from "@tanstack/react-router"

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"
import { requirePasswordRecovery } from "@/features/auth/lib/auth-gate"

export const Route = createFileRoute("/reset-password")({
  beforeLoad: requirePasswordRecovery,
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm />
      </div>
    </div>
  )
}
