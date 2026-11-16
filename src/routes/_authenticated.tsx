import { createFileRoute } from "@tanstack/react-router"

import { AppFrame } from "@/components/app-frame"
import { requireAuthOrLanding } from "@/features/auth/lib/auth-gate"
import { useAuthStore } from "@/features/auth/stores/auth-store"
import { LandingPage } from "@/features/landing/components/landing-page"

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: requireAuthOrLanding,
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const user = useAuthStore((state) => state.user)
  if (!user) return <LandingPage />
  return <AppFrame />
}
