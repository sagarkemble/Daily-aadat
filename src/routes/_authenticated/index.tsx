import { createFileRoute } from "@tanstack/react-router"
import { DayPage } from "@/features/day-plan/components/day-page"
import { isValidDate, todayDate } from "@/features/day-plan/lib/dates"

type DaySearch = {
  date?: string
}

export const Route = createFileRoute("/_authenticated/")({
  validateSearch: (search: Record<string, unknown>): DaySearch => {
    const date = typeof search.date === "string" ? search.date : undefined
    if (!date || !isValidDate(date)) return {}
    return { date }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { date } = Route.useSearch()
  const today = todayDate()
  const planDate = date ?? today

  return (
    <DayPage
      key={planDate}
      planDate={planDate}
      onDateChange={(nextDate) => {
        void navigate({
          search: nextDate === today ? {} : { date: nextDate },
        })
      }}
    />
  )
}
