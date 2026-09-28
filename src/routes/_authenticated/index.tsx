import { createFileRoute } from "@tanstack/react-router"
import { DayPage } from "@/features/day-plan/components/day-page"
import { z } from "zod"

const searchSchema = z.object({
  date: z.iso.date().optional(),
})

export const Route = createFileRoute("/_authenticated/")({
  validateSearch: searchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  let { date } = Route.useSearch()
  if (!date) date = new Date().toISOString().split("T")[0]
  console.log("date", date)
  return <DayPage date={date} />
}
