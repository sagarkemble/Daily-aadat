import App from "@/App"
import { requireAuth } from "@/features/auth/lib/auth-gate"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  beforeLoad: requireAuth,
  component: RouteComponent,
})

function RouteComponent() {
  return <App />
}
