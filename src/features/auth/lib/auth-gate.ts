import { redirect } from "@tanstack/react-router"
import { useAuthStore } from "../stores/auth-store"

function getAuth() {
  return useAuthStore.getState()
}

export function requireAuth() {
  const { user, isPasswordRecovery } = getAuth()
  if (!user) throw redirect({ to: "/sign-in" })
  if (isPasswordRecovery) throw redirect({ to: "/reset-password" })
}

// For the authenticated layout — guests on "/" see the landing page instead
export function requireAuthOrLanding({
  location,
}: {
  location: { pathname: string }
}) {
  const { user, isPasswordRecovery } = getAuth()

  if (!user && !isPasswordRecovery && location.pathname === "/") return
  requireAuth()
}

// For /sign-in, /sign-up
export function requireGuest() {
  const { user, isPasswordRecovery } = getAuth()

  if (isPasswordRecovery) throw redirect({ to: "/reset-password" })
  if (user) throw redirect({ to: "/" })
}

// For /reset-password
export function requirePasswordRecovery() {
  const { isPasswordRecovery } = getAuth()
  if (!isPasswordRecovery) throw redirect({ to: "/sign-in" })
}

// For /forgot-password — allow logged-out OR recovery
export function requireGuestOrRecovery() {
  const { user, isPasswordRecovery } = getAuth()

  if (user && !isPasswordRecovery) throw redirect({ to: "/" })
}
