import { useFetchDayPlan } from "../hooks/use-fetch-day-plan"
import { DayPageHeader } from "./day-page-header"
import { SLOTS } from "@/features/templates/types/slots"
import DaySlot from "./day-slot"

type DayPageProps = {
  date: string
}

const DayPage = ({ date }: DayPageProps) => {
  const { data, isLoading, error } = useFetchDayPlan(date)
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return (
    <div className="flex flex-col gap-4">
      <DayPageHeader date={date} isPlanned={data != null} />
      {SLOTS.map((slot) => (
        <DaySlot
          key={slot}
          slot={slot}
          activities={data?.activities[slot] || []}
        />
      ))}
    </div>
  )
}

export { DayPage }
