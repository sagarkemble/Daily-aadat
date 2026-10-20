import { createFileRoute } from "@tanstack/react-router"

import { AppFrame } from "@/components/app-frame"
import { requireAuth } from "@/features/auth/lib/auth-gate"

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: requireAuth,
  component: AppFrame,
})
