import { createFileRoute } from "@tanstack/react-router"
import { DayPage } from "@/features/day-plan/components/day-page"

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <DayPage />
}
